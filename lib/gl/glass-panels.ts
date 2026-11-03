/**
 * The DOM panes a scene draws as glass (lib/gl/glass.ts): every
 * `[data-glass-panel]` inside a host, measured into the canvas's drawing
 * buffer, with how each is painted (its entrance fade), whether it is under
 * the hand (lift, on links and buttons only), and the hand-off that lets
 * its CSS glass step aside (`data-glass="gl"`, app/styles/glass.css).
 *
 * Measuring is the costly part, so it happens only when something can have
 * moved: a resize, the fonts arriving, a scroll inside the host (a
 * carousel), or a transition or animation on a pane or one of its
 * ancestors (an entrance, a hover lift) — and then each frame until it
 * ends. Page scrolling costs nothing: the canvas scrolls with the panes.
 * All reads happen at the start of a frame; nothing is written but the
 * hand-off.
 */
import type { GlassRect, GlassStyle } from "./glass";

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PanelKind = "clear" | "hydro";

export interface PanelsOptions {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  invalidate: () => void;
  /** Panes that answer the hand (hover, focus, press). */
  interactive?: string;
  /** Only panes inside this box (client px) are drawn: the visible part of
      a scroller, give or take one card. */
  cull?: () => DOMRect | null;
}

const TRACK_CAP = 2000; // ms: no transition is followed longer than this
const TRACK_TAIL = 60; // ms after one ends

export function createPanels(o: PanelsOptions) {
  const { canvas, host, invalidate } = o;
  const interactive = o.interactive ?? "a[href], button, .lg-card";
  const els = Array.from(host.querySelectorAll<HTMLElement>("[data-glass-panel]"));
  const kinds: PanelKind[] = els.map((el) => (el.dataset.glassPanel === "hydro" ? "hydro" : "clear"));
  const lifts = els.map(() => 0);
  const canLift = els.map((el) => el.matches(interactive));
  let radii: number[] = [];
  let rects: (GlassRect | null)[] = [];
  let opacities = els.map(() => 1);
  let drawn: Box | null = null;
  let dirty = true;
  let radiiDirty = true;
  let trackUntil = 0;
  const running = new Set<string>();
  let handed = false;

  const mark = () => {
    dirty = true;
    invalidate();
  };
  const relevant = (t: EventTarget | null) => {
    if (!(t instanceof Element)) return false;
    // A pane, or something that carries panes (an entrance, a lift). What
    // moves inside a pane (its own drawings) does not move the pane.
    return els.some((el) => el === t || t.contains(el));
  };
  // One key per element and property (or animation) in flight.
  const ids = new WeakMap<Element, number>();
  let nextId = 0;
  const key = (e: Event) => {
    const t = e.target as Element;
    let id = ids.get(t);
    if (id === undefined) ids.set(t, (id = nextId++));
    const name = e instanceof TransitionEvent ? e.propertyName : e instanceof AnimationEvent ? e.animationName : "";
    return `${id}:${name}`;
  };
  const onStart = (e: Event) => {
    if (!relevant(e.target)) return;
    running.add(key(e));
    trackUntil = Math.max(trackUntil, performance.now() + TRACK_CAP);
    mark();
  };
  const onEnd = (e: Event) => {
    if (!relevant(e.target)) return;
    running.delete(key(e));
    if (!running.size) trackUntil = performance.now() + TRACK_TAIL;
    mark();
  };
  const onScroll = (e: Event) => {
    if (e.target instanceof Node && e.target !== document && host.contains(e.target)) {
      trackUntil = Math.max(trackUntil, performance.now() + 150);
      mark();
    }
  };
  const onHand = () => invalidate();

  host.addEventListener("transitionrun", onStart, true);
  host.addEventListener("animationstart", onStart, true);
  host.addEventListener("transitionend", onEnd, true);
  host.addEventListener("transitioncancel", onEnd, true);
  host.addEventListener("animationend", onEnd, true);
  host.addEventListener("animationcancel", onEnd, true);
  host.addEventListener("scroll", onScroll, { capture: true, passive: true });
  for (const t of ["pointerover", "pointerout", "pointerdown", "pointerup", "focusin", "focusout"] as const) {
    host.addEventListener(t, onHand, { passive: true });
  }
  const ro = new ResizeObserver(() => {
    radiiDirty = true;
    mark();
  });
  ro.observe(host);
  for (const el of els) ro.observe(el);
  void document.fonts?.ready.then(mark);

  /** An element's opacity as painted: its own times its ancestors' (to the host). */
  const paintedOpacity = (el: HTMLElement) => {
    let v = 1;
    for (let n: HTMLElement | null = el; n && n !== host; n = n.parentElement) {
      v *= parseFloat(getComputedStyle(n).opacity);
    }
    return Number.isFinite(v) ? v : 1;
  };

  const measure = () => {
    const c = canvas.getBoundingClientRect();
    if (!c.width || !c.height) {
      rects = els.map(() => null);
      return;
    }
    const k = canvas.width / c.width;
    if (radiiDirty) {
      radii = els.map((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
      radiiDirty = false;
    }
    const win = o.cull?.() ?? null;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    rects = els.map((el, i) => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return null;
      // Off the canvas, or out of the visible part of a scroller.
      if (b.right < c.left || b.left > c.right || b.bottom < c.top || b.top > c.bottom) return null;
      if (win && (b.right < win.left - b.width || b.left > win.right + b.width)) return null;
      const r: GlassRect = {
        cx: (b.left - c.left + b.width / 2) * k,
        cy: (b.top - c.top + b.height / 2) * k,
        hw: (b.width / 2) * k,
        hh: (b.height / 2) * k,
        r: radii[i]! * k,
      };
      x0 = Math.min(x0, r.cx - r.hw);
      y0 = Math.min(y0, r.cy - r.hh);
      x1 = Math.max(x1, r.cx + r.hw);
      y1 = Math.max(y1, r.cy + r.hh);
      return r;
    });
    drawn = Number.isFinite(x0) ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
    opacities = els.map((el, i) => (rects[i] ? paintedOpacity(el) : 0));
  };

  const handoff = (on: boolean) => {
    if (on === handed) return;
    handed = on;
    for (const el of els) {
      if (on) el.dataset.glass = "gl";
      else delete el.dataset.glass;
    }
  };

  return {
    els,
    /** Re-measure on the next frame (the canvas was resized). */
    markDirty() {
      dirty = true;
      radiiDirty = true;
    },

    /**
     * The panes to draw this frame, styled; `busy` asks for another frame
     * (something is still moving, fading in or lifting).
     */
    update(dt: number, style: (kind: PanelKind) => GlassStyle) {
      const now = performance.now();
      const tracking = now < trackUntil;
      if (dirty || tracking) {
        measure();
        dirty = false;
      }
      let lifting = false;
      const list: (GlassRect & GlassStyle)[] = [];
      for (let i = 0; i < els.length; i++) {
        const r = rects[i];
        if (!r) continue;
        if (canLift[i]) {
          const el = els[i]!;
          const want = el.matches(":active") ? 1 : el.matches(":hover, :focus-visible") ? 0.6 : 0;
          lifts[i] = lifts[i]! + (want - lifts[i]!) * (1 - Math.exp(-dt * 14));
          if (Math.abs(want - lifts[i]!) > 0.002) lifting = true;
          else lifts[i] = want;
        }
        const opacity = opacities[i]!;
        if (opacity <= 0.001) continue;
        list.push({ ...r, ...style(kinds[i]!), opacity, lift: lifts[i] });
      }
      return { list, busy: tracking || lifting };
    },

    /** The panes drawn last frame, as one box (drawing-buffer px). */
    bounds: () => drawn,

    handoff,

    dispose() {
      host.removeEventListener("transitionrun", onStart, true);
      host.removeEventListener("animationstart", onStart, true);
      host.removeEventListener("transitionend", onEnd, true);
      host.removeEventListener("transitioncancel", onEnd, true);
      host.removeEventListener("animationend", onEnd, true);
      host.removeEventListener("animationcancel", onEnd, true);
      host.removeEventListener("scroll", onScroll, { capture: true });
      for (const t of ["pointerover", "pointerout", "pointerdown", "pointerup", "focusin", "focusout"] as const) {
        host.removeEventListener(t, onHand);
      }
      ro.disconnect();
      handoff(false);
    },
  };
}
