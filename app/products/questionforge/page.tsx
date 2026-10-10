import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { getProduct } from "@/lib/products";

const p = getProduct("questionforge")!;

export const metadata: Metadata = { title: p.title, description: p.lead };

export default function Page() {
  return <ProductPage p={p} variant="forge" />;
}
