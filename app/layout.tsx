import type { Metadata, Viewport } from "next";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import FooterScene from "@/components/FooterScene";
import Nav from "@/components/Nav";
import { display, mono } from "@/lib/fonts";
import { founders } from "@/lib/founders";
import { contactEmail, siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Avqentra | AI products and software engineering studio", template: "%s | Avqentra" },
  description:
    "Avqentra is a product and engineering studio. We're building AgentBattle, DevSick, QuestionForge and Ops Academy, and we build software for clients.",
  applicationName: siteName,
  alternates: { canonical: "./" },
  // title and description are inherited from each page, so a shared link to /products/devsick says "DevSick"
  openGraph: { type: "website", siteName, url: "./" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0e0e0b", colorScheme: "dark" };

// Structured data so search engines can tie the site to the company and its founders.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/avqentra-logo.png`,
  description: siteDescription,
  email: contactEmail,
  founder: founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.title })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
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
