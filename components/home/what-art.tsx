/**
 * The eight things running AI takes, each drawn as the real object in the
 * site's draughting language (components/system/drawing.tsx): a GPU card, a
 * server rack, power with backup, a chiller, a network switch, a locked
 * cage, the software stack and an operations desk. 120 × 72 units each.
 *
 * Status lights and live parts carry `what-led` / `what-live`, which the
 * CSS (app/styles/home.css) lights in hydro once the row is handed over to
 * CoreValley. Decorative: the row's text carries the meaning.
 */
import { MiniGpu } from "@/components/system/drawing";
import type { WhatPart } from "@/copy/en/home";

const frame = "fill-bg-raised stroke-line-strong";
const sunk = "fill-bg-sunken stroke-line-strong";

/** Repeated parts are drawn as one path each, so the markup stays small. */
const box = (x: number, y: number, w: number, h: number) => `M${r2(x)} ${r2(y)}h${w}v${h}h${-w}z`;
const dot = (x: number, y: number) => `M${r2(x)} ${r2(y)}h0`;
const r2 = (n: number) => Math.round(n * 100) / 100;

function Servers() {
  return (
    <>
      {/* Rack frame and rails */}
      <rect x="30" y="2" width="56" height="66" rx="2" className={frame} strokeWidth="1" />
      <line x1="34" y1="4" x2="34" y2="66" className="stroke-ink-4" strokeWidth="0.6" />
      <line x1="82" y1="4" x2="82" y2="66" className="stroke-ink-4" strokeWidth="0.6" />
      <path d={Array.from({ length: 8 }, (_, i) => box(36, 6 + i * 7.4, 44, 6.2)).join("")} className={sunk} strokeWidth="0.6" />
      <path
        d={Array.from({ length: 48 }, (_, n) => box(38 + (n % 6) * 4.4, 7 + Math.floor(n / 6) * 7.4, 3.4, 4.2)).join("")}
        className="fill-none stroke-ink-4"
        strokeWidth="0.45"
      />
      <path d={Array.from({ length: 8 }, (_, i) => `M66 ${r2(9.1 + i * 7.4)}h7`).join("")} className="stroke-ink-4" strokeWidth="0.45" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx="77" cy={r2(9.1 + i * 7.4)} r="0.95" className="what-led" style={{ "--k": i } as React.CSSProperties} />
      ))}
      {/* Power distribution strip */}
      <rect x="90" y="6" width="5" height="58" rx="1" className={sunk} strokeWidth="0.6" />
      <path d={Array.from({ length: 8 }, (_, i) => dot(92.5, 10 + i * 7)).join("")} className="stroke-ink-4" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="34" y1="70" x2="38" y2="70" className="stroke-line-strong" strokeWidth="1" />
      <line x1="78" y1="70" x2="82" y2="70" className="stroke-line-strong" strokeWidth="1" />
    </>
  );
}

function Power() {
  return (
    <>
      {/* Battery cabinet (UPS): display, cells, status */}
      <rect x="4" y="8" width="40" height="58" rx="2" className={frame} strokeWidth="1" />
      <rect x="9" y="13" width="30" height="9" rx="1" className={sunk} strokeWidth="0.6" />
      <polyline points="11,19 15,16 19,18 23,15 27,17 31,15 35,17" className="what-live fill-none" strokeWidth="0.7" />
      <path d={Array.from({ length: 12 }, (_, i) => box(9 + (i % 3) * 10.4, 26 + Math.floor(i / 3) * 9, 8.6, 7.2)).join("")} className={sunk} strokeWidth="0.55" />
      <path d={[0, 1, 2].map((i) => `M${r2(11 + i * 10.4)} 24.6h4`).join("")} className="stroke-ink-4" strokeWidth="0.6" />
      {/* Generator: body, radiator fins, exhaust, panel, skid */}
      <rect x="56" y="28" width="58" height="36" rx="2" className={frame} strokeWidth="1" />
      <path d={Array.from({ length: 9 }, (_, i) => `M${r2(92 + i * 2.4)} 32v28`).join("")} className="stroke-ink-4" strokeWidth="0.5" />
      <rect x="62" y="16" width="6" height="12" rx="0.8" className={sunk} strokeWidth="0.6" />
      <path d="M61 16 h8" className="stroke-line-strong" strokeWidth="0.8" />
      <rect x="62" y="34" width="22" height="13" rx="1" className={sunk} strokeWidth="0.6" />
      <circle cx="67" cy="40.5" r="2.6" className="fill-none stroke-ink-4" strokeWidth="0.6" />
      <circle cx="75" cy="40.5" r="1" className="what-led" />
      <circle cx="79" cy="40.5" r="1" className="fill-ink-4" />
      <line x1="62" y1="52" x2="84" y2="52" className="stroke-ink-4" strokeWidth="0.5" />
      <line x1="62" y1="56" x2="84" y2="56" className="stroke-ink-4" strokeWidth="0.5" />
      <rect x="54" y="64" width="62" height="3" rx="0.8" className={sunk} strokeWidth="0.6" />
      {/* The feed between them */}
      <path d="M44 52 C 50 52, 50 46, 56 46" className="what-live fill-none" strokeWidth="1" />
      <polyline points="49,40 47,44 50,44 48,48" className="what-live fill-none" strokeWidth="0.8" strokeLinejoin="round" />
    </>
  );
}

function Fan({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="15" className={sunk} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="11.5" className="fill-none stroke-ink-4" strokeWidth="0.45" strokeDasharray="1.5 1.5" />
      <g className="what-fan" style={{ transformOrigin: `${cx}px ${cy}px` } as React.CSSProperties}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            d={`M${cx} ${cy} C ${cx + 4} ${cy - 3}, ${cx + 10} ${cy - 4}, ${cx + 12} ${cy - 1} C ${cx + 8} ${cy + 1}, ${cx + 4} ${cy + 1}, ${cx} ${cy}`}
            transform={`rotate(${a} ${cx} ${cy})`}
            className="fill-bg-raised stroke-line-strong"
            strokeWidth="0.55"
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="2.4" className="fill-bg-raised stroke-line-strong" strokeWidth="0.6" />
    </g>
  );
}

function Cooling() {
  return (
    <>
      {/* Chiller: two fans over the coil, supply and return pipes */}
      <rect x="14" y="16" width="102" height="44" rx="3" className={frame} strokeWidth="1" />
      <path d={Array.from({ length: 24 }, (_, i) => `M${r2(18 + i * 4.1)} 56v3`).join("")} className="stroke-ink-4" strokeWidth="0.45" />
      <Fan cx={44} cy={36} />
      <Fan cx={86} cy={36} />
      <path d="M14 26 H2" className="what-live fill-none" strokeWidth="1.4" />
      <path d="M14 48 H2" className="fill-none stroke-ink-4" strokeWidth="1.4" />
      <polyline points="6,23.5 3,26 6,28.5" className="what-live fill-none" strokeWidth="0.7" />
      <polyline points="9,45.5 12,48 9,50.5" className="fill-none stroke-ink-4" strokeWidth="0.7" />
      <rect x="20" y="62" width="10" height="4" className={sunk} strokeWidth="0.6" />
      <rect x="100" y="62" width="10" height="4" className={sunk} strokeWidth="0.6" />
    </>
  );
}

function Network() {
  return (
    <>
      {/* Uplinks leaving the top */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${94 + i * 5} 28 C ${94 + i * 5} 16, ${100 + i * 4} 10, ${108 + i * 3} 2`}
          className={i < 2 ? "what-live fill-none" : "fill-none stroke-ink-4"}
          strokeWidth="0.8"
        />
      ))}
      {/* Chassis with rack ears */}
      <rect x="2" y="28" width="8" height="18" rx="1" className={sunk} strokeWidth="0.6" />
      <rect x="110" y="28" width="8" height="18" rx="1" className={sunk} strokeWidth="0.6" />
      <circle cx="6" cy="32" r="1" className="fill-none stroke-ink-4" strokeWidth="0.5" />
      <circle cx="6" cy="42" r="1" className="fill-none stroke-ink-4" strokeWidth="0.5" />
      <circle cx="114" cy="32" r="1" className="fill-none stroke-ink-4" strokeWidth="0.5" />
      <circle cx="114" cy="42" r="1" className="fill-none stroke-ink-4" strokeWidth="0.5" />
      <rect x="10" y="26" width="100" height="22" rx="1.5" className={frame} strokeWidth="1" />
      {/* Two rows of ports, each with a link light */}
      <path
        d={Array.from({ length: 24 }, (_, i) => box(14 + (i % 12) * 6.1, 31.6 + Math.floor(i / 12) * 8.4, 4.6, 4.4)).join("")}
        className={sunk}
        strokeWidth="0.5"
      />
      {/* Link lights: most ports up, a few idle */}
      {[true, false].map((up) => (
        <path
          key={String(up)}
          d={Array.from({ length: 24 }, (_, i) => i)
            .filter((i) => Boolean(((i % 12) * 5 + Math.floor(i / 12) * 3) % 4) === up)
            .map((i) => dot(16.3 + (i % 12) * 6.1, 30.4 + Math.floor(i / 12) * 8.4))
            .join("")}
          className={up ? "what-led-dots" : "stroke-ink-4"}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ))}
      {/* Four uplink ports */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={91 + i * 5} y="34" width="4" height="7" rx="0.5" className="fill-bg-sunken stroke-hydro" strokeWidth="0.6" />
      ))}
      {/* Patch cables to the servers below */}
      {[0, 2, 5, 9].map((c) => (
        <path
          key={c}
          d={`M${16.3 + c * 6.1} 48 C ${16.3 + c * 6.1} 58, ${24 + c * 5} 62, ${30 + c * 5} 70`}
          className="fill-none stroke-ink-4"
          strokeWidth="0.7"
        />
      ))}
    </>
  );
}

function Security() {
  let mesh = "";
  for (let x = 10; x <= 66; x += 5) mesh += `M${x} 6V66`;
  for (let y = 6; y <= 66; y += 5) mesh += `M8 ${y}H68`;
  return (
    <>
      {/* Cage panel and its mesh */}
      <rect x="6" y="4" width="64" height="64" rx="1.5" className="fill-bg-sunken stroke-line-strong" strokeWidth="1" />
      <path d={mesh} className="stroke-ink-4" strokeWidth="0.35" opacity="0.8" />
      {/* Door, hinges, padlock */}
      <rect x="22" y="10" width="32" height="54" rx="1" className="fill-none stroke-line-strong" strokeWidth="1" />
      <rect x="20.5" y="16" width="3" height="5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.5" />
      <rect x="20.5" y="52" width="3" height="5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.5" />
      <path d="M46 35 v-4 a4 4 0 0 1 8 0 v4" className="fill-none stroke-ink-2" strokeWidth="1.1" />
      <rect x="44" y="35" width="12" height="10" rx="1.5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.9" />
      <circle cx="50" cy="39" r="1.3" className="what-led" />
      <line x1="50" y1="40" x2="50" y2="42.6" className="stroke-ink-3" strokeWidth="0.8" />
      {/* Badge reader beside the door, and a badge */}
      <rect x="82" y="20" width="16" height="28" rx="2" className={frame} strokeWidth="0.9" />
      <rect x="85" y="24" width="10" height="8" rx="1" className={sunk} strokeWidth="0.5" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M86 ${36 + i * 2.6} q 4 -2 8 0`} className="fill-none stroke-ink-4" strokeWidth="0.5" />
      ))}
      <circle cx="90" cy="44" r="1.1" className="what-led" />
      <rect x="102" y="28" width="14" height="20" rx="1.5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.7" transform="rotate(-12 109 38)" />
      <rect x="105" y="31" width="8" height="2" rx="0.5" className="fill-ink-4" transform="rotate(-12 109 38)" />
    </>
  );
}

function Software() {
  const slab = (y: number, i: number, glyph: React.ReactNode) => (
    <g key={i}>
      <path d={`M20 ${y} L60 ${y - 9} L100 ${y} L60 ${y + 9} Z`} className={frame} strokeWidth="0.9" />
      <path d={`M20 ${y} V ${y + 3.5} L60 ${y + 12.5} L100 ${y + 3.5} V ${y}`} className="fill-bg-sunken stroke-line-strong" strokeWidth="0.7" />
      {glyph}
    </g>
  );
  return (
    <>
      {/* Bottom to top: drivers, frameworks, pipelines, notebooks */}
      {slab(
        60,
        0,
        <g>
          <path d="M60 56 L67 60 L60 64 L53 60 Z" className="fill-none stroke-ink-4" strokeWidth="0.6" />
          <path d="M60 58.6 L62.5 60 L60 61.4 L57.5 60 Z" className="fill-ink-4" />
        </g>,
      )}
      {slab(
        45,
        1,
        <g className="fill-ink-4">
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={52 + c * 8} cy={41 + r * 3} r="0.9" />))}
        </g>,
      )}
      {slab(
        30,
        2,
        <g>
          <path d="M44 30 H 76" className="what-live fill-none" strokeWidth="0.7" />
          {[44, 60, 76].map((x) => (
            <circle key={x} cx={x} cy="30" r="1.8" className="fill-bg-raised stroke-line-strong" strokeWidth="0.6" />
          ))}
        </g>,
      )}
      {slab(
        15,
        3,
        <g>
          <rect x="50" y="11" width="20" height="8" rx="0.8" className="fill-bg-sunken stroke-line-strong" strokeWidth="0.5" />
          <line x1="53" y1="14" x2="66" y2="14" className="stroke-ink-4" strokeWidth="0.5" />
          <line x1="53" y1="16.4" x2="62" y2="16.4" className="what-live" strokeWidth="0.5" />
        </g>,
      )}
    </>
  );
}

function People() {
  return (
    <>
      {/* Operations desk: two screens, a pictogram engineer with a headset */}
      <line x1="4" y1="58" x2="116" y2="58" className="stroke-line-strong" strokeWidth="1" />
      <line x1="10" y1="58" x2="10" y2="70" className="stroke-line-strong" strokeWidth="0.8" />
      <line x1="110" y1="58" x2="110" y2="70" className="stroke-line-strong" strokeWidth="0.8" />
      {[44, 80].map((x, i) => (
        <g key={x}>
          <rect x={x} y="16" width="32" height="22" rx="1.5" className={frame} strokeWidth="0.9" />
          <rect x={x + 2.5} y="18.5" width="27" height="17" rx="0.8" className="fill-bg-sunken stroke-none" />
          <line x1={x + 16} y1="38" x2={x + 16} y2="52" className="stroke-line-strong" strokeWidth="0.9" />
          <path d={`M${x + 9} 54 h14`} className="stroke-line-strong" strokeWidth="1" />
          {i === 0 ? (
            <polyline
              points={`${x + 4},32 ${x + 9},28 ${x + 13},30 ${x + 18},23 ${x + 22},26 ${x + 28},21`}
              className="what-live fill-none"
              strokeWidth="0.8"
            />
          ) : (
            [0, 1, 2, 3].map((r) => (
              <line
                key={r}
                x1={x + 5}
                y1={22 + r * 3.6}
                x2={x + 5 + [20, 14, 18, 10][r]!}
                y2={22 + r * 3.6}
                className={r === 3 ? "what-live" : "stroke-ink-4"}
                strokeWidth="0.6"
              />
            ))
          )}
        </g>
      ))}
      <rect x="54" y="54" width="18" height="3" rx="0.6" className={sunk} strokeWidth="0.5" />
      <circle cx="22" cy="30" r="6" className="fill-bg-raised stroke-ink-3" strokeWidth="0.9" />
      <path d="M8 58 C 8 44, 36 44, 36 58" className="fill-bg-raised stroke-ink-3" strokeWidth="0.9" />
      <path d="M15.5 29 a6.5 6.5 0 0 1 13 0" className="fill-none stroke-ink-3" strokeWidth="1" />
      <rect x="14" y="28" width="3" height="5" rx="1" className="fill-bg-raised stroke-ink-3" strokeWidth="0.6" />
      <path d="M15.5 33 q 1 4 6 4.5" className="fill-none stroke-ink-3" strokeWidth="0.6" />
      <circle cx="22" cy="37.5" r="0.9" className="what-led" />
    </>
  );
}

export function WhatArt({ part, className }: { part: WhatPart; className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={className} aria-hidden="true" focusable="false">
      {part === "gpu" && <MiniGpu x={0} y={2} w={120} />}
      {part === "servers" && <Servers />}
      {part === "power" && <Power />}
      {part === "cooling" && <Cooling />}
      {part === "network" && <Network />}
      {part === "security" && <Security />}
      {part === "software" && <Software />}
      {part === "people" && <People />}
    </svg>
  );
}
