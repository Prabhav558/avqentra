import Link from "next/link";
import Logo from "./Logo";
import SystemVisual from "./SystemVisual";
import s from "./home.module.css";

const links = [
  { href: "/products", label: "Product" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const stats = [
  { value: "20+", label: ["Projects", "Delivered"], size: "lg" },
  { value: "5+", label: ["Industries"], size: "sm" },
  { value: "Next", label: ["Global Impact"], size: "md" },
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
        <div className={s.orbit}>
          <span className={s.dashes}><i /><i /></span>
          <ul>
            <li>Systems</li>
            <li>Products</li>
            <li>People</li>
            <li>Real Impact</li>
          </ul>
          <span className={s.sphere} />
        </div>
      </div>

      <header className={s.header}>
        <Link href="/" className={s.brand} aria-label="Avqentra home">
          <Logo className={s.logo} />
        </Link>
        <nav className={s.nav} aria-label="Primary">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className={s.navDivider} aria-hidden="true" />
        <Link href="/contact" className={`${s.btn} ${s.btnNav}`}>
          Get in touch <Arrow />
        </Link>
        <details className={s.menu}>
          <summary aria-label="Menu"><i /><i /></summary>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li><Link href="/founders">Founders</Link></li>
          </ul>
        </details>
      </header>

      <div className={s.content}>
        <div className={s.copy}>
          <p className={s.eyebrow} style={{ "--i": 0 } as React.CSSProperties}>
            Built for what&rsquo;s next
          </p>
          <h1 className={s.title}>
            <span style={{ "--i": 1 } as React.CSSProperties}>Ideas</span>
            <span style={{ "--i": 2 } as React.CSSProperties}>into</span>
            <span className={s.gold} style={{ "--i": 3 } as React.CSSProperties}>Systems.</span>
          </h1>
          <p className={s.lede} style={{ "--i": 4 } as React.CSSProperties}>
            We design and build software systems that turn complex ideas into real-world impact.
          </p>
          <div className={s.actions} style={{ "--i": 5 } as React.CSSProperties}>
            <Link href="#work" className={`${s.btn} ${s.btnSolid}`}>
              Explore work <Arrow />
            </Link>
            <Link href="/contact" className={`${s.btn} ${s.btnGhost}`}>
              Talk to us <Arrow />
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
          <span className={s.reelCount}>[ 01 — 03 ]</span>
          <Thumb id="thumb-a" seed={7} tone="#8d8878" />
          <Thumb id="thumb-b" seed={3} tone="#5f5b50" />
          <span className={s.reelRule} />
        </div>
        <a href="#work" className={s.scroll}>
          <span>Scroll</span>
          <i />
        </a>
      </div>
    </section>
  );
}
