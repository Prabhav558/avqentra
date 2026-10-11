/** Where messages from the contact form (and the direct-email links) go. */
export const contactEmail = "founder@avqentra.in";

export const siteName = "Avqentra";
export const siteTagline = "Ideas into tools.";
export const siteDescription =
  "Avqentra is a product and engineering studio. We build tools that measure, explain and verify what AI produces, and software for clients.";

/** Public origin, used for canonical links, the sitemap and share images. Override per environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://avqentra.in").replace(/\/$/, "");
