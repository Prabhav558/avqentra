"use client";
import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";

type Demo = {
  id: string;
  name: string;
  intro: string;
  steps: { label: string; log: string }[];
};

const demos: Demo[] = [
  {
    id: "agentbattle",
    name: "AgentBattle",
    intro: "Create a challenge, let agents attempt it under identical conditions, then compare the results.",
    steps: [
      { label: "Create a challenge", log: "challenge.create  →  “research-task”  ·  tools: 3  ·  rubric: on" },
      { label: "Agents attempt it", log: "run.start  →  agent-a, agent-b  ·  identical inputs" },
      { label: "Compare the results", log: "run.score  →  side-by-side report ready" },
    ],
  },
  {
    id: "devsick",
    name: "DevSick",
    intro: "Point it at a codebase, investigate an issue, and move from symptom to suggested fix.",
    steps: [
      { label: "Open a codebase", log: "workspace.open  →  project indexed  ·  structure mapped" },
      { label: "Investigate an issue", log: "analyse  →  handler.ts  ·  unhandled case found" },
      { label: "Review a suggested fix", log: "suggest  →  patch drafted  ·  awaiting review" },
    ],
  },
  {
    id: "questionforge",
    name: "QuestionForge",
    intro: "Generate questions from your own material, organise them, and explore the collection.",
    steps: [
      { label: "Generate questions", log: "generate  →  source material  ·  12 drafts" },
      { label: "Organise a collection", log: "collection.sort  →  by topic and difficulty" },
      { label: "Explore and filter", log: "search  →  “hash map”  ·  matches highlighted" },
    ],
  },
];

export default function DemoSection() {
  const [active, setActive] = useState(0);
  const demo = demos[active];
  // Start fully revealed so the content is complete without JS or animation.
  const [shown, setShown] = useState(demo.steps.length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  const pick = (i: number) => {
    stop();
    setActive(i);
    setShown(demos[i].steps.length);
  };

  const replay = () => {
    stop();
    setShown(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= demo.steps.length) stop();
    }, 800);
  };

  return (
    <div className={s.demo}>
      <div className={s.demoTabs} role="tablist" aria-label="Product demonstrations">
        {demos.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            id={`tab-${d.id}`}
            aria-selected={i === active}
            aria-controls="demo-panel"
            className={s.demoTab}
            onClick={() => pick(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {d.name}
          </button>
        ))}
      </div>

      <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${demo.id}`} className={s.demoPanel}>
        <div className={s.demoSide}>
          <p className={s.demoIntro}>{demo.intro}</p>
          <ol className={s.demoSteps}>
            {demo.steps.map((st, i) => (
              <li key={st.label} data-on={i < shown}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {st.label}
              </li>
            ))}
          </ol>
          <button className={s.demoReplay} data-cursor="replay" onClick={replay}>
            Replay sequence &#8635;
          </button>
        </div>

        <div className={s.demoScreen} data-cursor="inspect">
          <div className={s.demoBar}>
            <span className={s.vDots}><i /><i /><i /></span>
            <span>{demo.id} / session</span>
            <em>Simulated interface</em>
          </div>
          <div className={s.demoLog} aria-live="polite">
            {demo.steps.map((st, i) => (
              <p key={st.label} data-on={i < shown}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {st.log}
              </p>
            ))}
            <p className={s.demoCursor} data-on aria-hidden="true">&#9608;</p>
          </div>
        </div>
      </div>
      <p className={s.demoNote}>
        This is a simulated interface for illustration. Recordings and screenshots from the live products will replace it
        as each one is ready to show.
      </p>
    </div>
  );
}
