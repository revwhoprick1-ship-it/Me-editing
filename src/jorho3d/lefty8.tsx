// Jorho v8 (user, 2026-11-01): "80-90% motion graphics/animation … something that visually shows what they are talking
// about and just the voice speaking (should sometimes show him) … download models from the internet". Keeps the Jorho
// frame/captions. Downloaded assets (all free):
//  - Poly Haven CC0: orlando_stadium + suburban_football_field panoramas (public/env), american_football + standing_chalkboard_01 (public/models)
//  - three.js example models (MIT): Xbot (run/idle/sad_pose/agree), Soldier (Run), RobotExpressive (Wave/Yes/No/Dance)
// Panoramas are ground-projected (GroundedSkybox) so the characters stand on the real field. Assets load on the DOM side.
import {ThreeCanvas} from '@remotion/three';
import {useThree, type ThreeElements} from '@react-three/fiber';
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GroundedSkybox} from 'three/examples/jsm/objects/GroundedSkybox.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import {Arrow3D, Confetti3D, GOLD, RED, TEAL, TEAL_D, Word3D, XMark3D, ez, sp} from './three';

type Assets = {xbot: GLTF; soldier: GLTF; robot: GLTF; ball: GLTF; board: GLTF; stadium: THREE.Texture; field: THREE.Texture; stadiumL: THREE.Texture; fieldL: THREE.Texture};
let cache: Assets | null = null;
export const useLeftyAssets = () => {
  const [a, setA] = useState<Assets | null>(cache);
  const [h] = useState(() => (cache ? null : delayRender('lefty8 assets', {timeoutInMilliseconds: 170000})));
  useEffect(() => {
    if (cache) return;
    const gl = new GLTFLoader(), tl = new THREE.TextureLoader();
    // 8k for the visible sky (no mipmaps: memory), 1k for lighting (PMREM)
    const tex = async (u: string, mips = false) => { const t = await tl.loadAsync(staticFile(u)); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
      if (!mips) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; } return t; };
    Promise.all([gl.loadAsync(staticFile('models/Xbot.glb')), gl.loadAsync(staticFile('models/Soldier.glb')), gl.loadAsync(staticFile('models/RobotExpressive.glb')),
      gl.loadAsync(staticFile('models/american_football/american_football.gltf')), gl.loadAsync(staticFile('models/standing_chalkboard_01/standing_chalkboard_01.gltf')),
      tex('env/orlando_stadium_8k.jpg'), tex('env/suburban_football_field_8k.jpg'), tex('env/orlando_stadium_1k.jpg', true), tex('env/suburban_football_field_1k.jpg', true)])
      .then(([xbot, soldier, robot, ball, board, stadium, field, stadiumL, fieldL]) => { cache = {xbot, soldier, robot, ball, board, stadium, field, stadiumL, fieldL}; setA(cache); if (h !== null) continueRender(h); });
  }, [h]);
  return a;
};

// ---- helpers ------------------------------------------------------------------------------------------------------------
// skinned clones have no valid bounds until posed: measure the skeleton (feet → head-top bones) instead
const heightOf = (o: THREE.Object3D, boneK = 1.04) => {
  o.updateMatrixWorld(true);
  const ys: number[] = []; const v = new THREE.Vector3();
  o.traverse((b) => { if ((b as THREE.Bone).isBone) { b.getWorldPosition(v); ys.push(v.y); } });
  if (ys.length > 3) return (Math.max(...ys) - Math.min(...ys)) * boneK || 1;
  const bb = new THREE.Box3().setFromObject(o); return bb.max.y - bb.min.y || 1;
};
// animated character instance: clone (skinned), optional recolour, normalise height, drive the clip by the frame clock
const Char = ({g, clip, t, h = 1.8, tint, speed = 1, ...rest}: {g: GLTF; clip: string; t: number; h?: number; tint?: Record<string, string>; speed?: number} & ThreeElements['group']) => {
  const {obj, mixer, k} = useMemo(() => {
    const obj = SkeletonUtils.clone(g.scene);
    obj.traverse((m) => {
      const mesh = m as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      const c = tint?.[mat.name];
      if (c) { mat.color = new THREE.Color(c); mat.map = null; mat.roughness = 0.45; mat.metalness = 0.15; }
      mesh.material = mat;
    });
    const mixer = new THREE.AnimationMixer(obj);
    const a = g.animations.find((x) => x.name === clip);
    if (a) mixer.clipAction(a).play();
    return {obj, mixer, k: h / heightOf(obj, g === cache?.robot ? 1.18 : 1.04)};
  }, [g, clip, h, tint]);
  mixer.setTime((t / 1000) * speed);
  return <group {...rest}><primitive object={obj} scale={k} /></group>;
};
const Prop = ({g, h, ...rest}: {g: GLTF; h: number} & ThreeElements['group']) => {
  const {obj, k} = useMemo(() => { const obj = g.scene.clone(true); obj.updateMatrixWorld(true); return {obj, k: h / heightOf(obj)}; }, [g, h]);
  return <group {...rest}><primitive object={obj} scale={k} /></group>;
};
const blobTex = (() => { let t: THREE.CanvasTexture | null = null; return () => {
  if (t) return t;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  const gr = x.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  return (t = new THREE.CanvasTexture(c));
}; })();
const Blob = ({x, z, r = 0.7}: {x: number; z: number; r?: number}) => (
  <mesh position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[r * 2, r * 2]} /><meshBasicMaterial map={blobTex()} transparent depthWrite={false} /></mesh>
);
const Sky = ({tex, light, h = 2.2}: {tex: THREE.Texture; light: THREE.Texture; h?: number}) => {
  const sky = useMemo(() => { const s = new GroundedSkybox(tex, h, 80); s.position.y = h - 0.01; return s; }, [tex, h]);
  const {scene} = useThree();
  scene.environment = light;
  return <primitive object={sky} />;
};
const Cam = ({p, l, fov = 40}: {p: [number, number, number]; l: [number, number, number]; fov?: number}) => {
  const {camera} = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...p); c.fov = fov; c.near = 0.05; c.far = 600; c.updateProjectionMatrix(); c.lookAt(...l);
  return null;
};
// football flying from a to b with an arc, spinning, light trail
const Throw = ({ball, o, at, d = 900, a, b, arc = 1.6}: {ball: GLTF; o: number; at: number; d?: number; a: [number, number, number]; b: [number, number, number]; arc?: number}) => {
  const u = (o - at) / d;
  if (u < 0 || u > 1.15) return null;
  const pos = (q: number): [number, number, number] => [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q + Math.sin(Math.min(q, 1) * Math.PI) * arc, a[2] + (b[2] - a[2]) * q];
  const dir = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return <>
    <Prop g={ball} h={0.34} position={pos(u)} rotation={[(o - at) / 40, 0, dir + (b[0] < a[0] ? Math.PI : 0)]} />
    {[0.04, 0.08, 0.12, 0.16].map((s, i) => u - s > 0 && <mesh key={i} position={pos(u - s)}><sphereGeometry args={[0.07 - i * 0.012, 12, 8]} /><meshBasicMaterial color="#c6ffd0" transparent opacity={0.6 - i * 0.13} /></mesh>)}
  </>;
};
// chalk play drawn live on a canvas: O's, X's and an arrow that rolls RIGHT
const Chalk = ({p}: {p: number}) => {
  const {c, t} = useMemo(() => { const c = document.createElement('canvas'); c.width = 512; c.height = 384; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return {c, t}; }, []);
  const x = c.getContext('2d')!;
  x.clearRect(0, 0, 512, 384); x.strokeStyle = '#f4f4ee'; x.fillStyle = '#f4f4ee'; x.lineWidth = 7; x.lineCap = 'round'; x.font = 'bold 44px Anton';
  [[140, 250], [200, 250], [256, 250], [312, 250], [372, 250]].forEach(([u, v]) => { x.beginPath(); x.arc(u, v, 16, 0, Math.PI * 2); x.stroke(); });
  x.beginPath(); x.arc(256, 320, 16, 0, Math.PI * 2); x.stroke(); x.fillText('QB', 236, 372);
  [[120, 150], [256, 120], [400, 150]].forEach(([u, v]) => { x.beginPath(); x.moveTo(u - 14, v - 14); x.lineTo(u + 14, v + 14); x.moveTo(u + 14, v - 14); x.lineTo(u - 14, v + 14); x.stroke(); });
  if (p > 0) {
    x.strokeStyle = '#ffe14d'; x.lineWidth = 9; x.beginPath(); x.moveTo(256, 320);
    const q = Math.min(1, p); x.bezierCurveTo(256 + 120 * q, 320, 330 + 100 * q, 300 - 10 * q, 300 + 160 * q, 290 - 20 * q); x.stroke();
    if (p >= 1) { x.beginPath(); x.moveTo(460, 270); x.lineTo(486, 268); x.lineTo(468, 290); x.closePath(); x.fillStyle = '#ffe14d'; x.fill(); x.font = 'bold 54px Anton'; x.fillText('RIGHT', 360, 70); }
  }
  t.needsUpdate = true;
  return <meshBasicMaterial map={t} transparent depthTest={false} side={THREE.DoubleSide} />;
};

// ---- scenes ----------------------------------------------------------------------------------------------------------------
export type LeftyK = {S: number[]; throw0: number; left0: number; right0: number; kid: number; coachRight: number; most: number; hated: number;
  threw: number; leftB: number; onlyRight: number; rolling: number; worked: number; much: number; best: number; end: number};
const XB_TINT = {'asdf1:Beta_HighLimbsGeoSG2': TEAL, Beta_Joints_MAT: '#11181c'};
const KID_TINT = {'asdf1:Beta_HighLimbsGeoSG2': '#29c6cf', Beta_Joints_MAT: GOLD};
const inR = (o: number, a: number, b: number) => o >= a && o < b;

export const LeftyWorld = ({o, K}: {o: number; K: LeftyK}) => {
  const A = useLeftyAssets();
  const S = K.S;
  const sc = inR(o, 0, S[1]) ? 0 : inR(o, S[2], S[3]) ? 2 : inR(o, S[3], S[4] - 0) ? 3 : inR(o, S[5], S[6]) ? 5 : inR(o, S[6], S[7]) ? 6 : inR(o, K.best + 1250, K.end + 500) ? 7 : -1;
  if (!A || sc < 0) return null;
  const t = o;
  return <ThreeCanvas width={1080} height={1077} camera={{fov: 40, position: [0, 1.5, 6]}} style={{position: 'absolute', inset: 0}}>
    <ambientLight intensity={0.35} />
    <directionalLight position={[3, 6, 4]} intensity={1.4} />
    {sc === 0 && <HookScene A={A} o={o} K={K} />}
    {sc === 2 && <KidScene A={A} o={o} K={K} />}
    {sc === 3 && <CoachScene A={A} o={o} K={K} t={t} />}
    {sc === 5 && <AgainstScene A={A} o={o} K={K} />}
    {sc === 6 && <GrowScene A={A} o={o} K={K} />}
    {sc === 7 && <DanceScene A={A} o={o} K={K} />}
  </ThreeCanvas>;
};
type SP = {A: Assets; o: number; K: LeftyK};

// HOOK: pro stadium, #16 sprints LEFT and fires; LEFT (green) vs RIGHT (red, X'd)
const HookScene = ({A, o, K}: SP) => {
  const x = 2.2 - (o / 1000) * 2.6;
  return <>
    <Sky tex={A.stadium} light={A.stadiumL} h={2.4} />
    <Cam p={[x - 2.6 + Math.sin(o / 700) * 0.15, 1.15, 3.4 - ez(o, 1300, 900) * 0.6]} l={[x - 0.6, 1.15, 0]} fov={42} />
    <Char g={A.xbot} clip="run" t={o} speed={1.15} tint={XB_TINT} position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    <Blob x={x} z={0} />
    <Throw ball={A.ball} o={o} at={K.throw0} d={1100} a={[x - 0.3, 1.6, 0]} b={[x - 7, 1.2, -2]} arc={1.4} />
    {o >= K.left0 && <group position={[x - 1.7, 1.75, -0.8]} scale={sp(o, K.left0, 10, 220)}>
      <Arrow3D color="#2fd25a" rotation={[0, 0, Math.PI / 2]} position={[-0.9, 0, 0]} scale={0.75} />
      <Word3D text="LEFT" size={0.42} face="#2fd25a" side="#0b5a22" position={[0.45, 0, 0]} />
    </group>}
    {o >= K.right0 && <group position={[x + 0.5, 2.05, -1.4]} scale={sp(o, K.right0, 10, 220) * 0.75}>
      <Word3D text="RIGHT" size={0.42} face={RED} side="#5c0a0d" />
      <XMark3D o={o} at={K.right0 + 120} scale={0.45} />
    </group>}
  </>;
};
// KID: youth field, little Trevor bouncing
const KidScene = ({A, o, K}: SP) => {
  const t = o - K.S[2];
  return <>
    <Sky tex={A.field} light={A.fieldL} h={2.0} />
    <Cam p={[Math.sin(t / 1600) * 1.2, 1.0, 3.6 - t / 4000]} l={[0, 0.75, 0]} fov={40} />
    <Char g={A.xbot} clip="agree" t={t} h={1.15} tint={KID_TINT} position={[0, 0, 0]} rotation={[0, 0.25, 0]} />
    <Blob x={0} z={0} r={0.45} />
    <Prop g={A.ball} h={0.3} position={[0.45, 0.13, 0.35]} rotation={[0, 0.6, Math.PI / 2]} />
    <group position={[0, 1.65, 0]} scale={sp(o, K.kid - 100, 10, 220)}>
      <Word3D text="LIL TREVOR" size={0.3} face="#ffffff" side={TEAL_D} />
    </group>
  </>;
};
// COACH: robot coach + chalkboard drawing a rollout to the RIGHT, then everyone runs right
const CoachScene = ({A, o, K}: SP & {t: number}) => {
  const t = o - K.S[3];
  const crowd = o >= K.most - 250;
  const pan = ez(o, K.most - 250, 700);
  return <>
    <Sky tex={A.field} light={A.fieldL} h={2.0} />
    <Cam p={[-0.1 + pan * 2.6, 1.3 + pan * 0.4, 5.3 + pan * 0.8]} l={[0.0 + pan * 2.8, 1.0, 0]} fov={42} />
    <Char g={A.robot} clip={o < K.coachRight ? 'Wave' : 'Yes'} t={t} h={1.35} position={[-0.95, 0, 0.2]} rotation={[0, 0.5, 0]} />
    <Blob x={-0.95} z={0.2} />
    <group position={[0.75, 0, -0.1]} rotation={[0, -0.25, 0]}>
      <Prop g={A.board} h={2.0} />
      {/* model is 1.51 tall → ×1.325; front slate face leans back ~15° (y 0.32→1.44, z 0.30→0) */}
      <group scale={1.325}><mesh position={[0.014, 0.98, 0.2]} rotation={[-0.26, 0, 0]} renderOrder={5}><planeGeometry args={[0.66, 0.74]} /><Chalk p={ez(o, K.coachRight - 500, 700) + (o >= K.coachRight + 200 ? 1 : 0)} /></mesh></group>
    </group>
    {crowd && [0, 1, 2, 3, 4].map((i) => {
      const x = 1.3 + i * 0.95 + ((o - K.most) / 1000) * 2.2;
      return <group key={i}><Char g={A.soldier} clip="Run" t={o + i * 137} h={1.5} position={[x, 0, -1.2 - (i % 2) * 0.9]} rotation={[0, -Math.PI / 2, 0]} /><Blob x={x} z={-1.2 - (i % 2) * 0.9} /></group>;
    })}
    {crowd && <group position={[3.4, 2.35, -1]} scale={sp(o, K.most, 10, 220)}>
      <Word3D text="EVERYONE GOES RIGHT" size={0.24} />
      <Arrow3D color="#ffffff" rotation={[0, 0, -Math.PI / 2]} position={[0, -0.5, 0]} scale={0.4} />
    </group>}
  </>;
};
// AGAINST THE CROWD: little #16 runs LEFT through a wave of players running RIGHT, throwing left
const AgainstScene = ({A, o, K}: SP) => {
  const t = o - K.S[5];
  const x = 2.5 - (t / 1000) * 1.6;
  return <>
    <Sky tex={A.field} light={A.fieldL} h={2.0} />
    <Cam p={[x + 0.6, 1.25, 4.0]} l={[x - 0.4, 0.8, 0]} fov={44} />
    <Char g={A.xbot} clip="run" t={o} h={1.2} tint={KID_TINT} position={[x, 0, 0.3]} rotation={[0, -Math.PI / 2, 0]} />
    <Blob x={x} z={0.3} r={0.5} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const sx = -4 + i * 1.3 + (t / 1000) * 2.4 - (i % 2) * 0.6;
      return <group key={i}><Char g={A.soldier} clip="Run" t={o + i * 211} h={1.25} position={[sx, 0, -1.3 - (i % 3) * 0.8]} rotation={[0, -Math.PI / 2, 0]} /><Blob x={sx} z={-1.3 - (i % 3) * 0.8} r={0.5} /></group>;
    })}
    {[K.threw, K.leftB, K.rolling].map((at, i) => <Throw key={i} ball={A.ball} o={o} at={at} d={850} a={[x - 0.2, 1.05, 0.3]} b={[x - 5.5, 0.9, -1.5]} arc={1.1} />)}
    {o >= K.leftB && <group position={[x - 0.75, 1.75, -0.4]} scale={sp(o, K.leftB, 10, 220) * 0.85}>
      <Arrow3D color="#2fd25a" rotation={[0, 0, Math.PI / 2]} position={[-0.75, 0, 0]} scale={0.6} /><Word3D text="LEFT" size={0.38} face="#2fd25a" side="#0b5a22" position={[0.35, 0, 0]} />
    </group>}
    {o >= K.onlyRight && <group position={[x + 0.55, 2.2, -1.4]} scale={sp(o, K.onlyRight, 10, 220) * 0.65}>
      <Word3D text="ONLY RIGHT?" size={0.32} face={RED} side="#5c0a0d" /><XMark3D o={o} at={K.onlyRight + 150} scale={0.4} />
    </group>}
  </>;
};
// GROW UP: pro stadium, full-size #16 sprinting left, low hero angle
const GrowScene = ({A, o, K}: SP) => {
  const t = o - K.S[6];
  const grow = ez(o, K.S[6], 700);
  const x = 1.5 - (t / 1000) * 2.4;
  return <>
    <Sky tex={A.stadium} light={A.stadiumL} h={2.4} />
    <Cam p={[x - 2.2, 0.55, 2.6]} l={[x - 0.2, 1.2, 0]} fov={46} />
    <Char g={A.xbot} clip="run" t={o} speed={1.2} h={1.2 + 0.7 * grow} tint={XB_TINT} position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    <Blob x={x} z={0} />
    <Throw ball={A.ball} o={o} at={K.worked + 250} d={1000} a={[x - 0.3, 1.7, 0]} b={[x - 7, 2.2, -1]} arc={1.0} />
    {o >= K.much - 150 && <group position={[x - 2.4, 2.6, -0.8]} rotation={[0, 0.55, 0]} scale={sp(o, K.much - 150, 9, 220)}>
      <Word3D text="SO MUCH" size={0.5} face={GOLD} side="#7a5a12" metal={1} rough={0.22} />
    </group>}
  </>;
};
// END: coach robot dances in the stadium, BEST QB EVER?!
const DanceScene = ({A, o, K}: SP) => {
  const t = o - (K.best + 1250);
  return <>
    <Sky tex={A.stadium} light={A.stadiumL} h={2.4} />
    <Cam p={[Math.sin(t / 900) * 0.8, 1.3, 5.8]} l={[0, 1.15, 0]} fov={42} />
    <Char g={A.robot} clip="Dance" t={t} h={1.5} position={[0, 0, 0]} />
    <Blob x={0} z={0} />
    <group position={[0, 2.3, -0.3]} scale={sp(o, K.best + 1250, 9, 220)}>
      <Word3D text="BEST QB EVER?!" size={0.3} face={GOLD} side="#7a5a12" metal={1} rough={0.22} />
    </group>
    <Confetti3D o={o} at={K.best + 1350} position={[0, 2.4, 0.5]} colors={[TEAL, GOLD, '#ffffff']} />
  </>;
};
