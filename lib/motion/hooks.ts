"use client";

/**
 * Small hooks the home-page drawings share. Both take the caller's ref, so
 * one element can be played and stepped at once.
 *
 *  usePlay        sets data-play on the element while it is on screen, so
 *                 its CSS loops run only when someone can see them. Off,
 *                 live, when the visitor switches to reduced motion.
 *  useScrollSteps writes how far a drawing has been read (--step, a whole
 *                 number from 0 to `steps`) as it scrolls through the
 *                 viewport, and latches: a step once reached stays reached.
 *                 Until it runs (no JS) and under reduced motion the
 *                 element carries no data-armed, and the CSS shows the
 *                 finished drawing.
 */
import { useEffect, type RefObject } from "react";
import { trackScroll, segment, type Mode } from "@/lib/motion/scroll";
import { useMotionPref } from "@/lib/theme";

export function usePlay(ref: RefObject<HTMLElement | null>, threshold = 0.25) {
  const motion = useMotionPref();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motion === "reduce") {
      delete el.dataset.play;
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) el.dataset.play = "";
        else delete el.dataset.play;
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, motion, threshold]);
}

export function useScrollSteps(
  ref: RefObject<HTMLElement | null>,
  steps: number,
  { mode = "center", from = 0, to = 1 }: { mode?: Mode; from?: number; to?: number } = {},
) {
  const motion = useMotionPref();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motion === "reduce") {
      delete el.dataset.armed;
      el.style.removeProperty("--step");
      return;
    }
    let best = -1;
    let finished = false;
    // trackScroll calls back once before it returns, so hold the unsubscribe
    // in a box the callback can read once it exists.
    const stop: { off?: () => void } = {};
    el.dataset.armed = "";
    stop.off = trackScroll(
      el,
      mode,
      (p) => {
        const k = Math.min(steps, Math.floor(segment(p, from, to) * steps + 0.0001));
        if (k <= best) return;
        best = k;
        el.style.setProperty("--step", String(k));
        if (k >= steps) {
          finished = true;
          stop.off?.();
        }
      },
      0,
    );
    if (finished) stop.off();
    return () => stop.off?.();
  }, [ref, motion, steps, mode, from, to]);
}
