// v29: redemption clip in the "clipper" style of ref XB-5FxyY4X8 (same moment, another channel): footage in the middle on a
// blurred, zoomed copy of itself, a persistent black title box, one small word at a time, plain reframing between speakers.
// Improvements over the ref (see vault v29): tighter story (repeats cut), a stakes title, bigger captions with money
// words coloured, a reaction insert on the $500 drop, plain-words labels, and a twist ending that loops instead of a
// black frame after "Yeah".
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Cam, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Seat, type Track} from '../e3/kit';
import words from '../plans/data/u3_redemptions.words.json';
import track from '../plans/data/u3_redemptions.seats.json';

loadFont({family: 'Oswald', url: staticFile('fonts/oswald-700-normal.woff2'), weight: '700'});

const FPS = 30;
const SRC = 'pod2/u3_redemptions.mp4';
export type Cut = [number, number] | [number, number, number];
export type Plan = {cuts: Cut[]; shots: [number, Seat, number?][]; title: string[]; labels: {a: number; b: number; text: string}[]; fx: (K: Record<string, number>) => ReturnType<typeof sfx>[];
  punch?: [number, number][]; capsOff?: [number, number][]};

const BOX_Y = 360, BOX_H = 1100;
const ease = (t: number) => 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;

export const makeClip = (plan: Plan) => {
  const tl = timeline(plan.cuts);
  const total = tl.total;
  const W = words.filter((w) => tl.segs.some(([a, b]) => w.startMs >= a && w.startMs < b))
    .map((w) => ({t: w.text.replace(/[.,!?]+$/, '').replace(/^20$/, '$20,000').replace(/^200$/, '$200?').replace(/^500$/, '$500'), at: tl.out(w.startMs)}))
    .filter((w) => w.t !== '000');
  const MONEY = /^\$|^bucks$|^expensive$|^sale$/i;
  const shotAt = (o: number) => plan.shots.reduce<[number, Seat, number?]>((s, x) => (o >= x[0] ? x : s), plan.shots[0]);
  const cfg = (who: Seat, wideX: number, box: [number, number], baseH: number, zoom?: () => number): CamCfg =>
    ({src: SRC, tl, track: track as unknown as Track, who: () => who, grade: 'contrast(1.06) saturate(1.08)', box, baseH, faceY: 0.42, wideX, zoom});

  const Comp = () => {
    const frame = useCurrentFrame();
    const o = (frame / FPS) * 1000;
    const [st, who, wx] = shotAt(o);
    const pz = (plan.punch ?? []).reduce((z, [a, b]) => (o >= a && o < b ? 1.18 : z), 1);
    const push = 1 + 0.05 * Math.min(1, (o - st) / 3000);
    // one word at a time, held until the next word (captions always on while people talk)
    let wi = -1; W.forEach((w, j) => { if (o >= w.at) wi = j; });
    const w = wi >= 0 && !(plan.capsOff ?? []).some(([a, b]) => o >= a && o < b) && o - W[wi].at < 1500 ? W[wi] : null;
    const k = w ? (o - w.at) / (1000 / FPS) : 0;
    const label = plan.labels.find((l) => o >= l.a && o < l.b);
    return <AbsoluteFill style={{background: '#000'}}>
      {/* blurred, zoomed copy of the footage behind everything */}
      <AbsoluteFill style={{filter: 'blur(34px) brightness(.62) saturate(1.2)', transform: 'scale(1.25)'}}>
        <Cam c={cfg('W', 760, [1080, 1920], 1080)} o={o} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: BOX_Y, width: 1080, height: BOX_H, overflow: 'hidden', boxShadow: '0 0 60px rgba(0,0,0,.55)'}}>
        <Cam c={cfg(who, wx ?? 760, [1080, BOX_H], 640, () => push * pz)} o={o} />
        {label && <div style={{position: 'absolute', left: 30, top: 28, background: 'rgba(0,0,0,.82)', color: '#fff', fontFamily: 'Oswald', fontWeight: 700, fontSize: 40, padding: '8px 18px',
          borderRadius: 10, borderLeft: '8px solid #FFD400', letterSpacing: 1, transform: `translateY(${(1 - ease((o - label.a) / 200)) * -20}px)`, opacity: ease((o - label.a) / 200)}}>{label.text}</div>}
      </div>
      {/* persistent title box (ref style) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0}}>
        {plan.title.map((line, i) => <div key={i} style={{background: '#000', color: '#fff', fontFamily: 'Oswald', fontWeight: 700, fontSize: 62, lineHeight: 1.12, padding: '4px 20px',
          borderRadius: i === 0 ? '14px 14px 0 0' : '0 0 14px 14px', textTransform: 'uppercase', letterSpacing: 1}}>{line}</div>)}
      </div>
      {w && <div style={{position: 'absolute', left: 0, right: 0, top: BOX_Y + BOX_H - 330, textAlign: 'center', transform: `scale(${k < 2 ? 1.18 - 0.09 * k : 1})`}}>
        <span style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 88, textTransform: 'uppercase', color: MONEY.test(w.t) ? '#FFD400' : '#fff', WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill', letterSpacing: 1}}>{w.t}</span>
      </div>}
      <SpeechTrack src={SRC} tl={tl} />
      <Music file="Monkeys_Spinning_Monkeys.mp3" songFrom={0} level={(t) => 0.06 * Math.min(1, (total - t) / 300)} />
      <SfxTrack list={plan.fx(Object.fromEntries([['total', total]]))} />
    </AbsoluteFill>;
  };
  return {Comp, total, tl};
};

// ---- v29a: first pass -------------------------------------------------------------------------------------------------
// pass 2: 'if you know' (11.30–11.85 s) cut
const CUTS29: Cut[] = [[0, 6000], [8080, 11290], [11850, 14300], [24320, 27000], [27000, 27900], [30000, 33950]];
const t29 = timeline(CUTS29);
const o29 = t29.out;
const S = t29.segOut;
const K = {k20: o29(1140), what: o29(1780), d500: o29(4240), bucks: o29(5080), redeem: o29(8840), because: o29(9660), onTime: o29(11860), react: o29(12940), see: o29(13840), dislike: o29(25940),
  really: o29(27080), most: o29(31640), sale: o29(32460), ever: o29(32780)};
export const RED29 = makeClip({
  cuts: CUTS29,
  // pass 2: the long host shot is split: host asks → two-shot on "because" → Trevor when the question is aimed at him →
  // two-shot for "I see" → host → Trevor's reaction on "dislike" → "Oh really?" → host's twist → two-shot to the loop
  shots: [[0, 'W', 640], [K.what, 'W', 1140], [K.d500 + 80, 'M'], [K.bucks, 'W', 640], [S[1], 'L'], [K.because, 'W', 640], [K.onTime, 'M'], [K.react, 'W', 640],
    [S[3], 'L'], [K.dislike, 'M'], [S[4], 'W', 1140], [S[5], 'L'], [K.ever, 'W', 640]],
  title: ['HE SAID THIS CARD IS', 'WORTH $20,000… 💀'],
  labels: [{a: 350, b: K.what, text: 'TREVOR LAWRENCE · NFL QB'}, {a: K.bucks, b: K.redeem, text: '…AND THEN THE TWIST 👀'}, {a: K.redeem, b: K.onTime - 100, text: 'REDEEM = MAIL IT IN FOR THE SIGNED CARD'},
    {a: K.onTime, b: S[3], text: '⏰ PLAYER SIGNS LATE = CARD COMES LATE'}, {a: K.most, b: 99999, text: 'HIS MOST EXPENSIVE SALE EVER 💰'}],
  punch: [[K.d500 + 80, K.bucks]],
  fx: () => [sfx('cha-ching', K.k20, 0.3), sfx('meme-trombone', K.d500, 0.4, 1300), sfx('jorho-pop', K.redeem, 0.25), sfx('jorho-pop', K.onTime, 0.25),
    sfx('meme-dundun', K.see - 150, 0.35, 900), sfx('cha-ching', K.sale, 0.35)],
});
export const Redeem29 = RED29.Comp;
export const RED29_MS = RED29.total;
