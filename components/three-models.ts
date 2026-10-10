import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Model = {
  group: THREE.Group;
  update(t: number, dt: number): void;
  /** 0..1 extra info for the host scene (e.g. incident alert level) */
  state?: { alert: number };
};

/** Tracks every geometry/material/texture so a scene can dispose them in one call. */
export class Kit {
  private items: { dispose(): void }[] = [];
  geo<T extends THREE.BufferGeometry>(g: T): T { this.items.push(g); return g; }
  mat<T extends THREE.Material>(m: T): T { this.items.push(m); return m; }
  tex<T extends THREE.Texture>(t: T): T { this.items.push(t); return t; }
  dispose() { this.items.forEach((i) => i.dispose()); this.items = []; }

  chrome = this.mat(new THREE.MeshPhysicalMaterial({ color: 0xd5d9e0, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08 }));
  dark = this.mat(new THREE.MeshPhysicalMaterial({ color: 0x17181d, metalness: 0.9, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
  steel = this.mat(new THREE.MeshPhysicalMaterial({ color: 0x3a3e46, metalness: 1, roughness: 0.38 }));
  glow(color: THREE.ColorRepresentation, k = 2.4, opacity = 1) {
    return this.mat(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: false, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 }));
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Additive spark particles with gravity; fades to black via vertex colors. */
export function makeSparks(kit: Kit, color: THREE.ColorRepresentation, n = 160, size = 0.05, gravity = 4) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), vel = new Float32Array(n * 3), life = new Float32Array(n);
  const geo = kit.geo(new THREE.BufferGeometry());
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const points = new THREE.Points(geo, kit.mat(new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })));
  points.frustumCulled = false;
  const c = new THREE.Color(color).multiplyScalar(2.5);
  let cursor = 0;
  return {
    points,
    burst(o: THREE.Vector3, count: number, speed = 2.5, up = 1) {
      for (let k = 0; k < count; k++) {
        const i = cursor++ % n;
        pos.set([o.x, o.y, o.z], i * 3);
        const a = Math.random() * Math.PI * 2, e = Math.random() * 1.2;
        const s = speed * (0.4 + Math.random() * 0.8);
        vel.set([Math.cos(a) * Math.cos(e) * s, Math.abs(Math.sin(e)) * s * up + s * 0.3, Math.sin(a) * Math.cos(e) * s], i * 3);
        life[i] = 0.6 + Math.random() * 0.7;
      }
    },
    update(dt: number) {
      for (let i = 0; i < n; i++) {
        if (life[i] <= 0) { col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0; continue; }
        life[i] -= dt;
        vel[i * 3 + 1] -= gravity * dt;
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        const f = Math.max(0, Math.min(1, life[i]));
        col[i * 3] = c.r * f; col[i * 3 + 1] = c.g * f; col[i * 3 + 2] = c.b * f;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    },
  };
}

/** Soft radial light pool, additive, laid on the floor. */
export function makeGlowPool(kit: Kit, color: THREE.ColorRepresentation, radius = 4) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const x = cv.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  const c = new THREE.Color(color);
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  g.addColorStop(0, `rgba(${rgb},0.55)`);
  g.addColorStop(0.5, `rgba(${rgb},0.12)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  const t = kit.tex(new THREE.CanvasTexture(cv));
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(radius * 2, radius * 2)), kit.mat(new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })));
  m.rotation.x = -Math.PI / 2;
  return m;
}

/* ───────────────────────── AgentBattle: hovering robot agent ───────────────────────── */
export function makeAgent(kit: Kit, color: THREE.ColorRepresentation, phase = 0): Model & { hand: THREE.Object3D } {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  const accent = kit.glow(color, 2.6);
  const eyeBase = new THREE.Color(color).multiplyScalar(2.6);
  const eyeMat = kit.mat(new THREE.MeshBasicMaterial({ color: eyeBase.clone(), toneMapped: false }));

  const torso = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.34, 0.42, 10, 28)), kit.dark);
  torso.scale.set(1, 1, 0.82);
  body.add(torso);
  const chestRing = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.3, 0.018, 12, 48)), accent);
  chestRing.position.y = 0.12; chestRing.scale.set(1, 1, 0.8);
  chestRing.rotation.x = Math.PI / 2;
  body.add(chestRing);
  const core = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.075, 16, 16)), accent);
  core.position.set(0, 0.0, 0.29);
  body.add(core);
  const belt = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.36, 0.3, 0.12, 32)), kit.chrome);
  belt.position.y = -0.32;
  body.add(belt);

  const head = new THREE.Group();
  head.position.y = 0.86;
  body.add(head);
  const skull = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.37, 40, 28)), kit.chrome);
  skull.scale.set(1, 0.88, 0.95);
  head.add(skull);
  const visor = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(0.58, 0.22, 0.2, 4, 0.09)), kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x050507, metalness: 0.2, roughness: 0.05, clearcoat: 1 })));
  visor.position.set(0, 0.02, 0.26);
  head.add(visor);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.03, 0.06, 4, 10)), eyeMat);
    eye.position.set(s * 0.12, 0.02, 0.365);
    head.add(eye);
    const ear = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 24)), kit.steel);
    ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.37, 0, 0);
    head.add(ear);
    const earGlow = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.07, 0.012, 8, 24)), accent);
    earGlow.rotation.y = Math.PI / 2; earGlow.position.set(s * 0.425, 0, 0);
    head.add(earGlow);
  }
  const ant = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.01, 0.014, 0.28, 8)), kit.chrome);
  ant.position.y = 0.46; head.add(ant);
  const tip = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.04, 12, 12)), accent);
  tip.position.y = 0.61; head.add(tip);

  const halo = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.58, 0.012, 8, 96)), accent);
  halo.position.y = 1.55; halo.rotation.x = Math.PI / 2.1;
  body.add(halo);

  // floating arms
  let hand!: THREE.Object3D;
  for (const s of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(s * 0.52, 0.28, 0);
    const shoulder = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.13, 20, 20)), kit.chrome);
    const upper = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.06, 0.26, 6, 14)), kit.dark);
    upper.position.y = -0.24;
    const fist = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.1, 20, 20)), kit.chrome);
    fist.position.y = -0.5;
    const band = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.075, 0.01, 8, 24)), accent);
    band.position.y = -0.42; band.rotation.x = Math.PI / 2;
    arm.add(shoulder, upper, fist, band);
    arm.rotation.z = s * 0.25;
    if (s === 1) { arm.rotation.x = -1.2; hand = fist; }
    body.add(arm);
  }

  // thruster
  const flame = new THREE.Mesh(kit.geo(new THREE.ConeGeometry(0.2, 0.7, 28, 1, true)), kit.mat(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2), transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
  flame.position.y = -0.95; flame.rotation.x = Math.PI;
  body.add(flame);
  const cup = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.2, 0.12, 0.14, 24)), kit.steel);
  cup.position.y = -0.64; body.add(cup);

  return {
    group: g, hand,
    update(t) {
      body.position.y = Math.sin(t * 1.7 + phase) * 0.08;
      body.rotation.z = Math.sin(t * 0.9 + phase) * 0.03;
      halo.rotation.z = t * 0.9 + phase;
      head.rotation.y = Math.sin(t * 0.8 + phase) * 0.12;
      chestRing.scale.setScalar(1 + Math.sin(t * 3 + phase) * 0.04);
      flame.scale.set(1, 0.85 + Math.sin(t * 22 + phase) * 0.15, 1);
      eyeMat.color.copy(eyeBase).multiplyScalar(0.75 + Math.sin(t * 2.4 + phase) * 0.25);
    },
  };
}

/* ───────────────────────── DevSick: server rack + AI core ───────────────────────── */
export function makeRack(kit: Kit, color: THREE.ColorRepresentation): Model & { sparks: ReturnType<typeof makeSparks> } {
  const g = new THREE.Group();
  const col = new THREE.Color(color);
  const red = new THREE.Color("#ff3b4e");
  const SLABS = 7, SICK = 3;
  const ok = kit.glow(col, 2.4);
  const sickMat = kit.mat(new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(2.4), toneMapped: false }));
  const slabGeo = kit.geo(new RoundedBoxGeometry(1.6, 0.3, 1.15, 5, 0.05));
  const bayGeo = kit.geo(new RoundedBoxGeometry(0.85, 0.12, 0.03, 3, 0.012));
  const ledGeo = kit.geo(new THREE.BoxGeometry(0.05, 0.05, 0.02));
  const leds: THREE.Mesh[] = [];
  for (let i = 0; i < SLABS; i++) {
    const y = 0.28 + i * 0.35;
    const slab = new THREE.Mesh(slabGeo, kit.dark);
    slab.position.y = y; g.add(slab);
    const bay = new THREE.Mesh(bayGeo, kit.steel);
    bay.position.set(-0.28, y, 0.585); g.add(bay);
    for (let k = 0; k < 4; k++) {
      const led = new THREE.Mesh(ledGeo, i === SICK && k === 0 ? sickMat : ok);
      led.position.set(0.38 + k * 0.1, y + 0.03, 0.585);
      g.add(led); leds.push(led);
    }
    const vent = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.36, 0.012, 0.02)), kit.steel);
    vent.position.set(0.55, y - 0.06, 0.585); g.add(vent);
  }
  for (const [x, z] of [[-0.86, -0.6], [0.86, -0.6], [-0.86, 0.6], [0.86, 0.6]]) {
    const post = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.035, 0.035, 2.75, 12)), kit.chrome);
    post.position.set(x, 1.38, z); g.add(post);
  }
  const base = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(1.5, 1.65, 0.12, 64)), kit.dark);
  base.position.y = 0.0; g.add(base);
  const baseRing = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(1.5, 0.02, 8, 96)), ok);
  baseRing.rotation.x = Math.PI / 2; baseRing.position.y = 0.07; g.add(baseRing);
  const top = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(1.85, 0.08, 1.4, 3, 0.03)), kit.chrome);
  top.position.y = 2.78; g.add(top);

  // alert wash over the failing slab
  const alertMat = kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2), transparent: true, opacity: 0, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending }));
  const alertPlane = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(1.62, 0.32)), alertMat);
  alertPlane.position.set(0, 0.28 + SICK * 0.35, 0.6); g.add(alertPlane);
  const ping = new THREE.Mesh(kit.geo(new THREE.RingGeometry(0.9, 0.93, 64)), kit.mat(new THREE.MeshBasicMaterial({ color: red.clone().multiplyScalar(2), transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false })));
  ping.rotation.x = -Math.PI / 2; ping.position.y = 0.1; g.add(ping);

  // AI core (gyroscope)
  const coreG = new THREE.Group();
  coreG.position.y = 4.0; g.add(coreG);
  const inner = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.26, 2)), kit.glow(col, 2.8));
  const shell = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.5, 1)), kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x111418, metalness: 0.9, roughness: 0.2, flatShading: true, transparent: true, opacity: 0.55 })));
  const wire = new THREE.LineSegments(kit.geo(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.52, 1))), kit.mat(new THREE.LineBasicMaterial({ color: col.clone().multiplyScalar(2), toneMapped: false })));
  const r1 = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.78, 0.018, 8, 96)), kit.chrome);
  const r2 = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.95, 0.012, 8, 96)), ok);
  coreG.add(inner, shell, wire, r1, r2);

  const beamMat = kit.mat(new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(2.4), transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  const beam = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.02, 0.1, 1, 12, 1, true)), beamMat);
  g.add(beam);

  // satellite services + data packets
  const sats: THREE.Vector3[] = [];
  const satGeo = kit.geo(new THREE.OctahedronGeometry(0.13));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const p = new THREE.Vector3(Math.cos(a) * 3, 0.7 + (i % 3) * 0.9, Math.sin(a) * 3);
    sats.push(p);
    const m = new THREE.Mesh(satGeo, kit.chrome); m.position.copy(p); g.add(m);
    const halo = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.2, 0.008, 6, 32)), ok); halo.position.copy(p); halo.userData.s = true; g.add(halo);
  }
  const lineGeo = kit.geo(new THREE.BufferGeometry().setFromPoints(sats.flatMap((p) => [p, new THREE.Vector3(0, 0.28 + (p.y > 1.5 ? 1.4 : 0.7), 0)])));
  g.add(new THREE.LineSegments(lineGeo, kit.mat(new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.22 }))));
  const pktGeo = kit.geo(new THREE.SphereGeometry(0.045, 8, 8));
  const pkts = sats.map((_, i) => { const m = new THREE.Mesh(pktGeo, ok); m.userData.o = i * 0.37; g.add(m); return m; });
  const sparks = makeSparks(kit, "#ff6b7a", 90, 0.045, 2);
  g.add(sparks.points);
  const state = { alert: 0 };
  const sickY = 0.28 + SICK * 0.35;

  return {
    group: g, state, sparks,
    update(t, dt) {
      const c = (t % 10) / 10;
      const alert = c < 0.3 ? 0 : c < 0.45 ? smooth(0.3, 0.45, c) : c < 0.75 ? 1 : 1 - smooth(0.75, 0.88, c);
      state.alert = alert;
      sickMat.color.copy(col).multiplyScalar(2.4).lerp(red.clone().multiplyScalar(2.6), alert);
      alertMat.opacity = alert * (0.18 + Math.sin(t * 9) * 0.1);
      const pp = (t * 1.2) % 1;
      (ping.material as THREE.MeshBasicMaterial).opacity = alert > 0.05 ? (1 - pp) * 0.7 * alert : 0;
      ping.scale.setScalar(1 + pp * 1.2);
      const scanning = c > 0.5 && c < 0.8;
      beamMat.opacity = scanning ? 0.5 + Math.sin(t * 30) * 0.15 : 0;
      beam.visible = scanning;
      if (scanning) {
        const from = new THREE.Vector3(0, 4.0, 0), to = new THREE.Vector3(0, sickY, 0.6);
        beam.position.copy(from).lerp(to, 0.5);
        beam.scale.set(1, from.distanceTo(to), 1);
        beam.rotation.x = Math.atan2(0.6, 4.0 - sickY) * -1;
        beam.scale.x = 1 + Math.sin(t * 20) * 0.2;
      }
      if (alert > 0.5 && Math.random() < dt * 8) sparks.burst(new THREE.Vector3((Math.random() - 0.5) * 1.2, sickY, 0.6), 4, 1.4);
      sparks.update(dt);
      coreG.rotation.y = t * 0.6;
      coreG.position.y = 4.0 + Math.sin(t * 1.2) * 0.1;
      inner.scale.setScalar(1 + Math.sin(t * 3) * 0.08 + (scanning ? 0.2 : 0));
      r1.rotation.set(t * 0.8, 0, 0.5);
      r2.rotation.set(Math.PI / 2 - 0.4, t * 0.5, 0);
      pkts.forEach((m, i) => {
        const k = ((t * 0.35 + m.userData.o) % 1);
        const tgt = new THREE.Vector3(0, 0.28 + (sats[i].y > 1.5 ? 1.4 : 0.7), 0);
        m.position.copy(sats[i]).lerp(tgt, k);
        m.scale.setScalar(Math.sin(k * Math.PI));
      });
      g.children.forEach((ch) => { if (ch.userData.s) ch.rotation.set(Math.PI / 2, 0, t * 0.8); });
      leds.forEach((l, i) => { if (l.material === ok) l.visible = Math.sin(t * (2 + (i % 5)) + i * 7) > -0.55; });
    },
  };
}

/* ───────────────────────── QuestionForge: anvil, hammer, question cards ───────────────────────── */
function cardTexture(kit: Kit, verified: boolean, accent: THREE.Color) {
  const cv = document.createElement("canvas");
  cv.width = 256; cv.height = 352;
  const x = cv.getContext("2d")!;
  const rr = (X: number, Y: number, w: number, h: number, r: number) => { x.beginPath(); x.roundRect(X, Y, w, h, r); };
  x.fillStyle = "#0c0d10"; rr(0, 0, 256, 352, 22); x.fill();
  x.strokeStyle = verified ? `#${accent.getHexString()}` : "#33363d"; x.lineWidth = 4; rr(3, 3, 250, 346, 20); x.stroke();
  x.fillStyle = "#2b2e35"; rr(22, 24, 70, 18, 9); x.fill();
  x.fillStyle = "#e8eaf0"; rr(22, 58, 190, 14, 7); x.fill(); rr(22, 80, 140, 14, 7); x.fill();
  x.fillStyle = "#14161b"; rr(22, 112, 212, 118, 10); x.fill();
  const bars = [[34, 60], [50, 110], [50, 84], [34, 40], [50, 96], [34, 70]];
  bars.forEach(([ox, w], i) => { x.fillStyle = i % 3 === 1 ? `#${accent.getHexString()}99` : "#3d4048"; rr(22 + ox, 124 + i * 17, w, 8, 4); x.fill(); });
  if (verified) {
    x.fillStyle = `#${accent.getHexString()}22`; rr(22, 262, 212, 62, 12); x.fill();
    x.strokeStyle = `#${accent.getHexString()}`; x.lineWidth = 5; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(44, 294); x.lineTo(56, 306); x.lineTo(78, 280); x.stroke();
    x.fillStyle = "#e8eaf0"; x.font = "600 22px ui-monospace, Menlo, monospace"; x.fillText("VALIDATED", 92, 301);
  } else {
    x.strokeStyle = "#4a4e57"; x.lineWidth = 4; x.setLineDash([6, 6]); rr(22, 262, 212, 62, 12); x.stroke(); x.setLineDash([]);
    x.fillStyle = "#6b6f78"; x.font = "600 22px ui-monospace, Menlo, monospace"; x.fillText("PENDING", 62, 301);
  }
  const t = kit.tex(new THREE.CanvasTexture(cv));
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function makeForge(kit: Kit, color: THREE.ColorRepresentation): Model {
  const g = new THREE.Group();
  const accent = new THREE.Color(color);
  const hotColor = new THREE.Color("#ffa24d");

  // anvil: extruded side profile
  const s = new THREE.Shape();
  const pts: [number, number][] = [[-1.95, 0.47], [-1.0, 0.56], [1.05, 0.56], [1.3, 0.56], [1.3, 0.36], [1.02, 0.26], [0.52, 0.14], [0.42, -0.3], [0.85, -0.3], [0.85, -0.56], [-0.85, -0.56], [-0.85, -0.3], [-0.42, -0.3], [-0.52, 0.12], [-1.0, 0.22], [-1.55, 0.3]];
  s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(p[0], p[1])); s.closePath();
  const aGeo = kit.geo(new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 12 }));
  aGeo.translate(0, 0.62, -0.4);
  const anvil = new THREE.Mesh(aGeo, kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x5a5f69, metalness: 1, roughness: 0.24, clearcoat: 0.5 })));
  g.add(anvil);
  const face = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(2.1, 0.03, 0.78, 2, 0.01)), kit.chrome);
  face.position.set(0.02, 1.2, 0); g.add(face);
  const heat = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(1.2, 0.5)), kit.mat(new THREE.MeshBasicMaterial({ color: hotColor.clone().multiplyScalar(2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
  heat.rotation.x = -Math.PI / 2; heat.position.set(0.1, 1.225, 0); g.add(heat);
  const block = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(1.15, 1.3, 0.55, 48)), kit.dark);
  block.position.y = 0.0; g.add(block);
  const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(1.3, 0.02, 8, 96)), kit.glow(accent, 2.2));
  ring.rotation.x = Math.PI / 2; ring.position.y = -0.2; g.add(ring);

  // hammer
  const hammer = new THREE.Group();
  hammer.position.set(1.0, 1.45, 0);
  const handle = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.045, 0.06, 1.7, 14)), kit.mat(new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.7 })));
  handle.position.x = -0.85; handle.rotation.z = Math.PI / 2;
  const headM = new THREE.Mesh(kit.geo(new RoundedBoxGeometry(0.34, 0.36, 0.34, 4, 0.05)), kit.chrome);
  headM.position.x = -1.7;
  hammer.add(handle, headM);
  g.add(hammer);

  // cards
  const texU = cardTexture(kit, false, accent), texV = cardTexture(kit, true, accent);
  const matU = kit.mat(new THREE.MeshBasicMaterial({ map: texU, toneMapped: false })), matV = kit.mat(new THREE.MeshBasicMaterial({ map: texV, toneMapped: false }));
  const bodyGeo = kit.geo(new RoundedBoxGeometry(0.9, 1.25, 0.05, 3, 0.03));
  const faceGeo = kit.geo(new THREE.PlaneGeometry(0.88, 1.21));
  const N = 5;
  const cards = Array.from({ length: N }, () => {
    const c = new THREE.Group();
    c.add(new THREE.Mesh(bodyGeo, kit.dark));
    const f = new THREE.Mesh(faceGeo, matU); f.position.z = 0.027; c.add(f);
    const b = new THREE.Mesh(faceGeo, kit.dark); b.position.z = -0.027; b.rotation.y = Math.PI; c.add(b);
    g.add(c);
    return { c, f, was: false };
  });
  const sparks = makeSparks(kit, hotColor, 220, 0.06, 5);
  g.add(sparks.points);
  let prevU = 0, heatKick = 0;

  return {
    group: g,
    update(t, dt) {
      const speed = 0.18;
      cards.forEach((k, i) => {
        const p = (t * speed + i / N) % 1;
        const x = -2.7 + p * 5.4;
        const near = 1 - smooth(0.0, 1.4, Math.abs(x));
        const y = 2.0 + Math.sin(p * Math.PI * 2 + i) * 0.1 - near * 0.15;
        k.c.position.set(x, y + 0.25, -0.95);
        k.c.rotation.set(0, (1 - near) * (x < 0 ? 0.6 : -0.6) + Math.sin(t + i) * 0.05, 0);
        const verified = p > 0.5;
        k.f.material = verified ? matV : matU;
        const pulse = verified && p < 0.58 ? 1 + (1 - (p - 0.5) / 0.08) * 0.12 : 1;
        k.c.scale.setScalar(pulse * (0.9 + near * 0.1));
      });
      const u = (t * speed * N) % 1;
      const hit = 0.5;
      let ang: number;
      if (u < 0.2) ang = -1.15;
      else if (u < hit) { const d = (u - 0.2) / 0.3; ang = -1.15 * (1 - d * d * d); }
      else ang = -1.15 * smooth(hit, hit + 0.35, u);
      hammer.rotation.z = ang;
      if (prevU < hit && u >= hit) { sparks.burst(new THREE.Vector3(-0.7, 1.25, 0), 46, 3.2); heatKick = 1; }
      prevU = u;
      heatKick = Math.max(0, heatKick - dt * 2.5);
      (heat.material as THREE.MeshBasicMaterial).opacity = heatKick * 0.7;
      sparks.update(dt);
    },
  };
}
