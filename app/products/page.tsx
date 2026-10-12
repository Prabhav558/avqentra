import type { Metadata } from "next";
import ProductsLanding from "@/components/ProductsLanding";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "AI products: agent evaluation, incident reasoning and more",
  description: "AgentBattle, DevSick, QuestionForge and Ops Academy: four products that measure, explain and verify what AI produces, now in development.",
  path: "/products",
});

export default function Products() {
  return <ProductsLanding />;
}
