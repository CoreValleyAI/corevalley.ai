/**
 * "Start small. Grow without moving" (home): the same account growing on
 * the real hardware, one station per step — ready-made AI behind an API,
 * one slice of an H200 NVL, the whole card and then several, cards held
 * for a term, and a model live behind an endpoint. Each station links to
 * its product; a rail underneath says what never changes.
 *
 * As the row is read (ScrollSteps, --step) the stations light in order and
 * the rail fills; without JS or with reduced motion all five are lit.
 */
import { ScrollSteps } from "@/components/motion/frames";
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { MiniGpu } from "@/components/system/drawing";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { productBySlug } from "@/copy/en/products";
import { v } from "@/lib/facts";

type Station = (typeof HOME.grow.stations)[number]["id"];

function StationArt({ id }: { id: Station }) {
  return (
    <svg viewBox="0 0 160 100" className="grow-art" aria-hidden="true" focusable="false">
      {id === "try" && (
        <g>
          {/* The GPUs we run, out of sight behind the API */}
          <rect x="70" y="14" width="80" height="46" rx="3" className="fill-none stroke-ink-4" strokeWidth="0.7" strokeDasharray="3 3" />
          <text x="110" y="70" textAnchor="middle" className="grow-label">
            GPUs we run
          </text>
          {/* The API: a socket your app plugs into */}
          <rect x="14" y="28" width="46" height="34" rx="5" className="fill-bg-raised stroke-line-strong" strokeWidth="1" />
          <text x="37" y="49" textAnchor="middle" className="grow-api">
            API
          </text>
          <path d="M60 38 H 70" className="grow-live" strokeWidth="1.2" />
          <path d="M60 52 H 70" className="grow-live" strokeWidth="1.2" />
          <path d="M14 45 H 2" className="stroke-line-strong" strokeWidth="1.4" />
          <circle cx="8" cy="45" r="2.4" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <path d="M37 62 V 80 H 12" className="fill-none stroke-ink-4" strokeWidth="0.7" strokeDasharray="2 2" />
          <text x="12" y="90" className="grow-label">
            Your app
          </text>
        </g>
      )}
      {id === "slice" && (
        <g>
          <MiniGpu x={20} y={14} w={120} slices={Number(v("gpu.migCount"))} lit={1} />
          <text x="80" y="92" textAnchor="middle" className="grow-label">
            1 of {v("gpu.migCount")} slices
          </text>
        </g>
      )}
      {id === "whole" && (
        <g>
          <g opacity="0.45">
            <MiniGpu x={34} y={2} w={104} outline />
          </g>
          <g opacity="0.7">
            <MiniGpu x={27} y={10} w={104} outline />
          </g>
          <MiniGpu x={20} y={18} w={104} />
          <text x="80" y="92" textAnchor="middle" className="grow-label">
            Whole GPUs
          </text>
        </g>
      )}
      {id === "reserved" && (
        <g>
          {[0, 1, 2].map((i) => (
            <MiniGpu key={i} x={12 + i * 44} y={30} w={42} outline />
          ))}
          {/* The bracket that holds them for your organisation */}
          <path d="M10 26 V 20 H 144 V 26" className="grow-live fill-none" strokeWidth="1" />
          <path d="M10 60 V 66 H 144 V 60" className="grow-live fill-none" strokeWidth="1" />
          {/* Calendar tag: held for the term */}
          <rect x="118" y="4" width="26" height="22" rx="2" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <rect x="118" y="4" width="26" height="6" rx="2" className="grow-fill" />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}${c}`} x={121.5 + c * 5.4} y={12.5 + r * 4.2} width="3" height="2.4" rx="0.4" className="fill-ink-4" />
            )),
          )}
          <text x="77" y="82" textAnchor="middle" className="grow-label">
            Held for your term
          </text>
        </g>
      )}
      {id === "serve" && (
        <g>
          {/* Endpoint, answers flowing out to apps */}
          <rect x="12" y="24" width="54" height="44" rx="5" className="fill-bg-raised stroke-line-strong" strokeWidth="1" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="18" y={30 + i * 12} width="42" height="8" rx="1.5" className="fill-bg-sunken stroke-line-strong" strokeWidth="0.5" />
              <circle cx="54" cy={34 + i * 12} r="1.4" className="grow-dot" />
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M66 ${36 + i * 10} C 90 ${36 + i * 10}, 96 ${20 + i * 26}, 116 ${20 + i * 26}`} className="grow-flow" style={{ "--i": i } as React.CSSProperties} />
          ))}
          {/* A phone, a laptop, a server */}
          <rect x="118" y="12" width="12" height="18" rx="2" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <rect x="118" y="38" width="22" height="13" rx="1.5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <path d="M114 53 h30" className="stroke-line-strong" strokeWidth="1" />
          <rect x="118" y="62" width="26" height="10" rx="1.5" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <circle cx="139" cy="67" r="1.2" className="grow-dot" />
          <text x="40" y="84" textAnchor="middle" className="grow-label">
            Your endpoint
          </text>
        </g>
      )}
    </svg>
  );
}

export function GrowSection() {
  const g = HOME.grow;
  const rope = productBySlug(g.rope.product)!;
  return (
    <section aria-labelledby="grow-title" className="section-y relative isolate">
      <GlassLight variant="b" />
      <div className="container-page flex flex-col gap-12">
        <SectionHead id="grow-title" kicker={g.kicker} title={g.title} continuation={g.continuation} lead={g.lead} />
        <ScrollSteps steps={g.stations.length} from={0} to={0.75} className="grow">
          <ol className="grow-stations">
            {g.stations.map((s, i) => {
              const product = productBySlug(s.product)!;
              return (
                <li key={s.id} className="grow-station" style={{ "--row": i } as React.CSSProperties}>
                  <AppLink href={`/products/${product.slug}`} className="grow-card group">
                    <span className="grow-step">
                      <span className="grow-step__num">{String(i + 1).padStart(2, "0")}</span>
                      {s.step}
                    </span>
                    <StationArt id={s.id} />
                    <span className="flex flex-col gap-1.5">
                      <span className="type-title-3 text-ink">{s.title}</span>
                      <span className="type-small text-ink-2">{s.body}</span>
                    </span>
                    <span className="type-small mt-auto inline-flex items-center gap-2 font-medium text-ink-2 transition-colors group-hover:text-ink">
                      {product.name}
                      <Arrow className="transition-transform duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-1" />
                    </span>
                  </AppLink>
                </li>
              );
            })}
          </ol>
          <div className="grow-rail" aria-hidden="true">
            <span className="grow-rail__fill" />
          </div>
          <p className="grow-same">{g.same}</p>
        </ScrollSteps>
        <div>
          <TextLink href={`/products/${rope.slug}`} arrow>
            {g.rope.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
