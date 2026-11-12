/**
 * "AI infrastructure, run from Nepal." (home, What we do): the company in
 * one sentence, then everything it provides on one panel — the catalogue's
 * three groups (copy/en/products.ts) with the infrastructure first, each
 * offering a link to its own page. Names only on a phone; a line each from
 * the Products panel's wording on wider screens.
 */
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { DotGlyph } from "@/components/system/dot-glyph";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { PRODUCT_CATALOG } from "@/copy/en/products";
import { CATALOG_SHORT } from "@/copy/en/site";
import { cn } from "@/lib/cn";

export function WhatSection() {
  const w = HOME.what;
  return (
    <section id="what" aria-labelledby="what-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHead id="what-title" kicker={w.kicker} title={w.title} continuation={w.continuation} lead={w.lead} />

        <div className="overflow-hidden rounded-panel border border-line bg-bg-raised/70" data-reveal>
          <div className="grid lg:grid-cols-3">
            {w.groups.map((g, gi) => {
              const group = PRODUCT_CATALOG.find((c) => c.id === g.id)!;
              return (
                <div
                  key={g.id}
                  className={cn("flex flex-col p-6 md:p-8", gi > 0 && "border-t border-line lg:border-t-0 lg:border-l")}
                >
                  <p className="type-kicker text-hydro-ink light:text-hydro">{group.name}</p>
                  <h3 className="type-title-3 mt-3 text-ink">{g.title}</h3>
                  <p className="type-small mt-2 text-ink-2 lg:min-h-[2lh]">{g.line}</p>
                  <ul className="mt-6">
                    {group.items.map((it) => (
                      <li key={it.id} className="border-t border-line">
                        <AppLink
                          href={`/products/${it.page}`}
                          className="group -mx-3 flex items-center gap-3.5 rounded-chip px-3 py-3 transition-colors duration-[var(--dur-short)] hover:bg-ink/[0.04]"
                        >
                          <DotGlyph name={it.glyph} className="size-6" />
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="type-body font-medium text-ink">{it.name}</span>
                            <span className="type-small hidden text-ink-2 sm:block">
                              {w.short[it.id] ?? CATALOG_SHORT[it.id] ?? it.line}
                            </span>
                          </span>
                          <Arrow className="text-ink-4 transition-[color,transform] duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-0.5 group-hover:text-ink" />
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line px-6 py-5 md:px-8">
            {w.links.map((l) => (
              <TextLink key={l.href} href={l.href} arrow className="type-small">
                {l.label}
              </TextLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
