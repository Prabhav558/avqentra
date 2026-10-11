// Shared by the contact form (browser) and /api/contact (server) so both validate the same way.

export const topics = {
  project: {
    label: "Client project",
    title: "Start a project",
    intro: "Tell us what you're building, where it stands, and when you need it. A founder will reply.",
    prompt: "What are you building?",
    hint: "What it is, who it's for, where it stands and when you need it.",
  },
  "early-access": {
    label: "Early access",
    title: "Get early access",
    intro: "Our products are in development. Tell us which one you're interested in and we'll reach out when it opens.",
    prompt: "What would you use it for?",
    hint: "Your team, your use case, and what you'd want to try first.",
  },
  general: {
    label: "Something else",
    title: "Get in touch",
    intro: "Partnerships, press, hiring or a question. Every message reaches a founder.",
    prompt: "Message",
    hint: "Whatever is on your mind. Short is fine.",
  },
} as const;

export type Topic = keyof typeof topics;
export const topicKeys = Object.keys(topics) as Topic[];
export const isTopic = (v: unknown): v is Topic => typeof v === "string" && v in topics;

export const limits = { name: 120, email: 254, company: 160, product: 80, message: 4000, minMessage: 10 } as const;

export type Lead = {
  topic: Topic;
  name: string;
  email: string;
  company: string;
  product: string;
  message: string;
};
export type Field = keyof Lead;
export type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trims and checks an untrusted payload. Never throws. */
export function validate(input: unknown): { ok: true; value: Lead } | { ok: false; errors: Errors } {
  const r = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
  const topic = isTopic(r.topic) ? r.topic : "general";
  const value: Lead = { topic, name: str("name"), email: str("email"), company: str("company"), product: str("product"), message: str("message") };

  const errors: Errors = {};
  if (!value.name) errors.name = "Tell us your name.";
  else if (value.name.length > limits.name) errors.name = `Keep it under ${limits.name} characters.`;
  if (!value.email) errors.email = "Add the email we should reply to.";
  else if (value.email.length > limits.email || !EMAIL.test(value.email)) errors.email = "That email doesn't look right.";
  if (value.company.length > limits.company) errors.company = `Keep it under ${limits.company} characters.`;
  if (value.product.length > limits.product) errors.product = "Pick a product from the list.";
  if (value.message.length < limits.minMessage) errors.message = `Write at least ${limits.minMessage} characters.`;
  else if (value.message.length > limits.message) errors.message = `Keep it under ${limits.message} characters.`;

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
