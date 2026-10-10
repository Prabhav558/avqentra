import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>About Avqentra</h1>
        <p>A startup building focused products for AI and developers.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <p style={{ maxWidth: 680 }}>
          We start with a concrete problem, build the simplest thing that solves it, and iterate with the
          people who use it. No bloat, no buzzwords.
        </p>
        <div className="grid" style={{ marginTop: 32 }}>
          <div className="card"><h3>Mission</h3><p>Build products that solve real challenges and make people&apos;s work measurably better.</p></div>
          <div className="card"><h3>Approach</h3><p>First principles, honest feedback, fast iteration.</p></div>
        </div>
      </section>
    </div>
  );
}
