import { AssistantSection } from "@/components/home/assistant-section";
import { BuiltOn } from "@/components/home/built-on";
import { GrowSection } from "@/components/home/grow-section";
import { Hero } from "@/components/home/hero";
import { HowSection } from "@/components/home/how-section";
import { ProtectionMap } from "@/components/home/protection-map";
import { ReceiptSection } from "@/components/home/receipt-section";
import { Climb } from "@/components/home/sections";
import { UptimeSection } from "@/components/home/uptime-section";
import { WhatSection } from "@/components/home/what-section";
import { WordsSection } from "@/components/home/words-section";
import { Page } from "@/components/motion/page";
import { createNotes, NoteList } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { UseCaseCarousel } from "@/components/use-cases/carousel";
import { HOME } from "@/copy/en/home";
import { findUseCase, HOME_STORIES } from "@/copy/en/use-cases";
import { fact, v } from "@/lib/facts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME.meta.title,
  absoluteTitle: true,
  description: HOME.meta.description,
  path: "/",
});

export default function HomePage() {
  const stories = HOME_STORIES.map((slug) => findUseCase(slug)!);
  const billing = fact("billing.unit");
  const notes = createNotes([
    "place.uptime",
    {
      key: "receipt",
      text: `Sample jobs and times, for illustration. "By the hour" rounds each run up to the next full hour; per-second billing has a minimum of ${v("billing.minimum")} per run. Rates are being finalised; every request gets a firm quote in rupees.`,
      source: billing.source,
      asOf: billing.asOf,
    },
    "place.uptimeMinutes",
  ]);

  return (
    <Page>
      <Hero />
      <BuiltOn />

      {/* What running AI takes, and what we run for you. */}
      <WhatSection notes={notes} />

      {/* Training, fine-tuning, inference, in plain words. */}
      <WordsSection />

      {/* A private assistant answering from your own documents. */}
      <AssistantSection />

      {/* Your data is safe with us: the protections, drawn and listed. */}
      <section aria-labelledby="rim-title" className="section-y relative isolate">
        <GlassLight variant="b" quiet />
        <div className="container-page">
          <ProtectionMap items={HOME.rim.items} link={HOME.rim.link}>
            <SectionHead
              id="rim-title"
              kicker={HOME.rim.kicker}
              title={HOME.rim.title}
              continuation={HOME.rim.continuation}
              lead={HOME.rim.lead}
            />
          </ProtectionMap>
        </div>
      </section>

      {/* Use cases, in the owner's order. */}
      <section aria-labelledby="cases-title" className="section-y relative isolate overflow-x-clip">
        <GlassLight />
        <div className="container-page mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            id="cases-title"
            kicker={HOME.cases.kicker}
            title={HOME.cases.title}
            continuation={HOME.cases.continuation}
            lead={HOME.cases.lead}
          />
          <TextLink href={HOME.cases.link.href} arrow className="shrink-0">
            {HOME.cases.link.label}
          </TextLink>
        </div>
        <UseCaseCarousel cases={stories} label="Use cases" />
      </section>

      {/* Billing, as the receipt a job produces. */}
      <ReceiptSection notes={notes} />

      {/* The facility's uptime commitment, as time. */}
      <UptimeSection notes={notes} />

      {/* From a first test to production, on the same account. */}
      <GrowSection />

      {/* From a brief to a running job. */}
      <HowSection />

      <Climb />
      <NoteList notes={notes} />
    </Page>
  );
}
