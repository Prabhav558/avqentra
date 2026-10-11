import type { Metadata } from "next";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/about/Hero";
import Thesis from "@/components/about/Thesis";
import Offer from "@/components/about/Offer";
import Standards from "@/components/about/Standards";
import Team from "@/components/about/Team";
import Closing from "@/components/about/Closing";
import { display, mono } from "@/lib/fonts";
import h from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Avqentra is a product and engineering studio. We build tools that measure, explain and verify what AI produces, and software for clients.",
};

export default function About() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <SiteHeader />
      <Hero />
      <Thesis />
      <Offer />
      <Standards />
      <Team />
      <Closing />
    </div>
  );
}
