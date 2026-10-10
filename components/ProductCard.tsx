"use client";
import Link from "next/link";
import type { Product } from "@/lib/products";

type Props = { p: Product; onHover?: (on: boolean) => void };

export default function ProductCard({ p, onHover }: Props) {
  return (
    <Link
      className="card link pcard"
      href={`/products/${p.slug}`}
      style={{ ["--c" as string]: p.accent }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <span className="tag"><i />{p.tag}</span>
      <h3>{p.name}</h3>
      <p>{p.tagline}</p>
      <span className="more">Learn more <span className="arrow">&rarr;</span></span>
    </Link>
  );
}
