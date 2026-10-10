import Hero from "@/components/home/Hero";
import ProductCard from "@/components/ProductCard";
import { display, mono } from "@/lib/fonts";
import { products } from "@/lib/products";
import s from "@/components/home/home.module.css";

export default function Home() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${s.page}`}>
      <Hero />
      <section id="work" className={s.wrapSection}>
        <p className={s.eyebrowLabel}>&mdash; Our products</p>
        <h2 className={s.h2}>Our products</h2>
        <p className={s.sub}>Three products, each built to solve one problem well.</p>
        <div className="grid">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>
      <section id="solutions" className={s.wrapSection}>
        <p className={s.eyebrowLabel}>&mdash; How we build</p>
        <h2 className={s.h2}>How we build</h2>
        <div className="grid">
          <div className="card"><h3>Problem first</h3><p>Every product starts with a real pain point, not a feature list.</p></div>
          <div className="card"><h3>Ship fast</h3><p>Small team, short cycles, constant feedback from users.</p></div>
          <div className="card"><h3>Stay focused</h3><p>We do fewer things and do them better.</p></div>
        </div>
      </section>
    </div>
  );
}
