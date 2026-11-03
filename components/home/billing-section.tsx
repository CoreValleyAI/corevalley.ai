/**
 * "Pay for the seconds you use" (home, Billing): three words that stick —
 * per second, in rupees, no contract — each on a pane of liquid glass with
 * one line under it. The 60-second minimum is the footnote; the detail
 * lives on /pricing.
 */
import { NoteRef, type Notes } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";

export function BillingSection({ notes }: { notes: Notes }) {
  const b = HOME.billing;
  return (
    <section aria-labelledby="billing-title" className="section-y relative isolate">
      <GlassLight variant="b" />
      <div className="container-page flex flex-col gap-12">
        <SectionHead id="billing-title" kicker={b.kicker} title={b.title} continuation={b.continuation} />
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {b.tiles.map((t, i) => (
            <li
              key={t.value}
              data-refract
              data-refract-bezel="22"
              className="lg flex flex-col gap-4 rounded-panel p-7 md:p-9"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <p className="type-title-1 text-ink">
                {t.value}
                {"note" in t && t.note ? <NoteRef notes={notes} id="minimum" /> : null}
              </p>
              <p className="type-body text-ink-2">{t.body}</p>
            </li>
          ))}
        </ul>
        <div>
          <TextLink href={b.link.href} arrow>
            {b.link.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
