import h from "@/components/home/home.module.css";
import Figure from "./Figure";
import s from "./about.module.css";

const standards = [
  {
    n: "01",
    t: "Start with a concrete problem",
    d: "Each of our products answers one specific problem, and so does every client project.",
  },
  {
    n: "02",
    t: "Build the simplest thing that solves it",
    d: "Fewer moving parts means fewer ways to fail and a faster path to something people can use.",
  },
  {
    n: "03",
    t: "Iterate with the people who use it",
    d: "Honest feedback from real users decides what we build next.",
  },
  {
    n: "04",
    t: "Keep a human in the loop",
    d: "DevSick recommends and a person approves. QuestionForge checks every question before a reviewer signs off. AI proposes, people decide.",
  },
];

export default function Standards() {
  return (
    <section id="standards" className={h.sec} aria-labelledby="standards-h">
      <div className={`${h.secHead} ${h.reveal}`}>
        <p className={h.kicker}>— How we work</p>
        <h2 className={h.h2} id="standards-h">Four working rules.</h2>
      </div>

      <div className={s.standards}>
        <div className={`${s.quoteCol} ${h.reveal}`}>
          <blockquote className={s.quote}>
            No bloat. <span className={h.gold}>No buzzwords.</span>
          </blockquote>
          <span className={s.quoteBy}>— How every project starts</span>
          <div className={s.loopFig}>
            <Figure n="03" caption="AI proposes, people decide">
              <ol className={s.loop}>
                <li><span>01</span>AI proposes</li>
                <li><span>02</span>A person reviews</li>
                <li><span>03</span>A person decides</li>
              </ol>
            </Figure>
          </div>
        </div>

        <ol className={`${s.chapters} ${h.reveal}`}>
          {standards.map((c) => (
            <li key={c.n}>
              <span className={s.chNum}>{c.n}</span>
              <div>
                <h3 className={h.h3s}>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
