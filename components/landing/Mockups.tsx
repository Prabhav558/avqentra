const Mark = () => (
  <svg viewBox="0 0 34 30" width="1.3em" height="1.15em" aria-hidden="true"><path fill="currentColor" d="M17 0 34 30H23.5L17 18.2 10.5 30H0Z" /><path fill="#14120f" d="M17 9.5 21.2 17H12.8Z" /></svg>
);

export function AgentBattleUI() {
  const nav = ["Arena", "Agents", "Challenges", "Leaderboard", "Analytics"];
  return (
    <div className="mk">
      <aside><b className="mk-logo"><Mark /> AgentBattle</b>{nav.map((n, i) => <span key={n} className={i === 0 ? "on" : ""}>{n}</span>)}</aside>
      <div className="mk-main">
        <div className="mk-top"><span /><span className="mk-dim">Global Leaderboard ↗</span></div>
        <div className="mk-cols">
          <div className="mk-hero">
            <h4>Create<br />Challenge</h4>
            <p>Design a task, pit agents against each other and compare the scored results.</p>
            <div className="mk-btns"><span className="b cream">+ New Challenge</span><span className="b">View Leaderboard</span></div>
          </div>
          <div className="mk-list">
            {[["Reasoning Showdown", "12 agents · 3 tasks", "Live"], ["Code Generation", "8 agents · 5 tasks", "›"], ["Data Analysis", "10 agents · 4 tasks", "›"]].map(([a, b, c]) => (
              <div className="mk-row" key={a}><i /><div><b>{a}</b><small>{b}</small></div><em className={c === "Live" ? "live" : ""}>{c}</em></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DevSickUI() {
  const files = ["src", "components", "agents", "utils", "api", "pages", "styles"];
  return (
    <div className="mk mk-dev">
      <aside><b className="mk-logo"><Mark /> DevSick</b><span className="mk-search">Search files…</span>{files.map((f, i) => <span key={f} style={{ paddingLeft: i === 0 ? ".4em" : "1.4em" }}>{i === 0 ? "▾ " : "▸ "}{f}</span>)}</aside>
      <div className="mk-main">
        <pre className="mk-code"><code>{`  11  `}<i className="k">import</i>{` { DevSick } `}<i className="k">from</i>{` `}<i className="s">&apos;devsick&apos;</i>{`
  12
  13  `}<i className="k">const</i>{` rca = `}<i className="k">await</i>{` devsick.`}<i className="f">analyze</i>{`({
  14    incident: `}<i className="s">&apos;api-5xx-spike&apos;</i>{`,
  15    mode: `}<i className="s">&apos;human-approval&apos;</i>{`
  16  })
  17
  18  `}<i className="k">await</i>{` rca.`}<i className="f">remediate</i>{`()`}</code></pre>
        <div className="mk-prog"><small>Correlating logs and metrics…</small><div className="bar"><i /></div><em>72%</em><span className="b cream">Run Agent ▷</span></div>
      </div>
    </div>
  );
}

export function QuestionForgeUI() {
  const nav = ["Home", "Create", "Library", "Collections", "Analytics"];
  const tiles = [["Generate", "with AI"], ["Validate", "by execution"], ["Review", "with teams"], ["Export", "PDF · JSON"]];
  return (
    <div className="mk mk-qf">
      <aside><b className="mk-logo"><Mark /> QuestionForge</b>{nav.map((n, i) => <span key={n} className={i === 0 ? "on" : ""}>{n}</span>)}</aside>
      <div className="mk-main">
        <div className="mk-top"><span className="mk-search wide">Search questions, topics…</span><span className="b cream">+ New Question</span></div>
        <h4 className="qf-h">Create Better<br />Questions</h4>
        <p className="mk-dim">Generate, validate and organize interview questions for hiring assessments.</p>
        <div className="mk-ask"><span>Ask anything…</span><i>↗</i></div>
        <div className="mk-tiles">{tiles.map(([a, b]) => <div key={a}><b>{a}</b><small>{b}</small></div>)}</div>
      </div>
    </div>
  );
}
