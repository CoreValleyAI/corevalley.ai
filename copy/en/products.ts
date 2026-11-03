/**
 * The six things we sell — the only home of product copy (docs/revamp/03 §3).
 * /products, the product pages, the header's mega panel, the home page's
 * product chapter and the contact form's choices all read from here.
 *
 * Accuracy (docs/revamp/04 §2): customers work in one AI workspace on
 * NVIDIA H200 NVL GPUs. CTO ruling, 14 Oct 2026: no detailed specifications
 * — no GPU or server counts, server, network or storage details, platform
 * product names or software licensing. Numbers come from lib/facts.ts by id.
 */
import type { FactId } from "@/lib/facts";
import { v } from "@/lib/facts";
import type { GlyphName } from "@/components/system/dot-glyph";

export type ProductSlug = "reserved" | "on-demand" | "inferencing" | "mig-slicing" | "storage" | "services";

/** Catalogue offerings with a page of their own beyond the six core products. */
export type MoreProductSlug =
  | "serverless-apis"
  | "fine-tuning"
  | "platform"
  | "orchestration"
  | "applications"
  | "modelops"
  | "infrastructure-as-a-service"
  | "networking";

export type AnyProductSlug = ProductSlug | MoreProductSlug;

export interface Product<S extends AnyProductSlug = ProductSlug> {
  slug: S;
  name: string;
  /** One line for menus and cards. */
  promise: string;
  /** The hero headline (≤ 6 words). */
  tagline: string;
  /** The hero lead (≤ 30 words). */
  summary: string;
  glyph: GlyphName;
  bestFor: string;
  billing: string;
  commitment: string;
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  /** At most three key specs; the full sheet lives on /hardware. */
  specs: FactId[];
  faq: { q: string; a: string }[];
  meta: { title: string; description: string };
  /** Who it's for, in plain words: one card per kind of team. */
  audience?: { title: string; body: string }[];
  /** Real jobs it does, one line each. */
  examples?: string[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "reserved",
    name: "Reserved GPUs",
    promise: "H200 NVL capacity held for you, for a term.",
    tagline: "Capacity that's yours alone.",
    summary:
      "Reserve NVIDIA H200 NVL GPUs for a term you choose. They are held for your organisation the whole time, and nobody else's work runs on them.",
    glyph: "reserved",
    bestFor: "Steady training, regulated data, production",
    audience: [
      { title: "Banks and insurers", body: "Capacity that only your organisation uses, for work that answers to a regulator." },
      { title: "Teams with steady work", body: "Training and serving that run every day cost less on a term than by the second." },
      { title: "Public sector", body: "Dedicated, in-country GPUs with a fixed rupee budget for the year." },
    ],
    examples: [
      "A bank's fraud and credit models, trained and served all year",
      "A production assistant that must always have capacity",
      "A research programme with a fixed budget and timeline",
    ],
    billing: "A fixed rate for the term, in NPR",
    commitment: "A term you choose",
    steps: [
      { title: "Tell us the work", body: "The models, the data and the deadline. A few sentences is enough." },
      {
        title: "Get a capacity plan",
        body: "GPUs, storage and term, with a firm quote in rupees within one working day.",
      },
      {
        title: "Run on capacity held for you",
        body: "Your GPUs are reserved for you from the first day of the term to the last.",
      },
    ],
    features: [
      {
        title: "Held for the whole term",
        body: "No queue and no contention: the GPUs are yours from the first day of the term to the last.",
      },
      {
        title: "From one GPU to a whole server",
        body: "Reserve a single H200 NVL, or several of them.",
      },
      {
        title: "Nobody else on your GPUs",
        body: "Reserved GPUs run only your organisation's work, which keeps tenancy questions simple.",
      },
      {
        title: "The same workspace",
        body: "Notebooks, pipelines, training and serving in your workspace, on GPUs that are always there.",
      },
      {
        title: "Data that stays in Nepal",
        body: "Datasets, checkpoints and models stay in our datacentre in the Kathmandu Valley.",
      },
      {
        title: "Rates set by the term",
        body: "Your quote shows the rate for the term up front, in rupees, with nothing added later.",
      },
    ],
    specs: ["gpu.model", "gpu.memory", "gpu.bandwidth"],
    faq: [
      {
        q: "How long is a term?",
        a: "You choose. Tell us how long you need the capacity and we quote the term in rupees.",
      },
      {
        q: "Does anyone else use our GPUs?",
        a: "No. Reserved GPUs run only your organisation's work for the whole term.",
      },
      {
        q: "What do we work in?",
        a: "The same AI workspace as every CoreValley product: JupyterLab, Kubeflow, Ray, MLflow, KServe and more, ready on day one.",
      },
    ],
    meta: {
      title: "Reserved GPUs — NVIDIA H200 NVL held for your organisation",
      description:
        "Reserve NVIDIA H200 NVL GPUs in the Kathmandu Valley for a term you choose. Held for you alone, quoted in NPR, data kept in Nepal.",
    },
  },
  {
    slug: "on-demand",
    name: "On-demand GPUs",
    promise: "Whole H200 NVL GPUs when you need them, by the second.",
    tagline: "Whole GPUs, by the second.",
    summary:
      "Use an NVIDIA H200 NVL when the work needs one and stop when it's done. You pay for the seconds it runs, with a 60-second minimum, in rupees.",
    glyph: "on-demand",
    bestFor: "Experiments, fine-tunes, bursts of training",
    audience: [
      { title: "Data scientists", body: "Start a GPU for an experiment and stop it when you have the answer." },
      { title: "Startups", body: "Big GPUs when you need them, with no contract and no minimum term." },
      { title: "Project teams", body: "A burst of training before a deadline, then back to zero." },
    ],
    examples: [
      "Fine-tuning an open model over a weekend",
      "Testing whether an idea works before committing to it",
      "A one-off training run on a new dataset",
    ],
    billing: "Per second, 60-second minimum",
    commitment: "None",
    steps: [
      { title: "Open your workspace", body: "A notebook or a pipeline, ready when you sign in." },
      { title: "Start on an H200 NVL", body: "One GPU, or several for a bigger job." },
      { title: "Stop, and the meter stops", body: "You pay for the seconds the work ran, in rupees." },
    ],
    features: [
      {
        title: "Billed by the second",
        body: "No rounding up to the hour. Stop the job and the meter stops with it, after a 60-second minimum.",
      },
      {
        title: "141 GB on every GPU",
        body: "Room for large models and long contexts on a single card, at 4.8 TB/s.",
      },
      {
        title: "Notebooks and pipelines",
        body: "JupyterLab, Kubeflow pipelines and Ray jobs, ready in your workspace.",
      },
      {
        title: "No commitment",
        body: "Nothing to reserve and no contract. When the work turns steady, reserved capacity costs less.",
      },
      {
        title: "Close to your data",
        body: "Storage sits beside the GPUs in the same datacentre, so data never crosses a border to be read.",
      },
    ],
    specs: ["gpu.memory", "gpu.bandwidth", "billing.minimum"],
    faq: [
      {
        q: "What is the smallest charge?",
        a: "Sixty seconds. After that you pay for each second the work runs.",
      },
      {
        q: "Can we use more than one GPU?",
        a: "Yes. Ask for the number of GPUs a job needs when you request access, and we plan capacity for it.",
      },
    ],
    meta: {
      title: "On-demand GPUs — NVIDIA H200 NVL by the second",
      description:
        "NVIDIA H200 NVL GPUs in the Kathmandu Valley when you need them, billed per second in NPR with a 60-second minimum.",
    },
  },
  {
    slug: "inferencing",
    name: "Inferencing",
    promise: "Serve models in Nepal with NVIDIA NIM and KServe.",
    tagline: "Your models, served in Nepal.",
    summary:
      "Put models behind an endpoint with NVIDIA NIM microservices and KServe, on GPUs in the Kathmandu Valley. Prompts and answers are processed in Nepal.",
    glyph: "inferencing",
    bestFor: "AI features in production, internal assistants",
    audience: [
      { title: "Banks and finance", body: "Assistants and document AI whose prompts never leave Nepal." },
      { title: "Product teams", body: "Your own model behind a stable endpoint, scaled for your traffic." },
      { title: "Internal IT", body: "Private assistants for staff, on your organisation's own endpoint." },
    ],
    examples: [
      "A staff assistant that answers from internal policies",
      "A fraud score returned with every transaction",
      "Your fine-tuned model serving a customer app",
    ],
    billing: "GPU time or a reserved endpoint, in NPR",
    commitment: "None, or a reserved endpoint",
    steps: [
      { title: "Pick a model", body: "An NVIDIA NIM microservice for a popular open model, or your own." },
      { title: "Deploy an endpoint", body: "With NVIDIA NIM or KServe." },
      { title: "Call it from your app", body: "From inside Nepal, with low latency." },
    ],
    features: [
      {
        title: "NVIDIA NIM microservices",
        body: "Optimised containers for popular open models.",
      },
      {
        title: "Your own models too",
        body: "Serve fine-tuned or custom models with KServe.",
      },
      {
        title: "Familiar APIs",
        body: "NIM language-model endpoints follow the OpenAI API format, so existing client code carries over.",
      },
      {
        title: "Right-sized",
        body: "Smaller models can run on a MIG slice instead of a whole H200 NVL.",
      },
      {
        title: "In-country by design",
        body: "Requests are processed on GPUs inside the Kathmandu Valley, under Nepal's law.",
      },
    ],
    specs: ["gpu.model", "gpu.memory", "place.latency"],
    faq: [
      {
        q: "Which models can we serve?",
        a: "Open models available as NVIDIA NIM microservices, and your own models through KServe. Tell us what you want to run and we confirm it fits.",
      },
      {
        q: "Do prompts leave Nepal?",
        a: "No. Endpoints run on our GPUs in the Kathmandu Valley, so prompts and answers are processed there.",
      },
    ],
    meta: {
      title: "Inferencing — serve AI models in Nepal",
      description:
        "Serve open and custom models with NVIDIA NIM and KServe on NVIDIA H200 NVL GPUs in the Kathmandu Valley. Prompts and answers processed in Nepal.",
    },
  },
  {
    slug: "mig-slicing",
    name: "MIG slicing",
    promise: "Up to seven isolated GPUs from one H200 NVL.",
    tagline: "One H200, up to seven GPUs.",
    summary:
      "NVIDIA Multi-Instance GPU splits one H200 NVL into as many as seven slices, each with its own memory and compute, isolated in hardware. Pay for the slice, not the card.",
    glyph: "mig-slicing",
    bestFor: "Notebooks, teaching, small models",
    audience: [
      { title: "Universities", body: "Give every student an isolated GPU of their own, from one card." },
      { title: "Small models", body: "Serve a compact model on a slice instead of paying for a whole GPU." },
      { title: "Data scientists", body: "A private GPU slice for notebook work, billed by the second." },
    ],
    examples: [
      "A class of students, each with a private GPU slice",
      "A small classification model serving a web app",
      "Day-to-day notebook work on a right-sized GPU",
    ],
    billing: "Per second, per slice",
    commitment: "None",
    steps: [
      { title: "Choose a slice size", body: "From one seventh of an H200 NVL up to the whole card." },
      { title: "Work as on any GPU", body: "Notebooks, training and serving see the slice as a GPU of its own." },
      { title: "Grow when you need to", body: "Move the same work to whole GPUs when it outgrows the slice." },
    ],
    features: [
      {
        title: "Up to seven slices",
        body: "As small as 16.5 GB each, or fewer, larger slices when a job needs more memory.",
      },
      {
        title: "Isolated in hardware",
        body: "Each slice has its own memory and compute. A neighbour's crash or out-of-memory error never reaches yours.",
      },
      {
        title: "Sized to the job",
        body: "Run a notebook or a small model on a slice that fits, so a whole GPU never sits half idle.",
      },
      {
        title: "Made for classrooms",
        body: "Give every student or researcher an isolated GPU of their own, from one card.",
      },
    ],
    specs: ["gpu.migCount", "gpu.migSize", "gpu.memory"],
    faq: [
      {
        q: "What is MIG?",
        a: "Multi-Instance GPU, an NVIDIA feature that partitions one GPU into separate instances, each with dedicated memory and compute.",
      },
      {
        q: "How small can a slice be?",
        a: "One seventh of an H200 NVL: 16.5 GB of memory with its own share of compute.",
      },
    ],
    meta: {
      title: "MIG slicing — up to seven GPUs from one H200 NVL",
      description:
        "Split an NVIDIA H200 NVL into up to seven hardware-isolated GPU slices of 16.5 GB with NVIDIA MIG. Billed per second, per slice, in NPR.",
    },
  },
  {
    slug: "storage",
    name: "Storage",
    promise: "Fast storage beside the GPUs, in Nepal.",
    tagline: "Your data, beside the GPUs.",
    summary:
      "Fast storage in the same datacentre as the GPUs, with S3-compatible object and file access. Datasets, checkpoints and models are kept safe, in Nepal.",
    glyph: "storage",
    bestFor: "Datasets, checkpoints, model weights",
    audience: [
      { title: "Every AI team", body: "Keep data next to the GPUs so jobs start fast and nothing is uploaded twice." },
      { title: "Regulated organisations", body: "Datasets stored in Nepal, isolated from other customers." },
      { title: "Researchers", body: "Large shared datasets read by every member of a lab." },
    ],
    examples: [
      "Years of transaction history kept for model training",
      "Model checkpoints saved during long training runs",
      "A shared library of documents for a Nepali-language model",
    ],
    billing: "By capacity, in NPR",
    commitment: "None",
    steps: [
      { title: "Bring your data", body: "Upload once, with the S3 tools you already use." },
      { title: "Read it from every job", body: "Notebooks, pipelines and endpoints work from the same copy." },
      { title: "Keep what matters", body: "Checkpoints and models stay beside the GPUs, in Nepal." },
    ],
    features: [
      {
        title: "Fast, beside the GPUs",
        body: "Storage in the same datacentre as the GPUs, so jobs read data without a long trip.",
      },
      {
        title: "S3-compatible",
        body: "Object storage that works with the S3 tools and libraries you already have, plus file access.",
      },
      {
        title: "Safe with us",
        body: "Isolated from other customers, and never copied abroad.",
      },
    ],
    specs: ["place.location"],
    faq: [
      {
        q: "Can we use our existing S3 tools?",
        a: "Yes. The object storage is S3-compatible, so the usual command-line tools and SDKs work.",
      },
      {
        q: "Where is the data kept?",
        a: "In our datacentre in Nepal, beside the GPUs.",
      },
    ],
    meta: {
      title: "Storage — S3-compatible, beside the GPUs, in Nepal",
      description:
        "Fast storage beside NVIDIA H200 NVL GPUs in Nepal, with S3-compatible object and file access. Your data is kept safe, in Nepal.",
    },
  },
  {
    slug: "services",
    name: "Services & engineering",
    promise: "Engineers in Kathmandu, on your project.",
    tagline: "Engineers in Kathmandu, on your project.",
    summary:
      "Help from the people who run the GPUs: sizing capacity, moving work from another cloud, getting a model trained and into production, and setting up GPUs for a class or a lab.",
    glyph: "services",
    bestFor: "Enterprises, public sector, universities",
    audience: [
      { title: "Organisations new to AI", body: "We help you pick the first project and get it running." },
      { title: "Teams moving from abroad", body: "We move your training and serving home and check it runs the same." },
      { title: "Universities", body: "GPU labs for a class or a department, set up and supported." },
    ],
    examples: [
      "A bank's first AI project, from idea to production",
      "Moving a model from an overseas cloud to Nepal",
      "A GPU lab for a university course",
    ],
    billing: "Scoped and quoted in NPR",
    commitment: "Per engagement",
    steps: [
      { title: "Tell us the goal", body: "A migration, a first model in production, a GPU lab for a class." },
      { title: "Agree the scope", body: "What we'll do, by when, quoted in rupees." },
      { title: "Work with us", body: "Engineers in Kathmandu, on Nepal time, alongside your team." },
    ],
    features: [
      {
        title: "Capacity planning",
        body: "Tell us the model, the data and the deadline. We size the GPUs, storage and term, and quote it in rupees.",
      },
      {
        title: "Migration from another cloud",
        body: "We help move training, data and serving to the Kathmandu Valley and check it runs the same here.",
      },
      {
        title: "From training to production",
        body: "Hands-on help to get a fine-tune running and the model behind an endpoint.",
      },
      {
        title: "GPUs for teaching and research",
        body: "GPU access for a class, a lab or a department, with an isolated slice per person.",
      },
      {
        title: "On Nepal time",
        body: "Engineers in Kathmandu, working on Nepal Standard Time (UTC+05:45).",
      },
    ],
    specs: ["place.timezone", "contact.reply"],
    faq: [
      {
        q: "Do we need services to use the GPUs?",
        a: "No. They are there for teams who want help; many will not need them.",
      },
      {
        q: "How is it priced?",
        a: "Each engagement is scoped and quoted in rupees before it starts.",
      },
    ],
    meta: {
      title: "Services & engineering — engineers in Kathmandu",
      description:
        "Capacity planning, migration, training and deployment help from CoreValley engineers in Kathmandu, on Nepal time. Scoped and quoted in NPR.",
    },
  },
];

/* ── More products: every catalogue offering gets a page of its own ──────
   Same shape and the same guardrails as the six above: plain words first,
   no counts or capacities, numbers only by fact id. */

export const MORE_PRODUCTS: Product<MoreProductSlug>[] = [
  {
    slug: "serverless-apis",
    name: "Serverless APIs",
    promise: "Hosted open models, one API call away.",
    tagline: "AI in your app, one call away.",
    summary:
      "Call hosted open models for text, speech and vision through a simple API. No GPUs to size, start or stop — and every request is processed in Nepal.",
    glyph: "token",
    bestFor: "Adding AI features to apps and websites",
    billing: "By usage, in NPR",
    commitment: "None",
    audience: [
      { title: "App and web teams", body: "Add a chat assistant, a summary button or a Nepali voice feature without hiring an AI team." },
      { title: "Banks and insurers", body: "Read forms, classify messages and draft replies, with customer data processed inside Nepal." },
      { title: "Startups", body: "Try an idea in an afternoon and pay only for the requests you make." },
    ],
    examples: [
      "A customer-service assistant that answers in Nepali and English",
      "Summaries of long reports and loan files",
      "Turning scanned forms into structured data",
      "Speech to text for call-centre recordings",
    ],
    steps: [
      { title: "Get an API key", body: "From your workspace, once access is open." },
      { title: "Pick a model", body: "Open models for text, speech and vision, hosted and ready." },
      { title: "Call it from your app", body: "With the OpenAI-style client code you may already have." },
    ],
    features: [
      {
        title: "No GPUs to manage",
        body: "We keep the models running and scaled. You send a request and get an answer.",
      },
      {
        title: "Familiar API format",
        body: "Language-model endpoints follow the OpenAI API format, so existing client libraries carry over.",
      },
      {
        title: "Text, speech and vision",
        body: "Chat, summarise and classify text, transcribe speech, and read images and documents.",
      },
      {
        title: "Processed in Nepal",
        body: "Prompts and answers are handled on GPUs in our Kathmandu Valley datacentre, never sent abroad.",
      },
      {
        title: "Pay for what you call",
        body: "Usage-based billing in rupees, with no reservation and no minimum term.",
      },
      {
        title: "Grow into your own model",
        body: "When you need a model of your own, move to managed inference on the same platform.",
      },
    ],
    specs: ["place.location", "place.latency", "billing.currency"],
    faq: [
      {
        q: "Which models are available?",
        a: "A selection of popular open models for text, speech and vision. Tell us what you need and we confirm it is available.",
      },
      {
        q: "Do our prompts leave Nepal?",
        a: "No. Requests are processed on GPUs in our datacentre in the Kathmandu Valley.",
      },
      {
        q: "Do you train on our requests?",
        a: "No. We never train anything on your prompts or answers.",
      },
    ],
    meta: {
      title: "Serverless APIs — hosted AI models, processed in Nepal",
      description:
        "Call hosted open models for text, speech and vision through an OpenAI-style API. No GPUs to manage, usage billed in NPR, requests processed in Nepal.",
    },
  },
  {
    slug: "fine-tuning",
    name: "Fine-tuning",
    promise: "Adapt open models to your own data.",
    tagline: "A model that knows your work.",
    summary:
      "Teach an open model your organisation's language, documents and rules, then serve it from the same place. Your data and the resulting model stay yours, in Nepal.",
    glyph: "use-cases",
    bestFor: "Models that need your terms, tone or language",
    billing: "GPU time used, per second, in NPR",
    commitment: "None",
    audience: [
      { title: "Banks and finance", body: "A model that understands your products, forms and compliance language." },
      { title: "Public sector", body: "Models tuned to Nepali documents and services, without data leaving the country." },
      { title: "Product teams", body: "A smaller, cheaper model that does one job as well as a big one." },
    ],
    examples: [
      "An assistant that answers from your policy manuals",
      "A classifier for complaints, by product and urgency",
      "A Nepali-language model for your own domain",
    ],
    steps: [
      { title: "Bring your data", body: "Examples of the work, uploaded once to storage beside the GPUs." },
      { title: "Tune an open model", body: "In a notebook or a pipeline, on whole GPUs or slices." },
      { title: "Serve what you made", body: "Put the tuned model behind an endpoint, on the same platform." },
    ],
    features: [
      {
        title: "Start from an open model",
        body: "Begin with a capable open model rather than training from scratch.",
      },
      {
        title: "Notebooks or pipelines",
        body: "Experiment in JupyterLab, then repeat the run as a Kubeflow pipeline.",
      },
      {
        title: "Every run tracked",
        body: "Settings, data versions and results are recorded in MLflow, so you can compare and repeat.",
      },
      {
        title: "Your weights are yours",
        body: "The data you bring and the model you make belong to you. We never use them for anything else.",
      },
      {
        title: "Serve from the same place",
        body: "No export and re-upload: deploy the tuned model with managed inference.",
      },
      {
        title: "Pay by the second",
        body: "Fine-tuning runs on on-demand GPUs, billed per second in rupees.",
      },
    ],
    specs: ["gpu.model", "gpu.memory", "billing.unit"],
    faq: [
      {
        q: "How much data do we need?",
        a: "Often less than people expect: hundreds to a few thousand good examples. We can help you judge yours.",
      },
      {
        q: "Who owns the fine-tuned model?",
        a: "You do. Your data and the resulting weights are yours.",
      },
      {
        q: "Can you do it for us?",
        a: "Yes. Our engineering services can plan and run the fine-tune with your team.",
      },
    ],
    meta: {
      title: "Fine-tuning — adapt open models to your data, in Nepal",
      description:
        "Fine-tune open models on your own data on NVIDIA H200 NVL GPUs in the Kathmandu Valley. Every run tracked, your weights stay yours, billed per second in NPR.",
    },
  },
  {
    slug: "platform",
    name: "Platform as a Service",
    promise: "A managed AI workspace, run by us.",
    tagline: "Your AI workspace, ready to use.",
    summary:
      "A private workspace with everything a data team needs to build and run AI: notebooks, pipelines, training and serving. We run the machines, the updates and the security underneath.",
    glyph: "platform",
    bestFor: "Data and AI teams who want to build, not administer",
    billing: "GPU time and storage used, in NPR",
    commitment: "None, or a reserved term",
    audience: [
      { title: "Data teams in banks", body: "Build risk and fraud models on customer data that never leaves Nepal." },
      { title: "Universities and labs", body: "One workspace for a department, with fair GPU access for everyone." },
      { title: "Growing companies", body: "Get a full AI toolset on day one, without hiring people to run servers." },
    ],
    examples: [
      "Fraud and credit-risk models, from notebook to production",
      "A research group sharing GPUs fairly",
      "Nightly retraining of a forecasting model",
    ],
    steps: [
      { title: "Sign in", body: "Your organisation gets its own private workspace." },
      { title: "Build", body: "Notebooks, pipelines and training, on whole GPUs or slices." },
      { title: "Ship", body: "Put models behind endpoints and watch them in the same place." },
    ],
    features: [
      {
        title: "Everything in one place",
        body: "Notebooks, pipelines, training, serving and data tools, ready when you sign in.",
      },
      {
        title: "Private to your organisation",
        body: "Your workspace is isolated from other customers. Only the people you invite can reach it.",
      },
      {
        title: "We run the platform",
        body: "Upgrades, scheduling, monitoring and security are our job. Your team works on models.",
      },
      {
        title: "See use and spend",
        body: "Watch GPU use, job health and cost as they happen, before the invoice arrives.",
      },
      {
        title: "Grows with you",
        body: "Start on a slice of a GPU and move to whole or reserved GPUs without changing tools.",
      },
      {
        title: "Help in Nepal time",
        body: "Engineers in Kathmandu who know the platform because they run it.",
      },
    ],
    specs: ["gpu.model", "place.location", "billing.unit"],
    faq: [
      {
        q: "Do we need Kubernetes skills?",
        a: "No. We run the cluster underneath; your team works in notebooks, pipelines and endpoints.",
      },
      {
        q: "Which tools are included?",
        a: "JupyterLab, Kubeflow, Airflow, Ray, Spark, MLflow, KServe, NVIDIA NIM, Presto, Superset and TensorFlow, among others.",
      },
      {
        q: "Can other customers see our work?",
        a: "No. Each organisation has its own isolated workspace.",
      },
    ],
    meta: {
      title: "Platform as a Service — a managed AI workspace in Nepal",
      description:
        "A private, managed AI workspace with notebooks, pipelines, training and serving on NVIDIA H200 NVL GPUs in the Kathmandu Valley. We run the platform; billed in NPR.",
    },
  },
  {
    slug: "orchestration",
    name: "AI orchestration",
    promise: "Pipelines and scheduled jobs, run for you.",
    tagline: "Work that runs itself.",
    summary:
      "Turn one-off notebook work into pipelines that run on a schedule or on demand: prepare the data, train, check and publish, in order, every time.",
    glyph: "water",
    bestFor: "Repeatable training and data jobs",
    billing: "GPU time used, per second, in NPR",
    commitment: "None",
    audience: [
      { title: "Analytics teams", body: "Refresh models and reports every night without anyone pressing a button." },
      { title: "ML engineers", body: "Spread big jobs across many GPUs with Ray, without managing a cluster." },
      { title: "Operations", body: "Know that every step ran, in order, with a record of what happened." },
    ],
    examples: [
      "Retrain a fraud model every night on the day's transactions",
      "Clean and load new data every morning before work starts",
      "Run a large evaluation across several GPUs at once",
    ],
    steps: [
      { title: "Describe the steps", body: "As a Kubeflow pipeline, an Airflow schedule or a Ray job." },
      { title: "Set when it runs", body: "On a schedule, when new data arrives, or by hand." },
      { title: "Watch it run", body: "Each step's status, logs and results in one view." },
    ],
    features: [
      { title: "Kubeflow pipelines", body: "Chain data preparation, training and checks into one repeatable run." },
      { title: "Airflow scheduling", body: "Run workflows on a timetable, with retries when a step fails." },
      { title: "Ray for scale", body: "Spread work across several GPUs from ordinary Python code." },
      { title: "From notebook to pipeline", body: "Kale turns a working notebook into a pipeline without rewriting it." },
      { title: "Only pay while it runs", body: "GPUs are used for the steps that need them and billed by the second." },
    ],
    specs: ["billing.unit", "billing.minimum", "place.location"],
    faq: [
      {
        q: "Do we have to use all three tools?",
        a: "No. Use whichever fits: Kubeflow for ML pipelines, Airflow for schedules, Ray for distributed work.",
      },
      {
        q: "What happens if a step fails?",
        a: "The run stops at that step, keeps the logs, and can retry or resume from there.",
      },
    ],
    meta: {
      title: "AI orchestration — Kubeflow, Airflow and Ray, run for you",
      description:
        "Pipelines and scheduled AI jobs with Kubeflow, Airflow and Ray on NVIDIA H200 NVL GPUs in Nepal. Repeatable, recorded, billed per second in NPR.",
    },
  },
  {
    slug: "applications",
    name: "Applications",
    promise: "The apps your team opens every day.",
    tagline: "Familiar tools, already installed.",
    summary:
      "JupyterLab, Spark, Presto, Superset and TensorFlow, set up and ready when you sign in. Nothing to install, and every tool works next to your data and the GPUs.",
    glyph: "docs",
    bestFor: "Analysts, data scientists, students",
    billing: "Included with your workspace; GPU time and storage in NPR",
    commitment: "None",
    audience: [
      { title: "Analysts", body: "Query data with SQL and build dashboards without moving it anywhere." },
      { title: "Data scientists", body: "Open a notebook on a GPU in seconds, with the usual libraries ready." },
      { title: "Students and teachers", body: "Everyone in a class gets the same tools, without setup on their laptops." },
    ],
    examples: [
      "A management dashboard of loan performance, refreshed daily",
      "Exploring a new dataset in a notebook on a GPU slice",
      "A semester-long course where every student has a notebook",
    ],
    steps: [
      { title: "Sign in", body: "Your workspace opens with the tools already there." },
      { title: "Open a tool", body: "A notebook, a SQL query or a dashboard." },
      { title: "Work beside your data", body: "Read data from storage in the same datacentre." },
    ],
    features: [
      { title: "JupyterLab", body: "Notebooks on CPUs or GPUs, with the common Python libraries ready." },
      { title: "Spark and Presto", body: "Process large datasets and query them with plain SQL." },
      { title: "Superset dashboards", body: "Charts and dashboards for the people who read the results." },
      { title: "TensorFlow ready", body: "A widely used framework, installed and tested on our GPUs." },
      { title: "Nothing to maintain", body: "We keep the tools updated and working together." },
    ],
    specs: ["place.location", "billing.currency"],
    faq: [
      {
        q: "Can we install our own libraries?",
        a: "Yes. Add the packages your work needs inside your workspace.",
      },
      {
        q: "Do the tools cost extra?",
        a: "The tools come with the workspace. You pay for the GPU time and storage you use.",
      },
    ],
    meta: {
      title: "Applications — JupyterLab, Spark, Superset, ready in Nepal",
      description:
        "JupyterLab, Spark, Presto, Superset and TensorFlow, ready in your CoreValley workspace beside your data and NVIDIA GPUs in Nepal.",
    },
  },
  {
    slug: "modelops",
    name: "ModelOps",
    promise: "Track, tune and register models.",
    tagline: "Know which model is which.",
    summary:
      "Keep a record of every experiment, find the best settings automatically, and register the models you trust before they go live. The paper trail auditors ask for, built in.",
    glyph: "blog",
    bestFor: "Teams running models in production",
    billing: "Included with your workspace; GPU time in NPR",
    commitment: "None",
    audience: [
      { title: "Regulated teams", body: "Show which data and settings produced the model in production." },
      { title: "ML teams", body: "Compare experiments side by side and stop losing good results." },
      { title: "Managers", body: "See which models are live, who approved them and when." },
    ],
    examples: [
      "A model registry with an approval step before go-live",
      "Automatic search for the best training settings overnight",
      "An audit answer: which data trained this model?",
    ],
    steps: [
      { title: "Track", body: "Every run records its settings, data and results in MLflow." },
      { title: "Tune", body: "Katib tries settings for you and reports the best." },
      { title: "Register", body: "Promote the model you trust, with its history attached." },
    ],
    features: [
      { title: "Experiment tracking", body: "MLflow records parameters, metrics and files for every run." },
      { title: "Model registry", body: "Versioned models with stages, from test to production." },
      { title: "Automatic tuning", body: "Katib searches for better settings while you do other work." },
      { title: "Notebooks into pipelines", body: "Kale turns the notebook that worked into a repeatable pipeline." },
      { title: "An audit trail", body: "A clear record of what was trained, on what, and by whom." },
    ],
    specs: ["place.location", "billing.unit"],
    faq: [
      {
        q: "Is this separate from the workspace?",
        a: "No. ModelOps tools are part of your workspace and work with its notebooks and pipelines.",
      },
      {
        q: "Can we keep using our own MLflow habits?",
        a: "Yes. It is standard MLflow, so existing code and habits carry over.",
      },
    ],
    meta: {
      title: "ModelOps — MLflow tracking and registry, Katib tuning, in Nepal",
      description:
        "Track experiments, tune automatically and register models with MLflow, Katib and Kale in your CoreValley workspace in Nepal.",
    },
  },
  {
    slug: "infrastructure-as-a-service",
    name: "Infrastructure as a Service",
    promise: "Compute, network and storage, set up for you.",
    tagline: "The whole setup, ready for you.",
    summary:
      "GPU compute together with the networking and storage it needs, set up for your organisation in a hydro-powered datacentre in Nepal, and run by our engineers.",
    glyph: "infrastructure",
    bestFor: "IT teams who want control without a datacentre",
    billing: "By usage or a reserved term, in NPR",
    commitment: "None, or a reserved term",
    audience: [
      { title: "Bank IT", body: "Compute for AI that sits under Nepal's law, without building a server room." },
      { title: "Government and public bodies", body: "In-country infrastructure with clear boundaries and audit." },
      { title: "Software companies", body: "Host AI features close to Nepali users, with a rupee bill." },
    ],
    examples: [
      "An isolated environment for a bank's AI projects",
      "Moving AI workloads home from an overseas cloud",
      "A private setup for a ministry's document processing",
    ],
    steps: [
      { title: "Tell us the requirements", body: "Workloads, data, security and how long you need it." },
      { title: "We set it up", body: "Compute, private networking and storage, isolated for you." },
      { title: "You run your work", body: "We keep the power, cooling and hardware running underneath." },
    ],
    features: [
      { title: "Isolated from other customers", body: "Your own network and storage boundaries, set up for you." },
      { title: "Hydro-powered", body: "The datacentre runs on Nepal's hydropower." },
      { title: "A facility uptime commitment", body: `${v("place.uptime")} for power, cooling and the building.` },
      { title: "Run by our engineers", body: "Hardware, firmware and facilities are looked after in Kathmandu." },
      { title: "Under Nepal's law", body: "Data is stored and processed in Nepal and never copied abroad." },
    ],
    specs: ["place.uptime", "place.power", "place.location"],
    faq: [
      {
        q: "Is this bare metal?",
        a: "It is GPU compute with networking and storage, set up for your organisation. Tell us what level of control you need and we plan it.",
      },
      {
        q: "Can we connect it to our office network?",
        a: "Yes, private connectivity can be planned as part of the setup.",
      },
    ],
    meta: {
      title: "Infrastructure as a Service — GPU compute in Nepal",
      description:
        "GPU compute with networking and storage, set up for your organisation in a hydro-powered datacentre in the Kathmandu Valley. Under Nepal's law, billed in NPR.",
    },
  },
  {
    slug: "networking",
    name: "Network as a Service",
    promise: "Private networking, close to your users.",
    tagline: "A private network, close to home.",
    summary:
      "Private networking for your AI workloads, inside the Kathmandu Valley. Nothing reaches your work unless you allow it, and your users get fast answers because the trip is short.",
    glyph: "contact",
    bestFor: "Apps with users in Nepal; regulated workloads",
    billing: "Included with your workloads; dedicated links quoted in NPR",
    commitment: "None",
    audience: [
      { title: "Customer-facing apps", body: "Fast responses for users in Nepal, because the servers are here too." },
      { title: "Security teams", body: "Default-closed networking with rules you set and can review." },
      { title: "Enterprises", body: "Connect your own offices or datacentre privately." },
    ],
    examples: [
      "A banking app's AI features answering in milliseconds",
      "A private link from head office to your workspace",
      "Workloads that may only talk to approved systems",
    ],
    steps: [
      { title: "Get a private network", body: "Every customer has their own, closed by default." },
      { title: "Set the rules", body: "Choose what may reach your work and what it may reach." },
      { title: "Connect your users", body: "Through the internet or a private link, inside the valley." },
    ],
    features: [
      { title: "Private by default", body: "Nothing reaches your work unless you allow it." },
      { title: "Close to your users", body: `A round trip inside the Kathmandu Valley typically takes ${v("place.latency")}.` },
      { title: "Your rules", body: "Control what goes in and out, and review it at any time." },
      { title: "Private connections", body: "Connect offices or your own datacentre without the public internet." },
    ],
    specs: ["place.latency", "place.location"],
    faq: [
      {
        q: "Why does distance matter?",
        a: "Every request travels to the server and back. Inside the valley that trip is short, so apps feel faster than when served from abroad.",
      },
      {
        q: "Can we restrict outbound traffic?",
        a: "Yes. You decide what your workloads may connect to.",
      },
    ],
    meta: {
      title: "Network as a Service — private networking in the Kathmandu Valley",
      description:
        "Private, default-closed networking for AI workloads in the Kathmandu Valley, with low latency to users in Nepal and private connections to your offices.",
    },
  },
];

export const ALL_PRODUCTS: Product<AnyProductSlug>[] = [...PRODUCTS, ...MORE_PRODUCTS];

export function productBySlug(slug: string): Product<AnyProductSlug> | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

/* ── The catalogue (/products): Run · Build · Scale ──────────────────────
   Every offering in the language buyers compare clouds in (GPUaaS, IaaS,
   NaaS, PaaS, serverless, storage), mapped onto what we run. Only what we
   offer: no agentic search, managed databases, CPU-only instances or block
   volumes. No counts or capacities (CTO ruling, 14 Oct 2026). */

export type ServiceTag = "GPUaaS" | "IaaS" | "NaaS" | "PaaS" | "Serverless" | "STaaS";

export interface CatalogItem {
  /** Anchor on /products. */
  id: string;
  name: string;
  tag?: ServiceTag;
  glyph: GlyphName;
  /** Its own page: /products/<page>. */
  page: AnyProductSlug;
  line: string;
  includes: string[];
  links: { href: string; label: string }[];
  /** Spans two columns on wide screens. */
  wide?: boolean;
}

export interface CatalogGroup {
  id: "run" | "build" | "scale";
  n: string;
  name: string;
  title: string;
  continuation: string;
  lead: string;
  items: CatalogItem[];
}

export const SERVICE_TAGS: { tag: ServiceTag; label: string; href: string }[] = [
  { tag: "GPUaaS", label: "GPU as a Service", href: "#gpu-as-a-service" },
  { tag: "IaaS", label: "Infrastructure as a Service", href: "#infrastructure-as-a-service" },
  { tag: "NaaS", label: "Network as a Service", href: "#network-as-a-service" },
  { tag: "PaaS", label: "Platform as a Service", href: "#platform-as-a-service" },
  { tag: "Serverless", label: "Serverless APIs", href: "#serverless-apis" },
  { tag: "STaaS", label: "Storage", href: "#storage" },
];

export const PRODUCT_CATALOG: CatalogGroup[] = [
  {
    id: "run",
    n: "01",
    name: "Run",
    title: "Serve and fine-tune models",
    continuation: "in production.",
    lead: "Put open and custom models behind an API your products can call, from inside Nepal.",
    items: [
      {
        id: "serverless-apis",
        name: "Serverless APIs",
        tag: "Serverless",
        glyph: "token",
        page: "serverless-apis",
        line: "Call hosted open models through an API. No GPUs to size, start or stop.",
        includes: [
          "OpenAI-compatible endpoints for language models",
          "Text, speech and vision models",
          "Requests processed in Nepal",
        ],
        links: [{ href: "/products/serverless-apis", label: "Serverless APIs" }],
      },
      {
        id: "managed-inference",
        name: "Managed inference",
        tag: "PaaS",
        glyph: "inferencing",
        page: "inferencing",
        line: "Your own or fine-tuned models behind a dedicated endpoint, run by us.",
        includes: ["NVIDIA NIM and KServe", "Endpoints that grow with your traffic", "On whole GPUs or MIG slices"],
        links: [{ href: "/products/inferencing", label: "Inferencing" }],
      },
      {
        id: "fine-tuning",
        name: "Fine-tuning",
        glyph: "use-cases",
        page: "fine-tuning",
        line: "Adapt an open model to your own data, then serve it from the same place.",
        includes: ["Notebooks and pipelines", "Every run tracked in MLflow", "Your data and weights stay yours"],
        links: [{ href: "/products/fine-tuning", label: "Fine-tuning" }, { href: "/products/on-demand", label: "On-demand GPUs" }],
      },
    ],
  },
  {
    id: "build",
    n: "02",
    name: "Build",
    title: "Train, improve and ship",
    continuation: "custom models.",
    lead: "A managed workspace with the tools ML teams already use, ready on day one.",
    items: [
      {
        id: "platform-as-a-service",
        name: "Platform as a Service",
        tag: "PaaS",
        glyph: "platform",
        page: "platform",
        line: "A managed AI workspace. We run the cluster, the scheduling and the upgrades; you work in notebooks, pipelines and endpoints.",
        includes: [
          "Notebooks, pipelines, training and serving in one place",
          "Your own private workspace, isolated from other customers",
          "Monitoring of GPU use, jobs and spend",
          "Engineers in Kathmandu, on Nepal time",
        ],
        links: [{ href: "/products/platform", label: "Platform as a Service" }, { href: "/platform", label: "How the platform works" }],
        wide: true,
      },
      {
        id: "orchestration",
        name: "AI orchestration",
        glyph: "water",
        page: "orchestration",
        line: "Pipelines and scheduled jobs, from one notebook to a nightly run.",
        includes: ["Kubeflow pipelines", "Airflow scheduling", "Ray for distributed work"],
        links: [{ href: "/products/orchestration", label: "AI orchestration" }],
      },
      {
        id: "applications",
        name: "Applications",
        glyph: "docs",
        page: "applications",
        line: "The apps your team opens every day, ready when you sign in.",
        includes: ["JupyterLab", "Spark and Presto for data", "Superset dashboards, TensorFlow"],
        links: [{ href: "/products/applications", label: "Applications" }],
      },
      {
        id: "modelops",
        name: "ModelOps",
        glyph: "blog",
        page: "modelops",
        line: "Track, tune and register models across their whole life.",
        includes: ["MLflow experiments and model registry", "Katib for tuning", "Kale: notebooks into pipelines"],
        links: [{ href: "/products/modelops", label: "ModelOps" }],
      },
      {
        id: "engineering",
        name: "Engineering services",
        glyph: "services",
        page: "services",
        line: "Our engineers on your project, from sizing to production.",
        includes: ["Capacity planning", "Moving work from another cloud", "Training, serving and GPU labs"],
        links: [{ href: "/products/services", label: "Services & engineering" }],
      },
    ],
  },
  {
    id: "scale",
    n: "03",
    name: "Scale",
    title: "Run AI workloads",
    continuation: "on NVIDIA H200 NVL.",
    lead: "GPUs, networking and storage as services, billed in rupees and run in Nepal.",
    items: [
      {
        id: "gpu-as-a-service",
        name: "GPU as a Service",
        tag: "GPUaaS",
        glyph: "hardware",
        page: "on-demand",
        line: "Whole NVIDIA H200 NVL GPUs: on demand by the second, or reserved for a term.",
        includes: [
          `${v("gpu.memory")} of ${v("gpu.memoryType")} on every GPU`,
          "Billed per second, in Nepalese rupees",
          "Reserved GPUs run only your work",
          "A notebook, pipeline or endpoint in minutes",
        ],
        links: [{ href: "/products/on-demand", label: "On-demand GPUs" }, { href: "/products/reserved", label: "Reserved GPUs" }],
        wide: true,
      },
      {
        id: "mig-slices",
        name: "MIG slices",
        tag: "GPUaaS",
        glyph: "mig-slicing",
        page: "mig-slicing",
        line: `Up to ${v("gpu.migCount")} isolated GPUs from one H200 NVL. Pay for the slice.`,
        includes: ["Memory and compute isolated in hardware", "Right-sized for inference and classes"],
        links: [{ href: "/products/mig-slicing", label: "MIG slicing" }],
      },
      {
        id: "infrastructure-as-a-service",
        name: "Infrastructure as a Service",
        tag: "IaaS",
        glyph: "infrastructure",
        page: "infrastructure-as-a-service",
        line: "GPU compute with the networking and storage it needs, set up for your organisation.",
        includes: [
          "Isolated from other customers",
          "In a hydro-powered datacentre",
          `${v("place.uptime")} facility uptime commitment`,
        ],
        links: [{ href: "/products/infrastructure-as-a-service", label: "Infrastructure as a Service" }, { href: "/infrastructure", label: "The datacentre" }],
      },
      {
        id: "network-as-a-service",
        name: "Network as a Service",
        tag: "NaaS",
        glyph: "contact",
        page: "networking",
        line: "Private networking for your workloads, close to your users.",
        includes: [
          `${v("place.latency")} round trip inside the Kathmandu Valley`,
          "Nothing reaches your work unless you allow it",
        ],
        links: [{ href: "/products/networking", label: "Network as a Service" }],
      },
      {
        id: "storage",
        name: "Storage",
        tag: "STaaS",
        glyph: "storage",
        page: "storage",
        line: "S3-compatible object storage and file access, beside the GPUs.",
        includes: [
          "Works with the S3 tools you have",
          "Read by every job, notebook and endpoint",
          "Never copied abroad",
        ],
        links: [{ href: "/products/storage", label: "Storage" }],
      },
    ],
  },
];
