/**
 * Home — "The valley is coming online." Written for the people who decide
 * to use AI, not the people who operate GPUs: bankers, managers, teachers.
 * No GPU specifications here; the technical detail lives on /hardware,
 * /platform and the product pages. Every chapter is plain words and points
 * to the page that owns the subject.
 */
import type { Protection } from "@/components/home/protection-map";
import type { GlyphName } from "@/components/system/dot-glyph";

export const HOME = {
  meta: {
    title: "CoreValley — Nepal's own AI cloud, in the Kathmandu Valley",
    description:
      "Run AI for your organisation without sending data abroad. A hydro-powered AI cloud in the Kathmandu Valley, billed in rupees, with support in Nepal time. Early access open.",
  },

  hero: {
    /** "The valley is / coming online." — "online." is the lit word. */
    title: { line1: "The valley is", line2: "coming", lit: "online." },
    lead: "Nepal's own AI cloud. Put AI to work for your organisation, with your data kept in Nepal and your bill in rupees.",
    primary: { href: "/contact", label: "Request access" },
    secondary: { href: "#how", label: "See how it works" },
    facts: [
      { value: "In Nepal", label: "your data stays here" },
      { value: "In rupees", label: "pay only for what you use" },
      { value: "Safe with us", label: "your data, protected" },
    ],
  },

  builtOn: {
    label: "Built on",
    /** NVIDIA's trademark notice; their mark is shown unaltered, no partnership claimed. */
    notice: "NVIDIA and the NVIDIA logo are trademarks of NVIDIA Corporation.",
  },

  what: {
    kicker: "What we do",
    title: "AI, run at home.",
    continuation: "So you don't have to send it abroad.",
    lead: "AI needs powerful computers. Until now, Nepali organisations had to rent them overseas. We run them here, in the Kathmandu Valley, and look after everything for you.",
    items: [
      {
        glyph: "use-cases",
        title: "Put AI to work",
        body: "Spot fraud, answer customers in Nepali, read documents, forecast demand. Use AI on the work you already do.",
      },
      {
        glyph: "trust",
        title: "Keep your data at home",
        body: "Customer records and documents never leave Nepal. That keeps regulators, auditors and your customers comfortable.",
      },
      {
        glyph: "pricing",
        title: "Pay in rupees, for what you use",
        body: "No dollar cards and no exchange-rate surprises. You pay for the time you use, on a clear rupee invoice.",
      },
      {
        glyph: "services",
        title: "Talk to people nearby",
        body: "Our team is in Kathmandu and works Nepal time. When you need help, you reach the people who run it.",
      },
    ] satisfies { glyph: GlyphName; title: string; body: string }[] as { glyph: GlyphName; title: string; body: string }[],
  },

  how: {
    kicker: "How it works",
    title: "Three steps.",
    continuation: "No technical team needed to start.",
    steps: [
      {
        title: "Tell us what you want to do",
        body: "In plain words: the problem, the data you have and when you need it. It takes about a minute.",
      },
      {
        title: "Get a plan and a price",
        body: "Within one working day, our team in Kathmandu sends a plan and a firm quote in rupees.",
      },
      {
        title: "Start, with us beside you",
        body: "Your team works on it, or our engineers help set it up. We run the machines underneath.",
      },
    ],
  },

  cases: {
    kicker: "Who it's for",
    title: "Built for the work.",
    continuation: "Banks, businesses, classrooms.",
    lead: "Fraud checks, customer service in Nepali, private assistants, forecasting — the work that should run close to home.",
    link: { href: "/use-cases", label: "All use cases" },
  },

  why: {
    kicker: "Why local",
    title: "Made for Nepal.",
    continuation: "Not adapted to it.",
    items: [
      {
        title: "For regulated organisations",
        body: "Banks, insurers, hospitals and government can use AI while keeping data under Nepal's law.",
      },
      {
        title: "Fast, because it's close",
        body: "Your apps reach the cloud inside the valley, not halfway around the world, so answers come back quickly.",
      },
      {
        title: "Powered by Nepal's rivers",
        body: "Our datacentre runs on Nepal's hydropower: clean energy, made at home.",
      },
    ],
  },

  rim: {
    kicker: "Data protection",
    title: "Your data is safe with us.",
    continuation: "Protected at every step.",
    lead: "Five commitments for your datasets, models, prompts and answers, in plain words.",
    /** Each one matches /trust (copy/en/trust.ts); ids light the drawing. */
    items: [
      {
        id: "isolated",
        title: "Isolated in hardware",
        body: "Your GPU, or your MIG slice, runs only your work. Slices are separated inside the GPU itself.",
      },
      {
        id: "access",
        title: "Seen only when you ask",
        body: "Our staff open your workloads only for support you ask for, or when the law requires it.",
      },
      {
        id: "training",
        title: "Never used for training",
        body: "We don't sell your data, and we don't train anything on your workloads or prompts.",
      },
      {
        id: "abroad",
        title: "No copies abroad",
        body: "Stored and processed in our own datacentre in Nepal, and never replicated outside it.",
      },
      {
        id: "incident",
        title: "Told within 72 hours",
        body: "If an incident affects your data, you hear what happened and what we are doing within 72 hours.",
      },
    ] satisfies Protection[] as Protection[],
    link: { href: "/trust", label: "How we protect it" },
  },

  billing: {
    kicker: "Billing",
    title: "Pay for the seconds you use.",
    continuation: "Not the hour you started in.",
  },

  products: {
    kicker: "Ways to start",
    title: "Start where you are.",
    continuation: "Grow from there.",
    lead: "Whether you want ready-made AI, a place for your team to build, or engineers to do it with you.",
    link: { href: "/products", label: "All products" },
    routes: [
      {
        href: "/products/serverless-apis",
        glyph: "token",
        title: "Use ready-made AI",
        body: "Add language, speech or document AI to your apps, without managing any computers.",
      },
      {
        href: "/products/platform",
        glyph: "platform",
        title: "Build your own",
        body: "A ready workspace where your data team can build and run AI on your own data.",
      },
      {
        href: "/products/services",
        glyph: "services",
        title: "Have us do it with you",
        body: "Our engineers in Kathmandu plan it, set it up and get it running alongside your team.",
      },
    ] satisfies { href: string; glyph: GlyphName; title: string; body: string }[] as {
      href: string;
      glyph: GlyphName;
      title: string;
      body: string;
    }[],
  },

  climb: {
    kicker: "Start the climb",
    title: "What are you here for?",
    lead: "Pick one. It takes about a minute.",
  },
} as const;
