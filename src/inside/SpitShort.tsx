// INSIDE THE IMPOSSIBLE #4 — "How many times would you have to spit to fill the entire ocean?" (1080x1920, 30 fps, ~30.7 s).
// Facts (inside-impossible/videos/004-spit-ocean/SCRIPT.md): ocean ≈ 1.335 billion km³ (NOAA); one big spit = a teaspoon
// (5 mL, our stated assumption) → ≈ 2.67 × 10²³ spits; 1/s → ≈ 8.5 quadrillion years ≈ 600,000 × 13.8 Gyr (universe age);
// saliva ≈ 0.5–1.5 L/day; 8 billion people → ≈ 300–450 million years. Exaggerated on purpose, numbers kept honest.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../mgFonts';
import {textTex} from '../dogs/props';
import {Max, type Body, type Face} from './kit/character';
import {Bottle, Coast, Crowd, Drop, Earth, Galaxy, Spit, SpitRain, Stars, Teaspoon, WaterBall} from './kit/ocean';
import {Captions, Chips, Soundtrack, chunks, loadWords, wordAt, type Chip} from './kit/overlay';
import {Cam, Env, Post, clamp01, gradientTex, lerp, lerp3, prog, smoother, type V3} from './kit/three';
import raw from './vo_spit.words.json';

const FPS = 30, OFF = 250;
const W = loadWords(raw, OFF);
const at = (w: string, n = 0) => wordAt(W, w, n);
const T = {spit: at('spit'), the1: at('the', 1), billion: at('billion'), say: at('say'), big: at('big'), thats: at("that's"), at: at('at'), that: at('that'),
  six: at('600000'), and: at('and'), liter: at('liter'), so: at('so'), all: at('all'), still: at('still'), ready: at('ready')};
export const SPIT_MS = W[W.length - 1].at + 600 + 1500;
const S = {hook: 0, earth: T.the1, ball: T.billion, spoon: T.say, count: T.thats, lapse: T.at, lapse2: T.that, cosmos: T.six, glands: T.and, crowd: T.so, crowd2: T.all,
  fill: T.still, end: T.ready, fin: SPIT_MS};
type ShotId = Exclude<keyof typeof S, 'fin'>;
const SH = (Object.keys(S) as (keyof typeof S)[]).filter((k) => k !== 'fin') as ShotId[];
const shotAt = (o: number) => { let id = SH[0]; for (const k of SH) if (o >= S[k]) id = k; const i = SH.indexOf(id); return {id, a: S[id], b: S[SH[i + 1]] ?? S.fin}; };
const ease = (o: number, a: number, b: number) => smoother(prog(o, a, b));
const bell = (o: number, a: number, b: number) => Math.sin(Math.PI * clamp01((o - a) / (b - a)));
const blink = (o: number) => (o % 2700 < 110 ? 1 : 0);
const MOUTH: V3 = [0, -0.48, 1.0];
/** mouth point / spit velocity for Max turned by yaw (he faces +z at yaw 0) */
const mouthAt = (yaw: number, x = 0): V3 => [x + Math.sin(yaw), -0.48, Math.cos(yaw)];
const spitV = (yaw: number, fwd: number, up: number): V3 => [Math.sin(yaw) * fwd, up, Math.cos(yaw) * fwd];
const FAR = {near: 0.1, far: 4000};

const Sky = ({day = 1, fog = null}: {day?: number; fog?: [string, number, number] | null}) => {
  const top = new THREE.Color('#0b1430').lerp(new THREE.Color('#5fb2ff'), day), bot = new THREE.Color('#1d2a4a').lerp(new THREE.Color('#d9f0ff'), day);
  const key = `${top.getHexString()}${bot.getHexString()}`;
  const bg = useMemo(() => gradientTex(`#${top.getHexString()}`, `#${bot.getHexString()}`), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>
    <Env bg={bg} fog={fog ? [`#${bot.getHexString()}`, fog[1], fog[2]] : null} />
    <hemisphereLight args={['#ffffff', '#7aa7d6', 0.25 + 0.65 * day]} />
    <directionalLight position={[-6, 9, 8]} intensity={0.4 + 2.2 * day} color="#fff3e0" />
    <directionalLight position={[8, 3, -6]} intensity={0.6 + 1.6 * day} color="#a9e4ff" />
  </>;
};
const Space = () => <>
  <Env bg="#02040b" />
  <ambientLight intensity={0.08} />
  <directionalLight position={[-5, 2, 4]} intensity={3.2} color="#fff6e8" />
  <Stars />
</>;

// 1 + 13: Max at the edge of a drained ocean (end: it's full again, he wipes his mouth)
const HookShot = ({o, end}: {o: number; end: boolean}) => {
  const sp = end ? S.end - 2000 : T.spit;
  const puff = end ? 0 : bell(o, sp - 700, sp + 40);
  const f: Face = end ? {smile: 0.7, lookX: 0.35, lookY: 0.1, brow: 0.6, blink: blink(o)} : {puff, jaw: o > sp && o < sp + 260 ? 0.35 : 0.05, eyesWide: smoother(prog(o, sp + 300, sp + 700)) * 0.7, lookY: -0.4, brow: 0.3, blink: blink(o)};
  const wipe = end ? bell(o, S.end + 250, S.end + 1300) : 0;
  const body: Body = {armL: 0.15, armR: 0.15 + 0.2 * wipe, armRFwd: 2.4 * wipe};
  const k = end ? ease(o, S.end, S.fin) : ease(o, 0, S.earth);
  const p: V3 = end ? lerp3([1.8, 1.4, -10.5], [1.4, 1.0, -8.8], k) : lerp3([1.2, 3.4, -9.8], [1.5, 4.0, -11.5], k);
  const turn = end ? lerp(0.6, 3.0, ease(o, S.end, S.end + 700)) : 0.6;
  return <>
    <Sky fog={['', 250, 1300]} />
    <Cam p={p} l={end ? [0.5, -12, 60] : [4, -45, 100]} fov={46} {...FAR} />
    <Coast water={end ? -14 : null} />
    <Max f={f} body={body} rotation={[0, turn, 0]} />
    {!end && <Spit p0={mouthAt(turn)} v={spitV(turn, 8, 2.6)} t={(o - sp) / 1000} floorY={-120} r={0.3} />}
    <Post focus={[0, -1, 0]} bokeh={1.4} bloom={0.25} />
  </>;
};

// 2-3: Earth from space, then the oceans drain into one ball of water beside it (true to scale: ~1,370 km across)
const EarthShot = ({o, ball}: {o: number; ball: boolean}) => {
  const dry = ball ? ease(o, S.ball, S.ball + 900) : 0, g = ball ? ease(o, S.ball + 100, S.ball + 1100) : 0;
  const k = ball ? ease(o, S.ball, S.spoon) : ease(o, S.earth, S.ball);
  const p: V3 = ball ? lerp3([0.1, 0.5, 5.4], [0.15, 0.6, 4.6], k) : lerp3([0, 0.35, 4.2], [0.2, 0.3, 3.3], k);
  const l: V3 = ball ? [0, 0.55, 0] : [0, 0, 0];
  const flow = ball ? Array.from({length: 40}, (_, i) => { const u = ((o - S.ball) / 900 + i / 40) % 1; if (o - S.ball > 1300) return null;
    const a = i * 2.4, from: V3 = [Math.cos(a) * 0.95, Math.sin(a * 1.3) * 0.6, Math.abs(Math.sin(a)) * 0.5 + 0.5], to: V3 = [0, 1.5, 0.3];
    return <Drop key={i} position={lerp3(from, to, smoother(u))} r={0.012 * (1 - u * 0.5)} />; }) : null;
  return <>
    <Space />
    <Cam p={p} l={l} fov={38} {...FAR} />
    <Earth rot={o / 2600} dry={dry} />
    {ball && g > 0 && <group position={[0, 1.5, 0.3]}><WaterBall r={0.107 * g} /></group>}
    {flow}
    <Post focus={ball ? [0, 0.8, 0.3] : [0, 0, 0]} bokeh={0.5} bloom={0.6} />
  </>;
};

// 4: one big spit = a teaspoon
const SpoonShot = ({o}: {o: number}) => {
  const sp = T.big + 150, t = (o - sp) / 1000, land = 0.26, fill = clamp01((t - land) / 0.5);
  const f: Face = {puff: bell(o, sp - 650, sp + 30), jaw: t > 0 && t < 0.25 ? 0.4 : 0.06, eyesWide: 0.2, lookY: -0.8, brow: 0.45, blink: blink(o)};
  return <>
    <Sky />
    <Cam p={lerp3([1.9, -0.5, 5.2], [1.5, -0.65, 4.5], ease(o, S.spoon, S.count))} l={[0.1, -1.0, 1.5]} fov={38} />
    <Max f={f} body={{}} />
    <group position={[0, -1.3, 2.1]} rotation={[0.08, -Math.PI / 2, 0]}><Teaspoon fill={fill} /></group>
    {t > 0 && t < land && <Spit p0={MOUTH} v={[0, -0.6, 4.2]} t={t} r={0.11} />}
    <Post focus={[0, -1.2, 2.0]} bokeh={2.0} bloom={0.3} />
  </>;
};

// 5: the count explodes — drops multiply until they fill the frame
const CountShot = ({o}: {o: number}) => {
  const k = prog(o, S.count, S.lapse - 200), n = Math.min(2600, Math.floor(Math.pow(2, 1 + 11.4 * k)));
  const im = useMemo(() => new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshPhysicalMaterial({color: '#eef7ff', roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.8, emissive: new THREE.Color('#9ec9ff'), emissiveIntensity: 0.15}), 2600), []);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), R = 0.35 * Math.cbrt(n);
  for (let i = 0; i < 2600; i++) {
    const born = Math.log2(i + 1) / 11.4, a = clamp01((k - born) * 30), y = 1 - (2 * (i + 0.5)) / Math.max(n, 1), rr = Math.sqrt(Math.max(0, 1 - y * y)), th = i * 2.39996;
    const d = R * Math.cbrt((i + 1) / Math.max(n, 1));
    s.setScalar(i < n ? 0.12 * a * (1.15 - 0.3 * random(`cs${i}`)) : 0); m4.compose(new THREE.Vector3(Math.cos(th) * rr * d, y * d, Math.sin(th) * rr * d), q, s); im.setMatrixAt(i, m4);
  }
  im.instanceMatrix.needsUpdate = true; im.frustumCulled = false;
  return <>
    <Sky />
    <Cam p={[0.4, 0.3, 2.2 + 3.2 * R]} l={[0, 0, 0]} fov={40} />
    <group rotation={[0.2, o / 1800, 0]}><primitive object={im} /></group>
    <Post focus={[0, 0, R]} bokeh={1.2} bloom={0.35} />
  </>;
};

// 6-7: one spit per second, forever — days whip by, the beard grows to the floor
const LapseShot = ({o, late}: {o: number; late: boolean}) => {
  const per = 260, cyc = (o % per) / per, day = 0.5 + 0.5 * Math.cos((2 * Math.PI * o) / 520);
  const age = late ? lerp(0.45, 1, ease(o, S.lapse2, S.cosmos)) : lerp(0, 0.4, ease(o, S.lapse, S.lapse2));
  const f: Face = {puff: cyc < 0.6 ? cyc / 0.6 : 0, jaw: cyc > 0.6 && cyc < 0.8 ? 0.35 : 0.05, beard: age, gray: Math.min(1, age * 1.3), brow: 0.2 + 0.3 * age, blink: age > 0.8 ? 0.6 : blink(o), lookY: -0.3};
  const spits = Array.from({length: 8}, (_, i) => { const t0 = (Math.floor(o / per) - i) * per + 0.6 * per; return (o - t0) / 1000; });
  const sunA = (o / 520) * Math.PI * 2;
  const p: V3 = late ? lerp3([12, -0.5, 9], [14, -1, 11], ease(o, S.lapse2, S.cosmos)) : lerp3([7.5, 0.2, 5.5], [8.2, 0, 6.5], ease(o, S.lapse, S.lapse2));
  return <>
    <Sky day={day} fog={['', 60, 700]} />
    <mesh position={[Math.cos(sunA) * 300, 120 + Math.sin(sunA) * 200, -400]}><sphereGeometry args={[18, 24, 16]} /><meshBasicMaterial color={day > 0.5 ? '#fff2c0' : '#dfe6ff'} toneMapped={false} /></mesh>
    <Cam p={p} l={late ? [0, -2.4, 0.6] : [0, -1.0, 0.6]} fov={late ? 40 : 38} {...FAR} />
    <Coast />
    <Max f={f} body={{armL: 0.12, armR: 0.12}} rotation={[0, 0.25, 0]} />
    {spits.map((t, i) => <Spit key={i} p0={MOUTH} v={[0.4, 2.2, 7.5]} t={t} floorY={-60} r={0.13} />)}
    <Post focus={[0, -1.5, 0.5]} bokeh={1.6} bloom={0.3} />
  </>;
};

// 8: zoom out past Earth to the whole galaxy (the universe is only 1/600,000 of the job)
const CosmosShot = ({o}: {o: number}) => {
  const k = ease(o, S.cosmos, S.glands - 100), d = 3 * Math.pow(400, k);
  const dir = new THREE.Vector3(0.35, 0.75, 0.55).normalize();
  const look = lerp3([0, 0, 0], [-150, 0, 0], smoother(clamp01((k - 0.3) / 0.7)));
  return <>
    <Space />
    <Cam p={[dir.x * d, dir.y * d, dir.z * d]} l={look} fov={40} near={0.05} far={6000} />
    <Earth rot={o / 2600} />
    <group position={[-150, -2, 0]}><Galaxy R={300} rot={o / 9000} /></group>
    <Post focus={look} bokeh={0.6} bloom={0.7} />
  </>;
};

// 9: x-ray head — the salivary glands only make about a liter a day
const GLANDS: V3[] = [[0.78, -0.2, 0.1], [-0.78, -0.2, 0.1], [0.48, -0.78, 0.35], [-0.48, -0.78, 0.35], [0.17, -0.72, 0.62], [-0.17, -0.72, 0.62]];
const GlandShot = ({o}: {o: number}) => {
  const k = ease(o, S.glands, S.crowd), pulse = 0.75 + 0.25 * Math.sin(o / 120);
  const label = textTex(['≈ 1 L', 'PER DAY'], {w: 400, h: 200, bg: 'rgba(255,255,255,0.92)', fg: '#16324f', size: 64, radius: 30});
  return <>
    <Sky day={0.1} />
    <Cam p={lerp3([2.2, -0.8, 8.8], [1.9, -0.9, 7.8], k)} l={[-0.5, -1.6, 0.6]} fov={40} />
    <Max f={{xray: 1}} body={{}} rotation={[0, 0.5, 0]}>
      {GLANDS.map((g, i) => <mesh key={i} position={g} scale={[0.17, 0.12, 0.14]}><sphereGeometry args={[1, 20, 14]} /><meshBasicMaterial color={new THREE.Color('#ffd84a').multiplyScalar(1.6 * pulse)} toneMapped={false} /></mesh>)}
      {GLANDS.flatMap((g, i) => [0, 1, 2].map((j) => { const u = ((o / 700) + j / 3 + i * 0.13) % 1; return <Drop key={`${i}-${j}`} position={lerp3(g, [0, -0.45, 0.85], u)} r={0.035} />; }))}
    </Max>
    <group position={[-1.15, -4.5, 2.7]} scale={0.8}><Bottle fill={0.08 + 0.85 * k} label={label} /></group>
    <Post focus={[1, -1, 0.5]} bokeh={1.6} bloom={0.6} />
  </>;
};

// 10: everyone joins — Max clones pop in along the edge and spit together
const CrowdShot = ({o}: {o: number}) => {
  const xs = [0, -3.4, 3.4, -6.8, 6.8, -10.2, 10.2];
  const vol = [T.so + 900, T.so + 1500];
  const k = ease(o, S.crowd, S.crowd2);
  return <>
    <Sky fog={['', 60, 700]} />
    <Cam p={lerp3([0, -3.0, 22], [0, -2.0, 30], k)} l={[0, -5.5, 0]} fov={44} {...FAR} />
    <Coast />
    {xs.map((x, i) => { const pop = i === 0 ? 1 : smoother(clamp01((o - S.crowd - 120 * i) / 220)); if (pop <= 0) return null;
      const near = vol.find((v) => o > v - 700 && o < v + 300) ?? vol[0];
      const f: Face = {puff: bell(o, near - 650, near + 20), jaw: o > near && o < near + 220 ? 0.35 : 0.05, smile: 0.3, blink: blink(o + i * 400), eyesWide: 0.3};
      return <group key={i}>
        <Max f={f} body={{}} position={[x, -4.5 * (1 - pop), 0]} scale={pop} rotation={[0, -x * 0.02, 0]} />
        {vol.map((v, j) => <Spit key={j} p0={[x, -0.48, 1.0]} v={[x * 0.03, 2.5, 7.5]} t={(o - v) / 1000} floorY={-60} r={0.16} />)}
      </group>; })}
    <Post focus={[0, -1, 0]} bokeh={1.2} bloom={0.3} />
  </>;
};

// 11-12: 8 billion along every coast; spit rain; the basin fills… very slowly
const COAST_PTS: V3[] = Array.from({length: 1500}, (_, i) => { const row = i % 3, j = Math.floor(i / 3); return [-375 + j * 1.5 + (random(`cp${i}`) - 0.5) * 0.6, -4.5, -0.5 - row * 2.4 - random(`cq${i}`) * 0.8]; });
const MassShot = ({o, fill}: {o: number; fill: boolean}) => {
  const k = fill ? ease(o, S.fill, S.end) : ease(o, S.crowd2, S.fill), day = fill ? 0.5 + 0.5 * Math.cos((2 * Math.PI * o) / 450) : 1;
  const water = fill ? lerp(-118, -62, k) : null;
  const p: V3 = fill ? lerp3([-70, -40, 165], [-62, -36, 150], k) : lerp3([40, 26, 70], [22, 34, 92], k);
  const l: V3 = fill ? [10, -58, 0] : [0, -14, 0];
  return <>
    <Sky day={day} fog={['', 80, 900]} />
    <Cam p={p} l={l} fov={44} {...FAR} />
    <Coast water={water} />
    <Crowd pts={COAST_PTS} scale={1} />
    <SpitRain t={o / 1000} n={2200} area={[[-375, 0, 2.5], [375, 0, 9]]} top={-3} bottom={water ?? -120} speed={36} r={0.3} />
    <Post focus={fill ? [0, -60, 10] : [0, -6, 0]} bokeh={0.8} bloom={0.3} />
  </>;
};

// ---- overlays -----------------------------------------------------------------------------------------------------------------------
const fmt = (n: number) => { if (n < 1e15) return Math.floor(n).toLocaleString('en-US'); const e = Math.floor(Math.log10(n)), lead = Math.floor(n / 10 ** (e - 2)); return `${lead}${'0'.repeat(e - 2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
const CHIPS: Chip[] = [
  {a: 600, b: S.earth, text: 'HYPOTHETICAL', dot: '#7fd8ff'},
  {a: at('holds'), b: S.ball, text: 'OCEAN ≈ 1,335,000,000 km³'},
  {a: S.ball + 600, b: S.spoon, text: 'ALL OF IT = ONE BALL ~1,370 km WIDE'},
  {a: S.spoon + 300, b: S.count, text: 'ASSUME: 1 SPIT = 1 TEASPOON (5 mL)'},
  {a: S.count + 200, b: S.lapse, text: '≈ 2.67 × 10²³ SPITS'},
  {a: S.lapse + 200, b: S.cosmos, text: (o) => `1 SPIT / SECOND · YEAR ${fmt(Math.pow(10, 15.927 * smoother(prog(o, S.lapse + 200, S.cosmos - 300))))}`},
  {a: S.cosmos + 300, b: S.glands, text: 'UNIVERSE: 13.8 BILLION YRS · YOU: ×600,000'},
  {a: S.glands + 250, b: S.crowd, text: 'YOUR MOUTH: ~0.5–1.5 L OF SPIT A DAY'},
  {a: S.crowd2 + 200, b: S.fill, text: '8,000,000,000 SPITTERS'},
  {a: S.fill + 200, b: S.end, text: 'STILL ~300–450 MILLION YEARS'},
  {a: S.end + 300, b: S.fin + 1, text: 'WOULD YOU HELP? 👇'},
];
/** the giant rolling count in the count shot */
const Counter = ({o}: {o: number}) => {
  if (o < S.count + 150 || o >= S.lapse) return null;
  const k = smoother(prog(o, S.count + 150, T.thats + 1500)), v = k >= 1 ? 2.67e23 : Math.pow(10, k * 23.43);
  return <div style={{position: 'absolute', left: 30, right: 30, top: 640, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 54, color: '#fff', lineHeight: 1.1,
    textShadow: '0 6px 24px rgba(0,0,0,.55), 0 0 2px rgba(0,0,0,.9)', letterSpacing: 1}}>{k >= 1 ? '267,000,000,000,000,000,000,000' : fmt(v)}<div style={{fontSize: 40, color: '#FFD84A', marginTop: 10}}>SPITS</div></div>;
};
const KEY = /^(spit|ocean|1\.3|teaspoon|267|sextillion|quadrillion|600,000|universe|liter|everyone|billion|millions|ready)$/i;
const C = chunks(W);
const FX: [string, number, number][] = [
  ['puff', T.spit - 650, 0.4], ['spit', T.spit, 0.8], ['whoosh_in', T.spit + 200, 0.25], ['plip', T.spit + 2600, 0.35],
  ['shimmer', S.earth, 0.3], ['drain', S.ball, 0.55], ['ding', S.ball + 1100, 0.25],
  ['puff', T.big + 150 - 650, 0.35], ['spit', T.big + 150, 0.7], ['drip', T.big + 150 + 320, 0.6],
  ['counter', S.count + 150, 0.5], ['pop', S.count + 300, 0.3], ['pop', S.count + 900, 0.3],
  ['riser', S.lapse, 0.45], ['spit_rapid', S.lapse, 0.5], ['ding', S.cosmos - 250, 0.3],
  ['whoosh_in', S.cosmos, 0.45], ['shimmer', S.cosmos + 600, 0.4],
  ['squelch', S.glands + 200, 0.4], ['pour', S.glands + 300, 0.4], ['cough', T.liter + 650, 0.45],
  ['pop', S.crowd + 120, 0.3], ['pop', S.crowd + 240, 0.3], ['pop', S.crowd + 360, 0.3], ['pop', S.crowd + 480, 0.3], ['crowd_spit', T.so + 900, 0.6], ['crowd_spit', T.so + 1500, 0.5],
  ['spit_rain', S.crowd2, 0.55], ['water_rise', S.fill, 0.5], ['ding', S.end + 200, 0.3],
];
const BEDS: [string, number, number, number][] = [['wind', 0, S.earth, 0.3], ['clock', S.lapse, S.cosmos, 0.35], ['wind', S.crowd, S.fill, 0.3], ['wind', S.end, S.fin, 0.3]];

export const SpitShort = ({at: atMs}: {at?: number}) => {
  const frame = useCurrentFrame(), o = atMs ?? (frame / FPS) * 1000;
  const {id} = shotAt(o);
  return <AbsoluteFill style={{background: '#000'}}>
    <ThreeCanvas width={1080} height={1920} camera={{fov: 40, position: [0, 0, 10]}} gl={{toneMapping: THREE.NoToneMapping}}>
      {(id === 'hook' || id === 'end') && <HookShot key={id} o={o} end={id === 'end'} />}
      {(id === 'earth' || id === 'ball') && <EarthShot key={id} o={o} ball={id === 'ball'} />}
      {id === 'spoon' && <SpoonShot o={o} />}
      {id === 'count' && <CountShot o={o} />}
      {(id === 'lapse' || id === 'lapse2') && <LapseShot key={id} o={o} late={id === 'lapse2'} />}
      {id === 'cosmos' && <CosmosShot o={o} />}
      {id === 'glands' && <GlandShot o={o} />}
      {id === 'crowd' && <CrowdShot o={o} />}
      {(id === 'crowd2' || id === 'fill') && <MassShot key={id} o={o} fill={id === 'fill'} />}
    </ThreeCanvas>
    <Chips o={o} list={CHIPS} />
    <Counter o={o} />
    <Captions o={o} C={C} keyword={KEY} />
    <Soundtrack vo="inside/vo_spit.wav" off={OFF} W={W} total={SPIT_MS} fx={FX} beds={BEDS} music="music/Sneaky_Snitch.mp3" />
  </AbsoluteFill>;
};
/** stills sheet: frame i shows the short at T[i] ms */
export const SpitStills = ({T: TT = [1500, 2600, 4400, 6400, 8300, 10500, 13000, 15200, 17000, 19800, 22200, 24500, 27000, 29600]}: {T?: number[]}) => {
  const f = useCurrentFrame();
  return <SpitShort at={TT[Math.min(f, TT.length - 1)] ?? 0} />;
};
