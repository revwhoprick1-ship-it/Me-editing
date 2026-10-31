// "Jorho" style (vault/02 Style Guide/Jorho style.md), copied from four Backyard Breaks Trevor Shorts:
// black frame, the footage in a 1080x1075 box at y=420, a bold sentence-case meme line on the top bar ending in 💀,
// ONE spoken word at a time in Montserrat ExtraBold (yellow / cyan / green / white, black outline) low in the box,
// and three tricks only: a hard punch-in on whoever reacts, a blown-out exposure flash on the punchline, and a
// cut-out photo of whoever they're talking about popped over the table with an orange rim glow.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {MONT} from '../e3/bars';
import {W, clamp, ease, pop, type TL} from '../e3/kit';

export const BOX_TOP = 420;
export const BOX_H = 1075;
export const WORD_Y = BOX_TOP + Math.round(BOX_H * 0.76); // centre line of the spoken word
export const JORHO = {yellow: '#FFE81F', cyan: '#3FE6F5', green: '#7DFF3C', white: '#FFFFFF'};

export const Frame = ({top, children, over}: {top: string; children: ReactNode; over?: ReactNode}) => (
  <AbsoluteFill style={{background: 'black'}}>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: W, height: BOX_H, overflow: 'hidden'}}>{children}</div>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: BOX_TOP - 42, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 66, lineHeight: 1.13, color: 'white', textAlign: 'center', padding: '0 90px', letterSpacing: '-0.005em'}}>
        {top}<Img src={staticFile('emoji-ios/1f480.png')} style={{width: 64, height: 64, verticalAlign: '-9px', marginLeft: 6}} />
      </div>
    </div>
    {over}
  </AbsoluteFill>
);

// one word on screen at a time; colour per word from the word itself (stable, never two of the same in a row)
export type Word = {text: string; at: number; color?: string};
const ROT = [JORHO.yellow, JORHO.cyan, JORHO.green, JORHO.yellow, JORHO.white, JORHO.cyan];
export const wordsFrom = (raw: {text: string; startMs: number}[], tl: TL, fix: Record<string, string> = {}, colors: Record<string, string> = {}): Word[] => {
  const out: Word[] = [];
  raw.forEach((w) => {
    if (!tl.segs.some(([x, y]) => w.startMs >= x && w.startMs < y)) return; // word was cut
    const at = tl.out(w.startMs);
    const bare = w.text.trim().replace(/[.,!?]+$/g, '');
    const text = fix[bare] ?? bare;
    if (!text) return;
    out.push({text, at, color: colors[text]});
  });
  out.forEach((w, i) => { if (!w.color) w.color = ROT[(i * 7 + w.text.length) % ROT.length] === out[i - 1]?.color ? ROT[(i + 1) % ROT.length] : ROT[(i * 7 + w.text.length) % ROT.length]; });
  return out;
};
export const OneWord = ({o, words, hide = []}: {o: number; words: Word[]; hide?: [number, number][]}) => {
  if (hide.some(([a, b]) => o >= a && o < b)) return null;
  let i = -1;
  words.forEach((w, j) => { if (o >= w.at) i = j; });
  if (i < 0) return null;
  const w = words[i];
  const next = words[i + 1]?.at ?? w.at + 700;
  if (o > Math.min(next, w.at + 900)) return null;
  const s = 0.82 + 0.18 * pop(o, w.at, 13, 320);
  return <div style={{position: 'absolute', left: 0, width: W, top: WORD_Y - 50, textAlign: 'center', transform: `scale(${s})`}}>
    <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 70, color: w.color, WebkitTextStroke: '9px #000', paintOrder: 'stroke fill',
      textShadow: '0 5px 0 rgba(0,0,0,0.85), 0 8px 18px rgba(0,0,0,0.55)', letterSpacing: '-0.01em'}}>{w.text}</span>
  </div>;
};

// exposure flash: the frame blows out warm, then settles back over ~0.45 s (goes on the footage, not the bars)
export const exposure = (flashes: number[], o: number) => {
  const a = Math.max(0, ...flashes.map((t) => interpolate(o - t, [-30, 30, 450], [0, 1, 0], clamp)));
  return a ? `brightness(${1 + 0.85 * a}) contrast(${1 - 0.18 * a}) saturate(${1 + 0.5 * a}) sepia(${0.25 * a})` : '';
};

// a cut-out photo that pops up from the table edge with an orange rim, a little sway, and pops away
export const Cutout = ({o, file, from, to, x, h, style}: {o: number; file: string; from: number; to: number; x: number; h: number; style?: CSSProperties}) => {
  if (o < from || o >= to + 160) return null;
  const inP = pop(o, from, 11, 260);
  const outP = o > to ? ease(o, to, 160) : 0;
  const y = (1 - inP) * 420 + outP * 520;
  return <div style={{position: 'absolute', left: x, bottom: 0, height: h, transform: `translateY(${y}px) rotate(${Math.sin(o / 380) * 1.2}deg) scale(${0.9 + 0.1 * inP})`,
    transformOrigin: '50% 100%', filter: 'drop-shadow(0 0 3px #FF8A1E) drop-shadow(0 0 14px rgba(255,138,30,0.85)) drop-shadow(0 10px 24px rgba(0,0,0,0.5))', ...style}}>
    <Img src={staticFile(`img/jorho/${file}`)} style={{height: '100%'}} />
  </div>;
};
