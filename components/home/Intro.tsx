"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { EMBLEM, LETTERS, LOGO_FULL, LOGO_VIEWBOX } from "./introPaths";
import s from "./intro.module.css";

/*
 * Logo intro, ~3.15s, played once per tab session on the homepage.
 *
 *   0.00  The signal     a bone-white point appears; an olive line runs out from it; construction lines emerge.
 *   0.40  The emblem     the point travels the line and settles into the emblem's dot; both emblem strokes
 *                        draw along their real contours, fill from the base up, and a light sweep crosses them.
 *   1.35  The wordmark   letters rise left to right through the olive line (it is their mask edge) while the
 *                        tracking settles; the line retracts into the dot; emblem and wordmark brighten together.
 *   2.55  The pause      everything still, ivory on smoky black; the olive glow fades.
 *   2.65  Hand-off       the logo flies into the header logo's place as the overlay lifts and the hero starts.
 *
 * Every element is born from something already on screen. Add ?intro to the URL to replay it.
 */

// Logo-space geometry (see introPaths.ts / LOGO_VIEWBOX)
const CX = 1205; // horizontal centre of the logo
const LINE_Y = 258; // the signal line, just under the wordmark baseline
const MASK_Y = 257; // letters are clipped above this
const LINE_L = 247; // left end of the line: the emblem dot's left edge
const LINE_R = 2375; // right end: the end of the wordmark
const DOT = { x: 277.6, y: 271.6 }; // centre of the emblem's dot
const WORD_CX = 1533.5;
const RISE = 172; // letters start this far below their final position (fully under the mask)

const H_GUIDES = [39, 104, 325]; // emblem top, cap line, emblem base
const V_GUIDES = [37, 490, 692, 2373]; // emblem and wordmark bounds

const BONE = "#efe8da";
const IVORY = "#e6dcc8";
const OLIVE = "#7d7853";

export const INTRO_FLAG = "avq-intro";

// Runs during HTML parsing, before the overlay paints: decides play/skip with no flash either way.
const decide = `try{var d=document.documentElement,q=location.search.indexOf("intro")>-1;d.dataset.intro=(!q&&(sessionStorage.getItem("${INTRO_FLAG}")||matchMedia("(prefers-reduced-motion: reduce)").matches))?"skip":"play"}catch(e){document.documentElement.dataset.intro="skip"}`;

export default function Intro() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "play" || !root.current || !svg.current) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_FLAG, "1");
    } catch {}

    const el = root.current;
    const q = <T extends Element = SVGElement>(sel: string) => el.querySelector(sel) as T;
    const qa = (sel: string) => Array.from(el.querySelectorAll<SVGElement>(sel));

    const outlines = qa("[data-outline]") as SVGPathElement[];
    const letters = qa("[data-letter]");
    const hGuides = qa("[data-hguide]");
    const vGuides = qa("[data-vguide]");

    const finish = () => {
      html.dataset.intro = "done";
      setDone(true);
    };

    const ctx = gsap.context(() => {
      // ---- frame 0 ----
      gsap.set(el.querySelectorAll("[data-p]"), { opacity: 1 });
      gsap.set(q("[data-point]"), { attr: { cx: CX, cy: LINE_Y }, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(q("[data-halo]"), { attr: { cx: CX, cy: LINE_Y }, scale: 0.4, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(qa("[data-line]"), { attr: { x1: CX, x2: CX } });
      gsap.set(hGuides, { attr: { x1: CX, x2: CX }, opacity: 0 });
      gsap.set(vGuides, { attr: { y1: LINE_Y, y2: LINE_Y }, opacity: 0 });
      outlines.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });
      gsap.set(q("[data-wipe]"), { attr: { y: 340 } });
      gsap.set(q("[data-dot]"), { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(q("[data-sweep]"), { x: -260 });
      letters.forEach((g, i) => {
        gsap.set(g, { x: (LETTERS[i].cx - WORD_CX) * 0.085, y: RISE });
      });
      gsap.set(q("[data-glow]"), { opacity: 0 });
      gsap.set([q("[data-shine]"), q("[data-bloom]")], { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });

      // ---- Scene 1: the signal ----
      tl.to(q("[data-point]"), { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, 0.05)
        .to(q("[data-halo]"), { opacity: 0.55, scale: 1, duration: 0.18, ease: "power2.out" }, 0.08)
        .to(q("[data-halo]"), { opacity: 0, scale: 3.2, duration: 0.55, ease: "power2.out" }, 0.26)
        .to(q("[data-line=l]"), { attr: { x2: LINE_L }, duration: 0.42, ease: "power3.inOut" }, 0.14)
        .to(q("[data-line=r]"), { attr: { x2: LINE_R }, duration: 0.42, ease: "power3.inOut" }, 0.14)
        // construction lines grow out of the point, then recede once the emblem stands on its own
        .to(hGuides, { attr: { x1: -6000, x2: 8400 }, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.04 }, 0.18)
        .to(vGuides, { attr: { y1: -4000, y2: 4500 }, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.04 }, 0.22)
        .to([...hGuides, ...vGuides], { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 1.25);

      // ---- Scene 2: the emblem ----
      // the point runs the line to the emblem and drops into the dot's place
      tl.to(q("[data-point]"), { attr: { cx: DOT.x }, duration: 0.42, ease: "power3.inOut" }, 0.4)
        .to(q("[data-point]"), { attr: { cy: DOT.y }, duration: 0.2, ease: "power2.inOut" }, 0.72)
        // ...and becomes the dot
        .to(q("[data-dot]"), { scale: 1, opacity: 1, duration: 0.34, ease: "power3.out" }, 0.8)
        .to(q("[data-point]"), { opacity: 0, duration: 0.2, ease: "power1.out" }, 0.86)
        // both strokes draw along their real contours, starting at their bases beside the dot
        .to(outlines[0], { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.6)
        .to(outlines[1], { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.66)
        // the fill rises behind the drawing line, then the outline dissolves into it
        .to(q("[data-wipe]"), { attr: { y: -60 }, duration: 0.5, ease: "power2.inOut" }, 0.88)
        .to(outlines, { opacity: 0, duration: 0.3, ease: "power1.out" }, 1.2)
        // a narrow ivory light crosses the finished strokes
        .to(q("[data-sweep]"), { x: 640, duration: 0.55, ease: "power2.inOut" }, 1.12)
        // olive warmth gathers behind the mark
        .to(q("[data-glow]"), { opacity: 1, duration: 0.8, ease: "power1.inOut" }, 0.95);

      // ---- Scene 3: the wordmark ----
      tl.to(letters, { y: 0, duration: 0.52, ease: "expo.out", stagger: 0.05 }, 1.35)
        .to(letters, { x: 0, duration: 0.85, ease: "power3.out" }, 1.35)
        // the line, its job done, draws back into the dot it came from
        .to(qa("[data-line]"), { attr: { x1: LINE_L, x2: LINE_L }, duration: 0.42, ease: "power3.inOut" }, 2.06)
        .to(qa("[data-line]"), { opacity: 0, duration: 0.18, ease: "power1.in" }, 2.3)
        // emblem and wordmark illuminate together
        .to(q("[data-shine]"), { opacity: 0.55, duration: 0.14, ease: "power2.out" }, 2.2)
        .to(q("[data-bloom]"), { opacity: 0.5, duration: 0.14, ease: "power2.out" }, 2.2)
        .to([q("[data-shine]"), q("[data-bloom]")], { opacity: 0, duration: 0.32, ease: "power2.inOut" }, 2.34)
        .to(el, { backgroundColor: "#0a0a08", duration: 0.8, ease: "none" }, 1.6);

      // ---- Scene 4: the pause ----
      tl.to(q("[data-glow]"), { opacity: 0, duration: 0.55, ease: "power1.inOut" }, 2.25);

      // ---- Hand-off to the page ----
      tl.addLabel("exit", 2.65).call(
        () => {
          gsap.killTweensOf(tl);
          tl.timeScale(1);
          html.dataset.intro = "exit"; // releases the hero's entrance animations
          const target = document.querySelector<HTMLElement>("[data-intro-target]");
          const from = svg.current!.getBoundingClientRect();
          const t = target?.getBoundingClientRect();
          if (t && t.width > 0 && t.bottom > 0) {
            // the header image letterboxes the logo (meet), so fit the viewBox aspect inside its box
            const aspect = from.width / from.height;
            const w = Math.min(t.width, t.height * aspect);
            const h = w / aspect;
            gsap.to(svg.current, {
              x: t.left + (t.width - w) / 2 - from.left,
              y: t.top + (t.height - h) / 2 - from.top,
              scale: w / from.width,
              transformOrigin: "0 0",
              duration: 0.5,
              ease: "power3.inOut",
            });
          } else {
            gsap.to(svg.current, { opacity: 0, scale: 0.97, transformOrigin: "50% 50%", duration: 0.4, ease: "power2.in" });
          }
          gsap.to(el, { backgroundColor: "rgba(10,10,8,0)", duration: 0.4, delay: 0.05, ease: "power1.inOut" });
        },
        [],
        "exit",
      );
      tl.to({}, { duration: 0.5 }, "exit");

      // Any attempt to move on fast-forwards to the hand-off instead of cutting the animation.
      const hurry = (e: Event) => {
        if (tl.time() >= 2.65) return;
        if (e.cancelable && e.type !== "pointerdown") e.preventDefault();
        if (tl.timeScale() < 3) gsap.to(tl, { timeScale: 4, duration: 0.25, ease: "power1.in" });
      };
      const keys = (e: KeyboardEvent) => {
        if (/^(Arrow|Page|Home|End| |Escape|Enter)/.test(e.key) || e.key === " ") hurry(e);
      };
      window.addEventListener("wheel", hurry, { passive: false });
      window.addEventListener("touchmove", hurry, { passive: false });
      window.addEventListener("pointerdown", hurry);
      window.addEventListener("keydown", keys);
      return () => {
        window.removeEventListener("wheel", hurry);
        window.removeEventListener("touchmove", hurry);
        window.removeEventListener("pointerdown", hurry);
        window.removeEventListener("keydown", keys);
      };
    }, el);

    return () => {
      ctx.revert();
      if (html.dataset.intro !== "skip") html.dataset.intro = "done";
    };
  }, []);

  if (done) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div ref={root} className={s.intro} aria-hidden="true">
        <svg ref={svg} className={s.mark} viewBox={LOGO_VIEWBOX} overflow="visible">
          <defs>
            <radialGradient id="avqi-glow">
              <stop offset="0" stopColor="#6e6c3e" stopOpacity=".32" />
              <stop offset=".55" stopColor="#6e6c3e" stopOpacity=".1" />
              <stop offset="1" stopColor="#6e6c3e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="avqi-halo">
              <stop offset="0" stopColor={BONE} stopOpacity=".9" />
              <stop offset="1" stopColor={BONE} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="avqi-wipe-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".12" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="avqi-sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fffaf0" stopOpacity="0" />
              <stop offset=".5" stopColor="#fffaf0" stopOpacity=".95" />
              <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
            </linearGradient>
            <mask id="avqi-wipe" maskUnits="userSpaceOnUse" x="0" y="-400" width="600" height="1200">
              <rect data-wipe x="20" y="340" width="500" height="700" fill="url(#avqi-wipe-grad)" />
            </mask>
            <clipPath id="avqi-emblem">
              <path d={EMBLEM.left} />
              <path d={EMBLEM.right} />
            </clipPath>
            <clipPath id="avqi-above-line">
              <rect x="-200" y="-400" width="3000" height={MASK_Y + 400} />
            </clipPath>
            <filter id="avqi-blur" x="-10%" y="-80%" width="120%" height="260%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <ellipse data-glow data-p className={s.p} cx={CX} cy="182" rx="1500" ry="520" fill="url(#avqi-glow)" />

          {/* construction lines */}
          <g stroke={IVORY} strokeOpacity=".075" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {H_GUIDES.map((y) => (
              <line key={`h${y}`} data-hguide data-p className={s.p} x1={CX} x2={CX} y1={y} y2={y} vectorEffect="non-scaling-stroke" />
            ))}
            {V_GUIDES.map((x) => (
              <line key={`v${x}`} data-vguide data-p className={s.p} x1={x} x2={x} y1={LINE_Y} y2={LINE_Y} vectorEffect="non-scaling-stroke" />
            ))}
          </g>

          {/* the signal line */}
          <g stroke={OLIVE} strokeWidth="1" strokeLinecap="round">
            <line data-line="l" data-p className={s.p} x1={CX} x2={CX} y1={LINE_Y} y2={LINE_Y} vectorEffect="non-scaling-stroke" />
            <line data-line="r" data-p className={s.p} x1={CX} x2={CX} y1={LINE_Y} y2={LINE_Y} vectorEffect="non-scaling-stroke" />
          </g>

          {/* emblem: contour drawing, rising fill, light sweep */}
          <g mask="url(#avqi-wipe)" fill={IVORY}>
            <path data-p className={s.p} d={EMBLEM.left} />
            <path data-p className={s.p} d={EMBLEM.right} />
          </g>
          <g fill="none" stroke={BONE} strokeWidth="1.15" strokeLinejoin="round">
            <path data-outline className={s.p} d={EMBLEM.left} vectorEffect="non-scaling-stroke" />
            <path data-outline className={s.p} d={EMBLEM.right} vectorEffect="non-scaling-stroke" />
          </g>
          <g clipPath="url(#avqi-emblem)">
            <rect data-sweep data-p className={s.p} x="-40" y="-200" width="70" height="700" fill="url(#avqi-sweep-grad)" transform="rotate(18 250 180)" />
          </g>
          <path data-dot className={s.p} d={EMBLEM.dot} fill={IVORY} />

          {/* wordmark, rising through the line */}
          <g clipPath="url(#avqi-above-line)" fill={IVORY}>
            {LETTERS.map((l, i) => (
              <g key={i} data-letter data-p className={s.p}>
                <path d={l.d} fillRule="evenodd" />
              </g>
            ))}
          </g>

          {/* emblem + wordmark brighten together */}
          <path data-bloom className={s.p} d={LOGO_FULL} fill={IVORY} fillRule="evenodd" filter="url(#avqi-blur)" />
          <path data-shine className={s.p} d={LOGO_FULL} fill="#fff8ea" fillRule="evenodd" />

          {/* the point (drawn last, so it rides over everything) */}
          <circle data-halo className={s.p} cx={CX} cy={LINE_Y} r="40" fill="url(#avqi-halo)" />
          <circle data-point data-p className={s.p} cx={CX} cy={LINE_Y} r="8.5" fill={BONE} />
        </svg>
      </div>
    </>
  );
}
