import Link from "next/link";
import { products } from "@/lib/products";
import h from "@/components/home/home.module.css";
import Arrow from "./Arrow";
import Figure from "./Figure";
import s from "./about.module.css";

const work = [
  { dt: "AI systems", dd: "Agents and workflows that reason, use tools and keep people in the loop." },
  { dt: "Applications", dd: "Full-stack software with clear architecture and reliable integrations." },
  { dt: "Automation", dd: "Repetitive, multi-step work turned into dependable automated flows." },
];

export default function Offer() {
  return (
    <section id="offer" className={h.sec} aria-labelledby="offer-h">
      <div className={`${s.headSplit} ${h.reveal}`}>
        <div>
          <p className={h.kicker}>— Two ways to work with us</p>
          <h2 className={h.h2} id="offer-h">Our products. Your project.</h2>
        </div>

        <Figure n="02" caption="One studio, one standard">
          <div className={s.studio}>
            <div className={s.studioTop}>
              <div>
                <b>Our products</b>
                <span>{products.length} in development</span>
              </div>
              <div>
                <b>Client work</b>
                <span>AI systems, apps, automation</span>
              </div>
            </div>
            <div className={s.studioBase}>The same engineering standard</div>
          </div>
        </Figure>
      </div>

      <div className={`${s.offer} ${h.reveal}`}>
        <div>
          <h3 className={h.h3s}>Our products</h3>
          <p className={h.body}>Four products in development. Ask for early access to any of them.</p>
          <ol className={s.rows} aria-label="Products">
            {products.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`}>
                  <span className={s.rNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.rName}>{p.name}</span>
                  <span className={s.rRole}>{p.status}</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/contact?type=early-access" className={`${h.btn} ${h.btnGhost}`}>
            Get early access <Arrow />
          </Link>
        </div>

        <div>
          <h3 className={h.h3s}>Client work</h3>
          <p className={h.body}>We design and build software for teams that need it done right, to the same standard as our own.</p>
          <dl className={h.facts}>
            {work.map((w) => (
              <div key={w.dt}>
                <dt>{w.dt}</dt>
                <dd>{w.dd}</dd>
              </div>
            ))}
          </dl>
          <Link href="/contact?type=project" className={`${h.btn} ${h.btnSolid}`}>
            Start a project <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
