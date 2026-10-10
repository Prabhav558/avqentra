import type { Metadata } from "next";
import Link from "next/link";
import { productList } from "@/lib/products";

export const metadata: Metadata = {
  title: "About",
  description: "Avqentra is a product and engineering studio building its own AI products and software for clients.",
};

export default function About() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>About Avqentra</h1>
        <p>A product and engineering studio. We build our own AI products, and we build software for clients.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <p style={{ maxWidth: 680 }}>
          Both get the same process: start with a concrete problem, build the simplest thing that solves it, and
          iterate with the people who use it. No bloat, no buzzwords.
        </p>
        <div className="grid" style={{ marginTop: 32 }}>
          <div className="card">
            <h3>Our products</h3>
            <p>Four in development, launching soon: {productList()}.</p>
          </div>
          <div className="card">
            <h3>Client work</h3>
            <p>AI systems, full-stack applications and automation, built for teams that need them done right.</p>
          </div>
          <div className="card">
            <h3>Approach</h3>
            <p>First principles, honest feedback, fast iteration.</p>
          </div>
        </div>
        <div className="btns" style={{ justifyContent: "flex-start", marginTop: 32 }}>
          <Link className="btn primary" href="/contact?type=project">Start a project</Link>
          <Link className="btn" href="/products">Explore our products</Link>
          <Link className="btn" href="/founders">Meet the founders</Link>
        </div>
      </section>
    </div>
  );
}
