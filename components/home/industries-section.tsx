/**
 * "Six industries. One GPU cloud." (home, Industries): the six industries
 * of /solutions as rows, each a link to its part of that page. The names,
 * promises and pictograms are that page's own (copy/en/solutions.ts).
 */
import { IndustryGlyph } from "@/components/solutions/industry-glyph";
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { SOLUTIONS } from "@/copy/en/solutions";

export function IndustriesSection() {
  const h = HOME.industries;
  const s = SOLUTIONS.industries;
  return (
    <section id="industries" aria-labelledby="industries-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead id="industries-title" kicker={h.kicker} title={s.title} continuation={s.continuation} />
          <div className="flex shrink-0 flex-wrap items-center gap-x-8 gap-y-3">
            {h.links.map((l) => (
              <TextLink key={l.href} href={l.href} arrow>
                {l.label}
              </TextLink>
            ))}
          </div>
        </div>

        <ul className="grid gap-x-10 md:grid-cols-2 lg:gap-x-14">
          {s.items.map((ind, i) => (
            <li
              key={ind.id}
              className="border-t border-line"
              data-reveal
              style={{ "--i": i % 2 } as React.CSSProperties}
            >
              <AppLink href={`/solutions#${ind.id}`} className="group flex items-center gap-5 py-5 md:py-6">
                <IndustryGlyph name={ind.glyph} className="size-9 md:size-10" />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="type-title-3 text-ink">{ind.name}</span>
                  <span className="type-small text-ink-2">{ind.promise}</span>
                </span>
                <Arrow className="text-ink-4 transition-[color,transform] duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-0.5 group-hover:text-ink" />
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
