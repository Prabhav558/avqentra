import Link from "next/link";
import { founders } from "@/lib/founders";
import { AgentBattleVisual, DevSickVisual, QuestionForgeVisual } from "./ProductVisuals";
import DemoSection from "./Demo";
import s from "./home.module.css";

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Head({ kicker, title, children, wide }: { kicker: string; title: React.ReactNode; children?: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`${s.secHead} ${wide ? s.secHeadWide : ""} ${s.reveal}`}>
      <p className={s.kicker}>{kicker}</p>
      <h2 className={s.h2}>{title}</h2>
      {children && <p className={s.sub}>{children}</p>}
    </div>
  );
}

/* 03 — Product ecosystem */
const productRows = [
  {
    slug: "agentbattle",
    n: "01",
    name: "AgentBattle",
    category: "AI Agent Evaluation & Competition",
    headline: "Put intelligent agents to the test.",
    body: "A platform for challenging, evaluating, and comparing AI agents through practical tasks and competitive environments.",
    cta: "Explore AgentBattle",
    Visual: AgentBattleVisual,
  },
  {
    slug: "devsick",
    n: "02",
    name: "DevSick",
    category: "AI-Assisted Software Development",
    headline: "Build software with greater intelligence.",
    body: "A developer-focused platform designed to help engineers understand codebases, identify problems, and accelerate software development.",
    cta: "Explore DevSick",
    Visual: DevSickVisual,
  },
  {
    slug: "questionforge",
    n: "03",
    name: "QuestionForge",
    category: "AI-Powered Question & Knowledge Management",
    headline: "Turn questions into knowledge.",
    body: "A platform for creating, organizing, and exploring high-quality questions, with AI-assisted workflows for learning, assessment, and knowledge discovery.",
    cta: "Explore QuestionForge",
    Visual: QuestionForgeVisual,
  },
];

export function Ecosystem() {
  return (
    <section id="ecosystem" className={s.sec} aria-labelledby="ecosystem-h">
      <Head
        kicker="— Product ecosystem"
        title={<span id="ecosystem-h">Three products. Distinct problems. One engineering mindset.</span>}
        wide
      >
        From evaluating intelligent agents to accelerating software development and transforming how people work with
        questions and knowledge, our products turn focused ideas into practical software.
      </Head>

      <div className={s.products}>
        {productRows.map(({ slug, n, name, category, headline, body, cta, Visual }, i) => (
          <article key={slug} className={`${s.product} ${i % 2 ? s.productFlip : ""} ${s.reveal}`}>
            <div className={s.productText}>
              <span className={s.productNum}>{n} / 03</span>
              <p className={s.productCat}>{category}</p>
              <h3 className={s.h3}>{headline}</h3>
              <p className={s.body}>{body}</p>
              <Link href={`/products/${slug}`} className={`${s.btn} ${s.btnGhost}`} aria-label={`${cta}`}>
                {cta} <Arrow />
              </Link>
            </div>
            <div className={s.productVisual} data-cursor="inspect">
              <Visual />
              <span className={s.visualCaption}>{name} &middot; Illustrative interface</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* 04 — Philosophy */
const principles = [
  { n: "01", t: "Problem First", d: "We focus on meaningful problems before choosing technologies or building features." },
  { n: "02", t: "Intelligence by Design", d: "We explore how AI and automation can make software more useful, adaptive, and capable." },
  { n: "03", t: "Built to Be Used", d: "We prioritize practical functionality, thoughtful interfaces, and reliable engineering." },
];

export function Philosophy() {
  return (
    <section id="philosophy" className={s.sec} aria-labelledby="philosophy-h">
      <div className={s.philoTop}>
        <Head kicker="— Our philosophy" title={<span id="philosophy-h">We build beyond the obvious.</span>}>
          We believe software should do more than digitize existing processes. It should rethink how problems are
          approached, how people interact with technology, and what becomes possible when intelligent systems are
          designed with purpose.
        </Head>
        <svg className={s.geo} viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth=".6">
            <rect x="20" y="20" width="160" height="160" className={s.geoA} />
            <rect x="48" y="48" width="104" height="104" className={s.geoB} />
            <rect x="76" y="76" width="48" height="48" className={s.geoC} />
            <path d="M100 0v200M0 100h200" strokeDasharray="2 5" opacity=".5" />
            <circle cx="100" cy="100" r="3" fill="currentColor" />
          </g>
        </svg>
      </div>
      <ol className={`${s.principles} ${s.reveal}`}>
        {principles.map((p) => (
          <li key={p.n}>
            <span className={s.pNum}>{p.n}</span>
            <h3 className={s.h3s}>{p.t}</h3>
            <p className={s.body}>{p.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 05 — How we build */
const stages = [
  { n: "01", t: "Discover", d: "Understand the problem, intended users, constraints, and desired outcome." },
  { n: "02", t: "Design", d: "Define the experience, system architecture, and implementation approach." },
  { n: "03", t: "Engineer", d: "Build the software, integrate the necessary technologies, and test the implementation." },
  { n: "04", t: "Evolve", d: "Deploy, evaluate results, gather feedback, and improve the product." },
];

export function Process() {
  return (
    <section id="how-we-build" className={s.sec} aria-labelledby="process-h">
      <Head kicker="— How we build" title={<span id="process-h">From idea to implementation.</span>} />
      <ol className={`${s.timeline} ${s.reveal}`}>
        {stages.map((st) => (
          <li key={st.n}>
            <span className={s.marker}>{st.n}</span>
            <h3 className={s.h3s}>{st.t}</h3>
            <p className={s.body}>{st.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 06 — Capabilities */
const capabilities = [
  { t: "AI & Agentic Systems", d: "Designing software systems that use AI to reason, interact with tools, and execute structured workflows." },
  { t: "Full-Stack Software Engineering", d: "Building maintainable applications with clear architecture, reliable integrations, and thoughtful user experiences." },
  { t: "Application Architecture", d: "Shaping the structure of systems so they stay understandable, testable, and ready to grow." },
  { t: "Automation & Intelligent Workflows", d: "Turning repetitive, multi-step work into dependable automated flows with people kept in the loop." },
  { t: "Product Design & Development", d: "Taking a product from a defined problem to an interface people can actually use." },
  { t: "Software Testing & Evaluation", d: "Measuring behaviour with repeatable tests and evaluations instead of relying on demos." },
];

export function Capabilities() {
  return (
    <section id="capabilities" className={s.sec} aria-labelledby="cap-h">
      <Head kicker="— Engineering capabilities" title={<span id="cap-h">Built with engineering at the core.</span>}>
        The disciplines behind our products.
      </Head>
      <ul className={`${s.caps} ${s.reveal}`}>
        {capabilities.map((c, i) => (
          <li key={c.t}>
            <span className={s.capNum}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={s.h3s}>{c.t}</h3>
            <p className={s.body}>{c.d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 07 — Demonstration */
export function Demonstration() {
  return (
    <section id="demo" className={s.sec} aria-labelledby="demo-h">
      <Head kicker="— Show the work" title={<span id="demo-h">Less talk. More working software.</span>}>
        One product at a time: what you do, and what happens next.
      </Head>
      <div className={s.reveal}>
        <DemoSection />
      </div>
    </section>
  );
}

/* 08 — About */
export function AboutSection() {
  return (
    <section id="about" className={s.sec} aria-labelledby="about-h">
      <div className={`${s.aboutGrid} ${s.reveal}`}>
        <div>
          <p className={s.kicker}>— About Avqentra</p>
          <h2 className={s.h2}>
            <span id="about-h">A smaller distance between ideas and reality.</span>
          </h2>
        </div>
        <div className={s.aboutCopy}>
          <p className={s.sub}>
            Avqentra is a technology company building software products around meaningful problems. We combine
            engineering, product thinking, and emerging technologies to create systems that help people work, build,
            and explore more effectively.
          </p>
          <dl className={s.facts}>
            <div>
              <dt>Mission</dt>
              <dd>Build products that solve real challenges and make people&rsquo;s work measurably better.</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>First principles, honest feedback, fast iteration.</dd>
            </div>
          </dl>
          <ul className={s.founders}>
            {founders.map((f) => (
              <li key={f.name}>
                <a href={`https://${f.site}`} target="_blank" rel="noopener noreferrer">
                  <b>{f.name}</b>
                  <span>{f.role}</span>
                </a>
              </li>
            ))}
          </ul>
          <Link href="/about" className={`${s.btn} ${s.btnGhost}`}>
            About Avqentra <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 09 — Final CTA */
export function FinalCta() {
  return (
    <section id="start" className={`${s.cta}`} aria-labelledby="cta-h">
      <div className={s.ctaGrid} aria-hidden="true" />
      <div className={`${s.ctaInner} ${s.reveal}`}>
        <p className={s.kicker}>— Build something with us</p>
        <h2 className={s.ctaTitle} id="cta-h">
          Have an idea
          <br />
          <span className={s.gold}>worth building?</span>
        </h2>
        <p className={s.sub}>
          Explore what we&rsquo;re creating, discover our products, or start a conversation about what comes next.
        </p>
        <div className={s.ctaActions}>
          <Link href="/products" className={`${s.btn} ${s.btnSolid}`}>
            Explore our products <Arrow />
          </Link>
          <Link href="/contact" className={`${s.btn} ${s.btnGhost}`}>
            Get in touch <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
