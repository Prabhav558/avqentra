"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneVariant = "arena" | "incident" | "forge" | "hub";

type Props = { variant: SceneVariant; accent?: string; focus?: number; className?: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Lightweight procedural three.js scene: no models or textures, only primitives. */
export default function Scene3D({ variant, accent = "#ffffff", focus = -1, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.045);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);
    const col = new THREE.Color(accent);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.PointLight(col, 60, 30);
    key.position.set(4, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 40, 30);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    const glass = (c: THREE.ColorRepresentation, wire = false) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: 0.85, roughness: 0.22, wireframe: wire, flatShading: true });
    const glow = (c: THREE.ColorRepresentation, o = 1) =>
      new THREE.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o });

    // Starfield dust shared by all scenes
    const dustN = 260;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = rand(-12, 12);
      dustPos[i * 3 + 1] = rand(-7, 7);
      dustPos[i * 3 + 2] = rand(-10, 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.03, color: 0x8a8a8a, transparent: true, opacity: 0.7 }));
    scene.add(dust);

    const tick: ((t: number, dt: number) => void)[] = [];
    const disposables: { dispose(): void }[] = [dustGeo];
    const track = <T extends { dispose(): void }>(o: T) => (disposables.push(o), o);

    if (variant === "arena") {
      // Two rival agents orbiting a scoring core inside a ring
      const ringGeo = track(new THREE.TorusGeometry(3, 0.03, 12, 128));
      const ring = new THREE.Mesh(ringGeo, track(glow(0xffffff, 0.35)));
      ring.rotation.x = Math.PI / 2.4;
      root.add(ring);
      const coreGeo = track(new THREE.IcosahedronGeometry(0.7, 1));
      const core = new THREE.Mesh(coreGeo, track(glass(0x222222)));
      const coreWire = new THREE.Mesh(coreGeo, track(glow(col, 0.6)));
      coreWire.material = track(new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.6 }));
      root.add(core, coreWire);
      const aGeo = track(new THREE.OctahedronGeometry(0.5));
      const bGeo = track(new THREE.BoxGeometry(0.7, 0.7, 0.7));
      const A = new THREE.Mesh(aGeo, track(glass(0xffffff)));
      const B = new THREE.Mesh(bGeo, track(glass(col)));
      root.add(A, B);
      const trailN = 60;
      const mkTrail = (c: THREE.ColorRepresentation) => {
        const g = track(new THREE.BufferGeometry());
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(trailN * 3), 3));
        const l = new THREE.Line(g, track(new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.6 })));
        root.add(l);
        return { g, l, pts: [] as THREE.Vector3[] };
      };
      const tA = mkTrail(0xffffff), tB = mkTrail(col);
      const push = (tr: ReturnType<typeof mkTrail>, v: THREE.Vector3) => {
        tr.pts.unshift(v.clone());
        if (tr.pts.length > trailN) tr.pts.pop();
        const arr = tr.g.attributes.position.array as Float32Array;
        tr.pts.forEach((p, i) => p.toArray(arr, i * 3));
        for (let i = tr.pts.length; i < trailN; i++) tr.pts[tr.pts.length - 1].toArray(arr, i * 3);
        tr.g.attributes.position.needsUpdate = true;
      };
      tick.push((t) => {
        const r = 3 + Math.sin(t * 0.9) * 0.6;
        A.position.set(Math.cos(t * 1.2) * r, Math.sin(t * 1.2) * r * 0.45, Math.sin(t * 1.2) * r * 0.5);
        B.position.set(-Math.cos(t * 1.2 + 0.4) * r, -Math.sin(t * 1.2 + 0.4) * r * 0.45, -Math.sin(t * 1.2 + 0.4) * r * 0.5);
        A.rotation.x = B.rotation.y = t * 1.5;
        A.rotation.y = B.rotation.x = t;
        core.rotation.y = coreWire.rotation.y = t * 0.4;
        const pulse = 1 + Math.max(0, Math.sin(t * 2.2)) * 0.15;
        core.scale.setScalar(pulse);
        coreWire.scale.setScalar(pulse * 1.25);
        push(tA, A.position);
        push(tB, B.position);
      });
    }

    if (variant === "incident") {
      // Service graph: one node fails (red), AI pulse travels in, node heals
      const N = 22;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < N; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
        const th = Math.PI * (1 + Math.sqrt(5)) * i;
        pts.push(new THREE.Vector3(Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi)).multiplyScalar(3));
      }
      const nodeGeo = track(new THREE.SphereGeometry(0.16, 16, 16));
      const nodes = pts.map((p) => {
        const m = new THREE.Mesh(nodeGeo, track(new THREE.MeshBasicMaterial({ color: col })));
        m.position.copy(p);
        root.add(m);
        return m;
      });
      const edges: [number, number][] = [];
      pts.forEach((p, i) => {
        pts.map((q, j) => ({ j, d: p.distanceTo(q) })).filter((o) => o.j > i).sort((a, b) => a.d - b.d).slice(0, 2)
          .forEach((o) => edges.push([i, o.j]));
      });
      const lg = track(new THREE.BufferGeometry().setFromPoints(edges.flatMap(([a, b]) => [pts[a], pts[b]])));
      root.add(new THREE.LineSegments(lg, track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 }))));
      const hub = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.55, 0)), track(glass(0x1a1a1a)));
      const hubW = new THREE.Mesh(hub.geometry, track(new THREE.MeshBasicMaterial({ color: col, wireframe: true })));
      root.add(hub, hubW);
      const red = new THREE.Color("#ff3b4e");
      const sick = 5;
      const ping = new THREE.Mesh(track(new THREE.RingGeometry(0.2, 0.24, 48)), track(new THREE.MeshBasicMaterial({ color: red, transparent: true, side: THREE.DoubleSide })));
      root.add(ping);
      const beam = new THREE.Mesh(track(new THREE.SphereGeometry(0.09, 8, 8)), track(glow(0xffffff)));
      root.add(beam);
      tick.push((t) => {
        root.rotation.y = t * 0.15;
        hub.rotation.x = hubW.rotation.x = t * 0.5;
        hub.rotation.y = hubW.rotation.y = t * 0.7;
        const c = (t % 8) / 8; // 0-0.4 sick, 0.4-0.7 AI travels, 0.7-1 healed
        const m = nodes[sick].material as THREE.MeshBasicMaterial;
        const sickAmt = c < 0.7 ? 1 : Math.max(0, 1 - (c - 0.7) / 0.15);
        m.color.copy(col).lerp(red, sickAmt);
        const s = 1 + sickAmt * (0.6 + Math.sin(t * 8) * 0.4);
        nodes[sick].scale.setScalar(s);
        ping.visible = sickAmt > 0.01;
        ping.position.copy(pts[sick]);
        ping.quaternion.copy(camera.quaternion);
        ping.scale.setScalar(1 + ((t * 1.5) % 1) * 3);
        (ping.material as THREE.MeshBasicMaterial).opacity = (1 - ((t * 1.5) % 1)) * sickAmt;
        beam.visible = c > 0.4 && c < 0.7;
        if (beam.visible) beam.position.copy(new THREE.Vector3()).lerp(pts[sick], (c - 0.4) / 0.3);
      });
    }

    if (variant === "forge") {
      // Questions (cards) drop into a lattice, get verified (flash to accent), forming a block
      const cols = 6, rows = 4, layers = 3;
      const total = cols * rows * layers;
      const geo = track(new THREE.BoxGeometry(0.55, 0.55, 0.55));
      const mat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.3, flatShading: true }));
      const inst = new THREE.InstancedMesh(geo, mat, total);
      root.add(inst);
      const home: THREE.Vector3[] = [];
      for (let z = 0; z < layers; z++) for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++)
        home.push(new THREE.Vector3((x - (cols - 1) / 2) * 0.8, (y - (rows - 1) / 2) * 0.8, (z - (layers - 1) / 2) * 0.8));
      const delay = home.map((h) => (h.x + 2.4) * 0.12 + (h.y + 1.6) * 0.2 + Math.random() * 0.4);
      const start = home.map(() => new THREE.Vector3(rand(-6, 6), rand(4, 9), rand(-4, 4)));
      const o = new THREE.Object3D();
      const c1 = new THREE.Color(0x555555), c2 = col.clone().multiplyScalar(1.6), c3 = new THREE.Color(0xffffff);
      const tmp = new THREE.Color();
      tick.push((t) => {
        const T = t % 9;
        for (let i = 0; i < total; i++) {
          const k = THREE.MathUtils.clamp((T - delay[i]) / 1.4, 0, 1);
          const e = 1 - Math.pow(1 - k, 3);
          o.position.copy(start[i]).lerp(home[i], e);
          o.rotation.set((1 - e) * 3, (1 - e) * 2, 0);
          const out = T > 8 ? (T - 8) : 0;
          o.scale.setScalar(Math.max(0.001, e * (1 - out * 0.9)));
          o.updateMatrix();
          inst.setMatrixAt(i, o.matrix);
          const verified = THREE.MathUtils.clamp((T - delay[i] - 1.4) / 0.6, 0, 1);
          const flash = Math.max(0, 1 - Math.abs((T - delay[i] - 1.7) / 0.35));
          tmp.copy(c1).lerp(c2, verified).lerp(c3, flash);
          inst.setColorAt(i, tmp);
        }
        inst.instanceMatrix.needsUpdate = true;
        if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
        root.rotation.y = t * 0.25;
        root.rotation.x = Math.sin(t * 0.3) * 0.15;
      });
    }

    if (variant === "hub") {
      // Three product objects on an orbit; focus index brings one forward
      const defs = [
        { geo: track(new THREE.OctahedronGeometry(0.9)), c: new THREE.Color("#ff4d8d") },
        { geo: track(new THREE.IcosahedronGeometry(0.9, 0)), c: new THREE.Color("#2fe0a1") },
        { geo: track(new THREE.TorusKnotGeometry(0.6, 0.22, 96, 12)), c: new THREE.Color("#6d8bff") },
      ];
      const items = defs.map((d, i) => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(d.geo, track(glass(d.c))));
        g.add(new THREE.Mesh(d.geo, track(new THREE.MeshBasicMaterial({ color: d.c, wireframe: true, transparent: true, opacity: 0.25 }))));
        g.userData.base = (i / 3) * Math.PI * 2;
        root.add(g);
        return g;
      });
      const ring = new THREE.Mesh(track(new THREE.TorusGeometry(3.2, 0.012, 8, 160)), track(glow(0xffffff, 0.25)));
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
      let spin = 0;
      tick.push((t, dt) => {
        const f = focusRef.current;
        const target = f >= 0 ? -items[f].userData.base : t * 0.2;
        if (f >= 0) {
          const d = ((target - spin + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          spin += d * Math.min(1, dt * 3);
        } else spin += dt * 0.2;
        items.forEach((g, i) => {
          const a = g.userData.base + spin;
          g.position.set(Math.sin(a) * 3.2, Math.sin(t * 0.8 + i) * 0.25, Math.cos(a) * 3.2 - 1.5);
          g.rotation.x = t * 0.5 + i;
          g.rotation.y = t * 0.7;
          const s = f === i ? 1.35 : 1;
          g.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
        });
        ring.position.z = -1.5;
        root.rotation.x = 0.25;
      });
    }

    // Sizing + pointer parallax
    const size = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 12 : 9;
      root.position.x = w / h > 1.3 ? 3 : 0;
      root.position.y = w / h > 1.3 ? 0 : 1.8;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    const mouse = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", move);

    let visible = true, raf = 0, last = performance.now(), time = variant === "forge" ? 5 : 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += reduce ? 0 : dt;
      tick.forEach((f) => f(time, dt));
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (0.6 - mouse.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      dust.rotation.y = time * 0.02;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      disposables.forEach((d) => d.dispose());
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (m) [m].flat().forEach((x) => x.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, accent]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
