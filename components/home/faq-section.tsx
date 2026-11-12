/**
 * "About CoreValley." (home, Questions): the six questions a first visit
 * leaves, answered in the words of the pages that own them. No FAQPage
 * markup here; those pages carry it (docs/revamp/03 §3). The line under the
 * list dates every number on the page (docs/revamp/04 §1).
 */
import { Faq } from "@/components/system/faq";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";
import { asOfLabel, fact } from "@/lib/facts";

export function FaqSection() {
  const f = HOME.faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr]">
        <SectionHead id="faq-title" kicker={f.kicker} title={f.title} size="title-2" />
        <div className="flex flex-col gap-6">
          <Faq items={[...f.items]} jsonLd={false} />
          <p className="type-caption text-ink-3">
            {f.asOf} {asOfLabel(fact("gpu.memory").asOf)}.
          </p>
        </div>
      </div>
    </section>
  );
}
