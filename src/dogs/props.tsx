// Procedural props for #003 (all ours): bowl, tie, Speaker's wig, backpack, rosette, podium + mics, gavel, desk + laptop,
// chalkboard, benches, banner, table + chairs, contract, confetti, camera flashes, leash, floating word cards.
import {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {lerp, type V3} from '../inside/kit/three';

// ---- canvas textures ----------------------------------------------------------------------------------------------------
const tc = new Map<string, THREE.CanvasTexture>();
type TextOpts = {w?: number; h?: number; bg?: string; fg?: string; size?: number; weight?: number; font?: string; border?: string; radius?: number; align?: CanvasTextAlign};
export const textTex = (lines: string[], o: TextOpts = {}) => {
  const key = JSON.stringify([lines, o]);
  if (tc.has(key)) return tc.get(key)!;
  const w = o.w ?? 512, h = o.h ?? 256, c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d')!;
  if (o.bg) { x.fillStyle = o.bg; const r = o.radius ?? 0; x.beginPath(); x.roundRect(0, 0, w, h, r); x.fill(); }
  if (o.border) { x.strokeStyle = o.border; x.lineWidth = Math.max(4, h * 0.03); const r = o.radius ?? 0; x.beginPath(); x.roundRect(x.lineWidth, x.lineWidth, w - 2 * x.lineWidth, h - 2 * x.lineWidth, r); x.stroke(); }
  const size = o.size ?? h * 0.32; x.fillStyle = o.fg ?? '#fff'; x.textAlign = o.align ?? 'center'; x.textBaseline = 'middle';
  x.font = `${o.weight ?? 800} ${size}px ${o.font ?? 'Inter, Arial, sans-serif'}`;
  lines.forEach((l, i) => x.fillText(l, o.align === 'left' ? size * 0.4 : w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.15, w * 0.94));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; tc.set(key, t);
  return t;
};
const canvasTex = (key: string, w: number, h: number, draw: (x: CanvasRenderingContext2D) => void) => {
  if (tc.has(key)) return tc.get(key)!;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; tc.set(key, t);
  return t;
};
const sealTex = () => canvasTex('seal', 512, 512, (x) => {
  x.fillStyle = '#0d2a5c'; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill();
  x.strokeStyle = '#e8c66a'; x.lineWidth = 14; x.beginPath(); x.arc(256, 256, 226, 0, 7); x.stroke(); x.lineWidth = 5; x.beginPath(); x.arc(256, 256, 176, 0, 7); x.stroke();
  x.fillStyle = '#e8c66a'; // paw print
  x.beginPath(); x.ellipse(256, 300, 62, 52, 0, 0, 7); x.fill();
  [[-70, -30], [-26, -78], [26, -78], [70, -30]].forEach(([dx, dy]) => { x.beginPath(); x.ellipse(256 + dx, 256 + dy, 24, 30, dx * 0.006, 0, 7); x.fill(); });
  x.font = '800 34px Inter, Arial'; x.textAlign = 'center';
  const ring = 'PRESIDENT OF THE DOGS ★ ', R = 200;
  [...ring].forEach((ch, i) => { const a = -Math.PI / 2 + (i / ring.length) * Math.PI * 2; x.save(); x.translate(256 + R * Math.cos(a), 256 + R * Math.sin(a)); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, 12); x.restore(); });
});
const reportTex = () => canvasTex('report', 640, 400, (x) => {
  x.fillStyle = '#f5f7fb'; x.fillRect(0, 0, 640, 400); x.fillStyle = '#1f3b73'; x.fillRect(0, 0, 640, 64);
  x.fillStyle = '#fff'; x.font = '800 34px Inter, Arial'; x.fillText('Q3 BARK REPORT', 22, 44);
  const v = [0.35, 0.5, 0.42, 0.7, 0.92]; const lab = ['SNACKS', 'NAPS', 'WALKS', 'BALLS', 'RUBS'];
  v.forEach((k, i) => { x.fillStyle = i === 4 ? '#f0a020' : '#3d7be0'; x.fillRect(50 + i * 116, 360 - k * 260, 80, k * 260); x.fillStyle = '#333'; x.font = '700 20px Inter, Arial'; x.fillText(lab[i], 46 + i * 116, 390); });
});
const boardTex = () => canvasTex('board', 1024, 512, (x) => {
  x.fillStyle = '#25392c'; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(255,255,255,${0.02 + 0.03 * random(`ch${i}`)})`; x.fillRect(random(`cx${i}`) * 1024, random(`cy${i}`) * 512, 40 + 120 * random(`cw${i}`), 3); }
  x.fillStyle = '#f2f2ea'; x.font = '700 64px "Comic Sans MS", Inter, Arial'; x.fillText('HOMEWORK DUE TODAY', 70, 120);
  x.font = '600 52px "Comic Sans MS", Inter, Arial'; x.fillText('1. Do NOT eat it', 90, 230); x.fillText('2. Sit. Stay. Learn.', 90, 320);
  x.fillText('🦴  = A+', 90, 420);
});
const bannerTex = (txt: string, bg = '#7a1020') => canvasTex(`banner:${txt}:${bg}`, 1024, 192, (x) => {
  x.fillStyle = bg; x.fillRect(0, 0, 1024, 192); x.strokeStyle = '#e8c66a'; x.lineWidth = 10; x.strokeRect(12, 12, 1000, 168);
  x.fillStyle = '#f6e6b0'; x.font = '800 92px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 512, 100);
});

// ---- materials --------------------------------------------------------------------------------------------------------------
const std = (color: string, rough = 0.5, metal = 0, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) => new THREE.MeshPhysicalMaterial({color, roughness: rough, metalness: metal, ...extra});
const M = {
  steel: std('#c9ced6', 0.22, 1), kibble: std('#7a4a22', 0.7), wood: std('#6b4528', 0.55), darkWood: std('#3b2516', 0.45, 0, {clearcoat: 0.6, clearcoatRoughness: 0.3}),
  red: std('#a3172c', 0.55, 0, {sheen: 1, sheenColor: new THREE.Color('#ff7080')}), navy: std('#1b2c55', 0.6, 0, {sheen: 1, sheenColor: new THREE.Color('#6080ff')}),
  white: std('#f3f1ec', 0.85), gold: std('#d9b45a', 0.28, 1), black: std('#16171a', 0.35, 0.2), green: std('#2f6a45', 0.7, 0, {sheen: 0.8, sheenColor: new THREE.Color('#9fe0b0')}),
  paper: std('#f7f4ea', 0.9), plastic: std('#2a2d33', 0.35), orange: std('#e0782a', 0.6), leash: std('#d83a2a', 0.5, 0, {clearcoat: 0.5}),
};

// ---- props ------------------------------------------------------------------------------------------------------------------
export const Bowl = ({full = 1}: {full?: number}) => {
  const geo = useMemo(() => new THREE.LatheGeometry([[0.05, 0], [0.11, 0.004], [0.12, 0.05], [0.115, 0.055], [0.075, 0.012], [0.0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y)), 48), []);
  const K = useMemo(() => Array.from({length: 70}, (_, i) => { const a = random(`ka${i}`) * 7, r = Math.sqrt(random(`kr${i}`)) * 0.07; return [Math.cos(a) * r, 0.02 + random(`ky${i}`) * 0.02 * full, Math.sin(a) * r] as V3; }), [full]);
  return <group><mesh geometry={geo} material={M.steel} castShadow receiveShadow />
    {full > 0 && K.map((p, i) => <mesh key={i} position={p} rotation={[i, i * 2, 0]} material={M.kibble}><dodecahedronGeometry args={[0.011]} /></mesh>)}
  </group>;
};
/** tie hanging down the chest; place at the throat (actor frame: +z forward) */
export const Tie = ({color = M.red, s = 1}: {color?: THREE.Material; s?: number}) => {
  const blade = useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(-0.016, 0); sh.lineTo(0.016, 0); sh.lineTo(0.034, -0.16); sh.lineTo(0, -0.2); sh.lineTo(-0.034, -0.16); sh.closePath();
    return new THREE.ExtrudeGeometry(sh, {depth: 0.008, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2}); }, []);
  return <group scale={s}>
    <mesh material={M.white} position={[0, 0.012, -0.02]} rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[0.075, 0.012, 8, 32]} /></mesh>
    <mesh material={color} position={[0, 0, 0]}><boxGeometry args={[0.036, 0.03, 0.022]} /></mesh>
    <mesh geometry={blade} material={color} position={[0, -0.012, 0]} rotation={[-0.25, 0, 0]} />
  </group>;
};
export const BowTie = ({color = M.navy, s = 1}: {color?: THREE.Material; s?: number}) => <group scale={s}>
  <mesh material={color}><sphereGeometry args={[0.014, 12, 10]} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} material={color} position={[k * 0.03, 0, 0]} rotation={[0, 0, k * Math.PI / 2]}><coneGeometry args={[0.026, 0.05, 4]} /></mesh>)}
</group>;
/** British Speaker's wig: rows of white curls */
export const Wig = ({s = 1}: {s?: number}) => {
  const C = useMemo(() => { const out: V3[] = []; for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) { const a = -1.25 + (i / 8) * 2.5; const r = 0.085 + row * 0.004; out.push([Math.sin(a) * r, 0.03 - row * 0.032, -0.02 + Math.cos(a) * r * 0.55 - row * 0.01]); } for (let i = 0; i < 10; i++) out.push([(random(`wt${i}`) - 0.5) * 0.12, 0.06, (random(`wz${i}`) - 0.5) * 0.1]); return out; }, []);
  return <group scale={s}>{C.map((p, i) => <mesh key={i} position={p} material={M.white} castShadow><sphereGeometry args={[0.026, 10, 8]} /></mesh>)}</group>;
};
export const Backpack = ({s = 1}: {s?: number}) => <group scale={s}>
  <mesh material={M.orange} castShadow><boxGeometry args={[0.16, 0.06, 0.15]} /></mesh>
  <mesh material={M.navy} position={[0, 0.0, 0.08]}><boxGeometry args={[0.12, 0.05, 0.03]} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} material={M.black} position={[k * 0.085, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.055, 0.008, 6, 20, Math.PI]} /></mesh>)}
</group>;
export const Rosette = ({s = 1}: {s?: number}) => <group scale={s}>
  <mesh material={M.gold} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.012, 24]} /></mesh>
  <mesh position={[0, 0, 0.007]}><circleGeometry args={[0.034, 32]} /><meshStandardMaterial map={sealTex()} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} material={M.red} position={[k * 0.022, -0.07, -0.004]} rotation={[0, 0, k * 0.2]}><boxGeometry args={[0.03, 0.09, 0.004]} /></mesh>)}
</group>;
export const Podium = ({w = 0.9, h = 0.75, seal = true, mics = true}: {w?: number; h?: number; seal?: boolean; mics?: boolean}) => <group>
  <mesh material={M.darkWood} position={[0, h / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, h, 0.45]} /></mesh>
  <mesh material={M.darkWood} position={[0, h + 0.015, -0.02]} rotation={[-0.25, 0, 0]} castShadow><boxGeometry args={[w * 1.08, 0.03, 0.55]} /></mesh>
  {seal && <mesh position={[0, h * 0.55, 0.227]}><circleGeometry args={[Math.min(w, h) * 0.32, 48]} /><meshStandardMaterial map={sealTex()} roughness={0.4} /></mesh>}
  {mics && [-1, 1].map((k) => <group key={k} position={[k * 0.09, h + 0.03, 0.12]} rotation={[0.55, k * -0.25, 0]}>
    <mesh material={M.black} position={[0, 0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.24, 8]} /></mesh>
    <mesh material={M.black} position={[0, 0.25, 0]}><sphereGeometry args={[0.022, 14, 12]} /></mesh>
  </group>)}
</group>;
export const Gavel = ({swing = 0}: {swing?: number}) => <group>
  <mesh material={M.darkWood} position={[0, 0.012, 0]} castShadow><cylinderGeometry args={[0.07, 0.075, 0.024, 28]} /></mesh>
  <group position={[0.14, 0.03, 0]} rotation={[0, 0, swing]}>
    <mesh material={M.wood} position={[-0.09, 0.03, 0]} rotation={[0, 0, Math.PI / 2 - 0.15]}><cylinderGeometry args={[0.009, 0.011, 0.2, 10]} /></mesh>
    <mesh material={M.darkWood} position={[-0.175, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.11, 18]} /></mesh>
  </group>
</group>;
export const Desk = ({w = 1.3, h = 0.74, d = 0.65}: {w?: number; h?: number; d?: number}) => <group>
  <mesh material={M.darkWood} position={[0, h, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.04, d]} /></mesh>
  <mesh material={M.darkWood} position={[0, h / 2, d / 2 - 0.02]} castShadow><boxGeometry args={[w, h, 0.03]} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} material={M.darkWood} position={[k * (w / 2 - 0.02), h / 2, 0]} castShadow><boxGeometry args={[0.03, h, d]} /></mesh>)}
</group>;
export const Laptop = ({open = 1.85, glow = 1}: {open?: number; glow?: number}) => <group>
  <mesh material={M.plastic} position={[0, 0.006, 0]} castShadow><boxGeometry args={[0.34, 0.012, 0.23]} /></mesh>
  <group position={[0, 0.012, -0.115]} rotation={[-(open - Math.PI / 2), 0, 0]}>
    <mesh material={M.plastic} position={[0, 0.11, -0.004]}><boxGeometry args={[0.34, 0.22, 0.008]} /></mesh>
    <mesh position={[0, 0.11, 0.001]}><planeGeometry args={[0.31, 0.195]} /><meshBasicMaterial map={reportTex()} color={new THREE.Color(glow, glow, glow)} toneMapped={false} /></mesh>
  </group>
</group>;
export const Chalkboard = ({w = 2.2}: {w?: number}) => <group>
  <mesh material={M.wood} position={[0, 0, -0.02]}><boxGeometry args={[w + 0.08, w / 2 + 0.08, 0.04]} /></mesh>
  <mesh position={[0, 0, 0.001]}><planeGeometry args={[w, w / 2]} /><meshStandardMaterial map={boardTex()} roughness={0.95} /></mesh>
</group>;
export const SchoolDesk = () => <group>
  <mesh material={M.wood} position={[0, 0.42, 0]} rotation={[0.12, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.6, 0.03, 0.42]} /></mesh>
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} material={M.steel} position={[a * 0.26, 0.21, b * 0.17]}><cylinderGeometry args={[0.012, 0.012, 0.42, 8]} /></mesh>)}
</group>;
export const Bench = ({w = 3, color = M.green}: {w?: number; color?: THREE.Material}) => <group>
  <mesh material={color} position={[0, 0.22, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.12, 0.6]} /></mesh>
  <mesh material={color} position={[0, 0.5, -0.32]} castShadow><boxGeometry args={[w, 0.5, 0.1]} /></mesh>
  <mesh material={M.darkWood} position={[0, 0.08, 0]} receiveShadow><boxGeometry args={[w + 0.06, 0.16, 0.66]} /></mesh>
</group>;
export const Banner = ({text, w = 3, bg}: {text: string; w?: number; bg?: string}) => <mesh><planeGeometry args={[w, w * 0.1875]} /><meshStandardMaterial map={bannerTex(text, bg)} side={THREE.DoubleSide} roughness={0.8} /></mesh>;
export const Table = ({w = 2.2, d = 1, h = 0.75}: {w?: number; d?: number; h?: number}) => <group>
  <mesh material={M.darkWood} position={[0, h, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.05, d]} /></mesh>
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} material={M.darkWood} position={[a * (w / 2 - 0.08), h / 2, b * (d / 2 - 0.08)]} castShadow><boxGeometry args={[0.06, h, 0.06]} /></mesh>)}
</group>;
export const Chair = ({seat = 0.46, color = M.navy, back = true}: {seat?: number; color?: THREE.Material; back?: boolean}) => <group>
  <mesh material={color} position={[0, seat, 0]} castShadow receiveShadow><boxGeometry args={[0.5, 0.08, 0.5]} /></mesh>
  {back && <mesh material={color} position={[0, seat + 0.33, -0.23]} castShadow><boxGeometry args={[0.5, 0.6, 0.07]} /></mesh>}
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} material={M.steel} position={[a * 0.21, seat / 2, b * 0.21]}><cylinderGeometry args={[0.014, 0.014, seat, 8]} /></mesh>)}
</group>;
export const Paper = ({lines, w = 0.3, rot = 0}: {lines: string[]; w?: number; rot?: number}) => <mesh rotation={[-Math.PI / 2, 0, rot]} receiveShadow>
  <planeGeometry args={[w, w * 1.3]} /><meshStandardMaterial map={textTex(lines, {w: 400, h: 520, bg: '#f7f4ea', fg: '#222', size: 44, weight: 800})} roughness={0.9} /></mesh>;
/** torn paper bits (eaten homework) scattered on the floor */
export const Scraps = ({n = 14, r = 0.35}: {n?: number; r?: number}) => <group>{Array.from({length: n}, (_, i) => {
  const a = random(`sa${i}`) * 7, d = Math.sqrt(random(`sd${i}`)) * r;
  return <mesh key={i} material={M.paper} position={[Math.cos(a) * d, 0.004 + i * 0.0004, Math.sin(a) * d]} rotation={[-Math.PI / 2 + (random(`sx${i}`) - 0.5) * 0.4, 0, a * 3]} receiveShadow castShadow>
    <planeGeometry args={[0.04 + 0.05 * random(`sw${i}`), 0.03 + 0.05 * random(`sh${i}`)]} /></mesh>;
})}</group>;
/** confetti falling from y0 (t in s) */
export const Confetti = ({t, n = 160, area = [4, 3], y0 = 3.2, seed = 'cf'}: {t: number; n?: number; area?: [number, number]; y0?: number; seed?: string}) => {
  const cols = ['#ffd84a', '#ff4f6d', '#5ad1ff', '#ffffff', '#7ce07c'];
  const mats = useMemo(() => cols.map((c) => new THREE.MeshStandardMaterial({color: c, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.3})), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <group>{Array.from({length: n}, (_, i) => {
    const sp = 0.35 + 0.35 * random(`${seed}v${i}`), y = y0 + random(`${seed}y${i}`) * 1.5 - (t * sp) % (y0 + 1.5);
    if (y < 0.01) return null;
    const x = (random(`${seed}x${i}`) - 0.5) * area[0] + 0.08 * Math.sin(t * 3 + i), z = (random(`${seed}z${i}`) - 0.5) * area[1];
    return <mesh key={i} material={mats[i % cols.length]} position={[x, y, z]} rotation={[t * 5 + i, t * 3 + i * 2, i]}><planeGeometry args={[0.035, 0.02]} /></mesh>;
  })}</group>;
};
/** press-camera flashes: bright billboards that pop for ~80 ms */
export const Flashes = ({o, spots, seed = 'fl'}: {o: number; spots: V3[]; seed?: string}) => <group>{spots.map((p, i) => {
  const per = 380 + 300 * random(`${seed}p${i}`), ph = (o + random(`${seed}o${i}`) * per) % per, k = ph < 80 ? 1 - ph / 80 : 0;
  return k > 0 ? <sprite key={i} position={p} scale={0.25 + 0.35 * k}><spriteMaterial color={new THREE.Color(6 * k, 6 * k, 6.5 * k)} transparent opacity={k} depthWrite={false} toneMapped={false} /></sprite> : null;
})}</group>;
/** leash: sagging tube between two world points (collar → hand) */
export const Leash = ({a, b, sag = 0.12, r = 0.008}: {a: THREE.Vector3; b: THREE.Vector3; sag?: number; r?: number}) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const m1 = a.clone().lerp(b, 0.33), m2 = a.clone().lerp(b, 0.66); m1.y -= sag * 0.8; m2.y -= sag * 0.8;
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, m1, m2, b]), 40, r, 6, false);
  geo.copy(g); g.dispose();
  return <mesh geometry={geo} material={M.leash} castShadow />;
};
/** floating word cards (the ~89 words real dogs respond to) */
export const WordCards = ({o, a, words, center, radius = 0.5}: {o: number; a: number; words: string[]; center: V3; radius?: number}) => <group position={center}>{words.map((w, i) => {
  const t0 = a + i * 110, k = Math.min(1, Math.max(0, (o - t0) / 260)); if (k <= 0) return null;
  const ang = (i / words.length) * Math.PI * 2 + o / 2600, e = 1 - (1 - k) ** 3;
  const tex = textTex([w], {w: 512, h: 160, bg: 'rgba(16,22,36,0.9)', fg: '#ffffff', size: 74, radius: 60, border: 'rgba(255,216,74,0.9)'});
  return <sprite key={i} position={[Math.cos(ang) * radius * e, 0.0 + (i % 3) * 0.1 + 0.03 * Math.sin(o / 400 + i), Math.sin(ang) * radius * 0.4 * e - 0.04]} scale={[0.15 * e, 0.047 * e, 1]}>
    <spriteMaterial map={tex} transparent depthWrite={false} /></sprite>;
})}</group>;
export const lerpV = (a: V3, b: V3, t: number) => new THREE.Vector3(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
export {M as PropMats};
