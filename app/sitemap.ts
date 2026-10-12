import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteUpdated, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(siteUpdated);
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/products", 0.9),
    ...products.map((p) => page(`/products/${p.slug}`, 0.8)),
    page("/about", 0.7),
    page("/founders", 0.7),
    page("/contact", 0.7),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
  ];
}
