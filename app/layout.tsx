import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Avqentra | Products that solve real problems", template: "%s | Avqentra" },
  description: "Avqentra builds AgentBattle, Devsick and QuestionForge.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer>
          <div className="wrap">
            <span>&copy; {new Date().getFullYear()} Avqentra. All rights reserved.</span>
            <span>
              <Link href="/products">Products</Link> &middot; <Link href="/founders">Founders</Link> &middot; <Link href="/about">About</Link> &middot;{" "}
              <Link href="/contact">Contact</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
