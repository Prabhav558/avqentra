export type Product = {
  slug: string;
  name: string;
  tag: string;
  tagline: string;
  description: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    slug: "agentbattle",
    name: "AgentBattle",
    tag: "AI agents",
    tagline: "Pit AI agents against each other and see which one actually wins.",
    description:
      "AgentBattle is a head-to-head arena for AI agents. Run agents on the same tasks under the same conditions and compare results objectively instead of trusting demos.",
    highlights: [
      "Side-by-side agent comparisons on identical tasks",
      "Repeatable, scored runs",
      "Clear results you can act on",
    ],
  },
  {
    slug: "devsick",
    name: "Devsick",
    tag: "Developer tools",
    tagline: "Tooling for developers who are done with broken workflows.",
    description:
      "Devsick is built for developers. It targets the friction that slows engineering teams down and gives you a faster path from problem to fix.",
    highlights: [
      "Built for real developer workflows",
      "Fast to adopt, minimal setup",
      "Focused on removing friction, not adding dashboards",
    ],
  },
  {
    slug: "questionforge",
    name: "QuestionForge",
    tag: "Question generation",
    tagline: "Forge better questions, faster.",
    description:
      "QuestionForge generates high-quality questions on demand, for assessments, interviews, research and learning, so you stop writing them by hand.",
    highlights: [
      "Generate questions from your own material",
      "Control difficulty and format",
      "Edit and reuse your question sets",
    ],
  },
  {
    slug: "ops-academy",
    name: "Ops Academy",
    tag: "Learning platform",
    tagline: "Learn operations by doing the work.",
    description:
      "Ops Academy is a learning platform for operations skills. Structured paths and hands-on exercises help people build practical ability, with progress you can see.",
    highlights: [
      "Structured learning paths for operations roles",
      "Hands-on exercises, not just reading",
      "Clear progress for learners and teams",
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
