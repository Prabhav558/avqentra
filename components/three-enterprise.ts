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
const _v = new THREE.Vector3();

function lines(kit: Kit, pts: THREE.Vector3[], color: THREE.ColorRepresentation, opacity: number) {
  return new THREE.LineSegments(kit.geo(new THREE.BufferGeometry().setFromPoints(pts)), kit.mat(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })));
}
function gridPts(w: number, d: number, nx: number, nz: number) {
  const p: THREE.Vector3[] = [];
  for (let i = 0; i <= nx; i++) { const x = -w / 2 + (w * i) / nx; p.push(new THREE.Vector3(x, 0, -d / 2), new THREE.Vector3(x, 0, d / 2)); }
  for (let i = 0; i <= nz; i++) { const z = -d / 2 + (d * i) / nz; p.push(new THREE.Vector3(-w / 2, 0, z), new THREE.Vector3(w / 2, 0, z)); }
  return p;
}
function slab(kit: Kit, w: number, h: number, d: number, color = 0x13120e) {
  return new THREE.Mesh(kit.geo(new RoundedBoxGeometry(w, h, d, 4, Math.min(0.05, h / 2))), kit.mat(new THREE.MeshPhysicalMaterial({ color, metalness: 0.85, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3 })));
}
function textPlane(kit: Kit, text: string, w: number, h: number, color = "#b2aea6", flat = true) {
  const m = makePanel(kit, w, h, (x, W, H) => {
    x.fillStyle = color; x.font = `500 ${H * 0.55}px ${MONO}`; x.textBaseline = "middle"; x.fillText(text, 4, H / 2);
  }, 512);
  if (flat) m.rotation.x = -Math.PI / 2;
  return m;
}

/* ───────────────────────────── AgentBattle: benchmark chart ───────────────────────────── */
export function buildBenchmark({ kit, root, accent, tick, key }: Ctx) {
  const T = 6, span = 1.5;
  const g = new THREE.Group(); g.rotation.x = 0.2; root.add(g);
  const plateW = T * span + 1.2;
  const plate = slab(kit, plateW, 0.16, 3.2); plate.position.y = -0.08; g.add(plate);
  const grid = lines(kit, gridPts(plateW - 0.3, 2.9, T * 2, 6), CREAM, 0.13); grid.position.y = 0.006; g.add(grid);
  const floor = makeFloor(kit, 13); floor.position.y = -0.17; g.add(floor);

  const geo = kit.geo(new RoundedBoxGeometry(0.46, 1, 0.46, 3, 0.04));
  const A = CREAM.clone().lerp(accent, 0.3), B = new THREE.Color("#7d7a70");
  const colsA: THREE.Mesh[] = [], colsB: THREE.Mesh[] = [], capA: THREE.Mesh[] = [], capB: THREE.Mesh[] = [], mark: THREE.Mesh[] = [];
  const hA = new Array(T).fill(0.2), hB = new Array(T).fill(0.2), tA = new Array(T).fill(1), tB = new Array(T).fill(1);
  const capGeo = kit.geo(new THREE.PlaneGeometry(0.4, 0.4));
  const markGeo = kit.geo(new THREE.OctahedronGeometry(0.1));
  for (let i = 0; i < T; i++) {
    const x = (i - (T - 1) / 2) * span;
    const mk = (c: THREE.Color, rough: number) => kit.mat(new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.95, roughness: rough, clearcoat: 1, clearcoatRoughness: 0.15, emissive: c, emissiveIntensity: 0.05 }));
    const a = new THREE.Mesh(geo, mk(A, 0.22)), b = new THREE.Mesh(geo, mk(B, 0.35));
    a.position.set(x - 0.34, 0, 0); b.position.set(x + 0.34, 0, 0); g.add(a, b); colsA.push(a); colsB.push(b);
    const ca = new THREE.Mesh(capGeo, kit.glow(A, 2.2)), cb = new THREE.Mesh(capGeo, kit.glow(B, 1.2));
    ca.rotation.x = cb.rotation.x = -Math.PI / 2; g.add(ca, cb); capA.push(ca); capB.push(cb);
    const m = new THREE.Mesh(markGeo, kit.glow(CREAM, 2.6)); g.add(m); mark.push(m);
    const lab = textPlane(kit, `T${String(i + 1).padStart(2, "0")}`, 0.6, 0.22); lab.position.set(x, 0.012, 1.3); g.add(lab);
  }
  // score axis
  const axX = -plateW / 2 + 0.05;
  const axis: THREE.Vector3[] = [new THREE.Vector3(axX, 0, -1.45), new THREE.Vector3(axX, 3.6, -1.45)];
  for (let k = 0; k <= 4; k++) axis.push(new THREE.Vector3(axX, k * 0.9, -1.45), new THREE.Vector3(axX + 0.12, k * 0.9, -1.45));
  g.add(lines(kit, axis, CREAM, 0.4));
  const lbl = textPlane(kit, "SCORE", 0.9, 0.22, "#8a877f", false); lbl.position.set(axX + 0.35, 3.75, -1.45); g.add(lbl);
  const legend = makePanel(kit, 2.6, 0.55, (x, W, H) => {
    x.fillStyle = `#${A.getHexString()}`; x.fillRect(W * 0.04, H * 0.3, H * 0.4, H * 0.4);
    x.fillStyle = "#cfcac0"; x.font = `500 ${H * 0.34}px ${MONO}`; x.textBaseline = "middle"; x.fillText("AGENT A", W * 0.04 + H * 0.6, H * 0.5);
    x.fillStyle = `#${B.getHexString()}`; x.fillRect(W * 0.52, H * 0.3, H * 0.4, H * 0.4);
    x.fillStyle = "#cfcac0"; x.fillText("AGENT B", W * 0.52 + H * 0.6, H * 0.5);
  }, 1024);
  legend.position.set(plateW / 2 - 1.5, 3.75, -1.45); g.add(legend);
  // scan line
  const scan = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.035, 0.012, 2.9)), kit.glow(CREAM, 3));
  scan.position.y = 0.02; g.add(scan);
  const scanGlow = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(0.9, 2.9)), kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.5), transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
  scanGlow.rotation.x = -Math.PI / 2; scanGlow.position.y = 0.015; g.add(scanGlow);
  const sparks = makeSparks(kit, CREAM, 120, 0.035, 1.2); g.add(sparks.points);

  const rnd = (s: number) => { const v = Math.sin(s * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  let run = -1;
  tick.push((t, dt) => {
    const r = Math.floor(t / 6);
    if (r !== run) {
      run = r;
      for (let i = 0; i < T; i++) { tA[i] = 0.9 + rnd(r * 17 + i) * 2.4; tB[i] = 0.7 + rnd(r * 29 + i + 5) * 2.4; }
    }
    const k = 1 - Math.exp(-2.4 * dt);
    const sx = -plateW / 2 + 0.6 + (((t * 0.28) % 1.35) / 1.35) * (plateW - 1.2);
    scan.position.x = scanGlow.position.x = sx;
    for (let i = 0; i < T; i++) {
      hA[i] += (tA[i] - hA[i]) * k; hB[i] += (tB[i] - hB[i]) * k;
      const x = (i - (T - 1) / 2) * span;
      colsA[i].scale.y = hA[i]; colsA[i].position.y = hA[i] / 2;
      colsB[i].scale.y = hB[i]; colsB[i].position.y = hB[i] / 2;
      capA[i].position.set(x - 0.34, hA[i] + 0.004, 0); capB[i].position.set(x + 0.34, hB[i] + 0.004, 0);
      const near = Math.exp(-Math.pow((sx - x) * 1.3, 2));
      (colsA[i].material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.05 + near * 0.9;
      (colsB[i].material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.05 + near * 0.6;
      const lead = hA[i] >= hB[i];
      mark[i].position.set(x + (lead ? -0.34 : 0.34), Math.max(hA[i], hB[i]) + 0.4 + Math.sin(t * 2 + i) * 0.04, 0);
      mark[i].rotation.y = t * 1.2;
      if (near > 0.9 && Math.random() < dt * 6) sparks.burst(_v.set(x + (lead ? -0.34 : 0.34), Math.max(hA[i], hB[i]) + 0.05, 0), 2, 0.5);
    }
    sparks.update(dt);
    key.color.copy(CREAM).lerp(accent, 0.25);
  });
}

/* ───────────────────────────── DevSick: service topology ───────────────────────────── */
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
  const red = new THREE.Color("#ff4655");
  const g = new THREE.Group(); g.rotation.x = 0.5; g.position.y = -0.2; root.add(g);
  const base = slab(kit, 15, 0.14, 8.6); base.position.y = -0.09; g.add(base);
  const grid = lines(kit, gridPts(14.6, 8.2, 14, 8), CREAM, 0.1); grid.position.y = 0.002; g.add(grid);
  const floor = makeFloor(kit, 14); floor.position.y = -0.18; g.add(floor);

  const gw = new THREE.Vector3(-5.2, 0, 0);
  const svc = [-2.4, -1.2, 0, 1.2, 2.4].map((z) => new THREE.Vector3(-2, 0, z));
  const sto = [-1.8, -0.6, 0.6, 1.8].map((z) => new THREE.Vector3(1.6, 0, z));
  const SICK = 3;
  const nodeGeo = kit.geo(new RoundedBoxGeometry(0.72, 0.26, 0.72, 4, 0.05));
  const plateGeo = kit.geo(new THREE.PlaneGeometry(0.46, 0.46));
  const nodeMat = kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x1a1914, metalness: 0.9, roughness: 0.3, clearcoat: 0.8 }));
  const okMat = kit.glow(CREAM, 1.3, 1);
  const sickMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(1.3), toneMapped: false }));
  const place = (p: THREE.Vector3, mat: THREE.Material, scale = 1) => {
    const n = new THREE.Mesh(nodeGeo, nodeMat); n.position.set(p.x, 0.13 * scale, p.z); n.scale.setScalar(scale);
    const pl = new THREE.Mesh(plateGeo, mat); pl.rotation.x = -Math.PI / 2; pl.position.set(p.x, 0.262 * scale + 0.002, p.z); pl.scale.setScalar(scale);
    g.add(n, pl);
  };
  place(gw, kit.glow(accent.clone().lerp(CREAM, 0.4), 1.8), 1.35);
  svc.forEach((p, i) => place(p, i === SICK ? sickMat : okMat));
  sto.forEach((p) => place(p, kit.glow(CREAM, 0.7)));

  const lineMat = kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(0.8), transparent: true, opacity: 0.4, toneMapped: false, depthWrite: false }));
  const hiMat = kit.mat(new THREE.MeshBasicMaterial({ color: accent.clone().lerp(CREAM, 0.5).multiplyScalar(2.4), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  const redMat = kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2.2), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  const route = (a: THREE.Vector3, b: THREE.Vector3, off = 0) => {
    const xm = (a.x + b.x) / 2 + off;
    return [new THREE.Vector3(a.x, 0.03, a.z), new THREE.Vector3(xm, 0.03, a.z), new THREE.Vector3(xm, 0.03, b.z), new THREE.Vector3(b.x, 0.03, b.z)];
  };
  const links: { path: ReturnType<typeof makePath>; bad: boolean }[] = [];
  svc.forEach((s, i) => {
    const p = route(gw, s, -0.5 + i * 0.2); addSegments(kit, g, p, lineMat); links.push({ path: makePath(p), bad: false });
    [i % 4, (i + 1) % 4].forEach((j, k) => {
      const q = route(s, sto[j], 0.1 + k * 0.28); addSegments(kit, g, q, lineMat);
      links.push({ path: makePath(q), bad: i === SICK });
      if (i === SICK) addSegments(kit, g, q, redMat, 0.05);
    });
  });
  // highlighted trace gateway → faulty service
  const trace = route(gw, svc[SICK], -0.5 + SICK * 0.2);
  addSegments(kit, g, trace, hiMat, 0.05);
  const traceMats = [hiMat];

  const pktGeo = kit.geo(new THREE.BoxGeometry(0.09, 0.05, 0.09));
  const pktMat = kit.glow(CREAM, 2.4);
  const pkts = links.map((l, i) => { const m = new THREE.Mesh(pktGeo, pktMat); m.userData = { l, o: i * 0.173 }; g.add(m); return m; });

  // AI core hovering above
  const core = new THREE.Group(); core.position.set(1.4, 3.1, 0); g.add(core);
  const inner = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.2, 2)), kit.glow(accent.clone().lerp(CREAM, 0.5), 2.4));
  const lat = new THREE.LineSegments(kit.geo(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.46, 1))), kit.mat(new THREE.LineBasicMaterial({ color: CREAM.clone().multiplyScalar(1.4), transparent: true, opacity: 0.85, toneMapped: false })));
  const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.78, 0.01, 8, 128)), kit.glow(CREAM, 1.4, 0.8));
  core.add(inner, lat, ring);
  const stem = lines(kit, [new THREE.Vector3(1.4, 2.6, 0), new THREE.Vector3(1.4, 0, 0)], CREAM, 0.18); g.add(stem);
  const beamMat = kit.mat(new THREE.MeshBasicMaterial({ color: accent.clone().lerp(CREAM, 0.5).multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  const beam = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.012, 0.05, 1, 10, 1, true)), beamMat); g.add(beam);
  const pingMat = kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2.2), transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
  const ping = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.42, 0.45, 64)), pingMat); ping.rotation.x = -Math.PI / 2; ping.position.set(svc[SICK].x, 0.05, svc[SICK].z); g.add(ping);
  const sparks = makeSparks(kit, red, 90, 0.04, 1); g.add(sparks.points);

  const rca = makePanel(kit, 3.1, 1.95, (x, W, H) => {
    drawFrame(x, W, H, "rgba(230,220,200,.45)");
    x.fillStyle = "#8a877f"; x.font = `600 ${W * 0.032}px ${MONO}`; x.fillText("ROOT CAUSE ANALYSIS", W * 0.06, H * 0.14);
    x.fillStyle = "#ece8df"; x.font = `600 ${W * 0.05}px ${MONO}`; x.fillText("DB POOL EXHAUSTED", W * 0.06, H * 0.34);
    x.fillStyle = "#b2aea6"; x.font = `400 ${W * 0.034}px ${MONO}`; x.fillText("api-5xx-spike  ·  3 services", W * 0.06, H * 0.48);
    x.fillStyle = "#8a877f"; x.font = `600 ${W * 0.03}px ${MONO}`; x.fillText("CONFIDENCE", W * 0.06, H * 0.64);
    x.fillStyle = "rgba(230,220,200,.15)"; x.fillRect(W * 0.06, H * 0.7, W * 0.88, H * 0.05);
    x.fillStyle = "#e6dcc8"; x.fillRect(W * 0.06, H * 0.7, W * 0.88 * 0.94, H * 0.05);
    x.fillStyle = "#ece8df"; x.font = `600 ${W * 0.034}px ${MONO}`; x.fillText("94%", W * 0.84, H * 0.64);
    x.fillStyle = "#8a877f"; x.font = `400 ${W * 0.03}px ${MONO}`; x.fillText("FIX  restart pool · scale +2   [ APPROVE ]", W * 0.06, H * 0.92);
  });
  rca.position.set(-3.4, 2.5, 1.6); rca.rotation.set(-0.35, 0.3, 0); g.add(rca);
  const rcaMat = rca.material as THREE.MeshBasicMaterial; rcaMat.opacity = 0;

  const tgt = new THREE.Vector3(svc[SICK].x, 0.3, svc[SICK].z);
  tick.push((t, dt) => {
    const c = (t % 10) / 10;
    const alert = c < 0.3 ? 0 : c < 0.42 ? smooth(0.3, 0.42, c) : c < 0.78 ? 1 : 1 - smooth(0.78, 0.9, c);
    const scanning = c > 0.45 && c < 0.8;
    (sickMat as THREE.MeshBasicMaterial).color.setRGB(
      THREE.MathUtils.lerp(CREAM.r * 1.3, red.r * 2.2, alert), THREE.MathUtils.lerp(CREAM.g * 1.3, red.g * 2.2, alert), THREE.MathUtils.lerp(CREAM.b * 1.3, red.b * 2.2, alert));
    redMat.opacity = alert * 0.75;
    traceMats.forEach((m) => (m.opacity = scanning ? 0.55 + Math.sin(t * 10) * 0.2 : 0));
    const pp = (t * 1.1) % 1;
    pingMat.opacity = alert > 0.05 ? (1 - pp) * 0.75 * alert : 0; ping.scale.setScalar(1 + pp * 2.2);
    beamMat.opacity = scanning ? 0.45 + Math.sin(t * 28) * 0.12 : 0; beam.visible = scanning;
    if (scanning) {
      const from = core.position, len = from.distanceTo(tgt);
      beam.position.copy(from).add(tgt).multiplyScalar(0.5); beam.scale.set(1, len, 1);
      beam.quaternion.setFromUnitVectors(_v.set(0, 1, 0), tgt.clone().sub(from).normalize());
    }
    if (alert > 0.5 && Math.random() < dt * 8) sparks.burst(_v.set(svc[SICK].x + (Math.random() - 0.5) * 0.4, 0.3, svc[SICK].z + (Math.random() - 0.5) * 0.4), 3, 0.8);
    sparks.update(dt);
    const vis = smooth(0.52, 0.6, c) * (1 - smooth(0.82, 0.9, c));
    rcaMat.opacity = vis; rca.visible = vis > 0.01; rca.position.y = 2.5 + Math.sin(t * 1.1) * 0.05 - (1 - vis) * 0.3;
    core.rotation.y = t * 0.5; core.position.y = 3.1 + Math.sin(t * 1.1) * 0.06;
    inner.scale.setScalar(1 + Math.sin(t * 3) * 0.08 + (scanning ? 0.25 : 0));
    ring.rotation.set(Math.PI / 2 + Math.sin(t * 0.4) * 0.25, t * 0.35, 0);
    pkts.forEach((m) => {
      const l = m.userData.l as { path: ReturnType<typeof makePath>; bad: boolean };
      const u = (t * 0.22 + m.userData.o) % 1;
      l.path.at(u, m.position); m.position.y = 0.06; m.scale.setScalar(smooth(0, 0.08, u) * (1 - smooth(0.92, 1, u)));
      m.visible = !(l.bad && alert > 0.6 && Math.floor(t * 4) % 2 === 0);
    });
    fill.color.copy(accent).lerp(red, alert * 0.8); key.color.copy(CREAM).lerp(red, alert * 0.25);
  });
}

/* ───────────────────────────── QuestionForge: validation gate ───────────────────────────── */
export function buildPipeline({ kit, root, accent, tick, fill }: Ctx) {
  const g = new THREE.Group(); root.add(g);
  const L = 10;
  const rail = slab(kit, L, 0.1, 1.3); rail.position.y = 0.05; g.add(rail);
  const center = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(L - 0.4, 0.012, 0.022)), kit.glow(CREAM, 1.1, 0.8)); center.position.set(0, 0.106, 0); g.add(center);
  const ticks: THREE.Vector3[] = [];
  for (let i = 0; i <= 20; i++) { const x = -L / 2 + 0.2 + (i * (L - 0.4)) / 20; ticks.push(new THREE.Vector3(x, 0.104, 0.5), new THREE.Vector3(x, 0.104, 0.6)); }
  g.add(lines(kit, ticks, CREAM, 0.3));
  const floor = makeFloor(kit, 13); floor.position.y = -0.01; g.add(floor);

  // gate frame (opening faces the flow, along x)
  const gate = new THREE.Group(); g.add(gate);
  const frameMat = kit.chrome;
  const post = (z: number) => { const m = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(0.1, 2.5, 0.1, 3, 0.02)), frameMat); m.position.set(0, 1.35, z); gate.add(m); };
  post(-0.95); post(0.95);
  const top = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(0.14, 0.12, 2.1, 3, 0.03)), frameMat); top.position.set(0, 2.6, 0); gate.add(top);
  const edge = kit.mat(new THREE.MeshBasicMaterial({ color: accent.clone().lerp(CREAM, 0.45).multiplyScalar(2.2), toneMapped: false }));
  const strip = (z: number) => { const m = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.02, 2.45, 0.02)), edge); m.position.set(0.055, 1.35, z); gate.add(m); };
  strip(-0.95); strip(0.95);
  const topStrip = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.02, 0.02, 1.9)), edge); topStrip.position.set(0.055, 2.55, 0); gate.add(topStrip);
  const veil = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(1.9, 2.4)), kit.mat(new THREE.MeshBasicMaterial({ color: accent.clone().lerp(CREAM, 0.5).multiplyScalar(1.6), transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
  veil.rotation.y = Math.PI / 2; veil.position.set(0, 1.35, 0); gate.add(veil);
  const scan = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.02, 0.025, 1.9)), kit.glow(CREAM, 3.2)); scan.position.set(0, 1, 0); gate.add(scan);
  const scanTrail = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(1.9, 0.5)), kit.mat(new THREE.MeshBasicMaterial({ color: CREAM.clone().multiplyScalar(2), transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
  scanTrail.rotation.y = Math.PI / 2; gate.add(scanTrail);

  // stage labels along the rail
  [["GENERATE", -3.4], ["VALIDATE", 0], ["APPROVE", 3.4]].forEach(([s, x]) => {
    const m = textPlane(kit, s as string, 1.5, 0.2, s === "VALIDATE" ? "#e6dcc8" : "#8a877f"); m.position.set((x as number) - 0.65, 0.108, 0.88); g.add(m);
  });

  // documents
  const texU = cardTexture(kit, false, accent), texV = cardTexture(kit, true, accent);
  const body = kit.geo(new RoundedBoxGeometry(0.92, 1.28, 0.03, 3, 0.03)), face = kit.geo(new THREE.PlaneGeometry(0.9, 1.25));
  const N = 6;
  const docs = Array.from({ length: N }, () => {
    const d = new THREE.Group();
    d.add(new THREE.Mesh(body, kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x15140f, metalness: 0.7, roughness: 0.35 }))));
    const f = new THREE.Mesh(face, kit.mat(new THREE.MeshBasicMaterial({ map: texU, toneMapped: false }))); f.position.z = 0.017; d.add(f);
    const vm = kit.mat(new THREE.MeshBasicMaterial({ map: texV, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    const f2 = new THREE.Mesh(face, vm); f2.position.z = 0.0175; d.add(f2);
    const b = new THREE.Mesh(face, kit.dark); b.position.z = -0.017; b.rotation.y = Math.PI; d.add(b);
    g.add(d);
    return { d, vm, passed: false };
  });
  const sparks = makeSparks(kit, accent.clone().lerp(CREAM, 0.5), 160, 0.04, 0.5); g.add(sparks.points);
  let flash = 0;
  const speed = 0.085;
  tick.push((t, dt) => {
    docs.forEach((o, i) => {
      const p = (t * speed + i / N) % 1;
      const x = -L / 2 + 0.4 + p * (L - 0.8);
      const lift = 0.95 + Math.sin(t * 0.9 + i * 1.7) * 0.04;
      o.d.position.set(x, lift + 0.64, 0);
      o.d.rotation.y = 0.55 - smooth(-0.6, 0.6, x) * 0.2;
      const v = smooth(-0.35, 0.35, x);
      o.vm.opacity = v;
      const edgeFade = smooth(-L / 2 + 0.2, -L / 2 + 1.1, x) * (1 - smooth(L / 2 - 1.1, L / 2 - 0.2, x));
      o.d.scale.setScalar(0.4 + 0.6 * edgeFade);
      const crossed = x > 0;
      if (crossed && !o.passed) { o.passed = true; flash = 1; sparks.burst(_v.set(x, 1.3, 0), 18, 1.2); }
      if (x < -L / 2 + 1.5) o.passed = false;
    });
    flash = Math.max(0, flash - dt * 2.2);
    scan.position.y = 0.2 + (0.5 + 0.5 * Math.sin(t * 1.6)) * 2.3; scanTrail.position.y = scan.position.y - 0.25;
    (veil.material as THREE.MeshBasicMaterial).opacity = 0.05 + flash * 0.14;
    edge.color.copy(accent).lerp(CREAM, 0.45).multiplyScalar(2.2 + flash * 2);
    fill.intensity = 40 + flash * 25;
    sparks.update(dt);
  });
}
