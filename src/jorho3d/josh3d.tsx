// "Wrong Josh Allen" 3D scenes (t5): a gold card spinning face-down with sparkles (GOLD?! / TEAL??), the Bills
// Josh Allen card flipping in with a football, flames on "that's fire", ROOKIE CARD, a red X on "not rookie Josh
// Allen", the card flipping to the real Josh Hines-Allen, and the name change spelled out.
import {ThreeCanvas} from '@remotion/three';
import {Card3D, Confetti3D, Env, Flames3D, Football3D, GOLD, Lights, Rig, Sparkles3D, TEAL, TEAL_D, Word3D, XMark3D, ez, sp, useImage} from './three';

export type JoshTimes = Record<'gold' | 'prism' | 'teal' | 'josh' | 'fire' | 'rookie' | 'notRookie' | 'joshAllen' | 'real' | 'hines' | 'before' | 'changed' | 'end', number> & {S: number[]};
const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const inR = (o: number, a: number, b: number) => o >= a && o < b;

// Layout: the talker (standing host) is on the LEFT of the wide shot, so every 3D thing lives in the right half
// (card at CX, words centred on TX) and never covers his face. Words stay above Trevor's head (y >= 2).
const CX = 1.7, TX = 1.1;

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
  const settle = ez(o, K.real - 120, 400);
  const cardY = 0.45 - 0.3 * settle;
  const word = (a: number) => (1 - sp(o, a, 9, 220)) * 8;
  return <ThreeCanvas width={1080} height={1077} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    <Rig o={o} hits={[K.josh, K.joshAllen, K.real]}>
      <Card3D img={showFace ? faceImg : imJ} back={GOLD} h={2.5 - 0.25 * settle} position={[CX, cardY + (1 - pIn) * -7, 0]}
        rotation={[0.05, angle + Math.sin(o / 600) * 0.12, -0.04]} />
      {o < K.josh && <Sparkles3D o={o} position={[CX, 0.5, 0.4]} r={1.7} />}
      {inR(o, K.gold, S[1]) && <Word3D text="GOLD?!" size={0.75} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[TX, 2.3, word(K.gold)]} rotation={[0, Math.sin(o / 400) * 0.25, 0]} />}
      {inR(o, S[1], S[2]) && o >= K.teal && <Word3D text="TEAL??" size={0.75} face={TEAL} side={TEAL_D} position={[TX, 2.3, word(K.teal)]} rotation={[0, Math.sin(o / 400) * 0.25, 0.05]} />}
      {inR(o, K.josh, S[4]) && <>
        <Word3D text="JOSH ALLEN?!" size={0.44} face="#ffffff" side="#00338D" position={[TX, 2.35, word(K.josh)]} />
        <Football3D position={[-4 + 9.5 * ez(o, K.josh - 100, 1100), 2.6 - 1.6 * ez(o, K.josh - 100, 1100), 1.2]} rotation={[(o - K.josh) / 60, 0.3, 0.25]} />
      </>}
      {inR(o, K.fire - 120, S[5]) && <Flames3D o={o} position={[CX, -1.1, 0.4]} scale={0.95 * sp(o, K.fire - 120, 10, 220)} />}
      {inR(o, K.rookie, S[6]) && <Word3D text="ROOKIE CARD" size={0.46} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[TX, 2.35, word(K.rookie)]} />}
      {inR(o, K.joshAllen, K.real - 100) && <XMark3D o={o} at={K.joshAllen} position={[CX, 0.45, 0.5]} scale={0.75} />}
      {inR(o, K.notRookie, K.real) && <Word3D text="NOT THAT ONE" size={0.44} face="#ffffff" side="#5c0a0d" position={[TX, 2.35, word(K.notRookie)]} />}
      {inR(o, K.real, K.before) && <>
        <Word3D text="THE OTHER" size={0.36} position={[TX, 2.62, word(K.real)]} />
        <Word3D text="JOSH ALLEN" size={0.5} face={TEAL} side={TEAL_D} position={[TX, 2.0, word(K.real + 150)]} rotation={[0, Math.sin(o / 400) * 0.2, 0]} />
        <Confetti3D o={o} at={K.real + 80} position={[CX, 0.8, 0.6]} colors={[GOLD, TEAL, '#ffffff']} />
      </>}
      {o >= K.before && <>
        <Word3D text="JOSH" size={0.46} position={[TX, 2.6, 0]} scale={sp(o, K.before, 10, 220)} />
        <Word3D text="ALLEN" size={0.5} position={[TX + 0.8 * ez(o, K.changed, 300), 1.95, 0]} scale={sp(o, K.before + 100, 10, 220)} />
        {o >= K.changed && <Word3D text="HINES-" size={0.5} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[TX - 0.95, 1.95 + (1 - sp(o, K.changed, 8, 240)) * 4, 0.2]} />}
      </>}
    </Rig>
  </ThreeCanvas>;
};
