import Link from "next/link";
import Scene from "./Scene";
import type { SceneVariant } from "./Scene3D";
import type { Product } from "@/lib/products";

export default function ProductPage({ p, variant }: { p: Product; variant: SceneVariant }) {
  const style = { ["--c" as string]: p.accent };
  return (
    <div style={style}>
      <div className="stage pdp-hero">
        <Scene className="scene" variant={variant} accent={p.accent} />
        <div className="wrap content">
          <span className="badge"><i />{p.badge}</span>
          <h1>
            {p.headline[0]}
            <br />
            <span className="grad">{p.headline[1]}</span>
          </h1>
          <p>{p.description}</p>
          <div className="btns" style={{ justifyContent: "flex-start" }}>
            <Link className="btn primary" href={p.repo}>View on GitHub</Link>
            <Link className="btn" href="/contact">Request demo</Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="stats">
          {p.stats.map((s) => (
            <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
          ))}
        </div>

        <section>
          <h2>How it works</h2>
          <p className="sub">From input to result in four steps.</p>
          <div className="steps">
            {p.steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="n">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <h2>Capabilities</h2>
          <p className="sub">What {p.name} does today.</p>
          <div className="grid">
            {p.features.map((f) => (
              <div className="card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <h2>Built with</h2>
          <div className="chips" style={{ marginTop: 16 }}>
            {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="cta">
            <h2>Try {p.name}</h2>
            <p className="sub" style={{ marginBottom: 24 }}>{p.tagline}</p>
            <div className="btns">
              <Link className="btn primary" href="/contact">Request access</Link>
              <Link className="btn" href="/products">All products</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
