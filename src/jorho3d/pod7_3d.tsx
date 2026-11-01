// v7 hybrid: the few 3D hero props per clip (the rest is 2D podcast motion graphics, see src/jorho/pod7.tsx).
// Each canvas is only mounted while its 3D beat is on screen (keeps renders fast).
import {RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import type {ThreeElements} from '@react-three/fiber';
import {Card3D, Confetti3D, Env, Football3D, GOLD, Lights, Rig, Sparkles3D, TEAL, TEAL_D, ez, sp, useImage} from './three';

const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const inR = (o: number, a: number, b: number) => o >= a && o < b;
const Canvas = ({children}: {children: React.ReactNode}) => (
  <ThreeCanvas width={1080} height={1077} camera={CAM} style={{position: 'absolute', inset: 0}}><Env /><Lights />{children}</ThreeCanvas>
);

// teal gift box with a gold ribbon; lid (0..1) flies off
const ribbon = <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.22} clearcoat={1} />;
const wrap = <meshPhysicalMaterial color={TEAL} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />;
export const GiftBox3D = ({lid = 0, ...g}: {lid?: number} & ThreeElements['group']) => (
  <group {...g}>
    <RoundedBox args={[1.6, 1.2, 1.6]} radius={0.05} smoothness={4}>{wrap}</RoundedBox>
    <mesh><boxGeometry args={[0.26, 1.22, 1.62]} />{ribbon}</mesh>
    <mesh><boxGeometry args={[1.62, 1.22, 0.26]} />{ribbon}</mesh>
    <group position={[0.8 * lid, 0.72 + lid * 2.4, 0.4 * lid]} rotation={[-0.9 * lid, 0.6 * lid, 0.7 * lid]}>
      <RoundedBox args={[1.76, 0.3, 1.76]} radius={0.05} smoothness={4}>{wrap}</RoundedBox>
      <mesh><boxGeometry args={[0.28, 0.32, 1.78]} />{ribbon}</mesh>
      <mesh><boxGeometry args={[1.78, 0.32, 0.28]} />{ribbon}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0.28 * s, 0.32, 0]} rotation={[Math.PI / 2, 0, 0.5 * s]}><torusGeometry args={[0.24, 0.07, 12, 32]} />{ribbon}</mesh>)}
    </group>
  </group>
);

export type GiftK = {gift: number; hide1: number; seg3: number; signed: number; sigFrom: number; seg5: number; seg7: number; ticket2: number; end: number};
export const GiftFront = ({o, K}: {o: number; K: GiftK}) => {
  const im = useImage('img/j3d/ticket_nc.png');
  const a = inR(o, 0, K.hide1), b = inR(o, K.seg3, K.seg5), c = inR(o, K.seg7, K.end + 1);
  if (!a && !b && !c) return null;
  const sigP = ez(o, K.sigFrom, 1300);
  return <Canvas>
    <Rig o={o} hits={[K.gift, K.signed, K.ticket2]}>
      {a && <GiftBox3D position={[0, 1.55 + (1 - sp(o, 80, 10, 160)) * 6 + Math.abs(Math.sin(o / 260)) * 0.08 * (o < K.gift ? 1 : 0), 0]}
        rotation={[0.35, o / 900 + Math.sin(o / 300) * 0.1 * (o > K.gift ? 1 : 0), Math.sin(o / 180) * 0.06 * (o > K.gift ? 1 : 0)]}
        scale={0.95 * (1 - ez(o, K.hide1 - 250, 250))} />}
      {b && <>
        <GiftBox3D lid={ez(o, K.signed - 100, 500)} position={[0, -0.2, 0]} rotation={[0.3, 0.5, 0]} scale={sp(o, K.seg3, 11, 200) * 0.9 * (1 - ez(o, K.signed + 500, 350))} />
        {o >= K.signed && <Card3D img={im} back="#522D80" h={2.3} sig="Trevor Lawrence" sigP={sigP} sigBox={[70, 575, 460, 100]} sigSize={86} sigColor="#16083a"
          position={[0, -0.6 + 1.95 * ez(o, K.signed, 650), 0.3]} rotation={[0.04, (1 - ez(o, K.signed, 900)) * Math.PI * 3 + Math.sin(o / 600) * 0.15, -0.04]} />}
        {o >= K.sigFrom && <Sparkles3D o={o} position={[0, 1.35, 0.3]} r={1.6} />}
      </>}
      {c && <>
        <Card3D img={im} back="#522D80" h={1.9} sig="Trevor Lawrence" sigP={1} sigBox={[70, 575, 460, 100]} sigSize={86} sigColor="#16083a"
          position={[2.2, 0.55 + (1 - sp(o, K.seg7, 10, 180)) * -6, 0]} rotation={[0.05, -0.35 + Math.sin(o / 500) * 0.25, 0.05]} />
        <Confetti3D o={o} at={K.ticket2} position={[0.8, 1.6, 0.5]} colors={['#F56600', '#522D80', '#ffffff', GOLD]} />
      </>}
    </Rig>
  </Canvas>;
};

export type CellyK = {fbFrom: number; fbTo: number; slabFrom: number; psa: number; slabTo: number; yo: number; end: number};
export const CellyFront = ({o, K}: {o: number; K: CellyK}) => {
  const im = useImage('img/j3d/slab_psa10.png');
  const a = inR(o, K.fbFrom, K.fbTo), b = inR(o, K.slabFrom, K.slabTo), c = inR(o, K.yo - 900, K.end + 1);
  if (!a && !b && !c) return null;
  const t = (o - K.fbFrom) / (K.fbTo - K.fbFrom);
  return <Canvas>
    <Rig o={o} hits={[K.psa, K.yo]}>
      {a && <>
        <Football3D position={[1.5 + 1.5 * t, -2.6 + 5.8 * t - 1.4 * t * t, 1.5 - t]} rotation={[0.2, 0.4, (o - K.fbFrom) / 45]} scale={1.15} />
        {[1, 2, 3, 4].map((i) => { const u = Math.max(0, t - i * 0.05); return <mesh key={i} position={[1.5 + 1.5 * u, -2.6 + 5.8 * u - 1.4 * u * u, 1.5 - u]}>
          <sphereGeometry args={[0.13 - i * 0.022, 16, 12]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.55 - i * 0.11} /></mesh>; })}
      </>}
      {b && <Card3D img={im} back="#dfe6ea" h={2.5} position={[2.05, 0.55 + (1 - sp(o, K.slabFrom, 10, 170)) * -6, 0]}
        rotation={[0.06, (1 - ez(o, K.psa - 200, 800)) * Math.PI * 2 - 0.3 + Math.sin(o / 550) * 0.18, 0.04]} />}
      {b && o >= K.psa && <Sparkles3D o={o} position={[2.05, 0.6, 0.3]} r={1.5} />}
      {c && <Confetti3D o={o} at={K.yo} position={[0, 1.4, 0.5]} colors={[TEAL, GOLD, '#ffffff', '#7BE84A']} />}
    </Rig>
  </Canvas>;
};

export type MillsK = {names: number[]; davis: number; ew: number; out: number};
export const MillsFront = ({o, K}: {o: number; K: MillsK}) => {
  const im = useImage('img/j3d/card_mills.png');
  if (o >= K.out) return null;
  const toss = (i: number) => Math.max(0, (o - K.names[i]) / 1000);
  const move = ez(o, K.ew - 100, 350);
  return <Canvas>
    <Rig o={o} hits={[K.davis, K.ew]}>
      {[0, 1, 2].map((i) => { const t = toss(i); if (t > 1.2) return null;
        return <Card3D key={i} img={null} back={TEAL_D} h={1.35} position={[1.25 + (i - 1) * 0.3 + t * (i - 1 || 1) * 5, 2.05 + t * 2.2 - t * t * 6, -0.2 * i]}
          rotation={[0, Math.PI + (i - 1) * 0.25 + t * 9, (i - 1) * 0.18 + t * 4]} scale={sp(o, 100 + i * 120, 11, 220)} />; })}
      {o >= K.davis - 150 && <Card3D img={im} back={TEAL_D} h={1.45 + 0.4 * move} position={[1.25 - 1.25 * move, 2.0 - 0.3 * move, (1 - sp(o, K.davis - 150, 10, 200)) * 8]}
        rotation={[0.04, (1 - ez(o, K.davis, 450)) * Math.PI + Math.sin(o / 500) * 0.15, -0.05]} />}
    </Rig>
  </Canvas>;
};
