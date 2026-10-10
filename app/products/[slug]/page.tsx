import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="tag">{p.tag}</span>
        <h1>{p.name}</h1>
        <p>{p.tagline}</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <p style={{ maxWidth: 680 }}>{p.description}</p>
        <h2 style={{ fontSize: 22, marginTop: 32 }}>Highlights</h2>
        <ul className="feat">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        <div className="btns" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <Link className="btn primary" href="/contact">Request access</Link>
          <Link className="btn" href="/products">All products</Link>
        </div>
      </section>
    </div>
  );
}
