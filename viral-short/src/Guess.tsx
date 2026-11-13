// "Guess the fake millionaire" clip template (same look as ViralShort v4, data-driven): black frame, video box y 417–1494
// opening from a blown-out horizontal smear, Montserrat top line + 💀, one white word at a time (campaign rule), flat
// green/red tints, white blow-out, motion-streak cut, tracked red circle + italic name call-out, italic CTA, punch-ins.
// Black flash 2 v2: ~0.4 s of hard 2-frame steps (black / hard B&W / black / inverted / B&W) + 1.2× punch and shake —
// long enough to actually read on a phone (v1 was 6 single frames = 0.2 s and got lost).
import {loadFont} from '@remotion/fonts';
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import GEN from './edits.gen.json';
import HULK from './tracks/hulk.json';
import THANOS from './tracks/thanos.json';
import CLOWN from './tracks/clown.json';
import IRONMAN from './tracks/ironman.json';
import FOMO from './tracks/fomoeyes.json';
import type {SceneConfig} from './clipData';

const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('res/Montserrat-Black.woff2'), weight: '800'});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BOX_TOP = 417, BOX_BOTTOM = 1494, BOX_H = BOX_BOTTOM - BOX_TOP, K = BOX_H / 1080;
const GREEN = 'rgb(167,234,4)', RED = 'rgb(244,3,5)';
type Ref = [string, string?, number?];   // [scene] = scene start, [scene, word, nth] = that word
type Cfg = {top: string; cta: string; label: string; track: Record<string, number[]>; calls: [number, number][]; tints: [Ref, string][]; rizz: Ref[];
  punch: Ref[]; blowouts: Ref[]; blackFlash: Ref[]; streaks: Ref[]; music: number; loop?: boolean; ctaAt?: Ref};

export const EDITS: Record<string, Cfg> = {
  bowling: {top: 'Guess the LARPER millionaire', cta: '*real millionaire or LARP?*', label: '*Hulk*', track: HULK, music: 20,
    calls: [[357.40, 359.32], [351.32, 352.40]],
    tints: [[['main', 'bowling'], GREEN], [['main', 'lost'], RED], [['main', 'legit'], GREEN]], rizz: [['main', 'bowling'], ['main', 'legit']],
    punch: [['hook', '$100K'], ['hook', 'stupid'], ['main', 'dumbest'], ['main', 'bowling'], ['main', '$100K'], ['main', '$100K', 1], ['main', 'legit']],
    blowouts: [['hook', 'lost']], blackFlash: [['main']], streaks: [['main', 'bowling']]},
  coin400k: {top: 'Find the millionaire LARPER', cta: '*real millionaire or LARP?*', label: '*Thanos*', track: THANOS, music: 45,
    calls: [[290.96, 294.88], [286.40, 290.04], [296.24, 297.92]],
    tints: [[['main', '$400K'], GREEN], [['main', '98%'], RED], [['main', 'tuition'], GREEN]], rizz: [['main', '$400K'], ['main', 'tuition']],
    punch: [['hook', '$400K'], ['hook', '98%'], ['main', 'expensive'], ['main', '$400K'], ['main', '98%'], ['main', 'dox'], ['main', '$400K', 1], ['main', 'tuition']],
    blowouts: [['hook', '98%']], blackFlash: [['main']], streaks: [['main', '$400K']]},
  // loop edits: no intro animation, no end card, CTA mid-video — the last line runs straight back into the first (replays)
  mustangs: {top: 'Guess the millionaire LARPER', cta: '*would you buy two of the same car?*', label: '*Clown*', track: CLOWN, music: 95, loop: true, ctaAt: ['main', 'he'],
    calls: [[269.40, 272.92], [272.92, 273.84]],
    tints: [[['main', 'mustangs'], GREEN], [['main', 'laughing'], RED], [['main', 'two', 1], GREEN]], rizz: [['main', 'mustangs'], ['main', 'two', 1]],
    punch: [['main', 'two'], ['main', 'mustangs'], ['main', 'sell'], ['main', 'laughing'], ['main', 'sucks'], ['main', 'two', 1], ['main', 'car']],
    blowouts: [['main', 'sell']], blackFlash: [['main', 'why']], streaks: [['main', 'could']]},
  shiba: {top: 'Can you spot the millionaire LARPER?', cta: '*real or LARP?*', label: '*FOMO Eyes*', track: FOMO, music: 120, loop: true, ctaAt: ['main', 'how', 1],
    calls: [[389.98, 392.80], [394.12, 394.96], [397.64, 398.68], [400.08, 400.72]],
    tints: [[['main', 'shiba'], GREEN], [['main', 'larp'], RED], [['main', '$100k'], GREEN], [['main', 'exactly'], GREEN]], rizz: [['main', 'shiba'], ['main', '$100k']],
    punch: [['main', '100x'], ['main', 'larp'], ['main', '$100k'], ['main', '$1k'], ['main', '$100k', 1], ['main', 'difficult'], ['main', 'did', 1]],
    blowouts: [['main', 'exactly']], blackFlash: [['main', '100x']], streaks: [['main', 'hitting']]},
  icebath: {top: 'Which one is the millionaire LARPER?', cta: '*real or LARP?*', label: '*Iron Man*', track: IRONMAN, music: 150, loop: true, ctaAt: ['main', 'how'],
    calls: [[1362.24, 1364.44], [1367.64, 1369.84], [1371.04, 1371.92], [1373.76, 1376.30]],
    tints: [[['main', 'ice'], GREEN], [['main', 'larper'], RED], [['main', '35'], GREEN], [['main', 'two'], GREEN]], rizz: [['main', 'ice'], ['main', '35']],
    punch: [['main', 'ice'], ['main', 'larper'], ['main', 'ice', 2], ['main', '35'], ['main', '35', 1], ['main', 'two']],
    blowouts: [['main', 'larper']], blackFlash: [['main', '35']], streaks: [['main', 'so']]},
  sevenfigs: {top: 'Real millionaire or LARPER?', cta: '*real millionaire or LARP?*', label: '*Thanos*', track: THANOS, music: 70,
    calls: [[331.56, 332.96], [324.28, 325.28], [326.32, 331.56]],
    tints: [[['main', 'seven'], GREEN], [['main', 'exchanges'], RED], [['main', 'seven', 2], GREEN]], rizz: [['main', 'seven'], ['main', 'seven', 2]],
    punch: [['hook', 'seven'], ['hook', 'seven', 1], ['main', 'seven'], ['main', 'launched'], ['main', 'seven', 1], ['main', 'seven', 2], ['main', 'impressive']],
    blowouts: [['hook', 'seven']], blackFlash: [['main']], streaks: [['main', 'seven', 1]]},
};
export const framesOf = (id: string) => (GEN as unknown as Record<string, SceneConfig[]>)[id].reduce((a, s) => a + s.durationInFrames, 0);

const TINT = [0.21, 0.42, 0.62, 0.62, 0.62, 0.53, 0.35, 0.17];
// 0 black, 1 hard B&W, 2 inverted hard B&W, 3 colour (punch/shake settles) — 2 frames per step
const BF = [0, 0, 1, 1, 0, 0, 2, 2, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
const WB = ['brightness(1.75) contrast(1.45) saturate(1.25)', 'brightness(1.85) contrast(1.5) saturate(1.25)', 'brightness(1.85) contrast(1.5) saturate(1.2)',
  'brightness(1.8) contrast(1.45) saturate(1.2)', 'brightness(1.7) contrast(1.4) saturate(1.2)', 'brightness(1.6) contrast(1.35) saturate(1.15)', '',
  'brightness(2.6) contrast(2.4) saturate(1.4)', 'brightness(2.6) contrast(2.4) saturate(1.4)', 'brightness(2.4) contrast(2.2) saturate(1.3)'];
const near = (list: number[], f: number, len: number) => list.map((t) => f - t).find((d) => d >= 0 && d < len);

const Callout: React.FC<{x: number; y: number; r: number; k: number; label: string}> = ({x, y, r, k, label}) => {
  const W = (r / 435) * 1920, lab = y - r - 95 > 45 ? y - r - 95 : y + r + 12;
  return <>
    <Img src={staticFile('res/arrow.png')} style={{position: 'absolute', left: x - (W * 749) / 1920, top: y - (W * 1120) / 1920, width: W, opacity: k, transform: `scale(${0.75 + 0.25 * k})`, transformOrigin: `${(749 / 1920) * 100}% ${(1120 / 1861) * 100}%`,
      filter: 'brightness(0) saturate(100%) invert(18%) sepia(98%) saturate(7000%) hue-rotate(355deg) drop-shadow(0 0 3px #fff)'}} />
    <div style={{position: 'absolute', left: Math.min(1080 - 300, Math.max(10, x - 130)), top: lab, fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 50, color: '#FF2020', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill', opacity: k}}>{label}</div>
  </>;
};

export const Guess: React.FC<{edit: string}> = ({edit}) => {
  const cfg = EDITS[edit], SCENES = (GEN as unknown as Record<string, SceneConfig[]>)[edit];
  const START = SCENES.reduce<Record<string, number>>((m, s, i) => { m[s.id] = i ? m[SCENES[i - 1].id] + SCENES[i - 1].durationInFrames : 0; return m; }, {});
  const END = SCENES.reduce((a, s) => a + s.durationInFrames, 0);
  const at = ([id, word, nth = 0]: Ref) => {
    if (!word) return START[id];
    const w = SCENES.find((s) => s.id === id)!.words.filter((x) => x.word.toLowerCase().startsWith(word.toLowerCase()))[nth];
    if (!w) throw new Error(`no word ${id}/${word}/${nth}`);
    return START[id] + w.startFrame;
  };
  const TINTS = cfg.tints.map(([r, c]) => [at(r), c] as const), RIZZ = cfg.rizz.map(at), PUNCH = cfg.punch.map(at), BLOW = cfg.blowouts.map(at),
    BLACK = cfg.blackFlash.map(at), STREAKS = cfg.streaks.map(at);
  const TK = Object.keys(cfg.track).map(Number);
  const track = (t: number) => { let best = -1, bd = 0.02; TK.forEach((k) => { const d = Math.abs(k - t); if (d < bd) { bd = d; best = k; } }); return best < 0 ? null : cfg.track[best.toFixed(2)]; };
  const callStarts = SCENES.flatMap((s) => cfg.calls.filter(([a]) => a >= s.videoStartSec - 0.01 && a < s.videoStartSec + s.durationInFrames / 30).map(([a]) => START[s.id] + Math.max(0, Math.round((a - s.videoStartSec) * 30)) + 2));

  const f = useCurrentFrame(), {fps} = useVideoConfig();
  // Black flash 2 on EVERY music beat for the whole video (goodbye.mp3: 89.1 BPM, first beat 0.139 s — scratchpad beats.py):
  // beat frame = pure black, +1 = hard B&W, then a 1.08x punch that settles in 6 frames. Big 22-frame version on key moments.
  const BEAT = 0.6734, PH = 0.1393, mt = cfg.music + f / fps, bd = Math.floor(((mt - PH) % BEAT + BEAT) % BEAT * fps);
  const bf = near(BLACK, f, BF.length);
  const bfs = bf !== undefined ? BF[bf] : bd === 0 ? 0 : bd === 1 ? 1 : -1;
  const fi = cfg.loop ? 999 : f;   // loop edits skip the intro so the restart is invisible
  const hblur = fi < 16 ? interpolate(f, [0, 16], [46, 0], clamp) : (() => { const d = near(STREAKS, f, 4); return d === undefined ? 0 : [70, 48, 26, 8][d]; })();
  const filter = (() => {
    const p = ['saturate(1.3) contrast(1.06)'];
    if (hblur > 0) p.push('url(#hblur)');
    if (fi < 16) p.push(`brightness(${interpolate(f, [0, 5, 10, 16], [2.5, 1.9, 1.3, 1], clamp)}) contrast(${interpolate(f, [0, 16], [0.75, 1], clamp)})`);
    const s = near(STREAKS, f, 4); if (s !== undefined) p.push(`brightness(${[1.5, 1.3, 1.15, 1.05][s]})`);
    const w = near(BLOW, f, WB.length); if (w !== undefined && WB[w]) p.push(WB[w]);
    if (bfs === 1) p.push('grayscale(1) contrast(4) brightness(0.9)');
    if (bfs === 2) p.push('grayscale(1) invert(1) contrast(4) brightness(0.9)');
    return p.join(' ');
  })();
  const pu = near(PUNCH, f, 12), punch = pu === undefined ? 1 : interpolate(pu, [0, 2, 12], [1.13, 1.11, 1], clamp);
  const bfZoom = bf !== undefined ? (bf < 12 ? 1.2 : interpolate(bf, [12, BF.length], [1.2, 1], clamp)) : bd < 8 ? interpolate(bd, [1, 2, 8], [1.08, 1.08, 1], clamp) : 1;
  const zoom = (fi < 19 ? interpolate(f, [0, 18], [1.14, 1], clamp) : 1) * Math.max(punch, bfZoom);
  const shake = bf !== undefined ? [0, 0, 18, -14, 0, 0, -18, 14, 0, 12, -10, 8, 10, -8, 5, -3][bf] ?? 0 : pu === 0 ? 8 : pu === 1 ? -5 : bd === 1 ? 10 : bd === 2 ? -6 : 0;
  const top = interpolate(fi, [0, 3, 6, 9, 12, 15, 18, 21, 24], [609, 573, 537, 504, 474, 450, 432, 420, BOX_TOP], clamp);
  const bot = interpolate(fi, [0, 3, 6, 9, 12, 15, 18, 21, 24], [1308, 1341, 1377, 1410, 1434, 1458, 1479, 1491, BOX_BOTTOM], clamp);
  const tint = TINTS.map(([t, c]) => [TINT[f - t], c] as const).find(([a]) => a !== undefined);

  // current scene (for crop + tracked call-out)
  const si = SCENES.findIndex((s) => f >= START[s.id] && f < START[s.id] + s.durationInFrames), sc = SCENES[Math.max(0, si)], lf = f - START[sc.id];
  const cx = (sc.crops ?? [[0, sc.cropX]]).filter(([t]) => t <= lf).pop()![1];
  const left = Math.min(0, Math.max(1080 - 1920 * K, 540 - cx * K)), tSrc = sc.videoStartSec + lf / fps;
  const call = cfg.calls.find(([a, b]) => tSrc >= a + 1 / 30 && tSrc < b), cp = call && track(tSrc);

  // caption word
  const words = SCENES.flatMap((s) => s.words.map((w) => ({...w, at: START[s.id] + w.startFrame, end: START[s.id] + w.endFrame, sceneEnd: START[s.id] + s.durationInFrames})));
  let wi = -1; words.forEach((w, j) => { if (f >= w.at) wi = j; });
  const word = wi >= 0 && f < words[wi].sceneEnd && f <= words[wi].end + 20 ? words[wi] : null, wk = word ? f - word.at : 9;
  const ctaFrom = cfg.ctaAt ? at(cfg.ctaAt) : END - 75, ctaTo = cfg.ctaAt ? ctaFrom + 75 : END;

  const FX = [...callStarts.map((t) => ['flash.mp3', t, 0.4] as const), ...RIZZ.map((t) => ['rizz.mp3', t, 0.42] as const), ...BLACK.map((t) => ['shock.mp3', t, 0.55] as const)];
  return <AbsoluteFill style={{backgroundColor: '#000'}}>
    <svg width="0" height="0" style={{position: 'absolute'}}><filter id="hblur" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 1.5`} /></filter></svg>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: 1080, height: BOX_H, overflow: 'hidden', clipPath: `inset(${top - BOX_TOP}px 0 ${BOX_BOTTOM - bot}px 0)`}}>
      <AbsoluteFill style={{transform: `translateX(${shake}px) scale(${zoom})`, filter}}>
        <Series>{SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
          <OffthreadVideo src={staticFile('source.mp4')} startFrom={Math.round(s.videoStartSec * fps)} style={{position: 'absolute', top: 0, left: s === sc ? left : 0, width: 1920 * K, height: BOX_H}} />
        </Series.Sequence>)}</Series>
        <div style={{position: 'absolute', left: -60, right: -60, top: BOX_H * 0.865, height: BOX_H * 0.16, backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', background: 'rgba(0,0,0,0.08)'}} />
        {call && cp && left + cp[0] * K < 1000 && <Callout x={left + cp[0] * K} y={cp[1] * K} r={Math.max(48, cp[2] * K * 1.35)} k={Math.min(1, (tSrc - call[0]) * 6)} label={cfg.label} />}
      </AbsoluteFill>
      {tint && <AbsoluteFill style={{background: tint[1], opacity: tint[0], mixBlendMode: 'multiply'}} />}
      {bfs === 0 && <AbsoluteFill style={{background: '#000'}} />}
    </div>
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - top + 3, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 700, fontSize: 58, lineHeight: '65px', color: 'white', textAlign: 'center', maxWidth: 940}}>
        {cfg.top.split(' ').slice(0, -1).join(' ')} <span style={{whiteSpace: 'nowrap'}}>{cfg.top.split(' ').pop()}<Img src={staticFile('res/skull.png')} style={{width: 50, height: 50, verticalAlign: '-6px', marginLeft: 4}} /></span>
      </div>
    </div>
    {word && <div style={{position: 'absolute', left: 0, width: 1080, top: 1060, textAlign: 'center', ...(wk < 2 ? {transform: `scaleX(${wk === 0 ? 1.35 : 1.15})`, filter: `blur(${wk === 0 ? 5 : 2.5}px)`, opacity: 0.85} : {})}}>
      <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 68, color: '#FFFFFF', WebkitTextStroke: '7px #000', paintOrder: 'stroke fill', textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{word.word}</span>
    </div>}
    {f >= ctaFrom && f < ctaTo && <div style={{position: 'absolute', left: 0, width: 1080, top: 1250, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 42, color: '#fff', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill', opacity: Math.min(1, (f - ctaFrom) / 5)}}>{cfg.cta}</div>}
    <Audio src={staticFile('res/goodbye.mp3')} startFrom={cfg.music * fps} volume={0.09} />
    {FX.map(([file, t, v], i) => <Sequence key={i} from={Math.max(0, t)}><Audio src={staticFile(`res/${file}`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
