import type { Metadata } from "next";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/founders/Hero";
import Profiles from "@/components/founders/Profiles";
import Story from "@/components/founders/Story";
import Ownership from "@/components/founders/Ownership";
import Closing from "@/components/founders/Closing";
import { display, mono } from "@/lib/fonts";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, pageMeta } from "@/lib/seo";
import h from "@/components/home/home.module.css";

export const metadata: Metadata = pageMeta({
  title: "Founders: Yash Srivastava, Prabhav Singh and Ishaan Bajpai",
  description: "Meet the three founders of Avqentra and see who owns strategy, engineering and finance, so you know who makes each decision.",
  path: "/founders",
});

export default function Founders() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <JsonLd data={breadcrumbs([{ name: "Founders", path: "/founders" }])} />
      <SiteHeader />
      <Hero />
      <Profiles />
      <Story />
      <Ownership />
      <Closing />
    </div>
  );
}
