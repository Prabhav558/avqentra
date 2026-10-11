import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ p, index }: { p: Product; index: number }) {
  return (
    <Link className="card link product-card" href={`/products/${p.slug}`}>
      <span className="product-card-top">
        <span className="product-card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span className="tag">{p.status}</span>
      </span>
      <span className="product-card-category">{p.category}</span>
      <h3>{p.name}</h3>
      <p>{p.tagline}</p>
      <ul className="product-card-points">
        {p.highlights.slice(0, 2).map((h) => <li key={h}>{h}</li>)}
      </ul>
      <span className="more">Learn more <span aria-hidden="true">&rarr;</span></span>
    </Link>
  );
}
