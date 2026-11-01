// "$20,000 → $500" 3D scenes (u3): a price tag swinging on its string with coins raining, the tag flipping to $200
// then $500 while a red arrow crashes, a fast clock for "not ready yet", NOBODY LIKES IT, then chart bars rising to
// MOST EXPENSIVE SALE EVER.
import {ThreeCanvas} from '@remotion/three';
import {Arrow3D, Bars3D, Clock3D, Coin3D, Confetti3D, Env, GOLD, Lights, RED, Rig, TEAL, TEAL_D, Tag3D, Word3D, XMark3D, ez, sp} from './three';

export type RedeemTimes = Record<'k20' | 'what' | 'd200' | 'd500' | 'maybe' | 'why' | 'finish' | 'product' | 'notYet' | 'people' | 'really' | 'product2' | 'most' | 'sale' | 'end', number> & {S: number[]};
const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const inR = (o: number, a: number, b: number) => o >= a && o < b;

export const RedeemFront = ({o, K}: {o: number; K: RedeemTimes}) => {
  const S = K.S;
  const pTag = sp(o, 120, 10, 150);
  const flip1 = ez(o, K.d200 - 150, 300), flip2 = ez(o, K.d500 - 150, 300);
  const sx = Math.max(0.03, Math.abs(Math.cos((flip1 + flip2) * Math.PI))); // card-flip squash, text never mirrored
  const price = o < K.d200 ? '$20,000' : o < K.d500 ? '$200?' : '$500';
  const droop = ez(o, K.maybe, 500);
  const swing = Math.sin(o / 420) * 0.12 * (1 - droop);
  return <ThreeCanvas width={1080} height={1077} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    <Rig o={o} hits={[K.k20, K.d500, K.people, K.sale]}>
      {o < S[3] && <group position={[0, 1.55 + (1 - pTag) * 6, 0]} rotation={[0, Math.sin(o / 700) * 0.15, swing - droop * 0.35]}>
        <mesh position={[-1.3, 1.1, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.012, 0.012, 1.3, 8]} /><meshStandardMaterial color="#ddd" /></mesh>
        <group scale={[sx, 1, 1]}>
          <Tag3D text={price} color={o < K.d500 ? '#ffffff' : '#ffd9d9'} ink={o < K.d500 ? TEAL_D : RED} />
        </group>
      </group>}
      {inR(o, K.k20, K.d200) && Array.from({length: 14}).map((_, i) => {
        const t = (o - K.k20 - i * 70) / 1000; if (t < 0) return null;
        return <Coin3D key={i} position={[-2.6 + (i * 0.41) % 5.2, 3.6 - 6 * t * t - t, (i % 3) * 0.4]} rotation={[t * 5 + i, t * 3, 0]} scale={0.8} />;
      })}
      {inR(o, K.what, K.d200) && <Word3D text="?" size={0.8} face="#fff" side={TEAL_D} position={[2.2, 2.5, 0.4]} rotation={[0, (o - K.what) / 200, 0.2]} scale={sp(o, K.what, 9, 260)} />}
      {inR(o, K.d500, S[3]) && <Arrow3D position={[2.1, 2.6 - 2.3 * ez(o, K.d500, 380), 0.6]} rotation={[0, Math.sin(o / 300) * 0.3, Math.PI]} scale={1.1} />}
      {inR(o, K.d500, S[3]) && Array.from({length: 8}).map((_, i) => {
        const t = (o - K.d500) / 1000;
        return <Coin3D key={i} position={[-1.4 + i * 0.4, 0.9 - 7 * t * t, 0.3]} rotation={[t * 6, i, 0]} scale={0.6} />;
      })}
      {inR(o, K.why, S[4]) && <>
        <Word3D text="WHY THE WAIT?" size={0.55} position={[0, 2.35, (1 - sp(o, K.why, 10, 220)) * 8]} rotation={[0, Math.sin(o / 450) * 0.2, 0]} />
        <Clock3D o={o} speed={3} position={[0, 0.6, 0]} rotation={[0, Math.sin(o / 600) * 0.3, 0]} scale={sp(o, K.why + 150, 11, 200)} />
      </>}
      {inR(o, S[4], S[5]) && <>
        <Clock3D o={o} speed={o >= K.finish ? 9 : 2} position={[-1.6 + 0.4 * ez(o, K.notYet, 300), 1.3, 0]} rotation={[0, 0.35, 0]} scale={0.95 * sp(o, S[4], 11, 200)} />
        {o >= K.product && <group position={[1.6, 1.3, 0]} scale={sp(o, K.product, 10, 220)} rotation={[0.2, -0.4 + Math.sin(o / 500) * 0.2, 0]}>
          <mesh><boxGeometry args={[1.5, 1.1, 1.1]} /><meshPhysicalMaterial color={TEAL} roughness={0.3} clearcoat={1} /></mesh>
          <Word3D text="NEW" size={0.36} depth={0.06} position={[0, 0, 0.58]} />
        </group>}
        {o >= K.notYet && <Word3D text="NOT READY YET" size={0.62} face="#ffffff" side={RED} position={[0, -0.25, (1 - sp(o, K.notYet, 9, 220)) * 8]} />}
      </>}
      {inR(o, S[5], S[6]) && <>
        <XMark3D o={o} at={K.people} position={[0, 1.2, -0.6]} scale={1.2} />
        <Word3D text="NOBODY LIKES IT" size={0.56} face={RED} side="#5c0a0d" position={[0, 1.2, (1 - sp(o, K.people + 100, 9, 220)) * 8 + 0.5]} rotation={[0, Math.sin(o / 400) * 0.15, -0.04]} />
      </>}
      {inR(o, S[6], S[7]) && <Word3D text="?" size={0.9} face="#fff" side={TEAL_D} position={[1.9, 1.8, 0.3]} rotation={[0, (o - S[6]) / 200, 0.2]} scale={sp(o, K.really, 9, 260)} />}
      {o >= S[7] && <>
        <Bars3D o={o} at={K.product2} heights={[0.5, 0.75, 0.95, 1.25, 1.9]} position={[0.9, -1.55, 0]} rotation={[0.15, -0.5, 0]} />
        {o >= K.product2 + 600 && <Arrow3D color="#2fd25a" position={[-2.2, -1.2 + 1.1 * ez(o, K.product2 + 600, 500), 0.4]} rotation={[0, Math.sin(o / 300) * 0.3, -0.5]} scale={1} />}
        {o >= K.most && <Word3D text="MOST EXPENSIVE" size={0.42} position={[0, 2.5, (1 - sp(o, K.most, 10, 200)) * 8]} />}
        {o >= K.sale && <>
          <Word3D text="SALE EVER" size={0.72} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 1.45, (1 - sp(o, K.sale, 9, 200)) * 8]} rotation={[0, Math.sin(o / 400) * 0.2, 0]} />
          <Confetti3D o={o} at={K.sale + 100} position={[0, 1.6, 0.5]} colors={[GOLD, '#2fd25a', '#ffffff']} />
        </>}
      </>}
    </Rig>
  </ThreeCanvas>;
};
