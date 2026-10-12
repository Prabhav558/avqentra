import type { Metadata, Viewport } from "next";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import FooterScene from "@/components/FooterScene";
import Nav from "@/components/Nav";
import { display, mono } from "@/lib/fonts";
import JsonLd from "@/components/JsonLd";
import { organization, website } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Avqentra | AI products and software engineering studio", template: "%s | Avqentra" },
  description:
    "Avqentra is a product and engineering studio. We're building AgentBattle, DevSick, QuestionForge and Ops Academy, and we build software for clients.",
  applicationName: siteName,
  keywords: ["AI product studio", "AI agent evaluation", "AI incident root cause analysis", "technical interview question generator", "operations training", "custom software development", "agentic AI engineering"],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
  alternates: { canonical: "./" },
  // title and description are inherited from each page, so a shared link to /products/devsick says "DevSick"
  openGraph: { type: "website", siteName, url: "./", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0e0e0b", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable}`}>
        <JsonLd data={[organization, website]} />
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
