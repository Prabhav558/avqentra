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
