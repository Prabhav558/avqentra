import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <div className="wrap">
      <div className="hero">
        <h1>
          We build products that <em>change how work gets done</em>
        </h1>
        <p>Avqentra is a product studio shipping focused tools for AI and developers.</p>
        <div className="btns">
          <Link className="btn primary" href="/products">See our products</Link>
          <Link className="btn" href="/contact">Get in touch</Link>
        </div>
      </div>
      <section>
        <h2>Our products</h2>
        <p className="sub">Three products, each built to solve one problem well.</p>
        <div className="grid">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>
      <section>
        <h2>How we build</h2>
        <div className="grid">
          <div className="card"><h3>Problem first</h3><p>Every product starts with a real pain point, not a feature list.</p></div>
          <div className="card"><h3>Ship fast</h3><p>Small team, short cycles, constant feedback from users.</p></div>
          <div className="card"><h3>Stay focused</h3><p>We do fewer things and do them better.</p></div>
        </div>
      </section>
    </div>
  );
}
