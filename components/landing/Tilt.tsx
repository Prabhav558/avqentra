"use client";
import { useEffect, useRef } from "react";

/** Perspective stage: pointer-driven tilt (eased by CSS transitions) + reveal on scroll. */
export default function Tilt({ children, flip = false, className = "" }: { children: React.ReactNode; flip?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("in", e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const fine = window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
        el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
      });
    };
    const leave = () => { el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); };
    if (fine) { el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave); }
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return (
    <div ref={ref} className={`stage3d ${flip ? "flip" : ""} ${className}`}>
      <div className="rock r1" /><div className="rock r2" />
      <div className="slab s1" /><div className="slab s2" />
      <div className="device">{children}<i className="glare" /></div>
    </div>
  );
}
