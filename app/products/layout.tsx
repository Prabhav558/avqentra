import { display, mono } from "@/lib/fonts";
import "./products.css";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`pv ${display.variable} ${mono.variable}`}>{children}</div>;
}
