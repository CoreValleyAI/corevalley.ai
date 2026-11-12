/**
 * Home — "The valley is coming online." An executive overview of an AI
 * infrastructure company (owner, Nov 2026): what we do, the GPU we run
 * today, why here and not abroad, how data is protected, who it is for and
 * how to get access. Plain enough for a bank's leadership, exact enough for
 * an engineer; no storytelling and nothing to play with.
 *
 * Each block summarises the page that owns its subject and links to it
 * (docs/revamp/01 §4.4). Product names and one-liners come from the
 * catalogue (copy/en/products.ts, copy/en/site.ts), industries from
 * copy/en/solutions.ts, the roadmap from copy/en/hardware.ts and every
 * number from lib/facts.ts. A disclaimer sits next to its claim
 * (docs/revamp/04 §2a), so the page carries no footnote list.
 */
import type { AnyProductSlug } from "@/copy/en/products";
import type { FactId } from "@/lib/facts";
import { fact, v } from "@/lib/facts";
import { INFRASTRUCTURE } from "./infrastructure";

export const HOME = {
  meta: {
    title: "CoreValley — Nepal's own AI cloud, in the Kathmandu Valley",
    description:
      "Run AI for your organisation without sending data abroad. A hydro-powered AI cloud in the Kathmandu Valley, billed in rupees, with support from the engineers who run it.",
  },

  hero: {
    /** "The valley is / coming online." — "online." is the lit word. */
    title: { line1: "The valley is", line2: "coming", lit: "online." },
    lead: "Nepal's own AI cloud. Put AI to work for your organisation, with your data kept in Nepal and your bill in rupees.",
    primary: { href: "/contact", label: "Request access" },
    secondary: { href: "#what", label: "See what we offer" },
    facts: [
      { value: "In Nepal", label: "your data stays here" },
      { value: "In rupees", label: "pay only for what you use" },
      { value: "Safe with us", label: "your data, protected" },
    ],
  },

  builtOn: {
    label: "Built on",
  },

  /** What the company is and what it provides: the catalogue, by layer. */
  what: {
    kicker: "What we do",
    title: "AI infrastructure,",
    continuation: "run from Nepal.",
    lead: "CoreValley is an AI cloud in the Kathmandu Valley. We provide GPU compute on NVIDIA hardware, a managed platform for building and serving models, and the engineers who run it.",
    /** Infrastructure first: the order an infrastructure company is read in. */
    groups: [
      {
        id: "scale",
        title: "GPU compute and infrastructure",
        line: `Whole ${v("gpu.model")} GPUs or isolated slices of one, with the networking and storage they need.`,
      },
      {
        id: "build",
        title: "A managed AI platform",
        line: "A private workspace with the tools ML teams already use, run and upgraded by us.",
      },
      {
        id: "run",
        title: "Models and inference",
        line: "Open and custom models behind an API your products can call, processed in Nepal.",
      },
    ] satisfies { id: "scale" | "build" | "run"; title: string; line: string }[] as {
      id: "scale" | "build" | "run";
      title: string;
      line: string;
    }[],
    /** One-liners that differ from the Products panel's (CATALOG_SHORT). */
    short: { "network-as-a-service": "Private networking for your workloads" } as Record<string, string>,
    links: [
      { href: "/products", label: "All products" },
      { href: "/products#compare", label: "Compare products" },
    ],
  },

  /** The GPU we run today: headline figures only (CTO ruling, 14 Oct 2026). */
  gpu: {
    kicker: "Hardware",
    status: "Early access",
    title: `${v("gpu.model")}.`,
    lead: `Our first GPUs, in the Kathmandu Valley. ${v("gpu.memory")} of memory on every card: room for large models and long contexts on a single card.`,
    specs: ["gpu.memory", "gpu.bandwidth"] as FactId[],
    slices: { label: "Isolated slices per GPU", value: `Up to ${v("gpu.migCount")}` },
    waysTitle: "Three ways to use it",
    ways: [
      { title: "On demand", body: "Whole GPUs, billed by the second.", product: "on-demand" },
      { title: "Reserved", body: "Capacity held for your organisation, for a term.", product: "reserved" },
      {
        title: "MIG slices",
        body: `Up to ${v("gpu.migCount")} isolated slices of one GPU. Pay for the slice.`,
        product: "mig-slicing",
      },
    ] satisfies { title: string; body: string; product: AnyProductSlug }[] as {
      title: string;
      body: string;
      product: AnyProductSlug;
    }[],
    roadmapTitle: "What comes next",
    link: { href: "/hardware", label: "The hardware" },
  },

  /**
   * Here and abroad, side by side. No prices and no named competitor; the
   * latency figure carries its disclaimer (docs/revamp/04 §2a).
   */
  why: {
    kicker: "Why CoreValley",
    title: "Why here,",
    continuation: "and not a cloud abroad.",
    lead: "What changes when your AI runs in Nepal.",
    caption: "CoreValley compared with a cloud abroad",
    columns: { topic: "Compared on", abroad: "A cloud abroad", here: "CoreValley" },
    rows: [
      {
        topic: "Where your workload data is processed",
        abroad: "Outside Nepal",
        here: "Our datacentre in the Kathmandu Valley",
      },
      { topic: "Invoice", abroad: "US dollars", here: "Nepalese rupees" },
      { topic: "How you pay", abroad: "International card or wire", here: v("billing.rails") },
      { topic: "Exchange rate", abroad: "Your cost moves with the dollar", here: "None: you are billed in rupees" },
      { topic: "Support", abroad: "From abroad", here: "Engineers in Kathmandu, on Nepal time" },
      {
        topic: "Network distance",
        abroad: "An international round trip",
        here: `${v("place.latency")} round trip inside the valley`,
        note: fact("place.latency").footnote,
      },
    ] satisfies { topic: string; abroad: string; here: string; note?: string }[] as {
      topic: string;
      abroad: string;
      here: string;
      note?: string;
    }[],
    quote: `Rates are ${v("billing.rates").toLowerCase()}. Every request gets a firm quote in rupees ${v("contact.reply").toLowerCase()}.`,
    link: { href: "/pricing", label: "How billing works" },
  },

  /** Each commitment matches /trust (copy/en/trust.ts). No certificate is named. */
  trust: {
    kicker: "Security and data",
    title: "Built for regulated sectors.",
    lead: "For banks, insurers, hospitals and public bodies that need their data to stay in Nepal, and need to know who can reach it.",
    items: [
      {
        title: "Workload data stays in Nepal",
        body: "Datasets, models, prompts and outputs are stored and processed in our datacentre in the Kathmandu Valley, and not replicated outside Nepal.",
      },
      {
        title: "Isolated in hardware",
        body: "Your GPU, or your MIG slice, runs only your work. Slices are separated inside the GPU itself.",
      },
      {
        title: "Seen only when you ask",
        body: "Our staff open your workloads only for support you ask for, or when the law requires it.",
      },
      {
        title: "Never used for training",
        body: "We don't sell your data, and we don't train anything on your workloads or prompts.",
      },
      {
        title: "Told within 72 hours",
        body: "If an incident affects your data, we tell you within 72 hours of confirming it: what happened and what we are doing.",
      },
      {
        title: "Your data flows, in writing",
        body: "Regulated customers get a written description of their data flows during onboarding.",
      },
    ],
    links: [
      { href: "/trust", label: "Trust and data handling" },
      { href: "/legal/data-residency", label: "Data residency" },
    ],
  },

  /** The six industries of /solutions; the headline and rows are its own (copy/en/solutions.ts). */
  industries: {
    kicker: "Industries",
    links: [
      { href: "/solutions", label: "All solutions" },
      { href: "/use-cases", label: "Use cases" },
    ],
  },

  /** How an organisation gets access, and how it is billed. */
  access: {
    kicker: "Getting access",
    title: "From request to running.",
    lead: "CoreValley is in early access. Our team brings each organisation on board.",
    steps: [
      { title: "Request access", body: "Tell us what you want to run. It takes about a minute." },
      {
        title: "Plan and quote",
        body: `${v("contact.reply")}, you get a capacity plan and a firm quote in rupees.`,
      },
      {
        title: "Onboarding",
        body: "We set up your organisation's private workspace and help you bring your first workload.",
      },
      {
        title: "Run",
        body: "Work in notebooks, pipelines, endpoints or APIs. Metered usage is invoiced monthly in rupees.",
      },
    ],
    action: { href: "/contact?intent=workloads", label: "Request access" },
    billing: "Billing at a glance",
  },

  /** Answers reuse the owning page's wording where one exists. */
  faq: {
    kicker: "Questions",
    title: "About CoreValley.",
    items: [
      {
        q: "What does CoreValley provide?",
        a: `GPU compute on ${v("gpu.model")}, a managed AI platform, model serving and APIs, storage, networking and engineering services, all run from a datacentre in the Kathmandu Valley.`,
      },
      {
        q: "Can we start now?",
        a: `CoreValley is in early access. Tell us what you want to run; we check it against capacity and reply ${v("contact.reply").toLowerCase()} with a plan and a firm quote in rupees.`,
      },
      { q: "Where is our data kept?", a: INFRASTRUCTURE.faq[0].a },
      {
        q: "What does it cost?",
        a: `GPU time is billed ${v("billing.unit").toLowerCase()}, in Nepalese rupees, with a ${v("billing.minimum")} minimum. Rates are ${v("billing.rates").toLowerCase()}; until then, every request gets a firm quote in rupees ${v("contact.reply").toLowerCase()}.`,
      },
      {
        q: "Do we need our own AI engineers?",
        a: "No. Our engineers can plan, build and run the work with you. Engineering work is scoped and quoted before it starts.",
      },
      {
        q: "How reliable is the datacentre?",
        a: fact("place.uptime").footnote!,
      },
    ],
    /** Every number on the page carries its date (docs/revamp/04 §1). */
    asOf: "Figures on this page are as of",
  },

  climb: {
    kicker: "Start the climb",
    title: "What are you here for?",
    lead: "Pick one. It takes about a minute.",
  },
} as const;
