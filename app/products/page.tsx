import type { Metadata } from "next";
import ProductsLanding from "@/components/ProductsLanding";

export const metadata: Metadata = { title: "Products", description: "AgentBattle, DevSick, QuestionForge and Ops Academy: four AI products in development." };

export default function Products() {
  return <ProductsLanding />;
}
