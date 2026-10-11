"use client";
import { useEffect, useRef } from "react";
import s from "./home.module.css";

/** Perspective stage for a tilted interface panel. The pointer nudges the tilt; touch and reduced motion get a still panel. */
export default function TiltStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
        el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
      });
    };
    const leave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={s.tilt} data-cursor="inspect">
      <div className={`${s.tiltSlab} ${s.tiltSlab1}`} aria-hidden="true" />
      <div className={`${s.tiltSlab} ${s.tiltSlab2}`} aria-hidden="true" />
      <div className={s.tiltDevice}>
        {children}
        <i className={s.tiltGlare} aria-hidden="true" />
      </div>
    </div>
  );
}
