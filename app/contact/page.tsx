import type { Metadata } from "next";
import { getProduct, products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a client project with Avqentra, or get early access to our products.",
};

const topics = {
  project: {
    label: "Client project",
    title: "Start a project",
    intro: "Tell us what you're building, where it stands, and when you need it. A founder will reply.",
    prompt: "What are you building?",
  },
  "early-access": {
    label: "Early access to a product",
    title: "Get early access",
    intro: "Our products are launching soon. Tell us which one you're interested in and we'll reach out when it opens.",
    prompt: "What would you use it for?",
  },
  general: {
    label: "Something else",
    title: "Get in touch",
    intro: "Client projects, early access, partnerships or questions. Every message reaches a founder.",
    prompt: "Message",
  },
} as const;

type Topic = keyof typeof topics;
type Props = { searchParams: Promise<{ type?: string; product?: string }> };

export default async function Contact({ searchParams }: Props) {
  const { type, product } = await searchParams;
  const topic: Topic = type && type in topics ? (type as Topic) : "general";
  const t = topics[topic];
  const selected = product && getProduct(product) ? product : undefined;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <form action="mailto:prabhavkeshwar@gmail.com" method="post" encType="text/plain">
          <label>
            What&apos;s this about?
            <select name="topic" defaultValue={t.label}>
              {Object.values(topics).map((o) => (
                <option key={o.label}>{o.label}</option>
              ))}
            </select>
          </label>
          {topic === "early-access" && (
            <label>
              Product
              <select name="product" defaultValue={selected ? getProduct(selected)!.name : products[0].name}>
                {products.map((p) => (
                  <option key={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
          )}
          <label>Name<input name="name" autoComplete="name" required /></label>
          <label>Email<input type="email" name="email" autoComplete="email" required /></label>
          {topic === "project" && (
            <label>Company (optional)<input name="company" autoComplete="organization" /></label>
          )}
          <label>{t.prompt}<textarea name="message" required /></label>
          <button className="btn primary" type="submit">Send message</button>
        </form>
      </section>
    </div>
  );
}
