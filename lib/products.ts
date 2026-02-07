export interface Product {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  /** If deployed live (e.g. on Vercel), link to open the product. */
  liveUrl?: string;
}

export const products: Product[] = [
  {
    slug: "project-raven",
    title: "Project Raven",
    excerpt: "AI-powered design retrieval — from 1 day to 500ms.",
    body: `Project Raven was developed at Bonito Designs to transform how design assets are retrieved and matched. The system reduces design retrieval time from **1 day to 500ms**, enabling designers and sales teams to find the right options instantly.

**What it does:** Combines semantic search and metadata with an AI layer to understand intent and surface the most relevant designs. Built for scale and integrated into existing design workflows.`,
    liveUrl: undefined,
  },
  {
    slug: "suchi-sales-agent",
    title: "Suchi — AI Sales Agent",
    excerpt: "AI-powered sales agent automating 400+ daily calls.",
    body: `Suchi is an AI-powered Sales Agent created at Bonito Designs that automates **400+ daily sales calls**. It handles outbound outreach, qualification, and follow-ups while maintaining a natural conversation flow.

**What it does:** Uses conversational AI (ASR, TTS, NLU) and integrates with CRM and scheduling. Reduces manual call load and improves consistency and compliance.`,
    liveUrl: undefined,
  },
  {
    slug: "clairvoyant",
    title: "Clairvoyant",
    excerpt: "Capacity planning reduced from 1 week to 1 minute.",
    body: `Clairvoyant was built at Amazon to revolutionize capacity planning. It cut the time required for capacity planning from **1 week to 1 minute**, using ML to predict demand and recommend scaling decisions.

**What it does:** Ingest historical and real-time signals, run forecasting models, and output actionable capacity recommendations with confidence intervals.`,
    liveUrl: undefined,
  },
  {
    slug: "alexa-prime-video",
    title: "Alexa Prime Video",
    excerpt: "Voice-driven Prime Video experience; conversion improved to 3.5%.",
    body: `Launched the **Alexa Prime Video** experience at Amazon, enabling voice-driven discovery and playback. The platform improved conversion to **3.5%** by making it easier to find and start content via Alexa.

**What it does:** Voice UX for browse, search, and play; personalization and recommendations; and tight integration with Prime Video and Alexa devices.`,
    liveUrl: undefined,
  },
  {
    slug: "mlops-bonito",
    title: "MLOps at Bonito",
    excerpt: "Robust MLOps infrastructure improving scalability by 40%.",
    body: `Established a robust **MLOps** infrastructure at Bonito Designs that improved model deployment and monitoring scalability by **40%**. Pipelines support training, evaluation, A/B testing, and rollback.

**What it does:** CI/CD for models, feature stores, experiment tracking, and monitoring for drift and performance.`,
    liveUrl: undefined,
  },
  {
    slug: "convergent-ml-pipelines",
    title: "Real-time ML Pipelines",
    excerpt: "$200M cloud transformation; real-time ML pipelines with high availability.",
    body: `At Convergent Inc, led a **$200M enterprise cloud transformation** and designed **real-time ML pipelines** that enable real-time analytics while maintaining high availability.

**What it does:** Stream processing, feature computation, model serving, and feedback loops—all with strict SLAs and disaster recovery.`,
    liveUrl: undefined,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
