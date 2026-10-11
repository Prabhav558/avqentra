import Link from "next/link";
import h from "@/components/home/home.module.css";
import Arrow from "./Arrow";
import s from "./about.module.css";

const routes = [
  { for: "Client project", who: "Start a project", href: "/contact?type=project" },
  { for: "Product interest", who: "Get early access", href: "/contact?type=early-access" },
  { for: "Everything else", who: "Get in touch", href: "/contact" },
];

export default function Closing() {
  return (
    <section id="start" className={h.cta} aria-labelledby="about-cta-h">
      <div className={h.ctaGrid} aria-hidden="true" />
      <div className={`${h.ctaInner} ${s.ctaSplit} ${h.reveal}`}>
        <div>
          <p className={h.kicker}>— Work with us</p>
          <h2 className={h.ctaTitle} id="about-cta-h">
            Bring us a
            <br />
            <span className={h.gold}>concrete problem.</span>
          </h2>
          <p className={h.sub}>Tell us what you are building and where it stands. A founder will reply.</p>
          <div className={h.ctaActions}>
            <Link href="/contact?type=project" className={`${h.btn} ${h.btnSolid}`}>
              Start a project <Arrow />
            </Link>
            <Link href="/products" className={`${h.btn} ${h.btnGhost}`}>
              Explore our products <Arrow />
            </Link>
          </div>
        </div>

        <ul className={s.routes} aria-label="Ways to get in touch">
          {routes.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>
                <span className={s.routeFor}>{r.for}</span>
                <span className={s.routeWho}>{r.who}</span>
                <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
