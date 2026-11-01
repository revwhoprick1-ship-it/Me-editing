// "Goated pen" 3D scenes (t1). Front canvas sits over the footage; the behind canvas sits between the footage and
// Trevor's person matte so WHO? / PEYTON MANNING stand behind him.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {Ant3D, Card3D, Env, Football3D, GOLD, Lights, Pen3D, Phone3D, RED, Rig, TEAL_D, Word3D, ez, sp, useImage} from './three';

export type PenTimes = Record<'some' | 'hobby' | 'no' | 'anthony' | 'disrespect' | 'haven' | 'his' | 'auto' | 'looks' | 'ant' | 'A' | 'R' | 'thisBig' | 'noResp' | 'look' |
  'beautiful' | 'every' | 'goated' | 'pen' | 'you' | 'peyton' | 'manning' | 'big2' | 'nice' | 'signature', number> & {S: number[]; end: number};
const CAM = {fov: 35, position: [0, 0, 10] as [number, number, number]};
const BOX = [1080, 1077] as const;
const inR = (o: number, a: number, b: number) => o >= a && o < b;

// dark teal vignette under the 3D so it reads on top of busy footage
export const Dim = ({o, spans}: {o: number; spans: [number, number][]}) => {
  const a = Math.max(0, ...spans.map(([s, e]) => Math.min(ez(o, s, 200), 1 - ez(o, e - 200, 200))));
  return a > 0 ? <AbsoluteFill style={{opacity: a, background: 'radial-gradient(ellipse at 50% 42%, rgba(0,40,46,0.35) 0%, rgba(0,18,22,0.72) 70%, rgba(0,0,0,0.82) 100%)'}} /> : null;
};

const W_CARD = (h: number) => (h * 600) / 840;
// pen tip sits on the signature line of a card (card group position/rotation/height, progress 0..1)
const penOn = (cx: number, cy: number, h: number, p: number, box: [number, number, number, number]): [number, number, number] => {
  const w = W_CARD(h);
  const x = cx - w / 2 + ((box[0] + box[2] * p) / 600) * w;
  const y = cy + (0.5 - (box[1] - box[3] * 0.25) / 840) * h;
  return [x + 0.3, y + 0.72, 0.5];
};
const SIG_BOX: [number, number, number, number] = [60, 470, 480, 110];

export const PenFront = ({o, K}: {o: number; K: PenTimes}) => {
  const S = K.S;
  const imAR = useImage('img/j3d/card_ar.png'), imTL = useImage('img/j3d/card_trevor.png'), imPh = useImage('img/j3d/phone_peyton.png');
  const show = o < S[1] + 50 || inR(o, K.anthony - 100, S[4]) || inR(o, K.peyton - 200, K.peyton + 1100) || o >= S[6] - 100;
  if (!show) return null;
  // opener words
  const away = ez(o, K.no, 260) * 14;
  const pHob = sp(o, K.some, 12, 160), pPla = sp(o, K.hobby + 200, 12, 160), pNo = sp(o, K.no, 9, 220);
  // Richardson card
  const pAR = sp(o, K.anthony - 60, 13, 120);
  const bow = ez(o, K.disrespect, 180) - ez(o, K.disrespect + 380, 260);
  const arOut = ez(o, K.haven, 260);
  // ant zoom
  const pAnt = sp(o, K.his, 14, 140);
  const zt = ez(o, K.looks, 550);
  const z = 1 + 1.0 * zt;
  const sigL: [number, number] = [0.71, -0.66];
  const gpos: [number, number] = [(1 - zt) * 0 + zt * (0 - z * sigL[0]), (1 - zt) * 0.6 + zt * (0.4 - z * sigL[1])];
  const antOut = ez(o, K.A - 250, 250);
  const antX = sigL[0] - 1.7 * ez(o, K.ant + 100, 1600);
  // letters
  const shrink = ez(o, K.thisBig, 420);
  const fall = o > K.noResp ? ((o - K.noResp) / 1000) ** 2 * 18 : 0;
  // fan of cards
  const align = ez(o, K.every, 350);
  const fanOut = ez(o, K.goated - 120, 300);
  const cards = [-2.0, 0, 2.0].map((x, i) => {
    const p = sp(o, K.look + i * 120, 13, 150);
    return {x: x * (1 - 0.12 * align), y: -6 + p * 6.95 + fanOut * 7, rz: (1 - align) * [0.16, 0, -0.16][i] + fanOut * (i - 1) * 1.2, sig: ez(o, K.beautiful + i * 280, 650), p};
  });
  const writing = cards.findIndex((c, i) => o >= K.beautiful + i * 280 - 120 && c.sig < 1);
  const penIn = sp(o, K.beautiful - 350, 14, 150);
  const penPos = writing >= 0 ? penOn(cards[writing].x, cards[writing].y, 2.5, cards[writing].sig, SIG_BOX) : [2.6, 1.8, 0.8] as [number, number, number];
  // goated
  const pGo = sp(o, K.goated, 8, 200);
  const ang = (o - K.goated) / 260;
  // phone + ending
  const pPh = sp(o, K.S[6] - 60, 13, 120);
  const phOut = ez(o, K.S[7] - 60, 260);
  const buzz = Math.floor((o - K.S[6]) / 450) % 2 === 0 ? Math.sin(o / 14) * 0.035 : 0;
  const pEnd = sp(o, K.S[7] + 120, 13, 140), pBig = sp(o, K.big2, 9, 220);
  const endSig = ez(o, K.nice - 250, 900);
  return <ThreeCanvas width={BOX[0]} height={BOX[1]} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    <Rig o={o} hits={[K.no, K.A, K.R, K.noResp, K.goated, K.big2]}>
      {o < K.S[1] + 50 && <>
        {o >= K.some && <Word3D text="SOME" size={0.5} position={[-1.15, 2.2, away]} rotation={[0, (1 - pHob) * -1.6, 0.04]} scale={pHob} />}
        {o >= K.hobby + 200 && <Word3D text="PLAYERS" size={0.5} position={[-0.75, 1.5, away]} rotation={[0, (1 - pPla) * 1.6, -0.03]} scale={pPla} />}
        {o >= K.no && <Word3D text="NO RESPECT" size={0.62} face={RED} side="#5c0a0d" position={[-0.35, 1.7, (1 - pNo) * 9]} rotation={[0.05, Math.sin(o / 380) * 0.18, -0.07]} />}
      </>}
      {inR(o, K.anthony - 60, K.haven + 300) && <Card3D img={imAR} h={3.2} position={[arOut * 7, (1 - pAR) * 7 + 0.65, 0]}
        rotation={[bow * 0.55 + Math.sin(o / 500) * 0.04, (1 - pAR) * Math.PI * 2.5 + Math.sin(o / 700) * 0.12, -0.05]} />}
      {inR(o, K.haven, K.his + 100) && <Word3D text="?" size={0.9} face={GOLD} side="#7a5a12" metal={0.9} rough={0.25} position={[1.9, 1.7, 0]}
        rotation={[0, (o - K.haven) / 160, 0.2]} scale={sp(o, K.haven, 9, 260)} />}
      {inR(o, K.his, K.A) && <group position={[gpos[0] - antOut * 8, gpos[1] + (1 - pAnt) * -7, 0]} scale={z}>
        <Card3D img={imAR} h={3.2} sig="AR" sigP={ez(o, K.auto, 220)} sigBox={[470, 598, 60, 30]} sigSize={30} rotation={[0, (1 - zt) * -0.18, (1 - zt) * 0.05]} />
        {o >= K.ant && <Ant3D o={o} position={[antX, sigL[1] + 0.04 + Math.sin(o / 300) * 0.02, 0.12]} rotation={[0.25, Math.PI, 0]} scale={0.5 * sp(o, K.ant, 10, 240)} />}
      </group>}
      {inR(o, K.A, K.S[3]) && <>
        <Word3D text="A" size={2.3 * (1 - 0.88 * shrink)} position={[-1.3 + 1.1 * shrink, 0.75 - 0.35 * shrink - fall, (1 - sp(o, K.A, 8, 230)) * 9]} rotation={[fall * 0.2, 0.15, fall * 0.4]} />
        {o >= K.R && <Word3D text="R" size={2.3 * (1 - 0.88 * shrink)} position={[1.3 - 1.1 * shrink, 0.75 - 0.35 * shrink - fall * 1.2, (1 - sp(o, K.R, 8, 230)) * 9]} rotation={[fall * 0.3, -0.15, -fall * 0.5]} />}
        {o >= K.thisBig + 150 && <Ant3D o={o} position={[2.6 - 5.4 * ez(o, K.thisBig + 150, 1700), 0.25 - fall, 0.4]} rotation={[0.15, Math.PI, 0]} scale={1.4} />}
      </>}
      {inR(o, K.S[3], K.S[4]) && <>
        {cards.map((c, i) => o >= K.look + i * 120 && <Card3D key={i} img={imTL} h={2.5} sig="T. Lawrence" sigP={c.sig} sigBox={SIG_BOX}
          position={[c.x, c.y, i === 1 ? 0.15 : 0]} rotation={[0, Math.sin(o / 600 + i) * 0.12, c.rz]} />)}
        {o >= K.beautiful - 350 && o < K.goated && <Pen3D position={[penPos[0] + (1 - penIn) * 4, penPos[1] + (1 - penIn) * 3 + (writing >= 0 ? Math.sin(o / 40) * 0.03 : 0), penPos[2]]}
          rotation={[0.2, 0, 0.45]} scale={0.9} />}
        {o >= K.every + 150 && o < K.goated && <Word3D text="SAME EVERY TIME" size={0.3} face="#ffffff" side={GOLD} position={[0, -0.62, 0.3]} scale={sp(o, K.every + 150, 11, 220)} />}
        {o >= K.goated && <>
          <Word3D text="GOATED" size={1.05} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 1.3, (1 - pGo) * 9]} rotation={[0.05, Math.sin(o / 420) * 0.25, 0]} />
          {o >= K.pen && <Word3D text="PEN" size={0.62} face="#ffffff" side={TEAL_D} position={[0, 0.15, 0]} scale={sp(o, K.pen, 10, 240)} />}
          <Pen3D position={[Math.cos(ang) * 2.3, 1.0 + Math.sin(ang) * 0.5, Math.sin(ang) * 1.3]} rotation={[0, -ang, 0.5]} scale={0.8 * sp(o, K.goated + 150, 12, 200)} />
        </>}
      </>}
      {inR(o, K.peyton - 200, K.peyton + 1100) && <Football3D position={[-5 + 10 * ez(o, K.peyton - 200, 1250), 2.3 - 2.2 * ez(o, K.peyton - 200, 1250), 1]}
        rotation={[(o - K.peyton) / 60, 0.3, 0.25]} scale={0.95} />}
      {inR(o, K.S[6] - 100, K.S[7] + 200) && <Phone3D img={imPh} position={[buzz, (1 - pPh) * -8 + 0.45 + phOut * 9, 0]}
        rotation={[0.05, (1 - pPh) * Math.PI + Math.sin(o / 600) * 0.15, buzz * 2]} scale={0.95} />}
      {o >= K.S[7] + 100 && <>
        <Card3D img={imTL} h={2.6} sig="T. Lawrence" sigP={endSig} sigBox={SIG_BOX} position={[0, (1 - pEnd) * -7 + 0.3, 0]} rotation={[0, Math.sin(o / 500) * 0.2, 0.04]} />
        {o >= K.nice - 300 && <Pen3D position={penOn(0, 0.3, 2.6, endSig, SIG_BOX)} rotation={[0.2, 0, 0.45]} scale={0.9} />}
        {o >= K.big2 && <Word3D text="BIG DEAL" size={0.78} face={GOLD} side="#7a5a12" metal={1} rough={0.22} position={[0, 2.25, (1 - pBig) * 9]} rotation={[0.05, Math.sin(o / 400) * 0.2, 0]} />}
      </>}
    </Rig>
  </ThreeCanvas>;
};

export const PenBehind = ({o, K}: {o: number; K: PenTimes}) => {
  const S = K.S;
  if (!inR(o, K.you + 250, S[6])) return null;
  const pWho = sp(o, K.you + 300, 9, 200);
  const pP = sp(o, K.peyton, 12, 170), pM = sp(o, K.manning, 12, 170);
  return <ThreeCanvas width={BOX[0]} height={BOX[1]} camera={CAM} style={{position: 'absolute', inset: 0}}>
    <Env /><Lights />
    {o < S[5] && <Word3D text="WHO?" size={1.6} depth={0.5} position={[0, 1.05, (1 - pWho) * 8]} rotation={[0.08, Math.sin(o / 500) * 0.3, 0]} />}
    {o >= S[5] && <>
      {o >= K.peyton && <Word3D text="PEYTON" size={1.0} depth={0.4} face="#FB4F14" side="#6b2005" position={[-(1 - pP) * 9, 1.75, 0]} rotation={[0, (1 - pP) * -1.2 + Math.sin(o / 500) * 0.15, 0]} />}
      {o >= K.manning && <Word3D text="MANNING" size={1.0} depth={0.4} face="#ffffff" side="#0A2343" position={[(1 - pM) * 9, 0.5, 0]} rotation={[0, (1 - pM) * 1.2 + Math.sin(o / 520) * 0.15, 0]} />}
    </>}
  </ThreeCanvas>;
};
