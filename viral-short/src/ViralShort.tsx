// "Guess the fake millionaire" edit in the reference style (refs: @Staroftheday / @MR.RankBoy shorts, storyboards only):
// black top band with a 2-line title, footage band cropped onto the speaker, one yellow word at a time, a lime flash +
// zoom punch on every money item (the source already carries its own car cut-outs and price tags), payoff = reveal.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES, SceneConfig, WordTiming} from './clipData';

const BAND_Y = 250, BAND_H = 1250, SRC_W = 1920, SRC_H = 1080, K = BAND_H / SRC_H; // source scaled to the band height

const Title: React.FC = () => (
  <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: 'Montserrat, Arial Black, sans-serif', fontWeight: 900,
    fontSize: 62, lineHeight: 1.12, color: '#fff', letterSpacing: -0.5}}>
    Guess the <span style={{color: '#FFE500'}}>fake</span><br />Millionaire? 😵
  </div>
);

const Word: React.FC<{words: WordTiming[]}> = ({words}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const w = words.find((x) => f >= x.startFrame && f < x.endFrame);
  if (!w) return null;
  const s = spring({frame: f - w.startFrame, fps, config: {damping: 13, stiffness: 280}});
  return <div style={{position: 'absolute', top: BAND_Y + BAND_H * 0.4, left: 0, right: 0, textAlign: 'center', fontFamily: 'Montserrat, Arial Black, sans-serif',
    fontWeight: 900, fontSize: 92, color: w.color ?? '#FFE500', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill',
    textShadow: '0 6px 18px rgba(0,0,0,.6)', transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`}}>{w.word}</div>;
};

const Scene: React.FC<{s: SceneConfig}> = ({s}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const fl = s.words.find((w) => w.flash);
  const d = fl ? f - fl.startFrame : -1;
  const flash = d >= 0 && d < 8 ? 1 - d / 8 : 0; // lime flash on the money word
  const punch = d >= 0 && d < 10 ? 0.07 * (1 - d / 10) : 0;
  const push = 1 + 0.035 * (f / s.durationInFrames); // every hold moves
  const vw = SRC_W * K, left = 540 - s.cropX * K;
  return <AbsoluteFill>
    <div style={{position: 'absolute', top: BAND_Y, left: 0, width: 1080, height: BAND_H, overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push + punch})`, transformOrigin: '50% 45%'}}>
        <OffthreadVideo src={staticFile('source.mp4')} startFrom={Math.round(s.videoStartSec * fps)} style={{position: 'absolute', top: 0, left, width: vw, height: SRC_H * K}} />
      </div>
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: '#7CFF3A', mixBlendMode: 'multiply', opacity: 0.85 * flash}} />}
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: '#B6FF5C', opacity: 0.25 * flash}} />}
      {d >= 0 && d < 3 && <Img src={staticFile('res/white.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9 - 0.3 * d}} />}
      {ARROW[s.id] && <Arrow at={ARROW[s.id]} />}
    </div>
    <Word words={s.words} />
  </AbsoluteFill>;
};

// circle-arrow overlay (editing resources): points at the fake (Iron Man) — foreshadowed on his M3 line, then the reveal
const ARROW: Record<string, {x: number; y: number; from: number}> = {'ironman-m3': {x: 200, y: 70, from: 20}, 'yes-i-am': {x: 40, y: 20, from: 46}};
const Arrow: React.FC<{at: {x: number; y: number; from: number}}> = ({at}) => {
  const f = useCurrentFrame(); if (f < at.from) return null;
  const k = Math.min(1, (f - at.from) / 6);
  return <Img src={staticFile('res/arrow.png')} style={{position: 'absolute', left: at.x, top: at.y, width: 560, transform: `scale(${0.6 + 0.4 * k}) rotate(${8 * Math.sin(f / 4)}deg)`, opacity: k, filter: 'brightness(0) saturate(100%) invert(18%) sepia(98%) saturate(7000%) hue-rotate(355deg) drop-shadow(0 0 6px #000) drop-shadow(0 0 2px #000)'}} />;
};
const START = SCENES.reduce<Record<string, number>>((m, s, i) => { m[s.id] = i ? m[SCENES[i - 1].id] + SCENES[i - 1].durationInFrames : 0; return m; }, {});
const sfx = (file: string, at: number, v: number) => ({file, at: Math.max(0, Math.round(at)), v});
const FX = [
  ...SCENES.slice(1).map((s) => sfx('pop', START[s.id], 0.18)),
  ...SCENES.flatMap((s) => s.words.filter((w) => w.flash).flatMap((w) => [sfx('hit', START[s.id] + w.startFrame, 0.55), sfx('flash', START[s.id] + w.startFrame + 2, 0.35)])),
  sfx('rizz', START['nothing-for-mom'] + 8, 0.45),
  sfx('riser', START['step-forward'] - 55, 0.4),
  sfx('shock', START['yes-i-am'] + (SCENES.find((s) => s.id === 'yes-i-am')!.words.find((w) => w.word === 'Yes')?.startFrame ?? 40), 0.6),
];
const REVEAL = [START['step-forward'], START['yes-i-am'] + 78] as const;
export const ViralShort: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Series>
      {SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}><Scene s={s} /></Series.Sequence>)}
    </Series>
    <Title />
    {/* bg song from the editing resources (Lodoni – Say Goodbye), under the dialogue; swells over the reveal */}
    <Audio src={staticFile('res/goodbye.mp3')} volume={(f) => (f >= REVEAL[0] && f < REVEAL[1] ? 0.2 : 0.09)} />
    {FX.map((x, i) => <Sequence key={i} from={x.at}><Audio src={staticFile(`res/${x.file}.mp3`)} volume={x.v} /></Sequence>)}
  </AbsoluteFill>
);
