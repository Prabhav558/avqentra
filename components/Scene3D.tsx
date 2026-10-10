"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Kit, MONO, drawFrame, makeAgent, makeContactShadow, makeFloor, makeForge, makeGlowPool, makePanel, makeRack, makeSparks, type Model } from "./three-models";

export type SceneVariant = "arena" | "incident" | "forge" | "mark";
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
    const cleanups: (() => void)[] = [];
    const models: Model[] = [];
    const add = <M extends Model>(m: M, parent: THREE.Object3D = root) => { parent.add(m.group); models.push(m); return m; };

    if (variant === "arena") {
      const pink = new THREE.Color(accent), ice = new THREE.Color("#8fd0ff");
      root.position.y = -0.55;
      const plat = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(3.6, 3.85, 0.22, 96)), kit.mat(new THREE.MeshPhysicalMaterial({ color: 0x15161a, metalness: 0.8, roughness: 0.5 })));
      root.add(plat);
      const edge = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(3.6, 0.025, 8, 128)), kit.glow(pink, 2.4));
      edge.rotation.x = Math.PI / 2; edge.position.y = 0.12; root.add(edge);
      const inner = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(2.2, 0.012, 8, 128)), kit.glow("#ffffff", 1.2, 0.5));
      inner.rotation.x = Math.PI / 2; inner.position.y = 0.12; root.add(inner);
      const mid = new THREE.Mesh(kit.geo(new THREE.PlaneGeometry(0.02, 5.2)), kit.glow("#ffffff", 1.2, 0.4));
      mid.rotation.x = -Math.PI / 2; mid.position.y = 0.12; root.add(mid);
      const pool = makeGlowPool(kit, pink, 5.5); pool.position.y = 0.14; root.add(pool);
      const floor = makeFloor(kit, 13); floor.position.y = -0.115; root.add(floor);
      const shA = makeContactShadow(kit, 1.1, 0.7), shB = makeContactShadow(kit, 1.1, 0.7);
      shA.position.y = shB.position.y = 0.125; root.add(shA, shB);
      const board = makePanel(kit, 3.3, 3.3, (x, W, H) => {
        drawFrame(x, W, H);
        x.fillStyle = "#8a877f"; x.font = `600 ${W * 0.034}px ${MONO}`; x.fillText("TASK 07  ·  REASONING", W * 0.07, H * 0.1);
        x.strokeStyle = "rgba(230,220,200,.12)"; x.lineWidth = 2;
        for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(W * 0.07, H * (0.16 + i * 0.13)); x.lineTo(W * 0.93, H * (0.16 + i * 0.13)); x.stroke(); }
        x.fillStyle = "#ece8df"; x.font = `600 ${W * 0.04}px ${MONO}`;
        x.fillText("A", W * 0.27, H * 0.93); x.fillText("B", W * 0.67, H * 0.93);
      });
      board.position.set(0, 4.25, -0.95); root.add(board);

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
      barA.position.set(-0.55, 3.6, -0.7); barB.position.set(0.55, 3.6, -0.7); root.add(barA, barB);
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
        shA.position.x = A.group.position.x; shB.position.x = B.group.position.x;
        const sh = 1 + Math.sin(t * 1.7) * 0.08; shA.scale.setScalar(sh); shB.scale.setScalar(sh);
      });
    }

    if (variant === "incident") {
      root.position.y = -1.9;
      const pool = makeGlowPool(kit, col, 6); pool.position.y = 0.02; root.add(pool);
      const rack = add(makeRack(kit, col));
      const red = new THREE.Color("#ff3b4e");
      const floor = makeFloor(kit, 12); floor.position.y = -0.065; root.add(floor);
      const rca = makePanel(kit, 3.1, 1.95, (x, W, H) => {
        drawFrame(x, W, H, "rgba(230,220,200,.45)");
        x.fillStyle = "#8a877f"; x.font = `600 ${W * 0.032}px ${MONO}`; x.fillText("ROOT CAUSE ANALYSIS", W * 0.06, H * 0.14);
        x.fillStyle = "#ece8df"; x.font = `600 ${W * 0.05}px ${MONO}`; x.fillText("DB POOL EXHAUSTED", W * 0.06, H * 0.34);
        x.fillStyle = "#b2aea6"; x.font = `400 ${W * 0.034}px ${MONO}`;
        x.fillText("api-5xx-spike  ·  3 services", W * 0.06, H * 0.48);
        x.fillStyle = "#8a877f"; x.font = `600 ${W * 0.03}px ${MONO}`; x.fillText("CONFIDENCE", W * 0.06, H * 0.64);
        x.fillStyle = "rgba(230,220,200,.15)"; x.fillRect(W * 0.06, H * 0.7, W * 0.88, H * 0.05);
        x.fillStyle = "#e6dcc8"; x.fillRect(W * 0.06, H * 0.7, W * 0.88 * 0.94, H * 0.05);
        x.fillStyle = "#ece8df"; x.font = `600 ${W * 0.034}px ${MONO}`; x.fillText("94%", W * 0.84, H * 0.64);
        x.fillStyle = "#8a877f"; x.font = `400 ${W * 0.03}px ${MONO}`; x.fillText("FIX  restart pool · scale +2   [ APPROVE ]", W * 0.06, H * 0.92);
      });
      rca.position.set(-2.7, 3.0, 1.2); rca.rotation.y = 0.45; root.add(rca);
      const rcaMat = rca.material as THREE.MeshBasicMaterial; rcaMat.opacity = 0;
      const sm = (a: number, b: number, v: number) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
      tick.push((t) => {
        const ph = rack.state?.phase ?? 0;
        const vis = sm(0.55, 0.62, ph) * (1 - sm(0.82, 0.9, ph));
        rcaMat.opacity = vis; rca.visible = vis > 0.01;
        rca.position.y = 3.0 + Math.sin(t * 1.1) * 0.06 + (1 - vis) * -0.25;
      });
      tick.push(() => {
        const a = rack.state?.alert ?? 0;
        fill.color.copy(col).lerp(red, a);
        key.color.copy(col).lerp(red, a * 0.6);
      });
    }

    if (variant === "forge") {
      root.position.y = -1.2;
      const floor = makeFloor(kit, 12); floor.position.y = -0.285; root.add(floor);
      const pool = makeGlowPool(kit, "#ffa24d", 5); pool.position.y = -0.27; root.add(pool);
      const forge = add(makeForge(kit, col));
      forge.group.scale.setScalar(1.15);
      let k = 0;
      tick.push((t) => { k = Math.max(0, Math.sin(t * 0.9 * Math.PI)); fill.color.set("#ffa24d").lerp(col, 0.5); fill.intensity = 40 + k * 20; });
    }

    if (variant === "mark") {
      // IDEAS → TOOLS: a particle cloud that condenses into the Avqentra mark, then disperses.
      const cream = new THREE.Color(accent), bright = new THREE.Color("#fff1cf"), dim = new THREE.Color("#8a8166");
      root.position.y = 1.7;
      key.intensity = 60; fill.intensity = 20;
      const COUNT = 26000;
      const seed = new Float32Array(COUNT * 4), tgt = new Float32Array(COUNT * 3), zero = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
        const r = 2 + Math.random() * 2, a = Math.random() * 6.283, y = rand(-1.6, 1.6);
        tgt.set([Math.cos(a) * r, y, Math.sin(a) * r * 0.6], i * 3);
      }
      const geo = kit.geo(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(zero, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
      const tAttr = new THREE.BufferAttribute(tgt, 3);
      geo.setAttribute("aTarget", tAttr);
      const mat = kit.mat(new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 }, uMix: { value: 0 }, uScale: { value: 500 }, uSweep: { value: -9 },
          uPointer: { value: new THREE.Vector3(99, 99, 0) },
          uBright: { value: bright }, uDim: { value: dim }, uCream: { value: cream },
        },
        vertexShader: `
          attribute vec4 aSeed; attribute vec3 aTarget;
          uniform float uTime, uMix, uScale, uSweep; uniform vec3 uPointer;
          varying float vH; varying float vBand;
          void main() {
            vec4 s = aSeed;
            float a = s.x * 6.2831 + uTime * (0.12 + s.y * 0.28);
            float r = 1.6 + s.z * 3.4;
            vec3 cloud = vec3(cos(a) * r, (s.w - 0.5) * 3.6 + sin(uTime * 0.6 + s.x * 20.0) * 0.25, sin(a) * r * 0.6 - 0.5);
            float m = clamp(uMix * 1.7 - s.y * 0.7, 0.0, 1.0);
            m = m * m * (3.0 - 2.0 * m);
            vec3 tg = aTarget + 0.025 * vec3(sin(uTime * 1.3 + s.x * 40.0), cos(uTime * 1.1 + s.y * 40.0), sin(uTime * 0.9 + s.z * 40.0));
            vec3 p = mix(cloud, tg, m);
            p += (1.0 - abs(2.0 * m - 1.0)) * vec3(sin(s.x * 6.2831), cos(s.z * 6.2831), sin(s.y * 6.2831)) * 0.9;
            vec2 d = p.xy - uPointer.xy;
            float f = exp(-dot(d, d) * 1.4);
            p.xy += normalize(d + 1e-4) * f * 0.5;
            p.z += f * 0.4;
            vBand = exp(-pow((p.x - uSweep) * 1.6, 2.0)) * m;
            vH = m;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float sz = 0.7 + fract(s.x * 37.0) * 1.1;
            gl_PointSize = sz * (0.03 + vBand * 0.012 + f * 0.015) * uScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uBright, uDim, uCream; varying float vH; varying float vBand;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d); a *= a;
            vec3 c = mix(uDim, uCream, vH);
            c += uBright * vBand * 0.55;
            gl_FragColor = vec4(c * (0.9 + vH * 0.6), a * (0.4 + vH * 0.32));
          }`,
      }));
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      root.add(pts);

      let alive = true;
      const img = new Image();
      img.onload = () => {
        if (!alive) return;
        const W = 340, H = Math.max(1, Math.round((W * img.height) / img.width));
        const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
        const g = cv.getContext("2d")!; g.drawImage(img, 0, 0, W, H);
        const d = g.getImageData(0, 0, W, H).data;
        const px: number[] = [];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 110) px.push(x, y);
        if (!px.length) return;
        const sc = 4.8 / W;
        for (let i = 0; i < COUNT; i++) {
          const k = ((Math.random() * px.length) / 2 | 0) * 2;
          tgt[i * 3] = (px[k] - W / 2) * sc + rand(-0.01, 0.01);
          tgt[i * 3 + 1] = -(px[k + 1] - H / 2) * sc + rand(-0.01, 0.01);
          tgt[i * 3 + 2] = rand(-0.3, 0.3);
        }
        tAttr.needsUpdate = true;
      };
      img.src = "/avqentra-mark.png";
      cleanups.push(() => { alive = false; });

      // agent comets that circle the form, shedding sparkles
      const comets = Array.from({ length: 5 }, (_, i) => {
        const m = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.045, 10, 10)), kit.glow(bright, 3));
        root.add(m); return { m, i };
      });
      const sparks = makeSparks(kit, bright, 700, 0.03, -0.05); root.add(sparks.points);
      const ease = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const hw = new THREE.Vector3();
      tick.push((t, dt) => {
        const T = (t + 1) % 15;
        const mix = reduce ? 1 : ease(2.5, 5.5, T) * (1 - ease(11.5, 14, T));
        mat.uniforms.uTime.value = t;
        mat.uniforms.uMix.value = mix;
        mat.uniforms.uScale.value = renderer.domElement.height * 0.5;
        mat.uniforms.uSweep.value = mix > 0.85 ? -3 + (((t * 0.35) % 1.6) / 1.6) * 6 : -9;
        // cursor in root-local space (z≈0 plane)
        const hh = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        hw.set(mouse.x * hh * camera.aspect - root.position.x, -mouse.y * hh - root.position.y, 0);
        (mat.uniforms.uPointer.value as THREE.Vector3).lerp(hw, 1 - Math.exp(-8 * dt));
        comets.forEach(({ m, i }) => {
          const a = t * (0.35 + i * 0.07) + i * 1.26;
          m.position.set(Math.cos(a) * (3.1 + i * 0.18), Math.sin(a * 1.3 + i) * (1.5 + i * 0.1), Math.sin(a) * 1.4);
          if (!reduce) sparks.burst(m.position, 1, 0.12);
        });
        sparks.update(dt);
      });
    }

    // composer + bloom
    const msaa = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(renderer, msaa);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), variant === "mark" ? 0.32 : 0.4, 0.5, 0.95);
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
      root.position.x = wide ? (variant === "arena" ? 2.7 : variant === "mark" ? 3.3 : 3.0) : 0;
      baseScale = variant === "arena" ? 0.76 : variant === "forge" ? 0.9 : variant === "mark" ? 0.8 : 1;
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
      root.rotation.y = damp(root.rotation.y, variant === "mark" ? sway * 0.35 + mouse.x * 0.12 : -0.35 + sway + mouse.x * 0.35, 3, dt);
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
      cleanups.forEach((c) => c());
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
