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
  const s = (n: number) => n * k;
  const board = { x: x + s(8), y: y + s(4), w: s(108), h: s(56) };
  const die = { x: x + s(52), y: y + s(19), w: s(22), h: s(22) };
  const hbm = [0, 1, 2].flatMap((r) => [
    { x: die.x - s(9), y: die.y + s(r * 7.6) + s(0.4) },
    { x: die.x + die.w + s(2), y: die.y + s(r * 7.6) + s(0.4) },
  ]);
  const fingers: number[] = [];
  for (let fx = s(14); fx <= s(76); fx += s(3)) if (fx < s(36) || fx > s(40)) fingers.push(fx);
  const n = slices ?? 0;
  const dieLit = slices ? 0 : (lit ?? 1);
  return (
    <g className={cn("mini-gpu", className)}>
      {/* Bracket with exhaust slots */}
      <rect x={x} y={y + s(2)} width={s(8)} height={s(60)} rx={s(1)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={x + s(2.5)} y={y + s(8 + i * 8)} width={s(3)} height={s(5)} rx={s(1)} className="fill-none stroke-ink-4" strokeWidth="0.5" />
      ))}
      {/* Board, PCIe edge and its gold fingers */}
      <rect x={board.x} y={board.y} width={board.w} height={board.h} rx={s(2)} className="fill-bg-raised stroke-line-strong" strokeWidth="1" />
      {fingers.map((fx) => (
        <rect key={fx} x={x + fx} y={board.y + board.h} width={s(1.6)} height={s(4)} className="fill-ink-4" opacity="0.6" />
      ))}
      {/* Cooler footprint, removed */}
      <rect x={board.x + s(4)} y={board.y + s(4)} width={board.w - s(8)} height={board.h - s(8)} rx={s(2)} className="fill-none stroke-ink-4" strokeWidth="0.6" strokeDasharray="2.5 2.5" />
      {/* Voltage regulation */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={board.x + s(10 + i * 5.2)} y={board.y + s(8)} width={s(3.6)} height={s(3.6)} rx={s(0.6)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.6" />
      ))}
      {/* Power connector */}
      <rect x={board.x + board.w - s(14)} y={board.y + s(3)} width={s(10)} height={s(5)} rx={s(0.8)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.6" />
      {/* Package: substrate, six HBM stacks, the die */}
      <rect x={die.x - s(12)} y={die.y - s(4)} width={die.w + s(24)} height={die.h + s(8)} rx={s(1.5)} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.8" />
      {hbm.map((h, i) => (
        <rect key={i} x={h.x} y={h.y} width={s(7)} height={s(6.4)} rx={s(0.6)} className="fill-bg-raised stroke-hydro" strokeWidth="0.6" />
      ))}
      {n > 0 ? (
        Array.from({ length: n }, (_, i) => {
          const sw = die.w / n;
          return (
            <rect
              key={i}
              x={die.x + i * sw + s(0.3)}
              y={die.y}
              width={sw - s(0.6)}
              height={die.h}
              rx={s(0.5)}
              className={cn("mini-gpu__slice", i < (lit ?? 0) ? "fill-hydro" : "fill-bg-raised stroke-line-strong")}
              strokeWidth="0.5"
            />
          );
        })
      ) : (
        <rect
          x={die.x}
          y={die.y}
          width={die.w}
          height={die.h}
          rx={s(1)}
          className={cn("mini-gpu__die", dieLit ? "fill-hydro" : "fill-bg-raised stroke-line-strong")}
          strokeWidth="0.6"
        />
      )}
      {/* Compute clusters on a lit die */}
      {!n && dieLit
        ? [0, 1].flatMap((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}${c}`}
                x={die.x + s(1.6 + c * 4.9)}
                y={die.y + s(1.6 + r * 10.2)}
                width={s(4)}
                height={s(8.6)}
                rx={s(0.4)}
                className="fill-none stroke-on-hydro"
                strokeWidth="0.45"
                opacity="0.7"
              />
            )),
          )
        : null}
    </g>
  );
}
