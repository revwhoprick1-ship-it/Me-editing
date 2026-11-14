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
import MONTAGE from './tracks/montage.json';
import PIKACHU from './tracks/pikachu.json';
import CLOWN3 from './tracks/clown3.json';
import type {SceneConfig} from './clipData';

const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('res/Montserrat-Black.woff2'), weight: '800'});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BOX_TOP = 417, BOX_BOTTOM = 1494, BOX_H = BOX_BOTTOM - BOX_TOP, K = BOX_H / 1080;
const GREEN = 'rgb(167,234,4)', RED = 'rgb(244,3,5)';
type Ref = [string, string?, number?];   // [scene] = scene start, [scene, word, nth] = that word
type Cfg = {top: string; cta: string; label: string; track: Record<string, number[]>; calls: [number, number, string?][]; tints: [Ref, string][]; rizz: Ref[];
  punch: Ref[]; blowouts: Ref[]; blackFlash: Ref[]; streaks: Ref[]; music: number; loop?: boolean; ctaAt?: Ref; musicVol?: number; subBand?: [number, number]; blurOff?: [number, number][]; musicFile?: string; hl?: Record<string, string>; pushIn?: boolean; src?: string};

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
  // same clips the user's reference Shorts used (YRs8B6FaVbE / IeC6Lxv_EvQ montage; 0UpfENqRCXQ laugh hook), current style
  refmontage: {top: 'Guess the fake LARPER millionaire', cta: '*real or LARP?*', label: '*Clown*', track: MONTAGE, music: 200, loop: true, ctaAt: ['main', 'could'],
    calls: [[218.72, 221.28, '*Hulk*'], [228.56, 230.68, '*FOMO Eyes*'], [244.20, 246.28, '*Iron Man*'], [267.12, 273.84, '*Clown*']],
    tints: [[['lotus', 'lotus'], GREEN], [['mercedes', 'mercedes'], GREEN], [['m3', 'm3'], GREEN], [['mom', 'mom'], RED], [['main', 'mustangs'], GREEN], [['main', 'laughing'], RED]],
    rizz: [['lotus', 'lotus'], ['mercedes', 'mercedes'], ['m3', 'm3'], ['main', 'mustangs']],
    punch: [['hook', 'expensive'], ['lotus', 'lotus'], ['mercedes', 'mercedes'], ['m3', 'm3'], ['mom', 'mom', 1], ['main', 'mustangs'], ['main', 'sell'], ['main', 'laughing'], ['main', 'two', 1], ['main', 'wrong']],
    blowouts: [['main', 'sell']], blackFlash: [['lotus'], ['mercedes'], ['m3'], ['main']], streaks: [['lotus'], ['mercedes'], ['m3'], ['main']]},
  reflaugh: {top: 'Spot the millionaire LARPER', cta: '*would you buy two of the same car?*', label: '*Clown*', track: CLOWN, music: 230, loop: true, ctaAt: ['main', 'could'],
    calls: [[269.40, 272.92], [272.92, 273.84]],
    tints: [[['hook', 'laughing'], RED], [['main', 'mustangs'], GREEN], [['main', 'laughing'], RED], [['main', 'two', 1], GREEN]], rizz: [['main', 'mustangs'], ['main', 'two', 1]],
    punch: [['hook', 'laughing'], ['hook', 'believe'], ['main', 'two'], ['main', 'mustangs'], ['main', 'sell'], ['main', 'sucks'], ['main', 'two', 1], ['main', 'wrong']],
    blowouts: [['main', 'sell']], blackFlash: [['main']], streaks: [['main']]},
  // the episode's cold open (0-24.6 s, continuous); its burned-in captions sit mid-frame -> taller blur band; music at 70 % (user)
  intro: {top: 'Guess the crypto millionaire LARPER', cta: '*who do you think is the LARPER?*', label: '*Pikachu*', track: PIKACHU, music: 0, loop: true, ctaAt: ['main', 'and', 1],
    musicVol: 0.7, subBand: [0.6, 0.36], blurOff: [[23.2, 25]], calls: [[19.96, 20.92]],
    tints: [[['main', 'millionaire'], GREEN], [['main', '100x'], GREEN], [['main', 'larp'], RED], [['main', 'fake', 1], RED], [['main', 'pikachu'], GREEN], [['main', 'crypto', 2], GREEN]],
    rizz: [['main', '100x'], ['main', 'pikachu']],
    punch: [['main', 'seven'], ['main', 'millionaire'], ['main', '100x'], ['main', 'larp'], ['main', 'fake'], ['main', 'fake', 1], ['main', 'tokenize', 1], ['main', 'delusional'], ['main', 'larp', 2]],
    blowouts: [['main', '100x']], blackFlash: [['main', 'however'], ['main', 'this']], streaks: [['main', 'however'], ['main', 'what']]},
  // data-picked set (score.py: crowd-reaction audio peaks + hook number/conflict density + late payoff); music 70 %
  twopct: {top: 'Is the Clown the millionaire LARPER?', cta: '*real or LARP?*', label: '*Clown*', track: CLOWN3, music: 260, loop: true, ctaAt: ['main', 'where'], musicVol: 0.7,
    calls: [[194.92, 196.44], [197.84, 198.32], [198.32, 198.84], [201.00, 201.60], [202.80, 203.68], [204.28, 204.80]],
    tints: [[['main', '67'], GREEN], [['main', '2%'], RED], [['main', '$200k'], GREEN], [['main', 'puerto'], GREEN]], rizz: [['main', '67'], ['main', '$200k']],
    punch: [['main', 'pino'], ['main', '67'], ['main', '2%'], ['main', '2%', 1], ['main', '$200k'], ['main', 'realistic'], ['main', 'puerto'], ['main', 'san']],
    blowouts: [['main', '2%', 1]], blackFlash: [['main', '2%', 1]], streaks: [['main', 'where']]},
  chainlink: {top: 'Holding Chainlink = millionaire LARPER?', cta: '*comment if you still hold Chainlink*', label: '', track: {}, music: 300, loop: true, ctaAt: ['main', 'bro'], musicVol: 0.7,
    calls: [],
    tints: [[['main', 'chainlink'], GREEN], [['main', 'wrong'], RED], [['main', 'chainlink', 2], GREEN]], rizz: [['main', 'chainlink'], ['main', 'chainlink', 2]],
    punch: [['main', 'holds'], ['main', 'chainlink'], ['main', 'chainlink', 1], ['main', 'everything'], ['main', 'wrong'], ['main', 'chainlink', 2], ['main', 'iq'], ['main', 'sus']],
    blowouts: [['main', 'iq']], blackFlash: [['main', 'wrong']], streaks: [['main', 'if']]},
  livetrade: {top: "The millionaire LARPER's live trade fooled him", cta: '*would you have spotted the LARPER?*', label: '', track: {}, music: 340, loop: true, ctaAt: ['main', 'bro'], musicVol: 0.7,
    calls: [],
    tints: [[['main', 'solid'], GREEN], [['main', 'tabbed'], RED], [['main', 'actually', 1], GREEN]], rizz: [['main', 'solid'], ['main', 'actually', 1]],
    punch: [['main', 'clot'], ['main', 'real'], ['main', '100%'], ['main', 'tabbed'], ['main', 'quick'], ['main', 'walkthrough'], ['main', 'actually', 1], ['main', 'knows']],
    blowouts: [['main', 'tabbed']], blackFlash: [['main', 'did']], streaks: [['main', 'alright']]},
  sevenfigs: {top: 'Real millionaire or LARPER?', cta: '*real millionaire or LARP?*', label: '*Thanos*', track: THANOS, music: 70,
    calls: [[331.56, 332.96], [324.28, 325.28], [326.32, 331.56]],
    tints: [[['main', 'seven'], GREEN], [['main', 'exchanges'], RED], [['main', 'seven', 2], GREEN]], rizz: [['main', 'seven'], ['main', 'seven', 2]],
    punch: [['hook', 'seven'], ['hook', 'seven', 1], ['main', 'seven'], ['main', 'launched'], ['main', 'seven', 1], ['main', 'seven', 2], ['main', 'impressive']],
    blowouts: [['hook', 'seven']], blackFlash: [['main']], streaks: [['main', 'seven', 1]]},
};
// 10 "viral" edits: auto-planned (autoplan.py shots/crops/tracks, autocfg.py cues from caption words), loop style, music 70 %
import AUTO from './auto.cfg.json';
import IRONREVEAL from './ironTrack.json';
import T_RICHEST from './tracks/auto/richest.json';
import T_BIRKIN from './tracks/auto/birkin.json';
import T_FAMILY from './tracks/auto/family.json';
const AUTO_TRACKS: Record<string, Record<string, number[]>> = {confess: IRONREVEAL as Record<string, number[]>, richest: T_RICHEST, birkin: T_BIRKIN, family: T_FAMILY};
Object.entries(AUTO as unknown as Record<string, {top: string; cta: string; music: number; calls: [number, number, string][]; tints: [Ref, string][]; rizz: Ref[]; punch: Ref[];
  blowouts: Ref[]; blackFlash: Ref[]; streaks: Ref[]; ctaAt: Ref}>).forEach(([id, a]) => {
  EDITS[id] = {top: a.top, cta: a.cta, label: '', track: AUTO_TRACKS[id] ?? {}, music: a.music, loop: true, ctaAt: a.ctaAt, musicVol: 0.7, calls: a.calls,
    tints: a.tints.map(([r, c]) => [r, c === 'G' ? GREEN : RED] as [Ref, string]), rizz: a.rizz, punch: a.punch, blowouts: a.blowouts, blackFlash: a.blackFlash, streaks: a.streaks};
});
// v5 formula (STW fix): payoff-first hook -> rewind scrub -> full-context story with payoff, 15-20 s, music 53 % rotating
// chess / phonk / say goodbye (loudness-matched copies *_n.mp3), highlighted keyword in the text hook, constant push-in per shot.
import V5 from './v5.cfg.json';
import T_GIFT from './tracks/gift.json';
import T_MERCH from './tracks/merch.json';
import T_PISSED from './tracks/auto5/pissed.json';
import V6 from './v6.cfg.json';
import R3 from './r3.cfg.json';
import TV from './tv.cfg.json';
import T_CHANT_IRON from './tracks/chant_iron.json';
import T_CLOWN_SOL from './tracks/clown_sol.json';
const V5_TRACKS: Record<string, Record<string, number[]>> = {iron: IRONREVEAL as Record<string, number[]>, gift: T_GIFT, merch: T_MERCH, pissed: T_PISSED, hulk: HULK,
  chant_iron: T_CHANT_IRON, solstice: T_CLOWN_SOL};
Object.entries({...V5, ...V6, ...R3, ...TV} as unknown as Record<string, {top: string; hl: Record<string, string>; cta: string; music: [string, number]; ctaAt: Ref; track: string; calls: [number, number, string][];
  tints: [Ref, string][]; rizz: Ref[]; punch: Ref[]; blowouts: Ref[]; blackFlash: Ref[]; streaks: Ref[]; src?: string}>).forEach(([id, a]) => {
  EDITS[id] = {src: a.src, subBand: a.src ? [1, 0] : undefined, top: a.top, hl: a.hl, cta: a.cta, label: '', track: V5_TRACKS[a.track] ?? {}, music: a.music[1], musicFile: a.music[0], musicVol: 0.53, loop: !(a as {intro?: boolean}).intro, pushIn: true,
    ctaAt: a.ctaAt, calls: a.calls, tints: a.tints.map(([r, c]) => [r, c === 'G' ? GREEN : RED] as [Ref, string]), rizz: a.rizz, punch: a.punch,
    blowouts: a.blowouts, blackFlash: a.blackFlash, streaks: a.streaks};
});
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
  // Black flash 2 (v3, per user): a see-through black flash every 0.2 s (6 frames) for the whole video, no zoom/shake.
  // Key moments (old big flash spots) get a slightly darker one.
  const bd = f % 3, big = near(BLACK, f, 18) !== undefined;
  const bfa = bd === 0 ? 0.04 : 0;   // constant 4 % every 0.1 s (user)

  const fi = cfg.loop ? 999 : f;   // loop edits skip the intro so the restart is invisible
  const hblur = fi < 16 ? interpolate(f, [0, 16], [46, 0], clamp) : (() => { const d = near(STREAKS, f, 4); return d === undefined ? 0 : [70, 48, 26, 8][d]; })();
  const filter = (() => {
    const p = ['saturate(1.3) contrast(1.06)'];
    if (hblur > 0) p.push('url(#hblur)');
    if (fi < 16) p.push(`brightness(${interpolate(f, [0, 5, 10, 16], [2.5, 1.9, 1.3, 1], clamp)}) contrast(${interpolate(f, [0, 16], [0.75, 1], clamp)})`);
    const s = near(STREAKS, f, 4); if (s !== undefined) p.push(`brightness(${[1.5, 1.3, 1.15, 1.05][s]})`);
    const w = near(BLOW, f, WB.length); if (w !== undefined && WB[w]) p.push(WB[w]);
    return p.join(' ');
  })();
  const pu = near(PUNCH, f, 12), punch = pu === undefined ? 1 : interpolate(pu, [0, 2, 12], [1.13, 1.11, 1], clamp);
  const bfZoom = 1;
  // constant slow push-in that restarts on every camera cut (never a still frame)
  const si0 = SCENES.findIndex((s) => f >= START[s.id] && f < START[s.id] + s.durationInFrames), sc0 = SCENES[Math.max(0, si0)], lf0 = f - START[sc0.id];
  const cr0 = sc0.crops ?? [[0, 0]], ci = cr0.filter(([t]) => t <= lf0).length - 1, shotA = cr0[Math.max(0, ci)][0], shotB = cr0[ci + 1]?.[0] ?? sc0.durationInFrames;
  const push = cfg.pushIn ? 1 + 0.06 * Math.min(1, (lf0 - shotA) / Math.max(1, shotB - shotA)) : 1;
  const zoom = (fi < 19 ? interpolate(f, [0, 18], [1.14, 1], clamp) : 1) * Math.max(punch, bfZoom) * push;
  const shake = pu === 0 ? 8 : pu === 1 ? -5 : 0;
  const top = interpolate(fi, [0, 3, 6, 9, 12, 15, 18, 21, 24], [609, 573, 537, 504, 474, 450, 432, 420, BOX_TOP], clamp);
  const bot = interpolate(fi, [0, 3, 6, 9, 12, 15, 18, 21, 24], [1308, 1341, 1377, 1410, 1434, 1458, 1479, 1491, BOX_BOTTOM], clamp);
  const tint = TINTS.map(([t, c]) => [TINT[f - t], c] as const).find(([a]) => a !== undefined);

  // current scene (for crop + tracked call-out)
  const si = SCENES.findIndex((s) => f >= START[s.id] && f < START[s.id] + s.durationInFrames), sc = SCENES[Math.max(0, si)], lf = f - START[sc.id];
  // crop = [frame, centre x] or [frame, centre x, zoom, centre y] (speaker push-in on static multi-person shots)
  const crop = (sc.crops ?? [[0, sc.cropX]]).filter(([t]) => t <= lf).pop()! as number[];
  const cx = crop[1], cz = crop[2] ?? 1, cy = crop[3] ?? 540;
  const left = Math.min(0, Math.max(1080 - 1920 * K * cz, 540 - cx * K * cz)), vtop = Math.min(0, Math.max(BOX_H - BOX_H * cz, BOX_H / 2 - cy * K * cz)), tSrc = sc.videoStartSec + lf / fps;
  const call = cfg.calls.find(([a, b]) => tSrc >= a + 1 / 30 && tSrc < b), cp = call && track(tSrc);

  // caption word
  const words = SCENES.flatMap((s) => s.words.map((w) => ({...w, at: START[s.id] + w.startFrame, end: START[s.id] + w.endFrame, sceneEnd: START[s.id] + s.durationInFrames})));
  let wi = -1; words.forEach((w, j) => { if (f >= w.at) wi = j; });
  const word = wi >= 0 && f < words[wi].sceneEnd && f <= words[wi].end + 20 ? words[wi] : null, wk = word ? f - word.at : 9;
  const ctaFrom = cfg.ctaAt ? at(cfg.ctaAt) : END - 75, ctaTo = cfg.ctaAt ? ctaFrom + 75 : END;

  // every effect carries the SFX the reference Shorts pair with it (sfxmatch on refs): call-out/rewind/white blow-out -> flash,
  // green tint -> rizz (riser 10 frames before), red tint / big black flash -> shock, punch-in -> pop. One sound per 5-frame window.
  const RAW: [string, number, number][] = [
    ...SCENES.filter((s) => (s as SceneConfig & {rewind?: unknown}).rewind).map((s): [string, number, number] => ['flash.mp3', START[s.id], 0.45]),
    ...callStarts.map((t): [string, number, number] => ['flash.mp3', t, 0.4]),
    ...BLACK.map((t): [string, number, number] => ['shock.mp3', t, 0.5]),
    ...TINTS.filter(([, c]) => c === GREEN).map(([t]): [string, number, number] => ['rizz.mp3', t, 0.42]),
    ...RIZZ.map((t): [string, number, number] => ['rizz.mp3', t, 0.42]),
    ...TINTS.filter(([, c]) => c === RED).map(([t]): [string, number, number] => ['shock.mp3', t, 0.4]),
    ...BLOW.map((t): [string, number, number] => ['flash.mp3', t, 0.38]),
    ...TINTS.filter(([, c]) => c === GREEN).slice(0, 1).map(([t]): [string, number, number] => ['riser.mp3', t - 10, 0.3]),
    ...PUNCH.map((t): [string, number, number] => ['pop.mp3', t, 0.22]),
  ];
  const FX: [string, number, number][] = [];
  RAW.forEach((x) => { if (x[1] >= 0 && !FX.some((y) => Math.abs(y[1] - x[1]) < 5)) FX.push(x); });
  return <AbsoluteFill style={{backgroundColor: '#000'}}>
    <svg width="0" height="0" style={{position: 'absolute'}}><filter id="hblur" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 1.5`} /></filter></svg>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: 1080, height: BOX_H, overflow: 'hidden', clipPath: `inset(${top - BOX_TOP}px 0 ${BOX_BOTTOM - bot}px 0)`}}>
      <AbsoluteFill style={{transform: `translateX(${shake}px) scale(${zoom})`, filter}}>
        <Series>{SCENES.map((s) => <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
          {(s as SceneConfig & {rewind?: [number, number]}).rewind ? Array.from({length: s.durationInFrames}, (_, i) => {
            // rewind scrub: one frame per output frame, sampled backwards from the hook's end to the story's start
            const [ra, rb] = (s as SceneConfig & {rewind: [number, number]}).rewind, t = ra + (rb - ra) * (i / Math.max(1, s.durationInFrames - 1));
            return <Sequence key={i} from={i} durationInFrames={1}><OffthreadVideo src={staticFile(cfg.src ?? 'source.mp4')} muted startFrom={Math.round(t * fps)} style={{position: 'absolute', top: 0, left: 540 - 960 * K, width: 1920 * K, height: BOX_H}} /></Sequence>;
          }) : <OffthreadVideo src={staticFile(cfg.src ?? 'source.mp4')} startFrom={Math.round(s.videoStartSec * fps)} style={{position: 'absolute', top: s === sc ? vtop : 0, left: s === sc ? left : 0, width: 1920 * K * (s === sc ? cz : 1), height: BOX_H * (s === sc ? cz : 1)}} />}
        </Series.Sequence>)}</Series>
        {!(cfg.blurOff ?? []).some(([a, b]) => tSrc >= a && tSrc < b) && <div style={{position: 'absolute', left: -60, right: -60, maskImage: 'linear-gradient(to bottom, transparent, #000 18%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 18%)', top: BOX_H * (cfg.subBand?.[0] ?? 0.9), height: BOX_H * (cfg.subBand?.[1] ?? 0.12), backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', background: 'rgba(0,0,0,0.08)'}} />}
        {call && cp && left + cp[0] * K < 1000 && <Callout x={left + cp[0] * K} y={cp[1] * K} r={Math.max(48, cp[2] * K * 1.35)} k={Math.min(1, (tSrc - call[0]) * 6)} label={call[2] ?? cfg.label} />}
      </AbsoluteFill>
      {tint && <AbsoluteFill style={{background: tint[1], opacity: tint[0], mixBlendMode: 'multiply'}} />}
      {bfa > 0 && <AbsoluteFill style={{background: '#000', opacity: bfa}} />}
      {(sc as SceneConfig & {rewind?: [number, number]}).rewind && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 7px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 170, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill', transform: `translateX(${-lf * 6}px)`, opacity: 0.92}}>◀◀</div>
      </AbsoluteFill>}
    </div>
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - top + 3, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: MONT, fontWeight: 700, fontSize: 58, lineHeight: '65px', color: 'white', textAlign: 'center', maxWidth: 940}}>
        {cfg.top.split(' ').slice(0, -1).map((w, i) => <span key={i} style={{color: cfg.hl?.[w] ?? 'white'}}>{w} </span>)}<span style={{whiteSpace: 'nowrap', color: cfg.hl?.[cfg.top.split(' ').pop()!] ?? 'white'}}>{cfg.top.split(' ').pop()}<Img src={staticFile('res/skull.png')} style={{width: 50, height: 50, verticalAlign: '-6px', marginLeft: 4}} /></span>
      </div>
    </div>
    {word && <div style={{position: 'absolute', left: 0, width: 1080, top: 1060, textAlign: 'center', ...(wk < 2 ? {transform: `scaleX(${wk === 0 ? 1.35 : 1.15})`, filter: `blur(${wk === 0 ? 5 : 2.5}px)`, opacity: 0.85} : {})}}>
      <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 68, color: '#FFFFFF', WebkitTextStroke: '7px #000', paintOrder: 'stroke fill', textShadow: '0 3px 8px rgba(0,0,0,0.7)'}}>{word.word}</span>
    </div>}
    {f >= ctaFrom && f < ctaTo && <div style={{position: 'absolute', left: 0, width: 1080, top: 1250, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontStyle: 'italic', fontSize: 42, color: '#fff', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill', opacity: Math.min(1, (f - ctaFrom) / 5)}}>{cfg.cta}</div>}
    <Audio src={staticFile(`res/${cfg.musicFile ?? 'goodbye'}.mp3`)} startFrom={cfg.music * fps} volume={cfg.musicVol ?? 0.09} />
    {FX.map(([file, t, v], i) => <Sequence key={i} from={Math.max(0, t)}><Audio src={staticFile(`res/${file}`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
