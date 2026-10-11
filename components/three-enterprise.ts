import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Kit, MONO, cardTexture, drawFrame, makeFloor, makePanel, makeSparks } from "./three-models";

/** Restrained, instrument-like scenes: cream-on-black, fine lines, precise geometry. */
export type Ctx = {
  kit: Kit;
  root: THREE.Group;
  accent: THREE.Color;
  tick: ((t: number, dt: number) => void)[];
  fill: THREE.PointLight;
  key: THREE.PointLight;
};

const CREAM = new THREE.Color("#e6dcc8");
const smooth = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const rnd = (s: number) => { const v = Math.sin(s * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _z = new THREE.Vector3(0, 0, 1);

function lines(kit: Kit, pts: THREE.Vector3[], color: THREE.ColorRepresentation, opacity: number) {
  return new THREE.LineSegments(kit.geo(new THREE.BufferGeometry().setFromPoints(pts)), kit.mat(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })));
}
function gridPts(w: number, d: number, nx: number, nz: number) {
  const p: THREE.Vector3[] = [];
  for (let i = 0; i <= nx; i++) { const x = -w / 2 + (w * i) / nx; p.push(new THREE.Vector3(x, 0, -d / 2), new THREE.Vector3(x, 0, d / 2)); }
  for (let i = 0; i <= nz; i++) { const z = -d / 2 + (d * i) / nz; p.push(new THREE.Vector3(-w / 2, 0, z), new THREE.Vector3(w / 2, 0, z)); }
  return p;
}
/** Segment pairs for a circle (or arc) in the XZ plane. */
function loopPts(r: number, n = 128, a0 = 0, a1 = Math.PI * 2) {
  const p: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const s = a0 + ((a1 - a0) * i) / n, e = a0 + ((a1 - a0) * (i + 1)) / n;
    p.push(new THREE.Vector3(Math.cos(s) * r, 0, Math.sin(s) * r), new THREE.Vector3(Math.cos(e) * r, 0, Math.sin(e) * r));
  }
  return p;
}
function graphite(kit: Kit, rough = 0.34) {
  return kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x1a1914, metalness: 0.9, roughness: rough, roughnessMap: kit.brushed(), clearcoat: 0.8, clearcoatRoughness: 0.12 }));
}
function slab(kit: Kit, w: number, h: number, d: number, color = 0x13120e) {
  return new THREE.Mesh(kit.geo(new RoundedBoxGeometry(w, h, d, 6, Math.min(0.05, h / 2))), kit.mat(new THREE.MeshPhysicalMaterial({ color, metalness: 0.85, roughness: 0.45, roughnessMap: kit.brushed(), clearcoat: 0.5, clearcoatRoughness: 0.3 })));
}
function textPlane(kit: Kit, text: string, w: number, h: number, color = "#b2aea6", flat = true) {
  const m = makePanel(kit, w, h, (x, W, H) => {
    x.fillStyle = color; x.font = `500 ${H * 0.55}px ${MONO}`; x.textBaseline = "middle"; x.fillText(text, 4, H / 2);
  }, 512);
  if (flat) m.rotation.x = -Math.PI / 2;
  return m;
}

/* ─────────────── AgentBattle: the arena. Two identical pieces, two materials, one score. ─────────────── */
export function buildBenchmark({ kit, root, tick, key }: Ctx) {
  const R = 3.6, TOP = 0.1, PX = 2.1, N = 24, PH = 1.95;
  const g = new THREE.Group(); g.rotation.x = 0.3; root.add(g);

  // turntable: brushed disc, chrome bezel, engraved rings and a degree scale
  const disc = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(R, R + 0.14, 0.2, 128)), graphite(kit, 0.42)); g.add(disc);
  const bezel = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(R, 0.045, 16, 192)), kit.chrome);
  bezel.rotation.x = Math.PI / 2; bezel.position.y = TOP; g.add(bezel);
  const floor = makeFloor(kit, 12); floor.position.y = -0.12; g.add(floor);

  const eng = lines(kit, [...loopPts(0.9), ...loopPts(1.8), ...loopPts(2.7, 160)], CREAM, 0.16); eng.position.y = TOP + 0.004; g.add(eng);
  const outer = lines(kit, loopPts(3.3, 192), CREAM, 0.38); outer.position.y = TOP + 0.004; g.add(outer);
  const tk: THREE.Vector3[] = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2, r0 = i % 10 === 0 ? 3.34 : 3.4;
    tk.push(new THREE.Vector3(Math.cos(a) * r0, 0, Math.sin(a) * r0), new THREE.Vector3(Math.cos(a) * 3.52, 0, Math.sin(a) * 3.52));
  }
  const ticks = lines(kit, tk, CREAM, 0.45); ticks.position.y = TOP + 0.004; g.add(ticks);
  const mid = lines(kit, [new THREE.Vector3(0, 0, -3.2), new THREE.Vector3(0, 0, 3.2)], CREAM, 0.22); mid.position.y = TOP + 0.004; g.add(mid);
  const la = textPlane(kit, "AGENT A", 1.4, 0.22, "#e6dcc8"); la.position.set(-2.05, TOP + 0.01, 1.55); g.add(la);
  const lb = textPlane(kit, "AGENT B", 1.4, 0.22, "#8a877f"); lb.position.set(2.05, TOP + 0.01, 1.55); g.add(lb);

  // the two contenders: one lathed silhouette, so the only difference is the agent
  const prof = new THREE.SplineCurve([
    [0.6, 0], [0.6, 0.08], [0.46, 0.17], [0.3, 0.42], [0.2, 0.82], [0.17, 1.1], [0.3, 1.22], [0.3, 1.28], [0.16, 1.35], [0.27, 1.56], [0.3, 1.7], [0.2, 1.88], [0, PH],
  ].map(([r, y]) => new THREE.Vector2(r, y))).getPoints(110).map((v) => new THREE.Vector2(Math.max(0.0005, v.x), v.y));
  const pieceGeo = kit.geo(new THREE.LatheGeometry(prof, 112));
  const matA = kit.mat(new THREE.MeshPhysicalMaterial({ color: 0xe6dcc8, metalness: 1, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06, emissive: CREAM, emissiveIntensity: 0.02 }));
  const matB = kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x15140f, metalness: 0.9, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, emissive: new THREE.Color("#9a968a"), emissiveIntensity: 0.0 }));
  const pieceA = new THREE.Mesh(pieceGeo, matA), pieceB = new THREE.Mesh(pieceGeo, matB);
  pieceA.position.set(-PX, TOP, 0); pieceB.position.set(PX, TOP, 0); g.add(pieceA, pieceB);

  // score collars: 24 radial ticks around each piece light up with the round's score
  const onA = kit.glow(CREAM, 2.2), onB = kit.glow(new THREE.Color("#b8b2a2"), 1.7), off = kit.mat(new THREE.MeshBasicMaterial({ color: 0x2c2a24 }));
  const tickGeo = kit.geo(new THREE.BoxGeometry(0.045, 0.02, 0.17));
  const collar = (x: number) => Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2, m = new THREE.Mesh(tickGeo, off);
    m.position.set(x + Math.cos(a) * 1.12, TOP + 0.012, Math.sin(a) * 1.12); m.rotation.y = Math.PI / 2 - a; g.add(m); return m;
  });
  const collA = collar(-PX), collB = collar(PX);
  const haloA = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.74, 0.78, 96)), kit.glow(CREAM, 1.6, 0.25));
  const haloB = new THREE.Mesh(haloA.geometry, kit.glow(new THREE.Color("#b8b2a2"), 1.3, 0.25));
  haloA.rotation.x = haloB.rotation.x = -Math.PI / 2; haloA.position.set(-PX, TOP + 0.008, 0); haloB.position.set(PX, TOP + 0.008, 0); g.add(haloA, haloB);

  // scoring core hovering over the centre line, fed by a trace from each piece
  const core = new THREE.Group(); core.position.set(0, 2.55, 0); g.add(core);
  const inner = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.16, 4)), kit.glow(CREAM, 2.6));
  const wire = new THREE.LineSegments(kit.geo(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1))), kit.mat(new THREE.LineBasicMaterial({ color: CREAM.clone().multiplyScalar(1.4), transparent: true, opacity: 0.85, toneMapped: false })));
  const ringA = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.72, 0.01, 8, 160)), kit.glow(CREAM, 1.4, 0.8));
  const ringB = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.92, 0.006, 8, 160)), kit.glow(CREAM, 0.9, 0.5));
  core.add(inner, wire, ringA, ringB);
  const curves = [-1, 1].map((s) => new THREE.QuadraticBezierCurve3(new THREE.Vector3(s * PX, TOP + PH + 0.1, 0), new THREE.Vector3(s * PX * 0.4, 3.7, 0), core.position));
  const traceMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.2), transparent: true, opacity: 0.32, toneMapped: false, depthWrite: false }));
  curves.forEach((c) => g.add(new THREE.Mesh(kit.geo(new THREE.TubeGeometry(c, 72, 0.008, 6, false)), traceMat)));
  const pulseGeo = kit.geo(new THREE.SphereGeometry(0.05, 12, 12)), pulseMat = kit.glow(CREAM, 3);
  const pulses = curves.map(() => { const m = new THREE.Mesh(pulseGeo, pulseMat); g.add(m); return m; });
  g.add(lines(kit, [new THREE.Vector3(0, TOP, 0), new THREE.Vector3(0, 2.1, 0)], CREAM, 0.16));
  const pad = new THREE.Mesh(kit.geo(new THREE.CircleGeometry(0.24, 48)), kit.glow(CREAM, 1.2, 0.5)); pad.rotation.x = -Math.PI / 2; pad.position.y = TOP + 0.006; g.add(pad);

  // evaluation sweep: a radar wedge walking around the arena
  const sweep = new THREE.Group(); sweep.position.y = TOP + 0.012; g.add(sweep);
  const wedge = new THREE.Mesh(kit.geo(new THREE.CircleGeometry(R - 0.25, 64, 0, 0.55)), kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.5), transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
  wedge.rotation.x = -Math.PI / 2;
  const edge = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(R - 0.25, 0.008, 0.02)), kit.glow(CREAM, 2.4, 0.8)); edge.position.x = (R - 0.25) / 2;
  sweep.add(wedge, edge);
  const sparks = makeSparks(kit, CREAM, 140, 0.035, 1.2); g.add(sparks.points);

  let run = -1, tA = 0, tB = 0, sA = 0, sB = 0, lean = 0, rt = 0, fired = true;
  const paint = (c: THREE.Mesh[], n: number, on: THREE.Material) => c.forEach((m, i) => { const w = i < n ? on : off; if (m.material !== w) m.material = w; });
  tick.push((t, dt) => {
    const r = Math.floor(t / 7);
    if (r !== run) { run = r; tA = 5 + rnd(r * 3.1) * 17; tB = 5 + rnd(r * 7.7 + 3) * 17; rt = t; fired = false; }
    const k = 1 - Math.exp(-1.5 * dt);
    sA += (tA - sA) * k; sB += (tB - sB) * k;
    paint(collA, Math.round(sA), onA); paint(collB, Math.round(sB), onB);
    const diff = (sA - sB) / N, settle = smooth(1.2, 3.4, t - rt);
    lean += (diff - lean) * (1 - Math.exp(-2.2 * dt));
    const winA = diff > 0 ? settle : 0, winB = diff < 0 ? settle : 0;
    matA.emissiveIntensity = 0.02 + winA * 0.42; matB.emissiveIntensity = winB * 0.5;
    (haloA.material as THREE.MeshBasicMaterial).opacity = 0.2 + winA * 0.7; (haloB.material as THREE.MeshBasicMaterial).opacity = 0.2 + winB * 0.7;
    core.position.y = 2.55 + Math.sin(t * 1.1) * 0.06;
    core.rotation.set(0, t * 0.5, lean * 0.55);
    ringA.rotation.set(Math.PI / 2 + Math.sin(t * 0.4) * 0.25, t * 0.35, 0);
    ringB.rotation.set(Math.PI / 2.6, -t * 0.22, Math.sin(t * 0.3) * 0.3);
    inner.scale.setScalar(1 + Math.sin(t * 3) * 0.08 + settle * 0.15);
    pulses.forEach((m, i) => { const u = (t * 0.32 + i * 0.5) % 1; curves[i].getPoint(u, m.position); m.scale.setScalar(smooth(0, 0.1, u) * (1 - smooth(0.9, 1, u))); });
    sweep.rotation.y = -t * 0.45;
    if (!fired && t - rt > 2.4 && Math.abs(diff) > 0.04) { fired = true; sparks.burst(_v.set(diff > 0 ? -PX : PX, TOP + PH, 0), 26, 1.3); }
    sparks.update(dt);
    key.color.copy(CREAM);
  });
}

/* ─────────────── DevSick: a city of services under a sentinel eye ─────────────── */
function makePath(pts: THREE.Vector3[]) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const total = L[L.length - 1];
  return {
    pts, total,
    at(u: number, out: THREE.Vector3) {
      const d = u * total; let i = 1;
      while (i < L.length - 1 && L[i] < d) i++;
      const k = (d - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return out.lerpVectors(pts[i - 1], pts[i], Math.min(1, Math.max(0, k)));
    },
  };
}
function addSegments(kit: Kit, parent: THREE.Object3D, pts: THREE.Vector3[], mat: THREE.Material, thick = 0.028) {
  const grp = new THREE.Group();
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], len = a.distanceTo(b);
    if (len < 0.001) continue;
    const m = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(len, thick, thick)), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    if (Math.abs(b.z - a.z) > Math.abs(b.x - a.x)) m.rotation.y = Math.PI / 2;
    grp.add(m);
  }
  parent.add(grp);
  return grp;
}

export function buildTopology({ kit, root, accent, tick, fill, key }: Ctx) {
  const red = new THREE.Color("#ff5a45");
  const W = 9.2, D = 6.2, COLS = 5, ROWS = 3, SX = 1.6, SZ = 1.7, SC = 3, SR = 1;
  const g = new THREE.Group(); g.rotation.x = 0.36; g.position.y = -0.2; root.add(g);
  const base = slab(kit, W, 0.14, D); base.position.y = -0.09; g.add(base);
  const grid = lines(kit, gridPts(W - 0.4, D - 0.4, 18, 12), CREAM, 0.08); grid.position.y = 0.004; g.add(grid);
  const floor = makeFloor(kit, 14); floor.position.y = -0.18; g.add(floor);

  // lit-window skin shared by every tower
  const cv = document.createElement("canvas"); cv.width = 64; cv.height = 128;
  const x2 = cv.getContext("2d")!;
  x2.fillStyle = "#000"; x2.fillRect(0, 0, 64, 128);
  for (let r = 0; r < 16; r++) for (let c = 0; c < 5; c++) {
    if (rnd(r * 13 + c * 7) < 0.5) { x2.fillStyle = `rgba(230,220,200,${0.35 + rnd(r * 5 + c * 11) * 0.65})`; x2.fillRect(4 + c * 12, 3 + r * 8, 8, 4); }
  }
  const winTex = kit.tex(new THREE.CanvasTexture(cv)); winTex.colorSpace = THREE.SRGBColorSpace;

  type Tower = { mat: THREE.MeshPhysicalMaterial; roof: THREE.MeshBasicMaterial; h: number; x: number; z: number };
  const towers: Tower[] = [];
  const roofGeo = kit.geo(new THREE.PlaneGeometry(0.6, 0.6));
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const sick = c === SC && r === SR;
    const h = sick ? 2.3 : 0.7 + rnd(c * 7 + r * 3) * 1.8;
    const x = (c - (COLS - 1) / 2) * SX, z = (r - (ROWS - 1) / 2) * SZ;
    const tex = kit.tex(winTex.clone()); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, Math.max(1, h * 1.5)); tex.needsUpdate = true;
    const mat = kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x1d1b16, metalness: 0.85, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.9 }));
    const body = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(0.95, h, 0.95, 5, 0.05)), mat); body.position.set(x, h / 2, z); g.add(body);
    const roof = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(0.9), toneMapped: false }));
    const rp = new THREE.Mesh(roofGeo, roof); rp.rotation.x = -Math.PI / 2; rp.position.set(x, h + 0.004, z); g.add(rp);
    towers.push({ mat, roof, h, x, z });
  }
  const sickT = towers[SC * ROWS + SR];

  // streets: a fine grid of aisles with data packets running through it
  const lineMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(0.8), transparent: true, opacity: 0.32, toneMapped: false, depthWrite: false }));
  const redMat = kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2.2), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  const streets: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
  for (let i = 0; i <= COLS; i++) { const x = (i - COLS / 2) * SX; streets.push({ a: new THREE.Vector3(x, 0.025, -D / 2 + 0.3), b: new THREE.Vector3(x, 0.025, D / 2 - 0.3) }); }
  for (let j = 0; j <= ROWS; j++) { const z = (j - ROWS / 2) * SZ; streets.push({ a: new THREE.Vector3(-W / 2 + 0.3, 0.025, z), b: new THREE.Vector3(W / 2 - 0.3, 0.025, z) }); }
  streets.forEach((s) => addSegments(kit, g, [s.a, s.b], lineMat, 0.02));
  [SC, SC + 1].forEach((i) => addSegments(kit, g, [streets[i].a, streets[i].b], redMat, 0.04));
  [SR, SR + 1].forEach((j) => addSegments(kit, g, [streets[COLS + 1 + j].a, streets[COLS + 1 + j].b], redMat, 0.04));
  const pktGeo = kit.geo(new THREE.BoxGeometry(0.09, 0.05, 0.09)), pktMat = kit.glow(CREAM, 2.4);
  const pkts = Array.from({ length: 16 }, (_, i) => {
    const s = streets[i % streets.length], fwd = i % 2 === 0;
    const m = new THREE.Mesh(pktGeo, pktMat); m.userData = { p: makePath(fwd ? [s.a, s.b] : [s.b, s.a]), o: rnd(i * 9.1), v: 0.1 + rnd(i * 3.3) * 0.12 }; g.add(m); return m;
  });

  // the sentinel: gimbal rings, a glass lens and a search cone
  const eye = new THREE.Group(); eye.position.set(0, 4.6, 0); g.add(eye);
  const gyro = [[0.95, 0.016], [0.72, 0.014], [0.5, 0.018]].map(([r, tube]) => { const m = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(r, tube, 12, 160)), kit.chrome); eye.add(m); return m; });
  const gaze = new THREE.Group(); eye.add(gaze);
  gaze.add(new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.28, 48, 32)), kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 }))));
  const irisMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(2.4), toneMapped: false }));
  const iris = new THREE.Mesh(kit.geo(new THREE.CircleGeometry(0.15, 48)), irisMat); iris.position.z = 0.275; gaze.add(iris);
  const pupil = new THREE.Mesh(kit.geo(new THREE.CircleGeometry(0.06, 32)), kit.mat(new THREE.MeshBasicMaterial({ color: 0x000000 }))); pupil.position.z = 0.277; gaze.add(pupil);
  const coneGeo = kit.geo(new THREE.ConeGeometry(1, 1, 48, 1, true)); coneGeo.translate(0, -0.5, 0); coneGeo.rotateX(-Math.PI / 2);
  const coneMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.4), transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
  const cone = new THREE.Mesh(coneGeo, coneMat); gaze.add(cone);
  const spotMat = kit.glow(CREAM, 1.6, 0.6);
  const spot = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.46, 0.5, 64)), spotMat); spot.rotation.x = -Math.PI / 2; g.add(spot);
  const pingMat = kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2.2), transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
  const ping = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.55, 0.58, 64)), pingMat); ping.rotation.x = -Math.PI / 2; ping.position.set(sickT.x, 0.05, sickT.z); g.add(ping);
  const sparks = makeSparks(kit, red, 90, 0.04, 1); g.add(sparks.points);

  const rca = makePanel(kit, 3.1, 1.95, (x, W2, H) => {
    drawFrame(x, W2, H, "rgba(230,220,200,.45)");
    x.fillStyle = "#8a877f"; x.font = `600 ${W2 * 0.032}px ${MONO}`; x.fillText("ROOT CAUSE ANALYSIS", W2 * 0.06, H * 0.14);
    x.fillStyle = "#ece8df"; x.font = `600 ${W2 * 0.05}px ${MONO}`; x.fillText("DB POOL EXHAUSTED", W2 * 0.06, H * 0.34);
    x.fillStyle = "#b2aea6"; x.font = `400 ${W2 * 0.034}px ${MONO}`; x.fillText("api-5xx-spike  ·  3 services", W2 * 0.06, H * 0.48);
    x.fillStyle = "#8a877f"; x.font = `600 ${W2 * 0.03}px ${MONO}`; x.fillText("CONFIDENCE", W2 * 0.06, H * 0.64);
    x.fillStyle = "rgba(230,220,200,.15)"; x.fillRect(W2 * 0.06, H * 0.7, W2 * 0.88, H * 0.05);
    x.fillStyle = "#e6dcc8"; x.fillRect(W2 * 0.06, H * 0.7, W2 * 0.88 * 0.94, H * 0.05);
    x.fillStyle = "#ece8df"; x.font = `600 ${W2 * 0.034}px ${MONO}`; x.fillText("94%", W2 * 0.84, H * 0.64);
    x.fillStyle = "#8a877f"; x.font = `400 ${W2 * 0.03}px ${MONO}`; x.fillText("FIX  restart pool · scale +2   [ APPROVE ]", W2 * 0.06, H * 0.92);
  });
  rca.position.set(-3.2, 3.6, 1.8); rca.rotation.set(-0.3, 0.3, 0); g.add(rca);
  const rcaMat = rca.material as THREE.MeshBasicMaterial; rcaMat.opacity = 0;

  const tgt = new THREE.Vector3(), goal = new THREE.Vector3(), roam = new THREE.Vector3(), lockPt = new THREE.Vector3(sickT.x, sickT.h + 0.02, sickT.z);
  const white = new THREE.Color(0xffffff), cream = CREAM.clone().multiplyScalar(2.4), hot = red.clone().multiplyScalar(2.4);
  tick.push((t, dt) => {
    const c = (t % 12) / 12;
    const alert = c < 0.28 ? 0 : c < 0.4 ? smooth(0.28, 0.4, c) : c < 0.8 ? 1 : 1 - smooth(0.8, 0.92, c);
    const lock = smooth(0.34, 0.44, c) * (1 - smooth(0.8, 0.9, c));
    roam.set(Math.sin(t * 0.45) * 3.0, 0.02, Math.cos(t * 0.31) * 1.9);
    goal.copy(roam).lerp(lockPt, lock);
    tgt.lerp(goal, 1 - Math.exp(-3 * dt));
    eye.position.y = 4.6 + Math.sin(t * 1.1) * 0.07;
    _v.copy(tgt).sub(eye.position); const len = _v.length();
    gaze.quaternion.slerp(_q.setFromUnitVectors(_z, _v.normalize()), 1 - Math.exp(-6 * dt));
    const rad = len * (0.2 - lock * 0.09);
    cone.scale.set(rad, rad, len);
    coneMat.opacity = 0.05 + lock * 0.05;
    coneMat.color.copy(CREAM).multiplyScalar(1.4).lerp(hot, alert * 0.8);
    irisMat.color.copy(cream).lerp(hot, alert);
    spot.position.copy(tgt); spot.position.y = tgt.y + 0.01; spotMat.color.copy(irisMat.color).multiplyScalar(0.7);
    spot.scale.setScalar(1 - lock * 0.35);
    gyro[0].rotation.set(t * 0.3, t * 0.2, 0);
    gyro[1].rotation.set(Math.PI / 2 + Math.sin(t * 0.4) * 0.3, t * 0.5, 0);
    gyro[2].rotation.set(t * 0.6, 0, t * 0.35);

    towers.forEach((tw, i) => { if (tw !== sickT) tw.mat.emissiveIntensity = 0.8 + Math.sin(t * 0.7 + i * 1.9) * 0.12; });
    const flick = 0.9 + alert * 0.6 * (0.5 + 0.5 * Math.sin(t * 14));
    sickT.mat.emissive.copy(white).lerp(red, alert); sickT.mat.emissiveIntensity = flick;
    sickT.roof.color.copy(CREAM).multiplyScalar(0.9).lerp(hot, alert);
    redMat.opacity = alert * 0.75;
    const pp = (t * 1.1) % 1;
    pingMat.opacity = alert > 0.05 ? (1 - pp) * 0.75 * alert : 0; ping.scale.setScalar(1 + pp * 2.2);
    if (alert > 0.5 && Math.random() < dt * 8) sparks.burst(_v.set(sickT.x + (Math.random() - 0.5) * 0.5, sickT.h, sickT.z + (Math.random() - 0.5) * 0.5), 3, 0.8);
    sparks.update(dt);
    const vis = smooth(0.46, 0.54, c) * (1 - smooth(0.78, 0.88, c));
    rcaMat.opacity = vis; rca.visible = vis > 0.01; rca.position.y = 3.6 + Math.sin(t * 1.1) * 0.05 - (1 - vis) * 0.3;
    pkts.forEach((m) => {
      const u = (t * m.userData.v + m.userData.o) % 1;
      m.userData.p.at(u, m.position); m.position.y = 0.05; m.scale.setScalar(smooth(0, 0.08, u) * (1 - smooth(0.92, 1, u)));
    });
    fill.color.copy(accent).lerp(red, alert * 0.8); key.color.copy(CREAM).lerp(red, alert * 0.25);
  });
}

/* ─────────────── QuestionForge: draft cloud → validation chamber → trusted stack ─────────────── */
function hermite(ks: [number, number][], u: number) {
  let i = 0;
  while (i < ks.length - 2 && u > ks[i + 1][0]) i++;
  const [t0, p0] = ks[i], [t1, p1] = ks[i + 1];
  const m = (j: number) => { const a = ks[Math.max(0, j - 1)], b = ks[Math.min(ks.length - 1, j + 1)]; return (b[1] - a[1]) / ((b[0] - a[0]) || 1); };
  const h = t1 - t0, s = (u - t0) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * m(i) + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * m(i + 1);
}

export function buildPipeline({ kit, root, accent, tick, fill }: Ctx) {
  const g = new THREE.Group(); root.add(g);
  const CY = 5.6, RY0 = 2.7, RY1 = 3.75, RR = 1.2, STACK = 7, TOPY = 0.24 + STACK * 0.07;

  // plinth with engraved rings
  const plinth = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(1.8, 1.9, 0.24, 96)), graphite(kit, 0.4)); plinth.position.y = 0.12; g.add(plinth);
  const bez = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(1.8, 0.035, 16, 128)), kit.chrome); bez.rotation.x = Math.PI / 2; bez.position.y = 0.24; g.add(bez);
  const eng = lines(kit, [...loopPts(1.2), ...loopPts(1.55, 128)], CREAM, 0.18); eng.position.y = 0.245; g.add(eng);
  const floor = makeFloor(kit, 11); floor.position.y = -0.01; g.add(floor);

  // the trusted stack: validated documents laid flat, each a little off-axis
  const texV = cardTexture(kit, true, accent), texU = cardTexture(kit, false, accent);
  const slabGeo = kit.geo(new RoundedBoxGeometry(1.06, 0.06, 1.5, 4, 0.02)), faceGeo = kit.geo(new THREE.PlaneGeometry(0.92, 1.3));
  const slabMat = graphite(kit, 0.3);
  for (let i = 0; i < STACK; i++) {
    const s = new THREE.Mesh(slabGeo, slabMat); s.position.y = 0.24 + 0.035 + i * 0.07; s.rotation.y = (rnd(i * 5.3) - 0.5) * 0.28; g.add(s);
    if (i >= STACK - 3) {
      const f = new THREE.Mesh(faceGeo, kit.mat(new THREE.MeshBasicMaterial({ map: texV, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(0.75) })));
      f.rotation.x = -Math.PI / 2; f.rotation.z = s.rotation.y; f.position.y = s.position.y + 0.032; g.add(f);
    }
  }

  // validation chamber: two chrome rings, four posts, a scan disc between them
  [RY0, RY1].forEach((y) => { const r = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(RR, 0.04, 16, 160)), kit.chrome); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); });
  const glowRingMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.4), toneMapped: false }));
  [RY0, RY1].forEach((y) => { const r = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(RR - 0.07, 0.008, 8, 160)), glowRingMat); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); });
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2, p = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.025, 0.025, RY1 - RY0, 12)), kit.chrome);
    p.position.set(Math.cos(a) * RR, (RY0 + RY1) / 2, Math.sin(a) * RR); g.add(p);
  }
  const scan = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.15, RR - 0.05, 96)), kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.6), transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
  scan.rotation.x = -Math.PI / 2; g.add(scan);
  const scanEdge = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(RR - 0.05, 0.012, 8, 160)), kit.glow(CREAM, 3)); scanEdge.rotation.x = Math.PI / 2; g.add(scanEdge);
  g.add(lines(kit, [new THREE.Vector3(0, TOPY, 0), new THREE.Vector3(0, CY - 0.6, 0)], CREAM, 0.14));

  // draft cloud: unvalidated ideas orbiting a seed
  const CN = 260, cPos = new Float32Array(CN * 3), cs = Array.from({ length: CN }, (_, i) => ({ r: 0.45 + rnd(i * 1.7) * 0.5, a: rnd(i * 2.9) * 6.283, ph: Math.acos(2 * rnd(i * 4.1) - 1), v: 0.15 + rnd(i * 5.3) * 0.5 }));
  const cGeo = kit.geo(new THREE.BufferGeometry()); cGeo.setAttribute("position", new THREE.BufferAttribute(cPos, 3));
  const cloud = new THREE.Points(cGeo, kit.mat(new THREE.PointsMaterial({ size: 0.05, color: CREAM.clone().multiplyScalar(0.9), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
  cloud.frustumCulled = false; cloud.position.y = CY; g.add(cloud);
  const shell = new THREE.LineSegments(kit.geo(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1))), kit.mat(new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.14 })));
  shell.position.y = CY; g.add(shell);
  const seed = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.13, 3)), kit.glow(CREAM, 2.6)); seed.position.y = CY; g.add(seed);

  // labels
  [["GENERATE", CY], ["VALIDATE", (RY0 + RY1) / 2], ["TRUST", TOPY + 0.2]].forEach(([s, y]) => {
    const l = textPlane(kit, s as string, 1.4, 0.2, s === "VALIDATE" ? "#e6dcc8" : "#8a877f", false); l.position.set(2.55 + 0.7, y as number, 0); g.add(l);
    g.add(lines(kit, [new THREE.Vector3(1.55, y as number, 0), new THREE.Vector3(2.45, y as number, 0)], CREAM, 0.3));
  });

  // documents: emerge from the cloud, pass the chamber (and become verified), land on the stack
  const body = kit.geo(new RoundedBoxGeometry(0.92, 1.28, 0.03, 4, 0.03)), face = kit.geo(new THREE.PlaneGeometry(0.9, 1.25));
  const N = 5, KF: [number, number][] = [[0, CY - 0.6], [0.2, 4.55], [0.45, RY1 + 0.15], [0.62, RY0 - 0.1], [0.9, TOPY + 0.04], [1, TOPY + 0.04]];
  const docs = Array.from({ length: N }, () => {
    const d = new THREE.Group(); d.rotation.order = "YXZ";
    d.add(new THREE.Mesh(body, kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x15140f, metalness: 0.7, roughness: 0.35 }))));
    const f = new THREE.Mesh(face, kit.mat(new THREE.MeshBasicMaterial({ map: texU, toneMapped: false }))); f.position.z = 0.017; d.add(f);
    const vm = kit.mat(new THREE.MeshBasicMaterial({ map: texV, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    const f2 = new THREE.Mesh(face, vm); f2.position.z = 0.0175; d.add(f2);
    const b = new THREE.Mesh(face, kit.dark); b.position.z = -0.017; b.rotation.y = Math.PI; d.add(b);
    g.add(d);
    return { d, vm, prev: 0 };
  });
  const sparks = makeSparks(kit, accent.clone().lerp(CREAM, 0.5), 160, 0.04, 0.5); g.add(sparks.points);
  let flash = 0;
  tick.push((t, dt) => {
    docs.forEach((o, i) => {
      const u = (t * 0.07 + i / N) % 1;
      const y = hermite(KF, u);
      const flat = smooth(0.7, 0.9, u);
      o.d.position.set(0, y + 0.64 * (1 - flat), 0);
      o.d.rotation.set(-flat * (Math.PI / 2), (1 - flat) * (t * 0.6 + i * 1.3), 0);
      o.d.scale.setScalar(0.8 * (0.25 + 0.75 * smooth(0, 0.16, u)) * (1 - smooth(0.94, 1, u)));
      o.vm.opacity = smooth(0.5, 0.58, u);
      if (u > 0.54 && o.prev <= 0.54) { flash = 1; sparks.burst(_v.set(0, (RY0 + RY1) / 2, 0), 22, 1.2); }
      o.prev = u;
    });
    flash = Math.max(0, flash - dt * 2.2);
    const s = 0.5 + 0.5 * Math.sin(t * 1.6), sy = RY0 + 0.05 + s * (RY1 - RY0 - 0.1);
    scan.position.y = scanEdge.position.y = sy;
    (scan.material as THREE.MeshBasicMaterial).opacity = 0.1 + flash * 0.2;
    glowRingMat.color.copy(CREAM).multiplyScalar(1.4 + flash * 2.4);
    for (let i = 0; i < CN; i++) {
      const p = cs[i], a = p.a + t * p.v, r = p.r * (1 + Math.sin(t * 0.8 + i) * 0.04);
      cPos[i * 3] = Math.sin(p.ph) * Math.cos(a) * r; cPos[i * 3 + 1] = Math.cos(p.ph + t * p.v * 0.3) * r; cPos[i * 3 + 2] = Math.sin(p.ph) * Math.sin(a) * r;
    }
    cGeo.attributes.position.needsUpdate = true;
    shell.rotation.set(t * 0.1, t * 0.15, 0); seed.scale.setScalar(1 + Math.sin(t * 3) * 0.12);
    fill.intensity = 35 + flash * 25;
    sparks.update(dt);
  });
}

/* ─────────────── Ops Academy: the learning path. Four modules, climbed one at a time. ─────────────── */
export function buildPath({ kit, root, accent, tick, fill }: Ctx) {
  const g = new THREE.Group(); root.add(g);
  const N = 4, W = 1.5, D = 1.7, GAP = 0.12, RISE = 0.78, BASE = 0.5;
  const x0 = -((N - 1) * (W + GAP)) / 2;
  const stepX = (i: number) => x0 + i * (W + GAP);
  const topY = (i: number) => BASE + i * RISE;
  // module states mirror the homepage visual: done, done, in progress, locked
  const level = [1, 1, 0.55, 0.12];

  const plinth = slab(kit, N * (W + GAP) + 1.2, 0.24, D + 1.2); plinth.position.y = 0.12; g.add(plinth);
  const bez = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(N * (W + GAP) + 1.3, 0.03, D + 1.3, 3, 0.012)), kit.chrome); bez.position.y = 0.25; g.add(bez);
  const floor = makeFloor(kit, 12); floor.position.y = -0.01; g.add(floor);

  const plates: THREE.MeshBasicMaterial[] = [];
  for (let i = 0; i < N; i++) {
    const h = topY(i) - 0.24;
    const block = slab(kit, W, h, D, 0x15140f); block.position.set(stepX(i), 0.24 + h / 2, 0); g.add(block);
    const edge = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(W - 0.04, 0.02, 0.02)), kit.glow(CREAM, 0.5 + level[i] * 2.4)); edge.position.set(stepX(i), topY(i) + 0.005, D / 2 - 0.02); g.add(edge);
    const pm = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(level[i] * 0.9), transparent: true, opacity: 0.2 + level[i] * 0.4, toneMapped: false, depthWrite: false }));
    plates.push(pm);
    const plate = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(W - 0.34, D - 0.34)), pm); plate.rotation.x = -Math.PI / 2; plate.position.set(stepX(i), topY(i) + 0.012, 0); g.add(plate);
    const label = textPlane(kit, `0${i + 1}`, 0.9, 0.2, i === 3 ? "#8a877f" : "#14120f"); label.position.set(stepX(i), topY(i) + 0.02, 0); g.add(label);
  }

  // the route: a fine line over the step tops, ending at the goal
  const route = [0, 1, 2, 3].map((i) => new THREE.Vector3(stepX(i), topY(i) + 0.18, 0));
  const seg: THREE.Vector3[] = [];
  for (let i = 0; i < N - 1; i++) seg.push(route[i], new THREE.Vector3(route[i].x + (W + GAP) / 2, route[i].y, 0), new THREE.Vector3(route[i].x + (W + GAP) / 2, route[i].y, 0), route[i + 1]);
  g.add(lines(kit, seg, CREAM, 0.22));

  // goal: a floating completion marker above the last step
  const goalY = topY(N - 1) + 1.15, gx = stepX(N - 1);
  const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.5, 0.025, 16, 96)), kit.chrome); ring.position.set(gx, goalY, 0); g.add(ring);
  const ringGlow = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.43, 0.007, 8, 96)), kit.glow(CREAM, 1.6)); ringGlow.position.copy(ring.position); g.add(ringGlow);
  const gem = new THREE.Mesh(kit.geo(new THREE.OctahedronGeometry(0.2, 0)), kit.glow(CREAM, 2.2)); gem.position.copy(ring.position); g.add(gem);
  g.add(lines(kit, [new THREE.Vector3(gx, topY(N - 1) + 0.03, 0), new THREE.Vector3(gx, goalY - 0.55, 0)], CREAM, 0.14));

  // learner: an orb that hops up the path, one module at a time
  const orb = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.15, 3)), kit.glow(CREAM, 2.8)); g.add(orb);
  const halo = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.22, 0.27, 48)), kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.6), transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }))); halo.rotation.x = -Math.PI / 2; g.add(halo);
  const sparks = makeSparks(kit, accent.clone().lerp(CREAM, 0.5), 120, 0.04, 0.6); g.add(sparks.points);
  const HOP = 2.4, PAUSE = 0.9, CYCLE = (HOP + PAUSE) * (N - 1) + 1.6;
  let at = 0, flash = 0;
  tick.push((t, dt) => {
    const c = t % CYCLE, k = Math.min(N - 1, c / (HOP + PAUSE)), i = Math.min(N - 2, Math.floor(k));
    const local = (c - i * (HOP + PAUSE)) / HOP, u = c >= (N - 1) * (HOP + PAUSE) ? 1 : smooth(0, 1, Math.min(1, local));
    const a = route[i], b = route[Math.min(N - 1, i + 1)];
    orb.position.set(THREE.MathUtils.lerp(a.x, b.x, u), THREE.MathUtils.lerp(a.y, b.y, u) + Math.sin(u * Math.PI) * 0.55 * (u < 1 ? 1 : 0), 0);
    halo.position.set(orb.position.x, THREE.MathUtils.lerp(a.y, b.y, u) - 0.12, 0);
    const lands = u >= 1 && local >= 1 ? i + 1 : -1;
    if (lands !== at && lands > 0) { flash = 1; sparks.burst(_v.copy(orb.position), 18, 1); }
    at = lands;
    flash = Math.max(0, flash - dt * 2);
    orb.scale.setScalar(1 + flash * 0.4 + Math.sin(t * 4) * 0.05);
    halo.scale.setScalar(1 + Math.sin(t * 2.4) * 0.15 + flash * 0.5);
    plates[2].opacity = 0.2 + 0.55 * (0.6 + 0.4 * Math.sin(t * 2.2));
    ring.rotation.set(Math.PI / 2 + Math.sin(t * 0.7) * 0.25, 0, t * 0.5); ringGlow.rotation.copy(ring.rotation);
    gem.rotation.y = t * 0.8; gem.position.y = goalY + Math.sin(t * 1.4) * 0.08; gem.scale.setScalar(1 + (c > CYCLE - 1.8 ? 0.35 : 0));
    fill.intensity = 35 + flash * 20;
    sparks.update(dt);
  });
}
