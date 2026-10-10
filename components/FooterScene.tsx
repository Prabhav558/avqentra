"use client";
import { useEffect, useRef } from "react";

/*
 * The footer pins to the bottom of the screen once it is fully visible. Further
 * scrolling (through the spacer below it) slides a logo panel up from behind the
 * footer's top edge, one-to-one with scroll distance (--p: 0 → 1).
 */
export default function FooterScene({ children }: { children: React.ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sc = scene.current, sp = spacer.current;
    if (!sc || !sp) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sc.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const S = sc.offsetHeight;
      sc.style.top = `${window.innerHeight - S}px`; // pin once the footer's bottom meets the viewport's
      const extra = sp.offsetHeight;
      const spacerTop = sp.getBoundingClientRect().top;
      // spacer top sits at (viewport height) when pinning starts and at (viewport height - extra) when done
      const p = (window.innerHeight - spacerTop) / extra;
      sc.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(sc);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="footer-end">
      <div ref={scene} className="footer-scene">
        <div className="footer-stage" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer-logo" src="/logo.svg" alt="" width={292} height={36} decoding="async" />
        </div>
        {children}
      </div>
      <div ref={spacer} className="footer-spacer" aria-hidden="true" />
    </div>
  );
}
