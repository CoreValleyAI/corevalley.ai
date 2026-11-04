"use client";

/**
 * A thin client frame for server-rendered drawings: it only sets
 * data-play on one wrapper while that wrapper is on screen, so the
 * drawing's CSS loops run only when someone can see them. The drawing
 * inside stays server markup.
 */
import { useRef, type ComponentProps } from "react";
import { usePlay } from "@/lib/motion/hooks";

export function PlayFrame({ threshold, ...props }: ComponentProps<"div"> & { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, threshold);
  return <div {...props} ref={ref} />;
}
