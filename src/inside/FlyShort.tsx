// INSIDE THE IMPOSSIBLE #2 — "What if every human could fly?" (1080x1920, 30 fps, ~27 s). HYPOTHETICAL, labelled as such.
// Facts (see inside-impossible/videos/002-humans-fly/SCRIPT.md): ~6–7 m wingspan for a 70 kg person and "couldn't flap
// your way up" (Ty Hedrick via Live Science); altitude illness from ~2,450–2,500 m (CDC Yellow Book); ~6.5 °C per km
// (standard atmosphere); 22,372 US wildlife strikes in 2024 (FAA). Shots hang off the narration's word timestamps.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../mgFonts';
import {Max, type Body, type Face} from './kit/character';
import {Captions, Chips, Soundtrack, chunks, loadWords, wordAt, type Chip} from './kit/overlay';
import {Cam, Post, gradientTex, lerp, lerp3, prog, smoother, xrayMat, type V3} from './kit/three';
import {Airliner, Birds, Car, CloudField, Hills, Measure, Rooftop, Swarm, Wings, type WingPose} from './kit/world';
import raw from './vo_fly.words.json';

const FPS = 30, OFF = 250;
const W = loadWords(raw, OFF);
const at = (w: string, n = 0) => wordAt(W, w, n);
const T = {fly: at('fly'), first: at('First'), longer: at('longer'), car: at('car'), plus: at('plus'), even: at('Even'), glide: at("You'd", 1), above: at('Above'),
  sick: at('sick'), and2: at('and', 1), colder: at('colder'), the: at('The'), hit: at('hit'), now: at('Now'), would: at('Would'), wings2: at('wings', 1)};
export const FLY_MS = T.wings2 + 1500;
const S = {hook: 0, span: T.first, car: T.longer, chest: T.plus, flap: T.even, glide: T.glide, alt: T.above, cold: T.and2, sky: T.the, strike: T.hit, swarm: T.now, ask: T.would, end: FLY_MS};
const SH = (Object.keys(S) as (keyof typeof S)[]).filter((k) => k !== 'end');
const shotAt = (o: number) => { let id = SH[0]; for (const k of SH) if (o >= S[k]) id = k; const i = SH.indexOf(id); return {id, a: S[id], b: S[SH[i + 1]] ?? S.end}; };

const Sky = ({top = '#5fb2ff', bottom = '#d9f0ff'}: {top?: string; bottom?: string}) => {
  const bg = useMemo(() => gradientTex(top, bottom), [top, bottom]);
  return <>
    <primitive attach="background" object={bg} />
    <hemisphereLight args={['#ffffff', '#7aa7d6', 0.9]} />
    <directionalLight position={[-6, 9, 8]} intensity={2.6} color="#fff3e0" />
    <directionalLight position={[8, 3, -6]} intensity={2.2} color="#a9e4ff" />
  </>;
};
const blink = (o: number) => (o % 2900 < 110 ? 1 : 0);

// 1 + 12: rooftop, wings unfold / fold
const RoofShot = ({o, ask}: {o: number; ask: boolean}) => {
  const open = ask ? lerp(1, 0.12, smoother(prog(o, S.ask + 300, S.end - 300))) : smoother(prog(o, 420, 980)) * (1 + 0.06 * Math.sin(Math.max(0, o - 980) / 90) * Math.exp(-Math.max(0, o - 980) / 500));
  const pose: WingPose = {open, flap: 0.12 * Math.sin(o / 260) * open};
  const face: Face = ask ? {eyesWide: 0.2, brow: 0.7, smile: 0.35, lookX: 0, blink: blink(o)} : {eyesWide: smoother(prog(o, 600, 900)), brow: 0.5, smile: 0.5 * smoother(prog(o, 900, 1400)), blink: blink(o)};
  const body: Body = {armL: 0.15 + 0.5 * open, armR: 0.15 + 0.5 * open};
  const t = ask ? prog(o, S.ask, S.end) : prog(o, 0, S.span);
  const p: V3 = ask ? lerp3([0.8, -3.2, 15], [0.4, -2.8, 13.5], smoother(t)) : lerp3([0.4, -3.6, 13.5], [0.9, -3.0, 16], smoother(t));
  return <>
    <Sky />
    <Cam p={p} l={[0, -0.8, 0]} fov={42} />
    <CloudField seed="roof" n={7} area={[160, 60]} y={14} yJit={10} scale={[2.5, 5]} drift={[o * 0.002, 0, -60]} />
    <Rooftop />
    <Max f={face} body={body}><Wings pose={pose} /></Max>
    <Post focus={[0, 0, 0]} bokeh={1.6} bloom={0.3} />
  </>;
};
// 2: full wingspan, 3/4 from behind, measuring line
const SpanShot = ({o}: {o: number}) => {
  const t = prog(o, S.span, S.car);
  const tip = 10.2 * 0.98 + 0.3;
  return <>
    <Sky top="#4aa3f5" bottom="#e6f6ff" />
    <Cam p={lerp3([20, 5, 24], [16, 6, 27], smoother(t))} l={[0, -1.2, 0]} fov={46} />
    <CloudField seed="span" n={8} area={[200, 80]} y={-8} yJit={8} scale={[3, 6]} drift={[0, 0, -50]} />
    <Max f={{eyesWide: 0.1, smile: 0.4, blink: blink(o)}} body={{armL: 0.6, armR: 0.6}}><Wings pose={{open: 1, flap: 0.05 * Math.sin(o / 300)}} /></Max>
    {o > S.span + 450 && <Measure a={new THREE.Vector3(-tip, 1.6, -0.8)} b={new THREE.Vector3(tip, 1.6, -0.8)} />}
    <Post focus={[0, -1, 0]} bokeh={1.2} bloom={0.3} />
  </>;
};
// 3: wings vs a car
const CarShot = ({o}: {o: number}) => {
  const t = prog(o, S.car, S.chest);
  return <>
    <Sky top="#4aa3f5" bottom="#e6f6ff" />
    <Cam p={lerp3([0, 9, 40], [0, 8, 37], smoother(t))} l={[0, -2.5, 2]} fov={38} />
    <Rooftop />
    <Car position={[0, -4.55, 8]} />
    <Max f={{smile: 0.4, blink: blink(o)}} body={{armL: 0.6, armR: 0.6}}><Wings pose={{open: 1, flap: 0.04 * Math.sin(o / 300)}} /></Max>
    <Measure a={new THREE.Vector3(-7.25, -0.2, 11.5)} b={new THREE.Vector3(7.25, -0.2, 11.5)} color="#7fe0ff" />
    <Measure a={new THREE.Vector3(-10.4, 2.2, -0.8)} b={new THREE.Vector3(10.4, 2.2, -0.8)} />
    <Post focus={[0, -2, 6]} bokeh={1.2} bloom={0.3} />
  </>;
};
// 4: x-ray chest: pectorals swell, a keel grows
const ChestShot = ({o}: {o: number}) => {
  const m = useMemo(() => ({mus: new THREE.MeshStandardMaterial({color: '#ff4a5e', emissive: new THREE.Color('#ff2a40'), emissiveIntensity: 1.4, transparent: true, opacity: 0.9, roughness: 0.5}),
    bone: new THREE.MeshStandardMaterial({color: '#fff6df', emissive: new THREE.Color('#ffe9b0'), emissiveIntensity: 1.2, roughness: 0.4}), xr: xrayMat('#7fd8ff')}), []);
  const g = smoother(prog(o, S.chest + 300, T.even - 600));
  const t = prog(o, S.chest, S.flap);
  return <>
    <primitive attach="background" object={gradientTex('#0b2340', '#02060f')} />
    <ambientLight intensity={0.4} />
    <Cam p={lerp3([2.6, -1.6, 7.4], [1.4, -1.9, 6.2], smoother(t))} l={[0, -2.0, 0]} fov={36} />
    <Max f={{xray: 1}} />
    {[1, -1].map((s) => <mesh key={s} material={m.mus} position={[0.55 * s, -1.95 + 0.05 * g, 0.45 + 0.25 * g]} rotation={[0, 0, s * 0.35]} scale={[0.55 * (0.5 + 0.6 * g), 0.42 * (0.5 + 0.6 * g), 0.18 + 0.55 * g]}>
      <sphereGeometry args={[1, 40, 28]} /></mesh>)}
    <mesh material={m.bone} position={[0, -2.15, 0.45 + 0.35 * g]} scale={[0.07, 0.75, 0.08 + 0.55 * g]}><sphereGeometry args={[1, 24, 20]} /></mesh>
    <Post focus={[0, -2, 0.6]} bokeh={1.6} bloom={1.0} />
  </>;
};
// 5: flapping on a field, barely hopping
const FlapShot = ({o}: {o: number}) => {
  const t = prog(o, S.flap, S.glide);
  const ph = (o - S.flap) / 95;
  const hop = Math.max(0, Math.sin(ph)) * 0.35;
  return <>
    <Sky top="#69b8ff" bottom="#eaf7ff" />
    <Cam p={lerp3([0, -2.2, 22], [0, -2.6, 19], smoother(t))} l={[0, -1.5, 0]} fov={46} roll={0.02 * Math.sin(o / 60)} />
    <mesh position={[0, -4.6, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[200, 64]} /><meshStandardMaterial color="#7fb862" roughness={1} /></mesh>
    <Hills y={-20} />
    <Max position={[0, hop, 0]} f={{brow: -0.6, jaw: 0.1 + 0.2 * Math.max(0, Math.sin(ph * 2)), eyesWide: 0.1, blink: 0}} body={{armL: 0.8, armR: 0.8, legSwing: 0.15 * Math.sin(ph)}}>
      <Wings pose={{open: 1, flap: 0.75 * Math.sin(ph)}} />
    </Max>
    {Array.from({length: 26}, (_, i) => { const k = ((o - S.flap) / 900 + random(`d${i}`)) % 1;
      return <mesh key={i} position={[(random(`dx${i}`) - 0.5) * 12 * (0.4 + k), -4.4 + k * 1.6, (random(`dz${i}`) - 0.5) * 6]} scale={0.15 + 0.4 * k}>
        <sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#c9b48a" transparent opacity={0.5 * (1 - k)} /></mesh>; })}
    <Post focus={[0, -1, 0]} bokeh={1.4} bloom={0.25} />
  </>;
};
// 6: gliding over hills
const GlideShot = ({o}: {o: number}) => {
  const t = (o - S.glide) / 1000;
  const x = t * 26;
  return <>
    <Sky top="#4f9ff0" bottom="#e2f3ff" />
    <fog attach="fog" args={['#d6ecff', 80, 600]} />
    <Cam p={[x - 13, 13, 7]} l={[x + 3, -1.5, 0]} fov={50} roll={-0.08} />
    <Hills y={-70} />
    <CloudField seed="gl" n={10} area={[260, 120]} y={-30} yJit={14} scale={[4, 8]} drift={[40, 0, -20]} />
    <group position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Max rotation={[-1.25, 0, 0.05]} f={{smile: 0.7, eyesWide: 0.2, blink: blink(o)}} body={{armL: 0.9, armR: 0.9, legsBack: 0.4}}>
        <Wings pose={{open: 1, flap: 0.05 * Math.sin(o / 400)}} />
      </Max>
    </group>
    <Post focus={[x, 0, 0]} bokeh={1.6} bloom={0.3} />
  </>;
};
// 7: climbing through clouds (altimeter), 8: high and cold (frost, breath)
const AltShot = ({o, cold}: {o: number; cold: boolean}) => {
  const a = cold ? S.cold : S.alt, b = cold ? S.sky : S.cold, t = prog(o, a, b);
  const sick = cold ? 0.6 : smoother(prog(o, T.sick - 500, T.sick + 200));
  const frost = cold ? smoother(prog(o, S.cold + 300, S.sky - 400)) : 0;
  const climb = (o - a) / 1000 * 14;
  return <>
    <Sky top={cold ? '#0d2a66' : '#3f8fe8'} bottom={cold ? '#6fa6e8' : '#cfe9ff'} />
    <CloudField seed={cold ? 'cold' : 'alt'} n={cold ? 6 : 12} area={[110, 40]} y={cold ? -40 : 6} yJit={cold ? 6 : 40} scale={[2.5, 5]} drift={[-20, -climb * (cold ? 0.2 : 1), -35]} />
    {cold ? <Cam p={lerp3([3.8, 0.2, 8.2], [3.0, 0.1, 7.0], smoother(t))} l={[0, -0.4, 0]} fov={34} />
      : <Cam p={lerp3([15, -6, 18], [13, -4, 15], smoother(t))} l={[0, -1, 0]} fov={42} />}
    <Max rotation={cold ? [0, 0.3, 0] : [-0.55, 0.4, 0]} f={{sick, frost, eyesWide: cold ? 0.3 : 0.15, brow: cold ? 0.3 : -0.2, jaw: cold ? 0.08 : 0, headTilt: 0.08 * Math.sin(o / 300) * sick, blink: blink(o)}} body={{armL: 0.7, armR: 0.7, legsBack: 0.5}}>
      <Wings pose={{open: 1, flap: cold ? 0.15 * Math.sin(o / 200) : 0.5 * Math.sin(o / 140), frost}} />
    </Max>
    {cold && Array.from({length: 40}, (_, i) => { const k = ((o - S.cold) / 1400 + random(`fz${i}`)) % 1;
      return <mesh key={i} position={[(random(`fx${i}`) - 0.5) * 5, 1.5 - k * 4, (random(`fz2${i}`) - 0.5) * 3 + 1]} scale={0.025 + 0.02 * random(`fs${i}`)}>
        <sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
    {cold && [0, 1, 2].map((i) => { const k = ((o - S.cold) / 1300 + i / 3) % 1;
      return <mesh key={`br${i}`} position={[0.05 + 0.3 * k, -0.45 - 0.1 * k, 1.0 + 0.6 * k]} scale={0.12 + 0.35 * k}><sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35 * (1 - k)} depthWrite={false} /></mesh>; })}
    <Post focus={cold ? [0, 0.14, 0.8] : [0, -1, 0]} bokeh={cold ? 2.2 : 1.4} bloom={0.35} />
  </>;
};
// 9: busy sky; 10: bird strike on the engine; 11: eight billion flyers
const PlaneShot = ({o, kind}: {o: number; kind: 'sky' | 'strike' | 'swarm'}) => {
  const a = S[kind], t = (o - a) / 1000;
  const px = (o - S.sky) / 1000 * 6;
  const hitT = o - (S.strike + 450);
  const shake = kind === 'strike' && hitT > 0 && hitT < 400 ? 0.5 * Math.sin(hitT / 14) * (1 - hitT / 400) : 0;
  const cam: {p: V3; l: V3; fov: number} = kind === 'sky' ? {p: [px - 30, 8, 70], l: [px, 0, 0], fov: 38}
    : kind === 'strike' ? {p: [px + 12 + shake, 0 + shake, 26], l: [px + 1, -2.4, 7], fov: 40} : {p: [px - 50, 30, 150 - t * 10], l: [px, 0, 0], fov: 44};
  return <>
    <Sky top="#3d8de6" bottom="#d8efff" />
    <fog attach="fog" args={['#cfe6ff', 120, 700]} />
    <Cam p={cam.p} l={cam.l} fov={cam.fov} />
    <CloudField seed="pl" n={12} area={[400, 200]} y={-30} yJit={30} scale={[5, 10]} drift={[px * 0.3, 0, -60]} />
    <Airliner position={[px, 0, 0]} rotation={[0, 0, 0.03 * Math.sin(o / 900)]} />
    {kind !== 'swarm' && <Birds o={o} n={kind === 'sky' ? 24 : 10} center={kind === 'sky' ? [px + 40 - t * 12, 2, 6] : [px + 10 - Math.max(0, (o - S.strike) / 1000) * 14, -2.4, 7]} spread={kind === 'sky' ? [14, 6, 10] : [3, 1.5, 2]} size={0.9} />}
    {kind === 'strike' && hitT > 0 && hitT < 700 && Array.from({length: 30}, (_, i) => { const k = hitT / 700;
      return <mesh key={i} position={[px + 3 + (random(`ex${i}`) - 0.5) * 8 * k, -2.4 + (random(`ey${i}`) - 0.5) * 6 * k, 7 + (random(`ez${i}`) - 0.3) * 5 * k]} rotation={[i, k * 5 + i, 0]} scale={[0.35, 0.12, 0.02]}>
        <boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={i % 2 ? '#ffffff' : '#555555'} transparent opacity={1 - k} /></mesh>; })}
    {kind === 'strike' && hitT > 0 && hitT < 160 && <pointLight position={[px + 1, -2.4, 9]} intensity={40 * (1 - hitT / 160)} distance={30} color="#fff0c0" />}
    {kind === 'swarm' && <Swarm o={o} n={900} center={[px, 0, 0]} spread={[260, 90, 160]} />}
    <Post focus={kind === 'strike' ? [px + 1, -2.4, 7] : [px, 0, 0]} bokeh={kind === 'strike' ? 2 : 1} bloom={0.3} />
  </>;
};

const KEY = /^(fly|wings|seven|meters|car|chest|muscle|bird|glide|kilometers|sick|six|colder|crowded|20,000|eight|billion)$/i;
const C = chunks(W);
const CHIPS: Chip[] = [
  {a: 200, b: S.span, text: 'HYPOTHETICAL', dot: '#7fe0ff'},
  {a: S.span + 200, b: S.car, text: 'WINGSPAN ≈ 6–7 m (70 kg PERSON)', dot: '#ffd84a'},
  {a: S.car + 100, b: S.chest, text: 'CAR ≈ 4.5 m · WINGS ≈ 6–7 m', dot: '#7fe0ff'},
  {a: S.chest + 200, b: S.flap, text: 'BIRDS: ~16–18% OF MUSCLE IS FOR FLYING', dot: '#ff4a5e'},
  {a: S.flap + 200, b: S.glide, text: 'TOO HEAVY TO FLAP UP', dot: '#ff8a3a'},
  {a: S.glide + 100, b: S.alt, text: 'SO… YOU GLIDE', dot: '#5fd36a'},
  {a: S.alt + 150, b: S.cold, text: (o) => `ALTITUDE ${Math.round(lerp(400, 3200, prog(o, S.alt, S.cold)) / 50) * 50} m${o > T.sick - 400 ? ' · SICKNESS RISK' : ''}`, dot: '#b9d99a'},
  {a: S.cold + 150, b: S.sky, text: (o) => { const km = lerp(2.5, 5, prog(o, S.cold, S.sky)); return `${km.toFixed(1)} km · ${Math.round(15 - 6.5 * km)} °C (≈ −6.5 °C / km)`; }, dot: '#7fd8ff'},
  {a: S.sky + 150, b: S.strike, text: 'THE SKY IS ALREADY BUSY', dot: '#ffd84a'},
  {a: S.strike + 150, b: S.swarm, text: 'FAA: 22,372 WILDLIFE STRIKES (US, 2024)', dot: '#ff2a2a'},
  {a: S.swarm + 150, b: S.ask, text: '+ 8,000,000,000 FLYERS', dot: '#ff7a2f'},
  {a: S.ask + 200, b: S.end, text: 'WOULD YOU? 👇', dot: '#ffd84a'},
];
const FX: [string, number, number][] = [
  ['wing_burst', 380, 0.8], ['shimmer', 900, 0.3], ['flap', S.span + 120, 0.4], ['tick', S.span + 450, 0.35], ['honk', S.car + 150, 0.5], ['tick', S.car + 200, 0.3],
  ['shimmer', S.chest, 0.4], ['grow', S.chest + 300, 0.5],
  ...Array.from({length: 13}, (_, i): [string, number, number] => ['flap', S.flap + i * 197, 0.55]), ['strain', S.flap + 600, 0.35],
  ['wing_burst', S.glide - 60, 0.5], ['dizzy', T.sick - 300, 0.4], ['crackle', S.cold + 300, 0.5], ['crackle', S.cold + 1600, 0.45],
  ['strike', S.strike + 450, 0.9], ['alarm', S.strike + 700, 0.3], ['alarm', S.strike + 1300, 0.25], ['swarm', S.swarm, 0.6], ['wing_burst', S.ask + 300, 0.35],
];
const BEDS: [string, number, number, number][] = [['wind', S.glide, S.sky, 0.6], ['jet', S.sky, S.ask, 0.5], ['wind', 0, S.chest, 0.25], ['wind', S.ask, S.end, 0.25]];

export const FlyShort = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const {id} = shotAt(o);
  return <AbsoluteFill style={{background: '#000'}}>
    <ThreeCanvas width={1080} height={1920} camera={{fov: 40, position: [0, 0, 10]}} gl={{toneMapping: THREE.NoToneMapping}}>
      {id === 'hook' && <RoofShot o={o} ask={false} />}
      {id === 'span' && <SpanShot o={o} />}
      {id === 'car' && <CarShot o={o} />}
      {id === 'chest' && <ChestShot o={o} />}
      {id === 'flap' && <FlapShot o={o} />}
      {id === 'glide' && <GlideShot o={o} />}
      {(id === 'alt' || id === 'cold') && <AltShot key={id} o={o} cold={id === 'cold'} />}
      {(id === 'sky' || id === 'strike' || id === 'swarm') && <PlaneShot key={id} o={o} kind={id} />}
      {id === 'ask' && <RoofShot o={o} ask />}
    </ThreeCanvas>
    <Chips o={o} list={CHIPS} />
    <Captions o={o} C={C} keyword={KEY} />
    <Soundtrack vo="inside/vo_fly.wav" off={OFF} W={W} total={FLY_MS} fx={FX} beds={BEDS} />
  </AbsoluteFill>;
};
