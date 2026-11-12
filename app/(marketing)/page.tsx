import { AccessSection } from "@/components/home/access-section";
import { BuiltOn } from "@/components/home/built-on";
import { FaqSection } from "@/components/home/faq-section";
import { GpuSection } from "@/components/home/gpu-section";
import { Hero } from "@/components/home/hero";
import { IndustriesSection } from "@/components/home/industries-section";
import { Climb } from "@/components/home/sections";
import { TrustSection } from "@/components/home/trust-section";
import { WhatSection } from "@/components/home/what-section";
import { WhySection } from "@/components/home/why-section";
import { Page } from "@/components/motion/page";
import { HOME } from "@/copy/en/home";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME.meta.title,
  absoluteTitle: true,
  description: HOME.meta.description,
  path: "/",
});

/**
 * The home page: an executive overview. Each block answers one question a
 * first visit brings and links to the page that owns the detail.
 */
export default function HomePage() {
  return (
    <Page>
      <Hero />
      <BuiltOn />

      {/* What we do: the company in a sentence, and everything it provides. */}
      <WhatSection />

      {/* The GPU we run, how to use it and what comes next. */}
      <GpuSection />

      {/* Why here and not a cloud abroad. */}
      <WhySection />

      {/* How data is protected: built for regulated sectors. */}
      <TrustSection />

      {/* Who it is for. */}
      <IndustriesSection />

      {/* How to get access, and how billing works. */}
      <AccessSection />

      {/* The questions a first visit leaves. */}
      <FaqSection />

      <Climb />
    </Page>
  );
}
