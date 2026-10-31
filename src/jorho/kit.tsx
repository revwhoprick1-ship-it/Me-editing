// "Jorho" style v2 (vault/02 Style Guide/Jorho style.md): measured frame by frame from the four reference videos
// (Backyard Breaks Daily Trevor Shorts, 30 fps). Every number below is a measurement, not a guess:
// - layout: black frame, video box y 417-1494 (centred), Montserrat Bold top line sitting right on the box, 💀 last
// - intro: the box opens from 700 to 1077 px tall over 24 frames while the footage clears from blown-out + blurred
// - captions: one word, Montserrat, yellow/cyan/green/white, 2-frame horizontal smear on entry, stays to the next word
// - white strobe: an 11-frame blow-out preset with a 1-frame dip where the shot changes
// - green (167,234,4) and red (244,3,5) tints at 62 % (3 frames in, 3 held, 3 out)
// - cut-out photo: lands huge + blurred + yellow-washed under a green tint, settles in 10 frames, leaves on a strobe
import type {ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {MONT} from '../e3/bars';
import {FPS, W, clamp, type TL} from '../e3/kit';

export const BOX_TOP = 417;
export const BOX_BOTTOM = 1494;
export const BOX_H = BOX_BOTTOM - BOX_TOP;
export const JORHO = {yellow: '#F9FC35', cyan: '#21F5E6', green: '#58EE28', white: '#FFFFFF'};
export const fr = (o: number) => Math.round((o * FPS) / 1000);
const msOf = (n: number) => (n * 1000) / FPS;

// ---- layout + intro reveal -----------------------------------------------------------------------------------
const INTRO_F = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const INTRO_TOP = [609, 573, 537, 504, 474, 450, 432, 420, BOX_TOP];
const INTRO_BOT = [1308, 1341, 1377, 1410, 1434, 1458, 1479, 1491, BOX_BOTTOM];
export const introFilter = (o: number) => {
  const f = fr(o);
  if (f > 18) return '';
  const blur = interpolate(f, [0, 6, 12, 18], [26, 14, 5, 0], clamp);
  const bright = interpolate(f, [0, 4, 10, 18], [1.9, 1.45, 1.15, 1], clamp);
  return `blur(${blur}px) brightness(${bright}) contrast(${2 - bright * 0.9 > 0.6 ? 2 - bright * 0.9 : 0.6})`;
};
export const Frame = ({o, top, children, over}: {o: number; top: string; children: ReactNode; over?: ReactNode}) => {
  const f = fr(o);
  const t = interpolate(f, INTRO_F, INTRO_TOP, clamp);
  const b = interpolate(f, INTRO_F, INTRO_BOT, clamp);
  const smear = f < 16 ? interpolate(f, [0, 16], [70, 0], clamp) : 0;
  return <AbsoluteFill style={{background: 'black'}}>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: W, height: BOX_H, overflow: 'hidden', clipPath: `inset(${t - BOX_TOP}px 0 ${BOX_BOTTOM - b}px 0)`}}>
      <AbsoluteFill style={{transform: f < 19 ? `translateX(${smear}px) scale(1.12)` : undefined, filter: introFilter(o) || undefined}}>{children}</AbsoluteFill>
    </div>
    <div style={{position: 'absolute', left: 0, width: W, bottom: 1920 - t + 3, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 700, fontSize: 58, lineHeight: '65px', color: 'white', textAlign: 'center', maxWidth: 900}}>
        {top}<Img src={staticFile('emoji-ios/1f480.png')} style={{width: 50, height: 50, verticalAlign: '-6px', marginLeft: 4}} />
      </div>
    </div>
    {over}
  </AbsoluteFill>;
};

// ---- one-word captions ---------------------------------------------------------------------------------------
export type Word = {text: string; at: number; color: string};
const PAL = [JORHO.yellow, JORHO.cyan, JORHO.green, JORHO.white];
const hash = (s: string, i: number) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7 + i * 13);
export const wordsFrom = (raw: {text: string; startMs: number}[], tl: TL, fix: Record<string, string> = {}, colors: Record<string, string> = {}): Word[] => {
  const out: Word[] = [];
  raw.forEach((w) => {
    if (!tl.segs.some(([x, y]) => w.startMs >= x && w.startMs < y)) return; // word was cut
    const bare = w.text.trim().replace(/^[-]+|[.,!?]+$/g, '');
    const text = fix[bare] ?? bare;
    if (!text) return;
    out.push({text, at: tl.out(w.startMs), color: colors[text] ?? PAL[hash(text, out.length) % PAL.length]});
  });
  return out;
};
// the word stays until the next one (or 1.2 s of silence); first 2 frames are a horizontal smear
export const OneWord = ({o, words, y}: {o: number; words: Word[]; y: number}) => {
  let i = -1;
  words.forEach((w, j) => { if (o >= w.at) i = j; });
  if (i < 0) return null;
  const w = words[i];
  if (o > (words[i + 1]?.at ?? Infinity) || o > w.at + 1200) return null;
  const k = fr(o) - fr(w.at);
  const smear = k < 2 ? {transform: `scaleX(${k === 0 ? 1.35 : 1.15})`, filter: `blur(${k === 0 ? 5 : 2.5}px)`, opacity: 0.85} : {};
  return <div style={{position: 'absolute', left: 0, width: W, top: y - 40, textAlign: 'center', ...smear}}>
    <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: w.color, WebkitTextStroke: '5px #111', paintOrder: 'stroke fill',
      textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{w.text}</span>
  </div>;
};

// ---- white strobe: 11-frame blow-out preset; put the shot change on frame 6 (the dip) ---------------------------
const STROBE = [0.6, 0.45, 0.7, 0.85, 0.85, 0.85, -0.15, 0.95, 1, 1, 0.95];
export const STROBE_CUT = msOf(6); // ms after the strobe starts where the next shot should begin
export const strobe = (o: number, at: number[]) => {
  const k = at.map((t) => STROBE[fr(o) - fr(t)]).find((x) => x !== undefined);
  if (k === undefined) return '';
  return k < 0 ? 'brightness(0.85)' : `brightness(${1 + 1.5 * k}) contrast(${1 + 0.55 * k}) saturate(${1 - 0.25 * k})`;
};

// ---- colour tints ---------------------------------------------------------------------------------------------
const TINT = [0.21, 0.42, 0.62, 0.62, 0.62, 0.53, 0.35, 0.17];
export const GREEN = 'rgb(167,234,4)';
export const RED = 'rgb(244,3,5)';
export const Tints = ({o, list}: {o: number; list: [number, string][]}) => {
  const hit = list.map(([t, c]) => [TINT[fr(o) - fr(t)], c] as const).find(([a]) => a !== undefined);
  return hit ? <AbsoluteFill style={{background: hit[1], opacity: hit[0], pointerEvents: 'none'}} /> : null;
};

// ---- cut-out photo ---------------------------------------------------------------------------------------------
// lands at 1.5x, blurred and yellow-washed, settles in 10 frames to a yellow-orange outline; exits on a strobe
const EXIT = [1, 0, 1, 0, 0, 1, 0, 0];
export const Cutout = ({o, file, from, to, x, h}: {o: number; file: string; from: number; to: number; x: number; h: number}) => {
  const k = fr(o) - fr(from);
  const e = fr(o) - fr(to);
  if (k < 0 || e >= EXIT.length || (e >= 0 && !EXIT[e])) return null;
  const p = interpolate(k, [0, 10], [0, 1], {...clamp, easing: (v) => 1 - (1 - v) ** 3});
  const slide = e >= 0 ? e * 18 : 0;
  const rim = '#FFB400';
  const outline = `drop-shadow(4px 0 0 ${rim}) drop-shadow(-4px 0 0 ${rim}) drop-shadow(0 4px 0 ${rim}) drop-shadow(0 -4px 0 ${rim})`;
  return <div style={{position: 'absolute', left: x + slide, bottom: 0, height: h, transform: `scale(${1.5 - 0.5 * p})`, transformOrigin: '50% 100%',
    filter: `${outline} blur(${(1 - p) * 10}px)`}}>
    <Img src={staticFile(`img/jorho/${file}`)} style={{height: '100%'}} />
    {p < 1 && <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: 0, top: 0, height: '100%',
      filter: 'sepia(1) saturate(9) hue-rotate(8deg) brightness(1.5)', opacity: 1 - p}} />}
  </div>;
};
