import s from "./about.module.css";

const C = 260; // viewBox centre
const pt = (r: number, deg: number) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)] as const;

// The three checks sit on one ring, 120° apart, and are joined to each other and to the mark.
const nodes = [
  { n: "01", label: "Measure", product: "AgentBattle", deg: -90 },
  { n: "02", label: "Explain", product: "DevSick", deg: 30 },
  { n: "03", label: "Verify", product: "QuestionForge", deg: 150 },
];
const R_NODE = 170;

const ticks = Array.from({ length: 96 }, (_, i) => {
  const deg = (i / 96) * 360, long = i % 8 === 0;
  const [x1, y1] = pt(long ? 226 : 232, deg), [x2, y2] = pt(244, deg);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
}).join("");

/** Flat blueprint diagram: hairline rings, a slow scan arm, and the three checks around the Avqentra mark. */
export default function Orbit() {
  const pos = nodes.map((n) => pt(R_NODE, n.deg));
  return (
    <div className={s.orbit}>
      <svg viewBox="0 0 520 520" className={s.orbitSvg} role="img" aria-label="Measure, explain and verify, arranged around the Avqentra mark">
        <defs>
          <linearGradient id="arm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e6dcc8" stopOpacity="0" />
            <stop offset="1" stopColor="#e6dcc8" stopOpacity=".7" />
          </linearGradient>
          <radialGradient id="wedge" cx="0" cy="0" r="1">
            <stop offset="0" stopColor="#e6dcc8" stopOpacity="0" />
            <stop offset="1" stopColor="#e6dcc8" stopOpacity=".1" />
          </radialGradient>
        </defs>

        <g className={s.ringsSlow} fill="none" stroke="#e6dcc8">
          <path d={ticks} strokeOpacity=".32" strokeWidth="1" />
        </g>
        <g fill="none" stroke="#e6dcc8" strokeWidth="1">
          <circle cx={C} cy={C} r="226" strokeOpacity=".14" />
          <circle cx={C} cy={C} r={R_NODE} strokeOpacity=".2" strokeDasharray="2 6" />
          <circle cx={C} cy={C} r="110" strokeOpacity=".12" />
          <circle cx={C} cy={C} r="52" strokeOpacity=".2" />
        </g>

        {/* the triangle of checks, and a spoke from each to the mark */}
        <g stroke="#e6dcc8" strokeWidth="1" strokeOpacity=".2" fill="none">
          <path d={`M${pos[0][0]} ${pos[0][1]}L${pos[1][0]} ${pos[1][1]}L${pos[2][0]} ${pos[2][1]}Z`} />
          {pos.map(([x, y], i) => <path key={i} d={`M${C} ${C}L${x} ${y}`} strokeOpacity=".12" />)}
        </g>

        {/* scan arm */}
        <g className={s.arm}>
          <path d={`M${C} ${C}L${C + 226} ${C}A226 226 0 0 0 ${pt(226, -28)[0]} ${pt(226, -28)[1]}Z`} fill="url(#wedge)" />
          <path d={`M${C} ${C}L${C + 226} ${C}`} stroke="url(#arm)" strokeWidth="1.2" />
        </g>

        {nodes.map((nd, i) => {
          const [x, y] = pos[i];
          return (
            <g key={nd.n} className={s.node} style={{ "--d": `${i * 3}s` } as React.CSSProperties}>
              <rect className={s.nodeHalo} x={x - 14} y={y - 14} width="28" height="28" />
              <rect x={x - 7} y={y - 7} width="14" height="14" fill="#0e0e0b" stroke="#e6dcc8" strokeWidth="1" />
              <rect x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#e6dcc8" />
            </g>
          );
        })}
      </svg>

      <img className={s.orbitMark} src="/avqentra-mark.png" alt="" width="72" height="72" />

      {nodes.map((nd, i) => {
        const [x, y] = pos[i];
        return (
          <span
            key={nd.n}
            className={`${s.orbitLabel} ${i === 0 ? s.lblTop : i === 1 ? s.lblRight : s.lblLeft}`}
            style={{ left: `${(x / 520) * 100}%`, top: `${(y / 520) * 100}%`, "--d": `${i * 3}s` } as React.CSSProperties}
          >
            <b>{nd.n} {nd.label}</b>
            <i>{nd.product}</i>
          </span>
        );
      })}
    </div>
  );
}
