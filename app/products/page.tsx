import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Products" };

export default function Products() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Products</h1>
        <p>Everything we&apos;ve built so far.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <div className="grid">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>
    </div>
  );
}
