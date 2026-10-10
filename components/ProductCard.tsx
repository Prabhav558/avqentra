import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link className="card link" href={`/products/${p.slug}`}>
      <span className="tag">{p.tag}</span>
      <h3>{p.name}</h3>
      <p>{p.tagline}</p>
      <span className="more">Learn more &rarr;</span>
    </Link>
  );
}
