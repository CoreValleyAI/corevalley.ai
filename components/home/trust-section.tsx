/**
 * "Built for regulated sectors." (home, Security and data): six plain
 * commitments on hairlines, each matching /trust (copy/en/trust.ts) and the
 * data-residency page. No licence or certificate is named: none is claimed
 * until it is held (docs/revamp/04 §4).
 */
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";

export function TrustSection() {
  const t = HOME.trust;
  return (
    <section id="trust" aria-labelledby="trust-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHead id="trust-title" kicker={t.kicker} title={t.title} lead={t.lead} />

        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
          {t.items.map((it, i) => (
            <li
              key={it.title}
              className="flex flex-col gap-2.5 border-t border-line py-6"
              data-reveal
              style={{ "--i": i % 3 } as React.CSSProperties}
            >
              <h3 className="type-body flex items-baseline gap-3 font-semibold text-ink">
                <span aria-hidden="true" className="size-1.5 shrink-0 -translate-y-[0.15em] rounded-full bg-hydro" />
                {it.title}
              </h3>
              <p className="type-small pl-[1.125rem] text-ink-2">{it.body}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {t.links.map((l) => (
            <TextLink key={l.href} href={l.href} arrow>
              {l.label}
            </TextLink>
          ))}
        </div>
      </div>
    </section>
  );
}
