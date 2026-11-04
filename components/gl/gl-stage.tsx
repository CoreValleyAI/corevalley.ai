"use client";

/**
 * <GLStage> — a canvas that hosts one WebGL scene (lib/gl/stage.ts), filling
 * its positioned parent. It waits until the canvas is within a screen or so
 * of the viewport (scenes far down the page cost nothing at load), then
 * until the page has painted and the browser is idle, loads the scene's
 * code, and fades the canvas in over whatever poster sits beneath it once
 * the first frame is drawn. Without WebGL2 nothing is drawn and the poster
 * simply stays.
 *
 * Stages that come in numbers (the light behind each section's glass) can
 * share a `pool`: at most three of a pool are alive at once, they mount one
 * at a time and never mid-fling, and each one `release`s its context when
 * it is far from the viewport, remounting on a fresh canvas when it comes
 * back near (a canvas that has lost its context cannot get another).
 *
 * The canvas is decorative (aria-hidden): the meaning lives in the DOM.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { SceneFactory, Stage } from "@/lib/gl/stage";
import { readFinger, scrollVelocity } from "@/lib/motion/input";

/* ── Pools ──────────────────────────────────────────────────────────────── */

interface PoolEntry {
  canvas: HTMLCanvasElement;
  release: () => void;
  born: number;
}

const POOLS = new Map<string, Set<PoolEntry>>();
const POOL_CAP = 3;
/** Pooled mounts run one after another, each in its own idle moment. */
let mountQueue: Promise<void> = Promise.resolve();

/** Make room in a full pool: release the live stage farthest off screen. */
function evict(pool: string) {
  const set = POOLS.get(pool);
  if (!set || set.size < POOL_CAP) return;
  const vh = window.innerHeight;
  const now = performance.now();
  let worst: PoolEntry | null = null;
  let worstD = -1;
  for (const e of set) {
    if (now - e.born < 2000) continue;
    const r = e.canvas.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh) continue;
    const d = r.top >= vh ? r.top - vh : -r.bottom;
    if (d > worstD) {
      worstD = d;
      worst = e;
    }
  }
  worst?.release();
}

type IdleWindow = Window & {
  requestIdleCallback?: Window["requestIdleCallback"];
  cancelIdleCallback?: Window["cancelIdleCallback"];
};

/** After first paint, when the main thread is free (LCP is never delayed).
    Safari has no requestIdleCallback; a short timeout stands in. */
function whenIdle(fn: () => void): () => void {
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    const h = w.requestIdleCallback(fn, { timeout: 1200 });
    return () => w.cancelIdleCallback?.(h);
  }
  const h = window.setTimeout(fn, 300);
  return () => window.clearTimeout(h);
}

/** A finger down, or a fast scroll: not the moment to build a context. */
const busy = () => readFinger().down || Math.abs(scrollVelocity()) > 600;

export function GLStage({
  load,
  className,
  progress,
  pointerTarget,
  onStage,
  onShown,
  fade = true,
  pool,
  release,
  maxPixels,
  maxDpr,
  followScroll,
}: {
  /** Dynamic import of the scene, so its code loads only when needed. */
  load: () => Promise<SceneFactory>;
  className?: string;
  /** Subscribe the stage to a progress source (scroll); returns an unsubscribe. */
  progress?: (set: (p: number) => void) => () => void;
  /** Pointer events over this element (an id, or found from the canvas) light the scene. */
  pointerTarget?: string | ((canvas: HTMLCanvasElement) => HTMLElement | null);
  onStage?: (stage: Stage | null) => void;
  /** The first frame is on screen (or the stage gave up, or was released: false). */
  onShown?: (shown: boolean) => void;
  /** Fade the canvas in over 1.2 s (false: it shows with its first frame). */
  fade?: boolean;
  /** Share a cap on live stages with others of the same pool. */
  pool?: string;
  /** Release the context beyond this distance (an IntersectionObserver rootMargin). */
  release?: string;
  maxPixels?: number;
  maxDpr?: number;
  followScroll?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);
  // A new canvas after each release.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let stage: Stage | null = null;
    let offProgress: (() => void) | null = null;
    let cancelled = false;
    let released = false;
    let started = false;
    let far = false;
    let entry: PoolEntry | null = null;
    let cancelIdle: (() => void) | null = null;
    // This stage's turn in the mount queue: always ended, even by an unmount
    // mid-wait, or every pooled stage after it would wait for ever.
    let endTurn: (() => void) | null = null;

    const doRelease = () => {
      if (released || cancelled) return;
      released = true;
      setShown(false);
      onShown?.(false);
      setGeneration((g) => g + 1); // the cleanup below disposes this stage
    };

    const start = async () => {
      if (cancelled || far) return;
      started = true;
      const [{ Stage }, factory] = await Promise.all([import("@/lib/gl/stage"), load()]);
      if (cancelled) return;
      const target =
        typeof pointerTarget === "function"
          ? (pointerTarget(canvas) ?? undefined)
          : pointerTarget
            ? (document.getElementById(pointerTarget) ?? undefined)
            : undefined;
      if (pool) {
        evict(pool);
        entry = { canvas, release: doRelease, born: performance.now() };
        if (!POOLS.has(pool)) POOLS.set(pool, new Set());
        POOLS.get(pool)!.add(entry);
      }
      stage = new Stage(canvas, factory, {
        pointerTarget: target,
        maxPixels,
        maxDpr,
        followScroll,
        onReady: () => {
          canvas.dataset.live = "";
          setShown(true);
          onShown?.(true);
        },
        onFail: () => {
          delete canvas.dataset.live;
          setShown(false);
          onShown?.(false);
        },
      });
      onStage?.(stage);
      if (progress) offProgress = progress((p) => stage?.setProgress(p));
      await stage.mount();
    };

    const schedule = () => {
      if (!pool) {
        cancelIdle = whenIdle(() => void start());
        return;
      }
      mountQueue = mountQueue.then(
        () =>
          new Promise<void>((done) => {
            endTurn = done;
            const attempt = () => {
              if (cancelled || far) return done();
              if (busy()) {
                const t = window.setTimeout(attempt, 250);
                cancelIdle = () => window.clearTimeout(t);
                return;
              }
              cancelIdle = whenIdle(() => {
                start()
                  .catch(() => {})
                  .finally(done);
              });
            };
            attempt();
          }),
      );
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        near.disconnect();
        schedule();
      },
      { rootMargin: "120% 0px" },
    );
    near.observe(canvas);

    let away: IntersectionObserver | null = null;
    if (release) {
      away = new IntersectionObserver(
        ([e]) => {
          far = !e?.isIntersecting;
          // Far away: give the context back. If it never started, the next
          // approach schedules it again on a fresh canvas.
          if (far && (stage || started)) doRelease();
        },
        { rootMargin: release },
      );
      away.observe(canvas);
    }

    return () => {
      cancelled = true;
      near.disconnect();
      away?.disconnect();
      cancelIdle?.();
      endTurn?.();
      offProgress?.();
      stage?.dispose();
      delete canvas.dataset.live;
      if (entry && pool) POOLS.get(pool)?.delete(entry);
      onStage?.(null);
    };
    // The scene is chosen once per mount (and once per canvas after a release).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  return (
    <canvas
      key={generation}
      ref={ref}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full",
        fade && "transition-opacity duration-[1200ms] ease-out",
        fade && !shown ? "opacity-0" : "opacity-100",
        className,
      )}
    />
  );
}
