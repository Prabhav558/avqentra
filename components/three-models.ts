import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Model = {
  group: THREE.Group;
  update(t: number, dt: number): void;
  /** 0..1 extra info for the host scene (e.g. incident alert level) */
  state?: { alert: number; phase?: number };
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

const _c = new THREE.Color(), _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3();
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

/* ───────────────────────── QuestionForge: anvil, hammer, question cards ───────────────────────── */
export function cardTexture(kit: Kit, verified: boolean, accent: THREE.Color) {
  const cv = document.createElement("canvas");
  cv.width = 512; cv.height = 704;
  const x = cv.getContext("2d")!;
  x.scale(2, 2);
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
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

/* ───────────────────────── shared scene dressing ───────────────────────── */

/** Soft-edged reflective floor: picks up the environment map, fades to nothing at the rim. */
export function makeFloor(kit: Kit, radius = 11) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const x = cv.getContext("2d")!;
  const g = x.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, "#fff"); g.addColorStop(0.5, "#6a6a6a"); g.addColorStop(1, "#000");
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  const alpha = kit.tex(new THREE.CanvasTexture(cv));
  const m = new THREE.Mesh(
    kit.geo(new THREE.CircleGeometry(radius, 64)),
    kit.mat(new THREE.MeshStandardMaterial({ color: 0x15140f, metalness: 0.7, roughness: 0.62, transparent: true, alphaMap: alpha, depthWrite: false })),
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

/** Dark blurred blob that grounds an object on a surface. */
export function makeContactShadow(kit: Kit, radius = 1.2, strength = 0.6) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const x = cv.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, `rgba(0,0,0,${strength})`); g.addColorStop(0.6, `rgba(0,0,0,${strength * 0.35})`); g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = kit.tex(new THREE.CanvasTexture(cv));
  const m = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(radius * 2, radius * 2)), kit.mat(new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })));
  m.rotation.x = -Math.PI / 2;
  return m;
}

/** Flat HUD-style panel drawn on a canvas (text stays crisp, no font files needed). */
export function makePanel(kit: Kit, w: number, h: number, draw: (x: CanvasRenderingContext2D, W: number, H: number) => void, px = 1024) {
  const cv = document.createElement("canvas");
  cv.width = px; cv.height = Math.round((px * h) / w);
  const x = cv.getContext("2d")!;
  draw(x, cv.width, cv.height);
  const t = kit.tex(new THREE.CanvasTexture(cv));
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const mat = kit.mat(new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
  return new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(w, h)), mat);
}

const MONO = "ui-monospace, Menlo, Consolas, monospace";
export function drawFrame(x: CanvasRenderingContext2D, W: number, H: number, border = "rgba(230,220,200,.35)") {
  x.fillStyle = "rgba(12,12,9,.78)"; x.beginPath(); x.roundRect(2, 2, W - 4, H - 4, 18); x.fill();
  x.strokeStyle = border; x.lineWidth = 3; x.stroke();
}
export { MONO };
