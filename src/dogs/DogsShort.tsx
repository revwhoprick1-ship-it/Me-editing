// INSIDE THE IMPOSSIBLE #3 — "What if dogs learned to talk and became civilized?" (1080x1920, 30 fps, ~43.5 s). HYPOTHETICAL.
// Real dog models (CC BY, see inside-impossible/videos/003-dogs-talk/CREDITS.md) on four legs, procedural trot, jaw lip
// sync from the voice envelope, CC0 Poly Haven panoramas as ground-projected sets, our own procedural props.
// Facts: dogs respond to ~89 words on average (Reeve & Jacques 2021, owner survey of 165 dogs); ~600–900 million dogs (est.).
// Every cut hangs off a line or word timestamp in lines.gen.json (inside-impossible/audio/dialogue.py).
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import '../mgFonts';
import {Captions, Chips, Soundtrack, chunks, type Chip, type Word} from '../inside/kit/overlay';
import {Cam, Post, clamp01, lerp, lerp3, prog, smoother, type V3} from '../inside/kit/three';
import {Actor, LEGS, OnBone, boneWorld, findBone, gait, rotateWorld, useModels, type ModelId} from './assets';
import {Backpack, Banner, Bench, Bowl, BowTie, Chair, Chalkboard, Confetti, Desk, Flashes, Gavel, Laptop, Leash, Paper, Podium, PropMats, Rosette, SchoolDesk, Scraps, Table, Tie, Wig, WordCards} from './props';
import {Stage, useEnvs, type EnvId, type StageProps} from './stage';
import raw from './lines.gen.json';

const FPS = 30;
type Line = {id: string; who: string; text: string; startMs: number; endMs: number; env: number[]; words: {text: string; startMs: number; endMs: number}[]};
const LINES = raw as Line[];
// whisper splits "eighty-nine" → "eighty" "-nine": glue hyphen tokens back and show the number as digits
LINES.forEach((l) => { const out: Line['words'] = []; l.words.forEach((w) => { if (w.text.startsWith('-') && out.length) { const p = out[out.length - 1]; p.text = `${p.text}${w.text}`; p.endMs = w.endMs; } else out.push({...w}); });
  out.forEach((w) => { w.text = w.text.replace(/^eighty-nine/i, '89'); }); l.words = out; });
const LN = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<string, Line>;
const st = (id: string) => LN[id].startMs, en = (id: string) => LN[id].endMs;
const word = (id: string, w: string, n = 0) => { const hit = LN[id].words.filter((x) => x.text.replace(/[.,!?]/g, '').toLowerCase() === w.toLowerCase())[n]; if (!hit) throw new Error(`${w} not in ${id}`); return hit.startMs; };
const W: Word[] = LINES.flatMap((l) => l.words.map((w) => ({t: w.text, at: w.startMs})));
const C = LINES.flatMap((l) => chunks(l.words.map((w) => ({t: w.text, at: w.startMs}))));
const KEY = /^(talk|dog|food|89|earth|shoes|chew|mailman|school|homework|purpose|jobs|bark|parliament|belly|law|negotiate|rights|couch|golden|president|us|walks|walking|vote)$/i;
/** jaw opening for a speaker at time o (0..1 from the voice envelope) */
const mouth = (o: number, who: string) => { for (const l of LINES) if (l.who === who && o >= l.startMs - 30 && o < l.endMs + 60) { const i = Math.max(0, Math.floor(((o - l.startMs) / 1000) * FPS)); return l.env[Math.min(i, l.env.length - 1)] ?? 0; } return 0; };
const babble = (o: number, seed: string) => { const k = Math.floor(o / 90); return clamp01(0.25 + 0.75 * random(`${seed}${k}`)) * (0.5 + 0.5 * Math.sin(o / 140 + seed.length)); };

export const DOGS_MS = en('n_end') + 1500;
const S = {hook: 0, owner: st('owner') - 120, wide: st('n_what'), words: word('n_what', 'real'), street: st('n_now'), shoes: st('shoes') - 150, mail: st('mail') - 150,
  school: st('n_school'), homework: st('homework') - 60, office: st('n_jobs'), report: st('report') - 80, parl: st('n_parl'), order: st('order') - 120, nego: st('n_nego'),
  rights: st('rights') - 120, couch: st('couch') - 120, pres: st('n_pres'), decree: st('decree') - 120, react: word('decree', 'walks') + 380, walk: st('n_end'), end: DOGS_MS};
type ShotId = Exclude<keyof typeof S, 'end'>;
const SH = (Object.keys(S) as (keyof typeof S)[]).filter((k) => k !== 'end') as ShotId[];
const shotAt = (o: number) => { let id = SH[0]; for (const k of SH) if (o >= S[k]) id = k; const i = SH.indexOf(id); return {id, a: S[id], b: S[SH[i + 1]] ?? S.end}; };

// ---- rigs -------------------------------------------------------------------------------------------------------------------
type DogId = 'golden' | 'lab' | 'shiba' | 'boxer';
const RIG: Record<DogId, {h: number; head: RegExp; neck: RegExp; chest: RegExp; jaw: RegExp; amp: number; hide?: RegExp}> = {
  golden: {h: 0.8, head: /^Head_06/, neck: /^Neck_05/, chest: /^Chest_04/, jaw: /^Jaw_07/, amp: 0.42},
  lab: {h: 0.8, head: /^DEF-foreheadL_/, neck: /^DEF-spine005/, chest: /^DEF-spine003/, jaw: /^jaw_master/, amp: 0.3},
  shiba: {h: 0.68, head: /^head_jnt/, neck: /^neck_mid/, chest: /^chest_jnt/, jaw: /^jaw_jnt/, amp: 0.3},
  boxer: {h: 0.42, head: /^Head_7/, neck: /^Neck_6/, chest: /^Chest_5/, jaw: /^Jaw_8/, amp: 0.45, hide: /^Object_(79|81)$/},
};
const TAIL: Partial<Record<DogId, RegExp[]>> = {golden: [/^Tail1/, /^Tail2/], shiba: [/^tail_2/, /^tail_4/]};
type Pose = 'sit' | 'stand' | 'trot' | 'shake';
type DogProps = {id: DogId; M: Record<ModelId, GLTF>; o: number; pos: V3; yaw: number; pose?: Pose; talk?: number; speed?: number; nod?: number; tilt?: number;
  wag?: boolean; phase?: number; head?: THREE.Vector3; props?: (b: Record<string, THREE.Bone>, root: THREE.Object3D, r: (typeof RIG)[DogId]) => React.ReactNode};
const Dog = ({id, M, o, pos, yaw, pose = 'stand', talk = 0, speed = 2.3, nod = 0, tilt = 0, wag = true, phase = 0, head, props}: DogProps) => {
  const g = M[id], r = RIG[id], t = o / 1000 + phase;
  let clip: string | number = 0, ct = 0;
  if (id === 'golden') { const d = g.animations[0].duration; ct = pose === 'sit' ? 0.3 * d : 0.02; }
  if (id === 'lab') { clip = 0; ct = t * 0.6; }
  if (id === 'shiba') { clip = pose === 'sit' ? '0|sitting_0' : pose === 'shake' ? '0|shake_0' : '0|standing_0'; ct = pose === 'shake' ? t : pose === 'sit' ? 0.5 + 0.1 * Math.sin(t) : 0.5; }
  if (id === 'boxer') { clip = 0; ct = t * 0.8; }
  const side = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  return <Actor g={g} clip={clip} t={ct} h={r.h} position={pos} rotation={[0, yaw, 0]} hide={r.hide} mouth={talk} jaw={{bone: r.jaw, amp: r.amp}}
    bones={(b, root) => {
      if (pose === 'trot' && id !== 'boxer') gait(b, root, LEGS[id as 'golden' | 'lab' | 'shiba'], t, {freq: speed, amp: 0.4, tail: TAIL[id],
        head: id === 'lab' ? /^DEF-foreheadL_/ : undefined, pelvis: id === 'lab' ? /^DEF-pelvisL/ : undefined});
      else if (wag) for (const [i, re] of (TAIL[id] ?? []).entries()) rotateWorld(findBone(b, re), new THREE.Vector3(0, 1, 0), 0.4 * Math.sin(t * 9 + i * 0.7));
      const hd = findBone(b, r.head);
      if (nod) rotateWorld(hd, side, nod);
      if (tilt) rotateWorld(hd, new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), tilt);
      if (head) boneWorld(hd, head);
    }}>
    {(b, root) => props?.(b, root, r)}
  </Actor>;
};
type HumanId = 'woman' | 'bizman' | 'jeff';
const HUM: Record<HumanId, {h: number; measure?: RegExp; hand: RegExp}> = {woman: {h: 1.68, measure: /^Object_105$/, hand: /^hand_R_027/}, bizman: {h: 1.8, hand: /^Hand_R_048/}, jeff: {h: 1.8, hand: /^joint_HandRT_01/}};
const Human = ({id, M, clip, clip2, t, pos, yaw, children}: {id: HumanId; M: DogProps['M']; clip: string | number; clip2?: string; t: number; pos: V3; yaw: number; children?: (b: Record<string, THREE.Bone>) => React.ReactNode}) =>
  <Actor g={M[id]} clip={clip} clip2={clip2} t={t} h={HUM[id].h} measure={HUM[id].measure} position={pos} rotation={[0, yaw, 0]}>{(b) => children?.(b)}</Actor>;

// ---- set dressing -----------------------------------------------------------------------------------------------------------
const SET: Record<EnvId, Omit<StageProps, 'tex'>> = {
  anniversary_lounge: {h: 1.5, r: 9, rot: 0.6, bright: 1.25, ibl: 1.0, sun: {p: [2.5, 5, 3], i: 1.6, c: '#ffe2c0'}, fill: 0.5},
  urban_street_01: {h: 1.7, r: 30, rot: 0, bright: 1.1, ibl: 1.0, sun: {p: [4, 7, 2], i: 2.6, c: '#fff1dc'}, fill: 0.5, shadow: 0.45},
  newman_lobby: {h: 1.6, r: 12, rot: 0, bright: 1.2, ibl: 1.0, sun: {p: [2, 5, 3], i: 1.5}, fill: 0.6},
  school_hall: {h: 1.6, r: 10, rot: 0, bright: 1.2, ibl: 1.0, sun: {p: [-2, 5, 3], i: 1.5}, fill: 0.6},
  music_hall_01: {h: 1.6, r: 14, rot: Math.PI, bright: 1.25, ibl: 1.0, sun: {p: [1, 6, 4], i: 1.8, c: '#ffe8c8'}, fill: 0.5},
  church_meeting_room: {h: 1.6, r: 9, rot: 0, bright: 1.25, ibl: 1.0, sun: {p: [-2, 5, 3], i: 1.4}, fill: 0.6},
  theater_01: {h: 1.6, r: 14, rot: 0, bright: 0.85, ibl: 0.75, sun: {p: [0.5, 6, 4], i: 2.4, c: '#fff0d8'}, fill: 0.45},
  palermo_square: {h: 1.7, r: 40, rot: 0, bright: 1.1, ibl: 1.0, sun: {p: [5, 8, 4], i: 2.8, c: '#fff2dd'}, fill: 0.5, shadow: 0.45},
};
type Ctx = {o: number; a: number; b: number; M: DogProps['M']; E: Record<EnvId, THREE.Texture>};
const Room = ({E, id, ...over}: {E: Ctx['E']; id: EnvId} & Partial<Omit<StageProps, 'tex'>>) => <Stage tex={E[id]} {...SET[id]} {...over} />;
const ease = (o: number, a: number, b: number) => smoother(prog(o, a, b));
/** render-time thunk: lets JSX read vectors filled by earlier siblings (e.g. a dog's head) */
const Defer = ({f}: {f: () => React.ReactNode}) => <>{f()}</>;
/** camera framed off a dog's live head position (place AFTER that <Dog> in JSX so the head vector is filled first) */
const CamAt = ({h, rel, look = [0, 0, 0], fov = 32}: {h: THREE.Vector3; rel: V3; look?: V3; fov?: number}) => <Cam p={[h.x + rel[0], h.y + rel[1], h.z + rel[2]]} l={[h.x + look[0], h.y + look[1], h.z + look[2]]} fov={fov} />;
const shake = (o: number, at: number, amp = 0.02) => { const d = o - at; if (d < 0 || d > 450) return [0, 0, 0] as V3; const k = amp * Math.exp(-d / 120); return [k * Math.sin(d / 9), k * Math.cos(d / 13), 0] as V3; };
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const collarOf = (b: Record<string, THREE.Bone>, r: (typeof RIG)[DogId], out = new THREE.Vector3()) => boneWorld(findBone(b, r.neck), out).lerp(boneWorld(findBone(b, r.head)), 0.35);

// ---- 1. living room ---------------------------------------------------------------------------------------------------------
const Lounge = ({c, shot}: {c: Ctx; shot: 'hook' | 'owner' | 'wide' | 'words'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const gTalk = mouth(o, 'goldie') * 1.0;
  const cam: Record<typeof shot, {p: V3; l: V3; fov: number}> = {
    hook: {p: lerp3([0.62, 0.62, 2.0], [0.42, 0.56, 1.5], k), l: [0, 0.42, 0.1], fov: 34},
    owner: {p: lerp3([-0.32, 0.62, -0.5], [-0.24, 0.7, -0.2], k), l: [0.25, 1.38, 1.9], fov: lerp(30, 22, smoother(prog(o, a, a + 260)))},
    wide: {p: lerp3([1.25, 1.32, 3.35], [1.1, 1.25, 3.0], k), l: [-0.05, 0.5, 0.3], fov: 40},
    words: {p: lerp3([0.6, 0.76, 1.4], [0.48, 0.72, 1.15], k), l: [0, 0.64, 0.1], fov: 34},
  };
  const v = cam[shot], hv = new THREE.Vector3();
  return <>
    <Room E={E} id="anniversary_lounge" />
    {shot !== 'words' && <Cam p={v.p} l={v.l} fov={v.fov} />}
    <Dog id="golden" M={M} o={o} pos={[0, 0, 0]} yaw={0.08} pose="sit" talk={gTalk} head={hv} tilt={shot === 'words' ? 0.18 * Math.sin(o / 500) : shot === 'wide' ? 0.12 : 0} />
    <group position={[0.06, 0, 0.36]}><Bowl /></group>
    <Human id="woman" M={M} clip="Armature|idle_fear" t={o / 1000} pos={[0.28, 0, 1.95]} yaw={Math.PI + 0.12} />
    {shot === 'words' && <CamAt h={hv} rel={lerp3([0.45, 0.08, 1.05], [0.36, 0.06, 0.85], k)} look={[0, -0.02, 0.06]} fov={34} />}
    {shot === 'words' && <Defer f={() => <WordCards o={o} a={a + 150} center={[hv.x, hv.y + 0.04, hv.z + 0.06]} radius={0.36} words={['SIT', 'WALK?', 'TREAT', 'BALL', 'NO!', 'GOOD BOY', 'BATH', 'PARK', 'DINNER', 'SQUIRREL']} />} />}
    <Post focus={shot === 'owner' ? [0.28, 1.4, 1.95] : shot === 'wide' ? [0, 0.5, 0.2] : [0, 0.64, 0.1]} bokeh={shot === 'wide' ? 1.6 : 2.6} bloom={0.25} />
  </>;
};

// ---- 2. street ------------------------------------------------------------------------------------------------------------------
const Street = ({c, shot}: {c: Ctx; shot: 'street' | 'shoes' | 'mail'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b), ts = (o - a) / 1000;
  if (shot === 'street') {
    const v = 1.05, z = (z0: number) => z0 + v * ts;
    const D: [DogId, number, number, number][] = [['golden', -0.42, 0, 0], ['lab', 0.38, -0.9, 0.3], ['shiba', -0.05, 0.6, 0.6], ['lab', -0.7, -2.0, 0.9], ['golden', 0.62, -2.6, 0.2]];
    return <>
      <Room E={E} id="urban_street_01" />
      <Cam p={[lerp(0.35, 0.15, k), 0.42, z(0.6) + 2.3]} l={[0, 0.38, z(0.6) - 0.6]} fov={40} />
      {D.map(([id, x, z0, ph], i) => <Dog key={i} id={id} M={M} o={o} pos={[x, 0, z(z0)]} yaw={0.04 * Math.sin(i)} pose="trot" speed={2.3 + 0.15 * i} phase={ph} talk={babble(o, `bb${i}`) * (o > st('n_now') + 400 ? 0.8 : 0)} />)}
      <Post focus={[0, 0.4, z(0.3)]} bokeh={2.2} bloom={0.25} />
    </>;
  }
  if (shot === 'shoes') return <>
    <Room E={E} id="urban_street_01" rot={1.2} />
    <Cam p={lerp3([-0.15, 0.3, 1.75], [-0.1, 0.34, 1.5], k)} l={lerp3([-0.12, 0.36, 0], [-0.08, 0.46, 0], k)} fov={40} />
    <Human id="jeff" M={M} clip={0} t={o / 1000} pos={[0.32, 0, -0.08]} yaw={-Math.PI / 2 + 0.25} />
    <Dog id="shiba" M={M} o={o} pos={[-0.3, 0, 0.12]} yaw={Math.PI / 2 - 0.55} pose="sit" talk={mouth(o, 'shiba')} tilt={-0.15} nod={-0.12} />
    <Post focus={[-0.2, 0.35, 0.12]} bokeh={2.4} bloom={0.25} />
  </>;
  const jumpAt = word('mail', 'mailman') + 120;
  return <>
    <Room E={E} id="urban_street_01" rot={2.4} />
    <Cam p={add(lerp3([0.05, 1.15, 3.6], [0.0, 1.1, 3.2], k), shake(o, jumpAt + 200, 0.015))} l={[0, 1.0, 0]} fov={44} />
    {o < jumpAt ? <Human id="bizman" M={M} clip="Rig|idle" t={o / 1000} pos={[0.3, 0, -0.05]} yaw={-0.45} />
      : <Human id="bizman" M={M} clip="Rig|jump" t={(o - jumpAt) / 1000 + 0.15} pos={[0.3, 0, -0.05]} yaw={-0.45} />}
    <Dog id="lab" M={M} o={o} pos={[-0.32, 0, 0.3]} yaw={0.75} talk={mouth(o, 'lab')} />
    <Post focus={[-0.1, 0.7, 0.2]} bokeh={1.6} bloom={0.25} />
  </>;
};

// ---- 3. school + office ---------------------------------------------------------------------------------------------------------
const School = ({c, shot}: {c: Ctx; shot: 'school' | 'homework'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const v = shot === 'school' ? {p: lerp3([0.5, 0.66, 1.6], [0.4, 0.6, 1.3], k), l: [0, 0.36, -0.05] as V3, fov: 42} : {p: lerp3([0.34, 0.42, 1.1], [0.27, 0.4, 0.92], k), l: [0, 0.34, 0.1] as V3, fov: 34};
  return <>
    <Room E={E} id="school_hall" />
    <Cam p={v.p} l={v.l} fov={v.fov} />
    <group position={[0, 1.3, -1.25]}><Chalkboard w={2.0} /></group>
    <group position={[0.15, 0, -0.32]} scale={0.8}><SchoolDesk /></group>
    <Dog id="boxer" M={M} o={o} pos={[-0.05, 0, 0.12]} yaw={0.12} talk={mouth(o, 'pup')} props={(bn, root) => <OnBone bone={findBone(bn, /^Spine2_4/)} root={root} off={[0, 0.05, -0.06]} rot={[-0.7, 0, 0]}><Backpack s={0.85} /></OnBone>} />
    <group position={[0.05, 0, 0.28]}><Scraps n={16} r={0.3} /></group>
    <Post focus={[0, 0.3, 0.12]} bokeh={shot === 'school' ? 1.8 : 2.6} bloom={0.25} />
  </>;
};
const Office = ({c, shot}: {c: Ctx; shot: 'office' | 'report'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const v = shot === 'office' ? {p: lerp3([0.95, 1.3, 2.5], [0.75, 1.22, 2.15], k), l: [0, 0.98, 0] as V3, fov: 38} : {p: lerp3([-0.5, 1.25, 1.3], [-0.42, 1.22, 1.12], k), l: [0, 1.15, -0.1] as V3, fov: 32};
  const hv = new THREE.Vector3();
  return <>
    <Room E={E} id="newman_lobby" />
    {shot === 'office' && <Cam p={v.p} l={v.l} fov={v.fov} />}
    <group position={[0, 0, 0.22]}><Desk w={1.25} /></group>
    <group position={[0.36, 0.762, 0.3]} rotation={[0, -0.5, 0]}><Laptop glow={1.4} /></group>
    <group position={[-0.38, 0.762, 0.35]}><Paper lines={['MEMO', '', 'No baths', 'on Fridays']} w={0.2} rot={0.3} /></group>
    <group position={[0, 0, -0.2]}><Chair /></group>
    <Dog id="lab" M={M} o={o} pos={[0, 0.5, -0.2]} yaw={0.12} talk={mouth(o, 'lab')} wag={false} head={hv}
      props={(bn, root, r) => <OnBone bone={findBone(bn, r.neck)} to={findBone(bn, r.chest)} mix={0.35} root={root} off={[0, -0.02, 0.16]} rot={[0.3, 0, 0]}><Tie s={1.1} /></OnBone>} />
    {shot === 'report' && <CamAt h={hv} rel={lerp3([-0.42, 0.02, 0.95], [-0.34, 0.0, 0.78], k)} look={[0.02, -0.06, 0.08]} fov={32} />}
    <Post focus={[0, 1.05, -0.05]} bokeh={shot === 'office' ? 1.6 : 2.4} bloom={0.35} />
  </>;
};

// ---- 4. parliament --------------------------------------------------------------------------------------------------------------
const Parliament = ({c, shot}: {c: Ctx; shot: 'parl' | 'order'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const hit = st('order') - 40, law = word('order', 'law') + 250, cheer = clamp01((o - law) / 200);
  const nodA = Math.max(0, 1 - Math.abs(o - hit) / 160) * 0.38;
  const bounce = (i: number) => cheer * 0.06 * Math.abs(Math.sin(o / 110 + i));
  const v = shot === 'parl' ? {p: lerp3([0.0, 1.45, 3.8], [0.0, 1.35, 3.25], k), l: [0, 0.8, -0.7] as V3, fov: 40}
    : {p: add(lerp3([0.3, 1.28, 1.5], [0.4, 1.3, 2.5], ease(o, law - 300, b)), shake(o, hit, 0.03)), l: lerp3([0, 1.2, 0.05], [0, 0.95, -0.6], ease(o, law - 300, b)), fov: 32};
  const seats: [DogId, number, number, number][] = [['golden', -1.05, 0, 0], ['shiba', -0.35, 0, 0], ['boxer', 0.35, 0, 0], ['golden', 1.05, 0, 0],
    ['lab', -0.7, 1, 0], ['shiba', 0.0, 1, 0], ['lab', 0.7, 1, 0]];
  const hv = new THREE.Vector3(), pk = ease(o, law - 300, b);
  return <>
    <Room E={E} id="music_hall_01" />
    {shot === 'parl' && <Cam p={v.p} l={v.l} fov={v.fov} />}
    <group position={[0, 2.2, -2.6]}><Banner text="DOG PARLIAMENT" w={3.2} /></group>
    {[0, 1].map((row) => <group key={row} position={[0, row * 0.45, -0.9 - row * 0.85]}>
      {row === 1 && <mesh position={[0, -0.225, 0]} material={PropMats.darkWood} receiveShadow><boxGeometry args={[3.4, 0.45, 0.9]} /></mesh>}
      <Bench w={3.0} /></group>)}
    {seats.map(([id, x, row], i) => <Dog key={i} id={id} M={M} o={o} pos={[x, row * 0.45 + 0.28 + bounce(i), -0.85 - row * 0.85]} yaw={-x * 0.08} pose={id === 'lab' ? 'stand' : 'sit'} phase={i * 0.7}
      talk={o > law ? babble(o, `pc${i}`) : 0} />)}
    <group position={[0, 0, 0.35]}><Podium w={0.8} h={0.72} mics={false} /></group>
    <group position={[0.02, 0.78, 0.34]}><Gavel /></group>
    <mesh position={[0, 0.25, 0]} material={PropMats.darkWood} castShadow receiveShadow><boxGeometry args={[0.6, 0.5, 0.5]} /></mesh>
    <Dog id="lab" M={M} o={o} pos={[0, 0.5, 0.02]} yaw={0} talk={mouth(o, 'lab')} nod={nodA} wag={false} head={hv}
      props={(bn, root, r) => <OnBone bone={findBone(bn, r.head)} root={root} off={[0, 0.04, -0.01]} rot={[nodA, 0, 0]}><Wig s={0.85} /></OnBone>} />
    {shot === 'order' && (() => { const sk = shake(o, hit, 0.03); return <CamAt h={hv} rel={add(lerp3([0.32, 0.06, 0.95], [0.45, 0.15, 2.3], pk), sk)} look={lerp3([0, -0.06, 0.06], [0, -0.3, -0.6], pk)} fov={32} />; })()}
    <Post focus={shot === 'parl' ? [0, 0.9, -0.4] : [0, 1.0, 0.05]} bokeh={shot === 'parl' ? 1.4 : 2.2} bloom={0.3} />
  </>;
};

// ---- 5. negotiation -------------------------------------------------------------------------------------------------------------
const Nego = ({c, shot}: {c: Ctx; shot: 'nego' | 'rights' | 'couch'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const bizTalk = o >= st('rights') - 50 && o < en('rights') + 200;
  const v = shot === 'nego' ? {p: lerp3([0.15, 1.35, 2.75], [0.1, 1.3, 2.4], k), l: [-0.1, 0.95, -0.15] as V3, fov: 42}
    : shot === 'rights' ? {p: lerp3([1.15, 1.3, 0.8], [1.05, 1.32, 0.68], k), l: [-0.55, 1.5, -0.55] as V3, fov: 32}
      : {p: lerp3([-0.15, 1.08, -0.05], [-0.05, 1.06, 0.05], k), l: [0.6, 0.92, 0.35] as V3, fov: 34};
  const hv = new THREE.Vector3(), shakeDur = M.shiba.animations.find((x) => x.name === '0|shake_0')?.duration ?? 2;
  return <>
    <Room E={E} id="church_meeting_room" />
    {shot !== 'couch' && <Cam p={v.p} l={v.l} fov={v.fov} />}
    <Table w={1.8} d={0.95} />
    <group position={[0.05, 0.778, 0.05]}><Paper lines={['TREATY', '', '§1 Equal rights', '§2 The couch', '', '🐾  ______']} w={0.26} rot={-0.4} /></group>
    <Human id="bizman" M={M} clip="Rig|idle" clip2={bizTalk ? 'Rig|cycle_talking' : undefined} t={o / 1000} pos={[-0.55, 0, -0.55]} yaw={0.75} />
    <group position={[0.6, 0, 0.35]} rotation={[0, -2.2, 0]}><Chair back={false} /></group>
    <Dog id="shiba" M={M} o={o} pos={[0.6, 0.5, 0.35]} yaw={-2.2} pose={shot === 'couch' ? 'shake' : 'sit'} phase={shot === 'couch' ? 0.25 * shakeDur - a / 1000 : 0} talk={mouth(o, 'shiba')} head={hv}
      props={(bn, root, r) => <OnBone bone={findBone(bn, r.neck)} to={findBone(bn, r.chest)} mix={0.3} root={root} off={[0, -0.01, 0.07]}><BowTie s={1.2} /></OnBone>} />
    {shot === 'couch' && <CamAt h={hv} rel={lerp3([-1.0, 0.0, -0.45], [-0.85, -0.02, -0.35], k)} look={[-0.06, -0.2, -0.05]} fov={36} />}
    <Post focus={shot === 'rights' ? [-0.55, 1.55, -0.55] : [0.6, 0.9, 0.35]} bokeh={shot === 'nego' ? 1.5 : 2.4} bloom={0.25} />
  </>;
};

// ---- 6. president + reaction + walk ---------------------------------------------------------------------------------------------
const Flag = ({x}: {x: number}) => <group position={[x, 0, -0.3]}>
  <mesh material={PropMats.gold} position={[0, 1.1, 0]}><cylinderGeometry args={[0.012, 0.012, 2.2, 8]} /></mesh>
  <mesh position={[0.28 * Math.sign(-x), 1.85, 0]}><planeGeometry args={[0.56, 0.36]} /><meshStandardMaterial color="#1b3a7a" side={THREE.DoubleSide} roughness={0.7} /></mesh>
</group>;
const President = ({c, shot}: {c: Ctx; shot: 'pres' | 'decree'}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  const v = shot === 'pres' ? {p: lerp3([0, 1.25, 3.0], [0, 1.18, 2.3], k), l: [0, 1.0, 0] as V3, fov: 38} : {p: lerp3([0.26, 1.2, 1.45], [0.18, 1.18, 1.15], k), l: [0, 1.12, 0.02] as V3, fov: 28};
  return <>
    <Room E={E} id="theater_01" />
    <Cam p={v.p} l={v.l} fov={v.fov} />
    <Flag x={-0.75} /><Flag x={0.75} />
    <group position={[0, 0, 0.38]}><Podium w={0.78} h={0.78} /></group>
    <mesh position={[0, 0.2, 0]} material={PropMats.darkWood} castShadow receiveShadow><boxGeometry args={[0.6, 0.4, 0.55]} /></mesh>
    <Dog id="golden" M={M} o={o} pos={[0, 0.4, 0.0]} yaw={0} pose="sit" talk={mouth(o, 'goldie')} nod={shot === 'decree' ? 0.05 * Math.sin(o / 300) : 0}
      props={(bn, root, r) => <OnBone bone={findBone(bn, r.neck)} to={findBone(bn, r.chest)} mix={0.5} root={root} off={[0, -0.02, 0.1]}><Rosette s={1.2} /></OnBone>} />
    <Confetti t={(o - S.pres) / 1000 + 0.8} area={[3.2, 2.4]} y0={2.8} />
    <Flashes o={o} spots={Array.from({length: 7}, (_, i): V3 => [-1.4 + i * 0.47, 1.0 + 0.3 * random(`fy${i}`), 2.6 + random(`fz${i}`) * 1.5])} />
    <Post focus={[0, 1.1, 0.05]} bokeh={shot === 'pres' ? 1.6 : 2.4} bloom={0.32} />
  </>;
};
const React_ = ({c}: {c: Ctx}) => {
  const {o, a, b, M, E} = c, k = ease(o, a, b);
  return <>
    <Room E={E} id="theater_01" rot={Math.PI} />
    <Cam p={lerp3([0.1, 1.5, 1.7], [0.05, 1.52, 1.2], k)} l={[0.05, 1.45, -0.4]} fov={32} />
    <Human id="woman" M={M} clip="Armature|idle_fear" t={o / 1000 + 1} pos={[-0.18, 0, -0.35]} yaw={0.15} />
    <Human id="bizman" M={M} clip="Rig|idle" t={o / 1000} pos={[0.42, 0, -1.1]} yaw={-0.25} />
    <Post focus={[-0.18, 1.5, -0.35]} bokeh={2.2} bloom={0.25} />
  </>;
};
const Walk = ({c}: {c: Ctx}) => {
  const {o, a, M, E} = c, ts = (o - a) / 1000, v = 1.45, z = (z0: number) => z0 + v * ts;
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3(), tmpD = new THREE.Vector3();
  const hands: Record<string, THREE.Vector3> = {};
  // humans first, so their hand positions exist when the dogs' leashes are drawn
  return <>
    <Room E={E} id="palermo_square" />
    <Cam p={[lerp(-0.35, -0.1, smoother(prog(o, a, S.end))), 0.85, z(0.5) + 2.7]} l={[0.05, 0.75, z(0.5) - 0.9]} fov={42} />
    <Human id="bizman" M={M} clip="Rig|run" t={ts * 1.1} pos={[-0.5, 0, z(-1.75)]} yaw={0}>{(b) => { hands.biz = boneWorld(findBone(b, HUM.bizman.hand), tmpA); return null; }}</Human>
    <Human id="woman" M={M} clip="Armature|running" t={ts * 1.05 + 0.3} pos={[0.55, 0, z(-2.1)]} yaw={0}>{(b) => { hands.wom = boneWorld(findBone(b, HUM.woman.hand), tmpB); return null; }}</Human>
    <Dog id="golden" M={M} o={o} pos={[-0.38, 0, z(0)]} yaw={0} pose="trot" speed={2.7} props={(b, _r, r) => hands.biz && <Leash a={collarOf(b, r, tmpC)} b={hands.biz} sag={0.06} />} />
    <Dog id="lab" M={M} o={o} pos={[0.42, 0, z(-0.35)]} yaw={0} pose="trot" speed={2.6} phase={0.3} props={(b, _r, r) => hands.wom && <Leash a={collarOf(b, r, tmpD)} b={hands.wom} sag={0.06} />} />
    <Dog id="shiba" M={M} o={o} pos={[0.02, 0, z(0.55)]} yaw={0} pose="trot" speed={3.0} phase={0.6} />
    <Post focus={[0, 0.5, z(0.1)]} bokeh={1.8} bloom={0.25} />
  </>;
};

// ---- overlays ---------------------------------------------------------------------------------------------------------------
const CHIPS: Chip[] = [
  {a: S.wide + 250, b: S.words, text: 'HYPOTHETICAL', dot: '#7fd8ff'},
  {a: S.words + 200, b: S.street, text: 'REAL DOGS: ~89 WORDS · 2021 STUDY'},
  {a: S.street + 900, b: S.shoes, text: '~600–900 MILLION DOGS (EST.)'},
  {a: S.walk + 1300, b: S.end + 1, text: 'WOULD YOU VOTE FOR HIM? 👇'},
];
const CHYRON: {a: number; b: number; head: string; text: string}[] = [
  {a: S.street + 200, b: S.shoes, head: 'BREAKING', text: 'DOGS WORLDWIDE CAN SUDDENLY TALK'},
  {a: S.order + 300, b: S.nego, head: 'LIVE', text: 'SPEAKER OF THE HOUSE · BELLY RUB ACT'},
  {a: S.pres + 500, b: S.react, head: 'BREAKING', text: 'GOLDEN RETRIEVER ELECTED PRESIDENT'},
];
const Chyron = ({o}: {o: number}) => {
  const c = CHYRON.find((x) => o >= x.a && o < x.b); if (!c) return null;
  const k = smoother(clamp01((o - c.a) / 260)), q = clamp01((c.b - o) / 150);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateX(${(1 - k) * -1100}px)`}}>
    <div style={{display: 'flex', alignItems: 'stretch', boxShadow: '0 10px 30px rgba(0,0,0,.45)', fontFamily: 'Inter', fontWeight: 800}}>
      <div style={{background: '#d4142c', color: '#fff', fontSize: 40, padding: '16px 24px', letterSpacing: 2}}>{c.head}</div>
      <div style={{background: 'rgba(250,250,252,.96)', color: '#111', fontSize: 38, padding: '18px 26px', maxWidth: 760}}>{c.text}</div>
    </div>
  </div>;
};

const FX: [string, number, number][] = [
  ['bowl', 120, 0.35], ['scratch', en('first') + 80, 0.55], ['bark', S.wide + 1200, 0.25], ['pop', S.words + 150, 0.35], ['pop', S.words + 480, 0.3], ['pop', S.words + 810, 0.3],
  ['chime', S.street + 150, 0.5], ['babble', S.street + 600, 0.45], ['bark_s', S.shoes + 50, 0.25], ['boing', word('mail', 'mailman') + 150, 0.55], ['scream', word('mail', 'mailman') + 230, 0.35],
  ['bell', S.school, 0.4], ['paper', S.homework + 900, 0.4], ['keys', S.office + 100, 0.45], ['keys', S.report + 1400, 0.3],
  ['gavel', st('order') - 40, 0.9], ['bark_crowd', word('order', 'law') + 250, 0.6], ['cheer', word('order', 'law') + 300, 0.45],
  ['paper', S.nego + 300, 0.3], ['bark_s', en('couch') + 50, 0.35], ['fanfare', S.pres + 100, 0.55], ['flash', S.pres + 700, 0.3], ['flash', S.pres + 1500, 0.3], ['flash', S.decree + 900, 0.25],
  ['gasp', S.react - 60, 0.55], ['whoosh_in', S.walk - 150, 0.3], ['bark', S.walk + 1100, 0.35], ['bark_s', S.walk + 2400, 0.3],
];
const BEDS: [string, number, number, number][] = [['room', 0, S.street, 0.25], ['city', S.street, S.school, 0.35], ['steps', S.street, S.shoes, 0.35], ['room', S.school, S.parl, 0.2],
  ['hall', S.parl, S.nego, 0.3], ['room', S.nego, S.pres, 0.2], ['hall', S.pres, S.walk, 0.3], ['city', S.walk, S.end, 0.3], ['steps', S.walk, S.end, 0.4]];

export const DogsShort = ({at}: {at?: number}) => {
  const frame = useCurrentFrame(), o = at ?? (frame / FPS) * 1000;
  const M = useModels(['golden', 'lab', 'shiba', 'boxer', 'jeff', 'bizman', 'woman']), E = useEnvs(['anniversary_lounge', 'urban_street_01', 'newman_lobby', 'school_hall', 'music_hall_01', 'church_meeting_room', 'theater_01', 'palermo_square']);
  const {id, a, b} = shotAt(o);
  const c = M && E ? {o, a, b, M: M as Ctx['M'], E} : null;
  return <AbsoluteFill style={{background: '#000'}}>
    {c && <ThreeCanvas width={1080} height={1920} shadows camera={{fov: 40, position: [0, 1, 3]}} gl={{toneMapping: THREE.NoToneMapping}}>
      {(id === 'hook' || id === 'owner' || id === 'wide' || id === 'words') && <Lounge key={id} c={c} shot={id} />}
      {(id === 'street' || id === 'shoes' || id === 'mail') && <Street key={id} c={c} shot={id} />}
      {(id === 'school' || id === 'homework') && <School key={id} c={c} shot={id} />}
      {(id === 'office' || id === 'report') && <Office key={id} c={c} shot={id} />}
      {(id === 'parl' || id === 'order') && <Parliament key={id} c={c} shot={id} />}
      {(id === 'nego' || id === 'rights' || id === 'couch') && <Nego key={id} c={c} shot={id} />}
      {(id === 'pres' || id === 'decree') && <President key={id} c={c} shot={id} />}
      {id === 'react' && <React_ c={c} />}
      {id === 'walk' && <Walk c={c} />}
    </ThreeCanvas>}
    <Chips o={o} list={CHIPS} />
    <Chyron o={o} />
    <Captions o={o} C={C} keyword={KEY} />
    <Soundtrack vo="dogsvo/dialogue.wav" off={0} W={W} total={DOGS_MS} fx={FX} beds={BEDS} music="music/Fluffing_a_Duck.mp3" />
  </AbsoluteFill>;
};

/** stills sheet: frame i shows the short at T[i] ms (one bundle for every shot still) */
export const DogsStills = ({T = [1500, 3100, 5200, 7800, 10800, 13200, 15900, 17000, 18700, 20400, 22000, 24500, 25450, 27600, 29400, 30800, 32000, 34200, 37000, 39300, 41500]}: {T?: number[]}) => {
  const f = useCurrentFrame();
  return <DogsShort at={T[Math.min(f, T.length - 1)] ?? 0} />;
};
