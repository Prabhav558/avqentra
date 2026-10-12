// Single source of truth for product copy. Homepage, product pages, footer and metadata read from here.
// Voice rules: DESIGN.md §9. Products are pre-launch: describe what they do, not results they've had.

export type ProductStatus = "In development" | "Launching soon" | "Early access" | "Live";

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
  /** Present for products that have a full /products/<slug> page. */
  page?: ProductPage;
};

/** A product with its page content merged in, as the product pages expect. `repo` is optional: not every product is open source. */
export type PageProduct = Product & ProductPage;

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
    page: {
      title: "AgentBattle",
      lead: "Run AI agents against each other on the same tasks and see which one performs best.",
      pageTag: "AI agents",
      description:
        "AgentBattle is a head-to-head arena for AI agents. Run agents on the same tasks under the same conditions and compare scored results instead of trusting demos.",
      accent: "#ff4d8d",
      heroLines: ["Don’t trust demos.", "Trust data."],
      badge: "AI Agent Arena",
      stats: [
        { value: "1v1", label: "Head-to-head runs" },
        { value: "Same", label: "Task, environment and scoring" },
        { value: "Scored", label: "Repeatable results" },
      ],
      steps: [
        { title: "Pick the contenders", body: "Choose the agents or models you want to compare." },
        { title: "Set the task", body: "Use a built-in benchmark or bring your own task." },
        { title: "Battle", body: "Every agent gets the same task, environment and scoring." },
        { title: "Read the scoreboard", body: "Get scored, comparable results you can act on." },
      ],
      features: [
        { title: "Side-by-side comparisons", body: "Evaluate multiple agents on identical tasks and find the right fit for your use case." },
        { title: "Repeatable and scored", body: "Every battle uses the same environment and the same scoring rules, so results are clear and comparable." },
        { title: "Extensible tasks", body: "Bring your own tasks or use built-in benchmarks, from coding challenges to web navigation." },
      ],
      stack: ["Agents", "Benchmarks", "Scoring", "Replays"],
    },
  },
  {
    slug: "devsick",
    name: "DevSick",
    status: "In development",
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
    page: {
      title: "DevSick",
      lead: "AI incident reasoning that explains why your application failed, with a person approving the fix.",
      pageTag: "Incident intelligence",
      description:
        "DevSick sits on top of your monitoring tools to detect, explain and guide the resolution of application failures. It correlates logs and metrics, then uses LLM reasoning to produce a structured root-cause analysis with a confidence score.",
      accent: "#2fe0a1",
      heroLines: ["Incident reasoning,", "powered by AI."],
      badge: "Incident Reasoning",
      stats: [
        { value: "6", label: "Analysis layers" },
        { value: "1", label: "Root cause per incident" },
        { value: "Approval", label: "Or automated low-risk fixes" },
      ],
      steps: [
        { title: "Observe", body: "Logs, metrics and alerts flow in from Prometheus, Grafana and a REST ingestion API." },
        { title: "Correlate", body: "An event correlation engine and service knowledge graph build the incident context." },
        { title: "Reason", body: "A structured SRE prompt returns root cause, reasoning chain and confidence as strict JSON." },
        { title: "Remediate", body: "Approve the fix, or let low-risk playbooks, such as a secret refresh, run automatically." },
      ],
      features: [
        { title: "LLM root cause analysis", body: "Structured prompting, not chat. Each incident gets a root cause, a reasoning chain and a confidence score." },
        { title: "Governed autonomy", body: "Choose how much runs on its own: from one-click approval to automatic resolution of low-risk fixes only." },
        { title: "Live incident dashboard", body: "A real-time view of system metrics, built for the moment something breaks." },
        { title: "Works with your monitoring", body: "Connects to Prometheus and Grafana, and accepts logs and alerts through a REST ingestion API." },
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
    page: {
      title: "QuestionForge",
      lead: "Generates technical interview questions, then checks them before a human sees them.",
      pageTag: "Question generation",
      description:
        "QuestionForge drafts DSA, SQL, MCQ, OOP, conceptual and system-design questions for hiring assessments. An LLM writes each one; something else verifies it, by running code or by independent review.",
      accent: "#6d8bff",
      heroLines: ["Forge better questions,", "then prove them."],
      badge: "Question Generation",
      stats: [
        { value: "6", label: "Question types" },
        { value: "4", label: "Sandboxed languages" },
        { value: "3", label: "LLM providers" },
      ],
      steps: [
        { title: "Generate", body: "One background job per question; a batch runs in parallel." },
        { title: "Validate", body: "Solutions run against a brute-force oracle on random inputs. A second model then solves it without seeing the answer." },
        { title: "Review", body: "Reviewers approve, reject or edit. Edits go back through validation." },
        { title: "Export", body: "Build papers from a blueprint and export candidate PDFs, internal PDFs or JSON." },
      ],
      features: [
        { title: "Validation by execution", body: "DSA solutions run in Python, Java, C++ and JavaScript inside a Piston sandbox. SQL is checked in SQLite. Expected outputs come from execution, not the model." },
        { title: "Independent review", body: "MCQ, OOP and conceptual questions are solved independently by a second model, then challenged by a reviewing model and a judge." },
        { title: "Papers and export", body: "Describe a paper like “2 easy DSA, 1 SQL, 5 MCQ” and it is drawn from approved questions. Export to PDF or JSON, or send it to S3." },
        { title: "Teams and analytics", body: "Separate workspaces per team, Admin, Reviewer and Generator roles, signed webhooks, and cost per validated question." },
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
    page: {
      title: "Ops Academy",
      lead: "Learn operations by doing the work, one structured path at a time.",
      pageTag: "Operations training",
      description:
        "Ops Academy builds practical operations skills through structured learning paths, hands-on exercises and visible progress, for individual learners and the teams that train them.",
      accent: "#ffb454",
      heroLines: ["Learn operations", "by doing the work."],
      badge: "Operations Training",
      stats: [
        { value: "Paths", label: "Structured by role" },
        { value: "Hands-on", label: "Exercises, not slides" },
        { value: "Tracked", label: "Progress you can see" },
      ],
      steps: [
        { title: "Choose a path", body: "Pick a learning path built around an operations role, from the first alert to the written review." },
        { title: "Do the work", body: "Each module ends in an exercise you complete, not a page you scroll past." },
        { title: "Run it live", body: "Apply the skill in a hands-on scenario, like triaging and handling a live incident." },
        { title: "Track progress", body: "Completed, in-progress and locked modules stay visible to learners and their teams." },
      ],
      features: [
        { title: "Structured learning paths", body: "Modules unlock in order, so each skill builds on the one before it instead of arriving as a pile of material." },
        { title: "Hands-on exercises", body: "Practice the work itself: reading signals, triage and escalation, running an incident, writing the review." },
        { title: "Clear progress", body: "Every module shows where a learner is: done, in progress or locked. Teams see the same picture." },
      ],
      stack: ["Paths", "Exercises", "Progress", "Teams"],
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Products that have a full redesigned page, with their page content merged in. */
export const pageProducts: PageProduct[] = products.flatMap((p) => (p.page ? [{ ...p, ...p.page }] : []));
export const getPageProduct = (slug: string) => pageProducts.find((p) => p.slug === slug);

/** "AgentBattle, DevSick, QuestionForge and Ops Academy" */
export const productList = (names = products.map((p) => p.name)) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join("");
