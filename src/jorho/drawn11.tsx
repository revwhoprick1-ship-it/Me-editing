// Jorho v11 (user, 2026-11-01): "try adding 2d animations that actually show 2d drawings and animated, make it match the
// style". Free unDraw illustrations (cdn.undraw.co, recoloured #6c63ff → Jaguars teal, converted to JSON by the snippet
// in vault v11) are rebuilt as React SVG so every shape can animate: pieces assemble with a stagger, the drawing floats,
// strips of a drawing bounce (fans jumping), the phone screen gets a live scrolling feed. Flat v9 style around it.
import {Img, interpolate, staticFile} from 'remotion';
import {F9, Fill, Letters, Pill, T, Wipe, abs, ez, io, on, sp} from './flat9';
import socialJ from './undraw/social-media-interactions.json';
import feedJ from './undraw/mobile-feed.json';
import questionsJ from './undraw/questions.json';
import videoJ from './undraw/video-streaming.json';
import happyJ from './undraw/happy.json';
import fansJ from './undraw/fans.json';
import gamedayJ from './undraw/game-day.json';

type DJ = {viewBox: string; els: [string, Record<string, string>][]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// an unDraw drawing that assembles piece by piece (each shape pops from its own centre), then floats
const Drawing = ({j, o, at, x, y, w, stagger = 18, chunk = 1, hide = [], float = 8, clip, dy = 0}: {j: DJ; o: number; at: number; x: number; y: number; w: number;
  stagger?: number; chunk?: number; hide?: number[]; float?: number; clip?: [number, number]; dy?: number}) => {
  const [, , vw, vh] = j.viewBox.split(' ').map(Number);
  const h = (w * vh) / vw;
  return <svg viewBox={j.viewBox} width={w} height={h} style={{...abs(x, y + Math.sin((o - at) / 520) * float + dy), overflow: 'visible',
    clipPath: clip ? `inset(0 ${(1 - clip[1]) * 100}% 0 ${clip[0] * 100}%)` : undefined}}>
    {j.els.map(([tag, a], i) => {
      if (hide.includes(i)) return null;
      const p = sp(o, at + Math.floor(i / chunk) * stagger, 13, 230);
      if (p <= 0.001) return null;
      const Tag = tag as 'path';
      const {transform, ...rest} = a; // a CSS transform would override the SVG transform attribute: keep it on a wrapper
      const el = <Tag {...rest} style={{transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${p})`}} />;
      return transform ? <g key={i} transform={transform}>{el}</g> : <g key={i}>{el}</g>;
    })}
  </svg>;
};

export type DrawnK = {S: number[]; labels: number; follow: number; algo: number; mgD: number; realD: number; second: number; funny: number; jax: number; games: number; end: number};
export const DrawnTT = ({o, K}: {o: number; K: DrawnK}) => {
  const S = K.S;
  const real = o < S[1] + 900 || on(o, K.realD, S[4]);
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    {o < S[1] && <Labels o={o} K={K} />}
    {!real && <>
      {on(o, S[1] + 900, S[2]) && <Follow o={o} K={K} />}
      {on(o, S[2], S[3]) && <Feed o={o} K={K} />}
      {on(o, S[3], K.realD) && <First o={o} K={K} />}
      {on(o, S[4], S[5]) && <Second o={o} K={K} />}
      {on(o, S[5], S[6]) && <Funny o={o} K={K} />}
      {on(o, S[6], S[7]) && <Fans o={o} K={K} />}
      {o >= S[7] && <Games o={o} K={K} />}
    </>}
    {on(o, K.realD, S[4]) && <Pill o={o} at={K.realD + 900} text="“THESE GUYS ARE WHACKED”" x={540} y={110} bg={F9.INK} size={36} />}
  </div>;
};
type P = {o: number; K: DrawnK};
// opening: who's who (context in the first second)
const Labels = ({o, K}: P) => <>
  <Pill o={o} at={K.labels} text="TRAVELING TREVOR" x={265} y={120} bg={F9.TEAL} size={34} />
  <Pill o={o} at={K.labels + 350} text="THE REAL TREVOR" x={800} y={120} bg={F9.INK} size={34} />
  {[[265, K.labels], [800, K.labels + 350]].map(([x, at], i) => { const p = ez(o, at + 150, 300); return <div key={i} style={abs(x, 185 + 20 * p, {width: 6, height: 60 * p, borderRadius: 3, background: i ? F9.INK : F9.TEAL})} />; })}
</>;
// "I see the videos because I follow you guys": person with phone, likes/hearts popping
const Follow = ({o, K}: P) => {
  const a = K.S[1] + 900;
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} x={540} y={400} />
    <Drawing j={socialJ as DJ} o={o} at={a} x={500} y={360} w={520} stagger={22} />
    <Pill o={o} at={K.follow} text="HE FOLLOWS THEM" x={720} y={600} bg={F9.TEAL} size={40} icon="1f440" />
  </>;
};
// "they were just in my algorithm on Instagram": drawn phone, live feed scrolling inside the screen
const Feed = ({o, K}: P) => {
  const a = K.S[2], W = 620, s = W / 768; // drawing width; viewBox 768 wide
  const x0 = 360 - W / 2, y0 = 380 - (728.858 * s) / 2; // drawing top-left on screen
  const scr = {x: x0 + 149 * s, y: y0 + 128 * s, w: (421 - 149) * s, h: (620 - 128) * s};
  const scroll = interpolate(o, [a + 400, K.algo + 200], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const cards = ['', '', 'tt', '', ''];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} x={360} y={380} />
    <Drawing j={feedJ as DJ} o={o} at={a} x={360} y={380} w={W} stagger={20} hide={[2, 3, 4, 5, 6, 7, 8]} />
    <div style={{position: 'absolute', left: scr.x, top: scr.y, width: scr.w, height: scr.h, overflow: 'hidden', borderRadius: 10, opacity: ez(o, a + 250, 300)}}>
      <div style={{transform: `translateY(${-scroll * 330}px)`}}>
        {cards.map((c, i) => <div key={i} style={{margin: 8, height: 150, borderRadius: 14, background: c ? '#fff' : '#e6e6e6', boxShadow: c ? '0 6px 16px rgba(0,0,0,.18)' : 'none', overflow: 'hidden',
          outline: c && o > K.algo ? `4px solid ${F9.TEAL}` : 'none'}}>
          {c && <><Img src={staticFile('img/jorho/tt_thumb.jpg')} style={{width: '100%', height: 108, objectFit: 'cover'}} /><div style={{...T({fontSize: 18}), padding: '6px 8px'}}>Traveling Trevors 🔥</div></>}
        </div>)}
      </div>
    </div>
    <Pill o={o} at={K.algo} text="IN HIS ALGORITHM" x={760} y={620} bg={F9.TEAL} size={38} icon="1f4f1" />
  </>;
};
// "I saw the first one, I didn't know what to think": the big drawn question mark wobbles
const First = ({o, K}: P) => {
  const a = K.S[3];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} />
    <Pill o={o} at={a + 100} text="VIDEO #1" x={540} y={90} bg={F9.BG} fg={F9.INK} size={36} />
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${Math.sin((o - a) / 240) * 2.5}deg)`, transformOrigin: '540px 420px'}}>
      <Drawing j={questionsJ as DJ} o={o} at={a + 150} x={470} y={400} w={680} stagger={22} />
    </div>
  </>;
};
// "then I saw the second one": video drawing with a play button pressed
const Second = ({o, K}: P) => {
  const a = K.S[4];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 150} c={F9.TEAL} x={540} y={380} d={420} /><Wipe o={o} at={a + 120} c={F9.BG} x={540} y={380} d={420} />
    <Pill o={o} at={a + 250} text="VIDEO #2" x={540} y={90} bg={F9.TEAL} size={36} />
    <Drawing j={videoJ as DJ} o={o} at={a + 200} x={540} y={410} w={700} stagger={14} />
  </>;
};
// "these guys are pretty funny": the jumping guy bounces, laughing emoji, PRETTY FUNNY
const Funny = ({o, K}: P) => {
  const a = K.S[5];
  const hop = Math.abs(Math.sin((o - a) / 230)) * 40;
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} x={300} y={400} />
    <Drawing j={happyJ as DJ} o={o} at={a} x={300} y={400} w={300} stagger={12} float={0} dy={-hop} />
    <Letters o={o} at={K.funny - 150} text="PRETTY" size={92} color={F9.INK} x={720} y={300} gap={0.02} />
    <Letters o={o} at={K.funny + 100} text="FUNNY" size={110} color={F9.TEAL} x={720} y={420} gap={0.02} />
    <Img src={staticFile('emoji-ios/1f602.png')} style={abs(860, 560, {width: 130 * sp(o, K.funny + 300, 10, 220), transform: `translate(-50%,-50%) rotate(${Math.sin(o / 120) * 10}deg)`})} />
  </>;
};
// "we need more Jax fans": the three fans (teal jerseys) jump one after another
const Fans = ({o, K}: P) => {
  const a = K.S[6];
  const strips: [number, number][] = [[0, 0.36], [0.36, 0.62], [0.62, 1]];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} />
    {strips.map((c, i) => <Drawing key={i} j={fansJ as DJ} o={o} at={a} x={540} y={300} w={520} stagger={14} float={0} clip={c}
      dy={-Math.max(0, Math.sin((o - a - 300) / 170 - i * 1.1)) * 38 * ez(o, a + 300, 200)} />)}
    <Letters o={o} at={K.jax - 200} text="MORE JAX FANS" size={88} color={F9.TEAL} x={540} y={630} gap={0.02} />
  </>;
};
// "you guys come to the games and you're pumped up": game-day couch fans, foam finger, confetti dots
const Games = ({o, K}: P) => {
  const a = K.S[7];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} x={540} y={380} />
    <Drawing j={gamedayJ as DJ} o={o} at={a} x={540} y={380} w={640} stagger={14} chunk={40} dy={-Math.abs(Math.sin((o - a) / 200)) * 14} float={0} />
    <Pill o={o} at={K.games - 150} text="PUMPED UP AT THE GAMES" x={540} y={680} bg={F9.TEAL} size={40} icon="1f525" />
    {Array.from({length: 24}).map((_, i) => {
      const t = (o - K.games - (i % 6) * 40) / 1000; if (t < 0) return null;
      const ang = -Math.PI / 2 + ((i / 24) - 0.5) * 2.4, v = 700 + (i % 3) * 120;
      return <div key={i} style={abs(540 + Math.cos(ang) * v * t, 300 + Math.sin(ang) * v * t + 900 * t * t, {width: 18, height: 18, borderRadius: i % 2 ? '50%' : 4,
        background: [F9.TEAL, F9.GOLD, F9.INK][i % 3], opacity: Math.max(0, 1 - t)})} />;
    })}
  </>;
};
export {io};
