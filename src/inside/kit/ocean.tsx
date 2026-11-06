// Ocean / space kit for #004 (all procedural): cliff + drained seabed + stranded ship, rising water, spit drops and
// streams, a teaspoon, a 1 L bottle, an instanced crowd of tiny spitters, Earth (wet / drained), the all-ocean water ball,
// stars and a spiral galaxy.
import {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {lerp, noiseTex, type V3} from './three';

const matCache = new Map<string, THREE.Material>();
const mat = <T extends THREE.Material>(key: string, make: () => T): T => { if (!matCache.has(key)) matCache.set(key, make()); return matCache.get(key) as T; };
export const spitMat = () => mat('spit', () => new THREE.MeshPhysicalMaterial({color: '#eef7ff', roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02,
  transparent: true, opacity: 0.72, emissive: new THREE.Color('#9ec9ff'), emissiveIntensity: 0.12, envMapIntensity: 1.2}));
const bubbleMat = () => mat('bub', () => new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.85}));
const rockMat = () => mat('rock', () => new THREE.MeshStandardMaterial({color: '#7b6a58', roughness: 0.92, bumpMap: noiseTex('rock', 512, 18, [8, 8]), bumpScale: 3}));
/** layered sediment bands for the cliff face (horizontal strata + grain) */
const strataMat = () => mat('strata', () => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const x = c.getContext('2d')!;
  const cols = ['#8a6f55', '#a58866', '#6e5845', '#b89a74', '#7d644e', '#9b7d5c', '#5f4c3c', '#c2a37b'];
  let y = 0, i = 0; while (y < 1024) { const h = 18 + random(`sb${i}`) * 70; x.fillStyle = cols[i % cols.length]; x.fillRect(0, y, 256, h); y += h; i++; }
  for (let k = 0; k < 4000; k++) { x.fillStyle = `rgba(0,0,0,${0.05 + 0.1 * random(`sg${k}`)})`; x.fillRect(random(`sx${k}`) * 256, random(`sy${k}`) * 1024, 2 + 6 * random(`sw${k}`), 1); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 1);
  return new THREE.MeshStandardMaterial({map: t, roughness: 0.95, bumpMap: noiseTex('rock', 512, 18, [40, 6]), bumpScale: 4});
});
const sandMat = () => mat('sand', () => new THREE.MeshStandardMaterial({color: '#a88a62', roughness: 0.9, bumpMap: noiseTex('sand', 512, 30, [60, 60]), bumpScale: 3}));
const puddleMat = () => mat('puddle', () => new THREE.MeshPhysicalMaterial({color: '#3d5a6b', roughness: 0.08, clearcoat: 1, metalness: 0.2}));
const grassMat = () => mat('grass', () => new THREE.MeshStandardMaterial({color: '#6f9a4a', roughness: 0.9, bumpMap: noiseTex('grass', 512, 40, [20, 20]), bumpScale: 2}));

// ---- spit ------------------------------------------------------------------------------------------------------------------------
/** one glossy spit blob with a few bubbles; stretch > 1 elongates it along its motion (local +y) */
export const Drop = ({position, r = 0.12, stretch = 1, rot = [0, 0, 0]}: {position: V3; r?: number; stretch?: number; rot?: V3}) => <group position={position} rotation={rot}>
  <mesh material={spitMat()} scale={[r, r * stretch, r]}><sphereGeometry args={[1, 24, 18]} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} material={bubbleMat()} position={[r * (0.35 - 0.3 * i), r * stretch * (0.2 * i - 0.15), r * 0.6]} scale={r * (0.16 - 0.03 * i)}><sphereGeometry args={[1, 10, 8]} /></mesh>)}
</group>;
/** ballistic spit: launched from p0 with velocity v at t0 (s), gravity g; renders the blob plus a thin trailing string */
export const Spit = ({p0, v, t, g = -18, r = 0.13, floorY = -1e9}: {p0: V3; v: V3; t: number; g?: number; r?: number; floorY?: number}) => {
  if (t < 0) return null;
  const at = (tt: number): V3 => [p0[0] + v[0] * tt, p0[1] + v[1] * tt + 0.5 * g * tt * tt, p0[2] + v[2] * tt];
  const p = at(t); if (p[1] < floorY) return null;
  const vy = v[1] + g * t, sp = Math.hypot(v[0], vy, v[2]);
  const dir = new THREE.Vector3(v[0], vy, v[2]).normalize(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir), e = new THREE.Euler().setFromQuaternion(q);
  const tail = Array.from({length: 5}, (_, i) => at(Math.max(0, t - 0.012 * (i + 1))));
  return <group>
    <Drop position={p} r={r} stretch={1 + Math.min(1.4, sp * 0.03)} rot={[e.x, e.y, e.z]} />
    {t < 0.25 && tail.map((q2, i) => <mesh key={i} material={spitMat()} position={q2} scale={r * (0.45 - 0.07 * i)}><sphereGeometry args={[1, 10, 8]} /></mesh>)}
  </group>;
};
/** many falling drops as one InstancedMesh (spit rain) */
export const SpitRain = ({t, n, area, top, bottom, speed = 30, r = 0.25, seed = 'rain'}: {t: number; n: number; area: [V3, V3]; top: number; bottom: number; speed?: number; r?: number; seed?: string}) => {
  const im = useMemo(() => new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), spitMat(), n), [n]);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const [a, b] = area, ph = random(`${seed}${i}`), h = top - bottom;
    const y = top - ((t * speed * (0.8 + 0.4 * random(`${seed}s${i}`)) + ph * h) % h);
    s.set(r, r * 2.2, r); m4.compose(new THREE.Vector3(lerp(a[0], b[0], random(`${seed}x${i}`)), y, lerp(a[2], b[2], random(`${seed}z${i}`))), q, s); im.setMatrixAt(i, m4);
  }
  im.instanceMatrix.needsUpdate = true; im.frustumCulled = false;
  return <primitive object={im} />;
};

// ---- coast -------------------------------------------------------------------------------------------------------------------------
/** cliff top (grass) at y=top, behind z=edge; rocky face down to the seabed at y=floor; drained seabed beyond */
export const Coast = ({top = -4.5, edge = 1.2, floor = -120, width = 900, water = null}: {top?: number; edge?: number; floor?: number; width?: number; water?: number | null}) => {
  const face = useMemo(() => {
    const h = top - floor, g = new THREE.PlaneGeometry(width, h, 300, 60), p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), k = (y + h / 2) / h; // 0 bottom .. 1 top
      const n = Math.sin(x * 0.21) * 1.6 + Math.sin(x * 0.053 + 1.3) * 4 + (random(`cf${Math.round(x * 2)}:${Math.round(y)}`) - 0.5) * 1.4;
      p.setZ(i, n * (0.35 + 0.65 * (1 - k)) + (1 - k) * (1 - k) * 18); // rough, flaring out toward the bottom
    }
    g.computeVertexNormals(); return g;
  }, [top, floor, width]);
  const rocks = useMemo(() => Array.from({length: 60}, (_, i) => ({p: [(random(`rx${i}`) - 0.5) * 400, floor + 0.5, edge + 25 + random(`rz${i}`) * 400] as V3, s: 1 + random(`rs${i}`) * 5, r: random(`rr${i}`) * 6})), [floor, edge]);
  return <group>
    <mesh material={grassMat()} rotation={[-Math.PI / 2, 0, 0]} position={[0, top, edge - 200]} receiveShadow><planeGeometry args={[width, 400]} /></mesh>
    <mesh geometry={face} material={strataMat()} position={[0, (top + floor) / 2, edge]} />
    <mesh material={sandMat()} rotation={[-Math.PI / 2, 0, 0]} position={[0, floor, edge + 2000]}><planeGeometry args={[4000, 4000, 1, 1]} /></mesh>
    {rocks.map((r, i) => <mesh key={i} material={rockMat()} position={r.p} rotation={[r.r, r.r * 2, 0]} scale={[r.s, r.s * 0.6, r.s]}><dodecahedronGeometry args={[1, 0]} /></mesh>)}
    <group position={[-28, floor + 4, edge + 220]} rotation={[0.05, -0.5, 0.2]} scale={2}><Ship position={[0, 0, 0]} rotation={[0, 0, 0]} /></group>
    <group position={[34, floor + 0.3, edge + 300]} scale={2.2}><Plug position={[0, 0, 0]} /></group>
    {Array.from({length: 16}, (_, i) => <mesh key={`pd${i}`} material={puddleMat()} rotation={[-Math.PI / 2, 0, random(`pa${i}`) * 3]} position={[(random(`px${i}`) - 0.5) * 300, floor + 0.15, edge + 40 + random(`pz${i}`) * 420]} scale={[6 + 18 * random(`pw${i}`), 3 + 8 * random(`ph${i}`), 1]}><circleGeometry args={[1, 24]} /></mesh>)}
    {water !== null && <Water y={water} />}
  </group>;
};
/** giant bathtub drain plug + chain lying on the drained seabed (the joke: someone pulled it) */
export const Plug = ({position}: {position: V3}) => {
  const metal = mat('plugM', () => new THREE.MeshPhysicalMaterial({color: '#9aa3ad', roughness: 0.25, metalness: 1, clearcoat: 0.6}));
  const rubber = mat('plugR', () => new THREE.MeshStandardMaterial({color: '#1d1f24', roughness: 0.6}));
  return <group position={position}>
    <mesh material={rubber} position={[0, 1.2, 0]}><cylinderGeometry args={[11, 12, 2.4, 48]} /></mesh>
    <mesh material={metal} position={[0, 2.6, 0]}><cylinderGeometry args={[9, 10.5, 0.6, 48]} /></mesh>
    <mesh material={metal} position={[0, 4.2, 0]}><torusGeometry args={[2.2, 0.45, 12, 32]} /></mesh>
    {Array.from({length: 14}, (_, i) => <mesh key={i} material={metal} position={[3 + i * 2.6, 0.6 + 2.6 * Math.exp(-i / 2), -i * 1.1]} rotation={[Math.PI / 2 * (i % 2), 0.4, 0]}><torusGeometry args={[1.1, 0.3, 8, 20]} /></mesh>)}
  </group>;
};
export const Ship = ({position, rotation}: {position: V3; rotation: V3}) => {
  const hull = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-30, 6); s.quadraticCurveTo(-26, -6, 0, -7); s.quadraticCurveTo(26, -6, 34, 6); s.lineTo(-30, 6);
    return new THREE.ExtrudeGeometry(s, {depth: 12, bevelEnabled: false}).translate(0, 0, -6); }, []);
  const red = mat('hullRed', () => new THREE.MeshStandardMaterial({color: '#8c2a22', roughness: 0.7})), white = mat('shipW', () => new THREE.MeshStandardMaterial({color: '#e8e4dc', roughness: 0.6}));
  return <group position={position} rotation={rotation}>
    <mesh geometry={hull} material={red} />
    <mesh material={white} position={[-12, 10, 0]}><boxGeometry args={[14, 8, 10]} /></mesh>
    <mesh material={white} position={[-12, 16, 0]}><boxGeometry args={[9, 4, 8]} /></mesh>
    <mesh material={red} position={[-6, 19, 0]}><cylinderGeometry args={[1.6, 1.8, 7, 16]} /></mesh>
  </group>;
};
export const Water = ({y, color = '#2f86c4'}: {y: number; color?: string}) => {
  const m = mat(`water${color}`, () => new THREE.MeshPhysicalMaterial({color, roughness: 0.18, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1,
    bumpMap: noiseTex('water', 512, 26, [240, 240]), bumpScale: 0.6}));
  return <mesh material={m} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 2000]}><planeGeometry args={[4000, 4000]} /></mesh>;
};

// ---- small props --------------------------------------------------------------------------------------------------------------------
export const Teaspoon = ({fill = 0}: {fill?: number}) => {
  const steel = mat('steel', () => new THREE.MeshPhysicalMaterial({color: '#d9dee6', roughness: 0.22, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.05}));
  const bowl = useMemo(() => new THREE.SphereGeometry(0.42, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2.4).scale(1, 0.45, 1.45), []);
  return <group>
    <mesh geometry={bowl} material={steel} />
    <mesh material={steel} position={[0, 0.05, -1.55]} rotation={[Math.PI / 2 - 0.08, 0, 0]} scale={[1, 1, 0.35]}><cylinderGeometry args={[0.08, 0.15, 2.3, 16]} /></mesh>
    {fill > 0.01 && <mesh material={spitMat()} position={[0, -0.16 + 0.12 * fill, 0]} scale={[0.36 * (0.6 + 0.4 * fill), 0.06 + 0.05 * fill, 0.52 * (0.6 + 0.4 * fill)]}><sphereGeometry args={[1, 32, 16]} /></mesh>}
  </group>;
};
export const Bottle = ({fill = 0, label}: {fill?: number; label?: THREE.Texture}) => {
  const glass = mat('glass', () => new THREE.MeshPhysicalMaterial({color: '#e8f6ff', roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.45, emissive: new THREE.Color('#5a8fb8'), emissiveIntensity: 0.35, side: THREE.DoubleSide}));
  return <group>
    <mesh material={glass} position={[0, 1.4, 0]}><cylinderGeometry args={[0.7, 0.7, 2.8, 40, 1, true]} /></mesh>
    <mesh material={glass} position={[0, 3.05, 0]}><cylinderGeometry args={[0.28, 0.7, 0.5, 40, 1, true]} /></mesh>
    <mesh material={glass} position={[0, 3.5, 0]}><cylinderGeometry args={[0.28, 0.28, 0.4, 24, 1, true]} /></mesh>
    {fill > 0.01 && <mesh material={spitMat()} position={[0, 1.4 * fill, 0]}><cylinderGeometry args={[0.66, 0.66, 2.8 * fill, 40]} /></mesh>}
    {label && <mesh position={[0, 1.2, 0.71]}><planeGeometry args={[1.2, 0.6]} /><meshStandardMaterial map={label} transparent /></mesh>}
  </group>;
};
/** instanced crowd of tiny spitters (orange hoodie body + skin head) along a curve; returns mouth points for spit */
export const Crowd = ({pts, scale = 1}: {pts: V3[]; scale?: number}) => {
  const {body, head} = useMemo(() => {
    const b = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.55, 1.2, 4, 10), mat('crowdB', () => new THREE.MeshStandardMaterial({color: '#ff7a2f', roughness: 0.8})), pts.length);
    const h = new THREE.InstancedMesh(new THREE.SphereGeometry(0.62, 14, 10), mat('crowdH', () => new THREE.MeshStandardMaterial({color: '#eab48f', roughness: 0.6})), pts.length);
    b.frustumCulled = h.frustumCulled = false; return {body: b, head: h};
  }, [pts.length]);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(scale, scale, scale);
  pts.forEach((p, i) => {
    m4.compose(new THREE.Vector3(p[0], p[1] + 1.15 * scale, p[2]), q, s); body.setMatrixAt(i, m4);
    m4.compose(new THREE.Vector3(p[0], p[1] + 2.75 * scale, p[2]), q, s); head.setMatrixAt(i, m4);
  });
  body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = true;
  return <><primitive object={body} /><primitive object={head} /></>;
};

// ---- space ----------------------------------------------------------------------------------------------------------------------------
const earthTex = (dry: boolean) => {
  const key = `earth:${dry}`;
  return mat(key, () => {
    const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!, img = x.createImageData(W, H);
    const cells = 7, L = [0, 1, 2, 3].map((o) => { const cc = cells << o; return {cc, v: Float32Array.from({length: cc * cc * 2}, (_, q) => random(`earth${o}:${q}`))}; });
    for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
      let v = 0, a = 1, tot = 0;
      for (const {cc, v: V} of L) { const fx = (px / W) * cc * 2, fy = (py / H) * cc, i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const h = (aa: number, bb: number) => V[(Math.min(cc - 1, bb)) * cc * 2 + ((aa % (cc * 2)) + cc * 2) % (cc * 2)];
        v += a * lerp(lerp(h(i, j), h(i + 1, j), sx), lerp(h(i, j + 1), h(i + 1, j + 1), sx), sy); tot += a; a *= 0.5; }
      v /= tot; const lat = Math.abs(py / H - 0.5) * 2, k = (py * W + px) * 4;
      let col: number[];
      if (lat > 0.86) col = [240, 244, 250];
      else if (v > 0.56) col = v > 0.66 ? [150, 130, 95] : lat > 0.6 ? [110, 130, 90] : [70, 120, 60];
      else col = dry ? [196 - (0.56 - v) * 160, 168 - (0.56 - v) * 170, 122 - (0.56 - v) * 120] : [16 + v * 30, 60 + v * 80, 120 + v * 120];
      img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return new THREE.MeshStandardMaterial({map: t, roughness: dry ? 0.95 : 0.55, metalness: 0});
  });
};
/** Earth; dry 0..1 crossfades the oceans to bare seabed */
export const Earth = ({rot = 0, dry = 0, r = 1}: {rot?: number; dry?: number; r?: number}) => {
  const wet = earthTex(false) as THREE.MeshStandardMaterial;
  wet.transparent = dry > 0; wet.opacity = 1 - dry; wet.depthWrite = dry < 0.5;
  return <group rotation={[0.35, rot, 0.1]} scale={r}>
    <mesh material={earthTex(true)}><sphereGeometry args={[1, 96, 64]} /></mesh>
    {dry < 0.999 && <mesh material={wet} scale={1.002}><sphereGeometry args={[1, 96, 64]} /></mesh>}
    <mesh scale={1.02} material={mat('atmo', () => new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0-abs(dot(vN,vV)), 5.0); gl_FragColor = vec4(vec3(0.35,0.65,1.0)*f*0.9, 1.0); }'}))}><sphereGeometry args={[1, 64, 48]} /></mesh>
  </group>;
};
export const WaterBall = ({r}: {r: number}) => <mesh scale={r} material={mat('ball', () => new THREE.MeshPhysicalMaterial({color: '#2a7fd0', roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05,
  bumpMap: noiseTex('water', 512, 26, [4, 2]), bumpScale: 0.4, emissive: new THREE.Color('#0a2a55'), emissiveIntensity: 0.5}))}><sphereGeometry args={[1, 64, 48]} /></mesh>;
export const Stars = ({n = 2500, R = 400, seed = 'st'}: {n?: number; R?: number; seed?: string}) => {
  const pts = useMemo(() => { const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const u = random(`${seed}u${i}`) * 2 - 1, a = random(`${seed}a${i}`) * Math.PI * 2, s = Math.sqrt(1 - u * u); p.set([R * s * Math.cos(a), R * u, R * s * Math.sin(a)], i * 3); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g; }, [n, R, seed]);
  return <points geometry={pts}><pointsMaterial color="#ffffff" size={1.6} sizeAttenuation={false} transparent opacity={0.9} /></points>;
};
const glowTex = () => (mat('glowM', () => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,220,170,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(c)}); }) as THREE.MeshBasicMaterial).map!;
export const Galaxy = ({n = 26000, R = 300, rot = 0, seed = 'gx'}: {n?: number; R?: number; rot?: number; seed?: string}) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), p = new Float32Array(n * 3), c = new Float32Array(n * 3), core = new THREE.Color('#ffd9a0'), arm = new THREE.Color('#8fb8ff');
    for (let i = 0; i < n; i++) {
      const d = Math.pow(random(`${seed}d${i}`), 0.7), armN = i % 2, ang = d * 9 + armN * Math.PI + (random(`${seed}j${i}`) - 0.5) * (0.9 - 0.5 * d);
      const spread = 0.06 * R * (1 - d * 0.4) * (random(`${seed}s${i}`) - 0.5) * 2;
      p.set([Math.cos(ang) * d * R + spread, (random(`${seed}y${i}`) - 0.5) * R * 0.04 * (1.4 - d), Math.sin(ang) * d * R + spread * 0.7], i * 3);
      const col = core.clone().lerp(arm, Math.min(1, d * 1.4)); c.set([col.r, col.g, col.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3)); geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); return geo;
  }, [n, R, seed]);
  return <group rotation={[0, rot, 0]}>
    <points geometry={g}><pointsMaterial vertexColors size={3.2} sizeAttenuation={false} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} /></points>
    <sprite scale={[R * 0.55, R * 0.55, 1]}><spriteMaterial map={glowTex()} color="#ffe2b0" transparent blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>
  </group>;
};
