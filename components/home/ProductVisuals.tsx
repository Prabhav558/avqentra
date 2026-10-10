import s from "./home.module.css";

/*
 * Illustrative interfaces, drawn in markup. They are decorative (aria-hidden) and
 * labelled as such where they appear. Real screenshots/recordings replace these
 * once they are ready (see Demo section).
 */

function Chrome({ title, tag }: { title: string; tag: string }) {
  return (
    <div className={s.vChrome}>
      <span className={s.vDots}><i /><i /><i /></span>
      <span className={s.vTitle}>{title}</span>
      <span className={s.vTag}>{tag}</span>
    </div>
  );
}

export function AgentBattleVisual() {
  const agents = [
    { id: "Agent A", state: "Complete", pct: 100, steps: ["Parse task", "Call tools", "Verify output"] },
    { id: "Agent B", state: "Running", pct: 64, steps: ["Parse task", "Call tools", "Verify output"] },
  ];
  const board = [
    { n: "01", name: "Agent A", w: 92 },
    { n: "02", name: "Agent B", w: 78 },
    { n: "03", name: "Agent C", w: 55 },
  ];
  return (
    <div className={`${s.vShell} ${s.vAgent}`} aria-hidden="true">
      <Chrome title="agentbattle / challenge" tag="Live run" />
      <div className={s.vBody}>
        <div className={s.vTask}>
          <span className={s.vLabel}>Challenge</span>
          <p>Resolve a multi-step research task using only the provided tools.</p>
          <div className={s.vChips}><span>Same task</span><span>Same tools</span><span>Scored</span></div>
        </div>
        <div className={s.vCols}>
          {agents.map((a) => (
            <div key={a.id} className={s.vAgentCol}>
              <div className={s.vRow}><b>{a.id}</b><em>{a.state}</em></div>
              <div className={s.vBar}><i style={{ width: `${a.pct}%` }} /></div>
              <ul>
                {a.steps.map((st, i) => (
                  <li key={st} data-done={a.pct === 100 || i < 2}>{st}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={s.vBoard}>
          <span className={s.vLabel}>Leaderboard</span>
          {board.map((b) => (
            <div key={b.n} className={s.vBoardRow}>
              <span>{b.n}</span>
              <span>{b.name}</span>
              <i><u style={{ width: `${b.w}%` }} /></i>
              <span>{b.w}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DevSickVisual() {
  const code: [number, string, number][] = [
    [0, "k", 34], [1, "", 52], [1, "f", 40], [1, "", 62], [2, "hl", 56], [2, "", 38], [1, "", 24], [0, "", 18], [0, "k", 44], [1, "", 58],
  ];
  return (
    <div className={`${s.vShell} ${s.vDev}`} aria-hidden="true">
      <Chrome title="devsick / workspace" tag="Analysing" />
      <div className={`${s.vBody} ${s.vDevBody}`}>
        <div className={s.vTree}>
          <span className={s.vLabel}>Project</span>
          <ul>
            <li>app/</li>
            <li className={s.in}>session.ts</li>
            <li className={`${s.in} ${s.on}`}>handler.ts</li>
            <li className={s.in}>queue.ts</li>
            <li>lib/</li>
            <li className={s.in}>client.ts</li>
            <li>tests/</li>
          </ul>
        </div>
        <div className={s.vEditor}>
          <div className={s.vCode}>
            {code.map(([indent, kind, w], i) => (
              <div key={i} className={`${s.vLine} ${kind === "hl" ? s.hl : ""}`}>
                <span className={s.vNo}>{String(i + 12).padStart(2, "0")}</span>
                <span className={s.vTok} data-k={kind} style={{ marginLeft: indent * 16, width: `${w}%` }} />
              </div>
            ))}
          </div>
          <div className={s.vNote}>
            <span className={s.vLabel}>Analysis</span>
            <p>Possible unhandled case when the session has expired.</p>
            <div className={s.vChips}><span>handler.ts</span><span>Suggested fix</span></div>
          </div>
        </div>
      </div>
      <div className={s.vStatus}>
        <span><i data-ok />Analysis complete</span>
        <span>Tasks 3 / 5</span>
      </div>
    </div>
  );
}

export function QuestionForgeVisual() {
  const qs = [
    { t: "Explain the difference between processes and threads.", d: "Medium", k: "Concept" },
    { t: "Describe how a hash map resolves collisions.", d: "Easy", k: "Data structures" },
    { t: "Design a rate limiter for a public API.", d: "Hard", k: "System design" },
  ];
  return (
    <div className={`${s.vShell} ${s.vQuest}`} aria-hidden="true">
      <Chrome title="questionforge / collection" tag="Draft set" />
      <div className={`${s.vBody} ${s.vQuestBody}`}>
        <div className={s.vSearch}>
          <span>Search questions</span>
          <i>&#8984;K</i>
        </div>
        <div className={s.vChips}>
          <span data-on>All</span><span>Concept</span><span>Practical</span><span>System design</span>
        </div>
        <div className={s.vQList}>
          {qs.map((q, i) => (
            <div key={q.t} className={s.vQCard}>
              <span className={s.vNo}>{String(i + 1).padStart(2, "0")}</span>
              <p>{q.t}</p>
              <div className={s.vQMeta}><em>{q.d}</em><em>{q.k}</em></div>
            </div>
          ))}
        </div>
        <div className={s.vGen}>
          <span className={s.vLabel}>AI-assisted</span>
          <span className={s.vGenBtn}>Generate from material &#8599;</span>
        </div>
      </div>
    </div>
  );
}
