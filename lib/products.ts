export type Product = {
  slug: string;
  name: string;
  tag: string;
  tagline: string;
  title: string;
  lead: string;
  pageTag: string;
  description: string;
  highlights: string[];
  repo: string;
  accent: string;
  headline: [string, string];
  badge: string;
  stats: { value: string; label: string }[];
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  stack: string[];
};

export const products: Product[] = [
  {
    slug: "agentbattle",
    name: "AgentBattle",
    tag: "AI agents",
    tagline: "Pit AI agents against each other and see which one actually wins.",
    title: "AgentBattle",
    pageTag: "AI agents",
    lead: "Pit AI agents against each other and see which one actually wins.",
    description:
      "AgentBattle is a head-to-head arena for AI agents. Run agents on the same tasks under the same conditions and compare results objectively instead of trusting demos.",
    highlights: [
      "Side-by-side agent comparisons on identical tasks",
      "Repeatable, scored runs",
      "Clear results you can act on",
    ],
    repo: "https://github.com/yashsrivastava1408/AgentBattle",
    accent: "#ff4d8d",
    headline: ["Don't trust demos.", "Trust data."],
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
  {
    slug: "devsick",
    name: "Devsick",
    tag: "Developer tools",
    tagline: "Tooling for developers who are done with broken workflows.",
    title: "DevSick",
    pageTag: "Incident intelligence",
    lead: "Autonomous infrastructure intelligence and an AI command center.",
    description:
      "DevSick sits on top of your monitoring tools to detect, explain, and guide resolution of application failures. It correlates logs and metrics, then uses LLM reasoning to produce structured root-cause analysis with confidence scores.",
    highlights: [
      "Structured root-cause analysis with reasoning chains",
      "Human-in-the-loop remediation",
      "Prometheus and Grafana out of the box",
    ],
    repo: "https://github.com/yashsrivastava1408/DevSick",
    accent: "#2fe0a1",
    headline: ["Incident reasoning,", "powered by AI."],
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
  {
    slug: "questionforge",
    name: "QuestionForge",
    tag: "Question generation",
    tagline: "Forge better questions, faster.",
    title: "QuestionForge",
    pageTag: "Question generation",
    lead: "Generates technical interview questions, then checks them before a human sees them.",
    description:
      "QuestionForge drafts DSA, SQL, MCQ, OOP, conceptual and system-design questions for hiring assessments. An LLM writes each one; something else verifies it, by running code or by independent review.",
    highlights: [
      "Coding and SQL questions validated by executing code",
      "Human review queue before anything is approved",
      "Paper builder with PDF and JSON export",
    ],
    repo: "https://github.com/yashsrivastava1408/QuestionForge",
    accent: "#6d8bff",
    headline: ["Forge better questions,", "then prove them."],
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
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
