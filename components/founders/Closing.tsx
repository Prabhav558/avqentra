import Link from "next/link";
import { responseTime } from "@/lib/site";
import { founders } from "@/lib/founders";
import h from "@/components/home/home.module.css";
import s from "./founders.module.css";

function Arrow() {
  return (
    <svg className={h.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

// Who a visitor should reach, by intent.
const intents: Record<string, string> = {
  yash: "Partnerships & product",
  prabhav: "Engineering & technology",
  ishaan: "Investment & finance",
};

export default function Closing() {
  return (
    <section id="talk" className={h.cta} aria-labelledby="talk-h">
      <div className={h.ctaGrid} aria-hidden="true" />
      <div className={`${h.ctaInner} ${s.ctaSplit} ${h.reveal}`}>
        <div>
          <p className={h.kicker}>— Talk to the founders</p>
          <h2 className={h.ctaTitle} id="talk-h">
            Straight to
            <br />
            <span className={h.gold}>the people who decide.</span>
          </h2>
          <p className={h.sub}>
            No sales layer, no gatekeepers. Every message, from a project brief to an early-access request, reaches a
            founder, and we reply within {responseTime}.
          </p>
          <div className={h.ctaActions}>
            <Link href="/contact?type=project" className={`${h.btn} ${h.btnSolid}`}>
              Start a project <Arrow />
            </Link>
            <Link href="/products" className={`${h.btn} ${h.btnGhost}`}>
              Explore our products <Arrow />
            </Link>
          </div>
        </div>

        <ul className={s.routes} aria-label="Reach a founder directly">
          {founders.map((f) => (
            <li key={f.slug}>
              <a href={`https://${f.site}`} target="_blank" rel="noopener noreferrer">
                <span className={s.routeFor}>{intents[f.slug] ?? f.title}</span>
                <span className={s.routeWho}>{f.name}</span>
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
