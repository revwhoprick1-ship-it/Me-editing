// INSIDE THE IMPOSSIBLE #5 — "What if every car was the Tesla Roadster?" (1080x1920, 30 fps, ~38.9 s). HYPOTHETICAL.
// Facts: inside-impossible/videos/005-roadster/SCRIPT.md (Fox News 18 Oct 2026 + Electrek 13 Oct 2026 on the 15 Oct 2026
// reveal; Hedges & Co. car count; IMF WEO world GDP). Hook chosen by experiment: HOOK_LAB.md. New mascot: kit/max2.tsx.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../mgFonts';
import {Stage} from '../dogs/stage';
import {Asphalt, CashPile, Calendar, Coffee, Fleet, Minivan, Receipt, Roadster, Sedan, Shuttle, Thrusters, TrafficLight, Truck, carM, makeRoadster, useGLBs, useLowFleet, useTextures} from './kit/cars';
import {Max2, cheer, gamer, gforce, lagOf, pointAt, pockets, seated, shocked, shrug, walk, withP, yawn, type Pose2} from './kit/max2';
import {Earth, Stars} from './kit/ocean';
import {Captions, Chips, chunks, loadWords, wordAt, type Chip, type Word} from './kit/overlay';
import {Cam, Env, Post, clamp01, gradientTex, lerp, lerp3, noiseTex, prog, smoother, type V3} from './kit/three';
import raw from './vo_roadster.words.json';

const FPS = 30, OFF = 250;
const W = loadWords(raw, OFF);
const at = (w: string, n = 0) => wordAt(W, w, n);
const T = {roadster: at('roadster'), so0: at('so'), heres: at("here's"), tesla1: at('tesla', 1), sixty: at('60'), thats0: at("that's"), so1: at('so', 1), green: at('green'),
  traffic: at('traffic'), tesla2: at('tesla', 2), catch: at('catch'), now0: at('now'), one0: at('one'), at1: at('at', 1), thats1: at("that's", 1), two: at('two'),
  and2: at('and', 2), it1: at('it', 1), now1: at('now', 1), so2: at('so', 2), would: at('would')};
export const ROADSTER_MS = W[W.length - 1].at + 500 + 1400;
const S = {hook: 0, fleet: T.so0, breaks: T.heres, sixty: T.tesla1, shuttle: T.thats0, coffee: T.so1, jam: T.traffic, reveal: T.tesla2, refill: T.catch - 100,
  bill: T.now0, price: T.one0, receipt: T.at1, pile: T.thats1, gdp: T.two, cantbuy: T.and2, calendar: T.it1, end: T.so2, fin: ROADSTER_MS};
type ShotId = Exclude<keyof typeof S, 'fin'>;
const SH = (Object.keys(S) as (keyof typeof S)[]).filter((k) => k !== 'fin') as ShotId[];
const shotAt = (o: number) => { let id = SH[0]; for (const k of SH) if (o >= S[k]) id = k; const i = SH.indexOf(id); return {id, a: S[id], b: S[SH[i + 1]] ?? S.fin}; };
const ease = (o: number, a: number, b: number) => smoother(prog(o, a, b));
const bell = (o: number, a: number, b: number) => Math.sin(Math.PI * clamp01((o - a) / (b - a)));
const shake = (o: number, at0: number, amp: number, dur = 500): V3 => { const d = o - at0; if (d < 0 || d > dur) return [0, 0, 0]; const k = amp * (1 - d / dur); return [k * Math.sin(d / 7), k * Math.cos(d / 11), 0]; };
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const ENV = {drive: 'env/roadster/suburban_parking_area_4k.jpg', hwy: 'env/roadster/highway_bridge_sunset_4k.jpg', track: 'env/roadster/zwartkops_straight_sunset_4k.jpg',
  street: 'env/roadster/modern_evening_street_4k.jpg', lot: 'env/roadster/mall_parking_lot_4k.jpg'};
const ASPH = ['tex/roadster/asphalt_track_diff_1k.jpg', 'tex/roadster/asphalt_track_nor_gl_1k.jpg', 'tex/roadster/asphalt_track_rough_1k.jpg'];
type Ctx = {o: number; a: number; b: number; tex: Record<string, THREE.Texture>; hero: ReturnType<typeof makeRoadster>; white: ReturnType<typeof makeRoadster>; open: ReturnType<typeof makeRoadster>; fleet: NonNullable<ReturnType<typeof useLowFleet>>};
const asphalt = (c: Ctx) => ({d: c.tex[ASPH[0]], n: c.tex[ASPH[1]], r: c.tex[ASPH[2]]});
/** Max with hair secondary motion from the pose function */
const MaxAt = ({fn, t, scale = 1, prop}: {fn: (t: number) => Pose2; t: number; scale?: number; prop?: React.ReactNode}) => <Max2 pose={fn(t)} hairLag={lagOf(fn, t)} scale={scale} prop={prop} />;
const place = (p: Pose2, x: number, y: number, z: number, yaw: number) => withP(p, {x: p.x + x, y: p.y + y, z: p.z + z, yaw: p.yaw + yaw});

// ---- 1 + 16: driveway — the minivan bursts into a Roadster; end: Max points at you, the Roadster turns back (loop) --------
const Driveway = ({c, kind}: {c: Ctx; kind: 'hook' | 'breaks' | 'end' | 'bill' | 'receipt'}) => {
  const {o, a, b} = c, t = o / 1000;
  const burst = kind === 'hook' ? clamp01(0.15 + (o - 0) / 520) : kind === 'end' ? clamp01((o - (S.fin - 650)) / 400) : 1;
  const flash = kind === 'hook' ? bell(o, 330, 560) : kind === 'end' ? bell(o, S.fin - 700, S.fin - 350) : 0;
  const grow = kind === 'hook' ? smoother(clamp01((o - 380) / 320)) * (1 + 0.08 * Math.sin(clamp01((o - 700) / 500) * Math.PI)) : kind === 'end' ? 1 - smoother(clamp01((o - (S.fin - 600)) / 300)) : 1;
  const carYaw = -0.55;
  let cam: {p: V3; l: V3; fov: number};
  let maxFn: (tt: number) => Pose2;
  if (kind === 'hook') {
    const k = ease(o, 0, S.fleet);
    cam = {p: add(lerp3([4.6, 1.9, 8.2], [3.6, 1.45, 6.6], k), shake(o, 300, 0.12, 600)), l: [0.4, 0.9, 0], fov: 42};
    maxFn = (tt) => { const sk = shocked(clamp01((tt * 1000 - 120) / 950), tt); return place(withP(sk, {z: -sk.z * 0.8, headY: -0.6, headX: -0.1}), 2.3, 0, 2.6, 0.35); };
  } else if (kind === 'breaks') {
    const k = ease(o, S.breaks, S.sixty);
    cam = {p: lerp3([2.6, 1.55, 4.9], [2.45, 1.52, 4.4], k), l: [2.25, 1.5, 2.2], fov: 32};
    maxFn = (tt) => place(pointAt(tt), 2.3, 0, 2.2, 0.35);
  } else if (kind === 'end') {
    const k = ease(o, S.end, S.fin);
    cam = {p: lerp3([3.4, 1.6, 6.0], [4.4, 1.85, 7.8], k), l: [1.2, 1.1, 0.5], fov: 40};
    maxFn = (tt) => place(tt * 1000 < T.would ? pockets(tt) : pointAt(tt), 2.3, 0, 2.2, 0.25);
  } else {
    const k = ease(o, a, b), longk = kind === 'receipt' ? ease(o, S.receipt, S.pile) : 0;
    cam = kind === 'bill' ? {p: lerp3([3.4, 1.55, 5.0], [3.2, 1.5, 4.6], k), l: [2.2, 1.15, 2.4], fov: 36} : {p: lerp3([4.8, 1.7, 6.4], [6.0, 2.8, 9.0], longk), l: lerp3([2.2, 1.0, 2.8], [2.3, 0.45, 4.6], longk), fov: 42};
    maxFn = (tt) => place(withP(pockets(tt), {armR: {fwd: 0.9, out: 0.1, elbow: 0.6, hand: 0.9, pocket: 0}, face: {wide: kind === 'receipt' ? smoother(clamp01((tt * 1000 - S.receipt) / 600)) : 0.2, open: kind === 'receipt' ? 0.35 : 0, mouthO: 0.5, browUp: 0.6}}), 2.3, 0, 2.2, 0.3);
  }
  const rcpL = kind === 'bill' ? 0.4 + 1.2 * ease(o, S.bill + 150, S.price) : kind === 'receipt' ? 1.6 + 26 * ease(o, S.receipt, S.pile) : 0;
  return <>
    <Stage tex={c.tex[ENV.drive]} h={1.6} r={40} rot={0.4} bright={1.05} ibl={1} sun={{p: [6, 9, 5], i: 2.6, c: '#fff1dc'}} fill={0.5} shadow={0.45} />
    <Cam p={cam.p} l={cam.l} fov={cam.fov} near={0.05} far={600} />
    {burst < 1 && <group position={[0, 0, 0]} rotation={[0, carYaw, 0]}><Minivan burst={kind === 'end' ? 1 - burst : burst} /></group>}
    {grow > 0.01 && <group scale={grow}><Roadster car={c.hero} rotation={[0, carYaw, 0]} /></group>}
    {flash > 0.01 && <mesh position={[0, 1, 0]} scale={0.4 + 1.0 * flash}><sphereGeometry args={[1, 24, 16]} /><meshBasicMaterial color={new THREE.Color(2.5, 2.4, 2.2)} transparent opacity={0.25 * flash} toneMapped={false} depthWrite={false} /></mesh>}
    {kind === 'hook' && Array.from({length: 26}, (_, i) => { const d = (o - 350) / 1000; if (d < 0 || d > 1.2) return null; const dir = new THREE.Vector3(random(`sp${i}x`) - 0.5, random(`sp${i}y`) * 0.8 + 0.2, random(`sp${i}z`) - 0.5).normalize();
      return <mesh key={i} position={[dir.x * 7 * d, 0.8 + dir.y * 6 * d - 4.9 * d * d, dir.z * 7 * d]}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color={new THREE.Color(4, 3, 1.4)} toneMapped={false} /></mesh>; })}
    <MaxAt fn={maxFn} t={t} prop={null} />
    {(kind === 'bill' || kind === 'receipt') && <Receipt L={rcpL} from={[2.3 - 0.35, 1.08, 2.2 + 0.45]} />}
    <Post focus={kind === 'breaks' ? [2.3, 1.5, 2.2] : [1.0, 1.0, 1.0]} bokeh={kind === 'breaks' ? 2.4 : 1.2} bloom={0.35} />
  </>;
};

// ---- 2 + price: every car on Earth flips to a Roadster (wave along the highway) ----------------------------------------------------
const LANES = [-5.4, -1.8, 1.8, 5.4];
const Highway = ({c, kind}: {c: Ctx; kind: 'fleet' | 'price'}) => {
  const {o, a} = c, k = ease(o, a, c.b);
  const n = kind === 'fleet' ? 40 : 160, wave = kind === 'fleet' ? lerp(-60, 80, clamp01((o - a) / 1100)) : 1e9;
  const cars = Array.from({length: n}, (_, i) => { const lane = LANES[i % 4] * (kind === 'price' ? 1 + Math.floor(i / 40) * 0.0 : 1), z = -70 + (i * 37.3) % 150 + ((o / 1000) * (i % 4 < 2 ? 9 : -9)) % 150;
    const zz = ((z + 75) % 150 + 150) % 150 - 75; return {x: kind === 'price' ? lane + (Math.floor(i / 40) - 1.5) * 16 : lane, z: zz, yaw: i % 4 < 2 ? 0 : Math.PI}; });
  const rs = cars.filter((q) => q.z < wave).map((q) => carM([q.x, 0, q.z], q.yaw));
  const cam: {p: V3; l: V3} = kind === 'fleet' ? {p: lerp3([12, 9, 30], [9, 7, 22], k), l: [0, 0, -12]} : {p: lerp3([26, 22, 60], [50, 60, 130], k), l: [0, 0, -20]};
  return <>
    <Stage tex={c.tex[ENV.hwy]} h={2} r={300} rot={0} bright={1.05} ibl={1} sun={{p: [-30, 20, -40], i: 2.4, c: '#ffd9a8'}} fill={0.5} shadow={0.35} />
    <Cam p={cam.p} l={cam.l} fov={42} near={0.1} far={2000} />
    <Asphalt tex={asphalt(c)} size={kind === 'price' ? 220 : 150} repeat={kind === 'price' ? 40 : 28} lines />
    <Fleet parts={c.fleet} mats={rs} />
    {cars.filter((q) => q.z >= wave).map((q, i) => <group key={i} position={[q.x, 0, q.z]} rotation={[0, q.yaw, 0]}><Sedan color={['#7d8794', '#a7b0ba', '#3d4855', '#c9c3b7'][i % 4]} /></group>)}
    {kind === 'fleet' && <mesh position={[0, 0.6, wave]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[24, 2.5]} /><meshBasicMaterial color={new THREE.Color(3, 3, 3.4)} transparent opacity={0.55} toneMapped={false} depthWrite={false} /></mesh>}
    <Post focus={[0, 0, 0]} bokeh={0.5} bloom={0.4} />
  </>;
};

// ---- 4-5: launch strip — thrusters, 0-60 in 0.81 s; the Roadster vs a Space Shuttle -------------------------------------------------
const Launch = ({c, kind}: {c: Ctx; kind: 'sixty' | 'shuttle'}) => {
  const {o} = c, t = o / 1000;
  const go = kind === 'sixty' ? T.sixty + 120 : S.shuttle + 350, dt = Math.max(0, (o - go) / 1000);
  const acc = 33, z = 0.5 * acc * dt * dt, thrust = o > go - 250 ? clamp01((o - go + 250) / 200) : 0;
  if (kind === 'sixty') {
    const cz = Math.max(8, z + 8 - 2 * dt);
    return <>
      <Stage tex={c.tex[ENV.track]} h={1.7} r={300} rot={Math.PI} bright={1.0} ibl={1} sun={{p: [-20, 8, -30], i: 2.6, c: '#ffcf96'}} fill={0.45} shadow={0.4} />
      <Cam p={add([1.2 + 0.4 * Math.min(1, dt), 0.55, cz], shake(o, go, 0.06, 900))} l={[0, 0.6, z - 1]} fov={38} near={0.05} far={1200} />
      <Asphalt tex={asphalt(c)} size={160} repeat={30} />
      <group position={[0, 0, z]}><Roadster car={c.hero} rotation={[0, 0, 0]} /><Thrusters power={thrust} t={t} /></group>
      <Post focus={[0, 0.6, z]} bokeh={1.2} bloom={0.45} />
    </>;
  }
  const sh = 0.5 * 2.2 * dt * dt * 3; // the Shuttle climbs (visual, slower than the car)
  return <>
    <Stage tex={c.tex[ENV.track]} h={1.7} r={600} rot={Math.PI * 0.6} bright={1.0} ibl={1} sun={{p: [-20, 12, -30], i: 2.6, c: '#ffcf96'}} fill={0.45} shadow={0.35} />
    <Cam p={add([6, 1.4, 14 + Math.min(z, 30) * 0.5], shake(o, go, 0.05, 900))} l={[-10, 12, -20 + Math.min(z, 30) * 0.4]} fov={46} near={0.1} far={2000} />
    <Asphalt tex={asphalt(c)} size={200} repeat={36} />
    <group position={[-34, sh, -90]} scale={0.8}><Shuttle flame={o > go - 300 ? 1 : 0} t={t} /></group>
    {o > go - 300 && Array.from({length: 18}, (_, i) => <mesh key={i} position={[-34 + (random(`sm${i}`) - 0.5) * 20 * (1 + dt), 2 + random(`sh${i}`) * 6 * dt, -90 + (random(`sz${i}`) - 0.5) * 16]} scale={4 + 6 * dt * random(`ss${i}`)}>
      <sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#e9e4dc" roughness={1} transparent opacity={0.85} /></mesh>)}
    <group position={[0, 0, 4 - z]} rotation={[0, Math.PI, 0]}><Roadster car={c.hero} /><Thrusters power={thrust} t={t} /></group>
    <Post focus={[0, 0.6, 4 - z]} bokeh={0.8} bloom={0.5} />
  </>;
};

// ---- 6: green light — Max pinned to the seat, the coffee flies into the back ------------------------------------------------------
const Coffee6 = ({c}: {c: Ctx}) => {
  const {o} = c, t = o / 1000, go = T.green + 350, dt = Math.max(0, (o - go) / 1000), x = 0.5 * 33 * Math.min(dt, 0.8) ** 2 + Math.max(0, dt - 0.8) * 26;
  const cupT = clamp01(dt / 0.55), cup: V3 = lerp3([0.35, 0.82, 0.55], [0.3, 0.75, -1.05], cupT), cupY = cup[1] + 0.25 * Math.sin(Math.PI * cupT);
  const fn = (tt: number) => place(gforce(tt, smoother(clamp01((tt * 1000 - go) / 150)) * (1 - smoother(clamp01((tt * 1000 - go - 1100) / 600)))), 0.36, 0.08, -0.25, 0);
  return <>
    <Stage tex={c.tex[ENV.street]} h={1.6} r={200} rot={1.2} bright={1.0} ibl={1} sun={{p: [6, 8, 4], i: 1.6, c: '#ffd7a8'}} fill={0.6} shadow={0.3} />
    <Cam p={add([1.6 - x, 1.85, 3.5], shake(o, go, 0.05, 700))} l={[0.05 - x, 1.0, 0]} fov={40} near={0.03} far={900} />
    <group position={[-x, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <Roadster car={c.open} />
      <MaxAt fn={fn} t={t} scale={0.86} />
      <group position={[cup[0], cupY, cup[2]]} rotation={[cupT * 8, cupT * 3, 0]}><Coffee tilt={0} /></group>
      {dt > 0.1 && dt < 1.2 && Array.from({length: 14}, (_, i) => { const u = clamp01(dt / 0.55 - i * 0.03); return <mesh key={i} position={lerp3([0.35, 0.9, 0.5], [0.3 + (random(`cf${i}`) - 0.5) * 0.3, 0.6, -1.0], u)} scale={0.02 + 0.015 * random(`cs${i}`)}>
        <sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#5c3418" roughness={0.3} /></mesh>; })}
    </group>
    <group position={[-3.2, 0, -3.3]}><TrafficLight state={o < T.green ? 'red' : 'green'} /></group>
    <Post focus={[0.1 - x, 1.0, 0]} bokeh={1.6} bloom={0.45} />
  </>;
};

// ---- 7-8: hop the traffic jam; the reveal (fly over the lineup, ramp flip) --------------------------------------------------------
const Jam = ({c, reveal}: {c: Ctx; reveal: boolean}) => {
  const {o, a, b} = c, t = o / 1000, k = clamp01((o - a - (reveal ? 200 : 350)) / (reveal ? 1500 : 1250)), hop = Math.sin(Math.PI * k);
  const z = lerp(-9, 22, smoother(k)), y = hop * (reveal ? 7.5 : 5), pitch = -0.25 * Math.cos(Math.PI * k) * hop, roll = reveal ? Math.PI * 2 * smoother(clamp01((k - 0.25) / 0.5)) : 0;
  const queue = Array.from({length: 18}, (_, i) => carM([LANES[1 + (i % 2)] * 0 + (i % 2 ? 1.8 : -1.8), 0, -4 + Math.floor(i / 2) * 5.4], 0));
  const car = reveal ? c.white : c.open, hx = reveal ? 0 : -1.8;
  const cam: {p: V3; l: V3} = reveal ? {p: lerp3([24, 5, 0], [22, 6, 10], ease(o, a, b)), l: [0, 4.2, lerp(2, 13, smoother(k))]} : {p: lerp3([9, 4.5, -14], [10, 6.5, 6], ease(o, a, b)), l: [0, 2 + y * 0.5, z]};
  return <>
    {reveal ? <Stage tex={c.tex[ENV.track]} h={1.7} r={300} rot={2.4} bright={0.32} ibl={0.25} sun={{p: [4, 12, 8], i: 2.8, c: '#e6eeff'}} fill={0.2} shadow={0.5} tint="#9fb4ff" />
      : <Stage tex={c.tex[ENV.hwy]} h={2} r={300} rot={0.3} bright={1.05} ibl={1} sun={{p: [-30, 20, -40], i: 2.4, c: '#ffd9a8'}} fill={0.5} shadow={0.35} />}
    <Cam p={cam.p} l={cam.l} fov={44} near={0.1} far={1500} />
    <Asphalt tex={asphalt(c)} size={150} repeat={28} lines={!reveal} />
    {reveal ? <>
      <group position={[0, 0, 2]} rotation={[0, Math.PI / 2, 0]}><Truck /></group>
      <group position={[0, 0, 9]} rotation={[0, Math.PI / 2, 0]}><Truck len={6} h={2} color="#9aa3ad" /></group>
      {[13.5, 17].map((zz, i) => <group key={i} position={[0, 0, zz]} rotation={[0, Math.PI / 2, 0]}><Sedan color={i ? '#e9e9ea' : '#2e3b4e'} /></group>)}
    </> : <Fleet parts={c.fleet} mats={queue} />}
    <group position={[hx, y, z]} rotation={[pitch, 0, roll]}>
      <Roadster car={car} />
      <Thrusters power={hop > 0.05 ? 0.6 + 0.4 * hop : 0} t={t} down xs={[-0.6, 0.6]} />
      <Thrusters power={k > 0 && k < 0.9 ? 0.8 : 0} t={t} />
      {!reveal && <group position={[0.36, 0.06, -0.25]}><MaxAt fn={(tt) => withP(cheer(tt), {hipY: -0.37, legL: {swing: 1.45, knee: 1.35}, legR: {swing: 1.45, knee: 1.35}})} t={t} scale={0.86} /></group>}
    </group>
    <Post focus={[0, y, z]} bokeh={0.9} bloom={reveal ? 0.7 : 0.4} />
  </>;
};

// ---- 9: refill queue — 6–7 hours; Max yawns on the hood --------------------------------------------------------------------------
const Refill = ({c}: {c: Ctx}) => {
  const {o, a, b} = c, t = o / 1000, k = ease(o, a, b);
  const queue = Array.from({length: 9}, (_, i) => carM([0, 0, -8 - i * 5.2], 0));
  const sun = (o - a) / 1000 * 2.2;
  const fn = (tt: number) => { const yk = clamp01((tt * 1000 - a - 900) / 1300); return withP(yk > 0 && yk < 1 ? yawn(yk, tt) : seated(tt, 0.95), {hipY: 0.95 - 0.9 + 0.08, legL: {swing: 1.3, knee: 1.2 + 0.25 * Math.sin(tt * 3)}, legR: {swing: 1.3, knee: 1.2 + 0.25 * Math.sin(tt * 3 + 1.5)}, x: 0, z: 1.35}); };
  return <>
    <Stage tex={c.tex[ENV.lot]} h={1.7} r={300} rot={0.8} bright={1.0} ibl={1} sun={{p: [Math.cos(sun) * 20, 14 + 6 * Math.sin(sun), Math.sin(sun) * 20], i: 2.4, c: '#ffe7c4'}} fill={0.5} shadow={0.45} />
    <Cam p={lerp3([5.2, 2.2, 7.5], [4.4, 1.9, 6.0], k)} l={[0.4, 1.1, -1]} fov={42} near={0.05} far={900} />
    <Asphalt tex={asphalt(c)} size={120} repeat={24} />
    <Roadster car={c.hero} position={[0, 0, -1]} />
    <Fleet parts={c.fleet} mats={queue} />
    {/* the "AIR" refill station: tank, pump, hose */}
    <group position={[-2.6, 0, 1.6]}>
      <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.55, 0.55, 3.2, 32]} /><meshPhysicalMaterial color="#e8ecf1" metalness={0.6} roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 3.35, 0]}><sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#e8ecf1" metalness={0.6} roughness={0.25} /></mesh>
      <mesh position={[0.9, 0.9, 0.2]}><boxGeometry args={[0.6, 1.8, 0.5]} /><meshStandardMaterial color="#c8102e" roughness={0.5} /></mesh>
      <mesh position={[0.9, 1.45, 0.46]}><planeGeometry args={[0.5, 0.3]} /><meshBasicMaterial color={new THREE.Color(0.2, 1.4, 2.2)} toneMapped={false} /></mesh>
    </group>
    <group position={[0, 0, -1]}><MaxAt fn={fn} t={t} /></group>
    <Post focus={[0.2, 1.2, 0.3]} bokeh={1.6} bloom={0.4} />
  </>;
};

const towerCache: Record<number, THREE.Material> = {};
/** glass tower with a lit window grid */
const towerMat = (h: number) => (towerCache[h] = towerCache[h] ?? (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d')!;
  x.fillStyle = '#5d6f86'; x.fillRect(0, 0, 128, 256);
  for (let r = 0; r < 32; r++) for (let q = 0; q < 8; q++) { const lit = random(`tw${h}${r}${q}`) > 0.55; x.fillStyle = lit ? '#ffe2a8' : '#2c3a4d'; x.fillRect(q * 16 + 3, r * 8 + 2, 10, 5); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, h / 30);
  return new THREE.MeshStandardMaterial({map: t, roughness: 0.3, metalness: 0.4, emissiveMap: t, emissive: new THREE.Color(0.25, 0.22, 0.18)}); })());
// ---- 12-13: the money pile; the world economy -----------------------------------------------------------------------------------------
const Money = ({c, kind}: {c: Ctx; kind: 'pile' | 'gdp'}) => {
  const {o, a, b} = c, t = o / 1000, k = ease(o, a, b);
  if (kind === 'pile') {
    const g = 0.25 + 0.75 * ease(o, a, b - 200);
    return <>
      <Stage tex={c.tex[ENV.drive]} h={1.6} r={600} rot={0.4} bright={1.05} ibl={1} sun={{p: [30, 40, 20], i: 2.6}} fill={0.5} shadow={0.3} />
      <Cam p={lerp3([18, 6, 34], [42, 22, 80], k)} l={[0, 8 * g, 0]} fov={44} near={0.1} far={3000} />
      <group position={[0, 0, -6]}><CashPile n={4200} grow={g} radius={22} height={26} /></group>
      {[[-30, 30, -40], [34, 24, -50], [-46, 38, -80], [52, 44, -90], [-14, 20, -70]].map(([x, h, z], i) => <mesh key={i} position={[x, h / 2, z]} material={towerMat(h)}><boxGeometry args={[10, h, 10]} /></mesh>)}
      <group position={[9, 0, 10]}><MaxAt fn={(tt) => withP(shocked(0.45 + 0.05 * Math.sin(tt * 4), tt), {y: 0, z: 0, yaw: Math.PI + 0.4})} t={t} /></group>
      <Post focus={[0, 8, 0]} bokeh={0.5} bloom={0.35} />
    </>;
  }
  return <>
    <Env bg="#03050b" />
    <ambientLight intensity={0.15} /><directionalLight position={[-5, 2, 4]} intensity={3} color="#fff6e8" /><Stars />
    <Cam p={lerp3([0.2, 0.4, 4.6], [0.4, 0.5, 3.6], k)} l={[0, 0.2, 0]} fov={38} near={0.05} far={2000} />
    <Earth rot={t / 3} />
    <group rotation={[0.35, t * 0.6, 0.1]}>{Array.from({length: 60}, (_, i) => { const ang = (i / 60) * Math.PI * 2; return <mesh key={i} position={[Math.cos(ang) * 1.55, 0.04 * Math.sin(i * 3), Math.sin(ang) * 1.55]} rotation={[0, -ang, 0]}>
      <boxGeometry args={[0.1, 0.02, 0.045]} /><meshStandardMaterial color="#9fc39a" roughness={0.7} /></mesh>; })}</group>
    <group position={[0.3, -0.85, 1.85]} rotation={[0.2, 0, 0.15 * Math.sin(t * 1.3)]}><MaxAt fn={(tt) => withP(shocked(0.42, tt), {y: 0, z: 0, yaw: -0.35, hipY: 0.02 * Math.sin(tt * 2)})} t={t} scale={0.62} /></group>
    <Post focus={[0.5, -0.5, 1.2]} bokeh={0.6} bloom={0.5} />
  </>;
};

// ---- 14-15: can't buy one; calendar 2020 → 2028 -----------------------------------------------------------------------------------------
const Studio = ({c, kind}: {c: Ctx; kind: 'cantbuy' | 'calendar'}) => {
  const {o, a, b} = c, t = o / 1000, k = ease(o, a, b);
  const bg = useMemo(() => gradientTex('#2e3036', '#101114'), []);
  if (kind === 'cantbuy') {
    const wk = clamp01((o - a) / 1100), fn = (tt: number) => { const w2 = clamp01((tt * 1000 - a) / 1100); return w2 < 1 ? place(walk(tt), lerp(-0.9, 0.4, w2), 0, 1.7, Math.PI / 2) : place(shrug(tt), 0.4, 0, 1.7, 0.25); };
    void wk;
    return <>
      <Env bg={bg} /><hemisphereLight args={['#ffffff', '#30302c', 0.5]} />
      <spotLight position={[1.5, 6, 3]} angle={0.4} penumbra={0.5} intensity={120} distance={20} color="#fff3e2" castShadow />
      <directionalLight position={[-3, 3, -4]} intensity={1.6} color="#9cc4ff" />
      <Cam p={lerp3([1.2, 1.5, 6.4], [0.9, 1.4, 5.4], k)} l={[0.6, 0.9, 0]} fov={40} near={0.05} far={200} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#1b1c20" roughness={0.35} metalness={0.2} /></mesh>
      <group position={[1.2, 0, -0.6]} rotation={[0, t * 0.5, 0]}><mesh position={[0, 0.15, 0]} receiveShadow castShadow><cylinderGeometry args={[2.4, 2.5, 0.3, 64]} /><meshPhysicalMaterial color="#d9dde3" metalness={0.7} roughness={0.2} clearcoat={1} /></mesh>
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.2, 2.3, 64]} /><meshBasicMaterial color={new THREE.Color(1.6, 0.5, 0.2)} toneMapped={false} /></mesh></group>
      <group position={[1.2, 2.2, -2.4]}><mesh><planeGeometry args={[2.4, 0.7]} /><meshBasicMaterial color="#111" /></mesh>
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.3, 0.6]} /><meshBasicMaterial color={new THREE.Color(2.2, 0.7, 0.25)} toneMapped={false} /></mesh></group>
      <MaxAt fn={fn} t={t} />
      <Post focus={[0, 1.2, 1.7]} bokeh={1.2} bloom={0.6} />
    </>;
  }
  const p = ease(o, a + 150, T.now1 + 250);
  return <>
    <Env bg={bg} /><hemisphereLight args={['#ffffff', '#30302c', 0.55]} />
    <directionalLight position={[Math.cos(t * 6) * 4, 4, 3]} intensity={2.2} color="#fff0dc" />
    <directionalLight position={[-3, 3, -2]} intensity={1.2} color="#9cc4ff" />
    <Cam p={lerp3([1.6, 1.25, 4.4], [1.1, 1.15, 3.6], k)} l={[0.1, 0.9, 0]} fov={40} near={0.05} far={200} />
    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#2a2c33" roughness={0.9} /></mesh>
    <mesh position={[0, 3, -1.5]}><planeGeometry args={[30, 6]} /><meshStandardMaterial color="#3a3d47" roughness={0.95} bumpMap={noiseTex('wall', 256, 30, [8, 2])} bumpScale={0.6} /></mesh>
    <group position={[1.6, 1.9, -1.47]}><mesh><planeGeometry args={[1.5, 1.2]} /><meshBasicMaterial color={new THREE.Color(0.9, 1.2, 1.7).multiplyScalar(0.6 + 0.5 * (0.5 + 0.5 * Math.cos(t * 6)))} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.01]}><boxGeometry args={[0.05, 1.2, 0.02]} /><meshStandardMaterial color="#222" /></mesh><mesh position={[0, 0, 0.01]}><boxGeometry args={[1.5, 0.05, 0.02]} /><meshStandardMaterial color="#222" /></mesh></group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.004, 0.4]}><circleGeometry args={[1.3, 48]} /><meshStandardMaterial color="#7a2f2a" roughness={1} bumpMap={noiseTex('rug', 256, 60, [6, 6])} bumpScale={1.5} /></mesh>
    <group position={[-1.9, 0, -0.9]}><mesh position={[0, 0.3, 0]}><boxGeometry args={[0.8, 0.6, 0.5]} /><meshStandardMaterial color="#5b4636" roughness={0.7} /></mesh>
      <mesh position={[0, 0.95, 0]}><boxGeometry args={[0.7, 0.4, 0.06]} /><meshBasicMaterial color={new THREE.Color(0.3, 0.6, 1.4)} toneMapped={false} /></mesh></group>
    <group position={[-0.7, 1.9, -1.48]}><Calendar years={['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028']} p={p} /></group>
    <group position={[0.6, 0, 0.3]}><MaxAt fn={(tt) => withP(gamer(tt), {yaw: -0.25})} t={t} prop={null} /></group>
    <Post focus={[0.5, 0.7, 0.3]} bokeh={1.4} bloom={0.3} />
  </>;
};

// ---- overlays -------------------------------------------------------------------------------------------------------------------
const Tag = ({o, a, b, text, sub, top = 1450}: {o: number; a: number; b: number; text: string; sub?: string; top?: number}) => {
  if (o < a || o > b) return null; const k = smoother(clamp01((o - a) / 220)), q = clamp01((b - o) / 160);
  return <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: q, transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -6}deg)`}}>
    <div style={{background: '#e31937', color: '#fff', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, padding: '14px 34px', borderRadius: 18, letterSpacing: 3, boxShadow: '0 12px 40px rgba(0,0,0,.45)', textAlign: 'center'}}>
      {text}{sub && <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 1, opacity: 0.9}}>{sub}</div>}</div></div>;
};
const Speedo = ({o, go, shown}: {o: number; go: number; shown: boolean}) => {
  if (!shown) return null; const dt = Math.max(0, (o - go) / 1000), mph = Math.min(60, (33 * dt) * 2.237), done = mph >= 60;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(10,12,18,.82)', border: `4px solid ${done ? '#ffd84a' : '#ffffff55'}`, borderRadius: 28, padding: '14px 40px', fontFamily: 'Inter', color: '#fff', textAlign: 'center'}}>
      <div style={{fontSize: 96, fontWeight: 900, lineHeight: 1}}>{Math.round(mph)}<span style={{fontSize: 40}}> MPH</span></div>
      <div style={{fontSize: 34, fontWeight: 800, color: done ? '#ffd84a' : '#ccc'}}>{done ? '0.81 s (TESLA CLAIM)' : `${dt.toFixed(2)} s`}</div></div></div>;
};
const Clock = ({o, a, b}: {o: number; a: number; b: number}) => {
  if (o < a || o > b) return null; const h = Math.min(7, ((o - a) / (b - a - 400)) * 7), mins = Math.floor((h % 1) * 60);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1430, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(10,12,18,.82)', borderRadius: 26, padding: '12px 36px', fontFamily: 'Inter', color: '#fff', fontSize: 80, fontWeight: 900}}>⏱ {Math.floor(h)}:{String(mins).padStart(2, '0')}<span style={{fontSize: 36}}> HRS</span></div></div>;
};
const CHIPS: Chip[] = [
  {a: S.fleet + 150, b: S.breaks, text: 'EVERY CAR ON EARTH · ~1.5 BILLION'},
  {a: S.sixty + 200, b: T.sixty, text: 'TESLA ROADSTER · REVEALED OCT 15, 2026'},
  {a: S.shuttle + 250, b: S.coffee, text: 'ROADSTER ≈ 3.4 g  ·  SHUTTLE LAUNCH ≤ 3 g'},
  {a: S.jam + 200, b: S.reveal, text: 'THRUSTER "HOP" — HYPOTHETICAL'},
  {a: S.reveal + 150, b: S.refill, text: 'REAL REVEAL: FLEW OVER A LINE OF TESLAS'},
  {a: S.refill + 150, b: S.bill, text: 'THRUSTER REFILL ≈ 6–7 HOURS · NOT ROAD-LEGAL (ROCKET)'},
  {a: S.price + 100, b: S.pile, text: '1.5 BILLION × $200,000 (2017 PRICE)'},
  {a: S.pile + 150, b: S.gdp, text: '≈ $300 TRILLION'},
  {a: S.gdp + 150, b: S.cantbuy, text: 'WORLD GDP ≈ $117T / YEAR → 2.5 YEARS'},
  {a: S.calendar + 150, b: S.end, text: 'PROMISED 2020 → NOW TARGETING 2028'},
  {a: S.end + 500, b: S.fin + 1, text: 'WOULD YOU TRADE? 👇'},
];
const C = chunks(W);
const KEY = /^(minivan|roadster|earth|breaks|60|second|shuttle|coffee|fly|reveal|hours|bill|billion|\$200,000|\$300|trillion|economy|buy|2020|2028|trade)$/i;
const FX: [string, number, number][] = [
  ['morph', 0, 0.75], ['boom', 330, 0.6], ['sparkle', 420, 0.35], ['boing', 260, 0.35], ['ding', T.roadster, 0.25],
  ['wave', S.fleet + 50, 0.5], ['tick', S.breaks + 300, 0.3],
  ['thrust', T.sixty - 130, 0.7], ['launch', T.sixty + 120, 0.75], ['ding', T.sixty + 950, 0.35],
  ['rocket', S.shuttle + 50, 0.6], ['launch', S.shuttle + 350, 0.55],
  ['beep', T.green, 0.35], ['launch', T.green + 350, 0.7], ['cup', T.green + 650, 0.6],
  ['thrust', S.jam + 250, 0.6], ['whoosh_in', S.jam + 500, 0.4], ['thrust', S.reveal + 150, 0.6], ['cheer', S.reveal + 900, 0.35],
  ['hiss', S.refill + 100, 0.35], ['clock', S.refill + 200, 0.25], ['yawn', S.refill + 1000, 0.4],
  ['paper', S.bill + 150, 0.5], ['register', S.price + 100, 0.45], ['paper', S.receipt, 0.45], ['paper', S.receipt + 1200, 0.4],
  ['coins', S.pile + 100, 0.55], ['shimmer', S.gdp, 0.35], ['deny', S.cantbuy + 1200, 0.35],
  ['flip', S.calendar + 300, 0.35], ['flip', S.calendar + 900, 0.35], ['flip', S.calendar + 1500, 0.35], ['flip', S.calendar + 2000, 0.35], ['ding', T.now1 + 250, 0.35],
  ['morph', S.fin - 750, 0.5],
];
const BEDS: [string, number, number, number][] = [['city', S.fleet, S.breaks, 0.3], ['city', S.coffee, S.jam, 0.25], ['wind', S.jam, S.refill, 0.3], ['clock', S.refill, S.bill, 0.2], ['room', S.cantbuy, S.end, 0.25]];
const fr = (ms: number) => Math.round((ms / 1000) * FPS);
const voiceAt = (Wd: Word[], ms: number) => Wd.some((w) => ms >= w.at - 150 && ms <= w.at + 550);
/** voice-forward mix: music ducks hard under speech (user: "make sure voice is easily heard") */
const Mix = () => <>
  <Audio src={staticFile('inside/vo_roadster.wav')} volume={1} />
  <Audio src={staticFile('music/Monkeys_Spinning_Monkeys.mp3')} volume={(f) => { const ms = (f / FPS) * 1000; return (voiceAt(W, ms) ? 0.035 : 0.09) * Math.min(1, (S.fin - ms) / 500); }} />
  {FX.map(([file, t, v], i) => <Sequence key={i} from={Math.max(0, fr(t))}><Audio src={staticFile(`inside/sfx/${file}.wav`)} volume={v * 0.8} /></Sequence>)}
  {BEDS.map(([file, a, b, v], i) => <Sequence key={`b${i}`} from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}><Audio src={staticFile(`inside/sfx/${file}.wav`)} loop volume={(f) => v * Math.min(1, f / 8, (fr(b) - fr(a) - f) / 8)} /></Sequence>)}
</>;

export const RoadsterShort = ({at: atMs}: {at?: number}) => {
  const frame = useCurrentFrame(), o = atMs ?? (frame / FPS) * 1000;
  const glbs = useGLBs(['roadster/hero.glb', 'roadster/lowpoly.glb']);
  const tex = useTextures([...Object.values(ENV), ...ASPH], Object.values(ENV));
  const hero = useMemo(() => (glbs ? makeRoadster(glbs['roadster/hero.glb'], '#b3101c') : null), [glbs]);
  const white = useMemo(() => (glbs ? makeRoadster(glbs['roadster/hero.glb'], '#e9ecef') : null), [glbs]);
  const open = useMemo(() => (glbs ? makeRoadster(glbs['roadster/hero.glb'], '#b3101c', 0.08) : null), [glbs]);
  const fleet = useLowFleet(glbs?.['roadster/lowpoly.glb'], 200, false);
  const {id, a, b} = shotAt(o);
  const c: Ctx | null = glbs && tex && hero && white && open && fleet ? {o, a, b, tex, hero, white, open, fleet} : null;
  return <AbsoluteFill style={{background: '#000'}}>
    {c && <ThreeCanvas width={1080} height={1920} shadows camera={{fov: 40, position: [0, 1.5, 6]}} gl={{toneMapping: THREE.NoToneMapping}}>
      {(id === 'hook' || id === 'breaks' || id === 'end' || id === 'bill' || id === 'receipt') && <Driveway key={id} c={c} kind={id} />}
      {(id === 'fleet' || id === 'price') && <Highway key={id} c={c} kind={id} />}
      {(id === 'sixty' || id === 'shuttle') && <Launch key={id} c={c} kind={id} />}
      {id === 'coffee' && <Coffee6 c={c} />}
      {(id === 'jam' || id === 'reveal') && <Jam key={id} c={c} reveal={id === 'reveal'} />}
      {id === 'refill' && <Refill c={c} />}
      {(id === 'pile' || id === 'gdp') && <Money key={id} c={c} kind={id} />}
      {(id === 'cantbuy' || id === 'calendar') && <Studio key={id} c={c} kind={id} />}
    </ThreeCanvas>}
    <Chips o={o} list={CHIPS} />
    <Tag o={o} a={T.roadster - 100} b={S.fleet} text="TESLA ROADSTER" />
    <Tag o={o} a={S.cantbuy + 300} b={S.calendar} text="COMING SOON" sub="no price · no delivery date" top={1420} />
    <Speedo o={o} go={T.sixty + 120} shown={id === 'sixty' && o > T.sixty - 200} />
    <Clock o={o} a={S.refill + 200} b={S.bill} />
    <Captions o={o} C={C} keyword={KEY} />
    {atMs === undefined && <Mix />}
  </AbsoluteFill>;
};
export const RoadsterStills = ({T: TT = [400, 1500, 3600, 5000, 7400, 9300, 11500, 13700, 15400, 17800, 19900, 20900, 23000, 25800, 28200, 30500, 33500, 37000]}: {T?: number[]}) => {
  const f = useCurrentFrame();
  return <RoadsterShort at={TT[Math.min(f, TT.length - 1)] ?? 0} />;
};
