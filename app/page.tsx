import type { Metadata } from "next";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Ecosystem from "@/components/home/Ecosystem";
import { AboutSection, Capabilities, Demonstration, FinalCta, Philosophy, Process } from "@/components/home/Sections";
import { display, mono } from "@/lib/fonts";
import s from "@/components/home/home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Avqentra", url: "/", title: "Avqentra | AI products and software engineering studio", description: "We build AgentBattle, DevSick, QuestionForge and Ops Academy: tools that measure, explain and verify what AI produces. We also build software for clients." },
};

export default function Home() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${s.page}`}>
      <Intro />
      <SiteHeader />
      <Hero />
      <Ecosystem />
      <Philosophy />
      <Process />
      <Capabilities />
      <Demonstration />
      <AboutSection />
      <FinalCta />
    </div>
  );
}
