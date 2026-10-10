import type { Metadata } from "next";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/founders/Hero";
import Profiles from "@/components/founders/Profiles";
import Story from "@/components/founders/Story";
import Ownership from "@/components/founders/Ownership";
import Closing from "@/components/founders/Closing";
import { display, mono } from "@/lib/fonts";
import h from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: "Founders",
  description: "Meet Yash Srivastava, Prabhav Singh and Ishaan Bajpai, the founders of Avqentra.",
};

export default function Founders() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <SiteHeader />
      <Hero />
      <Profiles />
      <Story />
      <Ownership />
      <Closing />
    </div>
  );
}
