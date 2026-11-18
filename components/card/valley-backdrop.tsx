"use client";

/**
 * The business card's backdrop: the real Kathmandu Valley as hairline
 * contours (public/gl/valley-contours.json, made by
 * scripts/build-valley-contours.mjs). Three copies of one drawing:
 *
 *   base   every line, faint, fading out toward the edges
 *   glow   the lines around the card, in green, breathing slowly
 *   lit    the lines inside a band of light that sweeps across the screen
 *
 * The copies after the first are <use> clones, so the path data is in the
 * page once. The sweep moves the band one way and its contents the other,
 * both on transforms, so nothing repaints per frame. Decorative; still
 * under reduced motion (no sweep, no breathing). Styles: app/card/card.css.
 */
import { useEffect, useState } from "react";
import { asset } from "@/lib/links";

interface ValleyArt {
  width: number;
  height: number;
  accent: number;
  levels: { lines: string[] }[];
}

export function ValleyBackdrop() {
  const [art, setArt] = useState<ValleyArt | null>(null);
  useEffect(() => {
    let live = true;
    fetch(asset("/gl/valley-contours.json"))
      .then((r) => r.json() as Promise<ValleyArt>)
      .then((a) => live && setArt(a))
      .catch(() => {
        /* no print: the plain stage stays */
      });
    return () => {
      live = false;
    };
  }, []);

  if (!art) return <div className="vc-valley" aria-hidden="true" />;
  const vb = `0 0 ${art.width} ${art.height}`;
  const copy = (cls: string) => (
    <svg className={cls} viewBox={vb} preserveAspectRatio="xMidYMid slice">
      <use href="#vc-valley-lines" />
    </svg>
  );
  return (
    <div className="vc-valley" aria-hidden="true">
      <svg className="vc-valley-base" viewBox={vb} preserveAspectRatio="xMidYMid slice">
        <g id="vc-valley-lines">
          {art.levels.map((l, i) => (
            <g key={i} data-accent={i === art.accent ? "" : undefined}>
              {l.lines.map((d, j) => (
                <path key={j} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          ))}
        </g>
      </svg>
      {copy("vc-valley-glow")}
      <div className="vc-sweep">
        <div className="vc-sweep-band">
          <div className="vc-sweep-inner">{copy("vc-valley-lit")}</div>
        </div>
      </div>
    </div>
  );
}
