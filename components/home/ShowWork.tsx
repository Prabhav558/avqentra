"use client";
import { useEffect, useState } from "react";
import AccordionGallery from "@/components/AccordionGallery/AccordionGallery";
import { products } from "@/lib/products";
import { productVisuals } from "./ProductVisuals";
import s from "./home.module.css";

const work = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  ...p.walkthrough,
  Visual: productVisuals[p.slug],
}));

const pad = (n: number) => String(n).padStart(2, "0");

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

// Below this the row of panels becomes a column and the interface art gives way to the caption.
const COMPACT = "(max-width: 900px)";

export default function ShowWork() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(COMPACT);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const items = work.map(({ slug, name, category, intro, steps, Visual }, i) => ({
    label: name,
    link: `/products/${slug}`,
    tag: (
      <>
        <span className={s.gTagNum}>{pad(i + 1)}</span>
        <span className={s.gTagName}>{name}</span>
      </>
    ),
    media: (
      <span className={s.gMedia} data-cursor="inspect">
        <Visual />
      </span>
    ),
    caption: (
      <span className={s.gCap}>
        <span className={s.gCat}>{category}</span>
        <span className={s.gIntro}>{intro}</span>
        <span className={s.gSteps}>
          {steps.map((st, n) => (
            <span key={st}>
              <i>{pad(n + 1)}</i>
              {st}
            </span>
          ))}
        </span>
        <span className={s.gCta}>
          Explore {name} <Arrow />
        </span>
      </span>
    ),
  }));

  return (
    <div className={s.gallery}>
      <AccordionGallery
        items={items}
        defaultIndex={0}
        ariaLabel="Product demonstrations"
        trigger="hover"
        orientation={compact ? "vertical" : "horizontal"}
        height={compact ? 400 : 640}
        expandRatio={compact ? 0.62 : 0.52}
        tilt={compact ? 0 : 6}
        gap={10}
        radius={2}
        parallax={0.5}
        accentColor="#d8cdb4"
        overlayColor="#0a0a08"
        textColor="#f2efe8"
        surfaceColor="#12120e"
      />
      <p className={s.demoNote}>
        These are illustrative interfaces. Recordings and screenshots from the live products will replace them as each
        one is ready to show.
      </p>
    </div>
  );
}
