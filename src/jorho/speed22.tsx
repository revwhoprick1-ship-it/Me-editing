// v22: "W Speed edit be like" format (IShowSpeed Shorts) inside the Jorho frame. Coords are box-relative (1080 x BOX_H).
// Narrated action text (italic, in asterisks, glowing, typed letter by letter), then a freeze-frame slam:
// green flash + zoom-blur whip, gray, a pulsing emoji on the chest and a typed green label, sparkles at the end.
import {Img, random, staticFile} from 'remotion';
import {BOX_H} from './kit';

const FONT = 'Montserrat';
const FMS = 1000 / 30;
const glow = (c: string) => `0 0 10px ${c}cc, 0 0 26px ${c}88, 0 4px 10px rgba(0,0,0,0.55)`;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const COLORS = ['#FF3B3B', '#FFE14D', '#3BA7FF', '#3BFF5C'];

export type Act = [from: number, to: number, text: string];
// one action line at a time; a new colour per line; ~1 letter per frame
export const SpeedActions = ({o, acts, y = 0.5}: {o: number; acts: Act[]; y?: number}) => {
  const i = acts.findIndex(([a, b]) => o >= a && o < b);
  if (i < 0) return null;
  const [a, , text] = acts[i];
  const label = `*${text}*`;
  const n = Math.floor((o - a) / FMS) + 1;
  const typed = label.slice(0, n);
  const c = COLORS[i % COLORS.length];
  return <div style={{position: 'absolute', left: 0, right: 0, top: BOX_H * y, display: 'flex', justifyContent: 'center', padding: '0 50px'}}>
    <div style={{fontFamily: FONT, fontWeight: 800, fontStyle: 'italic', fontSize: 64, lineHeight: 1.12, textTransform: 'uppercase', textAlign: 'center', color: c, textShadow: glow(c)}}>
      {typed}<span style={{opacity: 0}}>{label.slice(typed.length)}</span>
    </div>
  </div>;
};
// keyboard SFX length for a line (matches the typing speed)
export const typeMs = (text: string) => (text.length + 2) * FMS;

// freeze-frame slam over [a, a + beats*beatMs)
export const SpeedSlam = ({o, a, beats, beatMs, text, emoji}: {o: number; a: number; beats: number; beatMs: number; text: string; emoji: string}) => {
  const t = o - a, dur = beats * beatMs;
  if (t < 0 || t >= dur) return null;
  const fr = t / FMS;
  const flash = fr < 2 ? 0.75 : clamp01(0.6 * (1 - (fr - 2) / 5));
  const whip = clamp01(1 - fr / 8);
  const gray = clamp01((fr - 2) / 8);
  const k = clamp01((fr - 3) / 6);
  const pop = k < 1 ? 1.25 * Math.sin(k * Math.PI / 2) - 0.25 * k * k : 1; // quick overshoot
  const inBeat = (t % beatMs) / FMS;
  const pulse = inBeat < 3 ? 1.12 - 0.04 * inBeat : 1;
  const label = `*${text}*`;
  const typed = label.slice(0, Math.max(0, Math.floor((fr - 6) / 2)));
  const green = '#3BFF5C';
  const sp = fr - (dur / FMS - 30);
  return <>
    <div style={{position: 'absolute', inset: 0, backdropFilter: `grayscale(${0.85 * gray}) brightness(${1 - 0.15 * gray}) blur(${whip * 14}px)`,
      background: `rgba(70,70,70,${0.25 * gray})`, transform: `scale(${1 + whip * 0.25})`}} />
    <div style={{position: 'absolute', inset: 0, background: green, opacity: flash, mixBlendMode: 'screen'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: BOX_H * 0.58, display: 'flex', justifyContent: 'center'}}>
      <Img src={staticFile(`emoji-ios/${emoji}.png`)} style={{width: 210, height: 210, transform: `scale(${Math.max(0, pop) * pulse})`,
        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5)) drop-shadow(0 10px 18px rgba(0,0,0,0.5))'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: BOX_H * 0.79, display: 'flex', justifyContent: 'center', padding: '0 40px'}}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontStyle: 'italic', fontSize: 84, lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', color: green, textShadow: glow(green)}}>
        {typed}<span style={{opacity: 0}}>{label.slice(typed.length)}</span>
      </div>
    </div>
    {sp >= 0 && <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, sp / 8)}}>
      {Array.from({length: 40}).map((_, i) => {
        const s = 4 + random(`ss${i}`) * 8;
        return <div key={i} style={{position: 'absolute', left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * BOX_H + sp * (2 + random(`sv${i}`) * 3),
          width: s, height: s, borderRadius: '50%', background: 'white', boxShadow: '0 0 12px white', opacity: 0.5 + 0.5 * Math.sin(sp / 3 + i)}} />;
      })}
    </div>}
  </>;
};
// punchy grade's vignette
export const Vignette = () => <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)'}} />;
