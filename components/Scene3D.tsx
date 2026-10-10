"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Kit, makeAgent, makeForge, makeGlowPool, makeRack, makeSparks, type Model } from "./three-models";

export type SceneVariant = "arena" | "incident" | "forge" | "hub";
type Props = { variant: SceneVariant; accent?: string; focus?: number; className?: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Procedural three.js scenes: no model files, textures drawn on canvas, env reflections + bloom. */
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
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const kit = new Kit();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.028);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.6, 10.5);
    const col = new THREE.Color(accent);

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const key = new THREE.PointLight(col, 90, 24, 1.6);
    key.position.set(3, 5, 5);
    const rim = new THREE.PointLight(0xffffff, 55, 24, 1.6);
    rim.position.set(-5, 3, -3);
    const fill = new THREE.PointLight(col, 40, 18, 1.8);
    fill.position.set(-4, 0.5, 4);
    scene.add(key, rim, fill);

    const root = new THREE.Group();
    scene.add(root);

    // dust
    const dustN = 320, dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) { dustPos[i * 3] = rand(-14, 14); dustPos[i * 3 + 1] = rand(-4, 9); dustPos[i * 3 + 2] = rand(-12, 4); }
    const dustGeo = kit.geo(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, kit.mat(new THREE.PointsMaterial({ size: 0.035, color: 0x9a9a9a, transparent: true, opacity: 0.6, depthWrite: false })));
    scene.add(dust);

    const tick: ((t: number, dt: number) => void)[] = [];
    const models: Model[] = [];
    const add = <M extends Model>(m: M, parent: THREE.Object3D = root) => { parent.add(m.group); models.push(m); return m; };

    if (variant === "arena") {
      const pink = new THREE.Color(accent), ice = new THREE.Color("#8fd0ff");
      root.position.y = -1.2;
      const plat = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(3.6, 3.85, 0.22, 96)), kit.dark);
      root.add(plat);
      const edge = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(3.6, 0.025, 8, 128)), kit.glow(pink, 2.4));
      edge.rotation.x = Math.PI / 2; edge.position.y = 0.12; root.add(edge);
      const inner = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(2.2, 0.012, 8, 128)), kit.glow("#ffffff", 1.2, 0.5));
      inner.rotation.x = Math.PI / 2; inner.position.y = 0.12; root.add(inner);
      const mid = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(0.02, 5.2)), kit.glow("#ffffff", 1.2, 0.4));
      mid.rotation.x = -Math.PI / 2; mid.position.y = 0.12; root.add(mid);
      const pool = makeGlowPool(kit, pink, 5.5); pool.position.y = 0.14; root.add(pool);

      const A = add(makeAgent(kit, pink, 0)), B = add(makeAgent(kit, ice, 1.7));
      A.group.position.set(-2.2, 1.5, 0); A.group.rotation.y = Math.PI / 2; A.group.scale.setScalar(1.25);
      B.group.position.set(2.2, 1.5, 0); B.group.rotation.y = -Math.PI / 2; B.group.scale.setScalar(1.25);

      const orb = new THREE.Group(); orb.position.set(0, 1.7, 0); root.add(orb);
      const orbCore = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.2, 2)), kit.glow("#ffffff", 3));
      const orbWire = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.34, 1)), kit.mat(new THREE.MeshBasicMaterial({ color: pink.clone().multiplyScalar(2.5), wireframe: true, toneMapped: false })));
      orb.add(orbCore, orbWire);
      const mkBeam = (c: THREE.Color) => {
        const m = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.025, 0.025, 1, 8)), kit.mat(new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(2.6), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
        m.rotation.z = Math.PI / 2; root.add(m); return m;
      };
      const bA = mkBeam(pink), bB = mkBeam(ice);
      const rings = [0, 1].map(() => {
        const r = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.4, 0.012, 8, 64)), kit.mat(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false })));
        r.rotation.y = Math.PI / 2; orb.add(r); return r;
      });
      const sparks = makeSparks(kit, "#ffd2e6", 200, 0.055, 3); root.add(sparks.points);
      // scoreboard
      const barA = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.34, 1, 0.34)), kit.glow(pink, 2.2));
      const barB = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.34, 1, 0.34)), kit.glow(ice, 2.2));
      barA.position.set(-0.5, 3.6, -0.6); barB.position.set(0.5, 3.6, -0.6); root.add(barA, barB);
      const plinth = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(1.7, 0.06, 0.6)), kit.chrome); plinth.position.set(0, 3.1, -0.6); root.add(plinth);
      let last = -1;
      tick.push((t, dt) => {
        const lunge = Math.max(0, Math.sin(t * 1.4));
        A.group.position.x = -2.2 + lunge * 0.5; B.group.position.x = 2.2 - lunge * 0.5;
        const len = 4.4 - lunge;
        const x1 = -2.2 + lunge * 0.5 + 0.35, x2 = 2.2 - lunge * 0.5 - 0.35;
        [[bA, x1], [bB, x2]].forEach(([b, x]) => { const m = b as THREE.Mesh; const cx = ((x as number) + 0) / 2; m.position.set(cx, 1.7 + Math.sin(t * 40) * 0.01, 0); m.scale.set(1, Math.abs(x as number), 1); m.visible = lunge > 0.15; });
        void len;
        orb.rotation.y = t; orb.rotation.x = t * 0.6;
        const clash = Math.sin(t * 1.4);
        orb.scale.setScalar(1 + Math.max(0, clash) * 0.8 + Math.sin(t * 12) * 0.05);
        const cyc = Math.floor(t * 1.4 / Math.PI);
        if (clash > 0.95 && cyc !== last) { last = cyc; sparks.burst(new THREE.Vector3(0, 1.7, 0), 70, 3.4); }
        rings.forEach((r, i) => { const k = ((t * 0.7 + i * 0.5) % 1); r.scale.setScalar(1 + k * 5); (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.4 * Math.max(0.2, lunge); });
        sparks.update(dt);
        const sa = 1.4 + Math.sin(t * 0.7) * 0.9, sb = 1.4 - Math.sin(t * 0.7) * 0.9;
        barA.scale.y = sa; barA.position.y = 3.13 + sa / 2; barB.scale.y = sb; barB.position.y = 3.13 + sb / 2;
        key.color.copy(pink).lerp(ice, (Math.sin(t * 0.7) + 1) / 2);
      });
    }

    if (variant === "incident") {
      root.position.y = -1.9;
      const pool = makeGlowPool(kit, col, 6); pool.position.y = 0.02; root.add(pool);
      const rack = add(makeRack(kit, col));
      const red = new THREE.Color("#ff3b4e");
      tick.push(() => {
        const a = rack.state?.alert ?? 0;
        fill.color.copy(col).lerp(red, a);
        key.color.copy(col).lerp(red, a * 0.6);
      });
    }

    if (variant === "forge") {
      root.position.y = -1.2;
      const pool = makeGlowPool(kit, "#ffa24d", 5); pool.position.y = -0.27; root.add(pool);
      const forge = add(makeForge(kit, col));
      forge.group.scale.setScalar(1.15);
      let k = 0;
      tick.push((t) => { k = Math.max(0, Math.sin(t * 0.9 * Math.PI)); fill.color.set("#ffa24d").lerp(col, 0.5); fill.intensity = 40 + k * 20; });
    }

    if (variant === "hub") {
      const defs = [
        { c: new THREE.Color("#ff4d8d"), build: () => { const m = makeAgent(kit, "#ff4d8d"); m.group.position.y = 1.4; return { m, s: 0.62 }; } },
        { c: new THREE.Color("#2fe0a1"), build: () => ({ m: makeRack(kit, "#2fe0a1"), s: 0.6 }) },
        { c: new THREE.Color("#6d8bff"), build: () => ({ m: makeForge(kit, "#6d8bff"), s: 0.82 }) },
      ];
      root.position.y = -0.4;
      const slots = defs.map((d, i) => {
        const slot = new THREE.Group();
        const { m, s } = d.build();
        models.push(m);
        m.group.scale.multiplyScalar(s);
        if (i === 0) m.group.position.y *= s; else m.group.position.y = 0;
        slot.add(m.group);
        const ped = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(1.5, 1.65, 0.1, 64)), kit.dark);
        ped.position.y = -0.1; slot.add(ped);
        const rim = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(1.5, 0.014, 8, 64)), kit.glow(d.c, 2.2));
        rim.rotation.x = Math.PI / 2; rim.position.y = -0.04; slot.add(rim);
        const pool = makeGlowPool(kit, d.c, 2.6); pool.position.y = -0.03; slot.add(pool);
        slot.userData.base = (i / 3) * Math.PI * 2;
        root.add(slot);
        return slot;
      });
      const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(1, 0.004, 8, 200)), kit.glow("#ffffff", 0.8, 0.35));
      ring.rotation.x = Math.PI / 2; ring.scale.set(3.7, 2.4, 1); ring.position.set(0, -0.12, -0.5); root.add(ring);
      let spin = 0;
      const one = new THREE.Vector3();
      tick.push((t, dt) => {
        const f = focusRef.current;
        if (f >= 0) {
          const target = -slots[f].userData.base;
          const d = ((target - spin + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          spin += d * Math.min(1, dt * 3);
        } else spin += dt * 0.18;
        slots.forEach((g, i) => {
          const a = g.userData.base + spin;
          g.position.set(Math.sin(a) * 3.7, 0, Math.cos(a) * 2.4 - 0.5);
          g.rotation.y = -a * 0.35 + Math.sin(t * 0.5 + i) * 0.1;
          const sc = f === i ? 1.22 : 1;
          g.scale.lerp(one.set(sc, sc, sc), 0.1);
        });
      });
    }

    // composer + bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.5, 0.95);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const size = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      camera.aspect = w / h;
      const wide = w / h > 1.3;
      camera.position.z = wide ? 10.5 : 15;
      camera.fov = wide ? 38 : 42;
      root.position.x = wide ? (variant === "hub" ? 3.0 : variant === "arena" ? 2.7 : 3.0) : 0;
      root.scale.setScalar(variant === "arena" ? 0.76 : variant === "forge" ? 0.9 : 1);
      camera.updateProjectionMatrix();
    };
    const baseY = root.position.y;
    size();
    root.position.y = baseY + (el.clientWidth / (el.clientHeight || 1) > 1.3 ? 0 : 2.4);
    const ro = new ResizeObserver(() => { size(); root.position.y = baseY + (el.clientWidth / (el.clientHeight || 1) > 1.3 ? 0 : 2.4); });
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", move);

    let visible = true, raf = 0, last = performance.now(), time = variant === "forge" ? 2 : 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const d = reduce ? 0 : dt;
      time += d;
      tick.forEach((f) => f(time, d));
      models.forEach((m) => m.update(time, d));
      const sway = variant === "hub" ? 0 : Math.sin(time * 0.35) * 0.22;
      root.rotation.y += ((variant === "hub" ? 0 : -0.35 + sway + mouse.x * 0.35) - root.rotation.y) * 0.05;
      root.rotation.x += ((mouse.y * 0.06) - root.rotation.x) * 0.05;
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (1.6 - mouse.y * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.8, 0);
      dust.rotation.y = time * 0.015;
      composer.render();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      kit.dispose();
      envRT.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, accent]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
