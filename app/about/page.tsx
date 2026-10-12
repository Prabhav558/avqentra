import type { Metadata } from "next";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/about/Hero";
import Thesis from "@/components/about/Thesis";
import Offer from "@/components/about/Offer";
import Standards from "@/components/about/Standards";
import Engagement from "@/components/about/Engagement";
import Team from "@/components/about/Team";
import Closing from "@/components/about/Closing";
import { display, mono } from "@/lib/fonts";
import JsonLd from "@/components/JsonLd";
import { absolute, breadcrumbs, pageMeta } from "@/lib/seo";
import h from "@/components/home/home.module.css";

export const metadata: Metadata = pageMeta({
  title: "About Avqentra: tools that make AI checkable",
  description:
    "Avqentra is a product and engineering studio. We build tools that measure, explain and verify what AI produces, and software for clients.",
  path: "/about",
});

export default function About() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "AboutPage", name: "About Avqentra", url: absolute("/about"), about: { "@id": absolute("/#organization") } },
          breadcrumbs([{ name: "About", path: "/about" }]),
        ]}
      />
      <SiteHeader />
      <Hero />
      <Thesis />
      <Offer />
      <Standards />
      <Engagement />
      <Team />
      <Closing />
    </div>
  );
}
