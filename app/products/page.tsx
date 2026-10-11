import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "AgentBattle, DevSick, QuestionForge and Ops Academy: four AI products from Avqentra, launching soon.",
};

export default function Products() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Products</h1>
        <p>Four products in development, each launching soon. Get early access to any of them.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <div className="product-grid">{products.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}</div>
      </section>
    </div>
  );
}
