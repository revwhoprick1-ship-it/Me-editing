// INSIDE THE IMPOSSIBLE #1 — "What happens if you swallow chewing gum?" (1080x1920, 30 fps, ~27 s)
// Narration (Kokoro TTS, af_heart) drives everything: shot changes, captions and SFX hang off its word timestamps.
// Shots: hook (Max swallows) → x-ray myth (7 years?) → dive into the mouth → esophagus (peristalsis) → stomach (acid
// dissolves food, not gum) → small intestine (villi absorb sugar/flavour) → large intestine (joins waste) → calendar
// (a few days) → MYTH ✕ → rare blockage warning → Max chewing again (loops).
// Facts: Scientific American "Fact or Fiction?: Chewing Gum Takes Seven Years to Digest"; Duke Health "Myth or fact";
// Milov et al. 1998, Pediatrics 102(2):e22 (gum bezoars in children who swallowed gum habitually). See SCRIPT.md.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../mgFonts';
import {Max, type Face} from './kit/character';
import {Cam, Post, clamp01, gradientTex, lerp, lerp3, noiseTex, prog, ring, shapeTunnel, smoother, tissueMat, useTunnel, type V3} from './kit/three';
import words from './gum.words.json';

const FPS = 30, OFF = 250;
export const GUM_MS = 27000;
const W = (words as {text: string; startMs: number}[]).map((w) => ({t: w.text, at: w.startMs + OFF}));
const at = (word: string, nth = 0) => W.filter((w) => w.t.replace(/[.,!?]/g, '').toLowerCase() === word.toLowerCase())[nth].at;
const T = {
  swallowed: at('swallowed'), gum: at('gum'), people: at('People'), seven: at('seven'), lets: at("Let's"), esoph: at('Your', 1), stomach: at('In', 1),
  rubbery: at('rubbery'), small: at('In', 2), soaks: at('soaks'), but: at('but'), into: at('into'), large: at('large'), joins: at('joins'), within: at('Within'),
  out: at('out'), not: at('Not'), just: at('Just', 1), that: at('That'), blockage: at('blockage'),
};
const S = {hook: 0, myth: T.people, dive: T.lets, eso: T.esoph + 250, sto: T.stomach, si: T.small, li: T.into, days: T.within, bust: T.not, block: T.just, loop: T.blockage + 930, end: GUM_MS};
const SH = [['hook', S.hook], ['myth', S.myth], ['dive', S.dive], ['eso', S.eso], ['sto', S.sto], ['si', S.si], ['li', S.li], ['days', S.days], ['bust', S.bust], ['block', S.block], ['loop', S.loop]] as const;
type ShotId = (typeof SH)[number][0];
const shotAt = (o: number): [ShotId, number, number] => {
  let i = 0; SH.forEach(([, a], j) => { if (o >= a) i = j; });
  return [SH[i][0], SH[i][1], SH[i + 1]?.[1] ?? S.end];
};

// ---- shared bits -----------------------------------------------------------------------------------------------------------
const Studio = ({top = '#c4ecff', bottom = '#2e86d6'}: {top?: string; bottom?: string}) => {
  const bg = useMemo(() => gradientTex(top, bottom), [top, bottom]);
  return <>
    <primitive attach="background" object={bg} />
    <hemisphereLight args={['#ffffff', '#6aa6d8', 0.7]} />
    <directionalLight position={[-2.5, 2.5, 4]} intensity={2.6} color="#fff1e2" />
    <directionalLight position={[3, 1.5, -3]} intensity={3.2} color="#9fe7ff" />
    <pointLight position={[0, -1, 3]} intensity={3} distance={8} color="#ffd9c4" />
  </>;
};
const chewFace = (o: number, a: number): Face => ({jaw: 0.18 + 0.16 * Math.max(0, Math.sin((o - a) / 105)), gum: true, blink: (o - a) % 2600 < 120 ? 1 : 0, smile: 0.2});

// ---- 1 hook / 3 dive / 11 loop: Max in the studio -----------------------------------------------------------------------------
const FaceShot = ({o, kind}: {o: number; kind: 'hook' | 'dive' | 'loop'}) => {
  let face: Face, p: V3, l: V3 = [0, -0.22, 0], fov = 30, focus: V3 = [0, 0.14, 0.8];
  if (kind === 'hook') {
    const g = prog(o, T.swallowed - 60, T.swallowed + 380);
    const wide = smoother(prog(o, T.swallowed + 120, T.swallowed + 380));
    face = o < T.swallowed - 60 ? chewFace(o, 0) : {jaw: 0.05 + 0.25 * wide, gum: false, gulp: Math.sin(g * Math.PI), headTilt: -0.28 * Math.sin(g * Math.PI), eyesWide: wide, brow: wide, lookX: 0, lookY: -0.2 * wide};
    // slow push, then a punch-in on the "uh-oh" face
    const punch = smoother(prog(o, T.swallowed + 150, T.swallowed + 420));
    p = lerp3([0.3, -0.12, 5.4], [0.15, -0.1, 4.9], smoother(prog(o, 0, T.swallowed))); p = lerp3(p, [0.05, 0.0, 3.7], punch); p[0] += 0.015 * Math.sin(o / 300);
  } else if (kind === 'dive') {
    const op = smoother(prog(o, S.dive, S.dive + 300));
    face = {jaw: 0.95 * op, gum: false, eyesWide: 0.4, brow: 0.6};
    const t = smoother(prog(o, S.dive + 150, S.eso));
    p = lerp3([0, -0.15, 4.5], [0, -0.47, 0.95], t); l = lerp3([0, -0.22, 0], [0, -0.5, 0], t); fov = lerp(30, 24, t); focus = lerp3([0, 0.14, 0.8], [0, -0.48, 0.8], t);
  } else {
    face = {...chewFace(o, S.loop), smile: 0.45};
    p = lerp3([0.1, -0.12, 4.5], [0.3, -0.12, 5.4], smoother(prog(o, S.loop, S.end)));
  }
  return <>
    <Studio />
    <Cam p={p} l={l} fov={fov} />
    <Max f={face} />
    <Post focus={focus} bokeh={2.4} bloom={0.35} />
  </>;
};

// ---- 2 x-ray myth -----------------------------------------------------------------------------------------------------------
const XrayShot = ({o}: {o: number}) => {
  const m = useMemo(() => {
    const glow = (c: string, e = 1.6) => new THREE.MeshStandardMaterial({color: c, emissive: new THREE.Color(c), emissiveIntensity: e, transparent: true, opacity: 0.85, roughness: 0.4});
    const coil = new THREE.CatmullRomCurve3(Array.from({length: 40}, (_, i) => { const a = i * 0.9; return new THREE.Vector3(Math.cos(a) * (0.35 + 0.12 * Math.sin(i)), -2.45 - i * 0.012, Math.sin(a) * 0.22 + 0.1); }));
    const eso = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.55, 0.15), new THREE.Vector3(0, -1.2, 0.1), new THREE.Vector3(0.05, -1.85, 0.12)]);
    return {stomach: glow('#ff6f8a', 1.1), gut: glow('#ff9f6a', 0.9), eso: glow('#ff8fa6', 1.0), gum: glow('#ff3fb0', 3.2),
      coilG: new THREE.TubeGeometry(coil, 300, 0.07, 12, false), esoG: new THREE.TubeGeometry(eso, 60, 0.05, 12, false)};
  }, []);
  const t = prog(o, S.myth, S.dive);
  const pulse = 1 + 0.15 * Math.sin(o / 90);
  return <>
    <primitive attach="background" object={gradientTex('#0b2340', '#02060f')} />
    <ambientLight intensity={0.4} />
    <Cam p={lerp3([1.4, -1.3, 7.6], [0.7, -1.7, 6.0], smoother(t))} l={[0, -1.6, 0]} fov={34} />
    <Max f={{xray: 1}} />
    <mesh material={m.eso} geometry={m.esoG} />
    <mesh material={m.stomach} position={[0.12, -1.98, 0.12]} rotation={[0, 0, -0.5]} scale={[0.42, 0.26, 0.22]}><sphereGeometry args={[1, 40, 30]} /></mesh>
    <mesh material={m.gut} geometry={m.coilG} />
    <mesh material={m.gum} position={[0.18, -2.0, 0.3]} scale={0.08 * pulse}><sphereGeometry args={[1, 24, 16]} /></mesh>
    <Post focus={[0.15, -2.0, 0.3]} bokeh={2} bloom={1.1} />
  </>;
};

// ---- tunnels -----------------------------------------------------------------------------------------------------------------
const path = (seed: string, n: number, step: number, wob: number): V3[] => Array.from({length: n}, (_, i) =>
  [Math.sin(i * 0.7 + random(`${seed}a`) * 6) * wob, -i * step, Math.cos(i * 0.55 + random(`${seed}b`) * 6) * wob]);
const GumBall = ({p, r = 0.28, color = '#ff5fb4', pale = 0}: {p: THREE.Vector3; r?: number; color?: string; pale?: number}) => {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color, roughness: 0.3, clearcoat: 1, sheen: 0.8, sheenColor: new THREE.Color('#ffd5ea'), bumpMap: noiseTex('gum', 256, 12, [2, 2]), bumpScale: 1.5,
    emissive: new THREE.Color('#ff2f8f'), emissiveIntensity: 0.25}), [color]);
  mat.color.set(color).lerp(new THREE.Color('#d9c9cf'), pale); mat.emissiveIntensity = 0.25 * (1 - pale);
  return <mesh material={mat} position={p} scale={[r, r * 0.86, r * 1.05]}><sphereGeometry args={[1, 40, 28]} /></mesh>;
};
type TunnelKind = 'eso' | 'si' | 'li' | 'block';
const TUN: Record<TunnelKind, {pts: V3[]; color: string; sheen: string; fog: string; r: (u: number, a: number) => number}> = {
  eso: {pts: path('eso', 14, 3, 0.8), color: '#c4485a', sheen: '#ffb0a8', fog: '#2a0509', r: (u, a) => 1 + 0.07 * Math.sin(a * 7 + u * 30)},
  si: {pts: path('si', 22, 2.6, 2.2), color: '#d9727a', sheen: '#ffd2c4', fog: '#33080d', r: (u) => 1.05 * (1 - 0.16 * Math.max(0, Math.sin(u * 220)))},
  li: {pts: path('li', 16, 3.2, 1.6), color: '#b8735a', sheen: '#f2c4a8', fog: '#2e140b', r: (u) => 1.7 * (1 + 0.2 * Math.max(0, Math.sin(u * 95)) - 0.12 * Math.max(0, -Math.sin(u * 95)))},
  block: {pts: path('si', 22, 2.6, 2.2), color: '#d06a72', sheen: '#ffd2c4', fog: '#2a0408', r: (u) => 1.05 * (1 - 0.16 * Math.max(0, Math.sin(u * 220)))},
};
const Villi = ({tun, r}: {tun: ReturnType<typeof useTunnel>; r: (u: number, a: number) => number}) => {
  const mesh = useMemo(() => {
    const n = 2600, geo = new THREE.CapsuleGeometry(0.028, 0.16, 4, 8), mat = new THREE.MeshPhysicalMaterial({color: '#f19aa0', roughness: 0.35, clearcoat: 0.8, sheen: 0.7, sheenColor: new THREE.Color('#ffd9d0')});
    const im = new THREE.InstancedMesh(geo, mat, n); const P = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), M = new THREE.Matrix4(), frames = tun.curve.computeFrenetFrames(400, false);
    for (let i = 0; i < n; i++) {
      const u = 0.02 + random(`vu${i}`) * 0.96, a = random(`va${i}`) * Math.PI * 2, k = Math.round(u * 400);
      tun.curve.getPointAt(u, P); const N = frames.normals[k], B = frames.binormals[k];
      const d = new THREE.Vector3().addScaledVector(N, -Math.cos(a)).addScaledVector(B, Math.sin(a)).normalize();
      const pos = P.clone().addScaledVector(d, r(u, a) * 0.93);
      q.setFromUnitVectors(up, d.clone().negate()); M.compose(pos, q, new THREE.Vector3(1, 0.7 + random(`vs${i}`) * 0.6, 1)); im.setMatrixAt(i, M);
    }
    return im;
  }, [tun, r]);
  return <primitive object={mesh} />;
};
const TunnelShot = ({o, kind}: {o: number; kind: TunnelKind}) => {
  const spec = TUN[kind];
  const tun = useTunnel(useMemo(() => ({pts: spec.pts, radius: spec.r}), [spec]));
  const mat = useMemo(() => tissueMat(spec.color, {sheen: spec.sheen, repeat: kind === 'li' ? [14, 3] : [18, 4]}), [spec, kind]);
  const [, a, b] = shotAt(o);
  const t = prog(o, a, b);
  // gum position along the tube; the camera trails it; peristalsis ring right behind the gum in the esophagus
  const ug = kind === 'eso' ? lerp(0.1, 0.55, smoother(t)) : kind === 'si' ? lerp(0.1, 0.62, t) : kind === 'li' ? Math.min(0.405, lerp(0.12, 0.5, smoother(t))) : 0.42;
  const rev = kind === 'si' && o >= T.but; // reverse angle: the gum slides toward us
  const uc = kind === 'block' ? lerp(0.32, 0.392, smoother(t)) : kind === 'eso' ? lerp(0.05, 0.38, smoother(t)) : rev ? ug + 0.045 : ug - (kind === 'li' ? 0.06 : 0.05);
  shapeTunnel(tun, spec.r, kind === 'eso' ? (u) => ring(u, ug - 0.016, 0.012, 0.55) * ring(u, ug + 0.2, 0.02, 0.3) : (u) => 1 - 0.05 * Math.sin(u * 60 - o / 200));
  const G = tun.curve.getPointAt(Math.min(0.999, ug)), C = tun.curve.getPointAt(Math.max(0, uc));
  const lookAt = kind === 'block' ? tun.curve.getPointAt(0.42) : G;
  const roll = 0.07 * Math.sin(o / 700);
  const pale = kind === 'si' ? smoother(prog(o, T.soaks, T.but + 300)) : kind === 'li' || kind === 'block' ? 1 : 0;
  return <>
    <color attach="background" args={[spec.fog]} />
    <fog attach="fog" args={[spec.fog, 1.5, kind === 'li' ? 20 : 11]} />
    <ambientLight intensity={0.25} />
    <pointLight position={[C.x, C.y + 0.2, C.z]} intensity={kind === 'li' ? 16 : kind === 'block' ? 12 : 9} distance={kind === 'li' ? 20 : 14} decay={1.4} color="#fff0e6" />
    {kind === 'block' && (() => { const R = tun.curve.getPointAt(0.405); return <pointLight position={[R.x, R.y + 0.3, R.z]} intensity={2.5 + 2 * Math.max(0, Math.sin(o / 160))} distance={5} decay={2} color="#ff3030" />; })()}
    <Cam p={[C.x, C.y, C.z]} l={[lookAt.x, lookAt.y - 0.1, lookAt.z]} fov={kind === 'li' ? 62 : 58} roll={roll} />
    <mesh geometry={tun.geo} material={mat} />
    {(kind === 'si' || kind === 'block') && <Villi tun={tun} r={spec.r} />}
    {kind !== 'block' && <GumBall p={new THREE.Vector3(G.x, G.y - 0.15, G.z)} r={kind === 'li' ? 0.3 : 0.27} pale={pale} />}
    {kind === 'si' && <Sparkles o={o} from={T.soaks - 150} to={T.but + 200} at={G} />}
    {kind === 'li' && <Waste tun={tun} o={o} gum={ug} />}
    {kind === 'block' && <Clump at={lookAt} o={o} />}
    <Post focus={[lookAt.x, lookAt.y, lookAt.z]} bokeh={kind === 'block' ? 3 : 2.2} bloom={0.6} />
  </>;
};
// sugar/flavour leaving the gum toward the villi
const Sparkles = ({o, from, to, at: p}: {o: number; from: number; to: number; at: THREE.Vector3}) => {
  if (o < from || o > to + 600) return null;
  return <>{Array.from({length: 70}, (_, i) => {
    const t0 = from + random(`st${i}`) * (to - from), k = clamp01((o - t0) / 700);
    if (k <= 0 || k >= 1) return null;
    const a = random(`sa${i}`) * Math.PI * 2, b = (random(`sb${i}`) - 0.5) * 2, d = 0.25 + k * 0.85;
    return <mesh key={i} position={[p.x + Math.cos(a) * d, p.y - 0.15 + b * d * 0.6, p.z + Math.sin(a) * d]} scale={0.022 * (1 - k * 0.5)}>
      <sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={i % 3 ? '#fff3a8' : '#ffc6ef'} toneMapped={false} /></mesh>;
  })}</>;
};
const Waste = ({tun, o, gum}: {tun: ReturnType<typeof useTunnel>; o: number; gum: number}) => {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#8a6038', roughness: 0.55, clearcoat: 0.5, bumpMap: noiseTex('waste', 256, 10, [2, 2]), bumpScale: 3}), []);
  const u0 = 0.43; const P = tun.curve.getPointAt(u0);
  const join = smoother(prog(o, T.joins - 200, T.joins + 500));
  void gum; void join;
  return <>{Array.from({length: 7}, (_, i) => <mesh key={i} material={mat} position={[P.x + (random(`wx${i}`) - 0.5) * 0.9, P.y - 0.5 + (random(`wy${i}`) - 0.5) * 0.5, P.z + (random(`wz${i}`) - 0.5) * 0.9]}
    scale={0.35 + random(`ws${i}`) * 0.3}><icosahedronGeometry args={[1, 3]} /></mesh>)}</>;
};
const Clump = ({at: p, o}: {at: THREE.Vector3; o: number}) => (
  <group position={p} rotation={[0, o / 4000, 0]}>
    {Array.from({length: 26}, (_, i) => { const a = random(`ca${i}`) * Math.PI * 2, b = Math.acos(2 * random(`cb${i}`) - 1), r = 0.45;
      return <GumBall key={i} p={new THREE.Vector3(Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r * 0.8, Math.sin(b) * Math.sin(a) * r)} r={0.24 + random(`cr${i}`) * 0.1}
        color={['#ff5fb4', '#7fd1ff', '#9be36a', '#ffffff'][i % 4]} pale={0.35} />; })}
  </group>
);

// ---- 5 stomach -------------------------------------------------------------------------------------------------------------
const StomachShot = ({o}: {o: number}) => {
  const m = useMemo(() => {
    const g = new THREE.SphereGeometry(7, 160, 110); const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const th = Math.atan2(v.z, v.x);
      const rug = 1 + 0.035 * Math.abs(Math.sin(th * 13 + v.y * 0.6)) + 0.02 * Math.sin(v.y * 3 + th * 5); v.multiplyScalar(rug); p.setXYZ(i, v.x * 1.35, v.y, v.z); }
    g.computeVertexNormals();
    return {g, wall: tissueMat('#c75866', {sheen: '#ffc0b6', repeat: [8, 4]}),
      acid: new THREE.MeshPhysicalMaterial({color: '#9fc23a', roughness: 0.06, transparent: true, opacity: 0.72, emissive: new THREE.Color('#3d5200'), emissiveIntensity: 0.25, clearcoat: 1, bumpMap: noiseTex('acid', 256, 16, [6, 6]), bumpScale: 0.8}),
      food: new THREE.MeshPhysicalMaterial({color: '#d9a35b', roughness: 0.75, bumpMap: noiseTex('food', 256, 14, [2, 2]), bumpScale: 4}),
      veg: new THREE.MeshPhysicalMaterial({color: '#6aa84f', roughness: 0.6, bumpMap: noiseTex('food', 256, 14, [2, 2]), bumpScale: 4}),
      bub: new THREE.MeshPhysicalMaterial({color: '#f4ffb0', roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1})};
  }, []);
  const t = prog(o, S.sto, S.si);
  const dissolve = smoother(prog(o, S.sto + 300, S.si));
  const gum = new THREE.Vector3(0.4, -2.25 + 0.06 * Math.sin(o / 260), 0.6);
  return <>
    <color attach="background" args={['#2a060b']} />
    <fog attach="fog" args={['#2a060b', 4, 22]} />
    <ambientLight intensity={0.3} />
    <pointLight position={[0, 4, 3]} intensity={30} distance={20} decay={1.2} color="#ffe6d6" />
    <pointLight position={[0, -2, 0]} intensity={4} distance={9} color="#d6ff6a" />
    <Cam p={lerp3([3.6, -0.6, 5.0], [2.0, -1.55, 2.6], smoother(t))} l={[gum.x - 0.4, gum.y + 0.35, gum.z - 1]} fov={55} roll={0.05 * Math.sin(o / 800)} />
    <mesh geometry={m.g} material={m.wall} />
    <mesh material={m.acid} position={[0, -2.45, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[9.2, 96]} /></mesh>
    {Array.from({length: 7}, (_, i) => { const s = (0.45 + random(`fs${i}`) * 0.3) * (1 - 0.75 * dissolve * (0.6 + random(`fd${i}`) * 0.4));
      return <mesh key={i} material={i % 3 ? m.food : m.veg} position={[(random(`fx${i}`) - 0.5) * 7, -2.4 + 0.05 * Math.sin(o / 300 + i), (random(`fz${i}`) - 0.5) * 5]}
        rotation={[i, i * 2, o / 3000]} scale={[s, s * 0.7, s * 0.9]}><dodecahedronGeometry args={[1, 1]} /></mesh>; })}
    {Array.from({length: 90}, (_, i) => { const life = 1400 + random(`bl${i}`) * 1200, ph = ((o + random(`bp${i}`) * life) % life) / life;
      return <mesh key={`b${i}`} material={m.bub} position={[(random(`bx${i}`) - 0.5) * 9, -2.45 + ph * 0.5, (random(`bz${i}`) - 0.5) * 6]} scale={0.03 + 0.05 * random(`bs${i}`) * (1 - ph)}>
        <sphereGeometry args={[1, 10, 8]} /></mesh>; })}
    <GumBall p={gum} r={0.34} />
    <Post focus={[gum.x, gum.y, gum.z]} bokeh={3} bloom={0.5} />
  </>;
};

// ---- 8/9 calendar -------------------------------------------------------------------------------------------------------------
const pageTex = (label: string, sub: string, red = false) => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 640; const x = c.getContext('2d')!;
  x.fillStyle = '#fbfaf7'; x.fillRect(0, 0, 512, 640); x.fillStyle = red ? '#2b2b2b' : '#e8443a'; x.fillRect(0, 0, 512, 130);
  x.fillStyle = '#fff'; x.font = '800 64px Inter'; x.textAlign = 'center'; x.fillText(sub, 256, 92);
  x.fillStyle = '#1b1b1b'; x.font = '800 150px Inter'; x.fillText(label, 256, 420);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const CalendarShot = ({o, bust}: {o: number; bust: boolean}) => {
  const m = useMemo(() => ({
    pages: [pageTex('1', 'DAY'), pageTex('2', 'DAY'), pageTex('3', 'DAY'), pageTex('7', 'YEARS', true)].map((t) => new THREE.MeshPhysicalMaterial({map: t, roughness: 0.6, side: THREE.DoubleSide})),
    base: new THREE.MeshPhysicalMaterial({color: '#f4f1ea', roughness: 0.5, clearcoat: 0.3}), ringM: new THREE.MeshPhysicalMaterial({color: '#b8bcc4', metalness: 1, roughness: 0.25}),
    x: new THREE.MeshPhysicalMaterial({color: '#ff2a2a', emissive: new THREE.Color('#ff1010'), emissiveIntensity: 0.9, roughness: 0.3, clearcoat: 1}),
  }), []);
  // flips: DAY 1 → 2 → 3, then (bust) the "7 YEARS" page
  const flips = bust ? [S.bust - 10] : [S.days + 420, S.days + 900];
  const shown = bust ? 3 : Math.min(2, flips.filter((fl) => o >= fl).length);
  const flipK = (f: number) => smoother(prog(o, f, f + 300));
  const xs = bust ? smoother(prog(o, T.not + 180, T.not + 360)) : 0;
  const shake = bust && o > T.not + 360 && o < T.not + 700 ? 0.04 * Math.sin(o / 18) * (1 - (o - T.not - 360) / 340) : 0;
  return <>
    <Studio top="#ffe9c9" bottom="#e28b54" />
    <Cam p={[0.7 + shake, 0.3, 6.6 - 0.6 * prog(o, bust ? S.bust : S.days, bust ? S.block : S.bust)]} l={[0, 0.05, 0]} fov={32} />
    <mesh material={m.base} position={[0, -1.25, -0.1]} rotation={[-0.2, 0, 0]}><boxGeometry args={[2.3, 0.25, 1]} /></mesh>
    <mesh material={m.pages[shown]} position={[0, 0, 0]}><planeGeometry args={[2, 2.5]} /></mesh>
    {!bust && flips.map((f, i) => (o >= f && o < f + 300) ? <group key={i} position={[0, 1.25, 0.01]} rotation={[-flipK(f) * Math.PI * 0.95, 0, 0]}>
      <mesh material={m.pages[i]} position={[0, -1.25, 0]}><planeGeometry args={[2, 2.5]} /></mesh></group> : null)}
    {[-0.6, 0, 0.6].map((x) => <mesh key={x} material={m.ringM} position={[x, 1.28, 0.02]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.1, 0.022, 10, 24]} /></mesh>)}
    {bust && xs > 0 && <group position={[0, -0.05, 0.25]} scale={1.6 - 0.6 * xs}>
      <mesh material={m.x} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[2.6, 0.32, 0.18]} /></mesh>
      <mesh material={m.x} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[2.6, 0.32, 0.18]} /></mesh></group>}
    <Post focus={[0, 0, 0]} bokeh={2} bloom={0.4} />
  </>;
};

// ---- captions + chips (2D) --------------------------------------------------------------------------------------------------
const KEY = /^(gum|seven|years|esophagus|stomach|acid|rubbery|small|intestine|sugar|flavor|large|waste|few|days|blockage)$/i;
const CHUNKS = (() => {
  const out: {a: number; w: typeof W}[] = []; let cur: typeof W = [];
  W.forEach((w, i) => { cur.push(w); const end = /[.,!?]$/.test(w.t) || cur.length >= 3 || i === W.length - 1; if (end) { out.push({a: cur[0].at, w: cur}); cur = []; } });
  return out;
})();
const Captions = ({o}: {o: number}) => {
  let c = -1; CHUNKS.forEach((x, i) => { if (o >= x.a) c = i; });
  if (c < 0) return null;
  const ch = CHUNKS[c], next = CHUNKS[c + 1]?.a ?? ch.w[ch.w.length - 1].at + 900;
  if (o > next || o > ch.w[ch.w.length - 1].at + 1100) return null;
  const k = (o - ch.a) / 70;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1240, textAlign: 'center', transform: `scale(${k < 1 ? 0.9 + 0.1 * k : 1})`, opacity: Math.min(1, k)}}>
    {ch.w.map((w, i) => <span key={i} style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 70, color: KEY.test(w.t.replace(/[.,!?]/g, '')) ? '#FFD84A' : '#fff', margin: '0 10px',
      textShadow: '0 4px 18px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.9)', opacity: o >= w.at - 40 ? 1 : 0.0}}>{w.t.replace(/[.,!?]$/, '')}</span>)}
  </div>;
};
type Chip = {a: number; b: number; text: string; dot?: string};
const CHIPS: Chip[] = [
  {a: S.myth + 200, b: S.dive, text: 'MYTH: STUCK FOR 7 YEARS?', dot: '#ff4d4d'},
  {a: S.eso + 150, b: S.sto, text: 'ESOPHAGUS · A FEW SECONDS', dot: '#ff8fa6'},
  {a: S.sto + 150, b: T.rubbery - 100, text: 'STOMACH ACID · pH 1.5–3.5', dot: '#c9dd4a'},
  {a: T.rubbery - 100, b: S.si, text: 'GUM BASE = POLYMERS · NOT DIGESTED', dot: '#ff5fb4'},
  {a: S.si + 150, b: T.soaks - 100, text: 'SMALL INTESTINE', dot: '#f19aa0'},
  {a: T.soaks - 100, b: S.li, text: 'SUGAR + FLAVOR → ABSORBED', dot: '#fff3a8'},
  {a: S.li + 150, b: S.days, text: 'LARGE INTESTINE', dot: '#c48a6a'},
  {a: S.days + 150, b: S.bust, text: 'USUALLY OUT IN A FEW DAYS', dot: '#5fd36a'},
  {a: S.bust + 150, b: S.block, text: 'MYTH BUSTED', dot: '#ff2a2a'},
  {a: S.block + 150, b: S.loop, text: '⚠ LOTS OF GUM AT ONCE → RARE BLOCKAGE', dot: '#ff2a2a'},
];
const Chips = ({o}: {o: number}) => {
  const c = CHIPS.find((x) => o >= x.a && o < x.b);
  if (!c) return null;
  const k = clamp01((o - c.a) / 220), q = clamp01((c.b - o) / 160);
  const years = c.text.startsWith('MYTH:') ? Math.max(1, Math.min(7, 1 + Math.floor((o - T.seven + 400) / 120))) : 0;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', opacity: Math.min(k, q), transform: `translateY(${(1 - k) * -18}px) scale(${0.94 + 0.06 * k})`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(12,16,24,.78)', backdropFilter: 'blur(6px)', border: '2px solid rgba(255,255,255,.18)', borderRadius: 40, padding: '14px 30px',
      fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 1}}>
      <span style={{width: 18, height: 18, borderRadius: 9, background: c.dot, boxShadow: `0 0 14px ${c.dot}`}} />
      {c.text}{years ? <span style={{color: '#FFD84A', marginLeft: 6}}>{`YEAR ${years}`}</span> : null}
    </div>
  </div>;
};

// ---- audio --------------------------------------------------------------------------------------------------------------------
type Fx = [file: string, at: number, vol: number];
const FX: Fx[] = [
  ['chew', 0, 0.5], ['chew', 260, 0.45], ['gulp', T.swallowed - 30, 0.9], ['shimmer', S.myth - 20, 0.5],
  ...[0, 1, 2, 3, 4, 5].map((i): Fx => ['tick', T.seven - 400 + i * 120 + 120, 0.35]),
  ['whoosh_in', S.dive + 100, 0.7], ['squelch', S.eso - 40, 0.8], ['squeeze', S.eso + 500, 0.6], ['squeeze', S.eso + 1500, 0.55],
  ['splash', S.sto + 60, 0.7], ['fizz', S.sto, 0.4], ['deny', T.rubbery - 60, 0.45],
  ['squelch', S.si - 30, 0.6], ['sparkle', T.soaks - 120, 0.55], ['slide', T.but, 0.5],
  ['squelch', S.li - 30, 0.65], ['thud', T.joins + 300, 0.6],
  ['flip', S.days + 420, 0.6], ['flip', S.days + 900, 0.6], ['ding', T.out + 40, 0.55],
  ['flip', S.bust - 10, 0.5], ['stamp', T.not + 330, 0.85],
  ['alarm', S.block + 100, 0.35], ['alarm', S.block + 700, 0.3], ['alarm', T.blockage - 100, 0.4], ['squelch', S.block - 30, 0.5],
  ['chew', S.loop + 80, 0.45], ['chew', S.loop + 330, 0.4], ['chew', S.loop + 580, 0.4],
];
const AMB: [string, number, number, number][] = [['body_amb', S.eso, S.days, 0.55], ['body_amb', S.block, S.loop, 0.5]];
const f = (ms: number) => Math.round((ms / 1000) * FPS);
const voiceAt = (ms: number) => W.some((w) => ms >= w.at - 120 && ms <= w.at + 520);

export const GumShort = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const [shot] = shotAt(o);
  const flash = Math.max(0, 1 - Math.abs(o - S.eso) / 140) * 0.9;
  return <AbsoluteFill style={{background: '#000'}}>
    <ThreeCanvas width={1080} height={1920} camera={{fov: 35, position: [0, 0, 3]}} gl={{toneMapping: THREE.NoToneMapping}}>
      {shot === 'hook' && <FaceShot o={o} kind="hook" />}
      {shot === 'myth' && <XrayShot o={o} />}
      {shot === 'dive' && <FaceShot o={o} kind="dive" />}
      {(shot === 'eso' || shot === 'si' || shot === 'li' || shot === 'block') && <TunnelShot key={shot} o={o} kind={shot} />}
      {shot === 'sto' && <StomachShot o={o} />}
      {shot === 'days' && <CalendarShot o={o} bust={false} />}
      {shot === 'bust' && <CalendarShot o={o} bust />}
      {shot === 'loop' && <FaceShot o={o} kind="loop" />}
    </ThreeCanvas>
    {flash > 0 && <AbsoluteFill style={{background: '#000', opacity: flash}} />}
    <Chips o={o} />
    <Captions o={o} />
    <Sequence from={f(OFF)}><Audio src={staticFile('inside/vo_gum.wav')} volume={1} /></Sequence>
    <Audio src={staticFile('music/Investigations.mp3')} volume={(fr) => { const ms = (fr / FPS) * 1000; return (voiceAt(ms) ? 0.05 : 0.11) * Math.min(1, (GUM_MS - ms) / 500); }} />
    {FX.map(([file, t, v], i) => <Sequence key={i} from={Math.max(0, f(t))}><Audio src={staticFile(`inside/sfx/${file}.wav`)} volume={v} /></Sequence>)}
    {AMB.map(([file, a, b, v], i) => <Sequence key={`a${i}`} from={f(a)} durationInFrames={f(b) - f(a)}><Audio src={staticFile(`inside/sfx/${file}.wav`)} loop volume={(fr) => v * Math.min(1, fr / 8, (f(b) - f(a) - fr) / 8)} /></Sequence>)}
  </AbsoluteFill>;
};
