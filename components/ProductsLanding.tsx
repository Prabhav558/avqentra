import Link from "next/link";
import Scene from "./Scene";
import Tilt from "./landing/Tilt";
import SectionRail from "./landing/SectionRail";
import { AgentBattleUI, DevSickUI, OpsAcademyUI, QuestionForgeUI } from "./landing/Mockups";
import { getPageProduct } from "@/lib/products";
import JsonLd from "./JsonLd";
import { absolute, breadcrumbs } from "@/lib/seo";

const sections = [
  { slug: "agentbattle", n: "02", kicker: "SAME TASK. SCORED RESULTS.", tags: ["AI AGENTS", "BENCHMARKS", "EVALUATION"], UI: AgentBattleUI,
    body: "A head-to-head arena where AI agents run the same tasks under the same conditions, so you compare scored results instead of trusting demos." },
  { slug: "devsick", n: "03", kicker: "SYMPTOM TO ROOT CAUSE.", tags: ["ROOT CAUSE", "AUTOMATION", "OBSERVABILITY"], UI: DevSickUI,
    body: "Sits on top of your monitoring stack to detect failures, explain the root cause with LLM reasoning, and guide the fix with a human in the loop." },
  { slug: "questionforge", n: "04", kicker: "GENERATE. VALIDATE. EXPORT.", tags: ["QUESTION BANKS", "VALIDATION", "HIRING"], UI: QuestionForgeUI,
    body: "Drafts technical interview questions with an LLM, then checks them by running code or independent review before a human ever sees them." },
  { slug: "ops-academy", n: "05", kicker: "LEARN. PRACTICE. PROGRESS.", tags: ["DEVOPS", "LIVE LABS", "AI MENTORING"], UI: OpsAcademyUI,
    body: "A DevOps learning platform: live terminal labs in the browser, multi-agent AI mentoring and real-world case studies, built for placement preparation." },
];

const Arrow = () => <span aria-hidden="true" className="arr">↗</span>;

export default function ProductsLanding() {
  return (
    <div className="frame">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Avqentra products",
            itemListElement: sections.map(({ slug }, i) => ({ "@type": "ListItem", position: i + 1, name: getPageProduct(slug)!.title, url: absolute(`/products/${slug}`) })),
          },
          breadcrumbs([{ name: "Products", path: "/products" }]),
        ]}
      />
      <SectionRail />

      <section className="ph" id="top">
        <Scene className="scene" variant="mark" accent="#e6dcc8" />
        <div className="ph-grid">
          <div className="ph-left">
            <p className="eyebrow">PRODUCTS</p>
            <h1 className="display">IDEAS<br />INTO<br /><span className="tan">TOOLS.</span></h1>
            <div className="ph-copy">
              <p className="mono">Four products. One standard.<br />We build tools that measure, explain<br />and verify what AI produces.</p>
              <Link className="pbtn cream" href="#agentbattle">EXPLORE PRODUCTS <Arrow /></Link>
            </div>
          </div>
          <div className="ph-side"><i className="moon" aria-hidden="true" /></div>
        </div>

        <div className="pindex mono" role="list">
          <div className="pindex-h"><span>NO.</span><span>PRODUCT</span><span>CATEGORY</span><span>BUILT WITH</span><span>STATUS</span><span /></div>
          {sections.map(({ slug, n }) => {
            const p = getPageProduct(slug)!;
            return (
              <Link role="listitem" key={slug} href={`#${slug}`} style={{ ["--c" as string]: p.accent }}>
                <span>{n}</span><b className="pi-name">{p.title}</b><span>{p.pageTag}</span><span>{p.stack.slice(0, 3).join(" · ")}</span><span className="soon"><i />{p.status}</span><span className="arr">↓</span>
              </Link>
            );
          })}
        </div>
        <i className="cross c1" /><i className="cross c2" />
      </section>

      {sections.map(({ slug, n, kicker, body, tags, UI }, i) => {
        const p = getPageProduct(slug)!;
        return (
          <section className={`ps ${i % 2 ? "rev" : ""}`} id={slug} key={slug}>
            <div className="ps-meta mono">
              <span>{n} — PRODUCT</span>
              <span>{p.pageTag.toUpperCase()}</span>
              <span>{p.status.toUpperCase()}</span>
            </div>
            <div className="ps-grid">
              <div className="ps-copy">
                <span className="soon"><i />{p.status}</span>
              <h2 className="display-s">{p.title}</h2>
                <p className="kicker mono">{kicker}</p>
                <p className="ps-body mono">{body}</p>
                <ol className="hl mono">
                  {p.highlights.map((h, k) => <li key={h}><i>0{k + 1}</i>{h}</li>)}
                </ol>
                <Link className="pbtn line" href={`/products/${slug}`}>Explore {p.title} <Arrow /></Link>
                <ul className="tags mono">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <Tilt flip={i % 2 === 1}><UI /></Tilt>
            </div>
            <dl className="ps-facts">
              {p.stats.map((s) => (
                <div key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>
          </section>
        );
      })}

      <section className="pc" id="closing">
        <p className="eyebrow mono">06 — BUILT BY AVQENTRA</p>
        <div className="pc-grid">
          <h2 className="display-m">FOUR TOOLS.<br />ONE <span className="tan">STANDARD.</span></h2>
          <div className="pc-copy">
            <p className="mono">From agent evaluation to incident reasoning, question validation and DevOps training, each product exists to make work easier to check and easier to trust.</p>
            <Link className="pbtn line" href="/contact">GET IN TOUCH <Arrow /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
