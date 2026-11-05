// Outdoor/sky kit for "Inside the Impossible" (procedural, licence-clean): feathered wings, clouds, rooftop + skyline,
// car, airliner, bird flock, a swarm of flying people, rolling hills, a 3D measuring line.
import {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {noiseTex} from './three';

// ---- feathers / wings ------------------------------------------------------------------------------------------------------
const featherGeo = (() => {
  let g: THREE.BufferGeometry | null = null;
  return () => {
    if (g) return g;
    const s = new THREE.Shape();
    s.moveTo(-0.05, 0); s.quadraticCurveTo(-0.6, -0.35, -0.42, -0.86); s.quadraticCurveTo(-0.2, -1.04, 0, -1.0);
    s.quadraticCurveTo(0.34, -0.9, 0.36, -0.5); s.quadraticCurveTo(0.3, -0.15, 0.05, 0); s.lineTo(-0.05, 0);
    g = new THREE.ShapeGeometry(s, 10);
    const p = g.attributes.position as THREE.BufferAttribute; // gentle camber
    for (let i = 0; i < p.count; i++) p.setZ(i, -0.08 * Math.sin(Math.PI * Math.min(1, -p.getY(i))) - 0.05 * p.getX(i) ** 2);
    g.computeVertexNormals();
    return g;
  };
})();
export type WingPose = {open: number; flap?: number; sweep?: number; frost?: number};
// leading edge (wing "arm"): rises from the shoulder to the wrist above the head, then sweeps down to the tip
const edge = (t: number, L: number): [number, number] => {
  const x = 0.3 + t * L;
  const y = t < 0.42 ? 2.6 * Math.sin((t / 0.42) * Math.PI / 2) : 2.6 - 3.0 * Math.pow((t - 0.42) / 0.58, 1.4);
  return [x, y];
};
const Wing = ({s, pose, mats}: {s: 1 | -1; pose: WingPose; mats: {main: THREE.Material; main2: THREE.Material; tip: THREE.Material; cov: THREE.Material; bone: THREE.Material}}) => {
  const o = pose.open, L = 9.6;
  const N = 30, NC = 22;
  const boneGeo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length: 24}, (_, i) => { const [x, y] = edge(i / 23, L); return new THREE.Vector3(x, y, 0.05); })), 80, 0.17, 10, false), []);
  const lift = -1.0 * (1 - o) + (pose.flap ?? 0);
  return <group rotation={[0, s * (pose.sweep ?? 0) - s * 0.9 * (1 - o), s * lift]} scale={[s * (0.22 + 0.78 * o), 0.45 + 0.55 * o, 1]}>
    <mesh geometry={boneGeo} material={mats.bone} />
    {Array.from({length: N}, (_, i) => {
      const t = i / (N - 1), [x, y] = edge(t, L);
      const len = 2.6 + 1.6 * t + (t > 0.55 ? 2.6 * (t - 0.55) / 0.45 : 0);         // secondaries → long primaries
      const ang = t < 0.55 ? 0.28 - 0.3 * t : -0.12 - 1.0 * (t - 0.55) / 0.45;      // trail toward the body, then fan out
      return <mesh key={i} geometry={featherGeo()} material={t > 0.62 ? (i % 2 ? mats.tip : mats.main2) : i % 2 ? mats.main : mats.main2} position={[x, y, -0.05 - 0.01 * i]} rotation={[0.1, 0, ang]} scale={[1.25 + 0.3 * t, len, 1]} />;
    })}
    {Array.from({length: NC}, (_, i) => {
      const t = i / (NC - 1) * 0.9, [x, y] = edge(t, L);
      return <mesh key={`c${i}`} geometry={featherGeo()} material={mats.cov} position={[x, y + 0.05, 0.08]} rotation={[0.05, 0, 0.25 - 0.5 * t]} scale={[1.0, 1.3 + 0.6 * t, 1]} />;
    })}
  </group>;
};
/** a pair of wings; mount it on Max's back (children of <Max/>) at about [0, -1.6, -0.8] */
export const Wings = ({pose, position = [0, -1.6, -0.8]}: {pose: WingPose; position?: [number, number, number]}) => {
  const mats = useMemo(() => ({
    main: new THREE.MeshPhysicalMaterial({color: '#fbf6ec', roughness: 0.62, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide, bumpMap: noiseTex('feather', 256, 40, [1, 6]), bumpScale: 1.2}),
    main2: new THREE.MeshPhysicalMaterial({color: '#ece3d4', roughness: 0.64, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide, bumpMap: noiseTex('feather', 256, 40, [1, 6]), bumpScale: 1.2}),
    tip: new THREE.MeshPhysicalMaterial({color: '#cfc6b8', roughness: 0.6, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide, bumpMap: noiseTex('feather', 256, 40, [1, 6]), bumpScale: 1.2}),
    cov: new THREE.MeshPhysicalMaterial({color: '#f1e8da', roughness: 0.66, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide}),
    bone: new THREE.MeshPhysicalMaterial({color: '#efe5d4', roughness: 0.6, sheen: 0.8, sheenColor: new THREE.Color('#ffffff')}),
  }), []);
  const fr = pose.frost ?? 0;
  (mats.main as THREE.MeshPhysicalMaterial).color.set('#fbf6ec').lerp(new THREE.Color('#d6ecff'), 0.6 * fr);
  (mats.main2 as THREE.MeshPhysicalMaterial).color.set('#ece3d4').lerp(new THREE.Color('#cfe6ff'), 0.6 * fr);
  return <group position={position}><Wing s={1} pose={pose} mats={mats} /><Wing s={-1} pose={pose} mats={mats} /></group>;
};

// ---- clouds --------------------------------------------------------------------------------------------------------------
export const Cloud = ({seed, position, scale = 1, opacity = 1}: {seed: string; position: [number, number, number]; scale?: number; opacity?: number}) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 1, emissive: new THREE.Color('#dfefff'), emissiveIntensity: 0.25, transparent: opacity < 1, opacity}), [opacity]);
  return <group position={position} scale={scale}>{Array.from({length: 11}, (_, i) => <mesh key={i} material={mat}
    position={[(random(`${seed}x${i}`) - 0.5) * 9, (random(`${seed}y${i}`) - 0.3) * 2.2, (random(`${seed}z${i}`) - 0.5) * 4]} scale={1.2 + random(`${seed}s${i}`) * 1.8}>
    <sphereGeometry args={[1, 24, 16]} /></mesh>)}</group>;
};
export const CloudField = ({seed, n, area, y, yJit = 3, scale = [2, 4], drift = [0, 0, 0]}: {seed: string; n: number; area: [number, number]; y: number; yJit?: number; scale?: [number, number]; drift?: [number, number, number]}) => (
  <>{Array.from({length: n}, (_, i) => <Cloud key={i} seed={`${seed}${i}`} scale={scale[0] + random(`${seed}cs${i}`) * (scale[1] - scale[0])}
    position={[(random(`${seed}cx${i}`) - 0.5) * area[0] + drift[0], y + (random(`${seed}cy${i}`) - 0.5) * yJit + drift[1], (random(`${seed}cz${i}`) - 0.5) * area[1] + drift[2]]} />)}</>
);

// ---- rooftop + skyline ---------------------------------------------------------------------------------------------------------
const windowsTex = (() => { let t: THREE.CanvasTexture | null = null; return () => {
  if (t) return t;
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d')!;
  x.fillStyle = '#5d7393'; x.fillRect(0, 0, 128, 256);
  for (let j = 0; j < 16; j++) for (let i = 0; i < 8; i++) { x.fillStyle = random(`w${i}${j}`) > 0.7 ? '#ffe6a8' : '#2c3c58'; x.fillRect(i * 16 + 3, j * 16 + 3, 10, 10); }
  t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}; })();
export const Rooftop = ({y = -4.55}: {y?: number}) => {
  const m = useMemo(() => ({
    roof: new THREE.MeshPhysicalMaterial({color: '#8c8f96', roughness: 0.9, bumpMap: noiseTex('roof', 256, 30, [8, 8]), bumpScale: 2}),
    edge: new THREE.MeshPhysicalMaterial({color: '#c9c3b8', roughness: 0.7}), unit: new THREE.MeshPhysicalMaterial({color: '#d9dde3', roughness: 0.4, metalness: 0.5}),
    bld: new THREE.MeshStandardMaterial({map: windowsTex(), roughness: 0.6}),
  }), []);
  return <group>
    <mesh material={m.roof} position={[0, y - 1, -6]}><boxGeometry args={[30, 2, 24]} /></mesh>
    <mesh material={m.edge} position={[0, y + 0.45, 5.6]}><boxGeometry args={[30, 0.9, 0.5]} /></mesh>
    <mesh material={m.unit} position={[-7, y + 1.2, -6]}><boxGeometry args={[4, 2.4, 3]} /></mesh>
    <mesh material={m.unit} position={[8, y + 2.5, -10]}><cylinderGeometry args={[1.8, 1.8, 5, 24]} /></mesh>
    {Array.from({length: 44}, (_, i) => { const h = 10 + random(`bh${i}`) * 34, x = (random(`bx${i}`) - 0.5) * 260, z = -50 - random(`bz${i}`) * 160, w = 8 + random(`bw${i}`) * 10;
      return <mesh key={i} material={m.bld} position={[x, y - 42 + h / 2, z]}><boxGeometry args={[w, h, w]} /></mesh>; })}
  </group>;
};

// ---- car (≈4.5 m long at 0.31 m/unit → 14.5 units) -------------------------------------------------------------------------
export const Car = ({position = [0, 0, 0], rotation = [0, 0, 0]}: {position?: [number, number, number]; rotation?: [number, number, number]}) => {
  const m = useMemo(() => ({body: new THREE.MeshPhysicalMaterial({color: '#e23b3b', roughness: 0.25, metalness: 0.4, clearcoat: 1}),
    glass: new THREE.MeshPhysicalMaterial({color: '#1c2a3a', roughness: 0.05, metalness: 0.2, clearcoat: 1}),
    tire: new THREE.MeshStandardMaterial({color: '#151515', roughness: 0.9}), rim: new THREE.MeshPhysicalMaterial({color: '#cfd3d9', metalness: 1, roughness: 0.25})}), []);
  return <group position={position} rotation={rotation}>
    <mesh material={m.body} position={[0, 1.6, 0]} scale={[7.25, 1.1, 2.9]}><sphereGeometry args={[1, 48, 24]} /></mesh>
    <mesh material={m.body} position={[0, 1.4, 0]}><boxGeometry args={[13.4, 1.4, 5.6]} /></mesh>
    <mesh material={m.glass} position={[-0.6, 2.9, 0]} scale={[3.6, 1.2, 2.5]}><sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    {[[-4.6, 2.9], [4.6, 2.9], [-4.6, -2.9], [4.6, -2.9]].map(([x, z], i) => <group key={i} position={[x, 1.05, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={m.tire}><cylinderGeometry args={[1.05, 1.05, 0.9, 32]} /></mesh>
      <mesh material={m.rim} position={[0, z > 0 ? 0.46 : -0.46, 0]}><cylinderGeometry args={[0.55, 0.55, 0.05, 24]} /></mesh></group>)}
  </group>;
};
/** 3D measuring line with end ticks */
export const Measure = ({a, b, color = '#ffd84a'}: {a: THREE.Vector3; b: THREE.Vector3; color?: string}) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color, toneMapped: false}), [color]);
  const mid = a.clone().add(b).multiplyScalar(0.5), len = a.distanceTo(b), ang = Math.atan2(b.y - a.y, b.x - a.x);
  return <group>
    <mesh material={mat} position={mid} rotation={[0, 0, ang]}><boxGeometry args={[len, 0.12, 0.12]} /></mesh>
    {[a, b].map((p, i) => <mesh key={i} material={mat} position={p} rotation={[0, 0, ang]}><boxGeometry args={[0.12, 1.2, 0.12]} /></mesh>)}
  </group>;
};

// ---- airliner ------------------------------------------------------------------------------------------------------------------
export const Airliner = ({position, rotation = [0, 0, 0], scale = 1}: {position: [number, number, number]; rotation?: [number, number, number]; scale?: number}) => {
  const m = useMemo(() => ({w: new THREE.MeshPhysicalMaterial({color: '#f3f5f8', roughness: 0.3, metalness: 0.2, clearcoat: 0.8}),
    blue: new THREE.MeshPhysicalMaterial({color: '#2a5bd7', roughness: 0.3, clearcoat: 0.8}), dark: new THREE.MeshPhysicalMaterial({color: '#20262e', roughness: 0.2}),
    eng: new THREE.MeshPhysicalMaterial({color: '#c9ced6', roughness: 0.3, metalness: 0.7})}), []);
  const wing = (s: 1 | -1) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(-7, 20 * s); sh.lineTo(-10, 20 * s); sh.lineTo(-9, 0); sh.lineTo(0, 0);
    const g = new THREE.ExtrudeGeometry(sh, {depth: 0.5, bevelEnabled: false}); return g; };
  return <group position={position} rotation={rotation} scale={scale}>
    <mesh material={m.w} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[2.4, 34, 12, 32]} /></mesh>
    <mesh material={m.blue} position={[0, -0.9, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.01]}><cylinderGeometry args={[2.42, 2.42, 30, 32, 1, true, Math.PI * 0.6, Math.PI * 0.8]} /></mesh>
    <mesh material={m.dark} position={[17.2, 0.8, 0]} scale={[1.4, 0.6, 2]}><sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    {[1, -1].map((s) => <group key={s}>
      <mesh material={m.w} geometry={wing(s as 1 | -1)} position={[4, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh material={m.eng} position={[1, -2.4, 7 * s]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[1.3, 1.1, 5, 24]} /></mesh>
    </group>)}
    <mesh material={m.blue} position={[-16, 4, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[6, 7, 0.5]} /></mesh>
    <mesh material={m.w} position={[-16.5, 0.6, 0]}><boxGeometry args={[4, 0.4, 14]} /></mesh>
  </group>;
};

// ---- flocks / swarms --------------------------------------------------------------------------------------------------------
export const Birds = ({o, n, center, spread, seed = 'bird', color = '#2b2b2b', size = 1}: {o: number; n: number; center: [number, number, number]; spread: [number, number, number]; seed?: string; color?: string; size?: number}) => {
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, -1, 0.35, -0.3, -0.2, 0, 0.25, 0, 0, 0, 1, 0.35, -0.3, 0.2, 0, 0.25], 3)); g.computeVertexNormals(); return g; }, []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide}), [color]);
  return <>{Array.from({length: n}, (_, i) => { const fl = Math.sin(o / 70 + i * 1.7);
    return <mesh key={i} geometry={geo} material={mat} position={[center[0] + (random(`${seed}x${i}`) - 0.5) * spread[0] + o * 0.002, center[1] + (random(`${seed}y${i}`) - 0.5) * spread[1] + 0.3 * fl, center[2] + (random(`${seed}z${i}`) - 0.5) * spread[2]]}
      scale={[size, size * (0.4 + 0.8 * fl), size]} rotation={[0, Math.PI / 2, 0]} />; })}</>;
};
/** a crowd of tiny winged people (instanced), flapping */
export const Swarm = ({o, n, center, spread, seed = 'sw'}: {o: number; n: number; center: [number, number, number]; spread: [number, number, number]; seed?: string}) => {
  const {body, head, wing, tmp} = useMemo(() => {
    const body = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.35, 1.2, 4, 8), new THREE.MeshStandardMaterial({color: '#ff7a2f', roughness: 0.8}), n);
    const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.38, 12, 8), new THREE.MeshStandardMaterial({color: '#eab48f', roughness: 0.6}), n);
    const wg = new THREE.PlaneGeometry(1, 1); wg.translate(0.5, 0, 0);
    const wing = new THREE.InstancedMesh(wg, new THREE.MeshStandardMaterial({color: '#fbf6ec', side: THREE.DoubleSide, roughness: 0.7}), n * 2);
    return {body, head, wing, tmp: new THREE.Object3D()};
  }, [n]);
  for (let i = 0; i < n; i++) {
    const x = center[0] + (random(`${seed}x${i}`) - 0.5) * spread[0] + Math.sin(o / 900 + i) * 1.5, y = center[1] + (random(`${seed}y${i}`) - 0.5) * spread[1] + Math.sin(o / 300 + i) * 0.4,
      z = center[2] + (random(`${seed}z${i}`) - 0.5) * spread[2];
    const yaw = random(`${seed}r${i}`) * Math.PI * 2, fl = Math.sin(o / 90 + i * 2.3);
    tmp.position.set(x, y, z); tmp.rotation.set(Math.PI / 2 - 0.3, yaw, 0); tmp.scale.setScalar(1); tmp.updateMatrix(); body.setMatrixAt(i, tmp.matrix);
    tmp.position.set(x + Math.sin(yaw) * 1.0, y + 0.3, z + Math.cos(yaw) * 1.0); tmp.updateMatrix(); head.setMatrixAt(i, tmp.matrix);
    for (const s of [1, -1]) { tmp.position.set(x, y + 0.2, z); tmp.rotation.set(0, yaw + (s > 0 ? 0 : Math.PI), 0.6 * fl * s); tmp.scale.set(2.6, 1.3, 1); tmp.updateMatrix(); wing.setMatrixAt(i * 2 + (s > 0 ? 0 : 1), tmp.matrix); }
  }
  body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = wing.instanceMatrix.needsUpdate = true;
  return <><primitive object={body} /><primitive object={head} /><primitive object={wing} /></>;
};

// ---- landscape -----------------------------------------------------------------------------------------------------------------
export const Hills = ({y = -60}: {y?: number}) => {
  const {g, mat} = useMemo(() => {
    const g = new THREE.PlaneGeometry(1200, 1200, 160, 160); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute, cols: number[] = [];
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i);
      const h = 14 * Math.sin(x / 60) * Math.cos(z / 75) + 6 * Math.sin(x / 23 + z / 31) + 30 * Math.max(0, Math.sin(z / 140 + 1)) ** 3; p.setY(i, h);
      const c = new THREE.Color(h > 22 ? '#8d9aa6' : h < -8 ? '#4f86b8' : '#6aa75a').lerp(new THREE.Color('#a9c46a'), 0.2 * Math.sin(x / 17) ** 2); cols.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
    return {g, mat: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.95, flatShading: false})};
  }, []);
  return <mesh geometry={g} material={mat} position={[0, y, 0]} />;
};
