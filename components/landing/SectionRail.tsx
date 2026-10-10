"use client";
import { useEffect, useState } from "react";

const items = [
  { id: "top", n: "01", label: "Intro" },
  { id: "agentbattle", n: "02", label: "AgentBattle" },
  { id: "devsick", n: "03", label: "DevSick" },
  { id: "questionforge", n: "04", label: "QuestionForge" },
  { id: "closing", n: "05", label: "Contact" },
];

/** Fixed left rail: section numbers, highlights the one in view. */
export default function SectionRail() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="rail" aria-label="Sections">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={active === i.id ? "on" : ""} aria-current={active === i.id ? "true" : undefined}>
          <b>{i.n}</b><span>{i.label}</span>
        </a>
      ))}
    </nav>
  );
}
