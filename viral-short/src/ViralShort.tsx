// "Guess the fake millionaire" v3 — the user's own editing style (Drive "video references": Backyard Breaks clipper
// Shorts, measured frame by frame in src/jorho/kit.tsx): black frame, video box y 417–1494 that opens over 24 frames
// from blown-out + blurred, Montserrat 58 px top line sitting on the box ending in 💀, ONE word at a time (yellow / cyan /
// green / white, 2-frame horizontal smear), 11-frame white strobe on the hits, 62 % green / red tints, red curved arrow +
// red italic name label on the person, + the Drive overlays (green flash, cash falling) and a CapCut-style "Black flash 2".
import {loadFont} from '@remotion/fonts';
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES, SceneConfig, WordTiming} from './clipData';

const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('res/Montserrat-Black.woff2'), weight: '800'});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BOX_TOP = 417, BOX_BOTTOM = 1494, BOX_H = BOX_BOTTOM - BOX_TOP, K = BOX_H / 1080;
const PAL = ['#F9FC35', '#21F5E6', '#58EE28', '#FFFFFF'];
const GREEN = 'rgb(167,234,4)', RED = 'rgb(244,3,5)';
const TOP = 'One of these crypto millionaires is a total fraud';

// timeline helpers (composition frames)
const START = SCENES.reduce<Record<string, number>>((m, s, i) => { m[s.id] = i ? m[SCENES[i - 1].id] + SCENES[i - 1].durationInFrames : 0; return m; }, {});
const wordAt = (id: string, word: string) => START[id] + (SCENES.find((s) => s.id === id)!.words.find((w) => w.word.toLowerCase().startsWith(word.toLowerCase()))?.startFrame ?? 0);
const FLASHES = SCENES.flatMap((s) => s.words.filter((w) => w.flash).map((w) => START[s.id] + w.startFrame));
const BLACK_FLASH = [START['step-forward'], START['yes-i-am'], START['fair-play']];
const TINTS: [number, string][] = [...FLASHES.map((f): [number, string] => [f, GREEN]), [wordAt('laughing', "don't"), RED], [wordAt('yes-i-am', 'yes'), RED], [wordAt('two-same-car', 'two'), RED]];
const STROBES = FLASHES.map((f) => f - 6); // shot change sits on the strobe's dip (frame 6)

// ---- measured presets (src/jorho/kit.tsx) --------------------------------------------------------------------------------
const STROBE = [0.6, 0.45, 0.7, 0.85, 0.85, 0.85, -0.15, 0.95, 1, 1, 0.95];
const TINT = [0.21, 0.42, 0.62, 0.62, 0.62, 0.53, 0.35, 0.17];
// CapCut "Black flash 2" (rebuilt): black–image–black strobe over 6 frames, image frames crushed (contrast/brightness) with
// a 1.14× punch-in + 1-frame shake, then the shot settles back to 1.0 over 8 frames
const BF = [1, 0, 1, 0.35, 0, 0];
const blackFlash = (f: number) => { const d = BLACK_FLASH.map((b) => f - b).find((x) => x >= 0 && x < 14); return d; };

const filterAt = (f: number) => {
  const parts: string[] = [];
  if (f <= 18) { const blur = interpolate(f, [0, 6, 12, 18], [26, 14, 5, 0], clamp), br = interpolate(f, [0, 4, 10, 18], [1.9, 1.45, 1.15, 1], clamp); parts.push(`blur(${blur}px) brightness(${br}) contrast(${Math.max(0.6, 2 - br * 0.9)})`); }
  const k = STROBES.map((t) => STROBE[f - t]).find((x) => x !== undefined);
  if (k !== undefined) parts.push(k < 0 ? 'brightness(0.85)' : `brightness(${1 + 1.5 * k}) contrast(${1 + 0.55 * k}) saturate(${1 - 0.25 * k})`);
  const d = blackFlash(f); if (d !== undefined && d < 6 && BF[d] < 1) parts.push('contrast(1.6) brightness(0.8) saturate(1.3)');
  return parts.join(' ');
};

const Box: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 3, 6, 9, 12, 15, 18, 21, 24], [609, 573, 537, 504, 474, 450, 432, 420, BOX_TOP], clamp);
  const b = interpolate(f, [0, 3, 6, 9, 12, 15, 18, 21, 24], [1308, 1341, 1377, 1410, 1434, 1458, 1479, 1491, BOX_BOTTOM], clamp);
  const smear = f < 16 ? interpolate(f, [0, 16], [70, 0], clamp) : 0;
  const d = blackFlash(f), punch = d !== undefined ? interpolate(d, [0, 5, 13], [1.14, 1.12, 1], clamp) : 1, shake = d === 2 ? 14 : d === 4 ? -10 : 0;
  return <>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: 1080, height: BOX_H, overflow: 'hidden', clipPath: `inset(${t - BOX_TOP}px 0 ${BOX_BOTTOM - b}px 0)`}}>
      <AbsoluteFill style={{transform: `translateX(${smear + shake}px) scale(${(f < 19 ? 1.12 : 1) * punch})`, filter: filterAt(f) || undefined}}>{children}</AbsoluteFill>
      <Tint />
      {d !== undefined && d < 6 && BF[d] > 0 && <AbsoluteFill style={{background: '#000', opacity: BF[d]}} />}
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

// one word, stays until the next, 2-frame horizontal smear on entry
const ALL_WORDS = SCENES.flatMap((s) => s.words.map((w, i) => ({...w, at: START[s.id] + w.startFrame, color: w.color === '#4ADE80' ? '#58EE28' : w.color === '#38BDF8' ? '#21F5E6' : PAL[(i * 7 + w.word.length) % PAL.length]})));
const OneWord: React.FC = () => {
  const f = useCurrentFrame();
  let i = -1; ALL_WORDS.forEach((w, j) => { if (f >= w.at) i = j; });
  if (i < 0) return null;
  const w = ALL_WORDS[i]; if (f - w.at > 36 && (ALL_WORDS[i + 1]?.at ?? 1e9) > f + 1 && f - (START[SCENES.find((s) => START[s.id] <= w.at && w.at < START[s.id] + s.durationInFrames)!.id]) > 9999) return null;
  const k = f - w.at;
  const smear = k < 2 ? {transform: `scaleX(${k === 0 ? 1.35 : 1.15})`, filter: `blur(${k === 0 ? 5 : 2.5}px)`, opacity: 0.85} : {};
  return <div style={{position: 'absolute', left: 0, width: 1080, top: 1170 - 40, textAlign: 'center', ...smear}}>
    <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: w.color, WebkitTextStroke: '5px #111', paintOrder: 'stroke fill', textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{w.word}</span>
  </div>;
};

// red curved arrow + red italic name label (the refs' "*Trevor Lawrence*" call-out)
const CALLOUT: Record<string, {x: number; y: number; from: number; label: string}> = {'ironman-m3': {x: 120, y: 120, from: 8, label: '*Iron Man*'}, 'yes-i-am': {x: 20, y: 110, from: 46, label: '*Iron Man*'}};
const Callout: React.FC<{c: {x: number; y: number; from: number; label: string}}> = ({c}) => {
  const f = useCurrentFrame(); if (f < c.from) return null;
  const k = Math.min(1, (f - c.from) / 5);
  return <>
    <Img src={staticFile('res/arrow.png')} style={{position: 'absolute', left: c.x + 240, top: c.y + 60, width: 260, opacity: k, transform: `rotate(${-20 + 4 * Math.sin(f / 5)}deg) scale(${0.7 + 0.3 * k})`,
      filter: 'brightness(0) saturate(100%) invert(18%) sepia(98%) saturate(7000%) hue-rotate(355deg) drop-shadow(0 0 3px #fff)'}} />
    <div style={{position: 'absolute', left: c.x, top: c.y, fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 50, color: '#FF2020', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill', opacity: k, transform: `scale(${0.7 + 0.3 * k})`}}>{c.label}</div>
  </>;
};

const Scene: React.FC<{s: SceneConfig}> = ({s}) => {
  const {fps} = useVideoConfig(), f = useCurrentFrame();
  const push = 1 + 0.03 * (f / s.durationInFrames);
  return <AbsoluteFill>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 45%'}}>
      <OffthreadVideo src={staticFile('source.mp4')} startFrom={Math.round(s.videoStartSec * fps)} style={{position: 'absolute', top: 0, left: 540 - s.cropX * K, width: 1920 * K, height: BOX_H}} />
    </div>
    {CALLOUT[s.id] && <Callout c={CALLOUT[s.id]} />}
  </AbsoluteFill>;
};

const sfx = (file: string, at: number, v: number) => ({file, at: Math.max(0, Math.round(at)), v});
const FX = [
  ...SCENES.slice(1).map((s) => sfx('pop.mp3', START[s.id], 0.12)),
  ...FLASHES.flatMap((f) => [sfx('hit.mp3', f, 0.5), sfx('flash.mp3', f - 6, 0.3)]),
  sfx('rizz.mp3', START['nothing-for-mom'] + 8, 0.45), sfx('riser.mp3', START['step-forward'] - 55, 0.4),
  ...BLACK_FLASH.map((b) => sfx('shock.mp3', b, 0.45)), sfx('flash.mp3', START['ironman-m3'] + 8, 0.3),
];
const OVERLAYS: {file: string; at: number}[] = [...FLASHES.map((f) => ({file: 'greenflash.mp4', at: f})), {file: 'cash.mp4', at: wordAt('clown-mustangs', 'mustangs') + 6}];

export const ViralShort: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Box>
      <Series>{SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}><Scene s={s} /></Series.Sequence>)}</Series>
      {OVERLAYS.map((x, i) => <Sequence key={i} from={x.at} durationInFrames={x.file === 'cash.mp4' ? 54 : 34}>
        <AbsoluteFill style={{mixBlendMode: 'screen'}}><OffthreadVideo src={staticFile(`res/${x.file}`)} volume={0.35} style={{width: 1080, height: BOX_H, objectFit: 'cover'}} /></AbsoluteFill>
      </Sequence>)}
    </Box>
    <OneWord />
    <Audio src={staticFile('res/goodbye.mp3')} volume={(f) => (f >= START['step-forward'] && f < START['fair-play'] ? 0.2 : 0.09)} />
    {FX.map((x, i) => <Sequence key={i} from={x.at}><Audio src={staticFile(`res/${x.file}`)} volume={x.v} /></Sequence>)}
  </AbsoluteFill>
);
