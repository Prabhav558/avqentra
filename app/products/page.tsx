import type { Metadata } from "next";
import ProductsLanding from "@/components/ProductsLanding";

export const metadata: Metadata = { title: "Products", description: "AgentBattle, DevSick and QuestionForge, launching soon." };

export default function Products() {
  return <ProductsLanding />;
}
