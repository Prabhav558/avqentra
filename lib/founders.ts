export type Founder = {
  slug: string;
  name: string;
  role: string;
  title: string;
  site: string;
  /** What this founder is accountable for. */
  focus: string;
  /** Areas this founder owns, used in the profile and ownership matrix. */
  owns: string[];
  /** Optional: add once real copy / assets exist. Rendered only when present. */
  bio?: string;
  photo?: string;
  linkedin?: string;
};

export const founders: Founder[] = [
  {
    slug: "yash",
    name: "Yash Srivastava",
    role: "CEO",
    title: "Chief Executive Officer",
    site: "yash.avqentra.in",
    focus: "Sets where Avqentra goes, and makes sure every product earns its place.",
    owns: ["Company direction", "Product strategy", "Partnerships"],
  },
  {
    slug: "prabhav",
    name: "Prabhav Singh",
    role: "CTO",
    title: "Chief Technology Officer",
    site: "prabhav.avqentra.in",
    focus: "Decides how our systems are built, and holds the bar on what ships.",
    owns: ["Architecture", "Engineering", "AI systems"],
  },
  {
    slug: "ishaan",
    name: "Ishaan Bajpai",
    role: "CFO",
    title: "Chief Financial Officer",
    site: "ishaan.avqentra.in",
    focus: "Keeps the company funded, measured, and built to last.",
    owns: ["Finance", "Capital & runway", "Operations"],
  },
];

/** "own" = accountable for the call; "shape" = consulted before it's made. */
export type Stake = "own" | "shape";

/** Decision areas for the ownership matrix, keyed by founder slug. */
export const decisions: { area: string; stakes: Partial<Record<string, Stake>> }[] = [
  { area: "Company direction", stakes: { yash: "own", prabhav: "shape", ishaan: "shape" } },
  { area: "Product strategy", stakes: { yash: "own", prabhav: "shape" } },
  { area: "Partnerships", stakes: { yash: "own", ishaan: "shape" } },
  { area: "Architecture & engineering", stakes: { prabhav: "own" } },
  { area: "AI systems", stakes: { prabhav: "own", yash: "shape" } },
  { area: "What ships", stakes: { prabhav: "own", yash: "shape" } },
  { area: "Finance & runway", stakes: { ishaan: "own", yash: "shape" } },
  { area: "Operations", stakes: { ishaan: "own", yash: "shape" } },
];
