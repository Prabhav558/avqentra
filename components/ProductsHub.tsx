"use client";
import { useState } from "react";
import Link from "next/link";
import Scene from "./Scene";
import ProductCard from "./ProductCard";
import { products } from "@/lib/products";

export default function ProductsHub({ home = false }: { home?: boolean }) {
  const [focus, setFocus] = useState(-1);
  return (
    <>
      <div className="stage hub">
        <Scene className="scene" variant="hub" focus={focus} />
        <div className="wrap content">
          <span className="badge"><i />{home ? "Product studio" : "Avqentra products"}</span>
          <h1>
            {home ? <>Products that <span className="grad">change how work gets done.</span></> : <>Three products.<br /><span className="grad">One standard.</span></>}
          </h1>
          <p>Focused tools for AI and developers: benchmark agents, resolve incidents, and generate verified interview questions.</p>
          {home && (
            <div className="btns" style={{ justifyContent: "flex-start", marginTop: 32 }}>
              <Link className="btn primary" href="/products">See our products</Link>
              <Link className="btn" href="/contact">Get in touch</Link>
            </div>
          )}
        </div>
      </div>
      <div className="wrap">
        <section style={{ paddingTop: 40 }}>
          <div className="grid">
            {products.map((p, i) => (
              <ProductCard key={p.slug} p={p} onHover={(on) => setFocus(on ? i : -1)} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
