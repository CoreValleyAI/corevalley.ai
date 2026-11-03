/**
 * The draughting kit every technical drawing on the site shares, so they
 * read as one set (05 §6): line weights 1.0 / 0.8 / 0.6, dashed lines for
 * what is hidden or not yours to run, hydro for what is live, mono
 * uppercase callouts, and a title block that says what the drawing is.
 *
 *  Flow        a quiet line with a hydro pulse marching along it
 *  Callout     a leader from a point on the drawing to its label
 *  TitleBlock  the drawing's name, what it shows, "not to scale"
 *  MiniGpu     the H200 NVL card from above, small: board, bracket, edge,
 *              voltage regulation and the package (die + six HBM stacks).
 *              `slices` splits the die into MIG instances and lights `lit`
 *              of them. No ids, so any number can share a page.
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

export function TitleBlock({
  x,
  y,
  w = 180,
  title,
  lines,
}: {
  x: number;
  y: number;
  w?: number;
  title: string;
  lines: string[];
}) {
  const h = 22 + lines.length * 11;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-none stroke-line-strong" strokeWidth="0.8" />
      <line x1={x} y1={y + 16} x2={x + w} y2={y + 16} className="stroke-line-strong" strokeWidth="0.6" />
      <text x={x + 8} y={y + 11.5} className="fill-ink-2 font-mono text-[9px] font-semibold tracking-[0.12em] uppercase">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 8} y={y + 28 + i * 11} className="fill-ink-3 font-mono text-[7.5px] tracking-[0.1em] uppercase">
          {l}
        </text>
      ))}
    </g>
  );
}

/**
 * The H200 NVL card from above, drawn at `w` units wide (height = w × 0.56)
 * with its top-left corner at (x, y).
 */
export function MiniGpu({
  x,
  y,
  w = 120,
  slices,
  lit,
  className,
}: {
  x: number;
  y: number;
  w?: number;
  /** Split the die into this many MIG instances. */
  slices?: number;
  /** How many instances (or, without slices, whether the die) are lit. */
  lit?: number;
  className?: string;
}) {
  const k = w / 120;
  /** Scale to the card's size, rounded so the markup stays small. */
  const s = (n: number) => r2(n * k);
  const X = (n: number) => r2(x + n * k);
  const Y = (n: number) => r2(y + n * k);
  const box = (bx: number, by: number, bw: number, bh: number) => `M${X(bx)} ${Y(by)}h${s(bw)}v${s(bh)}h${-s(bw)}z`;

  // Repeated parts as single paths: exhaust slots, edge fingers, voltage
  // regulation, HBM stacks, compute clusters.
  let slots = "";
  for (let i = 0; i < 6; i++) slots += box(2.5, 8 + i * 8, 3, 5);
  let fingers = "";
  for (let fx = 14; fx <= 76; fx += 3) if (fx < 36 || fx > 40) fingers += box(fx, 60, 1.6, 4);
  let vrm = "";
  for (let i = 0; i < 6; i++) vrm += box(18 + i * 5.2, 12, 3.6, 3.6);
  let hbm = "";
  for (let r = 0; r < 3; r++) hbm += box(43, 19.4 + r * 7.6, 7, 6.4) + box(76, 19.4 + r * 7.6, 7, 6.4);
  let clusters = "";
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) clusters += box(53.6 + c * 4.9, 20.6 + r * 10.2, 4, 8.6);

  const n = slices ?? 0;
  const dieLit = slices ? 0 : (lit ?? 1);
  return (
    <g className={cn("mini-gpu", className)}>
      {/* Bracket with exhaust slots */}
      <rect x={X(0)} y={Y(2)} width={s(8)} height={s(60)} rx={s(1)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.8" />
      <path d={slots} className="fill-none stroke-ink-4" strokeWidth="0.5" />
      {/* Board, PCIe edge and its fingers, the removed cooler's footprint */}
      <rect x={X(8)} y={Y(4)} width={s(108)} height={s(56)} rx={s(2)} className="fill-bg-raised stroke-line-strong" strokeWidth="1" />
      <path d={fingers} className="fill-ink-4" opacity="0.6" />
      <rect x={X(12)} y={Y(8)} width={s(100)} height={s(48)} rx={s(2)} className="fill-none stroke-ink-4" strokeWidth="0.6" strokeDasharray="2.5 2.5" />
      {/* Voltage regulation and the power connector */}
      <path d={vrm} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.6" />
      <rect x={X(102)} y={Y(7)} width={s(10)} height={s(5)} rx={s(0.8)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.6" />
      {/* Package: substrate, six HBM stacks, the die */}
      <rect x={X(40)} y={Y(15)} width={s(46)} height={s(30)} rx={s(1.5)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.8" />
      <path d={hbm} className="fill-bg-raised stroke-hydro" strokeWidth="0.6" />
      {n > 0 ? (
        Array.from({ length: n }, (_, i) => {
          const sw = 22 / n;
          return (
            <rect
              key={i}
              x={X(52 + i * sw + 0.3)}
              y={Y(19)}
              width={s(sw - 0.6)}
              height={s(22)}
              rx={s(0.5)}
              className={cn("mini-gpu__slice", i < (lit ?? 0) ? "fill-hydro" : "fill-bg-raised stroke-line-strong")}
              strokeWidth="0.5"
            />
          );
        })
      ) : (
        <rect
          x={X(52)}
          y={Y(19)}
          width={s(22)}
          height={s(22)}
          rx={s(1)}
          className={cn("mini-gpu__die", dieLit ? "fill-hydro" : "fill-bg-raised stroke-line-strong")}
          strokeWidth="0.6"
        />
      )}
      {/* Compute clusters on a lit die */}
      {!n && dieLit ? <path d={clusters} className="fill-none stroke-on-hydro" strokeWidth="0.45" opacity="0.7" /> : null}
    </g>
  );
}

/** Two decimals: enough for any drawing, and short in the markup. */
function r2(n: number) {
  return Math.round(n * 100) / 100;
}
