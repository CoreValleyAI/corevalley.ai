"use client";

/**
 * <SectionLight> — the light behind a section's glass (home, below the
 * hero). It mounts the section-light scene (components/gl/scenes/
 * section-light.ts) behind the section's content, in the shared "glass"
 * pool: at most three alive at once, each released when it is far from the
 * viewport. The scene draws the section's `[data-glass-panel]` panes as the
 * hero's glass, made of one soft light that follows the pointer.
 *
 * Where it can't or shouldn't run — no WebGL2, a slow device or Save-Data,
 * more contrast, forced colours, or `?glass=css` — the panes keep their CSS
 * glass over a still, soft light instead. Reduced transparency (often an
 * OS-wide "transparency effects" switch) is treated as the hero's glass
 * treats it: the scene's glass already holds text contrast pixel by pixel.
 *
 * `span="scroll"`: inside a horizontal scroller (the carousel), the light
 * spans everything that scrolls, so the panes' glass moves with them on the
 * compositor.
 */
import { useEffect, useRef, useSyncExternalStore } from "react";
import { GLStage } from "@/components/gl/gl-stage";
import { cn } from "@/lib/cn";

const QUERIES = ["(prefers-contrast: more)", "(forced-colors: active)"];

function subscribe(cb: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  for (const l of lists) l.addEventListener("change", cb);
  return () => {
    for (const l of lists) l.removeEventListener("change", cb);
  };
}

/** The same first guess at quality as lib/gl/stage.ts (Tier 1 keeps CSS). */
function capable() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  return (nav.deviceMemory ?? 8) > 3 && (nav.hardwareConcurrency ?? 8) > 4;
}

function allowed() {
  if (QUERIES.some((q) => window.matchMedia(q).matches)) return false;
  if (new URLSearchParams(window.location.search).get("glass") === "css") return false;
  return capable();
}

export function useSceneGlass() {
  return useSyncExternalStore(subscribe, allowed, () => false);
}

const load = () => import("@/components/gl/scenes/section-light").then((m) => m.createSectionLightScene);

export function SectionLight({ className, span }: { className?: string; span?: "scroll" }) {
  const gl = useSceneGlass();
  const ref = useRef<HTMLDivElement>(null);

  // Inside a scroller, the light spans all of what scrolls.
  useEffect(() => {
    const el = ref.current;
    const track = el?.parentElement;
    if (span !== "scroll" || !el || !track) return;
    const size = () => {
      el.style.width = `${track.scrollWidth}px`;
      el.style.height = `${track.clientHeight}px`;
    };
    const ro = new ResizeObserver(size);
    ro.observe(track);
    for (const c of Array.from(track.children)) if (c !== el) ro.observe(c);
    size();
    return () => ro.disconnect();
  }, [span]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("section-light pointer-events-none absolute -z-10", span === "scroll" ? "top-0 left-0" : "inset-0", className)}
    >
      {gl ? (
        <GLStage
          load={load}
          fade={false}
          pool="glass"
          release="200% 0px"
          maxPixels={2_500_000}
          followScroll
          pointerTarget={(canvas) => canvas.closest("section")}
          onShown={(shown) => {
            const el = ref.current;
            if (!el) return;
            el.dataset.gl = shown ? "on" : "off";
            // Without the scene, its panes go back to CSS glass.
            const host = el.closest<HTMLElement>("[data-glass-host]") ?? el.closest("section");
            if (!shown && host) for (const p of host.querySelectorAll<HTMLElement>("[data-glass]")) delete p.dataset.glass;
          }}
        />
      ) : (
        <div className="section-light__still absolute inset-0" />
      )}
    </div>
  );
}
