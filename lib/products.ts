// Single source of truth for product copy. Homepage, product pages, footer and metadata read from here.
// Voice rules: DESIGN.md §9. Products are pre-launch: describe what they do, not results they've had.

export type ProductStatus = "Launching soon" | "Early access" | "Live";

/** Extra content for the redesigned /products pages (hero scene, how-it-works, capabilities). */
export type ProductPage = {
  title: string;
  lead: string;
  pageTag: string;
  description: string;
  accent: string;
  /** Two-line hero headline; the second line is tinted. */
  heroLines: [string, string];
  badge: string;
  stats: { value: string; label: string }[];
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  stack: string[];
};

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
  /** Present for products that have a full /products/<slug> page. */
  page?: ProductPage;
};

/** A product with its page content merged in and a repo link, as the product pages expect. */
export type PageProduct = Product & ProductPage & { repo: string };

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
    page: {
      title: "AgentBattle",
      lead: "Pit AI agents against each other and see which one actually wins.",
      pageTag: "AI agents",
      description:
        "AgentBattle is a head-to-head arena for AI agents. Run agents on the same tasks under the same conditions and compare results objectively instead of trusting demos.",
      accent: "#ff4d8d",
      heroLines: ["Don't trust demos.", "Trust data."],
      badge: "AI Agent Arena",
      stats: [
        { value: "1v1", label: "Head-to-head runs" },
        { value: "100%", label: "Identical task conditions" },
        { value: "Scored", label: "Repeatable results" },
      ],
      steps: [
        { title: "Pick the contenders", body: "Choose the agents or models you want to compare." },
        { title: "Set the task", body: "Use a built-in benchmark or bring your own task." },
        { title: "Battle", body: "Agents run under identical, deterministic conditions." },
        { title: "Read the scoreboard", body: "Get scored, comparable results you can act on." },
      ],
      features: [
        { title: "Side-by-side comparisons", body: "Evaluate multiple agents on identical tasks to cut through the marketing noise and find the right fit for your use case." },
        { title: "Repeatable and scored", body: "Every battle runs in a deterministic environment with a rigorous scoring system, so results are clear and comparable." },
        { title: "Extensible tasks", body: "Bring your own tasks or use built-in benchmarks, from coding challenges to web navigation." },
      ],
      stack: ["Agents", "Benchmarks", "Scoring", "Replays"],
    },
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
    page: {
      title: "DevSick",
      lead: "Autonomous infrastructure intelligence and an AI command center.",
      pageTag: "Incident intelligence",
      description:
        "DevSick sits on top of your monitoring tools to detect, explain, and guide resolution of application failures. It correlates logs and metrics, then uses LLM reasoning to produce structured root-cause analysis with confidence scores.",
      accent: "#2fe0a1",
      heroLines: ["Incident reasoning,", "powered by AI."],
      badge: "AI Command Center",
      stats: [
        { value: "6", label: "Pipeline layers" },
        { value: "70B", label: "Llama 3.3 via Groq" },
        { value: "HITL", label: "Approve or auto-heal" },
      ],
      steps: [
        { title: "Observe", body: "Logs, metrics and alerts flow in from Prometheus, Grafana and a REST ingestion API." },
        { title: "Correlate", body: "An event correlation engine and service knowledge graph build the incident context." },
        { title: "Reason", body: "A structured SRE prompt returns root cause, reasoning chain and confidence as strict JSON." },
        { title: "Remediate", body: "Approve the fix, or let low-risk playbooks like secret refresh run automatically." },
      ],
      features: [
        { title: "LLM root cause analysis", body: "Structured prompting, not chat. Each incident gets a root cause, a reasoning chain and a confidence score." },
        { title: "Governed autonomy", body: "Governance modes range from single-click approval to fully automated resolution for low-risk fixes." },
        { title: "Cinematic HUD", body: "A React dashboard with real-time system metrics, built for the moment something breaks." },
        { title: "Monitoring stack included", body: "Prometheus and Grafana ship in the Docker Compose setup. Without a Groq key it falls back to a mock AI mode." },
      ],
      stack: ["FastAPI", "React", "Groq", "Prometheus", "Grafana", "Docker"],
    },
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
    page: {
      title: "QuestionForge",
      lead: "Generates technical interview questions, then checks them before a human sees them.",
      pageTag: "Question generation",
      description:
        "QuestionForge drafts DSA, SQL, MCQ, OOP, conceptual and system-design questions for hiring assessments. An LLM writes each one; something else verifies it, by running code or by independent review.",
      accent: "#6d8bff",
      heroLines: ["Forge better questions,", "then prove them."],
      badge: "Open Source",
      stats: [
        { value: "6", label: "Question types" },
        { value: "4", label: "Sandboxed languages" },
        { value: "3", label: "LLM providers" },
      ],
      steps: [
        { title: "Generate", body: "One background job per question; a batch runs in parallel." },
        { title: "Validate", body: "Solutions run against a brute-force oracle on random inputs. A second model solves it blind." },
        { title: "Review", body: "Reviewers approve, reject or edit. Edits go back through validation." },
        { title: "Export", body: "Build papers from a blueprint and export candidate PDFs, internal PDFs or JSON." },
      ],
      features: [
        { title: "Validation by execution", body: "DSA solutions run in Python, Java, C++ and JavaScript inside a Piston sandbox. SQL is checked in SQLite. Expected outputs come from execution, not the model." },
        { title: "Independent review", body: "MCQ, OOP and conceptual questions are blind-solved by a second model, then challenged by an adversary and a judge." },
        { title: "Papers and export", body: "Describe a paper like '2 easy DSA, 1 SQL, 5 MCQ' and it is drawn from approved questions. Export to PDF or JSON, or S3." },
        { title: "Teams and analytics", body: "Multi-tenant with Admin, Reviewer and Generator roles, signed webhooks, and cost per validated question." },
      ],
      stack: ["TypeScript", "React", "Postgres", "Redis + BullMQ", "Piston", "Anthropic / OpenAI / Gemini"],
    },
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

/** Products that have a full redesigned page, with their page content merged in. */
export const pageProducts: PageProduct[] = products.flatMap((p) => (p.page && p.repo ? [{ ...p, ...p.page, repo: p.repo }] : []));
export const getPageProduct = (slug: string) => pageProducts.find((p) => p.slug === slug);

/** "AgentBattle, DevSick, QuestionForge and Ops Academy" */
export const productList = (names = products.map((p) => p.name)) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join("");
