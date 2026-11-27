// Love & Justice campaign clip: layout + camera from tools/lj/build.py (src/lj/<id>.json).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import c1 from './c1.json';
import c2 from './c2.json';
import c3 from './c3.json';
import c4 from './c4.json';
import c5 from './c5.json';

loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-var-normal.woff2'), weight: '100 900'});

type Shot = {f0: number; n: number; mode: 'split' | 'full' | 'wide'; vw?: number; cx?: number[]; panels?: {top: number[]; bottom: number[]}};
type Cap = {f0: number; f1: number; words: {t: string; f: number; col: string | null}[]};
export type ClipData = {id: string; frames: number; hook: number; title: (string)[][]; shots: Shot[]; captions: Cap[]; beats: {f: number; sfx: string; flash: string | null}[]};
export const CLIPS: Record<string, ClipData> = {c1, c2, c3, c4, c5} as unknown as Record<string, ClipData>;

const C: Record<string, string> = {red: '#FF3B3B', green: '#3DFF6E', cyan: '#3DE7FF', yellow: '#FFE53D', magenta: '#FF4FD8', white: '#FFFFFF'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 1080, H = 1920;
const EMOJI: Record<string, string> = {'📱': '1f4f1', '😳': '1f633', '🤔': '1f914', '💀': '1f480'};

// where the picture box sits for a shot at local frame f
const boxFor = (s: Shot, f: number) => {
  if (s.mode === 'split') return null;
  const vw = s.vw!; const k = W / vw; const cx = s.cx![Math.min(f, s.n - 1)];
  const boxH = 1080 * k; const top = s.mode === 'full' ? 0 : 760 - boxH / 2;
  return {k, left: -(cx - vw / 2) * k, top, boxH: s.mode === 'full' ? H : boxH};
};
export const captionY = (s: Shot | undefined) => (!s ? 1300 : s.mode === 'split' ? 960 - 70 : s.mode === 'wide' ? Math.max(1300, 760 + (1080 * W) / s.vw! / 2 + 60) : 1300);

const Frame: React.FC<{src: string; s: Shot}> = ({src, s}) => {
  const f = useCurrentFrame();
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={src} trimBefore={s.f0} muted style={{position: 'absolute', ...style}} />;
  if (s.mode === 'split') {
    const panel = (name: 'top' | 'bottom', y0: number, x0: number) => {
      const top = s.panels![name][Math.min(f, s.n - 1)]; const k = W / 950;
      return (
        <div style={{position: 'absolute', left: 0, top: y0, width: W, height: 960, overflow: 'hidden'}}>
          {vid({left: -x0 * k, top: -top * k, width: 1920 * k, height: 1080 * k})}
        </div>
      );
    };
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {panel('top', 0, 0)}
        {panel('bottom', 960, 965)}
        <div style={{position: 'absolute', left: 0, top: 956, width: W, height: 8, background: 'linear-gradient(90deg,#8a6a1c,#f4d27a,#8a6a1c)'}} />
      </AbsoluteFill>
    );
  }
  const b = boxFor(s, f)!;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {s.mode === 'wide' && (
        <AbsoluteFill style={{filter: 'blur(45px) brightness(0.5)', transform: 'scale(1.2)'}}>{vid({left: (W - 3413) / 2, top: 0, width: 3413, height: H})}</AbsoluteFill>
      )}
      <div style={{position: 'absolute', left: 0, top: b.top, width: W, height: b.boxH, overflow: 'hidden'}}>
        {vid({left: b.left, top: 0, width: 1920 * b.k, height: 1080 * b.k})}
      </div>
    </AbsoluteFill>
  );
};

const textStyle = (size: number, color: string, glow: boolean): React.CSSProperties => ({
  fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, letterSpacing: size * 0.02, textTransform: 'uppercase',
  WebkitTextStroke: `${Math.round(size * 0.09)}px #000`, paintOrder: 'stroke fill',
  textShadow: `${glow ? `0 0 18px ${color}99,` : ''} 0 5px 12px rgba(0,0,0,0.8)`,
});

const Title: React.FC<{title: string[][]; frames: number}> = ({title, frames}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 3, 6], [0.7, 1.06, 1], clamp);
  const o = interpolate(f, [frames - 50, frames - 40], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: 120, width: W, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(0,0,0,0.55)', borderRadius: 22, padding: '14px 26px', transform: `scale(${s})`, maxWidth: 980, textAlign: 'center', lineHeight: 1.15}}>
        {title.map(([t, col], i) => EMOJI[t]
          ? <Img key={i} src={staticFile(`emoji/${EMOJI[t]}.png`)} style={{width: 64, height: 64, verticalAlign: '-0.15em', marginLeft: 6}} />
          : <span key={i} style={{...textStyle(62, C[col ?? 'white'], !!col), marginRight: 14, WebkitTextStroke: '0px', whiteSpace: 'nowrap', display: 'inline-block'}}>{t}</span>)}
      </div>
    </div>
  );
};

const Caption: React.FC<{cap: Cap; y: number}> = ({cap, y}) => {
  const f = useCurrentFrame() + cap.f0;
  const pop = interpolate(f - cap.f0, [0, 2, 4], [0.8, 1.06, 1], clamp);
  return (
    <div style={{position: 'absolute', top: y, width: W, padding: '0 50px', boxSizing: 'border-box', textAlign: 'center', transform: `scale(${pop})`, lineHeight: 1.08}}>
      {cap.words.map((w, i) => {
        const active = f >= w.f && (i === cap.words.length - 1 || f < cap.words[i + 1].f);
        const color = w.col ? C[w.col] : active ? C.yellow : C.white;
        return <span key={i} style={{...textStyle(92, color, !!w.col || active), display: 'inline-block', marginRight: 22, whiteSpace: 'nowrap', transform: `scale(${active ? 1.08 : 1})`}}>{w.t}</span>;
      })}
    </div>
  );
};

const Flash: React.FC<{color: string; peak: number}> = ({color, peak}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: color, opacity: interpolate(f, [0, 1, 10], [peak, peak, 0], {...clamp, easing: Easing.out(Easing.quad)})}} />;
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 3, 6], [0.6, 1.08, 1], clamp);
  return (
    <div style={{position: 'absolute', top: 1560, width: W, textAlign: 'center', transform: `scale(${s})`}}>
      <span style={{...textStyle(54, C.white, false), background: C.red, padding: '12px 26px', borderRadius: 14, WebkitTextStroke: '0px'}}>FULL EPISODE ON @HARDSCOPE</span>
    </div>
  );
};

export const LJClip: React.FC<{id: string}> = ({id}) => {
  const d = CLIPS[id]; const src = staticFile(`lj/${id}.mp4`);
  const shotAt = (g: number) => d.shots.find((s) => g >= s.f0 && g < s.f0 + s.n);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {d.shots.map((s) => <Sequence key={s.f0} from={s.f0} durationInFrames={s.n} layout="none"><Frame src={src} s={s} /></Sequence>)}
      <Sequence from={0} durationInFrames={d.frames}><Title title={d.title} frames={d.frames} /></Sequence>
      {d.captions.map((c, i) => <Sequence key={i} from={c.f0} durationInFrames={c.f1 - c.f0} layout="none"><Caption cap={c} y={captionY(shotAt(c.f0))} /></Sequence>)}
      {/* hook -> rewind */}
      <Sequence from={d.hook - 3} durationInFrames={12}><Flash color="#fff" peak={0.9} /></Sequence>
      <Sequence from={0}><Audio src={staticFile('sfx/808-boom.mp3')} volume={0.35} /></Sequence>
      <Sequence from={d.hook - 8}><Audio src={staticFile('sfx/rev-whoosh.mp3')} volume={0.5} /></Sequence>
      {d.beats.map((b, i) => (
        <React.Fragment key={i}>
          <Sequence from={b.f} durationInFrames={b.sfx.includes('riser') ? 163 : 60}><Audio src={staticFile(b.sfx)} volume={b.sfx.includes('riser') ? 0.25 : 0.4} /></Sequence>
          {b.flash && <Sequence from={b.f} durationInFrames={12}><Flash color={C[b.flash]} peak={0.45} /></Sequence>}
        </React.Fragment>
      ))}
      <Sequence from={d.frames - 45}><EndCard /></Sequence>
      <Audio src={src} />
    </AbsoluteFill>
  );
};
