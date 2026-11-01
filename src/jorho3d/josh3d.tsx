// "Wrong Josh Allen" 3D scenes (t5): a gold card spinning face-down with sparkles (GOLD?! / TEAL??), the Bills
// Josh Allen card flipping in with a football, flames on "that's fire", ROOKIE CARD, a red X on "not rookie Josh
// Allen", the card flipping to the real Josh Hines-Allen, and the name change spelled out.
import {ThreeCanvas} from '@remotion/three';
import {Card3D, Confetti3D, Env, Flames3D, Football3D, GOLD, Lights, Rig, Sparkles3D, TEAL, TEAL_D, Word3D, XMark3D, ez, sp, useImage} from './three';

export type JoshTimes = Record<'gold' | 'prism' | 'teal' | 'josh' | 'fire' | 'rookie' | 'notRookie' | 'joshAllen' | 'real' | 'hines' | 'before' | 'changed' | 'end', number> & {S: number[]};
const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const inR = (o: number, a: number, b: number) => o >= a && o < b;

export const JoshFront = ({o, K}: {o: number; K: JoshTimes}) => {
  const S = K.S;
  const imJ = useImage('img/j3d/card_jallen.png'), imH = useImage('img/j3d/card_hines_gold.png');
  const pIn = sp(o, 100, 11, 140);
  // the one card through the whole clip: face-down gold → Bills Josh Allen → flips to Hines-Allen
  const showFace = o >= K.josh - 150;
  const flipToFace = ez(o, K.josh - 150, 320);
  const flipReal = ez(o, K.real - 120, 320);
  const angle = (o < K.josh - 150 ? Math.PI + Math.sin(o / 650) * 0.5 : Math.PI * (1 - flipToFace)) + flipReal * Math.PI * 2;
  const faceImg = flipReal > 0.5 ? imH : imJ;
  const cardY = o >= K.before ? 0.2 : 0.55;
  return <ThreeCanvas width={1080} height={1077} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    <Rig o={o} hits={[K.josh, K.joshAllen, K.real]}>
      <Card3D img={showFace ? faceImg : imJ} back={GOLD} h={o >= K.before ? 2.5 : 3.0} position={[0, cardY + (1 - pIn) * -7, 0]}
        rotation={[0.05, angle + Math.sin(o / 600) * 0.12, -0.04]} />
      {o < K.josh && <Sparkles3D o={o} position={[0, 0.75, 0.4]} r={2.2} />}
      {inR(o, K.gold, S[1]) && <Word3D text="GOLD?!" size={0.85} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 2.45, (1 - sp(o, K.gold, 9, 220)) * 8]} rotation={[0, Math.sin(o / 400) * 0.25, 0]} />}
      {inR(o, S[1], S[2]) && o >= K.teal && <Word3D text="TEAL??" size={0.85} face={TEAL} side={TEAL_D} position={[0, 2.45, (1 - sp(o, K.teal, 9, 220)) * 8]} rotation={[0, Math.sin(o / 400) * 0.25, 0.05]} />}
      {inR(o, K.josh, S[4]) && <>
        <Word3D text="JOSH ALLEN?!" size={0.68} face="#ffffff" side="#00338D" position={[0, 2.5, (1 - sp(o, K.josh, 9, 220)) * 8]} />
        <Football3D position={[-5 + 10 * ez(o, K.josh - 100, 1100), 1.9 - 1.4 * ez(o, K.josh - 100, 1100), 1.2]} rotation={[(o - K.josh) / 60, 0.3, 0.25]} />
      </>}
      {inR(o, K.fire - 120, S[5]) && <Flames3D o={o} position={[0, -1.15, 0.4]} scale={1.15 * sp(o, K.fire - 120, 10, 220)} />}
      {inR(o, K.rookie, S[6]) && <Word3D text="ROOKIE CARD" size={0.62} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 2.5, (1 - sp(o, K.rookie, 9, 220)) * 8]} />}
      {inR(o, K.joshAllen, K.real - 100) && <XMark3D o={o} at={K.joshAllen} position={[0, 0.75, 0.5]} scale={0.9} />}
      {inR(o, K.notRookie, K.real) && <Word3D text="NOT THAT ONE" size={0.62} face="#ffffff" side="#5c0a0d" position={[0, 2.5, (1 - sp(o, K.notRookie, 9, 220)) * 8]} />}
      {inR(o, K.real, K.before) && <>
        <Word3D text="THE OTHER" size={0.5} position={[0, 2.62, (1 - sp(o, K.real, 10, 220)) * 8]} />
        <Word3D text="JOSH ALLEN" size={0.72} face={TEAL} side={TEAL_D} position={[0, 2.0, (1 - sp(o, K.real + 150, 9, 220)) * 8]} rotation={[0, Math.sin(o / 400) * 0.2, 0]} />
        <Confetti3D o={o} at={K.real + 80} position={[0, 0.9, 0.6]} colors={[GOLD, TEAL, '#ffffff']} />
      </>}
      {o >= K.before && <>
        <Word3D text="JOSH" size={0.62} position={[-1.85 - 0.25 * ez(o, K.changed, 300), 2.15, 0]} scale={sp(o, K.before, 10, 220)} />
        <Word3D text="ALLEN" size={0.62} position={[1.6 + 0.35 * ez(o, K.changed, 300), 2.15, 0]} scale={sp(o, K.before + 100, 10, 220)} />
        {o >= K.changed && <Word3D text="HINES-" size={0.62} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[-0.05, 2.15 + (1 - sp(o, K.changed, 8, 240)) * 4, 0.2]} />}
      </>}
    </Rig>
  </ThreeCanvas>;
};
