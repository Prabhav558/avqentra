"use client";
import { useEffect, useRef } from "react";

type Mode = "default" | "link" | "anchor" | "press" | "text" | "inspect" | "replay";

// Decide the cursor shape from whatever is under the pointer.
function modeFor(el: Element | null): Mode {
  if (!el) return "default";
  const explicit = el.closest("[data-cursor]")?.getAttribute("data-cursor");
  if (explicit) return explicit as Mode;
  if (el.closest("input, textarea, select, [contenteditable]")) return "text";
  const a = el.closest("a[href]");
  if (a) return a.getAttribute("href")?.replace(/^\//, "").startsWith("#") ? "anchor" : "link";
  if (el.closest("button, summary, [role=tab], label")) return "press";
  if (el.closest("h1, h2, h3, p, li, dd, dt")) return "text";
  return "default";
}

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const r = ring.current!;

    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0, shown = false;

    const frame = () => {
      rx += (tx - rx) * (reduce ? 1 : 0.2);
      ry += (ty - ry) * (reduce ? 1 : 0.2);
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.1 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const setMode = (m: Mode) => { r.dataset.mode = m; };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) {
        shown = true;
        rx = tx; ry = ty;
        root.classList.add("has-cursor");
        r.dataset.show = "true";
      }
      setMode(modeFor(e.target as Element));
      kick();
    };
    const onDown = () => { r.dataset.down = "true"; };
    const onUp = () => {
      r.dataset.down = "false";
      // retrigger the click pulse
      r.classList.remove("cur-pulse");
      void r.offsetWidth;
      r.classList.add("cur-pulse");
    };
    const onLeave = () => { r.dataset.show = "false"; };
    const onEnter = () => { if (shown) r.dataset.show = "true"; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cur-ring" data-mode="default" data-show="false" aria-hidden="true">
        <div className="cur-shape">
          <svg className="cur-icon cur-i-link" viewBox="0 0 24 24"><path d="M7 17 17 7M8.5 7H17v8.5" /></svg>
          <svg className="cur-icon cur-i-anchor" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          <svg className="cur-icon cur-i-replay" viewBox="0 0 24 24"><path d="M5 12a7 7 0 1 0 2.2-5.1M5 5v4h4" /></svg>
          <span className="cur-cross" />
        </div>
      </div>
    </>
  );
}
