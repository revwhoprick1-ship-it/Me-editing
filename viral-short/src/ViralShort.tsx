// "Guess the fake millionaire" v4 — LARPER cut. Style measured from the user's 5 reference Shorts (frame by frame + audio):
// black frame, video box y 417–1494 that opens over 24 frames from a blown-out, horizontally smeared image, Montserrat top
// line on the box ending in 💀, ONE word at a time (campaign rules: white, black outline), flat 62 % green / red tints,
// "white blow-out" exposure flash, motion-streak cut + tint, red curved arrow + red italic name label, italic CTA line,
// CapCut-style "Black flash 2" (pure black / hard B&W strobe — no grey). SFX = only the Drive sounds the refs use:
// flash (call-outs), rizz (tint hits), shock (hard cuts).
import {loadFont} from '@remotion/fonts';
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES, SceneConfig} from './clipData';
import TRACK from './ironTrack.json';

const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('res/Montserrat-Black.woff2'), weight: '800'});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BOX_TOP = 417, BOX_BOTTOM = 1494, BOX_H = BOX_BOTTOM - BOX_TOP, K = BOX_H / 1080;
const GREEN = 'rgb(167,234,4)', RED = 'rgb(244,3,5)';
const TOP = 'Only one guy spotted the LARPER';
const CTA = '*comment if you spotted the LARPER*';

// ---- timeline (composition frames) -------------------------------------------------------------------------------------
const START = SCENES.reduce<Record<string, number>>((m, s, i) => { m[s.id] = i ? m[SCENES[i - 1].id] + SCENES[i - 1].durationInFrames : 0; return m; }, {});
const END = START.fairplay + SCENES[SCENES.length - 1].durationInFrames;
const at = (id: string, word: string, nth = 0) => START[id] + SCENES.find((s) => s.id === id)!.words.filter((w) => w.word.toLowerCase().startsWith(word.toLowerCase()))[nth].startFrame;
const shot = (id: string, sec: number) => START[id] + Math.round((sec - SCENES.find((s) => s.id === id)!.videoStartSec) * 30);
const WILL = at('votes', 'will');

const TINTS: [number, string][] = [[START.iron, RED], [at('iron', 'iron'), GREEN], [at('votes', 'larper'), GREEN], [WILL, RED], [START.fairplay, GREEN], [at('fairplay', 'fair'), GREEN]];
const RIZZ = [at('iron', 'iron'), at('votes', 'larper'), at('fairplay', 'fair')];
const STREAKS = [START.iron, START.fairplay];               // motion-streak cuts (ref 2, 0:00.6)
const BLACK_FLASH = [START.reveal];                          // the reveal
const BLOWOUTS = [at('hook', 'yes'), at('reveal', 'yes')];   // ref 2, 0:02.4 "white blow-out"
const PUNCH = [at('hook', 'larp'), at('hook', 'yes'), at('iron', 'larp'), at('votes', 'larp'), at('votes', 'larper'), at('reveal', 'larp', 1), at('reveal', 'yes'), at('fairplay', 'fair'), at('fairplay', 'got')];
// red circle + arrow call-out on Iron Man, tracked per frame (scratchpad track_im.py: mask colour blob, smoothed) — source sec ranges
const CALL: [number, number][] = [[1548.16 + 2 / 30, 1550.12], [1511.28 + 2 / 30, 1512.4], [1546.08 + 2 / 30, 1547.04]];
const TK = Object.keys(TRACK).map(Number);
const track = (t: number) => { let best = -1, bd = 0.02; TK.forEach((k) => { const d = Math.abs(k - t); if (d < bd) { bd = d; best = k; } }); return best < 0 ? null : (TRACK as Record<string, number[]>)[best.toFixed(2)]; };
const CALL_SFX = SCENES.flatMap((s) => CALL.filter(([a]) => a >= s.videoStartSec && a < s.videoStartSec + s.durationInFrames / 30).map(([a]) => shot(s.id, a)));

// ---- measured presets ----------------------------------------------------------------------------------------------------
const TINT = [0.21, 0.42, 0.62, 0.62, 0.62, 0.53, 0.35, 0.17];
// Black flash 2: every frame is either PURE black or a hard-crushed B&W frame (the old version faded a 35 % black layer =
// grey). 0 = black, 1 = hard B&W, 2 = hard B&W inverted, 3 = colour + punch / shake settling
const BF = [0, 1, 0, 2, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3];
const near = (list: number[], f: number, len: number) => list.map((t) => f - t).find((d) => d >= 0 && d < len);
const bfAt = (f: number) => near(BLACK_FLASH, f, BF.length);
// white blow-out: 6 frames high-key, 1 normal, 3 frames clipped to white
const WB = ['brightness(1.75) contrast(1.45) saturate(1.25)', 'brightness(1.85) contrast(1.5) saturate(1.25)', 'brightness(1.85) contrast(1.5) saturate(1.2)',
  'brightness(1.8) contrast(1.45) saturate(1.2)', 'brightness(1.7) contrast(1.4) saturate(1.2)', 'brightness(1.6) contrast(1.35) saturate(1.15)', '',
  'brightness(2.6) contrast(2.4) saturate(1.4)', 'brightness(2.6) contrast(2.4) saturate(1.4)', 'brightness(2.4) contrast(2.2) saturate(1.3)'];

const hblurAt = (f: number) => {
  if (f < 16) return interpolate(f, [0, 16], [46, 0], clamp);                // intro smear
  const d = near(STREAKS, f, 4); return d === undefined ? 0 : [70, 48, 26, 8][d];
};
const filterAt = (f: number) => {
  const parts: string[] = ['saturate(1.3) contrast(1.06)'];                  // "saturate the video a bit"
  if (hblurAt(f) > 0) parts.push('url(#hblur)');
  if (f < 16) parts.push(`brightness(${interpolate(f, [0, 5, 10, 16], [2.5, 1.9, 1.3, 1], clamp)}) contrast(${interpolate(f, [0, 16], [0.75, 1], clamp)})`);
  const s = near(STREAKS, f, 4); if (s !== undefined) parts.push(`brightness(${[1.5, 1.3, 1.15, 1.05][s]})`);
  const w = near(BLOWOUTS, f, WB.length); if (w !== undefined && WB[w]) parts.push(WB[w]);
  const d = bfAt(f);
  if (d !== undefined && BF[d] === 1) parts.push('grayscale(1) contrast(3.2) brightness(0.95)');
  if (d !== undefined && BF[d] === 2) parts.push('grayscale(1) invert(1) contrast(3.2) brightness(0.95)');
  return parts.join(' ');
};
const zoomAt = (f: number) => {
  const p = near(PUNCH, f, 12), punch = p === undefined ? 1 : interpolate(p, [0, 2, 12], [1.13, 1.11, 1.0], clamp);
  const d = bfAt(f), bf = d !== undefined && d >= 5 ? interpolate(d, [5, 13], [1.16, 1], clamp) : 1;
  const sus = f >= WILL && f < START.reveal ? interpolate(f, [WILL, START.reveal], [1, 1.12]) : 1;   // slow push on "step forward"
  return Math.max(punch, bf) * sus;
};
const shakeAt = (f: number) => { const d = bfAt(f); if (d === 6) return 16; if (d === 7) return -12; if (d === 8) return 6; const p = near(PUNCH, f, 3); return p === 0 ? 8 : p === 1 ? -5 : 0; };

const Box: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 3, 6, 9, 12, 15, 18, 21, 24], [609, 573, 537, 504, 474, 450, 432, 420, BOX_TOP], clamp);
  const b = interpolate(f, [0, 3, 6, 9, 12, 15, 18, 21, 24], [1308, 1341, 1377, 1410, 1434, 1458, 1479, 1491, BOX_BOTTOM], clamp);
  const d = bfAt(f), black = d !== undefined && BF[d] === 0;
  return <>
    <svg width="0" height="0" style={{position: 'absolute'}}><filter id="hblur" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${hblurAt(f)} 1.5`} /></filter></svg>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: 1080, height: BOX_H, overflow: 'hidden', clipPath: `inset(${t - BOX_TOP}px 0 ${BOX_BOTTOM - b}px 0)`}}>
      <AbsoluteFill style={{transform: `translateX(${shakeAt(f)}px) scale(${(f < 19 ? interpolate(f, [0, 18], [1.14, 1], clamp) : 1) * zoomAt(f)})`, filter: filterAt(f)}}>{children}</AbsoluteFill>
      <Tint />
      {black && <AbsoluteFill style={{background: '#000'}} />}
    </div>
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - t + 3, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 700, fontSize: 58, lineHeight: '65px', color: 'white', textAlign: 'center', maxWidth: 900}}>
        {TOP}<Img src={staticFile('res/skull.png')} style={{width: 50, height: 50, verticalAlign: '-6px', marginLeft: 4}} />
      </div>
    </div>
  </>;
};
const Tint: React.FC = () => {
  const f = useCurrentFrame();
  const hit = TINTS.map(([t, c]) => [TINT[f - t], c] as const).find(([a]) => a !== undefined);
  return hit ? <AbsoluteFill style={{background: hit[1], opacity: hit[0], mixBlendMode: 'multiply'}} /> : null;
};

// one word at a time, white + black outline (campaign rule), 2-frame horizontal smear on entry
const ALL_WORDS = SCENES.flatMap((s) => s.words.map((w) => ({...w, at: START[s.id] + w.startFrame, end: START[s.id] + w.endFrame, sceneEnd: START[s.id] + s.durationInFrames})));
const OneWord: React.FC = () => {
  const f = useCurrentFrame();
  let i = -1; ALL_WORDS.forEach((w, j) => { if (f >= w.at) i = j; });
  if (i < 0) return null;
  const w = ALL_WORDS[i]; if (f >= w.sceneEnd || f > w.end + 20) return null;
  const k = f - w.at;
  const smear = k < 2 ? {transform: `scaleX(${k === 0 ? 1.35 : 1.15})`, filter: `blur(${k === 0 ? 5 : 2.5}px)`, opacity: 0.85} : {};
  return <div style={{position: 'absolute', left: 0, width: 1080, top: 1060, textAlign: 'center', ...smear}}>
    <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 68, color: '#FFFFFF', WebkitTextStroke: '7px #000', paintOrder: 'stroke fill', textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{w.word}</span>
  </div>;
};

// tracked call-out: arrow.png's circle (centre 749,1120 of 1920x1861, radius 435) sits on the mask; red italic label above/below
const Callout: React.FC<{x: number; y: number; r: number; k: number}> = ({x, y, r, k}) => {
  const W = (r / 435) * 1920, lab = y - r - 95 > 8 ? y - r - 95 : y + r + 12;
  return <>
    <Img src={staticFile('res/arrow.png')} style={{position: 'absolute', left: x - (W * 749) / 1920, top: y - (W * 1120) / 1920, width: W, opacity: k, transform: `scale(${0.75 + 0.25 * k})`, transformOrigin: `${(749 / 1920) * 100}% ${(1120 / 1861) * 100}%`,
      filter: 'brightness(0) saturate(100%) invert(18%) sepia(98%) saturate(7000%) hue-rotate(355deg) drop-shadow(0 0 3px #fff)'}} />
    <div style={{position: 'absolute', left: Math.min(1080 - 330, Math.max(10, x - 150)), top: lab, fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 50, color: '#FF2020', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill', opacity: k}}>*Iron Man*</div>
  </>;
};

const Scene: React.FC<{s: SceneConfig}> = ({s}) => {
  const {fps} = useVideoConfig(), f = useCurrentFrame();
  const cx = (s.crops ?? [[0, s.cropX]]).filter(([t]) => t <= f).pop()![1];
  const left = Math.min(0, Math.max(1080 - 1920 * K, 540 - cx * K)), t = s.videoStartSec + f / fps;
  const c = CALL.find(([a, b]) => t >= a && t < b), p = c && track(t);
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile('source.mp4')} startFrom={Math.round(s.videoStartSec * fps)} style={{position: 'absolute', top: 0, left, width: 1920 * K, height: BOX_H}} />
    {c && p && left + p[0] * K < 1000 && <Callout x={left + p[0] * K} y={p[1] * K} r={Math.max(48, p[2] * K * 1.35)} k={Math.min(1, (t - c[0]) * 6)} />}
  </AbsoluteFill>;
};

const sfx = (file: string, t: number, v: number) => ({file, at: Math.max(0, Math.round(t)), v});
const FX = [
  ...CALL_SFX.map((f) => sfx('flash.mp3', f, 0.4)),
  ...RIZZ.map((t) => sfx('rizz.mp3', t, 0.42)),
  ...BLACK_FLASH.map((b) => sfx('shock.mp3', b, 0.5)), sfx('shock.mp3', START.iron, 0.38),
];

export const ViralShort: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Box>
      <Series>{SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}><Scene s={s} /></Series.Sequence>)}</Series>
    </Box>
    <OneWord />
    <Sequence from={at('fairplay', 'like', 1)} durationInFrames={END - at('fairplay', 'like', 1)}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1250, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 42, color: '#fff', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill'}}>{CTA}</div>
    </Sequence>
    <Audio src={staticFile('res/goodbye.mp3')} volume={(f) => (f >= START.reveal && f < START.fairplay ? 0.16 : 0.09)} />
    {FX.map((x, i) => <Sequence key={i} from={x.at}><Audio src={staticFile(`res/${x.file}`)} volume={x.v} /></Sequence>)}
  </AbsoluteFill>
);
