"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Kit, makeAgent, makeForge, makeGlowPool, makeRack, makeSparks, type Model } from "./three-models";

export type SceneVariant = "arena" | "incident" | "forge" | "swarm";
type Props = { variant: SceneVariant; accent?: string; className?: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Procedural three.js scenes: no model files, textures drawn on canvas, env reflections + bloom. */
export default function Scene3D({ variant, accent = "#ffffff", className }: Props) {
  const host = useRef<HTMLDivElement>(null);

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
    const maxDpr = Math.min(window.devicePixelRatio, 1.75);
    let dpr = maxDpr;
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

    if (variant === "swarm") {
      const cream = new THREE.Color(accent);
      root.position.y = 1.0;
      key.color.copy(cream); fill.color.copy(cream); key.intensity = 110;

      // core: glowing mind inside a faceted lattice
      const coreG = new THREE.Group(); root.add(coreG);
      const mind = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.5, 3)), kit.glow(cream, 1.9));
      const lattice = new THREE.LineSegments(kit.geo(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 1))), kit.mat(new THREE.LineBasicMaterial({ color: cream.clone().multiplyScalar(1.6), transparent: true, opacity: 0.8, toneMapped: false })));
      const shell = new THREE.Mesh(kit.geo(new THREE.IcosahedronGeometry(0.9, 1)), kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x1a1812, metalness: 0.9, roughness: 0.25, flatShading: true, transparent: true, opacity: 0.35, side: THREE.DoubleSide })));
      coreG.add(mind, lattice, shell);
      const rings = [1.5, 2.05, 2.6].map((r, i) => {
        const m = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(r, i === 1 ? 0.014 : 0.01, 8, 160)), i === 1 ? kit.chrome : kit.glow(cream, 1.4, 0.7));
        m.rotation.set(0.6 + i * 0.5, i * 0.7, i * 0.3);
        root.add(m); return m;
      });

      // agents orbiting the core
      const N = 16, agents: { m: THREE.Mesh; r: number; sp: number; ph: number; axis: THREE.Vector3; tilt: number; pulse: THREE.Mesh; line: THREE.Line; pos: Float32Array; k: number }[] = [];
      const geos = [kit.geo(new THREE.OctahedronGeometry(1)), kit.geo(new THREE.IcosahedronGeometry(1, 0)), kit.geo(new THREE.TetrahedronGeometry(1.1))];
      const pulseGeo = kit.geo(new THREE.SphereGeometry(0.05, 10, 10));
      const dot = kit.glow(cream, 1.7);
      const SEG = 28;
      for (let i = 0; i < N; i++) {
        const size = rand(0.1, 0.2);
        const m = new THREE.Mesh(geos[i % 3], kit.chrome);
        m.scale.setScalar(size);
        m.add(new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.34, 10, 10)), dot));
        root.add(m);
        const pos = new Float32Array(SEG * 3);
        const lg = kit.geo(new THREE.BufferGeometry());
        lg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const line = new THREE.Line(lg, kit.mat(new THREE.LineBasicMaterial({ color: cream.clone().multiplyScalar(1.5), transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
        line.frustumCulled = false;
        root.add(line);
        const pulse = new THREE.Mesh(pulseGeo, kit.glow(cream, 2));
        root.add(pulse);
        agents.push({ m, r: rand(2.3, 4.3), sp: rand(0.12, 0.34) * (i % 2 ? 1 : -1), ph: rand(0, 6.28), axis: new THREE.Vector3(rand(-1, 1), rand(-0.4, 0.4), rand(-1, 1)).normalize(), tilt: rand(0, 6.28), pulse, line, pos, k: rand(0, 1) });
      }
      const sparks = makeSparks(kit, cream, 160, 0.05, -0.15); root.add(sparks.points);
      const p = new THREE.Vector3(), c = new THREE.Vector3(), q = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
      let nextBurst = 0;
      tick.push((t, dt) => {
        coreG.rotation.y = t * 0.25; coreG.rotation.x = t * 0.12;
        const beat = 1 + Math.sin(t * 2.2) * 0.06 + Math.max(0, Math.sin(t * 0.7)) * 0.12;
        mind.scale.setScalar(beat); lattice.scale.setScalar(1 + (beat - 1) * 0.5);
        rings.forEach((r, i) => { r.rotation.z += dt * (0.12 + i * 0.07) * (i % 2 ? -1 : 1); r.rotation.x += dt * 0.03; });
        agents.forEach((a, i) => {
          const ang = a.ph + t * a.sp;
          p.set(Math.cos(ang) * a.r, Math.sin(ang * 1.7 + a.tilt) * a.r * 0.28, Math.sin(ang) * a.r).applyAxisAngle(a.axis, a.tilt * 0.35);
          a.m.position.copy(p);
          a.m.rotation.x = t * 0.8 + i; a.m.rotation.y = t * 0.6;
          // curved filament core -> agent
          q.copy(p).multiplyScalar(0.5).addScaledVector(up, Math.sin(t * 0.8 + i) * 0.9 + 0.6);
          const pos = a.pos;
          for (let s = 0; s < SEG; s++) {
            const u = s / (SEG - 1), v = 1 - u;
            c.set(0, 0, 0).multiplyScalar(v * v).addScaledVector(q, 2 * v * u).addScaledVector(p, u * u);
            pos[s * 3] = c.x; pos[s * 3 + 1] = c.y; pos[s * 3 + 2] = c.z;
          }
          a.line.geometry.attributes.position.needsUpdate = true;
          // data pulse traveling along the filament (out and back)
          const k = (t * (0.25 + (i % 4) * 0.06) + a.k) % 1;
          const u = i % 2 ? k : 1 - k, v = 1 - u;
          a.pulse.position.set(0, 0, 0).multiplyScalar(v * v).addScaledVector(q, 2 * v * u).addScaledVector(p, u * u);
          a.pulse.scale.setScalar(0.6 + Math.sin(k * Math.PI) * 0.9);
        });
        if (t > nextBurst) { nextBurst = t + 0.35; sparks.burst(c.set(0, 0, 0), 5, 0.9); }
        sparks.update(dt);
      });
    }

    // composer + bloom
    const msaa = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(renderer, msaa);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), variant === "swarm" ? 0.32 : 0.4, 0.5, 0.95);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    let baseScale = 1;
    const size = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      camera.aspect = w / h;
      const wide = w / h > 1.3;
      camera.position.z = wide ? 10.5 : 15;
      camera.fov = wide ? 38 : 42;
      root.position.x = wide ? (variant === "arena" ? 2.7 : variant === "swarm" ? 3.2 : 3.0) : 0;
      baseScale = variant === "arena" ? 0.76 : variant === "forge" ? 0.9 : variant === "swarm" ? 0.62 : 1;
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

    let visible = true, raf = 0, last = performance.now(), time = variant === "forge" ? 2 : 0, age = 0, ema = 1 / 60, frames = 0, cool = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      const raw = Math.max(0, (now - last) / 1000);
      const dt = Math.min(raw, 0.05);
      last = now;
      ema = ema * 0.94 + Math.min(raw, 0.2) * 0.06;
      if (++frames > 90 && --cool < 0) {
        const apply = () => { renderer.setPixelRatio(dpr); composer.setPixelRatio(dpr); composer.setSize(el.clientWidth, el.clientHeight); };
        if (ema > 1 / 42 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); apply(); cool = 90; }
        else if (ema < 1 / 57 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.25); apply(); cool = 240; }
      }
      const d = reduce ? 0 : dt;
      time += d; age += dt;
      tick.forEach((f) => f(time, d));
      models.forEach((m) => m.update(time, d));
      const intro = 1 - Math.pow(1 - Math.min(1, age / 1.8), 3);
      root.scale.setScalar(baseScale * (0.9 + 0.1 * intro));
      const sway = Math.sin(time * 0.35) * 0.22;
      root.rotation.y = damp(root.rotation.y, -0.35 + sway + mouse.x * 0.35, 3, dt);
      root.rotation.x = damp(root.rotation.x, mouse.y * 0.06, 3, dt);
      camera.position.x = damp(camera.position.x, mouse.x * 0.8, 2.5, dt);
      camera.position.y = damp(camera.position.y, 1.6 - mouse.y * 0.6, 2.5, dt);
      camera.lookAt(0, 0.8, 0);
      dust.rotation.y = time * 0.015;
      composer.render();
      if (frames === 2) el.classList.add("ready");
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
      msaa.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, accent]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
