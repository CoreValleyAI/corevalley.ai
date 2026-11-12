/**
 * "From request to running." (home, Getting access): how an organisation
 * comes on board during early access — four steps, a real sequence — and
 * how it is billed (the billing panel of /pricing, which owns the subject).
 */
import { BillingBox } from "@/components/pricing/billing-box";
import { ButtonLink } from "@/components/system/button";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";

const pad = (n: number) => String(n).padStart(2, "0");

export function AccessSection() {
  const a = HOME.access;
  return (
    <section
      id="access"
      aria-labelledby="access-title"
      className="section-y relative isolate scroll-mt-[var(--header-h)]"
    >
      <GlassLight variant="c" quiet />
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead id="access-title" kicker={a.kicker} title={a.title} lead={a.lead} />
          <ButtonLink href={a.action.href} size="lg" className="shrink-0 self-start md:self-auto">
            {a.action.label}
          </ButtonLink>
        </div>

        {/* The number sits beside the step on a phone, above it on wider screens. */}
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {a.steps.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[2.25rem_1fr] gap-y-1.5 border-t border-line py-5 sm:flex sm:flex-col sm:gap-3 sm:py-6"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <span aria-hidden="true" className="type-kicker text-hydro-ink max-sm:mt-[0.45em] light:text-hydro">
                {pad(i + 1)}
              </span>
              <h3 className="type-title-3 text-ink">{s.title}</h3>
              <p className="type-small text-ink-2 max-sm:col-start-2">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-5">
          <h3 className="type-kicker text-ink-3">{a.billing}</h3>
          <BillingBox more />
        </div>
      </div>
    </section>
  );
}
