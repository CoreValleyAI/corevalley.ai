/**
 * /platform — the platform under the GPU, told as "The Iceberg" (the dive
 * from preview, components/platform/iceberg-dive.tsx): the GPU above the
 * waterline, nine layers we run below it.
 *
 * CTO ruling, 14 Oct 2026: no detailed specifications. The GPU is named;
 * there are no GPU or server counts, no server, network or storage figures,
 * no platform product names and no software licensing. Layer bodies say
 * what you get, in plain words; `tags` render small and in mono.
 */
import type { GlyphName } from "@/components/system/dot-glyph";

export interface PlatformLayer {
  title: string;
  body: string;
  tags: string;
}

const LAYERS: PlatformLayer[] = [
  {
    title: "Networking",
    body: "Every customer gets a private network, and nothing reaches your work unless you allow it. Inside the Kathmandu Valley, a round trip typically takes under 5 ms.",
    tags: "private networks · your rules · < 5 ms in the valley",
  },
  {
    title: "Storage",
    body: "Your files outlive the job, on fast flash storage beside the GPUs. Upload a dataset once, not every run.",
    tags: "object · file · scratch",
  },
  {
    title: "Power & cooling",
    body: "Our datacentre runs on Nepal's hydropower. Racks stay cool, so a card holds full speed for the whole job, not just the first ten minutes.",
    tags: "hydropower · cooling · redundancy",
  },
  {
    title: "Scheduling",
    body: "Launch a notebook, a pipeline or an endpoint, and we put it on the right GPU. You get the cluster without having to run it.",
    tags: "notebooks · jobs · endpoints",
  },
  {
    title: "Monitoring",
    body: "Watch GPU use, job health and spend as they happen. You see the cost before the invoice does.",
    tags: "gpu use · job health · spend",
  },
  {
    title: "Security & isolation",
    body: "On whole GPUs and hardware slices (MIG), a neighbour's crash can't reach your work. Every action lands in an audit log.",
    tags: "mig · audit log · least privilege",
  },
  {
    title: "Data protection",
    body: "Your data is safe with us. Only your organisation can reach it, our staff look only when you ask, and we never train anything on it.",
    tags: "access control · your data, your call",
  },
  {
    title: "NPR billing",
    body: "Pay by the second, in rupees, by digital payment, bank transfer or invoice. No dollar card, no exchange-rate surprises.",
    tags: "per second · digital payment · invoice",
  },
  {
    title: "Local support",
    body: "Engineers in Kathmandu, working Nepal time. You talk to the people who run the platform.",
    tags: "kathmandu · nepal time",
  },
];

export const PLATFORM = {
  meta: {
    title: "Platform — the layers under every GPU",
    description:
      "You rent the GPU; CoreValley runs the rest. Networking, storage, hydropower and cooling, scheduling, monitoring, security, data protection, NPR billing and local support under every NVIDIA H200 NVL in Nepal.",
  },
  dive: {
    intro: {
      title: "You rent the GPU.",
      lit: "We run the rest.",
      body: "Like an iceberg, most of what makes AI work sits out of sight. The GPU is the tip you see; below the waterline is everything we run for you, in Kathmandu.",
      cue: "Scroll to dive",
    },
    gpu: {
      kicker: "What you see",
      title: "The GPU.",
      body: "An NVIDIA H200 NVL with 141 GB of memory, billed by the second in rupees. It's the part everyone compares, and the smallest part of the job.",
      tags: "nvidia h200 nvl · 141 gb hbm3e",
    },
    waterline: {
      kicker: "Below the waterline",
      title: "Nine layers you",
      lit: "never operate.",
      body: "Everything that turns a card into a service you can count on. Keep scrolling, one layer at a time.",
    },
    layers: LAYERS,
    whole: {
      kicker: "The whole iceberg",
      title: "All of it,",
      lit: "run for you.",
      body: "We start with NVIDIA H200 NVL and will scale out, adding more GPUs and new generations as demand grows.",
      primary: { href: "/contact?intent=workloads", label: "Request access" },
      secondary: { href: "/pricing", label: "How billing works" },
    },
    gauge: { surface: "Surface", gpu: "The GPU", waterline: "Waterline", whole: "Whole iceberg" },
  },
  /** The allegory, spelled out for readers who skimmed the dive. */
  allegory: {
    kicker: "Why an iceberg",
    title: "You only see the tip.",
    continuation: "The rest keeps it afloat.",
    lead: "About a tenth of an iceberg shows above the water. The other nine tenths, out of sight, is what holds it up. AI in the cloud works the same way.",
    parts: [
      {
        label: "Above the waterline",
        title: "The GPU",
        body: "The powerful chip that does the AI work. It's what everyone compares and talks about, and what you rent from us.",
      },
      {
        label: "Below the waterline",
        title: "Everything that keeps it running",
        body: "Networks, storage, power, cooling, security, monitoring, billing and people. Without them, a GPU is just an expensive chip in a box.",
      },
      {
        label: "What it means for you",
        title: "You only deal with the tip",
        body: "We build and run everything under the surface, in Nepal. You bring your data and your idea, and use the GPU as a service.",
      },
    ],
  },
  tools: {
    kicker: "What you work in",
    title: "The tools you already know.",
    continuation: "Ready on day one.",
    items: [
      { name: "JupyterLab", what: "Notebooks", glyph: "docs" },
      {
        name: "Kubeflow",
        what: "ML pipelines, with Katib for tuning and Kale for turning notebooks into pipelines",
        glyph: "platform",
      },
      { name: "Airflow", what: "Scheduling workflows", glyph: "on-demand" },
      { name: "Ray", what: "Distributed compute", glyph: "mig-slicing" },
      { name: "Spark", what: "Data processing at scale", glyph: "water" },
      { name: "MLflow", what: "Experiment tracking", glyph: "blog" },
      { name: "KServe", what: "Model serving", glyph: "inferencing" },
      { name: "NVIDIA NIM", what: "Optimised microservices for popular models", glyph: "hardware" },
      { name: "Presto", what: "SQL across your data", glyph: "storage" },
      { name: "Superset", what: "Dashboards", glyph: "pricing" },
      { name: "TensorFlow", what: "A framework, ready to use", glyph: "token" },
    ] satisfies { name: string; what: string; glyph: GlyphName }[],
    note: "Tool names are trademarks of their owners.",
  },
  isolation: {
    kicker: "Isolation",
    title: "Boundaries you can point to.",
    items: [
      { title: "Hardware slices", body: "A MIG slice has its own memory and compute, isolated in the GPU itself." },
      { title: "Reserved means yours", body: "Reserved GPUs run only your organisation's work for the whole term." },
      {
        title: "Safe with us",
        body: "Your data is protected: only your organisation can reach it, and we never use it to train anything.",
      },
    ],
    link: { href: "/trust", label: "Trust and data handling" },
  },
} as const;

/** Steps of the dive: intro · GPU · waterline · the layers · whole iceberg. */
export const DIVE_STEPS = LAYERS.length + 3;
