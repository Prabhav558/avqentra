import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { getPageProduct } from "@/lib/products";

const p = getPageProduct("ops-academy")!;

export const metadata: Metadata = { title: p.title, description: p.lead };

export default function Page() {
  return <ProductDetail p={p} variant="path" />;
}
