import type { Metadata } from "next";
import ProductsLanding from "@/components/ProductsLanding";

export const metadata: Metadata = { title: "Products", description: "AgentBattle, DevSick, QuestionForge and Ops Academy, launching soon." };

export default function Products() {
  return <ProductsLanding />;
}
