"use client";

/**
 * A digital business card (app/card/*). One object, lit like a product
 * shot: a slab of smoked glass (pearl in the light theme) with the brand
 * mark engraved into it, the name catching the light as it turns.
 *
 *   Card     follows the pointer, or the phone's tilt where the browser
 *            allows it without a prompt, and floats on its own otherwise.
 *            Tap, or swipe it like a real card, to turn it over to the QR
 *            code. The turn is a spring, so it keeps the swipe's momentum
 *            and can be caught and reversed mid-air.
 *   Save     the contact file, under an edge of moving light.
 *   Dock     call, email, LinkedIn: a capsule of glass with a lens that
 *            slides to the control under the finger or pointer.
 *
 * Each face is its own 3D-transformed element (no preserve-3d), so each
 * keeps its backdrop blur. All motion goes through CSS variables written on
 * one frame loop. Reduced motion (the OS or the site's toggle): the card
 * sits still and turns over at once.
 *
 * The phone number, email and contact file arrive sealed (./seal.ts) and
 * are unsealed on the visitor's first touch, click or key press, so the
 * page as served, or as a bot sees it after loading, holds none of them.
 * Until then their lines are blank and their links lead nowhere; a press
 * that somehow comes first unseals and follows the link itself. Without
 * scripting the card shows, but call, email and save do not work.
 * Styles: app/card/card.css.
 */
import { useEffect, useRef, useState } from "react";
import { Brandmark, Wordmark } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/ui/icon";
import { unseal } from "./seal";

interface Contact {
  phone: string;
  phoneLabel: string;
  email: string;
  /** Contact file (.vcf), with the base path. */
  vcard: string;
}

export interface CardPerson {
  name: string;
  title: string;
  org: string;
  location: string;
  linkedin: string;
  linkedinLabel: string;
  /** Phone, email and contact file, each sealed with ./seal.ts. */
  sealed: Contact;
  /** QR code image that opens this card, with the base path. */
  qr: string;
  /** The brand mark as a mask image, with the base path. */
  markMask: string;
  urlLabel: string;
}

const open = (s: Contact): Contact => ({
  phone: unseal(s.phone),
  phoneLabel: unseal(s.phoneLabel),
  email: unseal(s.email),
  vcard: unseal(s.vcard),
});

/* What a visitor does first (never a page's own script, nor hovering). */
const FIRST_TOUCH = ["pointerdown", "touchstart", "keydown"] as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const RAD = Math.PI / 180;

/* The card is light: a quick spring with only a little overshoot. */
const SPRING = { k: 140, c: 17 };
/** Degrees of turn per pixel of swipe. */
const SWIPE = 0.6;

export function BusinessCard({ person: p }: { person: CardPerson }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const [back, setBack] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef(0);
  const [contact, setContact] = useState<Contact | null>(null);
  const sealed = p.sealed;

  useEffect(() => {
    if (contact) return;
    const reveal = (e: Event) => {
      if (e.isTrusted) setContact(open(sealed));
    };
    const opts = { capture: true, passive: true } as const;
    for (const t of FIRST_TOUCH) window.addEventListener(t, reveal, opts);
    return () => {
      for (const t of FIRST_TOUCH) window.removeEventListener(t, reveal, opts);
    };
  }, [contact, sealed]);

  /* A press that reached a link before anything unsealed it (a screen
     reader's activation can arrive as a bare click). */
  const follow = (e: React.MouseEvent, to: (c: Contact) => string) => {
    if (contact) return;
    e.preventDefault();
    const c = open(sealed);
    setContact(c);
    window.location.href = to(c);
  };

  useEffect(() => {
    const card = stage.current;
    const pad = hit.current;
    const page = root.current;
    if (!card || !pad || !page) return;
    const html = document.documentElement;
    const still = () => html.dataset.motion === "reduce";

    /* Turn (about Y, unbounded: 0 front, 180 back, 360 front…) on a spring;
       tilt on top of it, eased toward the pointer, the phone or the float. */
    const s = {
      turn: still() ? 0 : -28,
      vel: 0,
      target: 0,
      rx: still() ? 0 : 9,
      ry: 0,
      dragRx: 0,
    };
    let pointer: { x: number; y: number } | null = null;
    let gyro: { x: number; y: number } | null = null;
    let drag: {
      id: number;
      x0: number;
      y0: number;
      turn0: number;
      lastX: number;
      lastT: number;
      moved: boolean;
    } | null = null;
    let suppressClick = false;
    let showingBack = false;

    const write = () => {
      const total = s.turn + s.ry;
      const sin = Math.sin(total * RAD);
      const cos = Math.cos(total * RAD);
      const rx = s.rx + s.dragRx;
      card.style.setProperty("--vc-rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--vc-ry", `${total.toFixed(2)}deg`);
      // Where the light sits on the glass, and how edge-on the card is.
      card.style.setProperty("--vc-gx", `${(50 + sin * 115).toFixed(1)}%`);
      card.style.setProperty("--vc-gy", `${(28 - rx * 4).toFixed(1)}%`);
      card.style.setProperty("--vc-edge", (1 - Math.abs(cos)).toFixed(3));
      card.style.setProperty("--vc-cos", Math.abs(cos).toFixed(3));
      card.style.setProperty("--vc-sin", sin.toFixed(3));
      const b = Math.round(s.turn / 180) % 2 !== 0;
      if (b !== showingBack) {
        showingBack = b;
        setBack(b);
      }
    };

    const flip = (dir: 1 | -1 = 1) => {
      s.target = (Math.round(s.target / 180) + dir) * 180;
      if (still() || !running) {
        s.turn = s.target;
        s.vel = 0;
        write();
      }
    };

    /* Pointer over the page (mouse) tilts the card toward it. */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || drag) return;
      const r = card.getBoundingClientRect();
      pointer = {
        x: clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.9), -1, 1),
        y: clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 1.4), -1, 1),
      };
    };
    const onLeave = () => {
      pointer = null;
    };

    /* Swiping the card turns it, the way you would turn a real one. */
    const onDown = (e: PointerEvent) => {
      if (still() || (e.pointerType === "mouse" && e.button !== 0)) return;
      suppressClick = false;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, turn0: s.turn, lastX: e.clientX, lastT: e.timeStamp, moved: false };
      s.vel = 0;
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;
      if (!drag.moved && Math.hypot(dx, dy) > 6) {
        drag.moved = true;
        pad.setPointerCapture(e.pointerId);
      }
      if (!drag.moved) return;
      const dt = Math.max(1, e.timeStamp - drag.lastT) / 1000;
      const v = ((e.clientX - drag.lastX) * SWIPE) / dt;
      s.vel = s.vel * 0.6 + v * 0.4;
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
      s.turn = drag.turn0 + dx * SWIPE;
      s.dragRx = clamp(-dy * 0.12, -16, 16);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        suppressClick = true;
        // Where the swipe was heading, at most one face away.
        const from = Math.round(drag.turn0 / 180) * 180;
        const thrown = s.turn + s.vel * 0.18;
        s.target = clamp(Math.round(thrown / 180) * 180, from - 180, from + 180);
      }
      s.dragRx = 0;
      drag = null;
    };
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        e.preventDefault();
        return;
      }
      flip(1);
    };

    /* Phone tilt, where it needs no permission prompt (Android). iOS asks
       first; the card floats on its own there instead. */
    let base: { b: number; g: number } | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      base.b += (e.beta - base.b) * 0.02;
      base.g += (e.gamma - base.g) * 0.02;
      gyro = { x: clamp((e.gamma - base.g) / 18, -1, 1), y: clamp((e.beta - base.b) / 18, -1, 1) };
    };
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown } | undefined;
    const useGyro = !!DOE && typeof DOE.requestPermission !== "function";

    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;

      if (!drag?.moved) {
        // Semi-implicit Euler on the turn spring.
        const a = SPRING.k * (s.target - s.turn) - SPRING.c * s.vel;
        s.vel += a * dt;
        s.turn += s.vel * dt;
      }

      const src = drag?.moved ? null : (pointer ?? gyro);
      const tx = src ? -src.y * 9 : Math.sin(t * 0.6) * 2.6;
      const ty = src ? src.x * 13 : Math.sin(t * 0.43 + 1.1) * 5;
      const ease = 1 - Math.exp(-dt * 5);
      s.rx += (tx - s.rx) * ease;
      s.ry += (ty - s.ry) * ease;

      write();
      raf = requestAnimationFrame(frame);
    };

    pad.addEventListener("click", onClick);
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      window.addEventListener("pointermove", onMove, { passive: true });
      html.addEventListener("pointerleave", onLeave);
      pad.addEventListener("pointerdown", onDown);
      pad.addEventListener("pointermove", onDrag);
      pad.addEventListener("pointerup", onUp);
      pad.addEventListener("pointercancel", onUp);
      if (useGyro) window.addEventListener("deviceorientation", onOrient);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      html.removeEventListener("pointerleave", onLeave);
      pad.removeEventListener("pointerdown", onDown);
      pad.removeEventListener("pointermove", onDrag);
      pad.removeEventListener("pointerup", onUp);
      pad.removeEventListener("pointercancel", onUp);
      window.removeEventListener("deviceorientation", onOrient);
      drag = null;
      s.turn = s.target;
      s.vel = 0;
      s.rx = s.ry = s.dragRx = 0;
      write();
    };
    const sync = () => (still() ? stop() : start());
    sync();
    if (!running) write();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mo.disconnect();
      stop();
      pad.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(savedTimer.current), []);

  const onSave = () => {
    setSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div ref={root} className="vc-root">
      <div className="vc-scene">
        <div ref={stage} className="vc-stage">
          {/* Light the card throws on the surface below it. */}
          <div className="vc-floor" aria-hidden="true" />

          <div className="vc-face vc-front">
            <Engraving mask={p.markMask} />
            <div className="vc-glare" aria-hidden="true" />
            <div className="vc-shade" aria-hidden="true" />
            <div className="vc-front-top">
              <span className="vc-logo" role="img" aria-label={p.org}>
                <Brandmark className="vc-logo-mark" />
                <Wordmark className="vc-logo-word" />
              </span>
              <span className="vc-place">{p.location}</span>
            </div>
            <div className="vc-front-id">
              <h1 className="vc-name">{p.name}</h1>
              <p className="vc-title">{p.title}</p>
            </div>
          </div>

          <div className="vc-face vc-back" aria-hidden={!back}>
            <Engraving mask={p.markMask} />
            <div className="vc-glare" aria-hidden="true" />
            <div className="vc-shade" aria-hidden="true" />
            <div className="vc-qr">
              {/* A plain <img>: the site is a static export. */}
              <img src={p.qr} alt={`QR code that opens ${p.name}'s card`} width={160} height={160} />
            </div>
            <div className="vc-back-text">
              <p className="vc-kicker">Scan to connect</p>
              <ul className="vc-lines">
                <li>{contact?.phoneLabel ?? "\u00a0"}</li>
                <li>{contact?.email ?? "\u00a0"}</li>
                <li>{p.linkedinLabel}</li>
              </ul>
              <p className="vc-url">{p.urlLabel}</p>
            </div>
          </div>

          <button
            ref={hit}
            type="button"
            className="vc-hit"
            aria-pressed={back}
            aria-label="Show QR code"
          />
        </div>

        <p className="vc-hint" aria-hidden="true">
          {back ? "Scan the code to open this card" : "Tap or swipe the card to turn it over"}
        </p>
      </div>

      <div className="vc-actions">
        <a
          href={contact?.vcard ?? "#"}
          type="text/vcard"
          className="vc-save"
          data-saved={saved ? "" : undefined}
          onClick={(e) => {
            follow(e, (c) => c.vcard);
            onSave();
          }}
        >
          <span className="vc-save-halo" aria-hidden="true" />
          <span className="vc-save-ring" aria-hidden="true" />
          <span className="vc-save-body">
            <span className="vc-save-avatar" aria-hidden="true">
              <Brandmark className="vc-save-mark" />
            </span>
            <span className="vc-save-text">
              <span className="vc-save-title">Save contact</span>
              <span className="vc-save-sub">Phone, email and LinkedIn</span>
            </span>
            <span className="vc-save-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path className="vc-plus-v" d="M12 6v12" />
                <path className="vc-plus-h" d="M6 12h12" />
                <path className="vc-check" d="M6.5 12.5l3.6 3.6L17.5 8.5" pathLength={1} />
              </svg>
            </span>
          </span>
        </a>

        <Dock
          items={[
            {
              href: contact ? `tel:${contact.phone}` : "#",
              onClick: (e) => follow(e, (c) => `tel:${c.phone}`),
              icon: "phone",
              label: "Call",
              aria: contact ? `Call ${contact.phoneLabel}` : "Call",
            },
            {
              href: contact ? `mailto:${contact.email}` : "#",
              onClick: (e) => follow(e, (c) => `mailto:${c.email}`),
              icon: "mail",
              label: "Email",
              aria: contact ? `Email ${contact.email}` : "Email",
            },
            { href: p.linkedin, icon: "linkedin", label: "LinkedIn", aria: `LinkedIn: ${p.linkedinLabel}`, external: true },
          ]}
        />
      </div>
    </div>
  );
}

/** The brand mark, engraved: a recess with a lit edge that moves with the light. */
function Engraving({ mask }: { mask: string }) {
  return <div className="vc-engrave" aria-hidden="true" style={{ "--vc-mask": `url("${mask}")` } as React.CSSProperties} />;
}

interface DockItem {
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  icon: IconName;
  label: string;
  aria: string;
  external?: boolean;
}

/**
 * Three round controls in one capsule of glass. A lens of brighter glass
 * slides on a spring to whichever control is under the pointer, or the
 * finger while it is down, and lifts its label above it.
 */
function Dock({ items }: { items: DockItem[] }) {
  const [lens, setLens] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const bar = useRef<HTMLUListElement>(null);

  const indexAt = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect();
    if (!r) return null;
    return clamp(Math.floor(((clientX - r.left) / r.width) * items.length), 0, items.length - 1);
  };

  return (
    <ul
      ref={bar}
      className="vc-dock"
      style={{ "--vc-lens": lens ?? 1, "--vc-n": items.length } as React.CSSProperties}
      data-lens={lens !== null ? "" : undefined}
      data-pressed={pressed ? "" : undefined}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" || pressed) setLens(indexAt(e.clientX));
      }}
      onPointerLeave={() => {
        setLens(null);
        setPressed(false);
      }}
      onPointerDown={(e) => {
        setPressed(true);
        setLens(indexAt(e.clientX));
      }}
      onPointerUp={(e) => {
        setPressed(false);
        if (e.pointerType !== "mouse") window.setTimeout(() => setLens(null), 420);
      }}
      onPointerCancel={() => {
        setPressed(false);
        setLens(null);
      }}
    >
      {items.map((it, i) => (
        <li key={it.label} className="vc-dock-item" data-on={lens === i ? "" : undefined}>
          <a
            href={it.href}
            aria-label={it.aria}
            className="vc-dock-btn"
            onClick={it.onClick}
            onFocus={() => setLens(i)}
            onBlur={() => setLens(null)}
            {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon name={it.icon} size={24} />
            <span className="vc-dock-label" aria-hidden="true">
              {it.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
