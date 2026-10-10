import Link from "next/link";
import Scene from "./Scene";
import Tilt from "./landing/Tilt";
import { AgentBattleUI, DevSickUI, QuestionForgeUI } from "./landing/Mockups";

const sections = [
  {
    slug: "agentbattle", idx: "02", name: "AgentBattle", kicker: "AI AGENTS. REAL CHALLENGES.",
    body: "A head-to-head arena where AI agents run the same tasks under the same conditions, so you compare scored results instead of trusting demos.",
    tags: ["AI AGENTS", "COMPETITIONS", "EVALUATIONS"], UI: AgentBattleUI,
  },
  {
    slug: "devsick", idx: "03", name: "DevSick", kicker: "INCIDENT INTELLIGENCE.",
    body: "Sits on top of your monitoring stack to detect failures, explain the root cause with LLM reasoning, and guide the fix with a human in the loop.",
    tags: ["ROOT CAUSE", "AUTOMATION", "OBSERVABILITY"], UI: DevSickUI,
  },
  {
    slug: "questionforge", idx: "04", name: "QuestionForge", kicker: "GENERATE. VALIDATE. TRUST.",
    body: "Drafts technical interview questions with an LLM, then checks them by running code or independent review before a human ever sees them.",
    tags: ["KNOWLEDGE SYSTEMS", "AI CURATION", "HIRING"], UI: QuestionForgeUI,
  },
];

const Arrow = () => <span aria-hidden="true" className="arr">↗</span>;

export default function ProductsLanding() {
  return (
    <div className="frame">
      <section className="ph" id="top">
        <Scene className="scene" variant="glass" accent="#d9cfb3" />
        <span className="idx">01</span>
        <div className="ph-grid">
          <div>
            <p className="eyebrow">PRODUCTS</p>
            <h1 className="display">IDEAS<br />INTO<br /><span className="tan">TOOLS.</span></h1>
          </div>
          <div className="ph-copy">
            <p className="mono">Three products. One mission.<br />We build software that helps people<br />think, build, and explore without limits.</p>
            <Link className="pbtn cream" href="#agentbattle">EXPLORE PRODUCTS <Arrow /></Link>
          </div>
          <div className="ph-side">
            <i className="moon" aria-hidden="true" />
            <ul className="mono"><li>SYSTEMS</li><li>PRODUCTS</li><li>PEOPLE</li><li>REAL IMPACT</li></ul>
          </div>
        </div>
        <i className="cross c1" /><i className="cross c2" />
      </section>

      {sections.map(({ slug, idx, name, kicker, body, tags, UI }, i) => (
        <section className={`ps ${i % 2 ? "rev" : ""}`} id={slug} key={slug}>
          <span className="idx">{idx}</span>
          <span className="sidx mono">0{i + 1}</span>
          <div className="ps-grid">
            <div className="ps-copy">
              <h2 className="display-s">{name}</h2>
              <p className="kicker mono">{kicker}</p>
              <p className="ps-body mono">{body}</p>
              <Link className="pbtn line" href={`/products/${slug}`}>Explore {name} <Arrow /></Link>
              <ul className="tags mono">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <Tilt flip={i % 2 === 1}><UI /></Tilt>
          </div>
        </section>
      ))}

      <section className="pc">
        <span className="idx">05</span>
        <p className="eyebrow mono">BUILT BY AVQENTRA</p>
        <div className="pc-grid">
          <h2 className="display-m">DIFFERENT TOOLS.<br />A <span className="tan">BIGGER TOMORROW.</span></h2>
          <div className="pc-copy">
            <p className="mono">From agent competitions to developer productivity and knowledge systems, our products are designed to help you turn ideas into real-world impact.</p>
            <Link className="pbtn line" href="/contact">GET IN TOUCH <Arrow /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
