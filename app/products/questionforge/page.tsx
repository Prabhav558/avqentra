import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { getPageProduct } from "@/lib/products";

const p = getPageProduct("questionforge")!;

export const metadata: Metadata = { title: p.title, description: p.lead };

export default function Page() {
  return <ProductDetail p={p} variant="forge" />;
}
