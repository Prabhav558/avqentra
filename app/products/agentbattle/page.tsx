import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { getPageProduct } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

const p = getPageProduct("agentbattle")!;

export const metadata: Metadata = pageMeta({ title: `${p.title}: ${p.category}`, description: p.summary, path: "/products/agentbattle" });

export default function Page() {
  return <ProductDetail p={p} variant="arena" />;
}
