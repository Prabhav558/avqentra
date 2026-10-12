import type { Metadata } from "next";
import { founders } from "./founders";
import { contactEmail, siteDescription, siteName, siteUrl } from "./site";

const shareAlt = "Avqentra: ideas into tools. A product and engineering studio.";

/** Search snippets cut off around 160 characters, so long copy is trimmed at a word boundary. */
export function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

/** Title, description, canonical, Open Graph and Twitter tags for one page, so none of them drift apart. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const d = clip(description);
  return {
    title,
    description: d,
    alternates: { canonical: path },
    // Child pages replace the parent's social tags wholesale, so the share images are named here too.
    openGraph: { type: "website", siteName, url: path, title: `${title} | ${siteName}`, description: d, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: shareAlt }] },
    twitter: { card: "summary_large_image", title: `${title} | ${siteName}`, description: d, images: ["/twitter-image.png"] },
  };
}

export const absolute = (path: string) => `${siteUrl}${path}`;

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: absolute(t.path === "/" ? "" : t.path),
  })),
});

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/avqentra-logo.png`,
  description: siteDescription,
  email: contactEmail,
  slogan: "Ideas into tools.",
  knowsAbout: ["AI agent evaluation", "Incident root-cause analysis", "Technical interview question validation", "Operations training", "Software engineering"],
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: contactEmail, availableLanguage: "English" },
  founder: founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.title, url: `https://${f.site}`, worksFor: { "@id": `${siteUrl}/#organization` } })),
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#organization` },
};
