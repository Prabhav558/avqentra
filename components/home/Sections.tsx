import Link from "next/link";
import { founders } from "@/lib/founders";
import { contactEmail } from "@/lib/site";
import ShowWork from "./ShowWork";
import { PrinciplesVisual, ProcessVisual } from "./PanelVisuals";
import TiltStage from "./TiltStage";
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

/* 04 — Philosophy */
const principles = [
  { n: "01", t: "Problem First", d: "We focus on meaningful problems before choosing technologies or building features." },
  { n: "02", t: "Intelligence by Design", d: "We explore how AI and automation can make software more useful, adaptive, and capable." },
  { n: "03", t: "Built to Be Used", d: "We prioritize practical functionality, thoughtful interfaces, and reliable engineering." },
];

export function Philosophy() {
  return (
    <section id="philosophy" className={s.sec} aria-labelledby="philosophy-h">
      <div className={`${s.panelSplit} ${s.reveal}`}>
        <div className={s.panelCopy}>
          <p className={s.kicker}>— Our philosophy</p>
          <h2 className={s.h2}><span id="philosophy-h">We build beyond the obvious.</span></h2>
          <p className={s.sub}>
            Whether it&rsquo;s our own product or a client&rsquo;s, software should do more than digitize existing
            processes. It should rethink how problems are approached, and what becomes possible when intelligent
            systems are designed with purpose.
          </p>
          <ol className={s.panelList}>
            {principles.map((p) => (
              <li key={p.n}>
                <i>{p.n}</i>
                <div>
                  <h3 className={s.h3s}>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={s.panelVisual}>
          <TiltStage><PrinciplesVisual /></TiltStage>
          <span className={s.visualCaption}>Illustrative interface</span>
        </div>
      </div>
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
      <div className={`${s.panelSplit} ${s.panelFlip} ${s.reveal}`}>
        <div className={s.panelVisual}>
          <TiltStage><ProcessVisual /></TiltStage>
          <span className={s.visualCaption}>Illustrative interface</span>
        </div>
        <div className={s.panelCopy}>
          <p className={s.kicker}>— How we build</p>
          <h2 className={s.h2}><span id="process-h">From idea to implementation.</span></h2>
          <p className={s.sub}>The same process runs our own products and every client project.</p>
          <ol className={s.panelList}>
            {stages.map((st) => (
              <li key={st.n}>
                <i>{st.n}</i>
                <div>
                  <h3 className={s.h3s}>{st.t}</h3>
                  <p>{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
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
      <Head kicker="— What we build for clients" title={<span id="cap-h">Built with engineering at the core.</span>}>
        The disciplines behind our own products, available for your project.
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
      <div className={s.capsCta}>
        <Link href="/contact?type=project" className={`${s.btn} ${s.btnGhost}`}>
          Start a project <Arrow />
        </Link>
      </div>
    </section>
  );
}

/* 07 — Demonstration */
export function Demonstration() {
  return (
    <section id="demo" className={s.sec} aria-labelledby="demo-h">
      <Head kicker="— Show the work" title={<span id="demo-h">Less talk. More software.</span>}>
        A preview of each product before launch: what you do, and what happens next.
      </Head>
      <div className={s.reveal}>
        <ShowWork />
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
            Avqentra is a product and engineering studio. We build our own software products around meaningful
            problems, and we take on client projects where the same engineering, product thinking and AI experience
            can make a difference.
          </p>
          <dl className={s.facts}>
            <div>
              <dt>Mission</dt>
              <dd>Build products that solve real challenges and make people&rsquo;s work measurably better.</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>Four in development.</dd>
            </div>
            <div>
              <dt>Client work</dt>
              <dd>AI systems, full-stack applications and automation, built for teams that need them done right.</dd>
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
const routes = [
  { for: "Client project", who: "Start a project", href: "/contact?type=project" },
  { for: "Product interest", who: "Get early access", href: "/contact?type=early-access" },
  { for: "Write to us", who: contactEmail, href: `mailto:${contactEmail}` },
];

export function FinalCta() {
  return (
    <section id="start" className={`${s.cta}`} aria-labelledby="cta-h">
      <div className={s.ctaGrid} aria-hidden="true" />
      <div className={`${s.ctaInner} ${s.ctaSplit} ${s.reveal}`}>
        <div>
          <p className={s.kicker}>— Build something with us</p>
          <h2 className={s.ctaTitle} id="cta-h">
            Have an idea
            <br />
            <span className={s.gold}>worth building?</span>
          </h2>
          <p className={s.sub}>
            Bring us a project and we&rsquo;ll design and build it with you, or get early access to our products as
            they launch.
          </p>
          <div className={s.ctaActions}>
            <Link href="/contact?type=project" className={`${s.btn} ${s.btnSolid}`}>
              Start a project <Arrow />
            </Link>
          </div>
        </div>

        <ul className={s.ctaRoutes} aria-label="Ways to reach us">
          {routes.map((r) => (
            <li key={r.href}>
              <a href={r.href}>
                <small>{r.for}</small>
                <b>{r.who}</b>
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
