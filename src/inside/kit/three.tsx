// "Inside the Impossible" 3D kit — reusable pieces for body/biology shorts (three.js via @remotion/three).
// Everything is procedural (no third-party models), so every asset is ours and licence-clean.
//  - noiseTex / tissueMat: wet organic tissue (physical material + clearcoat + sheen + procedural bump)
//  - Tunnel: a tube along a curve whose radius is recomputed every frame (peristalsis waves, haustra pouches, villi)
//  - Cam: per-frame camera; glide/creep helpers; Post: DOF + bloom + vignette + ACES (pmndrs postprocessing)
import {useThree} from '@react-three/fiber';
import {Bloom, DepthOfField, EffectComposer, ToneMapping, Vignette} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';

export type V3 = [number, number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smoother = (t: number) => { const x = clamp01(t); return x * x * x * (x * (x * 6 - 15) + 10); };
export const prog = (o: number, a: number, b: number) => clamp01((o - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// ---- textures -------------------------------------------------------------------------------------------------------------
const texCache = new Map<string, THREE.Texture>();
/** tileable value-noise canvas (grey), used as bump / roughness detail */
export const noiseTex = (seed: string, size = 512, cells = 24, repeat: [number, number] = [6, 2]) => {
  const key = `${seed}:${size}:${cells}:${repeat}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d')!;
  const img = x.createImageData(size, size);
  // lattice values once per octave (fast), then smooth interpolation per pixel; wraps, so the texture tiles
  const lat = [0, 1, 2].map((oct) => { const cc = cells * (1 << oct); const L = new Float32Array(cc * cc); for (let q = 0; q < cc * cc; q++) L[q] = random(`${seed}${oct}:${q}`); return {cc, L}; });
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let v = 0, amp = 1, tot = 0;
    for (const {cc, L} of lat) {
      const fx = (px * cc) / size, fy = (py * cc) / size, i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j;
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const h = (a: number, b: number) => L[(((b % cc) + cc) % cc) * cc + (((a % cc) + cc) % cc)];
      v += amp * lerp(lerp(h(i, j), h(i + 1, j), sx), lerp(h(i, j + 1), h(i + 1, j + 1), sx), sy); tot += amp; amp *= 0.5;
    }
    const k = (py * size + px) * 4, val = Math.round((v / tot) * 255);
    img.data[k] = img.data[k + 1] = img.data[k + 2] = val; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8;
  texCache.set(key, t);
  return t;
};
/** vertical gradient for studio backgrounds */
export const gradientTex = (top: string, bottom: string) => {
  const key = `grad:${top}:${bottom}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement('canvas'); c.width = 8; c.height = 512;
  const x = c.getContext('2d')!; const gr = x.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, top); gr.addColorStop(1, bottom);
  x.fillStyle = gr; x.fillRect(0, 0, 8, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t);
  return t;
};

// ---- materials --------------------------------------------------------------------------------------------------------------
export const tissueMat = (color: string, opts: {sheen?: string; bump?: number; repeat?: [number, number]; rough?: number; emissive?: string; side?: THREE.Side} = {}) =>
  new THREE.MeshPhysicalMaterial({
    color, roughness: opts.rough ?? 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18,
    sheen: 0.7, sheenColor: new THREE.Color(opts.sheen ?? '#ff9a8a'), sheenRoughness: 0.5,
    bumpMap: noiseTex('tissue', 512, 20, opts.repeat ?? [10, 3]), bumpScale: opts.bump ?? 2.2,
    emissive: new THREE.Color(opts.emissive ?? '#2a0508'), emissiveIntensity: 0.6, side: opts.side ?? THREE.BackSide,
  });
/** x-ray body shell: fresnel rim glow, see-through centre */
export const xrayMat = (color = '#7fd8ff') => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  uniforms: {c: {value: new THREE.Color(color)}, k: {value: 1.0}},
  vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `uniform vec3 c; uniform float k; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0-abs(dot(vN,vV)), 2.2); gl_FragColor = vec4(c*(0.06+1.6*f)*k, 1.0); }`,
});

// ---- scene background / fog, set imperatively every frame (declarative attach races on shot swaps → black sky) ----
export const Env = ({bg, fog}: {bg: THREE.Texture | THREE.Color | string; fog?: [string, number, number] | null}) => {
  const {scene} = useThree();
  scene.background = typeof bg === 'string' ? new THREE.Color(bg) : bg;
  if (fog) { if (scene.fog instanceof THREE.Fog) { scene.fog.color.set(fog[0]); scene.fog.near = fog[1]; scene.fog.far = fog[2]; } else scene.fog = new THREE.Fog(fog[0], fog[1], fog[2]); }
  else scene.fog = null;
  return null;
};

// ---- camera ---------------------------------------------------------------------------------------------------------------
export const Cam = ({p, l, fov = 35, roll = 0}: {p: V3; l: V3; fov?: number; roll?: number}) => {
  const {camera} = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...p); c.fov = fov; c.near = 0.01; c.far = 200; c.up.set(Math.sin(roll), Math.cos(roll), 0); c.lookAt(...l); c.updateProjectionMatrix();
  return null;
};

// ---- tunnel (esophagus / intestines) --------------------------------------------------------------------------------------
export type TunnelSpec = {pts: V3[]; segs?: number; radial?: number; radius: (u: number, a: number) => number};
export const useTunnel = (spec: TunnelSpec) => useMemo(() => {
  const curve = new THREE.CatmullRomCurve3(spec.pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.4);
  const segs = spec.segs ?? 420, radial = spec.radial ?? 56;
  const geo = new THREE.TubeGeometry(curve, segs, 1, radial, false);
  const frames = curve.computeFrenetFrames(segs, false);
  const n = (segs + 1) * (radial + 1);
  const base = new Float32Array(n * 3), dir = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  const P = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    curve.getPointAt(i / segs, P);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2, k = i * (radial + 1) + j;
      const N = frames.normals[i], B = frames.binormals[i];
      const dx = -Math.cos(a) * N.x + Math.sin(a) * B.x, dy = -Math.cos(a) * N.y + Math.sin(a) * B.y, dz = -Math.cos(a) * N.z + Math.sin(a) * B.z;
      base.set([P.x, P.y, P.z], k * 3); dir.set([dx, dy, dz], k * 3); uv.set([i / segs, a], k * 2);
    }
  }
  return {curve, geo, base, dir, uv, n};
}, [spec]);
/** recompute the tube surface for this frame: r(u, angle) from the spec, times an optional squeeze(u) (peristalsis) */
export const shapeTunnel = (t: ReturnType<typeof useTunnel>, radius: (u: number, a: number) => number, squeeze: (u: number) => number = () => 1) => {
  const pos = t.geo.attributes.position as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  for (let k = 0; k < t.n; k++) {
    const u = t.uv[k * 2], a = t.uv[k * 2 + 1], r = radius(u, a) * squeeze(u);
    arr[k * 3] = t.base[k * 3] + t.dir[k * 3] * r; arr[k * 3 + 1] = t.base[k * 3 + 1] + t.dir[k * 3 + 1] * r; arr[k * 3 + 2] = t.base[k * 3 + 2] + t.dir[k * 3 + 2] * r;
  }
  pos.needsUpdate = true; t.geo.computeVertexNormals();
};
/** a travelling ring contraction centred at u0 (width w), depth d */
export const ring = (u: number, u0: number, w: number, d: number) => 1 - d * Math.exp(-(((u - u0) / w) ** 2));

// ---- post ------------------------------------------------------------------------------------------------------------------
export const Post = ({focus, bokeh = 3, bloom = 0.55}: {focus?: V3; bokeh?: number; bloom?: number}) => (
  <EffectComposer multisampling={4}>
    <DepthOfField target={focus ?? [0, 0, 0]} focalLength={0.02} bokehScale={bokeh} height={960} />
    <Bloom intensity={bloom} luminanceThreshold={0.82} luminanceSmoothing={0.2} mipmapBlur radius={0.7} />
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    <Vignette offset={0.32} darkness={0.55} />
  </EffectComposer>
);
