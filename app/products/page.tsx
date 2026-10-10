import type { Metadata } from "next";
import ProductsLanding from "@/components/ProductsLanding";

export const metadata: Metadata = { title: "Products", description: "Three products. One mission." };

export default function Products() {
  return <ProductsLanding />;
}
