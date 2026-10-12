import type { MetadataRoute } from "next";
import { siteDescription, siteName, siteTagline } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName}: ${siteTagline}`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "browser",
    background_color: "#0e0e0b",
    theme_color: "#0e0e0b",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
