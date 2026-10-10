import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import FooterScene from "@/components/FooterScene";
import Nav from "@/components/Nav";
import { display, mono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Avqentra | Products that solve real problems", template: "%s | Avqentra" },
  description: "Avqentra builds AgentBattle, Devsick, QuestionForge and Ops Academy.",
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
