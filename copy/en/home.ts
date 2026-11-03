/**
 * Home — "The valley is coming online." Written for the people who decide
 * to use AI in any organisation, not the people who operate GPUs. No GPU
 * specifications here; the technical detail lives on /hardware, /platform
 * and the product pages.
 *
 * Every chapter below the hero is one literal drawing of the real thing —
 * what running AI takes, what the three words mean, a private assistant at
 * work, a usage receipt, a year of uptime, a GPU growing with the work, the
 * path from a brief to a running job. No metaphors (owner, Nov 2026).
 * Sample data in the drawings is labelled as an illustration; every real
 * number is a fact id (lib/facts.ts).
 */
import type { Protection } from "@/components/home/protection-map";
import type { AnyProductSlug } from "@/copy/en/products";
import { v } from "@/lib/facts";

export type WhatPart = "gpu" | "servers" | "power" | "cooling" | "network" | "security" | "software" | "people";

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
    secondary: { href: "#what", label: "See how it works" },
    facts: [
      { value: "In Nepal", label: "your data stays here" },
      { value: "In rupees", label: "pay only for what you use" },
      { value: "Safe with us", label: "your data, protected" },
    ],
  },

  builtOn: {
    label: "Built on",
  },

  /** What running AI takes, row by row: on your own, and with us. */
  what: {
    kicker: "What we do",
    title: "Everything AI needs, run for you.",
    continuation: "Your team brings the idea.",
    lead: "Running AI yourself means buying GPUs and running everything around them. With CoreValley you send one request; we run the rest, in our datacentre in Nepal.",
    yourself: "If you run AI yourself",
    withUs: "With CoreValley",
    rows: [
      {
        id: "gpu",
        name: "GPUs",
        yourself: "Buy AI chips and import them.",
        withUs: "NVIDIA H200 NVL GPUs, ready when you are.",
        href: "/hardware",
      },
      {
        id: "servers",
        name: "Servers",
        yourself: "Install servers and racks to hold them.",
        withUs: "Installed, maintained and replaced by us.",
      },
      {
        id: "power",
        name: "Power",
        yourself: "Keep the power on, with backup.",
        withUs: `Nepal's hydropower, under a ${v("place.uptime")} facility uptime commitment.`,
        note: "place.uptime",
      },
      {
        id: "cooling",
        name: "Cooling",
        yourself: "Keep them cool, around the clock.",
        withUs: "Cooling that keeps every GPU at full speed.",
      },
      {
        id: "network",
        name: "Network",
        yourself: "Build fast, private networking.",
        withUs: "A private network for every customer.",
      },
      {
        id: "security",
        name: "Security",
        yourself: "Lock it down: isolation, access, audit.",
        withUs: "Isolated workspaces and an audit log.",
        href: "/trust",
      },
      {
        id: "software",
        name: "Software",
        yourself: "Install and update the AI tools.",
        withUs: "A workspace that is ready on day one.",
        href: "/platform",
      },
      {
        id: "people",
        name: "People",
        yourself: "Hire engineers to run it, day and night.",
        withUs: "The engineers who run it, answering you.",
      },
    ] satisfies { id: WhatPart; name: string; yourself: string; withUs: string; href?: string; note?: "place.uptime" }[] as {
      id: WhatPart;
      name: string;
      yourself: string;
      withUs: string;
      href?: string;
      note?: "place.uptime";
    }[],
    before: { yourself: "Before your first job: buy, ship, install, hire.", withUs: "Before your first job: one request." },
    link: { href: "/platform", label: "How the platform works" },
  },

  /** The three words people hear in every AI conversation. */
  words: {
    kicker: "AI in plain words",
    title: "Three words you'll hear.",
    continuation: "What each one means.",
    cards: [
      {
        id: "train",
        word: "Training",
        say: "Teaching a model from many examples.",
        body: "The model starts blank and learns patterns from a large collection of data. It is the heaviest work, and it runs on whole GPUs.",
        product: "on-demand",
      },
      {
        id: "tune",
        word: "Fine-tuning",
        say: "Adjusting a ready model to your work.",
        body: "Start from a model that already knows language, and teach it your own words, documents and rules with a smaller set of examples.",
        product: "fine-tuning",
      },
      {
        id: "run",
        word: "Inference",
        say: "Using a model to answer.",
        body: "A question goes in and an answer comes out. It is what your staff and customers see, every time they ask.",
        product: "inferencing",
      },
    ] satisfies { id: "train" | "tune" | "run"; word: string; say: string; body: string; product: AnyProductSlug }[] as {
      id: "train" | "tune" | "run";
      word: string;
      say: string;
      body: string;
      product: AnyProductSlug;
    }[],
  },

  /** A private assistant answering from the organisation's own documents. */
  assistant: {
    kicker: "Private AI",
    title: "An AI assistant that's yours alone.",
    continuation: "It answers from your documents.",
    lead: "Give your team answers from your own files, with the sources shown. It runs in your private workspace in Nepal, and nothing anyone asks is used to train anything.",
    boundary: "Your workspace · Nepal",
    window: "Assistant · private to your organisation",
    pick: "Ask a sample question",
    lock: "Never used for training",
    caption: "Illustration · sample documents",
    docs: [
      { id: 1, name: "Staff handbook", kind: "PDF" },
      { id: 2, name: "Quarterly report", kind: "PDF" },
      { id: 3, name: "Customer email", kind: "Email" },
    ],
    questions: [
      {
        id: "q1",
        chip: "Leave policy",
        ask: "What's our parental leave policy?",
        answer: [
          { text: "Section 4.2 of the staff handbook covers it: who qualifies, how long the leave is, and how to apply.", cite: [1] },
          { text: "HR's request form is in appendix B.", cite: [1] },
        ],
        read: "Staff handbook",
      },
      {
        id: "q2",
        chip: "Summarise a report",
        ask: "Summarise the quarterly report in five points.",
        answer: [
          { text: "1. Demand grew in every region.", cite: [2] },
          { text: "2. Costs rose more slowly than sales.", cite: [2] },
          { text: "3. Two projects ran late.", cite: [2] },
          { text: "4. Hiring is the main risk next quarter.", cite: [2] },
          { text: "5. The board approved the new budget.", cite: [2] },
        ],
        read: "Quarterly report",
      },
      {
        id: "q3",
        chip: "Draft a reply",
        ask: "Draft a reply to this customer, in Nepali and English.",
        answer: [
          {
            text: "हामीलाई लेख्नुभएकोमा धन्यवाद। तपाईंको अर्डर ढिलो आइपुगेकोमा हामी क्षमाप्रार्थी छौं। हामीले डेलिभरी शुल्क फिर्ता गरेका छौं र भोलि तपाईंलाई फोन गरेर पुष्टि गर्नेछौं।",
            lang: "ne",
            cite: [3],
          },
          {
            text: "Thank you for writing to us. We're sorry your order arrived late. We have refunded the delivery charge and will call you tomorrow to confirm.",
            cite: [3],
          },
        ],
        read: "Customer email",
      },
    ] as {
      id: "q1" | "q2" | "q3";
      chip: string;
      ask: string;
      answer: { text: string; lang?: "ne"; cite: number[] }[];
      read: string;
    }[],
    audit: ["Asked by a member of staff", "Read", "Answer saved to your audit log"],
    link: { href: "/products/inferencing", label: "Run your own assistant" },
  },

  cases: {
    kicker: "Use cases",
    title: "Built for the work.",
    continuation: "Teams of every kind.",
    lead: "Customer service in Nepali, private assistants, reading documents, forecasting — the work that should run close to home.",
    link: { href: "/use-cases", label: "All use cases" },
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

  /** Billing, as the receipt a job produces. Sample jobs; rates are quoted per request. */
  receipt: {
    kicker: "Billing",
    title: "Pay for the seconds you use.",
    continuation: "Not the hour you started in.",
    lead: "Every job is metered by the second it runs. Pick a sample job and read its receipt — then see what billing by the hour would have charged.",
    points: [
      "Waiting in a queue is never billed.",
      "Stop the job and the meter stops with it.",
      "Nothing is rounded up to the hour.",
    ],
    jobsLabel: "Sample job",
    modeLabel: "Billed",
    modes: { second: "By the second", hour: "By the hour" },
    jobs: [
      { id: "test", label: "A quick test", ranOn: `1/${v("gpu.migCount")} GPU slice`, start: "10:02:05", seconds: 7 * 60 + 30 },
      { id: "run", label: "A training run", ranOn: "Whole GPU", start: "10:02:05", seconds: 47 * 60 + 12 },
      { id: "long", label: "A long job", ranOn: "Whole GPU", start: "10:02:05", seconds: 3 * 3600 + 12 * 60 + 40 },
    ] as { id: "test" | "run" | "long"; label: string; ranOn: string; start: string; seconds: number }[],
    paper: {
      head: "CoreValley",
      sub: "Usage receipt · illustration",
      compare: "For comparison: billed by the hour",
      job: "Job",
      ranOn: "Ran on",
      started: "Started",
      stopped: "Stopped",
      queue: "Waiting in queue",
      queueValue: "not billed",
      time: "GPU time",
      per: "Billed per",
      perValue: { second: "second", hour: "started hour" },
      minimum: "Minimum",
      rounded: "Rounded up",
      none: "none",
      currency: "Currency",
      margin: "Exchange margin",
      vat: "VAT",
      vatValue: "statutory rate",
      payBy: "Pay by",
      total: "You pay for",
    },
    link: { href: "/pricing", label: "How billing works" },
  },

  /** The facility's uptime commitment, as time. */
  uptime: {
    kicker: "Reliability",
    title: `${v("place.uptime")}, in plain time.`,
    continuation: "Less than an hour a year.",
    lead: `Our datacentre facility commits to ${v("place.uptime")} availability for its power, cooling and building. Spread over a whole year, that leaves room for at most`,
    panels: { year: "One year", day: "One day", allowance: "The allowance" },
    year: "Every square is a day",
    day: "Every dot is a minute",
    allowanceSub: "a year, at most",
    allowanceBody: "less than one hour, out of a whole year.",
    caption: "Facility commitment · illustration",
    link: { href: "/infrastructure#power", label: "The datacentre" },
  },

  /** Growing from a first test to production, on the real hardware. */
  grow: {
    kicker: "Start small",
    title: "Start small. Grow without moving.",
    continuation: "Same account, same data, every step.",
    lead: "Begin with ready-made AI or a slice of a GPU. When the work grows, move up a step — nothing to migrate and nothing to re-learn.",
    stations: [
      { id: "try", step: "Try", title: "Ready-made AI", body: "Call hosted models through an API. No GPUs to manage.", product: "serverless-apis" },
      { id: "slice", step: "Experiment", title: "A slice of a GPU", body: `One of up to ${v("gpu.migCount")} isolated slices of an H200 NVL, billed by the second.`, product: "mig-slicing" },
      { id: "whole", step: "Build", title: "Whole GPUs", body: "Whole GPUs when the work grows, still billed by the second.", product: "on-demand" },
      { id: "reserved", step: "Commit", title: "Reserved capacity", body: "GPUs held for your organisation, for a term you choose.", product: "reserved" },
      { id: "serve", step: "Serve", title: "Your model, live", body: "Put your model behind an endpoint your apps can call.", product: "inferencing" },
    ] satisfies { id: string; step: string; title: string; body: string; product: AnyProductSlug }[] as {
      id: "try" | "slice" | "whole" | "reserved" | "serve";
      step: string;
      title: string;
      body: string;
      product: AnyProductSlug;
    }[],
    same: "Same account · same data · same workspace",
    rope: { label: "Engineers alongside you at every step", product: "services" as AnyProductSlug },
  },

  /** From a brief to a running job. */
  how: {
    kicker: "How to start",
    title: "From a short brief to running.",
    continuation: "With a firm quote in between.",
    steps: [
      {
        title: "Tell us what you want to do",
        body: "In plain words: the task, the data you have and when you need it. It takes about a minute.",
      },
      {
        title: "Get a plan and a firm quote",
        body: "A capacity plan and a firm price in rupees, from our team.",
      },
      {
        title: "Start, with us beside you",
        body: "Your team gets to work, or our engineers help set it up. We run everything underneath.",
      },
    ],
    brief: {
      title: "Your brief",
      fields: [
        { k: "What you want to do", v: "Answer staff questions from our documents" },
        { k: "Your data", v: "Policies, manuals and reports" },
        { k: "When", v: "Next quarter" },
      ],
      send: "Send",
    },
    plan: {
      title: "Capacity plan",
      from: "CoreValley",
      rows: [
        { k: "Compute", v: "GPU slices, by the second" },
        { k: "Storage", v: "Beside the GPUs" },
        { k: "Data location", v: "Kathmandu Valley, Nepal" },
      ],
      total: "Total",
      totalLabel: "the amount in your quote",
      stamp: "Firm quote",
    },
    running: { title: "Your workspace", job: "assistant", state: "running", meter: "Meter" },
    caption: "Illustration",
  },

  climb: {
    kicker: "Start the climb",
    title: "What are you here for?",
    lead: "Pick one. It takes about a minute.",
  },
} as const;
