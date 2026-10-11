import h from "@/components/home/home.module.css";
import Orbit from "./Orbit";
import s from "./about.module.css";

// The three checks, in the order the thesis section explains them.
const checks = [
  { id: "measure", label: "Measure", product: "AgentBattle" },
  { id: "explain", label: "Explain", product: "DevSick" },
  { id: "verify", label: "Verify", product: "QuestionForge" },
];

export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="about-h">
      <div className={h.backdrop} aria-hidden="true" />
      <div className={h.frame} aria-hidden="true">
        <span className={`${h.ruleV} ${h.left}`} />
        <span className={`${h.ruleV} ${h.right}`} />
        <span className={`${h.ruleH} ${h.navRule} ${s.navRule}`} />
      </div>

      <div className={s.heroInner}>
        <div>
          <p className={h.kicker}>— About Avqentra</p>
          <h1 className={s.title} id="about-h">
            <span className={s.line} style={{ "--i": 0 } as React.CSSProperties}>Proof over</span>
            <span className={`${s.line} ${h.gold}`} style={{ "--i": 1 } as React.CSSProperties}>promises.</span>
          </h1>
          <p className={s.lede}>
            Avqentra is a product and engineering studio. We build tools that measure, explain and verify what AI
            produces, so people can check it before they trust it. We bring the same standard to software we build for
            clients.
          </p>
        </div>
        <Orbit />
      </div>

      <ol className={s.checks} aria-label="What our products do">
        {checks.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`}>
              <span className={s.cNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.cVerb}>{c.label}</span>
              <span className={s.cProd}>{c.product}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
