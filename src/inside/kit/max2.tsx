// "Max" v2 — the channel mascot rebuilt from the user's character sheet (orange hoodie, white tee, black cargo pants,
// orange/white high-tops, messy wavy dark-brown hair, big brown eyes, thick brows). Procedural (licence-clean), real
// units (1.65 m), a joint hierarchy driven by Pose2, an expressive face (Face2) and textured materials (knit, twill,
// leather, skin with blush, hair strands). Sneakers carry a generic stripe, no brand logo.
import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// ---- pose / face types ------------------------------------------------------------------------------------------------------
export type Arm = {fwd: number; out: number; twist: number; elbow: number; wrist: number; hand: number /* 0 open … 1 fist */; point?: number; pocket?: number};
export type Leg = {swing: number; out: number; knee: number; ankle: number};
export type Face2 = {blink: number; wide: number; lookX: number; lookY: number; browUp: number; browAngry: number; browSad: number;
  open: number; smile: number; mouthW: number; mouthO: number; squint: number};
export type Pose2 = {x: number; y: number; z: number; yaw: number; hipY: number; hipX: number; hipZ: number; hipYaw: number;
  lean: number; side: number; twist: number; headX: number; headY: number; headZ: number; armL: Arm; armR: Arm; legL: Leg; legR: Leg; face: Face2};
const arm0 = (): Arm => ({fwd: 0.05, out: 0.07, twist: 0, elbow: 0.15, wrist: 0, hand: 0.35});
const leg0 = (): Leg => ({swing: 0, out: 0.02, knee: 0.02, ankle: 0});
export const face0 = (): Face2 => ({blink: 0, wide: 0, lookX: 0, lookY: 0, browUp: 0, browAngry: 0, browSad: 0, open: 0, smile: 0.35, mouthW: 0, mouthO: 0, squint: 0});
export const pose0 = (): Pose2 => ({x: 0, y: 0, z: 0, yaw: 0, hipY: 0, hipX: 0, hipZ: 0, hipYaw: 0, lean: 0, side: 0, twist: 0, headX: 0, headY: 0, headZ: 0,
  armL: arm0(), armR: arm0(), legL: leg0(), legR: leg0(), face: face0()});
/** deep numeric blend a→b by w */
export const mixPose = <T,>(a: T, b: T, w: number): T => {
  if (typeof a === 'number') return (a + ((b as number) - a) * w) as T;
  const o = {} as Record<string, unknown>;
  for (const k of Object.keys(a as object)) o[k] = mixPose((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], w);
  return o as T;
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
export const blinkAt = (t: number, seed = 0) => { const p = (t + seed * 1.7) % 3.1; return p < 0.12 ? Math.sin((p / 0.12) * Math.PI) : 0; };

// ---- clips (t in seconds) -----------------------------------------------------------------------------------------------------
type Over = Partial<Omit<Pose2, 'armL' | 'armR' | 'legL' | 'legR' | 'face'>> & {armL?: Partial<Arm>; armR?: Partial<Arm>; legL?: Partial<Leg>; legR?: Partial<Leg>; face?: Partial<Face2>};
export const withP = (p: Pose2, o: Over): Pose2 => ({...p, ...o, armL: {...p.armL, ...o.armL}, armR: {...p.armR, ...o.armR}, legL: {...p.legL, ...o.legL}, legR: {...p.legR, ...o.legR}, face: {...p.face, ...o.face}} as Pose2);
export const idle = (t: number, seed = 0): Pose2 => {
  const b = Math.sin(t * 1.9 + seed), s = Math.sin(t * 0.6 + seed * 2);
  return withP(pose0(), {hipZ: 0.025 * s, hipX: 0.012 * s, lean: 0.02 * b, side: -0.02 * s, headX: -0.03 + 0.03 * Math.sin(t * 0.8 + seed), headY: 0.12 * Math.sin(t * 0.37 + seed),
    headZ: 0.03 * s, armL: {fwd: 0.06 + 0.02 * b, out: 0.13, elbow: 0.18}, armR: {fwd: 0.06 - 0.02 * b, out: 0.13, elbow: 0.2}, legL: {out: 0.03 + 0.02 * s, knee: 0.04 + 0.03 * s},
    legR: {out: 0.03 - 0.02 * s, knee: 0.04 - 0.03 * s}, face: {blink: blinkAt(t, seed)}});
};
/** hands-in-pockets idle (the sheet's hero pose) */
export const pockets = (t: number, seed = 0): Pose2 => withP(idle(t, seed), {armL: {fwd: -0.05, out: 0.12, twist: 0, elbow: 0.42, hand: 0.8, pocket: 1}, armR: {fwd: -0.05, out: 0.12, twist: 0, elbow: 0.42, hand: 0.8, pocket: 1}});
export const walk = (t: number, speed = 1, seed = 0): Pose2 => {
  const w = t * 2 * Math.PI * 0.95 * speed, s = Math.sin(w), c = Math.cos(w);
  return withP(pose0(), {hipY: -0.015 + 0.02 * Math.abs(Math.cos(w)), hipYaw: 0.08 * s, twist: -0.12 * s, lean: 0.06, headX: -0.04, headY: 0.06 * s, side: 0.02 * c,
    legL: {swing: 0.42 * s, knee: 0.15 + 0.55 * Math.max(0, -c) * (s > 0 ? 1 : 0.4), ankle: -0.15 * s}, legR: {swing: -0.42 * s, knee: 0.15 + 0.55 * Math.max(0, c) * (s < 0 ? 1 : 0.4), ankle: 0.15 * s},
    armL: {fwd: -0.38 * s, out: 0.1, elbow: 0.3 + 0.2 * Math.max(0, -s)}, armR: {fwd: 0.38 * s, out: 0.1, elbow: 0.3 + 0.2 * Math.max(0, s)}, face: {blink: blinkAt(t, seed)}});
};
export const run = (t: number, speed = 1, seed = 0): Pose2 => {
  const w = t * 2 * Math.PI * 1.45 * speed, s = Math.sin(w), c = Math.cos(w);
  return withP(pose0(), {hipY: -0.03 + 0.06 * Math.abs(c), hipYaw: 0.12 * s, twist: -0.2 * s, lean: 0.22, headX: -0.18, headY: 0.05 * s,
    legL: {swing: 0.85 * s, knee: 0.3 + 1.25 * Math.max(0, -c), ankle: -0.3 * s}, legR: {swing: -0.85 * s, knee: 0.3 + 1.25 * Math.max(0, c), ankle: 0.3 * s},
    armL: {fwd: -0.9 * s, out: 0.15, elbow: 1.45, hand: 0.9}, armR: {fwd: 0.9 * s, out: 0.15, elbow: 1.45, hand: 0.9}, face: {open: 0.25, smile: 0.2, blink: blinkAt(t, seed)}});
};
/** shocked jump back: k 0..1 over ~0.8 s */
export const shocked = (k: number, t: number): Pose2 => {
  const crouch = sm(k / 0.18) * (1 - sm((k - 0.18) / 0.12)), air = Math.sin(Math.PI * clamp01((k - 0.2) / 0.5)), land = sm((k - 0.7) / 0.3);
  return withP(pose0(), {y: 0.35 * air, z: -0.5 * sm((k - 0.18) / 0.55), hipY: -0.16 * crouch - 0.06 * land * (1 - land) * 4, lean: -0.25 * air + 0.15 * crouch, headX: -0.15 * air,
    armL: {fwd: 0.9 * air + 0.5 * land, out: 0.9 * air + 0.3, elbow: 0.9, hand: 0}, armR: {fwd: 0.9 * air + 0.5 * land, out: 0.9 * air + 0.3, elbow: 0.9, hand: 0},
    legL: {swing: 0.3 * air, knee: 0.9 * crouch + 0.7 * air, ankle: 0.3 * air}, legR: {swing: -0.1 * air, knee: 0.9 * crouch + 0.9 * air, ankle: 0.3 * air},
    face: {wide: 1, browUp: 1, open: 0.55 + 0.1 * Math.sin(t * 20), mouthO: 0.8, smile: -0.2}});
};
export const pointAt = (t: number, seed = 0): Pose2 => withP(idle(t, seed), {lean: 0.08, side: -0.04, twist: 0.12, headZ: -0.06, headX: 0.04,
  armR: {fwd: 1.45, out: 0.05, twist: 0, elbow: 0.1, wrist: 0.1, hand: 1, point: 1}, armL: {fwd: 0.15, out: 0.3, twist: -0.3, elbow: 0.75, hand: 0.8},
  face: {smile: 0.75, browAngry: 0.15, squint: 0.15, lookY: 0.05}});
export const think = (t: number, seed = 0): Pose2 => withP(idle(t, seed), {headZ: 0.14, headX: 0.06, headY: -0.1,
  armR: {fwd: 0.85, out: 0.3, twist: 0.4, elbow: 2.35, wrist: -0.3, hand: 0.85}, armL: {fwd: 0.55, out: 0.18, twist: 0.6, elbow: 1.5, hand: 0.6},
  face: {squint: 1, smile: 0.55, browUp: 0.3}});
export const laugh = (t: number, seed = 0): Pose2 => { const b = Math.abs(Math.sin(t * 13));
  return withP(idle(t, seed), {headX: -0.25, lean: -0.08 + 0.04 * b, hipY: -0.01 * b, armL: {out: 0.25, elbow: 0.5}, armR: {fwd: 0.6, elbow: 1.6, out: 0.2},
    face: {squint: 1, open: 0.6 + 0.2 * b, smile: 1, mouthW: 0.6, browUp: 0.5}}); };
export const shrug = (t: number, seed = 0): Pose2 => { const k = 0.5 + 0.5 * Math.sin(t * 3);
  return withP(idle(t, seed), {headZ: 0.16, armL: {fwd: 0.35, out: 0.55 + 0.1 * k, twist: 1.2, elbow: 1.6, wrist: -0.4, hand: 0}, armR: {fwd: 0.35, out: 0.55 + 0.1 * k, twist: 1.2, elbow: 1.6, wrist: -0.4, hand: 0},
    face: {browSad: 0.8, browUp: 0.5, smile: -0.1, open: 0.1, mouthW: 0.3}}); };
export const cheer = (t: number, seed = 0): Pose2 => { const k = Math.abs(Math.sin(t * 7));
  return withP(idle(t, seed), {hipY: 0.03 * k, headX: -0.12, armR: {fwd: 0.4, out: 2.6, elbow: 0.5 + 0.6 * k, hand: 1}, armL: {fwd: 0.2, out: 0.25, elbow: 1.2, hand: 1},
    face: {open: 0.55, smile: 1, squint: 0.6, browUp: 0.4}}); };
export const yawn = (k: number, t: number): Pose2 => { const a = Math.sin(Math.PI * clamp01(k));
  return withP(idle(t), {lean: -0.1 * a, headX: -0.25 * a, armL: {fwd: 0.4 * a, out: 2.4 * a + 0.12, elbow: 0.8 * a, hand: 0.5}, armR: {fwd: 0.4 * a, out: 2.4 * a + 0.12, elbow: 0.8 * a, hand: 0.5},
    face: {open: 0.9 * a, mouthO: 0.7 * a, squint: a, browUp: 0.3 * a}}); };
/** sitting on a seat of height h (driver's seat / car hood); hands on a yoke when drive */
export const seated = (t: number, h = 0.45, drive = false, seed = 0): Pose2 => withP(idle(t, seed), {hipY: h - 0.9 + 0.08, lean: drive ? -0.05 : 0.05,
  legL: {swing: 1.45, out: 0.06, knee: 1.35, ankle: -0.1}, legR: {swing: 1.45, out: 0.06, knee: 1.35, ankle: -0.1},
  armL: drive ? {fwd: 1.15, out: 0.18, elbow: 0.45, twist: 0.3, hand: 0.85} : {fwd: 0.35, out: 0.25, elbow: 0.6, hand: 0.4},
  armR: drive ? {fwd: 1.15, out: 0.18, elbow: 0.45, twist: 0.3, hand: 0.85} : {fwd: 0.35, out: 0.25, elbow: 0.6, hand: 0.4}});
/** cross-legged on the floor holding a game controller (sheet, bottom right) */
export const gamer = (t: number, seed = 0): Pose2 => { const tap = Math.sin(t * 9);
  return withP(idle(t, seed), {hipY: -0.7, lean: 0.12, headX: 0.18,
    legL: {swing: 1.5, out: 0.95, knee: 2.45, ankle: 0.3}, legR: {swing: 1.5, out: 0.95, knee: 2.45, ankle: 0.3},
    armL: {fwd: 0.6, out: 0.12, twist: 0.4, elbow: 1.65 + 0.03 * tap, hand: 0.7}, armR: {fwd: 0.6, out: 0.12, twist: 0.4, elbow: 1.65 - 0.03 * tap, hand: 0.7},
    face: {lookY: -0.4, smile: 0.4, blink: blinkAt(t, seed)}}); };
/** G-force: pressed back into the seat, cheeks rippling */
export const gforce = (t: number, k: number): Pose2 => withP(seated(t, 0.45, true), {lean: -0.25 * k, headX: -0.35 * k, headY: 0.05 * Math.sin(t * 40) * k,
  armL: {fwd: 1.15 - 0.4 * k, elbow: 0.45 + 0.4 * k}, armR: {fwd: 1.15 - 0.4 * k, elbow: 0.45 + 0.4 * k},
  face: {wide: k, open: 0.35 * k, mouthW: 1 * k, smile: -0.2 * k, browUp: k, squint: 0.3 * k}});

// ---- textures ---------------------------------------------------------------------------------------------------------------
const texCache = new Map<string, THREE.Texture>();
const canvasTex = (key: string, w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, repeat: [number, number] = [1, 1], color = false) => {
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8; if (color) t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t); return t;
};
const knit = () => canvasTex('knit', 256, 256, (x) => {
  x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) { // rows of little V stitches
    const g = 150 + 50 * random(`k${r}:${c}`); x.fillStyle = `rgb(${g},${g},${g})`;
    x.beginPath(); x.ellipse(c * 8 + 2.2, r * 8 + 4, 1.6, 3.4, 0.45, 0, 7); x.fill(); x.beginPath(); x.ellipse(c * 8 + 5.8, r * 8 + 4, 1.6, 3.4, -0.45, 0, 7); x.fill();
  }
}, [14, 14]);
const rib = () => canvasTex('rib', 64, 64, (x) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#5a5a5a' : '#c8c8c8'; x.fillRect(i * 4, 0, 4, 64); } }, [24, 1]);
const twill = () => canvasTex('twill', 256, 256, (x) => {
  x.fillStyle = '#7a7a7a'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#b4b4b4'; x.lineWidth = 2;
  for (let i = -256; i < 512; i += 6) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 256, 256); x.stroke(); }
  for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(0,0,0,${0.08 * random(`tw${k}`)})`; x.fillRect(random(`tx${k}`) * 256, random(`ty${k}`) * 256, 3, 3); }
}, [6, 10]);
const grain = () => canvasTex('grain', 256, 256, (x) => { const img = x.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) { const v = 110 + 40 * random(`g${i % 4096}`) + 20 * random(`h${i}`); img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0); }, [6, 6]);
const strands = () => canvasTex('strands', 64, 256, (x) => {
  x.fillStyle = '#808080'; x.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 64; i++) { const g = 60 + 160 * random(`st${i}`); x.fillStyle = `rgb(${g},${g},${g})`; x.fillRect(i, 0, 1, 256); }
}, [1, 6]);
/** head colour map in sphere UV: skin, cheek blush, warmer lips/nose region, faint freckle grain */
const skinMap = () => canvasTex('skin', 1024, 512, (x) => {
  x.fillStyle = '#f0b48e'; x.fillRect(0, 0, 1024, 512);
  const blob = (u: number, v: number, r: number, col: string) => { const g = x.createRadialGradient(u * 1024, v * 512, 0, u * 1024, v * 512, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 1024, 512); };
  blob(0.25 - 0.085, 0.56, 70, 'rgba(232,120,110,0.38)'); blob(0.25 + 0.085, 0.56, 70, 'rgba(232,120,110,0.38)'); // cheeks
  blob(0.25, 0.52, 40, 'rgba(225,130,110,0.25)'); blob(0.25, 0.66, 46, 'rgba(205,110,100,0.22)'); // nose tip, chin
  blob(0.25, 0.25, 260, 'rgba(250,210,180,0.18)'); blob(0.75, 0.5, 300, 'rgba(210,140,110,0.2)'); // forehead light, back darker
  for (let k = 0; k < 2500; k++) { x.fillStyle = `rgba(150,80,60,${0.04 * random(`sk${k}`)})`; x.fillRect(random(`sx${k}`) * 1024, random(`sy${k}`) * 512, 2, 2); }
}, [1, 1], true);
const irisTex = () => canvasTex('iris', 256, 256, (x) => {
  const g = x.createRadialGradient(128, 128, 10, 128, 128, 128); g.addColorStop(0, '#c98a4a'); g.addColorStop(0.45, '#7a4421'); g.addColorStop(0.85, '#4a260f'); g.addColorStop(1, '#1d0d05');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 160; i++) { const a = (i / 160) * Math.PI * 2 + random(`ir${i}`) * 0.05; x.strokeStyle = `rgba(${random(`ic${i}`) > 0.5 ? '230,170,100' : '40,20,8'},${0.25 + 0.3 * random(`ia${i}`)})`;
    x.lineWidth = 1.5; x.beginPath(); x.moveTo(128 + Math.cos(a) * 28, 128 + Math.sin(a) * 28); x.lineTo(128 + Math.cos(a) * (90 + 25 * random(`il${i}`)), 128 + Math.sin(a) * (90 + 25 * random(`il${i}`))); x.stroke(); }
}, [1, 1], true);

// ---- materials ----------------------------------------------------------------------------------------------------------------
const MAT = (() => {
  let m: Record<string, THREE.Material> | null = null;
  return () => {
    if (m) return m;
    const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(p);
    m = {
      hood: phys({color: '#f2621f', roughness: 0.93, sheen: 0.45, sheenColor: new THREE.Color('#ffb27a'), sheenRoughness: 0.7, bumpMap: knit(), bumpScale: 0.9}),
      hoodRib: phys({color: '#e45a1c', roughness: 0.95, sheen: 0.4, sheenColor: new THREE.Color('#ffb27a'), bumpMap: rib(), bumpScale: 0.35}),
      hoodDark: phys({color: '#d4521a', roughness: 0.95, sheen: 0.4, sheenColor: new THREE.Color('#ff9a5a'), bumpMap: knit(), bumpScale: 0.8}),
      tee: phys({color: '#f4f2ee', roughness: 0.9, sheen: 0.5, sheenColor: new THREE.Color('#ffffff'), bumpMap: knit(), bumpScale: 0.6}),
      pants: phys({color: '#1f1d22', roughness: 0.88, sheen: 0.7, sheenColor: new THREE.Color('#5d5866'), sheenRoughness: 0.5, bumpMap: twill(), bumpScale: 1.6}),
      pantsDark: phys({color: '#151418', roughness: 0.9, sheen: 0.5, sheenColor: new THREE.Color('#4a4652'), bumpMap: twill(), bumpScale: 1.4}),
      skin: phys({color: '#f2b591', roughness: 0.55, sheen: 0.35, sheenColor: new THREE.Color('#ffb59a'), clearcoat: 0.05, bumpMap: grain(), bumpScale: 0.15}),
      head: phys({map: skinMap(), roughness: 0.5, sheen: 0.35, sheenColor: new THREE.Color('#ffb59a'), clearcoat: 0.06, clearcoatRoughness: 0.5, bumpMap: grain(), bumpScale: 0.12}),
      lip: phys({color: '#c9776a', roughness: 0.4, clearcoat: 0.4}),
      mouthLine: new THREE.MeshStandardMaterial({color: '#6a2a26', roughness: 0.7}),
      mouthIn: new THREE.MeshStandardMaterial({color: '#4a141a', roughness: 0.8}),
      teeth: phys({color: '#f6f2ea', roughness: 0.25, clearcoat: 0.6}),
      tongue: phys({color: '#d4646c', roughness: 0.45, clearcoat: 0.3}),
      white: phys({color: '#fbfaf7', roughness: 0.12, clearcoat: 1}),
      iris: new THREE.MeshPhysicalMaterial({map: irisTex(), roughness: 0.25, clearcoat: 1}),
      pupil: new THREE.MeshBasicMaterial({color: '#050302'}),
      glint: new THREE.MeshBasicMaterial({color: '#ffffff'}),
      lash: new THREE.MeshStandardMaterial({color: '#1a0f0a', roughness: 0.8}),
      brow: phys({color: '#2b1a12', roughness: 0.7, sheen: 0.5, sheenColor: new THREE.Color('#6b4a3a'), bumpMap: strands(), bumpScale: 1}),
      hair: phys({color: '#3a2316', roughness: 0.42, sheen: 0.8, sheenColor: new THREE.Color('#a8744c'), sheenRoughness: 0.35, bumpMap: strands(), bumpScale: 2.2, clearcoat: 0.15, clearcoatRoughness: 0.4}),
      hairDark: phys({color: '#24150d', roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color('#7a5236'), bumpMap: strands(), bumpScale: 2}),
      shoeW: phys({color: '#f5f3ef', roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.4, bumpMap: grain(), bumpScale: 0.3}),
      shoeO: phys({color: '#f06a24', roughness: 0.42, clearcoat: 0.3, bumpMap: grain(), bumpScale: 0.3}),
      sole: phys({color: '#fbfaf6', roughness: 0.6, bumpMap: rib(), bumpScale: 0.25}),
      lace: phys({color: '#ffffff', roughness: 0.7}),
      cord: phys({color: '#f7e7d6', roughness: 0.8, sheen: 0.4}),
      aglet: phys({color: '#e9e4dc', roughness: 0.3, clearcoat: 1}),
      metal: phys({color: '#bfc3c9', roughness: 0.3, metalness: 0.6}),
    };
    return m;
  };
})();

// ---- geometry helpers ---------------------------------------------------------------------------------------------------------
/** tapered tube along points; r(u) radius function; uv.x along length, uv.y around */
export const taperTube = (pts: THREE.Vector3[], r: (u: number) => number, seg = 18, rad = 7) => {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const fr = curve.computeFrenetFrames(seg, false), pos: number[] = [], uv: number[] = [], idx: number[] = [], P = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const u = i / seg; curve.getPointAt(u, P); const rr = r(u), N = fr.normals[i], B = fr.binormals[i];
    for (let j = 0; j <= rad; j++) { const a = (j / rad) * Math.PI * 2, cx = Math.cos(a), sy = Math.sin(a);
      pos.push(P.x + rr * (cx * N.x + sy * B.x), P.y + rr * (cx * N.y + sy * B.y), P.z + rr * (cx * N.z + sy * B.z)); uv.push(u, j / rad); }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
};
const lathe = (prof: [number, number][], seg = 40) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// head: sphere with a rounder cranium, softer cheeks, narrower chin; centre at (0,0,0), R = 0.125
const HR = 0.125;
const headGeo = () => {
  const g = new THREE.SphereGeometry(HR, 96, 72), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const t = -y / HR; // 0 equator .. 1 chin
    if (y < 0) { x *= 1 - 0.27 * Math.pow(t, 1.6); z *= 1 - 0.1 * t; if (z > 0) z += 0.012 * Math.sin(Math.PI * Math.min(1, t * 1.1)); }
    if (y > 0) x *= 1 + 0.03 * (y / HR);
    const cheek = Math.exp(-(((y + 0.035) / 0.03) ** 2)) * Math.exp(-(((Math.abs(x) - 0.07) / 0.035) ** 2)) * (z > 0 ? 1 : 0); // cheek fullness
    x += Math.sign(x) * 0.006 * cheek; z += 0.006 * cheek;
    p.setXYZ(i, x * 0.97, y * 1.1, z * 0.98);
  }
  g.computeVertexNormals(); return g;
};
/** messy wavy mop (the sheet): a lumpy mass over the skull + thick, short, S-curved chunks lying along it + a fringe */
const hairGeo = () => {
  const bumps = Array.from({length: 34}, (_, i) => ({d: new THREE.Vector3(random(`hb${i}x`) - 0.5, random(`hb${i}y`) * 0.9, random(`hb${i}z`) - 0.5).normalize(), h: 0.003 + 0.006 * random(`hb${i}h`), w: 0.3 + 0.25 * random(`hb${i}w`)}));
  const mass = new THREE.SphereGeometry(HR, 80, 56, 0, Math.PI * 2, 0, Math.PI * 0.64), mp = mass.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < mp.count; i++) {
    v.set(mp.getX(i), mp.getY(i), mp.getZ(i)); const d = v.clone().normalize();
    let h = 0; for (const bp of bumps) { const ang = Math.acos(Math.min(1, d.dot(bp.d))); h += bp.h * Math.exp(-((ang / bp.w) ** 2)); }
    const r = HR * 1.035 + h + 0.003 * Math.sin(d.x * 40 + d.z * 31) * Math.cos(d.y * 37);
    mp.setXYZ(i, d.x * r * 1.0, d.y * r * 1.1 + 0.002, d.z * r * 0.99);
  }
  const keep: number[] = [], idx = mass.index!;
  for (let f = 0; f < idx.count; f += 3) {
    const a2 = idx.getX(f), b2 = idx.getX(f + 1), c2 = idx.getX(f + 2);
    const zc = (mp.getZ(a2) + mp.getZ(b2) + mp.getZ(c2)) / 3, yc = (mp.getY(a2) + mp.getY(b2) + mp.getY(c2)) / 3, xc = (mp.getX(a2) + mp.getX(b2) + mp.getX(c2)) / 3;
    if (zc > 0.02 && yc < 0.092 - 0.35 * Math.max(0, Math.abs(xc) - 0.06)) continue; // forehead free
    if (Math.abs(xc) > 0.09 && yc < 0.015 && zc > -0.05) continue; // ears free
    keep.push(a2, b2, c2);
  }
  mass.setIndex(keep); mass.computeVertexNormals();
  const chunks: THREE.BufferGeometry[] = [], up = new THREE.Vector3(0, 1, 0);
  const add = (pts: THREE.Vector3[], w: number) => chunks.push(taperTube(pts, (u) => w * (1 - 0.55 * Math.pow(u, 1.4)) * Math.min(1, 0.55 + u * 4), 18, 8));
  for (let i = 0; i < 70; i++) {
    const r = (k: string) => random(`hc${i}${k}`);
    const th = Math.acos(1 - r('t') * 1.15), ph = r('p') * Math.PI * 2;
    const d = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));
    if (d.z > 0.45 && d.y < 0.75) continue; // the fringe is placed separately
    const base = d.clone().multiply(new THREE.Vector3(HR * 1.04, HR * 1.14, HR * 1.03));
    // flow along the scalp: from the crown outward and down, a little forward on top
    let flow = new THREE.Vector3(d.x, -0.35, d.z + 0.35).sub(d.clone().multiplyScalar(d.dot(new THREE.Vector3(d.x, -0.35, d.z + 0.35))));
    if (flow.lengthSq() < 1e-4) flow = new THREE.Vector3(0, 0, 1); flow.normalize();
    const side = new THREE.Vector3().crossVectors(d, flow).normalize(), L = 0.05 + 0.035 * r('l'), wv = (r('w') - 0.5) * 0.03;
    const p0 = base.clone().addScaledVector(d, -0.008), p1 = base.clone().addScaledVector(flow, L * 0.35).addScaledVector(d, 0.008).addScaledVector(side, wv);
    const p2 = p1.clone().addScaledVector(flow, L * 0.35).addScaledVector(side, -wv * 1.2).addScaledVector(d, 0.004);
    const p3 = p2.clone().addScaledVector(flow, L * 0.2).addScaledVector(d, -0.006).addScaledVector(side, wv * 0.8 + (r('c') - 0.5) * 0.02);
    add([p0, p1, p2, p3], 0.015 + 0.007 * r('r'));
    void up;
  }
  for (let i = 0; i < 11; i++) { // fringe: wavy chunks falling over the forehead, tips curling sideways above the brows
    const r = (k: string) => random(`hf${i}${k}`), x0 = -0.075 + i * 0.015 + (r('x') - 0.5) * 0.008, sgn = x0 >= 0 ? 1 : -1;
    const p0 = new THREE.Vector3(x0 * 0.8, 0.125, 0.04), p1 = new THREE.Vector3(x0 * 0.95, 0.118, 0.092), p2 = new THREE.Vector3(x0 + sgn * 0.012 * r('a'), 0.1, 0.118);
    const p3 = new THREE.Vector3(x0 + sgn * (0.016 + 0.012 * r('b')), 0.078 + 0.01 * r('c'), 0.124), p4 = new THREE.Vector3(x0 + sgn * 0.03, 0.086 + 0.012 * r('d'), 0.118);
    add([p0, p1, p2, p3, p4], 0.018 + 0.006 * r('r'));
  }
  return {cap: mass, locks: mergeGeometries(chunks)!};
};
/** thick tapered brow along an arc; params bend it */
const browGeo = (s: 1 | -1, up: number, angry: number, sad: number) => {
  const inner = new THREE.Vector3(s * 0.018, 0.0 + 0.013 * sad - 0.014 * angry, 0.006), mid = new THREE.Vector3(s * 0.042, 0.008 - 0.002 * angry, 0), outer = new THREE.Vector3(s * 0.066, 0.0 - 0.005 * sad + 0.004 * angry, -0.016);
  [inner, mid, outer].forEach((v) => (v.y += 0.012 * up));
  return taperTube([inner, mid, outer], (u) => 0.0115 * (1 - 0.5 * u) * (0.65 + 0.35 * Math.sin(Math.PI * Math.min(1, u * 2 + 0.2))), 16, 8);
};
/** mouth surface at the face: closed smile line, or an open shape with teeth/tongue */
const mouthGeos = (f: Face2) => {
  const W = 0.03 * (1 + 0.35 * f.mouthW - 0.3 * f.mouthO), sm2 = f.smile, open = Math.max(f.open, 0);
  const corner = 0.011 * sm2, curve = (x: number) => -x * x * 4.2; // z falloff around the face (r ≈ 0.12)
  if (open < 0.04) {
    const pts = [-1, -0.5, 0, 0.5, 1].map((k) => new THREE.Vector3(k * W, corner * k * k - 0.002 * sm2 * (1 - k * k), curve(k * W)));
    return {line: taperTube(pts, (u) => 0.0021 * (0.5 + 0.5 * Math.sin(Math.PI * u)), 16, 6), open: null as THREE.BufferGeometry | null, H: 0};
  }
  const H = 0.008 + 0.042 * open + 0.016 * f.mouthO, sh = new THREE.Shape();
  const top = (k: number) => corner * k * k + 0.004 * (1 - k * k) + 0.004 * f.mouthO * (1 - k * k);
  const bot = (k: number) => corner * k * k - H * (1 - Math.pow(Math.abs(k), 2.2 - f.mouthO));
  sh.moveTo(-W, top(-1)); for (let i = -9; i <= 10; i++) { const k = i / 10; sh.lineTo(k * W, top(k)); }
  for (let i = 10; i >= -10; i--) { const k = i / 10; sh.lineTo(k * W, bot(k)); }
  const g = new THREE.ShapeGeometry(sh, 8), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setZ(i, curve(p.getX(i)));
  g.computeVertexNormals();
  return {line: null, open: g, H};
};

// ---- the character ------------------------------------------------------------------------------------------------------------
const Hand = ({curl, point, s}: {curl: number; point: number; s: 1 | -1}) => {
  const M = MAT();
  return <group>
    <mesh material={M.skin} position={[0, -0.045, 0.004]} scale={[0.042, 0.05, 0.02]}><sphereGeometry args={[1, 20, 14]} /></mesh>
    {[0, 1, 2, 3].map((i) => { const c = i === 0 ? curl * (1 - point) : curl; const x = s * (0.026 - i * 0.017);
      return <group key={i} position={[x, -0.088, 0.006]} rotation={[-c * 1.35, 0, s * (i - 1.5) * 0.06]}>
        <mesh material={M.skin} position={[0, -0.018, 0]}><capsuleGeometry args={[0.0085, 0.024, 4, 10]} /></mesh>
        <group position={[0, -0.034, 0]} rotation={[-c * 1.5, 0, 0]}><mesh material={M.skin} position={[0, -0.014, 0]}><capsuleGeometry args={[0.0078, 0.018, 4, 10]} /></mesh></group>
      </group>; })}
    <group position={[s * 0.036, -0.03, 0.016]} rotation={[-0.4 - curl * 0.6, s * 0.3, s * (0.6 - 0.3 * curl)]}>
      <mesh material={M.skin} position={[0, -0.018, 0]}><capsuleGeometry args={[0.0095, 0.026, 4, 10]} /></mesh>
    </group>
  </group>;
};
const Shoe = () => {
  const M = MAT();
  return <group>
    <mesh material={M.sole} position={[0, -0.055, 0.04]} scale={[0.058, 0.02, 0.15]}><sphereGeometry args={[1, 28, 16]} /></mesh>
    <mesh material={M.sole} position={[0, -0.06, 0.04]}><boxGeometry args={[0.11, 0.022, 0.27]} /></mesh>
    <mesh material={M.shoeW} position={[0, -0.02, 0.06]} scale={[0.052, 0.045, 0.12]}><sphereGeometry args={[1, 28, 18]} /></mesh>
    <mesh material={M.shoeO} position={[0, -0.025, 0.14]} scale={[0.05, 0.035, 0.055]}><sphereGeometry args={[1, 24, 16]} /></mesh>
    <mesh material={M.shoeW} position={[0, 0.02, -0.01]}><cylinderGeometry args={[0.05, 0.055, 0.1, 24]} /></mesh>
    <mesh material={M.shoeO} position={[0, 0.0, -0.06]} scale={[0.054, 0.06, 0.03]}><sphereGeometry args={[1, 20, 14]} /></mesh>
    <mesh material={M.shoeO} position={[0, 0.06, -0.012]}><cylinderGeometry args={[0.053, 0.052, 0.024, 24]} /></mesh>
    {[1, -1].map((s) => <mesh key={s} material={M.shoeO} position={[s * 0.051, -0.018, 0.05]} rotation={[0.35, 0, 0]} scale={[0.004, 0.012, 0.075]}><boxGeometry args={[1, 1, 1]} /></mesh>)}
    {[0, 1, 2, 3].map((i) => <mesh key={i} material={M.lace} position={[0, 0.02 - i * 0.012, 0.035 + i * 0.022]} rotation={[0.5, 0, 0]}><boxGeometry args={[0.05, 0.006, 0.008]} /></mesh>)}
    <mesh material={M.shoeW} position={[0, 0.03, 0.03]} rotation={[0.45, 0, 0]} scale={[0.032, 0.05, 0.012]}><sphereGeometry args={[1, 16, 12]} /></mesh>
  </group>;
};

export const Max2 = ({pose: P, scale = 1, children, hairLag = [0, 0], prop}: {pose: Pose2; scale?: number; children?: React.ReactNode; hairLag?: [number, number]; prop?: React.ReactNode}) => {
  const M = MAT();
  const G = useMemo(() => {
    const hair = hairGeo();
    return {
      head: headGeo(), hairCap: hair.cap, hairLocks: hair.locks,
      torso: lathe([[0.0, -0.205], [0.17, -0.205], [0.176, -0.17], [0.176, -0.05], [0.182, 0.07], [0.172, 0.16], [0.14, 0.225], [0.085, 0.27], [0.05, 0.285], [0.0, 0.285]], 48),
      waist: lathe([[0.0, -0.06], [0.165, -0.06], [0.172, 0.0], [0.168, 0.06], [0.0, 0.06]], 40),
      thigh: lathe([[0.0, 0.0], [0.092, 0.0], [0.098, -0.12], [0.092, -0.3], [0.084, -0.42], [0.0, -0.42]], 28),
      shin: lathe([[0.0, 0.02], [0.084, 0.02], [0.082, -0.15], [0.084, -0.3], [0.09, -0.36], [0.0, -0.36]], 28),
      upper: lathe([[0.0, 0.02], [0.066, 0.02], [0.072, -0.08], [0.066, -0.2], [0.06, -0.27], [0.0, -0.27]], 24),
      fore: lathe([[0.0, 0.02], [0.06, 0.02], [0.064, -0.1], [0.058, -0.2], [0.0, -0.2]], 24),
      pocket: (() => { const s = new THREE.Shape(); s.moveTo(-0.11, 0); s.lineTo(0.11, 0); s.lineTo(0.09, 0.12); s.lineTo(-0.09, 0.12); s.closePath(); return new THREE.ExtrudeGeometry(s, {depth: 0.008, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.004, bevelSegments: 2}); })(),
      cordL: taperTube([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.004, -0.08, 0.014), new THREE.Vector3(0.0, -0.17, 0.02)], () => 0.0055, 12, 6),
    };
  }, []);
  const f = P.face, open = Math.max(0, f.open);
  const mouth = useMemo(() => mouthGeos(f), [f.open, f.smile, f.mouthW, f.mouthO]); // eslint-disable-line react-hooks/exhaustive-deps
  const brows = useMemo(() => [browGeo(1, f.browUp, f.browAngry, f.browSad), browGeo(-1, f.browUp, f.browAngry, f.browSad)], [f.browUp, f.browAngry, f.browSad]);
  const lid = Math.max(f.blink, 0.05 - 0.05 * f.wide + 0.6 * f.squint);
  const eye = (s: 1 | -1) => <group position={[s * 0.05, 0.012, 0.083]}>
    <mesh material={M.white} scale={[1, 1.06 + 0.08 * f.wide, 1]}><sphereGeometry args={[0.034, 36, 28]} /></mesh>
    <group rotation={[-f.lookY * 0.35, f.lookX * 0.45, 0]}>
      <mesh material={M.iris} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.0342, 36, 10, 0, Math.PI * 2, 0, 0.66]} /></mesh>
      <mesh material={M.pupil} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.0344, 24, 6, 0, Math.PI * 2, 0, 0.27 - 0.07 * f.wide]} /></mesh>
      <mesh material={M.glint} position={[0.009, 0.011, 0.0328]}><sphereGeometry args={[0.0045, 10, 8]} /></mesh>
      <mesh material={M.glint} position={[-0.007, -0.008, 0.0334]}><sphereGeometry args={[0.002, 8, 6]} /></mesh>
    </group>
    {/* upper lid (+ lash line), lower lid */}
    <group rotation={[-1.2 + lid * 1.8, 0, 0]}>
      <mesh material={M.head}><sphereGeometry args={[0.0358, 36, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh material={M.lash} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.0358, 0.0034, 6, 36, Math.PI]} /></mesh>
    </group>
    <group rotation={[Math.PI + 1.3 - 0.45 * f.squint, 0, 0]}><mesh material={M.head}><sphereGeometry args={[0.0352, 36, 10, 0, Math.PI * 2, 0, Math.PI / 2 * 0.62]} /></mesh></group>
  </group>;
  // joint helpers
  const A = (a: Arm, s: 1 | -1) => <group position={[s * 0.178, 0.235, -0.01]} rotation={new THREE.Euler(-a.fwd, s * a.twist, s * a.out, 'XZY')}>
    <mesh geometry={G.upper} material={M.hood} />
    <mesh material={M.hood} position={[0, -0.02, 0]} scale={[0.95, 0.85, 0.95]}><sphereGeometry args={[0.06, 24, 18]} /></mesh>
    <group position={[0, -0.255, 0]} rotation={[-a.elbow, 0, 0]}>
      <mesh geometry={G.fore} material={M.hood} />
      <mesh material={M.hoodRib} position={[0, -0.205, 0]}><cylinderGeometry args={[0.046, 0.05, 0.04, 20]} /></mesh>
      <group position={[0, -0.215, 0]} rotation={[-a.wrist, 0, 0]} scale={a.pocket ? 0.0001 : 1}><Hand curl={a.hand} point={a.point ?? 0} s={s} /></group>
    </group>
  </group>;
  const Lg = (l: Leg, s: 1 | -1) => <group position={[s * 0.095, -0.02, 0]} rotation={new THREE.Euler(-l.swing, 0, s * l.out, 'XZY')}>
    <mesh geometry={G.thigh} material={M.pants} />
    {/* cargo pocket on the outer thigh */}
    <group position={[s * 0.088, -0.2, 0]} rotation={[0, s * Math.PI / 2, 0]}>
      <mesh material={M.pantsDark}><boxGeometry args={[0.1, 0.12, 0.018]} /></mesh>
      <mesh material={M.pants} position={[0, 0.05, 0.012]}><boxGeometry args={[0.105, 0.035, 0.012]} /></mesh>
    </group>
    <group position={[0, -0.42, 0]} rotation={[l.knee, 0, 0]}>
      <mesh geometry={G.shin} material={M.pants} />
      <group position={[0, -0.39, 0]} rotation={[-l.ankle, 0, 0]} scale={1.15}><Shoe /></group>
    </group>
  </group>;
  const brOn = 0.0052;
  return <group position={[P.x, P.y, P.z]} rotation={[0, P.yaw, 0]} scale={scale}>
    <group position={[0, 0.9 + P.hipY, 0]} rotation={new THREE.Euler(P.hipX, P.hipYaw, P.hipZ, 'YXZ')}>
      <mesh geometry={G.waist} material={M.pants} scale={[0.93, 1, 0.7]} position={[0, -0.035, 0]} />
      {Lg(P.legL, 1)}{Lg(P.legR, -1)}
      <group position={[0, 0.1, 0]} rotation={new THREE.Euler(P.lean, P.twist, P.side, 'YXZ')}>
        {/* hoodie body, ribbed hem, white tee peeking out, kangaroo pocket, hood, drawstrings */}
        <mesh geometry={G.torso} material={M.hood} scale={[1, 1, 0.74]} position={[0, 0.06, 0]} />
        <mesh material={M.hoodRib} position={[0, -0.145, 0]} scale={[1, 1, 0.74]}><cylinderGeometry args={[0.18, 0.178, 0.05, 40, 1, true]} /></mesh>
        <mesh material={M.tee} position={[0, -0.175, 0]} scale={[1, 1, 0.74]}><cylinderGeometry args={[0.168, 0.168, 0.03, 40]} /></mesh>
        <mesh material={M.hoodDark} position={[0, -0.075, 0.122]} rotation={[-0.05, 0, 0]} scale={[0.11, 0.05, 0.01]}><sphereGeometry args={[1, 32, 16]} /></mesh>
        {[1, -1].map((s) => <mesh key={s} material={M.hoodRib} position={[s * 0.085, -0.06, 0.13]} rotation={[0, 0, s * 0.5]} scale={[0.006, 0.05, 0.006]}><boxGeometry args={[1, 1, 1]} /></mesh>)}
        <mesh material={M.hood} position={[0, 0.315, -0.07]} scale={[0.15, 0.085, 0.1]}><sphereGeometry args={[1, 28, 18]} /></mesh>
        <mesh material={M.hoodDark} position={[0, 0.3, 0.0]} rotation={[Math.PI / 2 - 0.25, 0, 0]} scale={[1, 1.15, 1]}><torusGeometry args={[0.07, 0.017, 12, 32]} /></mesh>
        <mesh material={M.tee} position={[0, 0.3, 0.012]} rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[0.058, 0.008, 8, 28]} /></mesh>
        {[1, -1].map((s) => <group key={s} position={[s * 0.035, 0.28, 0.105]} rotation={[0.1 - 0.3 * P.lean, 0, s * 0.05]}>
          <mesh geometry={G.cordL} material={M.cord} />
          <mesh material={M.aglet} position={[0, -0.178, 0.02]}><cylinderGeometry args={[0.0065, 0.0065, 0.024, 8]} /></mesh>
        </group>)}
        {A(P.armL, 1)}{A(P.armR, -1)}
        {/* neck + head */}
        <mesh material={M.skin} position={[0, 0.3, 0.0]}><cylinderGeometry args={[0.046, 0.05, 0.1, 24]} /></mesh>
        <group position={[0, 0.34, 0.005]} rotation={new THREE.Euler(P.headX, P.headY, P.headZ, 'YXZ')} scale={1.13}>
          <group position={[0, 0.115, 0.0]}>
            <mesh geometry={G.head} material={M.head} />
            {/* ears */}
            {[1, -1].map((s) => <group key={s} position={[s * 0.118, -0.008, -0.005]} rotation={[0, s * 0.35, 0]}>
              <mesh material={M.head} scale={[0.012, 0.03, 0.022]}><sphereGeometry args={[1, 16, 12]} /></mesh>
              <mesh material={M.lip} position={[s * 0.004, 0, 0.003]} scale={[0.006, 0.018, 0.012]}><sphereGeometry args={[1, 12, 10]} /></mesh>
            </group>)}
            {/* nose */}
            <mesh material={M.head} position={[0, -0.022, 0.121]} scale={[0.0125, 0.012, 0.012]}><sphereGeometry args={[1, 18, 14]} /></mesh>
            <mesh material={M.head} position={[0, -0.008, 0.116]} rotation={[0.35, 0, 0]} scale={[0.0075, 0.02, 0.008]}><sphereGeometry args={[1, 12, 10]} /></mesh>
            {eye(1)}{eye(-1)}
            {/* brows */}
            {brows.map((g, i) => <mesh key={i} geometry={g} material={M.brow} position={[0, 0.062, 0.106 + brOn]} />)}
            {/* mouth */}
            <group position={[0, -0.066 + 0.004 * f.smile, 0.117]}>
              {mouth.line && <mesh geometry={mouth.line} material={M.mouthLine} />}
              {mouth.open && <>
                <mesh geometry={mouth.open} material={M.mouthIn} />
                <mesh material={M.teeth} position={[0, 0.0005, -0.003]} scale={[0.024 * (1 + 0.3 * f.mouthW), Math.min(0.006, 0.2 * mouth.H), 0.004]}><sphereGeometry args={[1, 16, 8]} /></mesh>
                <mesh material={M.tongue} position={[0, -mouth.H * 0.75, -0.004]} scale={[0.018, 0.009 * open + 0.002, 0.006]}><sphereGeometry args={[1, 16, 10]} /></mesh>
              </>}
            </group>
            {/* hair (lags the head a touch for bounce) */}
            <group rotation={[hairLag[0], 0, hairLag[1]]}>
              <mesh geometry={G.hairCap} material={M.hairDark} />
              <mesh geometry={G.hairLocks} material={M.hair} />
            </group>
          </group>
        </group>
        {prop}
      </group>
    </group>
    {children}
  </group>;
};
/** hair secondary motion: lag ∝ head angular velocity (deterministic: sample the pose fn just before t) */
export const lagOf = (fn: (t: number) => Pose2, t: number): [number, number] => {
  const a = fn(t), b = fn(t - 0.07);
  return [-(a.headX - b.headX) * 1.6 - (a.lean - b.lean) * 1.2 + (a.y - b.y) * 2, -(a.headZ - b.headZ) * 1.6 - (a.side - b.side) * 1.2];
};
