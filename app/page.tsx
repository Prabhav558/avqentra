import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import Ecosystem from "@/components/home/Ecosystem";
import { AboutSection, Capabilities, Demonstration, FinalCta, Philosophy, Process } from "@/components/home/Sections";
import { display, mono } from "@/lib/fonts";
import s from "@/components/home/home.module.css";

export default function Home() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${s.page}`}>
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
