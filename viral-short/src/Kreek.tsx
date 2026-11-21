// KreekCraft GTA 6 campaign ONLY: reference layout (facecam panel on top, gameplay below, hook on the seam)
// with the user's look: Montserrat, colour-cycling ALL-CAPS word captions, centre echo emoji pops, whoosh + whip
// on every cut, short blur-focus on the face at the start, reaction SFX, Say Goodbye bed. Official KreekCraft
// overlay visible for the whole clip (campaign rule).
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import CFG from './kreek.cfg.json';

const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('res/Montserrat-Black.woff2'), weight: '800'});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const SEAM = 676;   // facecam panel height (reference proportions)

type W = {w: string; f0: number; f1: number};
type X = {f: number; kind: 'sfx' | 'png'; file: string; sfx?: string; v?: number};
export type KCfg = {src: string; dur: number; top: string; hl: string[]; cuts: number[]; words: W[]; extras: X[];
  focus: {x: number; y: number; r: number; dur: number}; musicVol: number};
export const KREEK = CFG as unknown as Record<string, KCfg>;

const COLS = ['#2EE8F2', '#3BE83B', '#FFE14A', '#FFFFFF'];
const WBL = [24, 44, 64, 44, 26, 12, 5, 0], WZM = [1.03, 1.07, 1.12, 1.08, 1.04, 1.02, 1.01, 1];

export const Kreek: React.FC<{edit: string}> = ({edit}) => {
  const c = KREEK[edit]; const f = useCurrentFrame();
  const wd = c.cuts.map((t) => f - t).find((d) => d >= -2 && d < 6);
  const blur = wd === undefined ? 0 : WBL[wd + 2], zoom = wd === undefined ? 1 : WZM[wd + 2];
  const flash = c.cuts[0] !== undefined && f - c.cuts[0] >= 0 && f - c.cuts[0] < 3 ? [2.2, 1.5, 1.12][f - c.cuts[0]] : 1;
  const wi = c.words.reduce((a, w, j) => (f >= w.f0 ? j : a), -1);
  const word = wi >= 0 && f <= c.words[wi].f1 + 12 ? c.words[wi] : null, wk = word ? f - word.f0 : 9;
  const fk = f < c.focus.dur ? (f < c.focus.dur - 8 ? 1 : (c.focus.dur - f) / 8) : 0;
  const parts = c.top.split(' ');
  return <AbsoluteFill style={{background: '#000'}}>
    <svg width="0" height="0" style={{position: 'absolute'}}><filter id="kb" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></svg>
    <AbsoluteFill style={{transform: `scale(${zoom})`, filter: `saturate(1.12) contrast(1.05) brightness(${flash})${blur > 0 ? ' url(#kb)' : ''}`}}>
      <OffthreadVideo src={staticFile(c.src)} style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
    {/* face focus: blur + darken everything but the face for the first ~0.7 s */}
    {fk > 0 && <AbsoluteFill style={{backdropFilter: `blur(${14 * fk}px) brightness(${1 - 0.25 * fk})`, WebkitBackdropFilter: `blur(${14 * fk}px)`,
      maskImage: `radial-gradient(circle at ${c.focus.x}px ${c.focus.y}px, transparent ${c.focus.r}px, #000 ${c.focus.r + 90}px)`,
      WebkitMaskImage: `radial-gradient(circle at ${c.focus.x}px ${c.focus.y}px, transparent ${c.focus.r}px, #000 ${c.focus.r + 90}px)`}} />}
    {/* hook on the seam */}
    <div style={{position: 'absolute', left: 40, right: 40, top: SEAM - 70, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 60, lineHeight: '68px', textAlign: 'center', color: '#fff', WebkitTextStroke: '9px #000', paintOrder: 'stroke fill', textShadow: '0 4px 10px rgba(0,0,0,0.8)'}}>
        {parts.map((w, i) => <span key={i} style={{color: c.hl.includes(w) ? '#FF2A2A' : '#fff'}}>{w}{i < parts.length - 1 ? ' ' : ''}</span>)}
      </div>
    </div>
    {/* word captions */}
    {word && <div style={{position: 'absolute', left: 0, width: 1080, top: 1240, textAlign: 'center', ...(wk < 2 ? {transform: `scaleX(${wk === 0 ? 1.3 : 1.12})`, filter: `blur(${wk === 0 ? 4 : 2}px)`} : {})}}>
      <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 84, color: COLS[wi % 4], WebkitTextStroke: '11px #000', paintOrder: 'stroke fill', textShadow: '0 4px 10px rgba(0,0,0,0.75)', textTransform: 'uppercase'}}>{word.w}</span>
    </div>}
    {/* centre echo emoji pops */}
    {c.extras.filter((e) => e.kind === 'png').map((e, i) => { const k = f - e.f; if (k < 0 || k >= 30) return null;
      const s = (q: number) => interpolate(q, [0, 7, 10, 13], [0.15, 1.12, 0.96, 1], clamp), fade = k > 23 ? (30 - k) / 7 : 1;
      const img = (q: number, o: number, key: string) => <Img key={key} src={staticFile(`res/${e.file}`)} style={{position: 'absolute', left: 540 - 170, top: 1000 - 170, width: 340, height: 340, transform: `scale(${s(q)})`, opacity: o}} />;
      return <React.Fragment key={'p' + i}>{k >= 4 && img(k - 4, 0.35 * fade, 'e')}{img(k, fade, 'm')}</React.Fragment>; })}
    {/* official KreekCraft overlay — always visible */}
    <Img src={staticFile('res/kreek_overlay.png')} style={{position: 'absolute', left: 140, width: 800, top: 1700}} />
    <Audio src={staticFile('res/goodbye_n.mp3')} volume={c.musicVol} loop />
    {c.cuts.map((t, i) => <Sequence key={'w' + i} from={Math.max(0, t - 2)}><Audio src={staticFile('res/s_whoosh.mp3')} volume={0.45} /></Sequence>)}
    {c.cuts[0] !== undefined && <Sequence from={c.cuts[0]}><Audio src={staticFile('res/s_camflash.mp3')} volume={0.4} /></Sequence>}
    {c.extras.map((e, i) => (e.kind === 'sfx' || e.sfx) ? <Sequence key={'x' + i} from={e.f}><Audio src={staticFile(`res/${e.kind === 'sfx' ? e.file : e.sfx}`)} volume={e.v ?? 0.5} /></Sequence> : null)}
    {c.extras.filter((e) => e.kind === 'png').map((e, i) => <Sequence key={'q' + i} from={e.f}><Audio src={staticFile('res/s_popecho.mp3')} volume={0.45} /></Sequence>)}
  </AbsoluteFill>;
};
