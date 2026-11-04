"use client";

/**
 * usePlay sets data-play on the caller's element while it is on screen, so
 * its CSS loops run only when someone can see them — off, live, when the
 * visitor switches to reduced motion. Shared by the use-case pictures and
 * the home page's small drawings.
 */
import { useEffect, type RefObject } from "react";
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
