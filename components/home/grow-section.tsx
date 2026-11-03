/**
 * "Start small. Grow without moving" (home): five steps from a first test
 * to production, on the same account — each a pane of liquid glass that
 * links to its product, read left to right. A hairline under the row says
 * what never changes.
 */
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { productBySlug } from "@/copy/en/products";

export function GrowSection() {
  const g = HOME.grow;
  const rope = productBySlug(g.rope.product)!;
  return (
    <section aria-labelledby="grow-title" className="section-y relative isolate">
      <GlassLight variant="c" />
      <div className="container-page flex flex-col gap-12">
        <SectionHead id="grow-title" kicker={g.kicker} title={g.title} continuation={g.continuation} lead={g.lead} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {g.stations.map((s, i) => {
            const product = productBySlug(s.product)!;
            return (
              <li key={s.title} className="min-w-0" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <AppLink
                  href={`/products/${product.slug}`}
                  data-refract
                  data-refract-bezel="20"
                  className="lg lg-card group flex h-full flex-col gap-3 rounded-panel p-6"
                >
                  <span className="type-title-3 text-ink">{s.title}</span>
                  <span className="type-small text-ink-2">{s.body}</span>
                  <span className="type-small mt-auto inline-flex items-center gap-2 pt-4 font-medium text-ink-2 transition-colors group-hover:text-ink">
                    {product.name}
                    <Arrow className="transition-transform duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-1" />
                  </span>
                </AppLink>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="type-kicker text-ink-3">{g.same}</p>
          <TextLink href={`/products/${rope.slug}`} arrow>
            {g.rope.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
