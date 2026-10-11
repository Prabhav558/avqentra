"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import OptionWheel from "@/components/OptionWheel/OptionWheel";
import { products } from "@/lib/products";
import { productVisuals } from "./ProductVisuals";
import s from "./home.module.css";

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

const items = products.map((p) => ({ ...p, Visual: productVisuals[p.slug] }));

const names = items.map((p) => p.name);
const N = items.length;
const pad = (n: number) => String(n).padStart(2, "0");

// Must match the media query that un-pins the stage in home.module.css.
const PINNED = "(min-width: 1081px) and (min-height: 621px)";
// After a click/drag we scroll the page to that product; ignore scroll-derived
// updates until it arrives so the wheel isn't dragged back through the others.
const LOCK_MS = 1400;

export default function Ecosystem() {
  const track = useRef<HTMLElement>(null);
  const lock = useRef<{ idx: number; until: number } | null>(null);
  const wheelBox = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [nameSize, setNameSize] = useState(3);

  // Size the names to the column, so the longest one ("QuestionForge") never gets clipped.
  useEffect(() => {
    const el = wheelBox.current;
    if (!el) return;
    const fit = () => setNameSize(Math.min(3.8, Math.max(2.2, (el.clientWidth - 28) / 118)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll position inside the pinned track decides which product is shown.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mq = window.matchMedia(PINNED);
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (!mq.matches) return;
      const dist = el.offsetHeight - window.innerHeight;
      if (dist <= 0) return;
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / dist, 0), 1);
      const idx = Math.min(N - 1, Math.floor(p * N));
      const l = lock.current;
      if (l) {
        if (idx !== l.idx && performance.now() < l.until) return;
        lock.current = null;
      }
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    // The user taking over the scroll cancels any pending jump.
    const release = () => {
      lock.current = null;
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
    };
  }, []);

  // Wheel interaction (click / drag / arrow keys) moves the page to that product,
  // keeping the scroll position as the single source of truth.
  const select = useCallback((idx: number) => {
    setActive(idx);
    const el = track.current;
    if (!el || !window.matchMedia(PINNED).matches) return;
    const dist = el.offsetHeight - window.innerHeight;
    const top = window.scrollY + el.getBoundingClientRect().top + ((idx + 0.5) / N) * dist;
    lock.current = { idx, until: performance.now() + LOCK_MS };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <section
      ref={track}
      id="ecosystem"
      className={s.eco}
      aria-labelledby="ecosystem-h"
      style={{ "--eco-n": N } as React.CSSProperties}
    >
      <div className={s.ecoStage}>
        <div className={s.ecoHead}>
          <div>
            <p className={s.kicker}>— Our products</p>
            <h2 className={`${s.h2} ${s.ecoTitle}`} id="ecosystem-h">
              Four products. Distinct problems. One engineering mindset.
            </h2>
          </div>
          <p className={s.ecoIntro}>
            Testing AI agents, explaining production failures, generating interview questions and teaching
            operations: four focused products in development.
          </p>
        </div>

        <div className={s.ecoGrid}>
          <div className={s.ecoLeft}>
            <div className={s.ecoWheel} ref={wheelBox}>
              <OptionWheel
                items={names}
                selected={active}
                onChange={select}
                captureWheel={false}
                ariaLabel="Avqentra products"
                textColor="#6f6c65"
                activeColor="#f2efe8"
                fontSize={nameSize}
                spacing={1.4}
                tilt={8}
                curve={1}
                blur={1.2}
                fade={0.42}
                minOpacity={0.12}
                smoothing={170}
                inset={12}
              />
            </div>

            <div className={s.ecoMeta} aria-hidden="true">
              <span className={s.ecoCount}>
                <b>{pad(active + 1)}</b> / {pad(N)}
              </span>
              <span className={s.ecoRail}>
                <i style={{ transform: `scaleX(${(active + 1) / N})` }} />
              </span>
              <span className={s.ecoHint}>Scroll</span>
            </div>
          </div>

          <div className={s.ecoRight}>
            {items.map(({ slug, name, status, category, headline, summary, Visual }, i) => (
              <article key={slug} className={s.ecoPanel} data-active={i === active} inert={i !== active}>
                <div className={s.productText}>
                  <span className={s.productNum}>
                    {pad(i + 1)} / {pad(N)}
                  </span>
                  <p className={s.productCat}>
                    {category} <span className={s.productStatus}>{status}</span>
                  </p>
                  <h3 className={s.h3}>{headline}</h3>
                  <p className={s.body}>{summary}</p>
                  <Link href={`/products/${slug}`} className={`${s.btn} ${s.btnGhost}`}>
                    Explore {name} <Arrow />
                  </Link>
                </div>
                <div className={s.productVisual} data-cursor="inspect">
                  <Visual />
                  <span className={s.visualCaption}>{name} &middot; Illustrative interface</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
