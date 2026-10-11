import Link from "next/link";
import Scene from "./Scene";
import type { SceneVariant } from "./Scene3D";
import Tilt from "./landing/Tilt";
import SectionRail from "./landing/SectionRail";
import { AgentBattleUI, DevSickUI, OpsAcademyUI, QuestionForgeUI } from "./landing/Mockups";
import { pageProducts as products, type PageProduct } from "@/lib/products";

const UI: Record<string, () => React.JSX.Element> = { agentbattle: AgentBattleUI, devsick: DevSickUI, questionforge: QuestionForgeUI, "ops-academy": OpsAcademyUI };
const rail = [
  { id: "top", n: "01", label: "Overview" },
  { id: "how", n: "02", label: "How it works" },
  { id: "capabilities", n: "03", label: "Capabilities" },
  { id: "start", n: "04", label: "Get started" },
];
// product accents are tinted per-product; the 3D scenes and hero glow follow the site's cream-on-black theme
const THEME = "#e6dcc8";
const Arrow = () => <span aria-hidden="true" className="arr">↗</span>;

export default function ProductDetail({ p, variant }: { p: PageProduct; variant: SceneVariant }) {
  const i = products.findIndex((x) => x.slug === p.slug);
  const next = products[(i + 1) % products.length];
  const nextN = String(((i + 1) % products.length) + 2).padStart(2, "0");
  const Mock = UI[p.slug];
  return (
    <div className="frame pd" style={{ ["--c" as string]: THEME }}>
      <SectionRail items={rail} />

      <section className="pd-hero" id="top">
        <Scene className="scene" variant={variant} accent={THEME} />
        <div className="pd-main">
          <Link className="pd-back mono" href="/products">← ALL PRODUCTS</Link>
          <p className="eyebrow mono"><span className="dot" />{String(i + 2).padStart(2, "0")} — {p.badge.toUpperCase()}<span className="soon"><i />{p.status}</span></p>
          <h1 className="pd-title">{p.heroLines[0]}<br /><span className="tan">{p.heroLines[1]}</span></h1>
          <p className="pd-lead mono">{p.description}</p>
          <div className="pd-actions">
            <Link className="pbtn cream" href="/contact">Get notified <Arrow /></Link>
          </div>
        </div>
        <dl className="ps-facts pd-facts">
          {p.stats.map((s) => (
            <div key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
      </section>

      <section className="pd-how" id="how">
        <div className="ps-meta mono"><span>02 — HOW IT WORKS</span><span>{p.title.toUpperCase()}</span><a href="#capabilities">NEXT ↓</a></div>
        <div className="pd-steps">
          {p.steps.map((s, k) => (
            <div className="pd-step" key={s.title}>
              <span className="pd-n">0{k + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="mono">{s.body}</p>
              </div>
              <i className="pd-line" />
            </div>
          ))}
        </div>
      </section>

      <section className="pd-cap" id="capabilities">
        <div className="ps-meta mono"><span>03 — CAPABILITIES</span><span>{p.pageTag.toUpperCase()}</span><span>{p.status.toUpperCase()}</span></div>
        <div className="pd-cap-grid">
          <ol className="pd-feats">
            {p.features.map((f, k) => (
              <li key={f.title}>
                <i className="mono">0{k + 1}</i>
                <div><h3>{f.title}</h3><p className="mono">{f.body}</p></div>
              </li>
            ))}
          </ol>
          <Tilt flip>{Mock ? <Mock /> : null}</Tilt>
        </div>
      </section>

      <section className="pd-start" id="start">
        <div className="ps-meta mono"><span>04 — GET STARTED · {p.status.toUpperCase()}</span><span>BUILT WITH</span><Link href="/contact">CONTACT <Arrow /></Link></div>
        <div className="pd-start-grid">
          <div className="pd-start-l">
            <h2 className="display-m">TRY <span className="tan">{p.title.toUpperCase()}.</span></h2>
            <p className="pd-lead mono">{p.lead}</p>
            <div className="pd-actions">
              <Link className="pbtn cream" href="/contact">JOIN THE WAITLIST <Arrow /></Link>
            </div>
            <ul className="pd-stack mono">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <Link className="pd-next" href={`/products/${next.slug}`}>
            <span className="mono">NEXT PRODUCT — {nextN}</span>
            <strong>{next.title.toUpperCase()}</strong>
            <em className="mono">{next.lead}</em>
            <span className="pbtn line">Explore {next.title} <Arrow /></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
