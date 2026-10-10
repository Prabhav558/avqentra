import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";

const p = getProduct("devsick")!;

export const metadata: Metadata = { title: p.title, description: p.lead };

export default function Page() {
  return <ProductDetail p={p} variant="incident" />;
}
