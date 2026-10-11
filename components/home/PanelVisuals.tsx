import s from "./home.module.css";

/*
 * Illustrative interfaces for the home page panels. Sized in em, so they scale with the screen
 * instead of staying small on wide monitors. Decorative (aria-hidden) and labelled where they appear.
 */

function Bar({ title, tag }: { title: string; tag: string }) {
  return (
    <div className={s.puBar}>
      <span className={s.puDots}><i /><i /><i /></span>
      <span className={s.puTitle}>{title}</span>
      <span className={s.puTag}>{tag}</span>
    </div>
  );
}

const brief = [
  { n: "01", t: "Problem first", d: "Who has the problem, and what does done look like?", state: "Defined" },
  { n: "02", t: "Intelligence by design", d: "Where can AI and automation make this more useful?", state: "Scoped" },
  { n: "03", t: "Built to be used", d: "Is it practical, usable and reliable enough to ship?", state: "Checking" },
];
const checks = [
  { t: "The problem is written down", ok: true },
  { t: "The people who use it are named", ok: true },
  { t: "We know how we will measure it", ok: false },
];

export function PrinciplesVisual() {
  return (
    <div className={s.puShell} aria-hidden="true">
      <Bar title="avqentra / brief" tag="Principles" />
      <div className={s.puBody}>
        <div className={s.puHead}>
          <small>Project brief</small>
          <b>Before we build</b>
        </div>
        <ul className={s.puRows}>
          {brief.map((r) => (
            <li key={r.n}>
              <i>{r.n}</i>
              <div>
                <b>{r.t}</b>
                <span>{r.d}</span>
              </div>
              <em>{r.state}</em>
            </li>
          ))}
        </ul>
        <ul className={s.puCheck}>
          {checks.map((c) => (
            <li key={c.t} data-ok={c.ok}>
              <u>{c.ok ? "✓" : ""}</u>
              {c.t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const stages = [
  { n: "01", t: "Discover", d: "Problem, users, constraints", pct: 100, state: "Done" },
  { n: "02", t: "Design", d: "Experience and architecture", pct: 100, state: "Done" },
  { n: "03", t: "Engineer", d: "Build, integrate, test", pct: 62, state: "In progress" },
  { n: "04", t: "Evolve", d: "Deploy, learn, improve", pct: 0, state: "Next" },
];

export function ProcessVisual() {
  return (
    <div className={s.puShell} aria-hidden="true">
      <Bar title="avqentra / project" tag="Timeline" />
      <div className={s.puBody}>
        <div className={s.puHead}>
          <small>Same process for every project</small>
          <b>Idea to implementation</b>
        </div>
        <ul className={s.puRows}>
          {stages.map((r) => (
            <li key={r.n} data-state={r.state}>
              <i>{r.n}</i>
              <div>
                <b>{r.t}</b>
                <span>{r.d}</span>
              </div>
              <em>{r.state}</em>
              <div className={s.puTrack}><u style={{ width: `${r.pct}%` }} /></div>
            </li>
          ))}
        </ul>
        <div className={s.puFoot}>
          <span>Next step</span>
          <b>Test the implementation</b>
        </div>
      </div>
    </div>
  );
}
