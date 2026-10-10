import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./products.css";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`pv ${GeistSans.variable} ${GeistMono.variable}`}>{children}</div>;
}
