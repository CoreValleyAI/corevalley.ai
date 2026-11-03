/**
 * The draughting kit every technical drawing on the site shares, so they
 * read as one set (05 §6): line weights 1.0 / 0.8 / 0.6, dashed lines for
 * what is hidden, hydro for what is live, and mono uppercase callouts.
 *
 *  Flow        a quiet line with a hydro pulse marching along it
 *  Callout     a leader from a point on the drawing to its label
 *
 * Server-safe: no hooks, no state. Everything is coloured by token classes,
 * so each drawing reads in both themes.
 */
import { cn } from "@/lib/cn";

export function Flow({ d, delay = 0, className }: { d: string; delay?: number; className?: string }) {
  return (
    <>
      <path d={d} className={cn("dp-link", className)} />
      <path d={d} className={cn("dp-flow", className)} style={{ "--d": `${delay}s` } as React.CSSProperties} />
    </>
  );
}

export function Callout({
  x1,
  y1,
  x2,
  y2,
  label,
  anchor = "middle",
  size = 8.5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  anchor?: "start" | "middle" | "end";
  /** Label size in viewBox units. */
  size?: number;
}) {
  const up = y2 < y1;
  return (
    <g>
      <polyline points={`${x1},${y1} ${x2},${y2}`} className="stroke-ink-4" strokeWidth="0.7" fill="none" />
      <circle cx={x1} cy={y1} r="1.5" className="fill-ink-3" />
      <text
        x={x2}
        y={up ? y2 - 5 : y2 + size + 1.5}
        textAnchor={anchor}
        className="fill-ink-3 font-mono tracking-[0.14em] uppercase"
        style={{ fontSize: size }}
      >
        {label}
      </text>
    </g>
  );
}
