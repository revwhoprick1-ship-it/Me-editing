// Cars + props for #005 (Roadster): CC-BY Roadster models (public/roadster, see CREDITS.md) normalised to real size,
// an instanced low-poly Roadster for traffic, a procedural minivan that bursts apart, thruster plumes, a traffic light,
// a Space Shuttle stack, cash bundles, a wall calendar, a long receipt, a coffee cup, and a generic env loader.
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, random, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {lerp, noiseTex, type V3} from './three';

// ---- loaders ------------------------------------------------------------------------------------------------------------------
const glbCache: Record<string, GLTF> = {}, texCache: Record<string, THREE.Texture> = {};
const useAsync = (keys: string[], cached: (k: string) => boolean, load: (k: string) => Promise<void>, label: string) => {
  const missing = keys.filter((k) => !cached(k));
  const [, set] = useState(0);
  const [h] = useState(() => (missing.length ? delayRender(`${label} ${missing.join(',')}`, {timeoutInMilliseconds: 240000}) : null));
  useEffect(() => { if (!missing.length) return; Promise.all(missing.map(load)).then(() => { set((x) => x + 1); if (h !== null) continueRender(h); }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return keys.every(cached);
};
export const useGLBs = (paths: string[]) => {
  const ok = useAsync(paths, (k) => !!glbCache[k], (k) => new GLTFLoader().loadAsync(staticFile(k)).then((g) => { glbCache[k] = g; }), 'glb');
  return ok ? (glbCache as Record<string, GLTF>) : null;
};
export const useTextures = (paths: string[], equirect: string[] = []) => {
  const ok = useAsync(paths, (k) => !!texCache[k], (k) => new THREE.TextureLoader().loadAsync(staticFile(k)).then((t) => {
    if (equirect.includes(k)) t.mapping = THREE.EquirectangularReflectionMapping;
    if (!k.includes('_nor_') && !k.includes('_rough_')) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8; texCache[k] = t;
  }), 'tex');
  return ok ? texCache : null;
};

// ---- Roadster (hero) ----------------------------------------------------------------------------------------------------------
const LEN = 4.3; // metres
/** normalise a GLTF scene: centre x/z, wheels on y=0, length along +z = LEN; returns the wrapper and wheel nodes */
const normalise = (src: THREE.Object3D, flip: boolean) => {
  const obj = src.clone(true), wrap = new THREE.Group(), inner = new THREE.Group();
  inner.add(obj); wrap.add(inner); obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3());
  if (size.x > size.z) inner.rotation.y = Math.PI / 2;
  inner.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(inner), s2 = b2.getSize(new THREE.Vector3()), c = b2.getCenter(new THREE.Vector3());
  const k = LEN / s2.z;
  inner.position.set(-c.x * k, -b2.min.y * k, -c.z * k); inner.scale.setScalar(k);
  if (flip) wrap.rotation.y = Math.PI;
  const outer = new THREE.Group(); outer.add(wrap);
  return outer;
};
const glassMat = new THREE.MeshPhysicalMaterial({color: '#0d1116', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.55, clearcoat: 1});
export const makeRoadster = (g: GLTF, paint = '#b0101a', glassOpacity = 0.55) => {
  const outer = normalise(g.scene, false);
  const paintMat = new THREE.MeshPhysicalMaterial({color: paint, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.05});
  const glass = glassMat.clone(); glass.opacity = glassOpacity;
  const wheels: THREE.Object3D[] = [];
  outer.traverse((o) => {
    if (/Wheel/i.test(o.name) && !/Wheel.*Wheel/i.test(o.name)) wheels.push(o);
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const repl = mats.map((mm) => {
      const n = mm.name;
      if (n === 'car_main_paint') return paintMat;
      if (/Glass_(mid_tint|Clear|Tint_max)/.test(n)) return glass;
      const p = mm as THREE.MeshPhysicalMaterial; if (p.transmission) { const q = p.clone(); q.transmission = 0; q.transparent = true; q.opacity = 0.5; return q; }
      return mm;
    });
    m.material = Array.isArray(m.material) ? repl : repl[0];
  });
  return {obj: outer, paint: paintMat, wheels};
};
/** a placed hero car; spin = wheel angle (rad); flip if the model faces −z */
export const Roadster = ({car, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1}: {car: ReturnType<typeof makeRoadster>; position?: V3; rotation?: V3; scale?: number}) => {
  // one Object3D per mount (geometry/materials shared): re-parenting a single shared object across shot swaps lost it
  // in long sequential renders (it vanished from later shots although isolated stills were fine)
  const obj = useMemo(() => car.obj.clone(true), [car]);
  obj.position.set(...position); obj.rotation.set(...rotation); obj.scale.setScalar(scale);
  return <primitive object={obj} />;
};

// ---- instanced low-poly Roadsters ------------------------------------------------------------------------------------------------
export const useLowFleet = (g: GLTF | undefined, n: number, flip: boolean) => useMemo(() => {
  if (!g) return null;
  const outer = normalise(g.scene, flip); outer.updateMatrixWorld(true);
  const parts: {im: THREE.InstancedMesh; local: THREE.Matrix4}[] = [];
  outer.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return;
    const im = new THREE.InstancedMesh(m.geometry, m.material as THREE.Material, n); im.castShadow = true; im.frustumCulled = false;
    parts.push({im, local: m.matrixWorld.clone()}); });
  return parts;
}, [g, n, flip]);
export const Fleet = ({parts, mats}: {parts: NonNullable<ReturnType<typeof useLowFleet>>; mats: THREE.Matrix4[]}) => {
  const m = new THREE.Matrix4();
  for (const p of parts) { p.im.count = mats.length; mats.forEach((M, i) => p.im.setMatrixAt(i, m.multiplyMatrices(M, p.local))); p.im.instanceMatrix.needsUpdate = true; }
  return <>{parts.map((p, i) => <primitive key={i} object={p.im} />)}</>;
};
export const carM = (p: V3, yaw = 0, s = 1, pitch = 0, roll = 0) => new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ')), new THREE.Vector3(s, s, s));

// ---- procedural vehicles -------------------------------------------------------------------------------------------------------
const M = {
  van: new THREE.MeshPhysicalMaterial({color: '#9aa7b4', metalness: 0.5, roughness: 0.35, clearcoat: 1}),
  dark: new THREE.MeshStandardMaterial({color: '#15181c', roughness: 0.4}),
  tire: new THREE.MeshStandardMaterial({color: '#151515', roughness: 0.85, bumpMap: noiseTex('tire', 256, 40, [8, 1]), bumpScale: 1}),
  rim: new THREE.MeshStandardMaterial({color: '#c7ccd3', roughness: 0.25, metalness: 0.9}),
  light: new THREE.MeshBasicMaterial({color: new THREE.Color(3, 2.8, 2.4), toneMapped: false}),
  tail: new THREE.MeshBasicMaterial({color: new THREE.Color(2.4, 0.15, 0.1), toneMapped: false}),
};
const Wheel = ({p, spin = 0}: {p: V3; spin?: number}) => <group position={p} rotation={[spin, 0, Math.PI / 2]}>
  <mesh material={M.tire}><cylinderGeometry args={[0.34, 0.34, 0.24, 28]} /></mesh>
  <mesh material={M.rim} position={[0, 0.125, 0]}><cylinderGeometry args={[0.2, 0.2, 0.01, 6]} /></mesh>
</group>;
/** boxy family minivan; burst 0..1 throws its panels outward (the hook) */
const rbox = (() => { const c: Record<string, THREE.BufferGeometry> = {}; return (s: V3, r: number) => (c[`${s}${r}`] = c[`${s}${r}`] ?? new RoundedBoxGeometry(s[0], s[1], s[2], 4, r)); })();
export const Minivan = ({burst = 0, color = '#cbbfa6', spin = 0}: {burst?: number; color?: string; spin?: number}) => {
  const mat = useMemo(() => { const m = M.van.clone(); m.color.set(color); return m; }, [color]);
  const panels: {p: V3; s: V3; m: THREE.Material}[] = [
    {p: [0, 0.75, 0], s: [1.9, 0.75, 4.9], m: mat}, {p: [0, 1.38, -0.3], s: [1.84, 0.62, 3.6], m: mat}, {p: [0, 1.4, 1.62], s: [1.7, 0.5, 0.5], m: M.dark},
    {p: [0.93, 1.4, -0.3], s: [0.02, 0.42, 3.2], m: M.dark}, {p: [-0.93, 1.4, -0.3], s: [0.02, 0.42, 3.2], m: M.dark}, {p: [0, 1.4, -2.12], s: [1.6, 0.4, 0.02], m: M.dark},
  ];
  const e = burst * burst;
  return <group>
    {panels.map((q, i) => { const dir = new THREE.Vector3(q.p[0] + (random(`mv${i}x`) - 0.5), q.p[1] + 0.8, q.p[2] + (random(`mv${i}z`) - 0.5) * 2).normalize();
      return <mesh key={i} material={q.m} geometry={rbox(q.s, i < 2 ? 0.28 : 0.01)} position={[q.p[0] + dir.x * 6 * e, q.p[1] + dir.y * 5 * e, q.p[2] + dir.z * 6 * e]} rotation={[e * 4 * random(`r${i}`), e * 5 * random(`s${i}`), e * 3 * random(`t${i}`)]}
        scale={1 - 0.6 * e} castShadow />; })}
    {burst < 0.6 && [[0.82, 0.34, 1.5], [-0.82, 0.34, 1.5], [0.82, 0.34, -1.6], [-0.82, 0.34, -1.6]].map((p, i) => <Wheel key={i} p={p as V3} spin={spin} />)}
    {burst < 0.4 && <><mesh material={M.light} position={[0.62, 0.85, 2.46]}><boxGeometry args={[0.35, 0.14, 0.02]} /></mesh><mesh material={M.light} position={[-0.62, 0.85, 2.46]}><boxGeometry args={[0.35, 0.14, 0.02]} /></mesh></>}
  </group>;
};
/** generic box sedan (traffic before the transformation) */
export const Sedan = ({color = '#7d8794'}: {color?: string}) => {
  const mat = useMemo(() => { const m = M.van.clone(); m.color.set(color); return m; }, [color]);
  return <group>
    <mesh material={mat} position={[0, 0.6, 0]}><boxGeometry args={[1.8, 0.55, 4.5]} /></mesh>
    <mesh material={M.dark} position={[0, 1.1, -0.2]}><boxGeometry args={[1.6, 0.5, 2.3]} /></mesh>
    {[[0.8, 0.33, 1.4], [-0.8, 0.33, 1.4], [0.8, 0.33, -1.4], [-0.8, 0.33, -1.4]].map((p, i) => <Wheel key={i} p={p as V3} />)}
  </group>;
};
/** semi truck / pickup silhouettes for the reveal lineup */
export const Truck = ({len = 9, h = 3.6, color = '#d9dde3'}: {len?: number; h?: number; color?: string}) => <group>
  <mesh material={M.van} position={[0, h / 2 + 0.4, -1]}><boxGeometry args={[2.4, h, len - 2.2]} /></mesh>
  {[0.25, 0.5, 0.75].map((f) => <mesh key={f} material={M.dark} position={[1.205, 0.6 + h * f, -1]}><boxGeometry args={[0.02, 0.06, len - 2.4]} /></mesh>)}
  <mesh position={[0, 1.6, len / 2 - 1]}><boxGeometry args={[2.3, 2.4, 2.2]} /><meshPhysicalMaterial color={color} metalness={0.4} roughness={0.35} clearcoat={1} /></mesh>
  <mesh material={M.dark} position={[0, 2.2, len / 2 + 0.11]}><boxGeometry args={[2.1, 0.9, 0.02]} /></mesh>
  {[1, -1].map((s) => <mesh key={s} material={M.light} position={[s * 0.85, 0.9, len / 2 + 0.11]}><boxGeometry args={[0.4, 0.12, 0.02]} /></mesh>)}
  <mesh material={M.rim} position={[0, 1.0, len / 2 + 0.11]}><boxGeometry args={[1.0, 0.5, 0.02]} /></mesh>
  {[len / 2 - 1.2, 0.5, -len / 2 + 1.5].map((z, i) => [1, -1].map((s) => <Wheel key={`${i}${s}`} p={[s * 1.05, 0.45, z]} />))}
</group>;

// ---- effects --------------------------------------------------------------------------------------------------------------------
const plumeMat = new THREE.MeshBasicMaterial({color: '#dfeeff', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending});
/** cold-gas thruster plumes out of the rear (local −z), power 0..1, t seconds (flicker) */
export const Thrusters = ({power, t, z = -2.2, y = 0.55, xs = [-0.45, -0.15, 0.15, 0.45], down = false}: {power: number; t: number; z?: number; y?: number; xs?: number[]; down?: boolean}) => {
  if (power <= 0.01) return null;
  return <group>{xs.map((x, i) => { const L = (1.4 + 0.4 * Math.sin(t * 60 + i * 2)) * power;
    return <group key={i} position={[x, down ? 0.2 : y, down ? 0 : z]} rotation={down ? [Math.PI, 0, 0] : [-Math.PI / 2, 0, 0]}>
      <mesh material={plumeMat} position={[0, L / 2, 0]}><coneGeometry args={[0.18 * power + 0.05, L, 16, 1, true]} /></mesh>
      <mesh material={plumeMat} position={[0, L * 0.3, 0]}><coneGeometry args={[0.08 * power + 0.03, L * 0.6, 12, 1, true]} /></mesh>
    </group>; })}</group>;
};
export const TrafficLight = ({state}: {state: 'red' | 'green'}) => <group>
  <mesh material={M.dark} position={[0, 2.2, 0]}><cylinderGeometry args={[0.07, 0.09, 4.4, 12]} /></mesh>
  <mesh material={M.dark} position={[0, 4.7, 0.1]}><boxGeometry args={[0.45, 1.3, 0.35]} /></mesh>
  {[['#ff2a1a', 5.1, 'red'], ['#ffb21a', 4.7, 'x'], ['#22ff6a', 4.3, 'green']].map(([c, y, k]) => <mesh key={k as string} position={[0, y as number, 0.28]}>
    <circleGeometry args={[0.15, 24]} /><meshBasicMaterial color={k === state ? new THREE.Color(c as string).multiplyScalar(3) : new THREE.Color(c as string).multiplyScalar(0.12)} toneMapped={false} /></mesh>)}
</group>;
/** Space Shuttle stack (orbiter + tank + boosters) with a flame; flame 0..1 */
export const Shuttle = ({flame, t}: {flame: number; t: number}) => {
  const white = useMemo(() => new THREE.MeshStandardMaterial({color: '#eceff3', roughness: 0.5}), []), tank = useMemo(() => new THREE.MeshStandardMaterial({color: '#c4672b', roughness: 0.7, bumpMap: noiseTex('tank', 256, 30, [2, 8]), bumpScale: 1}), []);
  return <group>
    <mesh material={tank} position={[0, 23, 0]}><cylinderGeometry args={[4.2, 4.2, 46, 32]} /></mesh>
    <mesh material={tank} position={[0, 48, 0]}><coneGeometry args={[4.2, 6, 32]} /></mesh>
    {[1, -1].map((s) => <group key={s} position={[s * 6, 0, 0]}><mesh material={white} position={[0, 22, 0]}><cylinderGeometry args={[1.85, 1.85, 44, 24]} /></mesh><mesh material={white} position={[0, 46, 0]}><coneGeometry args={[1.85, 5, 24]} /></mesh></group>)}
    <group position={[0, 0, 5.6]}><mesh material={white} position={[0, 18, 0]} scale={[1, 1, 0.7]}><cylinderGeometry args={[2.6, 2.6, 30, 24]} /></mesh>
      <mesh material={white} position={[0, 34, 0]} scale={[1, 1, 0.7]}><sphereGeometry args={[2.6, 24, 16]} /></mesh>
      <mesh material={white} position={[0, 8, 0.5]} rotation={[0, 0, 0]} scale={[1, 1, 0.12]}><coneGeometry args={[9, 18, 3]} /></mesh></group>
    {flame > 0 && [-6, 0, 6].map((x, i) => <mesh key={i} position={[x, -6 * flame - 2, i === 1 ? 2 : 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.2, 12 * flame * (1 + 0.1 * Math.sin(t * 40 + i)), 16, 1, true]} /><meshBasicMaterial color={new THREE.Color(4, 2.2, 0.6)} transparent opacity={0.85} toneMapped={false} depthWrite={false} /></mesh>)}
  </group>;
};
const cashTex = () => { const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d')!;
  x.fillStyle = '#9fc39a'; x.fillRect(0, 0, 256, 128); x.strokeStyle = '#3f6b45'; x.lineWidth = 6; x.strokeRect(8, 8, 240, 112);
  x.fillStyle = '#d9c27a'; x.fillRect(110, 0, 36, 128); x.fillStyle = '#2f5537'; x.font = '800 44px Georgia'; x.fillText('100', 20, 80); x.fillText('100', 160, 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
let _cashMat: THREE.MeshStandardMaterial | null = null;
/** instanced pile of $10k bundles: a cone-shaped heap of n bundles (grow 0..1) */
export const CashPile = ({n, grow, radius, height, seed = 'cash'}: {n: number; grow: number; radius: number; height: number; seed?: string}) => {
  const im = useMemo(() => { _cashMat = _cashMat ?? new THREE.MeshStandardMaterial({map: cashTex(), roughness: 0.75});
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.156, 0.03, 0.066), _cashMat, n); m.frustumCulled = false; m.castShadow = true; return m; }, [n]);
  const k = Math.max(1, Math.floor(n * grow)), mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const u = random(`${seed}u${i}`), a = random(`${seed}a${i}`) * Math.PI * 2, hh = Math.pow(random(`${seed}h${i}`), 1.6) * height * grow;
    const rr = radius * grow * (1 - hh / (height * grow + 1e-6)) * Math.sqrt(u);
    e.set((random(`${seed}x${i}`) - 0.5) * 0.6, a * 3, (random(`${seed}z${i}`) - 0.5) * 0.6); q.setFromEuler(e);
    const sc = i < k ? 1 + 40 * radius / 100 : 0;
    mtx.compose(new THREE.Vector3(Math.cos(a) * rr, hh, Math.sin(a) * rr), q, new THREE.Vector3(sc, sc, sc)); im.setMatrixAt(i, mtx);
  }
  im.instanceMatrix.needsUpdate = true;
  return <primitive object={im} />;
};
const calTex = (year: string) => { const c = document.createElement('canvas'); c.width = 512; c.height = 640; const x = c.getContext('2d')!;
  x.fillStyle = '#fbfaf6'; x.fillRect(0, 0, 512, 640); x.fillStyle = '#d32f2f'; x.fillRect(0, 0, 512, 170);
  x.fillStyle = '#fff'; x.font = '900 120px Inter, Arial'; x.textAlign = 'center'; x.fillText(year, 256, 135);
  x.fillStyle = '#333'; x.font = '700 30px Inter, Arial'; ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => x.fillText(d, 50 + i * 69, 215));
  for (let r = 0; r < 5; r++) for (let i = 0; i < 7; i++) { x.fillStyle = '#e8e6e0'; x.fillRect(22 + i * 69, 240 + r * 76, 60, 66); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const calCache: Record<string, THREE.Texture> = {};
/** wall calendar flipping through years; p 0..1 across the list, the page in flight curls up */
export const Calendar = ({years, p}: {years: string[]; p: number}) => {
  const f = p * (years.length - 1), i = Math.min(years.length - 1, Math.floor(f)), k = f - i;
  const tex = (y: string) => (calCache[y] = calCache[y] ?? calTex(y));
  return <group>
    <mesh position={[0, 0, -0.01]}><planeGeometry args={[1.6, 2]} /><meshStandardMaterial map={tex(years[Math.min(years.length - 1, i + 1)])} roughness={0.85} /></mesh>
    {k > 0.02 && i < years.length - 1 ? <group position={[0, 1, 0]} rotation={[-k * Math.PI * 0.95, 0, 0]}><mesh position={[0, -1, 0.01]}><planeGeometry args={[1.6, 2]} /><meshStandardMaterial map={tex(years[i])} roughness={0.85} side={THREE.DoubleSide} /></mesh></group>
      : <mesh position={[0, 0, 0.005]}><planeGeometry args={[1.6, 2]} /><meshStandardMaterial map={tex(years[i])} roughness={0.85} /></mesh>}
    <mesh material={M.dark} position={[0, 1.02, 0.02]}><boxGeometry args={[1.7, 0.08, 0.06]} /></mesh>
  </group>;
};
const rcpTex = () => { const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const x = c.getContext('2d')!;
  x.fillStyle = '#fbfaf3'; x.fillRect(0, 0, 256, 1024); x.fillStyle = '#333'; x.font = '700 22px "Courier New", monospace';
  for (let i = 0; i < 34; i++) x.fillText(i % 6 === 0 ? 'ROADSTER  $200,000' : `ROADSTER ×${(i * 1234567) % 9000 + 1000}`, 14, 40 + i * 29);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapT = THREE.RepeatWrapping; return t; };
let _rcp: THREE.Texture | null = null;
/** receipt hanging from a hand point and unrolling to length L (m), curling on the ground */
export const Receipt = ({L, from}: {L: number; from: V3}) => {
  _rcp = _rcp ?? rcpTex();
  const drop = from[1] - 0.012; // lands just above the shadow-catcher plane (y 0.003), which would hide it
  // rebuilt every frame (L changes every frame); never frustum-culled
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.22, 1, 1, 80), p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const s = (0.5 - p.getY(i)) * L;
      p.setY(i, s < drop ? -s : -drop); p.setZ(i, s < drop ? 0.02 * Math.sin(s * 9) : s - drop); }
    g.computeVertexNormals(); g.computeBoundingSphere(); return g;
  }, [L, drop]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({map: _rcp!, side: THREE.DoubleSide, roughness: 0.9}), []);
  mat.map!.repeat.set(1, Math.max(1, L / 0.6));
  return <mesh geometry={geo} material={mat} position={from} castShadow frustumCulled={false} renderOrder={2} />;
};
export const Coffee = ({tilt = 0}: {tilt?: number}) => <group rotation={[tilt, 0, 0]}>
  <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.045, 0.035, 0.14, 24]} /><meshStandardMaterial color="#f3eee6" roughness={0.6} /></mesh>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.047, 0.042, 0.05, 24]} /><meshStandardMaterial color="#7b4a2a" roughness={0.8} /></mesh>
  <mesh position={[0, 0.148, 0]}><cylinderGeometry args={[0.048, 0.048, 0.016, 24]} /><meshStandardMaterial color="#2b2b2b" roughness={0.5} /></mesh>
</group>;
/** asphalt ground with a radial fade so it blends into the projected HDRI ground */
let _fade: THREE.Texture | null = null;
export const Asphalt = ({tex, size = 60, repeat = 12, y = 0.002, lines = false}: {tex: {d: THREE.Texture; n: THREE.Texture; r: THREE.Texture}; size?: number; repeat?: number; y?: number; lines?: boolean}) => {
  _fade = _fade ?? (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; const g = x.createRadialGradient(128, 128, 60, 128, 128, 128);
    g.addColorStop(0, '#fff'); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const mat = useMemo(() => { const d = tex.d.clone(), n = tex.n.clone(), r = tex.r.clone(); [d, n, r].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); t.needsUpdate = true; });
    return new THREE.MeshStandardMaterial({map: d, normalMap: n, roughnessMap: r, alphaMap: _fade!, transparent: true, depthWrite: false}); }, [tex, repeat]);
  return <group>
    <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[size, size]} /></mesh>
    {lines && [-1.8, 1.8].map((x) => Array.from({length: 14}, (_, i) => <mesh key={`${x}${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, y + 0.002, -size / 2 + 3 + i * (size / 14)]}>
      <planeGeometry args={[0.14, 2.4]} /><meshStandardMaterial color="#e9e5d8" roughness={0.7} /></mesh>))}
  </group>;
};
export const lerpV3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
