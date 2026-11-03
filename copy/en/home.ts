/**
 * Home — "The valley is coming online." Written for the people who decide
 * to use AI in any organisation, not the people who operate GPUs. No GPU
 * specifications here; the technical detail lives on /hardware, /platform
 * and the product pages.
 *
 * Below the hero, one idea per section, said in a few words on panes of
 * liquid glass (owner, Nov 2026: simple, nothing that overwhelms, no
 * decorative graphics; the use-case pictures live on /use-cases). Every
 * real number is a fact id (lib/facts.ts); sample content is labelled.
 */
import type { Protection } from "@/components/home/protection-map";
import type { GlyphName } from "@/components/system/dot-glyph";
import type { AnyProductSlug } from "@/copy/en/products";
import { v } from "@/lib/facts";

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

  /** What we do, in one screen: one statement and four things we run. */
  what: {
    kicker: "What we do",
    title: "You bring the idea.",
    continuation: "We run everything else.",
    lead: "Everything AI needs, run for you in Nepal — so your team can start on the work itself.",
    items: [
      { glyph: "hardware", title: "NVIDIA GPUs", body: `${v("gpu.model")}, ready when you are.` },
      { glyph: "infrastructure", title: "A datacentre in Nepal", body: "Hydro-powered, with your data kept in the country." },
      { glyph: "platform", title: "Tools, ready to use", body: "A workspace your team can start in on day one." },
      { glyph: "services", title: "People who run it", body: "Engineers who run the platform, and answer you." },
    ] satisfies { glyph: GlyphName; title: string; body: string }[] as { glyph: GlyphName; title: string; body: string }[],
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
    lead: "Give your team answers from your own files, with the source named. It runs in your private workspace in Nepal, and nothing anyone asks is used to train anything.",
    window: "Assistant",
    private: "Private to your organisation",
    pick: "Try asking",
    source: "Source",
    caption: "Illustration · sample documents",
    questions: [
      {
        id: "q1",
        chip: "Our leave policy",
        ask: "What's our parental leave policy?",
        answer: [
          { text: "Section 4.2 of the staff handbook covers it: who qualifies, how long the leave is, and how to apply." },
          { text: "HR's request form is in appendix B." },
        ],
        read: "Staff handbook, section 4.2",
      },
      {
        id: "q2",
        chip: "Summarise a report",
        ask: "Summarise the quarterly report in three points.",
        answer: [
          { text: "Demand grew in every region, and costs rose more slowly than sales." },
          { text: "Two projects ran late; both now have new dates." },
          { text: "Hiring is the main risk for next quarter." },
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
          },
          {
            text: "Thank you for writing to us. We're sorry your order arrived late. We have refunded the delivery charge and will call you tomorrow to confirm.",
          },
        ],
        read: "The customer's email",
      },
    ] as {
      id: "q1" | "q2" | "q3";
      chip: string;
      ask: string;
      answer: { text: string; lang?: "ne" }[];
      read: string;
    }[],
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

  /** Billing in three words that stick. */
  billing: {
    kicker: "Billing",
    title: "Pay for the seconds you use.",
    continuation: "Not the hour you started in.",
    tiles: [
      { value: "Per second", body: "Stop the job, and the meter stops with it.", note: true },
      { value: "In rupees", body: "Pay digitally, by bank transfer or invoice. No dollar card." },
      { value: "No contract", body: "Start without a commitment. Reserve when the work is steady." },
    ],
    link: { href: "/pricing", label: "How billing works" },
  },

  /** The facility's uptime commitment, as time. */
  uptime: {
    kicker: "Reliability",
    title: `${v("place.uptime")}, in plain time.`,
    continuation: "Less than an hour a year.",
    lead: `Our datacentre facility commits to ${v("place.uptime")} availability for its power, cooling and building.`,
    card: "The allowance",
    sub: "a year, at most",
    body: "Less than one hour, out of a whole year.",
    link: { href: "/infrastructure#power", label: "The datacentre" },
  },

  /** Growing from a first test to production, on the same account. */
  grow: {
    kicker: "Start small",
    title: "Start small. Grow without moving.",
    continuation: "Same account, same data, every step.",
    lead: "Begin with ready-made AI or a slice of a GPU. When the work grows, move up a step — nothing to migrate and nothing to re-learn.",
    stations: [
      { title: "Ready-made AI", body: "Call hosted models through an API. No GPUs to manage.", product: "serverless-apis" },
      { title: "A slice of a GPU", body: `One of up to ${v("gpu.migCount")} isolated slices, billed by the second.`, product: "mig-slicing" },
      { title: "Whole GPUs", body: "Whole GPUs when the work grows, still by the second.", product: "on-demand" },
      { title: "Reserved capacity", body: "GPUs held for your organisation, for a term you choose.", product: "reserved" },
      { title: "Your model, live", body: "Put your model behind an endpoint your apps can call.", product: "inferencing" },
    ] satisfies { title: string; body: string; product: AnyProductSlug }[] as {
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
        body: `A capacity plan and a firm price in rupees, from our team, ${v("contact.reply").toLowerCase()}.`,
      },
      {
        title: "Start, with us beside you",
        body: "Your team gets to work, or our engineers help set it up. We run everything underneath.",
      },
    ],
    action: { href: "/contact?intent=workloads", label: "Request access" },
  },

  climb: {
    kicker: "Start the climb",
    title: "What are you here for?",
    lead: "Pick one. It takes about a minute.",
  },
} as const;
