// Channel overlays: word-synced captions (2–3 words, one yellow keyword) and top info chips. Shared by every video.
import {Audio, Sequence, staticFile} from 'remotion';
import {clamp01} from './three';

export type Word = {t: string; at: number};
export const loadWords = (raw: {text: string; startMs: number}[], off: number): Word[] => raw.map((w) => ({t: w.text, at: w.startMs + off}));
/** n-th occurrence (case-insensitive, punctuation stripped) of a word's start time */
export const wordAt = (W: Word[], word: string, nth = 0) => {
  const hits = W.filter((w) => w.t.replace(/[.,!?]/g, '').toLowerCase() === word.toLowerCase());
  if (!hits[nth]) throw new Error(`word "${word}" #${nth} not in narration`);
  return hits[nth].at;
};
export const chunks = (W: Word[]) => {
  const out: {a: number; w: Word[]}[] = []; let cur: Word[] = [];
  W.forEach((w, i) => { cur.push(w); if (/[.,!?]$/.test(w.t) || cur.length >= 3 || i === W.length - 1) { out.push({a: cur[0].at, w: cur}); cur = []; } });
  return out;
};
export const Captions = ({o, C, keyword}: {o: number; C: ReturnType<typeof chunks>; keyword: RegExp}) => {
  let c = -1; C.forEach((x, i) => { if (o >= x.a) c = i; });
  if (c < 0) return null;
  const ch = C[c], next = C[c + 1]?.a ?? ch.w[ch.w.length - 1].at + 900;
  if (o > next || o > ch.w[ch.w.length - 1].at + 1100) return null;
  const k = (o - ch.a) / 70;
  return <div style={{position: 'absolute', left: 40, right: 40, top: 1240, textAlign: 'center', transform: `scale(${k < 1 ? 0.9 + 0.1 * k : 1})`, opacity: Math.min(1, k)}}>
    {ch.w.map((w, i) => <span key={i} style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 70, color: keyword.test(w.t.replace(/[.,!?]/g, '')) ? '#FFD84A' : '#fff', margin: '0 10px',
      textShadow: '0 4px 18px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.9)', opacity: o >= w.at - 40 ? 1 : 0}}>{w.t.replace(/[.,!?]$/, '')}</span>)}
  </div>;
};
export type Chip = {a: number; b: number; text: string | ((o: number) => string); dot?: string};
export const Chips = ({o, list}: {o: number; list: Chip[]}) => {
  const c = list.find((x) => o >= x.a && o < x.b);
  if (!c) return null;
  const k = clamp01((o - c.a) / 220), q = clamp01((c.b - o) / 160);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', opacity: Math.min(k, q), transform: `translateY(${(1 - k) * -18}px) scale(${0.94 + 0.06 * k})`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(12,16,24,.78)', border: '2px solid rgba(255,255,255,.18)', borderRadius: 40, padding: '14px 30px',
      fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 1, maxWidth: 980, textAlign: 'center'}}>
      <span style={{width: 18, height: 18, borderRadius: 9, flex: '0 0 18px', background: c.dot ?? '#ffd84a', boxShadow: `0 0 14px ${c.dot ?? '#ffd84a'}`}} />
      {typeof c.text === 'function' ? c.text(o) : c.text}
    </div>
  </div>;
};
const FPS = 30;
export const fr = (ms: number) => Math.round((ms / 1000) * FPS);
/** voice + ducked music + one-shot SFX + looped beds */
export const Soundtrack = ({vo, off, W, total, fx, beds, music = 'music/Investigations.mp3'}: {vo: string; off: number; W: Word[]; total: number; fx: [string, number, number][];
  beds: [string, number, number, number][]; music?: string}) => {
  const voiceAt = (ms: number) => W.some((w) => ms >= w.at - 120 && ms <= w.at + 520);
  return <>
    <Sequence from={fr(off)}><Audio src={staticFile(vo)} /></Sequence>
    <Audio src={staticFile(music)} volume={(f) => { const ms = (f / FPS) * 1000; return (voiceAt(ms) ? 0.05 : 0.11) * Math.min(1, (total - ms) / 500); }} />
    {fx.map(([file, t, v], i) => <Sequence key={i} from={Math.max(0, fr(t))}><Audio src={staticFile(`inside/sfx/${file}.wav`)} volume={v} /></Sequence>)}
    {beds.map(([file, a, b, v], i) => <Sequence key={`b${i}`} from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>
      <Audio src={staticFile(`inside/sfx/${file}.wav`)} loop volume={(f) => v * Math.min(1, f / 8, (fr(b) - fr(a) - f) / 8)} /></Sequence>)}
  </>;
};
