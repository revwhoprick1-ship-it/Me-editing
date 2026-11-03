// v23: 3D-explainer edit (Zack D. Films-type) of the NBA GOAT clip. Real podcast audio, every shot rebuilt in 3D:
// studio table with the three people → "greatest of all time" trophy → thinking close-up with a clock → inside his head
// (player cards spinning) → "gotta be" → Dellavedova hero shot on a court with a fact label → the laugh → tension.
// No branding of any kind on screen. Characters: one free rigged avatar (rig.tsx), recoloured + simple hair/caps.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, random, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {Music, SfxTrack, SpeechTrack, sfx, timeline} from '../e3/kit';
import {MONT} from '../e3/bars';
import {wordsFrom} from '../jorho/kit';
import goatWords from '../plans/data/nba_goat.words.json';
import env from './speech_env.json';
import {HERO, LAUGH_BACK, LAUGH_FWD, SIT, THINK} from './poses';
import {Person, track, useAvatar, type Look, type Pose, type V3} from './rig';

const FPS = 30;
const tl = timeline([[2150, 18810]]);
export const GOATX_MS = tl.total; // 16.66 s
const S = (src: number) => src - 2150; // source ms → output ms
// beats (output ms)
const B = {nba: S(4480), greatest: S(5620), trophy: S(6550), think: S(7350), mind: S(9950), gotta: S(12780), della: S(13820), laugh: S(15050), tension: S(17400), end: tl.total};

// who talks when (source ms) → mouth from the real audio envelope
const TALK: Record<'L' | 'M' | 'R', [number, number][]> = {L: [[2200, 3700], [5550, 7400]], M: [[4400, 5300], [12700, 15050]], R: [[17400, 18810]]};
const LAUGHING: [number, number] = [15050, 17400];
const envAt = (src: number) => (env as number[])[Math.max(0, Math.min((env as number[]).length - 1, Math.round((src / 1000) * FPS)))] ?? 0;
const mouthOf = (who: 'L' | 'M' | 'R', o: number) => {
  const src = o + 2150;
  if (TALK[who].some(([a, b]) => src >= a && src < b)) return Math.min(1, envAt(src) * 1.1);
  if (who !== 'M' && src >= LAUGHING[0] && src < LAUGHING[1]) return 0.35 + 0.5 * envAt(src);
  return 0;
};

const QB: Look = {top: '#4a3020', bottom: '#2b3445', cap: '#121212', wig: '#d9b56a', hideHat: true, hideBeard: true};
const HOST_L: Look = {top: '#141414', bottom: '#2b3445', wig: '#e9c46a', band: '#16a6ab', hideHat: true, hideBeard: true};
const HOST_R: Look = {top: '#1f1f22', bottom: '#33302c', wig: '#cfa556', hideHat: true};
const DELLA: Look = {top: '#3a0f1e', bottom: '#3a0f1e', shoes: '#f2f2f2', hideHat: true, chest: '8'};

const osc = (o: number, ms: number, amp: number) => amp * Math.sin((o / ms) * Math.PI * 2);
const add = (p: Pose, bone: string, d: V3): Pose => {
  const b = (p[bone] as V3 | undefined) ?? [0, 0, 0];
  return {...p, [bone]: [b[0] + d[0], b[1] + d[1], b[2] + d[2]]};
};
const poseM = (o: number): Pose => {
  let p = track([
    [0, {...SIT, Head: [0, -28, 0]}], [B.nba - 200, {...SIT, Head: [0, -28, 0]}], [B.nba + 100, {...SIT, Head: [-4, -8, 9], Spine: [-4, 0, 0]}],
    [B.greatest - 100, {...SIT, Head: [-4, -8, 9]}], [B.greatest + 200, {...SIT, Head: [0, -25, 0]}], [B.think - 200, {...SIT, Head: [0, -25, 0]}],
    [B.think + 250, THINK], [B.gotta - 250, THINK], [B.gotta + 100, {...SIT, Spine: [10, 0, 0], Head: [-6, 0, 0]}], [B.laugh - 200, {...SIT, Spine: [10, 0, 0], Head: [-6, 0, 0]}],
    [B.laugh + 200, {...SIT, Head: [-8, -10, 7], smile: 1}],
  ], o);
  if (o >= B.gotta && o < B.laugh) { p = add(p, 'RightForeArm', [osc(o, 520, 14), 0, 0]); p = add(p, 'LeftForeArm', [osc(o + 200, 600, 10), 0, 0]); }
  if (o >= B.think && o < B.gotta) p = add(p, 'Head', [osc(o, 2600, 3), osc(o, 3400, 4), 0]);
  return {...p, mouth: mouthOf('M', o), smile: (p.smile as number | undefined) ?? 0};
};
const poseL = (o: number): Pose => {
  let p = track([[0, {...SIT, Head: [0, 18, 0]}], [B.laugh - 150, {...SIT, Head: [0, 18, 0]}], [B.laugh + 250, LAUGH_BACK], [B.tension - 200, LAUGH_BACK], [B.tension + 300, {...SIT, Head: [0, 18, 0], smile: 0.6}]], o);
  if (o < B.trophy) p = add(p, 'RightForeArm', [-25 + osc(o, 640, 18), 0, 0]);
  if (o >= B.laugh && o < B.tension) p = add(p, 'Spine', [osc(o, 260, 3), 0, 0]);
  return {...p, mouth: mouthOf('L', o)};
};
const poseR = (o: number): Pose => {
  let p = track([[0, {...SIT, Head: [0, -20, 0]}], [B.laugh - 100, {...SIT, Head: [0, -20, 0]}], [B.laugh + 300, LAUGH_FWD], [B.tension - 250, LAUGH_FWD], [B.tension + 200, {...SIT, Head: [0, -22, 0], smile: 0.3}]], o);
  if (o >= B.laugh && o < B.tension) p = add(p, 'Spine', [osc(o, 220, 4), 0, 0]);
  return {...p, mouth: mouthOf('R', o)};
};

// ---- small helpers --------------------------------------------------------------------------------------------------
const Cam = ({p, l, fov = 32}: {p: V3; l: V3; fov?: number}) => {
  const {camera} = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...p); c.fov = fov; c.near = 0.02; c.far = 80; c.updateProjectionMatrix(); c.lookAt(...l);
  return null;
};
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const prog = (o: number, a: number, b: number) => Math.max(0, Math.min(1, (o - a) / (b - a)));
const sm = (t: number) => t * t * (3 - 2 * t);
const hand = (o: number, k = 0.012): V3 => [k * Math.sin(o / 410), k * Math.sin(o / 530 + 1), 0];
const Env = () => {
  const {gl, scene} = useThree();
  useMemo(() => { const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; }, [gl, scene]);
  return null;
};
const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, repeat?: [number, number]) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
};
const woodTex = (base: string, plank = 64) => canvasTex(512, 512, (x) => {
  x.fillStyle = base; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 512 / plank; i++) for (let j = 0; j < 3; j++) {
    const r = random(`w${base}${i}${j}`); x.fillStyle = `rgba(${r > 0.5 ? '255,235,200' : '40,20,5'},${0.04 + 0.08 * r})`;
    x.fillRect(i * plank, j * 171 + (i % 2) * 60, plank - 2, 171);
  }
  x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2; for (let i = 0; i <= 512 / plank; i++) { x.beginPath(); x.moveTo(i * plank, 0); x.lineTo(i * plank, 512); x.stroke(); }
}, [4, 4]);

// player-card images for the "inside his head" shot
const IMGS = ['img/jorho/lebron.png', 'img/jorho/kobe.png', 'img/jorho/curry.png'];
const useTextures = () => {
  const [tx, setTx] = useState<THREE.Texture[] | null>(null);
  const [h] = useState(() => delayRender('goatx textures'));
  useEffect(() => {
    const L = new THREE.TextureLoader();
    Promise.all(IMGS.map((u) => L.loadAsync(staticFile(u)))).then((ts) => { ts.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace)); setTx(ts); continueRender(h); });
  }, [h]);
  return tx;
};

// ---- the studio --------------------------------------------------------------------------------------------------------
const Studio = ({o, g, red = 0}: {o: number; g: Parameters<typeof Person>[0]['g']; red?: number}) => {
  const wood = useMemo(() => woodTex('#6b4a2f', 128), []);
  const floor = useMemo(() => woodTex('#2a2018', 64), []);
  const cards = useMemo(() => Array.from({length: 14}, (_, i) => ({x: -1.4 + random(`cx${i}`) * 2.8, z: 0.55 + random(`cz${i}`) * 0.3, r: random(`cr${i}`) * 0.5 - 0.25,
    c: ['#d9d9d9', '#c9b37a', '#9fc3e6', '#e0e0e0'][i % 4]})), []);
  return <>
    <hemisphereLight args={['#ffeedd', '#202830', 0.55]} />
    <directionalLight position={[2.5, 4, 3.5]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}
      shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-1} />
    <pointLight position={[-2.2, 1.7, -0.8]} intensity={6} distance={5} color="#ffb070" />
    <pointLight position={[2.2, 2.2, -0.6]} intensity={4} distance={5} color="#59d8ff" />
    {red > 0 && <pointLight position={[0, 1.4, 1.6]} intensity={9 * red} distance={4} color="#ff2a2a" />}
    {/* room */}
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial map={floor} roughness={0.75} /></mesh>
    <mesh position={[0, 2, -1.5]} receiveShadow><planeGeometry args={[14, 5]} /><meshStandardMaterial color="#1c2430" roughness={0.95} /></mesh>
    {Array.from({length: 18}, (_, i) => <mesh key={i} position={[-2.25 + (i % 6) * 0.9, 1.2 + Math.floor(i / 6) * 0.9, -1.45]} castShadow>
      <boxGeometry args={[0.82, 0.82, 0.06]} /><meshStandardMaterial color={i % 2 ? '#252f3d' : '#202937'} roughness={1} /></mesh>)}
    <mesh position={[0, 3.05, -1.4]}><boxGeometry args={[6, 0.04, 0.04]} /><meshBasicMaterial color="#59d8ff" /></mesh>
    {/* table + mics + cards */}
    <mesh position={[0, 0.72, 0.55]} castShadow receiveShadow><boxGeometry args={[3.6, 0.06, 0.75]} /><meshStandardMaterial map={wood} roughness={0.5} /></mesh>
    {[-1.3, 1.3].map((x) => <mesh key={x} position={[x, 0.36, 0.55]} castShadow><boxGeometry args={[0.08, 0.72, 0.6]} /><meshStandardMaterial color="#3a2a1c" /></mesh>)}
    {[-1.05, 0, 1.05].map((x, i) => <group key={i} position={[x + 0.2, 0.75, 0.42]} rotation={[0, i === 0 ? 0.5 : i === 2 ? -0.5 : 0, 0]}>
      <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.24]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[-0.03, 0.27, -0.03]} rotation={[0.9, 0, 0.3]} castShadow><cylinderGeometry args={[0.035, 0.03, 0.17, 20]} /><meshStandardMaterial color="#15171a" metalness={0.5} roughness={0.35} /></mesh>
    </group>)}
    {cards.map((c, i) => <mesh key={i} position={[c.x, 0.756, c.z]} rotation={[-Math.PI / 2, 0, c.r]} castShadow>
      <boxGeometry args={[0.09, 0.13, 0.008]} /><meshStandardMaterial color={c.c} roughness={0.2} metalness={0.1} /></mesh>)}
    {/* chairs + people */}
    {[-1.05, 0, 1.05].map((x) => <mesh key={x} position={[x, 0.24, -0.08]} castShadow><boxGeometry args={[0.5, 0.48, 0.5]} /><meshStandardMaterial color="#141418" roughness={0.6} /></mesh>)}
    <Person g={g} pose={poseL(o)} look={HOST_L} position={[-1.05, 0, 0]} rotation={[0, 0.42, 0]} />
    <Person g={g} pose={poseM(o)} look={QB} position={[0, 0, 0]} />
    <Person g={g} pose={poseR(o)} look={HOST_R} position={[1.05, 0, 0]} rotation={[0, -0.42, 0]} />
  </>;
};

// ---- "greatest basketball player of all time": a gold trophy under a spotlight -----------------------------------------
const Trophy = ({o}: {o: number}) => {
  const a = (o - B.trophy) / 1000;
  const gold = <meshStandardMaterial color="#e2b13c" metalness={1} roughness={0.22} />;
  return <>
    <Cam p={[Math.sin(a * 0.6 - 0.5) * 2.1, 1.25 + a * 0.08, Math.cos(a * 0.6 - 0.5) * 2.1]} l={[0, 1.15, 0]} fov={34} />
    <ambientLight intensity={0.15} />
    <spotLight position={[0, 4, 0.5]} angle={0.42} penumbra={0.6} intensity={60} castShadow />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[6, 64]} /><meshStandardMaterial color="#0d0e12" roughness={0.25} metalness={0.4} /></mesh>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow><cylinderGeometry args={[0.38, 0.42, 0.8, 48]} /><meshStandardMaterial color="#16181d" roughness={0.4} /></mesh>
    <group position={[0, 0.8, 0]} rotation={[0, a * 0.9, 0]}>
      <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.16, 0.2, 0.1, 48]} />{gold}</mesh>
      <mesh position={[0, 0.32, 0]} castShadow><cylinderGeometry args={[0.04, 0.12, 0.45, 48]} />{gold}</mesh>
      <mesh position={[0, 0.6, 0.06]} rotation={[Math.PI / 2 - 0.25, 0, 0]} castShadow><torusGeometry args={[0.11, 0.012, 12, 40]} />{gold}</mesh>
      <mesh position={[0, 0.72, 0.03]} castShadow><sphereGeometry args={[0.13, 48, 32]} />{gold}</mesh>
    </group>
    {Array.from({length: 40}, (_, i) => {
      const y = ((random(`ty${i}`) * 3 - a * (0.25 + random(`tv${i}`) * 0.3)) % 3 + 3) % 3;
      return <mesh key={i} position={[(random(`tx${i}`) - 0.5) * 2.4, y, (random(`tz${i}`) - 0.5) * 2.4]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#ffe3a0" /></mesh>;
    })}
  </>;
};

// ---- inside his head: player cards spinning faster and faster ----------------------------------------------------------
const Mind = ({o, tx}: {o: number; tx: THREE.Texture[]}) => {
  const t = (o - B.mind) / 1000;
  const spin = 0.7 * t + 0.55 * t * t;
  const qTex = useMemo(() => canvasTex(256, 340, (x) => { x.fillStyle = '#20263a'; x.fillRect(0, 0, 256, 340); x.fillStyle = '#9fb3ff'; x.font = 'bold 200px Montserrat, Arial'; x.textAlign = 'center'; x.fillText('?', 128, 245); }), []);
  const N = 8, R = 1.0;
  return <>
    <Cam p={[0, 0.05, 2.6 - Math.min(0.5, t * 0.2)]} l={[0, 0, -1.5]} fov={42} />
    <color attach="background" args={['#05070f']} />
    <fog attach="fog" args={['#05070f', 3, 8]} />
    <ambientLight intensity={1.2} />
    {Array.from({length: N}, (_, i) => {
      const ang = (i / N) * Math.PI * 2 + spin;
      const map = i % 2 === 0 ? tx[(i / 2) % tx.length] : qTex;
      return <group key={i} position={[Math.sin(ang) * R, Math.sin(ang * 2 + i) * 0.12, Math.cos(ang) * R - 1.5]} rotation={[0, ang, 0]}>
        <mesh position={[0, 0, -0.006]}><planeGeometry args={[0.86, 1.12]} /><meshBasicMaterial color="#9fb3ff" side={THREE.DoubleSide} /></mesh>
        <mesh><planeGeometry args={[0.8, 1.06]} /><meshBasicMaterial map={map} side={THREE.DoubleSide} /></mesh>
      </group>;
    })}
    {Array.from({length: 120}, (_, i) => {
      const z = ((random(`mz${i}`) * 8 + t * (1.5 + spin * 0.3)) % 8) - 6;
      return <mesh key={`p${i}`} position={[(random(`mx${i}`) - 0.5) * 6, (random(`my${i}`) - 0.5) * 9, z]}><sphereGeometry args={[0.012, 6, 6]} /><meshBasicMaterial color="#7fa2ff" /></mesh>;
    })}
  </>;
};

// ---- Dellavedova on a court, spotlight, slow low orbit ---------------------------------------------------------------
const Court = ({o, g}: {o: number; g: Parameters<typeof Person>[0]['g']}) => {
  const a = (o - B.della) / 1000;
  const floor = useMemo(() => canvasTex(1024, 1024, (x) => {
    x.fillStyle = '#c99257'; x.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 32; i++) { x.fillStyle = `rgba(${random(`f${i}`) > 0.5 ? '255,230,190' : '90,50,15'},${0.05 + random(`fa${i}`) * 0.08})`; x.fillRect(i * 32, 0, 30, 1024); }
    x.strokeStyle = '#f4f0e6'; x.lineWidth = 10; x.beginPath(); x.arc(512, 980, 380, Math.PI, 0); x.stroke();
    x.fillStyle = 'rgba(111,38,61,.85)'; x.fillRect(392, 620, 240, 404); x.strokeRect(392, 620, 240, 404);
  }), []);
  const ang = -0.5 + a * 0.45;
  return <>
    <Cam p={[Math.sin(ang) * 2.5, 0.55 + a * 0.12, Math.cos(ang) * 2.5]} l={[0, 1.15, 0]} fov={36} />
    <color attach="background" args={['#07080b']} />
    <hemisphereLight args={['#ffffff', '#2a1a10', 0.35]} />
    <spotLight position={[0.6, 5, 1.6]} angle={0.38} penumbra={0.5} intensity={90} castShadow target-position={[0, 0.9, 0]} />
    <pointLight position={[-1.6, 1.6, -1]} intensity={5} distance={4} color="#FFB81C" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.2]} receiveShadow><planeGeometry args={[9, 9]} /><meshStandardMaterial map={floor} roughness={0.35} /></mesh>
    <Person g={g} pose={{...HERO, RightArm: [-10, 0, 150 - 8 * Math.max(0, 1 - a * 3)]}} look={DELLA} />
    {Array.from({length: 60}, (_, i) => {
      const y = ((random(`dy${i}`) * 3.2 - a * (0.5 + random(`dv${i}`) * 0.6)) % 3.2 + 3.2) % 3.2;
      return <mesh key={i} position={[(random(`dx${i}`) - 0.5) * 3, y, (random(`dz${i}`) - 0.5) * 3]} rotation={[a * 3 + i, i, 0]}>
        <planeGeometry args={[0.03, 0.05]} /><meshBasicMaterial color={i % 3 ? '#FFB81C' : '#ffffff'} side={THREE.DoubleSide} /></mesh>;
    })}
  </>;
};

// ---- shot list (output ms) ------------------------------------------------------------------------------------------------
type Shot = {a: number; b: number; cam?: (o: number) => {p: V3; l: V3; fov?: number}; scene: 'studio' | 'trophy' | 'mind' | 'court'};
const SHOTS: Shot[] = [
  {a: 0, b: B.nba, scene: 'studio', cam: (o) => { const t = sm(prog(o, 0, B.nba)); return {p: lerp3([2.3, 1.55, 2.9], [1.8, 1.45, 2.35], t), l: [-0.45, 1.0, 0], fov: 36}; }},
  {a: B.nba, b: B.greatest, scene: 'studio', cam: (o) => ({p: lerp3([0.32, 1.2, 1.25], [0.28, 1.19, 1.05], prog(o, B.nba, B.greatest)), l: [0, 1.16, 0], fov: 30})},
  {a: B.greatest, b: B.trophy, scene: 'studio', cam: (o) => ({p: lerp3([-0.55, 1.2, 1.15], [-0.6, 1.18, 0.98], prog(o, B.greatest, B.trophy)), l: [-1.0, 1.15, 0.05], fov: 30})},
  {a: B.trophy, b: B.think, scene: 'trophy'},
  {a: B.think, b: B.mind, scene: 'studio', cam: (o) => {
    const t = prog(o, B.think, B.mind); const dive = sm(prog(o, B.mind - 450, B.mind));
    return {p: lerp3(lerp3([-0.18, 1.18, 1.2], [-0.12, 1.19, 0.75], t), [0, 1.3, 0.4], dive), l: [0, 1.2 + 0.08 * dive, 0], fov: 30};
  }},
  {a: B.mind, b: B.gotta, scene: 'mind'},
  {a: B.gotta, b: B.della, scene: 'studio', cam: (o) => ({p: lerp3([0.12, 1.02, 0.95], [0.1, 1.05, 0.8], prog(o, B.gotta, B.della)), l: [0, 1.2, 0], fov: 32})},
  {a: B.della, b: B.laugh, scene: 'court'},
  {a: B.laugh, b: B.tension, scene: 'studio', cam: (o) => { const t = prog(o, B.laugh, B.tension); return {p: lerp3([-0.45, 1.55, 3.0], [-0.5, 1.48, 2.6], t), l: [-0.55, 1.0, 0], fov: 44}; }},
  {a: B.tension, b: B.end + 100, scene: 'studio', cam: (o) => { const t = sm(prog(o, B.tension, B.end)); return {p: lerp3([0.5, 1.26, 1.35], [0.32, 1.22, 0.98], t), l: [0, 1.17, 0], fov: 32}; }},
];

// ---- captions: one word, white, black outline, centre screen --------------------------------------------------------------
const WORDS = wordsFrom(goatWords, tl, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {}).sort((p, q) => p.at - q.at);
const KEY = new Set(['goat', 'GOAT', 'Dellavedova', 'tension']);
const Caption = ({o}: {o: number}) => {
  let i = -1; WORDS.forEach((w, j) => { if (o >= w.at) i = j; });
  if (i < 0) return null;
  const w = WORDS[i];
  const k = (o - w.at) / (1000 / FPS);
  const s = k < 3 ? [1.25, 1.12, 1.04][Math.floor(k)] : 1;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', transform: `scale(${s})`}}>
    <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 96, color: KEY.has(w.text) ? '#FFD84A' : '#fff', WebkitTextStroke: '14px #000', paintOrder: 'stroke fill',
      textShadow: '0 6px 18px rgba(0,0,0,.6)', letterSpacing: 1}}>{w.text.toLowerCase()}</span>
  </div>;
};
// fact label with a leader line (documentary style)
const Label = ({o, a, x, y, tx, ty, text}: {o: number; a: number; x: number; y: number; tx: number; ty: number; text: string}) => {
  if (o < a) return null;
  const t = Math.min(1, (o - a) / 300);
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <circle cx={x} cy={y} r={9 * t} fill="#fff" />
    <line x1={x} y1={y} x2={x + (tx - x) * t} y2={y + (ty - y) * t} stroke="#fff" strokeWidth={5} />
    <text x={tx + 14} y={ty + 16} fill="#fff" opacity={t} style={{fontFamily: MONT, fontWeight: 800, fontSize: 50, paintOrder: 'stroke', stroke: '#000', strokeWidth: 10}}>{text}</text>
  </svg>;
};

export const GoatExplainer = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const g = useAvatar();
  const tx = useTextures();
  const shot = SHOTS.find((s) => o >= s.a && o < s.b) ?? SHOTS[SHOTS.length - 1];
  const c = shot.cam?.(o);
  const shake = o >= B.laugh && o < B.tension ? hand(o, 0.02) : hand(o);
  const red = o >= B.tension ? prog(o, B.tension, B.end) : 0;
  const flash = Math.max(o >= B.mind - 150 && o < B.mind + 250 ? 1 - Math.abs(o - B.mind) / 250 : 0, o >= B.della && o < B.della + 220 ? 1 - (o - B.della) / 220 : 0);
  return <AbsoluteFill style={{background: '#000'}}>
    {g && tx && <ThreeCanvas width={1080} height={1920} shadows camera={{fov: 32, position: [0, 1.2, 3]}} gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05}}>
      <Env />
      {shot.scene === 'studio' && c && <><Cam p={[c.p[0] + shake[0], c.p[1] + shake[1], c.p[2]]} l={c.l} fov={c.fov} /><Studio o={o} g={g} red={red} /></>}
      {shot.scene === 'trophy' && <Trophy o={o} />}
      {shot.scene === 'mind' && <Mind o={o} tx={tx} />}
      {shot.scene === 'court' && <Court o={o} g={g} />}
    </ThreeCanvas>}
    {/* cinematic vignette + tension red */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,.55) 100%)'}} />
    {red > 0 && <AbsoluteFill style={{background: `rgba(120,0,0,${0.18 * red})`, mixBlendMode: 'multiply'}} />}
    {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash * 0.85}} />}
    {shot.scene === 'court' && <>
      <Label o={o} a={B.della + 350} x={560} y={700} tx={110} ty={380} text="Matthew Dellavedova" />
      <Label o={o} a={B.della + 750} x={470} y={1000} tx={110} ty={1560} text="career: 5.2 PPG" />
    </>}
    <Caption o={o} />
    <SpeechTrack src="input.mp4" tl={tl} />
    <Music file="Investigations.mp3" songFrom={0} level={(t) => (t >= B.think && t < B.gotta ? 0.17 : t >= B.della && t < B.laugh ? 0.2 : 0.1) * Math.min(1, (tl.total - t) / 400)} />
    <SfxTrack list={[
      sfx('mg-whoosh', 0, 0.3), sfx('mg-swoosh', B.trophy - 60, 0.35), sfx('mg-shimmer', B.trophy + 120, 0.3), sfx('mg-swoosh', B.think - 60, 0.3),
      ...Array.from({length: Math.floor((B.mind - B.think) / 500)}, (_, i) => sfx('clock-tick', B.think + 250 + i * 500, 0.45)),
      sfx('fast-whoosh', B.mind - 420, 0.45), sfx('cinematic-suspense-riser', B.mind + 200, 0.35, B.gotta - B.mind - 200),
      sfx('mg-boom', B.della, 0.55), sfx('crowd-cheer', B.della + 80, 0.22, 1100), sfx('ding', B.della + 750, 0.3),
      sfx('mg-swoosh', B.laugh - 60, 0.3), sfx('heartbeat-loud', B.tension + 100, 0.5),
    ]} />
  </AbsoluteFill>;
};
