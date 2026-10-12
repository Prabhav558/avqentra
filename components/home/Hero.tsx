import Link from "next/link";
import SystemVisual from "./SystemVisual";
import s from "./home.module.css";

const stats = [
  { value: "04", label: ["Products", "In development"], size: "lg" },
  { value: "AI", label: ["Core discipline"], size: "sm" },
  { value: "Open", label: ["For client", "projects"], size: "md" },
];

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Thumb({ id, seed, tone }: { id: string; seed: number; tone: string }) {
  return (
    <svg className={s.thumb} viewBox="0 0 46 44" aria-hidden="true">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed={seed} />
        <feDiffuseLighting lightingColor={tone} surfaceScale="2.4" diffuseConstant="1.1">
          <feDistantLight azimuth="225" elevation="38" />
        </feDiffuseLighting>
      </filter>
      <rect width="46" height="44" filter={`url(#${id})`} />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.backdrop} aria-hidden="true" />
      <SystemVisual />

      {/* Blueprint frame: rules, ticks and indices */}
      <div className={s.frame} aria-hidden="true">
        <span className={`${s.ruleV} ${s.left}`} />
        <span className={`${s.ruleV} ${s.right}`} />
        <span className={`${s.ruleH} ${s.navRule}`} />
        <span className={`${s.ruleH} ${s.statsRule}`} />
        <span className={`${s.ruleH} ${s.footRule}`} />
        <span className={`${s.index} ${s.i1}`}>01</span>
        <span className={`${s.index} ${s.i2}`}>02</span>
        <span className={`${s.index} ${s.i3}`}>03</span>
        <span className={s.cross} />
        <span className={`${s.tick} ${s.tickStats}`} />
        <span className={`${s.tick} ${s.tickFootL}`} />
        <span className={`${s.tick} ${s.tickFootR}`} />
      </div>


      <div className={s.content}>
        <div className={s.copy}>
          <h1 className={s.title}>
            <span className={s.eyebrow} style={{ "--i": 0 } as React.CSSProperties}>We turn</span>
            <span style={{ "--i": 1 } as React.CSSProperties}>Ideas</span>
            <span style={{ "--i": 2 } as React.CSSProperties}>into</span>
            <span className={s.gold} style={{ "--i": 3 } as React.CSSProperties}>Tools.</span>
          </h1>
          <p className={s.lede} style={{ "--i": 4 } as React.CSSProperties}>
            A product and engineering studio. We&rsquo;re building our own AI products, and we design
            and build software for teams that need it built to the same standard.
          </p>
          <div className={s.actions} style={{ "--i": 5 } as React.CSSProperties}>
            <Link href="/products" className={`${s.btn} ${s.btnSolid}`}>
              Explore our products <Arrow />
            </Link>
            <Link href="/contact?type=project" className={`${s.btn} ${s.btnGhost}`}>
              Start a project <Arrow />
            </Link>
          </div>
        </div>
      </div>

      <div className={s.stats}>
        <dl className={s.statList}>
          {stats.map((st) => (
            <div key={st.value} className={s.stat}>
              <dt className={`${s.statValue} ${s[st.size]}`}>{st.value}</dt>
              <dd className={s.statLabel}>
                {st.label.map((l) => <span key={l}>{l}</span>)}
              </dd>
            </div>
          ))}
        </dl>
        <div className={s.reel} aria-hidden="true">
          <span className={s.reelCount}>[ 01 — 04 ]</span>
          <Thumb id="thumb-a" seed={7} tone="#8d8878" />
          <Thumb id="thumb-b" seed={3} tone="#5f5b50" />
          <span className={s.reelRule} />
        </div>
      </div>
    </section>
  );
}
