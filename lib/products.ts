// Single source of truth for product copy. Homepage, product pages, footer and metadata read from here.
// Voice rules: DESIGN.md §9. Products are pre-launch: describe what they do, not results they've had.

export type ProductStatus = "Launching soon" | "Early access" | "Live";

export type Product = {
  slug: string;
  name: string;
  status: ProductStatus;
  /** Short category label, e.g. "AI Agent Evaluation". */
  category: string;
  /** Display headline used on the homepage panel. */
  headline: string;
  /** One or two sentences: what it does and who it's for. */
  summary: string;
  /** One line for cards and meta descriptions. */
  tagline: string;
  highlights: string[];
  /** "Show the work" walkthrough on the homepage. */
  walkthrough: { intro: string; steps: string[] };
  repo?: string;
};

export const products: Product[] = [
  {
    slug: "agentbattle",
    name: "AgentBattle",
    status: "Launching soon",
    category: "AI Agent Evaluation",
    headline: "Don’t trust demos. Trust data.",
    summary:
      "A head-to-head arena for AI agents. Run agents on the same tasks under the same conditions, score them, and compare the results.",
    tagline: "A head-to-head arena for testing and comparing AI agents.",
    highlights: [
      "Side-by-side comparisons on identical tasks",
      "Repeatable, scored runs",
      "Bring your own tasks or use built-in benchmarks",
    ],
    walkthrough: {
      intro: "Create a challenge, let agents attempt it under identical conditions, then compare the scores.",
      steps: ["Create a challenge", "Agents attempt it", "Compare the scores"],
    },
    repo: "https://github.com/yashsrivastava1408/AgentBattle",
  },
  {
    slug: "devsick",
    name: "DevSick",
    status: "Launching soon",
    category: "AI Incident Reasoning",
    headline: "Know why it broke, not just that it did.",
    summary:
      "Sits on top of your monitoring tools to detect, explain and guide the resolution of application failures, correlating logs and traces to find the root cause.",
    tagline: "AI incident reasoning that explains why your application failed.",
    highlights: [
      "Root cause analysis from logs and traces",
      "Human-in-the-loop remediation: you make the final call",
      "Works alongside your existing observability tools",
    ],
    walkthrough: {
      intro: "Connect your monitoring, investigate an incident, and move from symptom to root cause and a suggested fix.",
      steps: ["Connect monitoring", "Investigate an incident", "Review the suggested fix"],
    },
    repo: "https://github.com/yashsrivastava1408/DevSick",
  },
  {
    slug: "questionforge",
    name: "QuestionForge",
    status: "Launching soon",
    category: "Technical Interview Questions",
    headline: "Forge better questions, faster.",
    summary:
      "Generate, validate and export technical interview questions across DSA, OOP, system design and SQL, built for hiring and university placement teams.",
    tagline: "Generate and validate technical interview questions.",
    highlights: [
      "Coverage across DSA, OOP, system design and SQL",
      "Every question checked for correctness, edge cases and clarity",
      "Export sets ready for your ATS or internal wiki",
    ],
    walkthrough: {
      intro: "Choose topics and difficulty, generate questions, then validate and export the set.",
      steps: ["Choose topics", "Generate and validate", "Export the set"],
    },
    repo: "https://github.com/yashsrivastava1408/QuestionForge",
  },
  {
    slug: "ops-academy",
    name: "Ops Academy",
    status: "Launching soon",
    category: "Operations Training",
    headline: "Learn operations by doing the work.",
    summary:
      "A learning platform that builds practical operations skills through structured paths, hands-on exercises and visible progress.",
    tagline: "Learn operations through structured paths and hands-on exercises.",
    highlights: [
      "Structured learning paths for operations roles",
      "Hands-on exercises, not just reading",
      "Clear progress for learners and teams",
    ],
    walkthrough: {
      intro: "Pick a learning path, work through hands-on exercises, and track your progress.",
      steps: ["Choose a learning path", "Complete an exercise", "Track your progress"],
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** "AgentBattle, DevSick, QuestionForge and Ops Academy" */
export const productList = (names = products.map((p) => p.name)) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join("");
