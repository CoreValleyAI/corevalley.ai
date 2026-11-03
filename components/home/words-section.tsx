/**
 * "AI in plain words" (home): training, fine-tuning and inference, each a
 * card with one sentence and a small drawing in one shared grammar —
 * what goes in (left), the model as a 7 × 7 grid of dots (middle), what
 * comes out (right).
 *
 *  Training     many examples in; the blank model's dots light as it learns;
 *               a new model out
 *  Fine-tuning  a few of your documents in; a lit model, some dots turning
 *               hydro; your model out
 *  Inference    a question in; the lit model read column by column; an
 *               answer out
 *
 * The resting state (server render, reduced motion) is the finished
 * picture; the loop runs only while the card is on screen (PlayFrame).
 */
import { PlayFrame } from "@/components/motion/frames";
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { Flow } from "@/components/system/drawing";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";
import { productBySlug } from "@/copy/en/products";

type Word = "train" | "tune" | "run";

/** Dots of the fine-tuned model that change (row-major indices). */
const TUNED = new Set([3, 9, 17, 22, 24, 30, 33, 39, 45]);

function Model({ word }: { word: Word }) {
  // The 49 dots, grouped by how they animate: diagonals while training,
  // columns while answering, the changed dots while fine-tuning. One path
  // per group, each dot a zero-length stroke with a round cap.
  const groups = new Map<string, { d: string; tuned: boolean; style: React.CSSProperties }>();
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++) {
      const tuned = word === "tune" && TUNED.has(r * 7 + c);
      const key = word === "train" ? `k${(r + c) % 13}` : word === "run" ? `c${c}` : tuned ? "t" : "o";
      const g = groups.get(key) ?? {
        d: "",
        tuned,
        style: { "--k": (r + c) % 13, "--c": c } as React.CSSProperties,
      };
      g.d += `M${Math.round((98 + c * 7.4) * 10) / 10} ${Math.round((38 + r * 7.4) * 10) / 10}h0`;
      groups.set(key, g);
    }
  return (
    <g>
      <rect x="90" y="30" width="60" height="60" rx="6" className="fill-bg-sunken stroke-line-strong" strokeWidth="0.8" />
      {[...groups].map(([key, g]) => (
        <path
          key={key}
          d={g.d}
          className={g.tuned ? "ai-dots ai-dots--tuned" : "ai-dots"}
          strokeWidth="4"
          strokeLinecap="round"
          style={g.style}
        />
      ))}
      <text x="120" y="104" textAnchor="middle" className="ai-label">
        Model
      </text>
    </g>
  );
}

function Page({ x, y, mark = false }: { x: number; y: number; mark?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} h14 l5 5 v19 h-19 z`} className="fill-bg-raised stroke-line-strong" strokeWidth="0.7" />
      <path d={`M${x + 14} ${y} v5 h5`} className="fill-none stroke-line-strong" strokeWidth="0.6" />
      {[9, 13, 17, 21].map((d, i) => (
        <line key={d} x1={x + 3} y1={y + d} x2={x + (i === 3 ? 10 : 16)} y2={y + d} className="stroke-ink-4" strokeWidth="0.6" />
      ))}
      {mark ? <rect x={x} y={y + 22} width="19" height="2" className="fill-hydro" /> : null}
    </g>
  );
}

function WordArt({ word }: { word: Word }) {
  return (
    <svg viewBox="0 0 240 116" className="ai-art" aria-hidden="true" focusable="false">
      {/* In */}
      {word === "train" && (
        <g>
          {[0, 1, 2].flatMap((r) =>
            [0, 1].map((c) => <Page key={`${r}${c}`} x={12 + c * 26 + (r % 2) * 6} y={14 + r * 28} />),
          )}
          <text x="40" y="104" textAnchor="middle" className="ai-label">
            Many examples
          </text>
        </g>
      )}
      {word === "tune" && (
        <g>
          <Page x={22} y={34} mark />
          <Page x={42} y={44} mark />
          <text x="40" y="104" textAnchor="middle" className="ai-label">
            Your documents
          </text>
        </g>
      )}
      {word === "run" && (
        <g>
          <path d="M14 40 h48 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-30 l-8 7 v-7 h-10 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6 z" className="fill-bg-raised stroke-line-strong" strokeWidth="0.8" />
          <line x1="22" y1="50" x2="56" y2="50" className="stroke-ink-4" strokeWidth="0.8" />
          <line x1="22" y1="57" x2="46" y2="57" className="stroke-ink-4" strokeWidth="0.8" />
          <text x="60" y="61" textAnchor="middle" className="ai-q">
            ?
          </text>
          <text x="40" y="104" textAnchor="middle" className="ai-label">
            A question
          </text>
        </g>
      )}

      <Flow d="M72 60 H 88" />
      <Model word={word} />
      <Flow d="M152 60 H 168" delay={0.4} />

      {/* Out */}
      {word === "run" ? (
        <g>
          <path d="M172 38 h54 a6 6 0 0 1 6 6 v26 a6 6 0 0 1 -6 6 h-10 v7 l-8 -7 h-36 a6 6 0 0 1 -6 -6 v-26 a6 6 0 0 1 6 -6 z" className="fill-bg-raised stroke-hydro" strokeWidth="0.9" />
          {[48, 55, 62].map((y, i) => (
            <line key={y} x1="180" y1={y} x2={i === 2 ? 206 : 222} y2={y} className="ai-answer" strokeWidth="1" style={{ "--i": i } as React.CSSProperties} />
          ))}
          <text x="202" y="104" textAnchor="middle" className="ai-label">
            An answer
          </text>
        </g>
      ) : (
        <g>
          <rect x="176" y="38" width="44" height="44" rx="6" className={word === "tune" ? "fill-bg-raised stroke-hydro" : "fill-bg-raised stroke-line-strong"} strokeWidth="0.9" />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => (
              <circle
                key={`${r}${c}`}
                cx={188 + c * 10}
                cy={50 + r * 10}
                r="2.4"
                className={word === "tune" && (r + c) % 2 === 0 ? "fill-hydro" : "fill-ink-3"}
              />
            )),
          )}
          <text x="198" y="104" textAnchor="middle" className="ai-label">
            {word === "tune" ? "Your model" : "A new model"}
          </text>
        </g>
      )}
    </svg>
  );
}

export function WordsSection() {
  const w = HOME.words;
  return (
    <section aria-labelledby="words-title" className="section-y relative isolate">
      <GlassLight variant="b" />
      <div className="container-page flex flex-col gap-12">
        <SectionHead id="words-title" kicker={w.kicker} title={w.title} continuation={w.continuation} />
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {w.cards.map((c, i) => {
            const product = productBySlug(c.product)!;
            return (
              <li key={c.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <AppLink
                  href={`/products/${product.slug}`}
                  data-refract
                  data-refract-bezel="18"
                  className="lg lg-card group flex h-full flex-col gap-6 rounded-panel p-6 md:p-7"
                >
                  <PlayFrame className={`ai ai--${c.id}`}>
                    <WordArt word={c.id} />
                  </PlayFrame>
                  <span className="flex flex-1 flex-col gap-2">
                    <span className="type-title-3 text-ink">{c.word}</span>
                    <span className="type-body font-medium text-ink">{c.say}</span>
                    <span className="type-small text-ink-2">{c.body}</span>
                  </span>
                  <span className="type-small inline-flex items-center gap-2 font-medium text-ink-2 transition-colors group-hover:text-ink">
                    {product.name}
                    <Arrow className="transition-transform duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-1" />
                  </span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
