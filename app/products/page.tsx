import type { Metadata } from "next";
import ProductsHub from "@/components/ProductsHub";

export const metadata: Metadata = { title: "Products" };

export default function Products() {
  return <ProductsHub />;
}
