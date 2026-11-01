// "NBA goat" 3D scenes (input.mp4): ? hook with an orbiting basketball, NBA GOAT? slam, G-O-A-T letters bouncing in,
// a carousel of GOAT cards spinning faster while Trevor thinks, the Dellavedova card slam with confetti, the
// rejected GOATs falling, a shaking TENSION.
import {ThreeCanvas} from '@remotion/three';
import {Basketball3D, Card3D, Confetti3D, Env, GOLD, Lights, RED, Rig, Sparkles3D, TEAL_D, Word3D, ez, sp, useImage} from './three';

export type GoatTimes = Record<'who' | 'nba' | 'greatest' | 'think' | 'gotta' | 'della' | 'laugh' | 'tension' | 'end', number>;
const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const inR = (o: number, a: number, b: number) => o >= a && o < b;

export const GoatFront = ({o, K}: {o: number; K: GoatTimes}) => {
  const imL = useImage('img/j3d/card_lebron.png'), imK = useImage('img/j3d/card_kobe.png'), imC = useImage('img/j3d/card_curry.png'), imD = useImage('img/j3d/card_della.png');
  const goats = [imL, imK, imC];
  // carousel speeds up through the long think
  const tt = Math.max(0, o - K.think);
  const spin = tt / 1000 * 1.2 + (tt / 1000) ** 2 * 0.35;
  const fly = ez(o, K.gotta - 150, 350);
  const pD = sp(o, K.della, 9, 180);
  const corner = ez(o, K.laugh, 450);
  const letters = ['G', 'O', 'A', 'T'];
  return <ThreeCanvas width={1080} height={1077} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    <Rig o={o} hits={[K.who, K.della, K.tension, ...letters.map((_, i) => K.greatest + 120 + i * 260)]}>
      {o < K.who && <>
        <Word3D text="?" size={2.4} depth={0.5} position={[0, 1.15, (1 - sp(o, 150, 10, 160)) * 8]} rotation={[0, Math.sin(o / 500) * 0.5, 0.08]} />
        <Basketball3D position={[Math.cos(o / 380) * 1.9, 1.15 + Math.sin(o / 380) * 0.45, Math.sin(o / 380) * 1.2]} rotation={[o / 200, o / 260, 0]} scale={0.75 * sp(o, 300, 12, 200)} />
        <Sparkles3D o={o} position={[0, 1.15, 0]} r={2.3} />
      </>}
      {inR(o, K.who, K.nba) && <>
        <Word3D text="NBA" size={0.62} position={[0, 2.15, (1 - sp(o, K.who, 10, 220)) * 8]} rotation={[0, Math.sin(o / 400) * 0.2, 0]} />
        <Word3D text="GOAT?" size={1.15} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 0.95, (1 - sp(o, K.who + 220, 9, 220)) * 9]} rotation={[0.05, Math.sin(o / 450) * 0.25, 0]} />
        <Basketball3D position={[-2.3, -0.2 + Math.abs(Math.sin((o - K.who) / 230)) * 1.5, 0.6]} rotation={[0, 0, -(o - K.who) / 150]} scale={0.6} />
      </>}
      {inR(o, K.nba, K.greatest) && <Word3D text="?" size={0.9} face="#ffffff" side={TEAL_D} position={[1.95, 1.75 + Math.abs(Math.sin((o - K.nba) / 160)) * 0.25, 0.3]} rotation={[0, (o - K.nba) / 220, 0.2]} scale={sp(o, K.nba, 9, 260)} />}
      {inR(o, K.greatest, K.think + 300) && letters.map((l, i) => {
        const at = K.greatest + 120 + i * 260; if (o < at) return null;
        const p = sp(o, at, 6, 180);
        return <Word3D key={l} text={l} size={1.25} face={i === 3 ? GOLD : '#ffffff'} side={i === 3 ? '#7a5a12' : TEAL_D} metal={i === 3 ? 1 : 0.15}
          position={[-2.0 + i * 1.33, 1.3 + (1 - p) * 6 + ez(o, K.think, 300) * 8, 0]} rotation={[0, 0, (1 - p) * 0.6]} />;
      })}
      {inR(o, K.think + 200, K.gotta + 250) && <>
        {goats.map((im, i) => {
          const a = spin + (i / 3) * Math.PI * 2;
          const p = sp(o, K.think + 200 + i * 180, 12, 160);
          return <Card3D key={i} img={im} h={1.9} position={[Math.sin(a) * 2.3 * (1 + fly * 2), 1.35 + (1 - p) * 6, Math.cos(a) * 1.4 - 0.6]} rotation={[0, Math.sin(a) * 0.35, 0]} />;
        })}
        {[0, 1, 2].map((i) => <mesh key={i} position={[-0.45 + i * 0.45, 2.55 + Math.abs(Math.sin(o / 160 - i * 0.7)) * 0.3, 0.5]} scale={1 - fly}>
          <sphereGeometry args={[0.13, 24, 16]} /><meshPhysicalMaterial color="#ffffff" clearcoat={1} roughness={0.2} /></mesh>)}
      </>}
      {o >= K.della && <>
        <Card3D img={imD} h={3.1} position={[1.95 * corner, 0.75 + 1.1 * corner, (1 - pD) * 9]} scale={1 - 0.5 * corner} rotation={[0.04, (1 - pD) * Math.PI * 2 + Math.sin(o / 500) * 0.15, -0.04]} />
        {o < K.laugh && <Word3D text="?!" size={1.0} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[2.05, 2.2, 0.4]} rotation={[0, Math.sin(o / 300) * 0.4, 0.15]} scale={sp(o, K.della + 300, 9, 240)} />}
        <Confetti3D o={o} at={K.della + 120} position={[0, 1.2, 0.5]} />
      </>}
      {inR(o, K.laugh + 200, K.end) && goats.map((im, i) => {
        const t = Math.max(0, (o - K.laugh - 200 - i * 250) / 1000);
        return <Card3D key={i} img={im} h={1.6} position={[-2.2 + i * 2.2, 4.5 - 9 * t * t, 1]} rotation={[t * 2, t * 3, t * (i - 1) * 2]} />;
      })}
      {o >= K.tension && <Word3D text="TENSION" size={0.85} face={RED} side="#5c0a0d" position={[-0.5 + Math.sin(o * 0.9) * 0.06, 2.45 + Math.cos(o * 1.1) * 0.06, (1 - sp(o, K.tension, 9, 230)) * 8]} rotation={[0, 0, Math.sin(o / 30) * 0.03]} />}
    </Rig>
  </ThreeCanvas>;
};
