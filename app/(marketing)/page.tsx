import { BuiltOn } from "@/components/home/built-on";
import { Hero } from "@/components/home/hero";
import { ProtectionMap } from "@/components/home/protection-map";
import { Climb, HowSection, ProductsSection, WhatSection, WhySection } from "@/components/home/sections";
import { Page } from "@/components/motion/page";
import { BillingBox } from "@/components/pricing/billing-box";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { UseCaseCarousel } from "@/components/use-cases/carousel";
import { HOME } from "@/copy/en/home";
import { findUseCase, HOME_STORIES } from "@/copy/en/use-cases";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME.meta.title,
  absoluteTitle: true,
  description: HOME.meta.description,
  path: "/",
});

export default function HomePage() {
  const stories = HOME_STORIES.map((slug) => findUseCase(slug)!);

  return (
    <Page>
      <Hero />
      <BuiltOn />

      {/* What we do, in plain words. */}
      <WhatSection />

      {/* How it works: three steps, no jargon. */}
      <HowSection />

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

      {/* Your data is safe with us: the protections, drawn and listed. */}
      <section aria-labelledby="rim-title" className="section-y">
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

      {/* Why local: regulation, speed, power. */}
      <WhySection />

      {/* Billing at a glance. */}
      <section aria-labelledby="billing-title" className="section-y relative isolate">
        <GlassLight variant="b" />
        <div className="container-page flex flex-col gap-12">
          <SectionHead
            id="billing-title"
            kicker={HOME.billing.kicker}
            title={HOME.billing.title}
            continuation={HOME.billing.continuation}
          />
          <BillingBox more />
        </div>
      </section>

      <ProductsSection />
      <Climb />
    </Page>
  );
}
