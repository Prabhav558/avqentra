import s from "./home.module.css";

/*
 * Everything here lives on one tilted plane. Coordinates are plane units; the
 * .plane transform (an affine matrix measured off the reference) projects them
 * to screen. Keeping cards, tiles, grid and connector in the same space is what
 * keeps the nodes sitting exactly on the card dividers.
 */

type Pt = [number, number];

const CARD_W = 352;
const CARD_H = 208;

const cards = [
  { n: "01", title: "Research", items: ["Problem Definition", "Data Exploration", "Feasibility Analysis"], at: [0, 0], menu: true },
  { n: "02", title: "Build", items: ["System Design", "Development", "Testing & Iteration"], at: [121, 210] },
  { n: "03", title: "Deploy", items: ["Launch", "Monitor", "Scale"], at: [415, 267] },
] as const;

// [x, y, w, h, variant]
const tiles: [number, number, number, number, string?][] = [
  [376, -30, 160, 136, "lit"],
  [450, 96, 210, 156, "lit"],
  [700, 120, 260, 150],
  [-56, 250, 190, 236, "panel"],
  [-300, 270, 210, 190],
  [72, 490, 200, 170],
  [300, 440, 220, 190],
  [560, 520, 240, 190],
];

const gridU = [-130, 270, 350, 700]; // lines of constant y
const gridV = [-167, 62, 560, 980]; // lines of constant x

const NODE_1: Pt = [218, 103];
const NODE_2: Pt = [373, 313];

// One spine, three cubic segments: divider -> node 1 -> node 2 -> under card 03.
const segments: { p: [Pt, Pt, Pt, Pt]; spread: number }[] = [
  { p: [[96, 94], [150, 94], [190, 106], NODE_1], spread: 9 },
  { p: [NODE_1, [300, 130], [250, 280], NODE_2], spread: 20 },
  { p: [NODE_2, [420, 330], [470, 360], [640, 420]], spread: 13 },
];

function bezier([a, b, c, d]: [Pt, Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [
    k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0],
    k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1],
  ];
}

// Fan strands around the spine: pinched at the nodes, spread between them, with a
// slight twist so the bundle reads as a ribbon rather than parallel lines.
function strand(offset: number, phase: number) {
  const pts: string[] = [];
  segments.forEach(({ p, spread }, si) => {
    for (let i = si === 0 ? 0 : 1; i <= 40; i++) {
      const t = i / 40;
      const [x, y] = bezier(p, t);
      const [x2, y2] = bezier(p, Math.min(1, t + 0.01));
      const [x1, y1] = bezier(p, Math.max(0, t - 0.01));
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const nx = -(y2 - y1) / len;
      const ny = (x2 - x1) / len;
      const env = Math.sin(Math.PI * t) ** 1.2;
      const o = env * spread * (offset + 0.35 * Math.sin(Math.PI * 2 * t + phase));
      pts.push(`${(x + nx * o).toFixed(1)},${(y + ny * o).toFixed(1)}`);
    }
  });
  return "M" + pts.join("L");
}

const STRANDS = Array.from({ length: 14 }, (_, i) => {
  const offset = -1 + (2 * i) / 13;
  return { d: strand(offset, i * 0.9), lead: i === 0 };
});

function Node({ at: [x, y], delay }: { at: Pt; delay: string }) {
  return (
    <g className={s.node} style={{ "--d": delay } as React.CSSProperties} transform={`translate(${x} ${y})`}>
      <circle className={s.nodeHalo} r="16" fill="url(#node-glow)" />
      <path d="M-18 0H18M0 -12V12" stroke="rgba(255,248,232,.35)" strokeWidth=".5" />
      <circle r="7" fill="none" stroke="#efe8d8" strokeWidth="1.1" />
      <circle r="3.6" fill="#fffaf0" />
    </g>
  );
}

export default function SystemVisual() {
  return (
    <div className={s.stage} aria-hidden="true">
      <div className={s.plane}>
        <svg className={s.grid} viewBox="-900 -500 2400 1600" width="2400" height="1600">
          {gridU.map((y) => <line key={`u${y}`} x1="-900" x2="1500" y1={y} y2={y} />)}
          {gridV.map((x) => <line key={`v${x}`} y1="-500" y2="1100" x1={x} x2={x} />)}
        </svg>

        {tiles.map(([x, y, w, h, v], i) => (
          <div
            key={i}
            className={`${s.tile} ${v ? s[v] : ""}`}
            style={{ left: x, top: y, width: w, height: h }}
          />
        ))}

        {cards.slice(0, 2).map((c) => <Card key={c.n} {...c} />)}

        <svg className={s.wires} viewBox="0 0 800 600" width="800" height="600">
          <defs>
            <radialGradient id="node-glow">
              <stop offset="0" stopColor="#fff6e2" stopOpacity=".3" />
              <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wire-fade" gradientUnits="userSpaceOnUse" x1="96" y1="0" x2="640" y2="0">
              <stop offset="0" stopColor="#f3ead6" stopOpacity="0" />
              <stop offset=".12" stopColor="#f3ead6" stopOpacity="1" />
              <stop offset=".75" stopColor="#f3ead6" stopOpacity=".9" />
              <stop offset="1" stopColor="#f3ead6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="url(#wire-fade)" fill="none">
            {STRANDS.map((st, i) => (
              <path
                key={i}
                d={st.d}
                pathLength={1}
                className={st.lead ? `${s.strand} ${s.lead}` : s.strand}
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
            <path d={STRANDS[0].d} pathLength={1} className={s.pulse} />
          </g>
          <Node at={NODE_1} delay="1.1s" />
          <Node at={NODE_2} delay="1.6s" />
        </svg>

        <Card {...cards[2]} />
      </div>
    </div>
  );
}

function Card({ n, title, items, at, menu }: { n: string; title: string; items: readonly string[]; at: readonly number[]; menu?: boolean }) {
  return (
    <div className={s.card} style={{ left: at[0], top: at[1], width: CARD_W, height: CARD_H }}>
      <span className={s.cardNum}>{n}</span>
      {menu && <span className={s.cardMenu}><i /><i /><i /></span>}
      <span className={s.cardTitle}>{title}</span>
      <span className={s.cardRule} />
      <ul className={s.cardList}>
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}
