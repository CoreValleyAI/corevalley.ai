"use client";

/**
 * Thin client frames for server-rendered drawings. They only set data
 * attributes and a CSS variable on one wrapper element; the drawing inside
 * stays server markup, and CSS does the rest.
 *
 *  <PlayFrame>    data-play while on screen (loops run only then)
 *  <ScrollSteps>  --step from 0 to `steps` as the content is read, latched,
 *                 plus data-play while on screen. Without JS or with
 *                 reduced motion there is no data-armed, so the CSS shows
 *                 the finished state.
 */
import { useRef, type ComponentProps } from "react";
import type { Mode } from "@/lib/motion/scroll";
import { usePlay, useScrollSteps } from "@/lib/motion/hooks";

export function PlayFrame({ threshold, ...props }: ComponentProps<"div"> & { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, threshold);
  return <div {...props} ref={ref} />;
}

export function ScrollSteps({
  steps,
  mode,
  from,
  to,
  ...props
}: ComponentProps<"div"> & { steps: number; mode?: Mode; from?: number; to?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, 0.1);
  useScrollSteps(ref, steps, { mode, from, to });
  return <div {...props} ref={ref} />;
}
