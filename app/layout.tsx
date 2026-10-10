import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import FooterScene from "@/components/FooterScene";
import Nav from "@/components/Nav";
import { display, mono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Avqentra | AI products and software engineering studio", template: "%s | Avqentra" },
  description:
    "Avqentra is a product and engineering studio. We're launching AgentBattle, DevSick, QuestionForge and Ops Academy, and we build software for clients.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>
        <Cursor />
        <Nav />
        <main>{children}</main>
        <FooterScene>
          <Footer />
        </FooterScene>
      </body>
    </html>
  );
}
