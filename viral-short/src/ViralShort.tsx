// "Guess the fake millionaire" edit in the reference style (refs: @Staroftheday / @MR.RankBoy shorts, storyboards only):
// black top band with a 2-line title, footage band cropped onto the speaker, one yellow word at a time, a lime flash +
// zoom punch on every money item (the source already carries its own car cut-outs and price tags), payoff = reveal.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
    </div>
    <Word words={s.words} />
  </AbsoluteFill>;
};

export const ViralShort: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Series>
      {SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}><Scene s={s} /></Series.Sequence>)}
    </Series>
    <Title />
  </AbsoluteFill>
);
