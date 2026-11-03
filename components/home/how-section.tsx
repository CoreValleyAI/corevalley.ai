/**
 * "From a short brief to running" (home, How to start): three steps, each
 * on a pane of liquid glass — the brief, the plan and firm quote (the reply
 * time is a fact), and the start — then one way in.
 */
import { ButtonLink } from "@/components/system/button";
import { SectionLight } from "@/components/gl/section-light";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";

export function HowSection() {
  const h = HOME.how;
  return (
    <section id="how" aria-labelledby="how-title" className="section-y relative isolate scroll-mt-[var(--header-h)]">
      <SectionLight />
      <div className="container-page flex flex-col gap-12">
        <div data-glass-keepout>
          <SectionHead id="how-title" kicker={h.kicker} title={h.title} continuation={h.continuation} />
        </div>
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {h.steps.map((s, i) => (
            <li
              key={s.title}
              data-refract
              data-refract-bezel="22"
              data-glass-panel=""
              className="lg flex flex-col gap-4 rounded-panel p-7 md:p-9"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="type-kicker text-hydro-ink light:text-hydro">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="type-title-3 text-ink">{s.title}</h3>
              <p className="type-body text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
        <div>
          <ButtonLink href={h.action.href} variant="glass-hydro" size="lg" data-glass-panel="hydro">
            {h.action.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
