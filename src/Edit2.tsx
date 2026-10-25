// Preset "Edit2": motion-graphics podcast Short, driven by a plan (src/plans/edit2/*.ts via src/activeEdit2.ts).
// Built from 6 refs (vault/02 Style Guide/Motion graphics podcast style.md):
//  - tight face close-up with a dark moody grade, one-word / short plain subs, kinetic stacked type that blurs in;
//  - a title hook on top during the first seconds (DOAC), chapter number cards (Chris Williamson);
//  - light-leak transitions, the cam shrinking into a rounded card on light backgrounds (Belmar edit, showreels);
//  - clean white UI scenes, glowing stat counters, and (for football) an animated top-down field diagram.
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {PLAN as P} from './activeEdit2';
import {SANS, SERIF} from './mgFonts';
import type {Line, Scene, Seat} from './plans/edit2/types';

export const E2_FPS = 30;
const W = 1080;
const H = 1920;
const SRC_W = 1920;
const SRC_H = 1080;
const f = (ms: number) => Math.round((ms / 1000) * E2_FPS);
const OUTRO_MS = 1900;

// ---- timeline ----------------------------------------------------------------
const SEGS = P.segs;
const segOut = SEGS.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + (SEGS[i - 1][1] - SEGS[i - 1][0]) : 0], []);
const STORY_MS = segOut[SEGS.length - 1] + SEGS[SEGS.length - 1][1] - SEGS[SEGS.length - 1][0];
export const E2_OUT_MS = STORY_MS + OUTRO_MS;
// output ms of a source ms (a segment's end is the next one's start: prefer the segment starting there)
export const out = (src: number): number => {
  let i = SEGS.findIndex(([a, b]) => src >= a && src < b);
  if (i < 0) i = SEGS.findIndex(([, b]) => src === b);
  if (i < 0) throw new Error(`${P.name}: source ${src} is not in any segment`);
  return segOut[i] + src - SEGS[i][0];
};
const srcAt = (o: number) => {
  for (let i = SEGS.length - 1; i >= 0; i--) if (o >= segOut[i]) return Math.min(SEGS[i][1], SEGS[i][0] + o - segOut[i]);
  return SEGS[0][0];
};
const SCENES = P.scenes.map((s) => ({...s, o0: out(s.from), o1: out(s.to)}));
const sceneAt = (o: number) => SCENES.find((s) => o >= s.o0 && o < s.o1);

// ---- face cam ------------------------------------------------------------------
const whoAt = (src: number): Seat => [...P.speakers].reverse().find((s) => src >= s.from)?.who ?? P.speakers[0].who;
const faceAt = (src: number) => {
  const tr = P.track[whoAt(src)]!;
  const i = (src - P.track.fromMs) / P.track.stepMs;
  const a = tr[Math.max(0, Math.min(tr.length - 1, Math.floor(i)))];
  const b = tr[Math.max(0, Math.min(tr.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return {x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t};
};
type Rect = {x: number; y: number; w: number; h: number; r: number; hide?: boolean};
const FULL: Rect = {x: 0, y: 0, w: W, h: H, r: 0};
const CARD: Rect = {x: 140, y: 170, w: 800, h: 900, r: 44};
const CORNER: Rect = {x: 770, y: 110, w: 250, h: 330, r: 30};
const rectFor = (s?: Scene): Rect => !s ? FULL : s.type === 'card' ? CARD
  : s.type === 'checklist' || s.type === 'field' ? CORNER : {...CORNER, hide: true};
const ease = Easing.bezier(0.7, 0, 0.2, 1);
const lerp = (a: Rect, b: Rect, t: number): Rect => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t, r: a.r + (b.r - a.r) * t, hide: t < 0.5 ? a.hide : b.hide});
// states: each scene start/end is a change of target rect; animate 450 ms into each
const STATES = [{at: 0, rect: FULL}, ...SCENES.flatMap((s) => [{at: s.o0, rect: rectFor(s)}, {at: s.o1, rect: rectFor(sceneAt(s.o1))}])]
  .sort((a, b) => a.at - b.at);
const camRect = (o: number): Rect => {
  const i = STATES.reduce((k, s, j) => (s.at <= o ? j : k), 0);
  const t = interpolate(o - STATES[i].at, [0, 450], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  return lerp(STATES[Math.max(0, i - 1)].rect, STATES[i].rect, i === 0 ? 1 : t);
};
const zoomAt = (src: number) => {
  const p = (P.punches ?? []).find(([a, b]) => src >= a - 120 && src <= b + 200);
  if (!p) return 1;
  return 1 + (p[2] - 1) * Math.min(1, (src - p[0] + 120) / 120, (p[1] + 200 - src) / 200);
};

const Cam = ({o}: {o: number}) => {
  const rect = camRect(o);
  if (rect.hide) return null;
  const src = srcAt(Math.min(o, STORY_MS - 1));
  const face = faceAt(src);
  const z = zoomAt(src) * interpolate(o % 4000, [0, 4000], [1, 1.03]);
  const hs = Math.min(SRC_H, (rect.r > 0 ? 640 : 600) / z); // tight on the face
  const ws = Math.min(SRC_W, (hs * rect.w) / rect.h);
  const hs2 = (ws * rect.h) / rect.w;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const y0 = Math.min(Math.max(face.y - hs2 * 0.36, 0), SRC_H - hs2);
  const k = rect.w / ws;
  const grade = rect.r === 0;
  return (
    <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, overflow: 'hidden',
      borderRadius: rect.r, boxShadow: rect.r > 0 ? '0 30px 60px rgba(0,0,0,0.25)' : undefined}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k,
        filter: 'contrast(1.12) saturate(0.9) brightness(0.86)'}}>
        {SEGS.map(([a, b], i) => (
          <Sequence key={i} from={f(segOut[i])} durationInFrames={f(b - a) + (i === SEGS.length - 1 ? f(OUTRO_MS) : 0)} layout="none">
            <OffthreadVideo src={staticFile(P.src)} muted trimBefore={f(a)} style={{width: '100%', height: '100%'}} />
          </Sequence>
        ))}
      </div>
      {grade && <>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(30,30,90,0.28)', mixBlendMode: 'soft-light'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 38%, transparent 40%, rgba(5,5,20,0.7) 100%)'}} />
      </>}
    </div>
  );
};

// ---- typography ----------------------------------------------------------------
const fontOf = (font: Line['font']): CSSProperties => ({
  sans: {fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.02em'},
  bold: {fontFamily: SANS, fontWeight: 800, letterSpacing: '-0.045em'},
  boldI: {fontFamily: SANS, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.045em'},
  serif: {fontFamily: SERIF, fontWeight: 400, letterSpacing: '-0.01em'},
  serifI: {fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em'},
}[font]);
const reveal = (frame: number, startF: number) => {
  const p = interpolate(Math.max(0, frame - startF), [0, 9], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return {opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * 26}px) scale(${1.06 - 0.06 * p})`};
};
const KLines = ({lines, from, dark = false}: {lines: Line[]; from: number; dark?: boolean}) => {
  const frame = useCurrentFrame();
  return <>{lines.map((l, i) => (
    <div key={i} style={{...fontOf(l.font), fontSize: l.size, color: l.color ?? (dark ? '#111' : 'white'), whiteSpace: 'nowrap',
      textShadow: dark ? undefined : '0 0 30px rgba(255,255,255,0.25), 0 6px 24px rgba(0,0,0,0.55)', ...reveal(frame, f(out(l.at) - from))}}>{l.t}</div>
  ))}</>;
};
const KStack = ({s, from}: {s: Edit2Stack; from: number}) => (
  <div style={{position: 'absolute', top: s.y, left: s.align === 'right' ? undefined : s.x, right: s.align === 'right' ? W - s.x : undefined,
    width: s.align === 'center' ? W - 2 * s.x : undefined, textAlign: s.align, lineHeight: 0.92}}>
    <KLines lines={s.lines} from={from} />
  </div>
);
type Edit2Stack = (typeof P.stacks)[number];

// plain subs: short chunks (or one word at a time, Boustedt style)
const fixW = (t: string) => P.fix?.[t] ?? P.fix?.[t.replace(/[.,!?]$/, '')] ?? t;
const chunks = (from: number, to: number, max: number) => {
  const ws = P.words.filter((w) => w.startMs >= from && w.startMs < to && w.text.trim());
  const res: {text: string; at: number; end: number}[] = [];
  let cur: typeof ws = [];
  const push = (end: number) => { if (cur.length) res.push({text: cur.map((c) => fixW(c.text)).join(' '), at: cur[0].startMs, end}); cur = []; };
  ws.forEach((w) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= max || (prev && w.startMs - prev.endMs > 300)) push(w.startMs);
    cur.push(w);
  });
  if (cur.length) push(Math.min(to, cur[cur.length - 1].endMs + 400));
  return res;
};
const Subs = ({sub}: {sub: (typeof P.subs)[number]}) => {
  const frame = useCurrentFrame();
  const o0 = out(sub.from);
  const o = o0 + (frame / E2_FPS) * 1000;
  const c = chunks(sub.from, sub.to, sub.one ? 1 : 3).find((q) => o >= out(q.at) && o < out(Math.min(q.end, sub.to)));
  if (!c) return null;
  const color = sub.color ?? 'white';
  return (
    <div style={{position: 'absolute', top: sub.y ?? 1000, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700,
      fontSize: sub.size ?? (sub.one ? 64 : 50), letterSpacing: '-0.02em', color,
      textShadow: color === 'white' ? '0 4px 18px rgba(0,0,0,0.6)' : undefined, ...reveal(frame, f(out(c.at) - o0))}}>{c.text}</div>
  );
};

// ---- effects --------------------------------------------------------------------
const LightLeak = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 7, 16], [0, 1, 0], {extrapolateRight: 'clamp'});
  const x = interpolate(frame, [0, 16], [-30, 120]);
  return <AbsoluteFill style={{opacity: p, mixBlendMode: 'screen', background:
    `radial-gradient(ellipse 70% 90% at ${x}% 40%, rgba(255,110,190,0.95), transparent 70%), radial-gradient(ellipse 60% 70% at ${x - 30}% 80%, rgba(120,255,190,0.8), transparent 70%)`}} />;
};

// DOAC-style title hook on top during the first segment
const HookTitle = () => {
  const frame = useCurrentFrame();
  const u = interpolate(frame, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: 120, left: 70, right: 70, textAlign: 'center'}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.85)', ...reveal(frame, 0)}}>{P.hook.small}</div>
      <div style={{margin: '14px auto 18px', height: 3, width: 300 * u, background: 'white', borderRadius: 2, boxShadow: '0 0 12px white'}} />
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.02, letterSpacing: '-0.04em', color: 'white',
        textShadow: '0 6px 24px rgba(0,0,0,0.6)', ...reveal(frame, 3)}}>{P.hook.big}</div>
    </div>
  );
};

// ---- scenes ----------------------------------------------------------------------
type SceneO = (typeof SCENES)[number];
const at = (s: SceneO, src: number) => f(out(src) - s.o0); // frame inside the scene

const CardScene = ({s}: {s: Extract<SceneO, {type: 'card'}>}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inF = 12;
  const cut = spring({frame: frame - inF, fps, config: {damping: 16, stiffness: 120}});
  const chip = (d: number) => spring({frame: frame - inF - d, fps, config: {damping: 12, stiffness: 220}});
  return (
    <AbsoluteFill>
      {s.cutout && <Img src={staticFile(s.cutout)} style={{position: 'absolute', left: -60, bottom: 0, height: 820,
        transform: `translateX(${(1 - cut) * -500}px)`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))'}} />}
      <div style={{position: 'absolute', right: 70, top: 1130, textAlign: 'right', lineHeight: 0.9, color: '#111'}}>
        <div style={{fontFamily: SERIF, fontSize: 150, ...reveal(frame, inF + 4)}}>{s.name[0]}</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, ...reveal(frame, inF + 9)}}>{s.name[1]}</div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 34}}>
          {(s.chips ?? []).map((t, i) => (
            <div key={t} style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: '0.04em', padding: '14px 24px',
              borderRadius: 40, background: '#111', color: 'white', transform: `scale(${chip(14 + i * 6)})`}}>{t}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Checklist = ({s}: {s: Extract<SceneO, {type: 'checklist'}>}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = s.rows.length;
  const rowH = n > 3 ? 170 : 190;
  const gap = n > 3 ? 196 : 230;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 230, lineHeight: 0.92}}><KLines lines={s.title} from={s.o0} dark /></div>
      {s.rows.map((r, i) => {
        const st = at(s, r.at);
        const rowIn = spring({frame: frame - 6 - i * 4, fps, config: {damping: 18, stiffness: 140}});
        const on = interpolate(frame - st, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const tick = spring({frame: frame - st - 4, fps, config: {damping: 9, stiffness: 260}});
        return (
          <div key={r.t} style={{position: 'absolute', left: 80, width: 920, top: 720 + i * gap, height: rowH, borderRadius: 36,
            background: 'white', boxShadow: `0 ${18 + on * 12}px ${40 + on * 20}px rgba(0,0,0,${0.08 + on * 0.06})`,
            display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box',
            opacity: rowIn, transform: `translateY(${(1 - rowIn) * 60}px) scale(${1 + on * 0.02})`}}>
            <div style={{width: 100, height: 100, borderRadius: 50, background: on ? '#111' : '#E6E6EA', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Img src={staticFile(`emoji-ios/${r.emoji}.png`)} style={{width: 58, height: 58, opacity: 0.35 + 0.65 * on}} />
            </div>
            <div style={{flex: 1, position: 'relative', height: 110}}>
              <div style={{position: 'absolute', top: 22, height: 28, width: 400, borderRadius: 14, background: '#D9D9DE', filter: 'blur(3px)', opacity: 1 - on}} />
              <div style={{position: 'absolute', top: 64, height: 24, width: 250, borderRadius: 12, background: '#E4E4E8', filter: 'blur(3px)', opacity: 1 - on}} />
              <div style={{position: 'absolute', top: 8, fontFamily: SANS, fontWeight: 800, fontStyle: 'italic', fontSize: n > 3 ? 74 : 88,
                letterSpacing: '-0.04em', color: '#111', whiteSpace: 'nowrap', ...reveal(frame, st)}}>{r.t}</div>
            </div>
            <div style={{width: 80, height: 80, borderRadius: 40, background: '#22C55E', color: 'white', fontFamily: SANS, fontWeight: 800,
              fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transform: `scale(${frame >= st + 4 ? tick : 0})`, boxShadow: '0 8px 20px rgba(34,197,94,0.45)'}}>✓</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Stat = ({s}: {s: Extract<SceneO, {type: 'stat'}>}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const st = at(s, s.at);
  const n = Math.round(interpolate(frame, [st, st + 24], [s.start ?? 0, s.value], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const land = spring({frame: frame - st - 24, fps, config: {damping: 8, stiffness: 240}});
  const chip = spring({frame: frame - st - 32, fps, config: {damping: 11, stiffness: 220}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #3b1170 0%, #12062e 55%, #050212 100%)'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 140 + i * 300, top: -200, width: 180, height: 1300, borderRadius: 90,
          background: 'linear-gradient(#b14cff, transparent)', filter: 'blur(60px)', opacity: 0.35 + 0.25 * (0.5 + 0.5 * Math.sin(frame / 12 + i * 2)),
          transform: `rotate(${(i - 1) * 14}deg)`}} />
      ))}
      <div style={{position: 'absolute', top: 520, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 40,
        letterSpacing: '0.3em', color: 'rgba(255,255,255,0.75)', ...reveal(frame, 2)}}>{s.kicker}</div>
      <div style={{position: 'absolute', top: 600, width: W, ...reveal(frame, Math.max(4, st - 3))}}>
        <div style={{textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 380, letterSpacing: '-0.06em', color: 'white', lineHeight: 1,
          transform: `scale(${frame >= st + 24 ? 0.92 + 0.08 * land : 1})`,
          textShadow: '0 0 60px rgba(190,120,255,0.8), 0 0 140px rgba(150,80,255,0.6)'}}>{s.prefix ?? ''}{n}</div>
      </div>
      <div style={{position: 'absolute', top: 1060, width: W, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 120,
        color: 'white', ...reveal(frame, st + 10)}}>{s.label}</div>
      {s.chip && <div style={{position: 'absolute', top: 1240, width: W, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: '0.12em', padding: '16px 34px', borderRadius: 40,
          background: '#FFD84D', color: '#111', transform: `scale(${chip})`}}>{s.chip}</div>
      </div>}
    </AbsoluteFill>
  );
};

const NumberCard = ({s}: {s: Extract<SceneO, {type: 'number'}>}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 10, stiffness: 200}});
  return (
    <AbsoluteFill style={{background: '#F6F6F4', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 340, letterSpacing: '-0.06em', color: '#14B8A6', transform: `scale(${pop})`}}>{s.n}</div>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, color: '#111', ...reveal(frame, 6)}}>{s.label}</div>
    </AbsoluteFill>
  );
};

// Top-down football field (offense at the bottom going up). Positions are 0..1 of the field box.
const FIELD = {x: 50, y: 520, w: 980, h: 1180};
const P_ = (x: number, y: number) => ({x: FIELD.x + x * FIELD.w, y: FIELD.y + y * FIELD.h});
const OFF = {
  lt: [0.38, 0.72], lg: [0.44, 0.72], c: [0.5, 0.72], rg: [0.56, 0.72], rt: [0.62, 0.72], qb: [0.5, 0.82], rb: [0.5, 0.92],
  x: [0.08, 0.72], te: [0.69, 0.73], slot: [0.8, 0.73], z: [0.93, 0.72],
} as Record<string, [number, number]>;
const DEF = {
  de1: [0.36, 0.665], dt1: [0.46, 0.665], dt2: [0.54, 0.665], de2: [0.64, 0.665], lb1: [0.36, 0.56], lb2: [0.5, 0.56], lb3: [0.66, 0.56],
  cb1: [0.08, 0.58], cb2: [0.93, 0.58], s1: [0.3, 0.32], s2: [0.72, 0.32],
} as Record<string, [number, number]>;
const Field = ({s}: {s: Extract<SceneO, {type: 'field'}>}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ev = (k: string) => (s.events[k] !== undefined ? at(s, s.events[k]) : 99999);
  const prog = (k: string, dur = 14) => interpolate(frame - ev(k), [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const appear = (i: number) => spring({frame: frame - 6 - i * 1.2, fps, config: {damping: 14, stiffness: 200}});
  const v = s.variant;
  // where things move
  const motion = prog('motion', 18);
  const off = {...OFF};
  if (v === 'formation' || v === 'coverage') off.slot = [0.8 - 0.42 * motion, 0.73];
  const def = {...DEF};
  if (v === 'coverage') { def.lb3 = [0.66 - 0.36 * prog('show', 16), 0.56]; def.s2 = [0.72, 0.32 + 0.1 * prog('show', 16)]; }
  if (v === 'cover3') { off.slotL = [0.25, 0.73]; def.s1 = [0.5, 0.2]; def.s2 = [0.5, 0.2]; def.cb1 = [0.12, 0.3]; def.cb2 = [0.88, 0.3]; }
  const roll = v === 'rollout' ? prog('right', 22) - 0 : 0;
  const left = v === 'rollout' ? prog('left', 22) : 0;
  if (v === 'rollout') off.qb = [0.5 + 0.28 * roll * (1 - left) - 0.3 * left, 0.82 - 0.04 * Math.max(roll, left)];
  const chip = (t: string, on: number, _x: number, color = '#FFD84D') => on > 0 && (
    <div key={t} style={{transform: `scale(${Math.min(1, on * 3)})`, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: '0.08em',
      padding: '12px 22px', borderRadius: 30, background: color, color: '#111', whiteSpace: 'nowrap'}}>{t}</div>
  );
  const line = (a: [number, number], b: [number, number], p: number, color: string, dash = false, w = 9) => {
    const A = P_(...a), B = P_(...b);
    return <line x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={color} strokeWidth={w}
      strokeLinecap="round" strokeDasharray={dash ? '4 22' : undefined} style={{filter: `drop-shadow(0 0 10px ${color})`}} />;
  };
  const arrowHead = (a: [number, number], b: [number, number], p: number, color: string) => {
    if (p < 0.98) return null;
    const A = P_(...a), B = P_(...b);
    const ang = Math.atan2(B.y - A.y, B.x - A.x);
    const s2 = 30;
    return <polygon points={`${B.x},${B.y} ${B.x - s2 * Math.cos(ang - 0.45)},${B.y - s2 * Math.sin(ang - 0.45)} ${B.x - s2 * Math.cos(ang + 0.45)},${B.y - s2 * Math.sin(ang + 0.45)}`} fill={color} />;
  };
  const fieldIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #13213d 0%, #070b16 100%)'}}>
      {s.title && <div style={{position: 'absolute', left: 80, top: 250, width: 640, fontFamily: SERIF, fontStyle: 'italic', fontSize: 96,
        lineHeight: 0.95, color: 'white', ...reveal(frame, 4)}}>{s.title}</div>}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: fieldIn}}>
        <defs>
          <linearGradient id="turf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f6b3a" /><stop offset="1" stopColor="#14502b" /></linearGradient>
        </defs>
        <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} rx={40} fill="url(#turf)" />
        {Array.from({length: 7}).map((_, i) => (
          <line key={i} x1={FIELD.x} x2={FIELD.x + FIELD.w} y1={FIELD.y + (i + 0.5) * FIELD.h / 7} y2={FIELD.y + (i + 0.5) * FIELD.h / 7}
            stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
        ))}
        <line x1={FIELD.x} x2={FIELD.x + FIELD.w} y1={P_(0, 0.695).y} y2={P_(0, 0.695).y} stroke="#4FC3F7" strokeWidth={5} opacity={0.8} />
        {/* cover 3: three deep zones */}
        {v === 'cover3' && [0, 1, 2].map((i) => {
          const p = prog('zones', 12);
          const c = P_(0.17 + i * 0.33, 0.2);
          return <ellipse key={i} cx={c.x} cy={c.y} rx={150 * p} ry={190 * p} fill="rgba(79,195,247,0.22)" stroke="rgba(79,195,247,0.8)" strokeWidth={4} />;
        })}
        {/* routes */}
        {(v === 'formation') && <>
          {line([0.08, 0.72], [0.08, 0.3], prog('formation', 16), 'rgba(255,255,255,0.7)')}
          {line(off.slot, [off.slot[0], 0.45], prog('route', 12), '#FFD84D')}
          {line([off.slot[0], 0.45], [off.slot[0] + 0.25, 0.32], prog('progression', 12), '#FFD84D')}
          {arrowHead([off.slot[0], 0.45], [off.slot[0] + 0.25, 0.32], prog('progression', 12), '#FFD84D')}
        </>}
        {v === 'coverage' && <>
          {line(OFF.slot, [0.38, 0.73], motion, 'rgba(255,255,255,0.8)', true, 7)}
          {line(OFF.te, [0.69, 0.3], prog('open', 14), '#FFD84D')}
          {arrowHead(OFF.te, [0.69, 0.3], prog('open', 14), '#FFD84D')}
        </>}
        {v === 'cover3' && <>
          {line(OFF.te, [0.67, 0.12], prog('seams', 16), '#FFD84D')}
          {line([0.25, 0.73], [0.33, 0.12], prog('seams', 16), '#FFD84D')}
          {arrowHead(OFF.te, [0.67, 0.12], prog('seams', 16), '#FFD84D')}
          {arrowHead([0.25, 0.73], [0.33, 0.12], prog('seams', 16), '#FFD84D')}
          {line(OFF.qb, [0.67, 0.3], prog('throw', 10), 'white', true, 6)}
        </>}
        {v === 'rollout' && <>
          {line([0.5, 0.84], [0.82, 0.8], prog('right', 22), left === 0 ? '#FF6B6B' : 'rgba(255,107,107,0.45)', false, 14)}
          {arrowHead([0.5, 0.84], [0.82, 0.8], prog('right', 22), '#FF6B6B')}
          {line([0.5, 0.84], [0.18, 0.8], left, '#3BFF8A', false, 14)}
          {arrowHead([0.5, 0.84], [0.18, 0.8], left, '#3BFF8A')}
          {prog('left', 22) > 0.95 && line([0.18, 0.8], [0.1, 0.4], prog('throw', 10), 'white', true, 6)}
        </>}
        {/* players */}
        {Object.entries(off).map(([k, [x, y]], i) => {
          const p = P_(x, y); const a = appear(i);
          const isQB = k === 'qb';
          return <g key={k} transform={`translate(${p.x},${p.y}) scale(${a})`}>
            <circle r={isQB ? 40 : 32} fill={isQB ? '#FFD84D' : 'white'} stroke="#0b1020" strokeWidth={5} />
            {isQB && <text y={13} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill="#111">16</text>}
          </g>;
        })}
        {Object.entries(def).map(([k, [x, y]], i) => {
          const p = P_(x, y); const a = appear(i + 6);
          return <g key={k} transform={`translate(${p.x},${p.y}) scale(${a})`} stroke="#FF6B6B" strokeWidth={11} strokeLinecap="round">
            <line x1={-22} y1={-22} x2={22} y2={22} /><line x1={22} y1={-22} x2={-22} y2={22} />
          </g>;
        })}
        {/* wide-open ring */}
        {(v === 'coverage' || v === 'cover3') && (() => {
          const k = v === 'coverage' ? prog('open', 10) : prog('throw', 10);
          const c = v === 'coverage' ? P_(0.69, 0.3) : P_(0.67, 0.3);
          return k > 0 && <circle cx={c.x} cy={c.y} r={70 * k} fill="none" stroke="#3BFF8A" strokeWidth={8} style={{filter: 'drop-shadow(0 0 14px #3BFF8A)'}} />;
        })()}
        {v === 'rollout' && prog('cross', 6) > 0 && (() => {
          const c = P_(0.68, 0.81); const k = spring({frame: frame - ev('cross'), fps, config: {damping: 9, stiffness: 260}});
          return <g transform={`translate(${c.x},${c.y}) scale(${k})`} stroke="#FF3B3B" strokeWidth={22} strokeLinecap="round">
            <line x1={-70} y1={-70} x2={70} y2={70} /><line x1={70} y1={-70} x2={-70} y2={70} /></g>;
        })()}
      </svg>
      {/* labels (a row of chips over the field) */}
      <div style={{position: 'absolute', left: FIELD.x + 30, top: FIELD.y + 28, display: 'flex', gap: 14}}>
      {v === 'formation' && <>{chip('FORMATION', prog('formation', 6), 90)}{chip('MOTION', prog('motion', 6), 400)}{chip('ROUTE', prog('route', 6), 640)}</>}
      {v === 'coverage' && <>{chip('MOTION', prog('motion', 6), 90)}{chip('DEFENSE SHOWS IT', prog('show', 6), 330)}{chip('WIDE OPEN', prog('open', 6), 600, '#3BFF8A')}</>}
      {v === 'cover3' && <>{chip('COVER 3', prog('zones', 6), 90, '#4FC3F7')}{chip('SEAMS', prog('seams', 6), 370)}{chip('OPEN', prog('throw', 6), 610, '#3BFF8A')}</>}
      {v === 'rollout' && <>{chip('ROLL RIGHT', prog('right', 6) * (1 - prog('cross', 4)), 90, '#FF6B6B')}{chip('GO LEFT', prog('left', 6), 90, '#3BFF8A')}</>}
      </div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,20,0.55)', backdropFilter: 'blur(18px)'}}>
      <div style={{textAlign: 'center', lineHeight: 0.95, color: 'white'}}>
        {P.outro.lines.map((l, i) => (
          <div key={i} style={{...fontOf(l.font), fontSize: l.size, color: l.color ?? 'white', ...reveal(frame, 4 + i * 6)}}>{l.t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---- sound ---------------------------------------------------------------------------
type Sfx = {file: string; at: number; vol: number; peak: number}; // at = output ms
const SFX: Sfx[] = [
  {file: 'mg-swoosh2', at: 0, vol: 0.35, peak: 0},
  ...SCENES.flatMap((s): Sfx[] => {
    const base: Sfx[] = [{file: 'mg-whoosh', at: s.o0, vol: 0.45, peak: 780}, {file: 'mg-swoosh2', at: s.o1, vol: 0.3, peak: 0}];
    if (s.type === 'checklist') base.push(...s.rows.flatMap((r) => [{file: 'mg-click', at: out(r.at), vol: 0.6, peak: 300}, {file: 'ding-2', at: out(r.at) + 140, vol: 0.12, peak: 140}]));
    if (s.type === 'stat') base.push(...[0, 1, 2, 3, 4, 5].map((i) => ({file: 'mg-click', at: out(s.at) + 100 + i * 110, vol: 0.22, peak: 300})),
      {file: 'mg-boom', at: out(s.at) + 800, vol: 0.55, peak: 190});
    if (s.type === 'card') base.push({file: 'mg-boom', at: s.o0 + 400, vol: 0.28, peak: 190}, ...(s.chips ?? []).map((_, i) => ({file: 'mg-click', at: s.o0 + 900 + i * 200, vol: 0.5, peak: 300})));
    if (s.type === 'number') base.push({file: 'mg-boom', at: s.o0, vol: 0.45, peak: 190});
    if (s.type === 'field') base.push(...Object.values(s.events).map((t) => ({file: 'mg-swoosh2', at: out(t), vol: 0.28, peak: 0})),
      ...Object.values(s.events).map((t) => ({file: 'mg-click', at: out(t), vol: 0.35, peak: 300})));
    return base;
  }),
  // a soft boom under the biggest kinetic word of each stack
  ...P.stacks.flatMap((st) => st.lines.filter((l) => l.font === 'bold' && l.size >= 180).map((l) => ({file: 'mg-boom', at: out(l.at), vol: 0.3, peak: 190}))),
  {file: 'mg-shimmer', at: STORY_MS + 100, vol: 0.45, peak: 700},
];
const SPEECH = P.words.filter((w) => SEGS.some(([a, b]) => w.startMs >= a && w.startMs < b)).map((w) => [out(w.startMs), out(w.startMs) + w.endMs - w.startMs] as const);
const talking = (o: number) => SPEECH.some(([a, b]) => o >= a - 150 && o <= b + 150);

// ---- composition ------------------------------------------------------------------------
export const Edit2 = () => {
  const frame = useCurrentFrame();
  const o = (frame / E2_FPS) * 1000;
  const total = f(E2_OUT_MS);
  const sc = sceneAt(o);
  const bg = !sc ? null : sc.type === 'card' ? 'linear-gradient(160deg, #f4f4f7 0%, #dcdce3 55%, #f7f7fa 100%)'
    : sc.type === 'checklist' ? 'linear-gradient(180deg, #ffffff 0%, #f1f1f4 100%)' : null;
  const seq = (from: number, to: number, node: ReactNode, key: string) => (
    <Sequence key={key} from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))}>{node}</Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#06060f'}}>
      {bg && <AbsoluteFill style={{background: bg, opacity: interpolate(o - sc!.o0, [0, 400], [0, 1], {extrapolateRight: 'clamp'})}} />}
      {SCENES.map((s, i) => seq(s.o0, s.o1, s.type === 'stat' ? <Stat s={s} /> : s.type === 'number' ? <NumberCard s={s} />
        : s.type === 'field' ? <Field s={s} /> : null, `bgsc${i}`))}
      <Cam o={o} />
      {SCENES.map((s, i) => seq(s.o0, s.o1, s.type === 'card' ? <CardScene s={s} /> : s.type === 'checklist' ? <Checklist s={s} /> : null, `sc${i}`))}

      {seq(0, segOut[1] ?? STORY_MS, <HookTitle />, 'hook')}
      {P.stacks.map((s, i) => { const o0 = out(s.lines[0].at); return seq(o0, out(s.to), <KStack s={s} from={o0} />, `st${i}`); })}
      {P.subs.map((s, i) => seq(out(s.from), out(s.to), <Subs sub={s} />, `sub${i}`))}
      {SCENES.flatMap((s, i) => [seq(Math.max(0, s.o0 - 100), s.o0 + 500, <LightLeak />, `lk${i}`), seq(s.o1 - 100, s.o1 + 500, <LightLeak />, `lk2${i}`)])}
      {seq(STORY_MS, E2_OUT_MS, <Outro />, 'outro')}

      {/* audio */}
      {SEGS.map(([a, b], i) => (
        <Sequence key={`a${i}`} from={f(segOut[i])} durationInFrames={f(b - a)}>
          <Audio src={staticFile(P.src)} trimBefore={f(a)} volume={(fr) => Math.min(1, fr / 2, (f(b - a) - fr) / 2)} />
        </Sequence>
      ))}
      <Audio src={staticFile(`music/${P.music.file}`)} trimBefore={f(P.music.from)} volume={(fr) => {
        const t = (fr / E2_FPS) * 1000;
        const v = P.music.volume ?? 1;
        const end = Math.min(1, (total - fr) / 20);
        if (t >= STORY_MS) return 0.5 * v * end;
        return (talking(t) ? 0.13 : 0.3) * v * Math.min(1, fr / 6);
      }} />
      {SFX.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s.at - s.peak))}>
          <Audio src={staticFile(`sfx/${s.file}.mp3`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
