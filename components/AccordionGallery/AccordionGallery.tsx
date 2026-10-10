"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

/*
 * AccordionGallery, from React Bits (reactbits.dev), ported to TypeScript.
 * Local additions to the original:
 *  - `media`: render any node (not just an image) as the panel artwork.
 *  - `tag`: a short identifier shown on collapsed panels (vertical text in a row), so strips are never anonymous.
 *  - `caption`: extra content revealed under the label on the open panel.
 *  - internal links use next/link; the aria list roles were dropped so the panels stay real links.
 *  - the built-in <=520px column override was removed; callers switch `orientation` instead.
 */

export type AccordionItem = {
  image?: string;
  media?: React.ReactNode;
  label?: string;
  tag?: React.ReactNode;
  caption?: React.ReactNode;
  link?: string;
  alt?: string;
};

export type AccordionGalleryProps = {
  items: AccordionItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  surfaceColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  ariaLabel?: string;
  className?: string;
};

const AccordionGallery = ({
  items,
  defaultIndex = 2,
  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",
  surfaceColor = "#0a0713",
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  ariaLabel = "Image accordion gallery",
  className = "",
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const extraRefs = useRef<(HTMLElement | null)[]>([]);
  const tagRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        const extra = extraRefs.current[i];
        const tag = tagRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              "--ag-gray": gray,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (showLabels && bar && text) {
          const shown = [bar, text, extra].filter(Boolean) as HTMLElement[];
          if (isActive) {
            tl.to(shown, { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to(shown, { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }

        if (tag) tl.to(tag, { opacity: isActive ? 0 : 1, duration: dur * 0.6, ease }, 0);
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (i: number) => {
    if (trigger === "hover") setActive(i);
  };

  // A first press on a collapsed panel opens it; a press on the open panel follows its link.
  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? " accordion-gallery--vertical" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
          "--ag-surface": surfaceColor,
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
        } as React.CSSProperties
      }
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const common = {
          ref: (el: HTMLElement | null) => {
            panelRefs.current[i] = el;
          },
          className: `ag-panel${isActive ? " ag-panel--active" : ""}`,
          style: { borderRadius: `${radius}px` },
          onClick: (e: React.MouseEvent) => handleClick(i, e),
          onMouseEnter: () => handleEnter(i),
          onFocus: () => setActive(i),
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(i, e),
          tabIndex: 0,
          "aria-current": isActive ? ("true" as const) : undefined,
          "aria-label": item.label,
        };
        const inner = (
          <>
            <span className="ag-panel__frame">
              {(item.media || item.image) && (
                <span className="ag-panel__media" ref={(el) => { mediaRefs.current[i] = el; }}>
                  {item.media ?? <img src={item.image} alt={item.alt || item.label || ""} draggable="false" />}
                </span>
              )}
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {item.tag && (
              <span className="ag-panel__tag" ref={(el) => { tagRefs.current[i] = el; }} aria-hidden="true">
                {item.tag}
              </span>
            )}
            {showLabels && (
              <span className="ag-panel__label">
                <span className="ag-panel__name" aria-hidden="true">
                  <span className="ag-panel__bar" ref={(el) => { barRefs.current[i] = el; }} />
                  <span className="ag-panel__text" ref={(el) => { textRefs.current[i] = el; }}>
                    {item.label}
                  </span>
                </span>
                {item.caption && (
                  <span className="ag-panel__extra" ref={(el) => { extraRefs.current[i] = el; }}>
                    {item.caption}
                  </span>
                )}
              </span>
            )}
          </>
        );
        return item.link ? (
          <Link key={i} href={item.link} {...common}>
            {inner}
          </Link>
        ) : (
          <div key={i} {...common}>
            {inner}
          </div>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
