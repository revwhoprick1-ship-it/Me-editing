// Jorho 3D kit (vault/02 Style Guide/Jorho style.md, v6): real three.js objects rendered by @remotion/three
// (render/still with --gl=swangle). Look: Jaguars teal + gold + white on the footage, red only for "no respect";
// glossy physical materials lit by a procedural room environment, springy pops, slams with camera shake.
// World units: camera z=10, fov 35 → the 1080x1077 video box spans x,y ≈ ±3.15.
import {RoundedBox, Text3D, Center} from '@react-three/drei';
import {useThree, type ThreeElements} from '@react-three/fiber';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {continueRender, delayRender, interpolate, spring, staticFile} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import anton from './fonts/anton.json';

export const FPS = 30;
export const TEAL = '#00A3AD';
export const TEAL_D = '#004a56';
export const GOLD = '#D7A22A';
export const RED = '#E3242B';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ez = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
export const sp = (o: number, a: number, damping = 11, stiffness = 170, mass = 1) =>
  o < a ? 0 : spring({frame: ((o - a) / 1000) * FPS, fps: FPS, config: {damping, stiffness, mass}});
export const shake = (o: number, hits: number[], amp = 0.12) => hits.reduce((s, t) => {
  if (o < t || o > t + 450) return s;
  const k = amp * Math.exp(-(o - t) / 110);
  return [s[0] + k * Math.sin(o * 0.13 + t), s[1] + k * Math.cos(o * 0.11 + t)];
}, [0, 0]);

// glossy reflections without any network HDR
export const Env = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl, scene]);
  return null;
};
export const Lights = () => <>
  <ambientLight intensity={0.35} />
  <directionalLight position={[3, 5, 6]} intensity={2.2} />
  <directionalLight position={[-5, -2, 4]} intensity={0.8} color="#7fe8ef" />
</>;

// images → textures, held back from rendering until loaded
export const useImage = (src: string) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [h] = useState(() => delayRender(`img ${src}`));
  useEffect(() => {
    const i = new Image();
    i.onload = () => { setImg(i); continueRender(h); };
    i.onerror = () => continueRender(h);
    i.src = staticFile(src);
  }, [src, h]);
  return img;
};

// ---- 3D text: front face + side colour, bevelled, centred -------------------------------------------------------
export const Word3D = ({text, size = 0.6, depth = 0.22, face = '#ffffff', side = TEAL_D, metal = 0.15, rough = 0.35, ...g}: {text: string; size?: number; depth?: number;
  face?: string; side?: string; metal?: number; rough?: number} & ThreeElements['group']) => (
  <group {...g}>
    <Center>
      <Text3D font={anton as never} size={size} height={depth} curveSegments={6} bevelEnabled bevelSize={size * 0.025} bevelThickness={size * 0.04} bevelSegments={3} letterSpacing={size * 0.02}>
        {text}
        <meshPhysicalMaterial attach="material-0" color={face} metalness={metal} roughness={rough} clearcoat={1} clearcoatRoughness={0.15} />
        <meshPhysicalMaterial attach="material-1" color={side} metalness={metal} roughness={rough + 0.1} />
      </Text3D>
    </Center>
  </group>
);

// ---- trading card: rounded slab, holo front with a signature that writes itself -----------------------------------
export const Card3D = ({img, sig, sigP = 0, sigBox = [60, 470, 480, 120], sigSize = 92, sigColor = '#0b2a8a', h = 3, back = TEAL_D, ...g}: {img: HTMLImageElement | null; back?: string; sig?: string; sigP?: number;
  sigBox?: [number, number, number, number]; sigSize?: number; sigColor?: string; h?: number} & ThreeElements['group']) => {
  const canvas = useMemo(() => { const c = document.createElement('canvas'); c.width = 600; c.height = 840; return c; }, []);
  const tex = useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }, [canvas]);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 600, 840);
  if (img) ctx.drawImage(img, 0, 0, 600, 840);
  if (sig && sigP > 0) {
    ctx.save();
    ctx.beginPath(); ctx.rect(sigBox[0], sigBox[1] - sigBox[3], sigBox[2] * sigP, sigBox[3] * 2); ctx.clip();
    ctx.font = `${sigSize}px Allura`; ctx.fillStyle = sigColor; ctx.fillText(sig, sigBox[0], sigBox[1]);
    ctx.restore();
  }
  tex.needsUpdate = true;
  const w = (h * 600) / 840;
  return <group {...g}>
    <RoundedBox args={[w, h, 0.07]} radius={0.06} smoothness={4}>
      <meshPhysicalMaterial color={back} metalness={back === GOLD ? 1 : 0.6} roughness={back === GOLD ? 0.2 : 0.3} clearcoat={1} />
    </RoundedBox>
    <mesh position={[0, 0, 0.0365]}>
      <planeGeometry args={[w * 0.985, h * 0.985]} />
      <meshPhysicalMaterial map={tex} roughness={0.32} metalness={0.05} clearcoat={1} clearcoatRoughness={0.08} iridescence={0.55} iridescenceIOR={1.6} />
    </mesh>
  </group>;
};

// ---- gold pen ------------------------------------------------------------------------------------------------------
export const Pen3D = (g: ThreeElements['group']) => (
  <group {...g}>
    <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.085, 0.085, 1.5, 32]} /><meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.22} clearcoat={1} /></mesh>
    <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.09, 0.075, 0.42, 32]} /><meshPhysicalMaterial color="#111" metalness={0.3} roughness={0.4} /></mesh>
    <mesh position={[0, -0.66, 0]}><coneGeometry args={[0.075, 0.24, 32]} /><meshPhysicalMaterial color="#d8d8d8" metalness={1} roughness={0.2} /></mesh>
    <mesh position={[0.1, 0.95, 0]}><boxGeometry args={[0.04, 0.7, 0.05]} /><meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.2} /></mesh>
    <mesh position={[0, 1.32, 0]}><sphereGeometry args={[0.09, 24, 16]} /><meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.2} /></mesh>
  </group>
);

// ---- cartoon ant with googly eyes and a walk cycle -------------------------------------------------------------------
export const Ant3D = ({o, ...g}: {o: number} & ThreeElements['group']) => {
  const shell = <meshPhysicalMaterial color="#0c0c0c" metalness={0} roughness={0.38} clearcoat={0.6} clearcoatRoughness={0.3} />;
  const walk = Math.sin(o / 45);
  return <group {...g}>
    <group position={[0, Math.abs(walk) * 0.03, 0]}>
      <mesh position={[-0.42, 0.02, 0]} scale={[1.35, 1, 1]}><sphereGeometry args={[0.2, 32, 24]} />{shell}</mesh>
      <mesh position={[-0.08, 0.04, 0]} scale={[1.2, 0.8, 0.8]}><sphereGeometry args={[0.12, 24, 16]} />{shell}</mesh>
      <mesh position={[0.22, 0.08, 0]}><sphereGeometry args={[0.16, 32, 24]} />{shell}</mesh>
      {[-1, 1].map((s) => <group key={s}>
        <mesh position={[0.32, 0.17, s * 0.08]}><sphereGeometry args={[0.095, 20, 16]} /><meshStandardMaterial color="#fff" roughness={0.2} /></mesh>
        <mesh position={[0.4 + walk * 0.01, 0.17, s * 0.1]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#000" /></mesh>
        <mesh position={[0.3, 0.33, s * 0.07]} rotation={[s * 0.4, 0, -0.6]}><cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />{shell}</mesh>
        {[-0.18, -0.08, 0.02].map((x, i) => <mesh key={i} position={[x, -0.07, s * 0.14]} rotation={[s * 0.9, 0, 0.4 * walk * (i % 2 ? 1 : -1)]}>
          <cylinderGeometry args={[0.014, 0.012, 0.32, 8]} />{shell}</mesh>)}
      </group>)}
    </group>
  </group>;
};

// ---- phone with the incoming-call screen ---------------------------------------------------------------------------------
export const Phone3D = ({img, ...g}: {img: HTMLImageElement | null} & ThreeElements['group']) => {
  const tex = useMemo(() => { if (!img) return null; const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t; }, [img]);
  return <group {...g}>
    <RoundedBox args={[2.3, 4.7, 0.26]} radius={0.3} smoothness={6}><meshPhysicalMaterial color="#1b1c20" metalness={0.8} roughness={0.25} clearcoat={1} /></RoundedBox>
    {tex && <mesh position={[0, 0, 0.131]}><planeGeometry args={[2.12, 4.42]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>}
  </group>;
};

// ---- american football (lathe) with laces --------------------------------------------------------------------------------
export const Football3D = (g: ThreeElements['group']) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 32; i++) { const t = i / 32; const y = (t - 0.5) * 1.6; pts.push(new THREE.Vector2(Math.max(0.001, 0.5 * Math.sin(Math.PI * t) ** 0.85), y)); }
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return <group {...g}>
    <mesh geometry={geo} rotation={[0, 0, Math.PI / 2]}><meshPhysicalMaterial color="#7a3a17" roughness={0.55} clearcoat={0.4} /></mesh>
    <mesh position={[0, 0.49, 0]}><boxGeometry args={[0.55, 0.03, 0.05]} /><meshStandardMaterial color="#fff" /></mesh>
    {[-0.2, -0.1, 0, 0.1, 0.2].map((x) => <mesh key={x} position={[x, 0.49, 0]}><boxGeometry args={[0.03, 0.03, 0.16]} /><meshStandardMaterial color="#fff" /></mesh>)}
  </group>;
};

export const Rig = ({children, o, hits}: {children: ReactNode; o: number; hits: number[]}) => {
  const [x, y] = shake(o, hits);
  return <group position={[x, y, 0]}>{children}</group>;
};

// ---- more props (v6 set 2) -----------------------------------------------------------------------------------------
const gold = <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.22} clearcoat={1} />;
export const Basketball3D = (g: ThreeElements['group']) => (
  <group {...g}>
    <mesh><sphereGeometry args={[0.6, 48, 32]} /><meshPhysicalMaterial color="#e2722b" roughness={0.6} clearcoat={0.3} /></mesh>
    {[0, Math.PI / 2].map((r) => <mesh key={r} rotation={[0, r, 0]}><torusGeometry args={[0.603, 0.012, 8, 64]} /><meshStandardMaterial color="#1a1a1a" /></mesh>)}
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.603, 0.012, 8, 64]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
  </group>
);
export const Coin3D = (g: ThreeElements['group']) => (
  <group {...g}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.07, 40]} />{gold}</mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.036]}><torusGeometry args={[0.25, 0.018, 8, 40]} />{gold}</mesh>
  </group>
);
// price tag: rounded slab with a hole, text in front
export const Tag3D = ({text, color = '#ffffff', ink = '#123', ...g}: {text: string; color?: string; ink?: string} & ThreeElements['group']) => (
  <group {...g}>
    <RoundedBox args={[3.1, 1.35, 0.14]} radius={0.12} smoothness={4}><meshPhysicalMaterial color={color} roughness={0.35} clearcoat={1} /></RoundedBox>
    <mesh position={[-1.32, 0, 0.08]}><circleGeometry args={[0.1, 24]} /><meshStandardMaterial color="#333" /></mesh>
    <Word3D text={text} size={0.62} depth={0.08} face={ink} side={ink} position={[0.18, 0, 0.12]} />
  </group>
);
// extruded arrow pointing up (rotate z = PI for down)
export const Arrow3D = ({color = '#E3242B', ...g}: {color?: string} & ThreeElements['group']) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.22, -0.9); s.lineTo(0.22, -0.9); s.lineTo(0.22, 0.15); s.lineTo(0.5, 0.15); s.lineTo(0, 0.9); s.lineTo(-0.5, 0.15); s.lineTo(-0.22, 0.15); s.closePath();
    return s;
  }, []);
  return <group {...g}><mesh position={[0, 0, -0.1]}><extrudeGeometry args={[shape, {depth: 0.22, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 3}]} />
    <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={1} /></mesh></group>;
};
export const Clock3D = ({o, speed = 1, ...g}: {o: number; speed?: number} & ThreeElements['group']) => (
  <group {...g}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[1, 1, 0.22, 64]} /><meshPhysicalMaterial color={TEAL} metalness={0.5} roughness={0.3} clearcoat={1} /></mesh>
    <mesh position={[0, 0, 0.115]}><circleGeometry args={[0.88, 64]} /><meshStandardMaterial color="#f7f7f2" /></mesh>
    {Array.from({length: 12}).map((_, i) => <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 0.75, Math.cos((i / 12) * Math.PI * 2) * 0.75, 0.12]}><boxGeometry args={[0.04, 0.12, 0.02]} /><meshStandardMaterial color="#222" /></mesh>)}
    <group position={[0, 0, 0.14]} rotation={[0, 0, -(o / 1000) * speed * Math.PI * 2]}><mesh position={[0, 0.3, 0]}><boxGeometry args={[0.05, 0.62, 0.03]} /><meshStandardMaterial color="#111" /></mesh></group>
    <group position={[0, 0, 0.16]} rotation={[0, 0, -(o / 1000) * speed * Math.PI * 0.2]}><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.08, 0.42, 0.03]} /><meshStandardMaterial color={RED} /></mesh></group>
  </group>
);
// flickering flames (stacked emissive cones)
export const Flames3D = ({o, ...g}: {o: number} & ThreeElements['group']) => (
  <group {...g}>
    {Array.from({length: 9}).map((_, i) => {
      const x = (i - 4) * 0.28, f = 0.75 + 0.35 * Math.sin(o / 70 + i * 1.7);
      return <mesh key={i} position={[x, 0.35 * f, 0]} scale={[1, f, 1]}><coneGeometry args={[0.2, 0.9, 16]} />
        <meshStandardMaterial color={i % 2 ? '#ff9a1f' : '#ff5a1f'} emissive={i % 2 ? '#ff7a00' : '#ff3d00'} emissiveIntensity={1.4} transparent opacity={0.92} /></mesh>;
    })}
  </group>
);
// confetti burst: deterministic pieces flying out and falling
export const Confetti3D = ({o, at, n = 60, colors = [GOLD, TEAL, '#ffffff'], ...g}: {o: number; at: number; n?: number; colors?: string[]} & ThreeElements['group']) => {
  if (o < at) return null;
  const t = (o - at) / 1000;
  return <group {...g}>{Array.from({length: n}).map((_, i) => {
    const a = (i * 137.5 * Math.PI) / 180, v = 2.2 + (i % 7) * 0.45;
    const x = Math.cos(a) * v * t, y = Math.sin(a) * v * t * 0.8 + 1.2 * t - 4.2 * t * t, z = ((i % 5) - 2) * 0.3 * t;
    return <mesh key={i} position={[x, y, z]} rotation={[t * (3 + i % 4), t * (2 + i % 3), i]}><boxGeometry args={[0.1, 0.06, 0.01]} />
      <meshStandardMaterial color={colors[i % colors.length]} metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>;
  })}</group>;
};
export const Bars3D = ({o, at, heights, ...g}: {o: number; at: number; heights: number[]} & ThreeElements['group']) => (
  <group {...g}>{heights.map((hgt, i) => {
    const p = sp(o, at + i * 120, 12, 160); const h = Math.max(0.01, hgt * p);
    return <mesh key={i} position={[(i - (heights.length - 1) / 2) * 0.62, h / 2, 0]}><boxGeometry args={[0.45, h, 0.45]} />
      <meshPhysicalMaterial color={i === heights.length - 1 ? GOLD : TEAL} metalness={i === heights.length - 1 ? 1 : 0.3} roughness={0.28} clearcoat={1} /></mesh>;
  })}</group>
);
export const XMark3D = ({o, at, ...g}: {o: number; at: number} & ThreeElements['group']) => {
  if (o < at) return null;
  const p = sp(o, at, 9, 260);
  return <group {...g} scale={p}>{[0.78, -0.78].map((r) => <RoundedBox key={r} args={[2.6, 0.38, 0.25]} radius={0.1} rotation={[0, 0, r]}>
    <meshPhysicalMaterial color={RED} roughness={0.3} clearcoat={1} /></RoundedBox>)}</group>;
};
export const Sparkles3D = ({o, n = 18, r = 2, ...g}: {o: number; n?: number; r?: number} & ThreeElements['group']) => (
  <group {...g}>{Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2 + o / 1500, s = 0.06 + 0.06 * Math.abs(Math.sin(o / 200 + i));
    return <mesh key={i} position={[Math.cos(a) * r * (0.7 + (i % 3) * 0.15), Math.sin(a) * r * 0.6 * (0.7 + (i % 2) * 0.3), (i % 4) * 0.2]} rotation={[o / 300, o / 400 + i, 0]} scale={s}>
      <octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#fff6c8" emissive={GOLD} emissiveIntensity={1.2} /></mesh>;
  })}</group>
);
