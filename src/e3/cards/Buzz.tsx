// Edit3 card pull · Buzz Lightyear "Golden Toys" super auto 1/1 (signed by Tim Allen), pulled right after the Woody
// super: back to back. Look: space mission HUD: the stream's burned banner becomes a mission checklist (Woody ✓,
// Buzz ☐ → ✓ at the reveal), a scanning reticle over the blurred card, warp streaks at the reveal, "transmission
// ending" for "good night, ladies and gentlemen". Hook: "I feel like a dinosaur!" (a Rex nod).
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import narr from '../../../public/narr/b3_buzz.json';
import {Blurs, HookAudio, HookView, HostAudio, Narration, Riser, StreamView, cardTimeline, narrCaps, narrSpans, type NarrLine, type Placed} from '../cardkit';
import {Captions, FPS, Grain, H, Music, SfxTrack, W, clamp, ease, flashAt, land, pop, sfx, shakeAt, type Cap} from '../kit';

const SRC = 'b3/k_toy_story.mp4';
const HOOK = {file: 'hooks/i_feel_like_a_dinasour.mp4', from: 0, ms: 1700};
const tl = cardTimeline(HOOK.ms, [{src: [0, 5300]}, {src: [5300, 7600], rate: 0.5}, {src: [7600, 12200]}, {src: [13100, 14400]}, {src: [18500, 20000]}]);
export const BUZZ_MS = tl.total;
const S = tl.segOut; // 1700 7000 11600 16200 17500
const R = S[2];
const LINES = narr as NarrLine[];
const PLACED: Placed[] = [{line: 0, at: HOOK.ms + 50}, {line: 1, at: S[1] + 50}, {line: 2, at: R + 150}];
const [L1, L2, L3] = narrSpans(LINES, PLACED);
const n3 = (ms: number) => L3[0] + ms - LINES[2].file[0];
const T = {woody: L1[0] + 1140, base: 5480, card: R + 400, name: n3(7460), sup: n3(8620), oneOf: n3(9540), b2b: n3(10700), dangs: [14040, 14640, 15760],
  night: 16300, done: 17640};
const CYAN = '#5CE1FF';
const LIME = '#B6FF3B';
const PURP = '#7B5CFF';
const ORB = {fontFamily: 'Orbitron', fontWeight: 800, letterSpacing: '0.04em'} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const glow = (c: string) => `0 0 18px ${c}, 0 6px 22px rgba(0,0,0,0.7)`;

const camAt = (o: number) => {
  const s = tl.srcAt(o);
  if (o >= S[1] && o < R) { const p = ease(o, S[1], R - S[1], Easing.in(Easing.quad)); return {z: 1 + 0.3 * p, x: 540, y: 1250, tr: p * 5}; }
  if (o >= R && o < S[3]) return s < 9600 ? {z: 1.12 - 0.04 * ease(o, R, 800), x: 540, y: 1300, tr: 0} : {z: 1.25, x: 540, y: 230, tr: 0};
  return {z: 1.03, x: 540, y: 960, tr: 0};
};

// second slot stays encrypted until Alex says the name, then decodes letter by letter
const GLYPHS = '#%&*?@$XZ';
const decode = (o: number) => {
  const shown = Math.floor(interpolate(o, [T.name, T.name + 520], [0, 4], clamp));
  return 'BUZZ'.split('').map((c, i) => (i < shown ? c : GLYPHS[(Math.floor(o / 70) * 7 + i * 3) % GLYPHS.length])).join('');
};
// the mission checklist sits where the stream's burned-in banner was
const Mission = ({o}: {o: number}) => {
  if (o < HOOK.ms) return null;
  const buzz = o >= T.oneOf;
  const tick = ease(o, T.oneOf, 250);
  const box = (label: string, on: boolean, hot: boolean, p = 1) => <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{width: 46, height: 46, borderRadius: 8, border: `4px solid ${on ? LIME : CYAN}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: hot ? `0 0 20px ${LIME}` : undefined, background: on ? 'rgba(182,255,59,0.15)' : 'transparent'}}>
      {on && <svg width={34} height={34} viewBox="0 0 34 34"><path d="M5,18 L14,27 L30,7" stroke={LIME} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * (1 - p)} /></svg>}
    </div>
    <div style={{...ORB, fontSize: 34, color: on ? LIME : 'white'}}>{label}</div>
  </div>;
  return <div style={{position: 'absolute', left: 0, top: 522, width: W, height: 186, background: 'linear-gradient(180deg, rgba(8,10,30,0.96), rgba(18,10,48,0.96))',
    borderTop: `3px solid ${CYAN}`, borderBottom: `3px solid ${CYAN}`, boxShadow: `0 0 30px rgba(92,225,255,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 130px', whiteSpace: 'nowrap', boxSizing: 'border-box'}}>
    <div>
      <div style={{...MONO, fontSize: 22, color: CYAN, letterSpacing: '0.25em'}}>MISSION</div>
      <div style={{...ORB, fontSize: 32, color: 'white'}}>BACK-TO-BACK SUPERS</div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {box('WOODY 1/1', true, o >= T.woody && o < T.woody + 1200)}
      {box(`${decode(o)} 1/1`, buzz, buzz, tick)}
    </div>
  </div>;
};
const Stars = ({o, warp}: {o: number; warp: number}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {Array.from({length: 80}).map((_, i) => {
      const a = (i * 137.5 * Math.PI) / 180;
      const d = ((i * 53 + o * (0.05 + warp * 0.9)) % 900) + 40;
      const x = 540 + Math.cos(a) * d, y = 960 + Math.sin(a) * d * 1.6;
      const len = 2 + warp * d * 0.35;
      return <line key={i} x1={x} y1={y} x2={540 + Math.cos(a) * (d + len)} y2={960 + Math.sin(a) * (d + len) * 1.6} stroke={i % 5 ? '#fff' : CYAN}
        strokeWidth={warp ? 3 : 2.5} strokeLinecap="round" opacity={0.25 + 0.6 * warp} />;
    })}
  </svg>
);
const Reticle = ({o}: {o: number}) => {
  if (o < S[1] || o >= R) return null;
  const pct = Math.round(interpolate(o, [S[1] + 200, R - 200], [0, 99], clamp));
  const r = 220 - 40 * ease(o, S[1], R - S[1]);
  return <div style={{position: 'absolute', left: 540 - r, top: 1260 - r, width: r * 2, height: r * 2}}>
    <svg width={r * 2} height={r * 2} style={{overflow: 'visible', transform: `rotate(${o / 20}deg)`}}>
      <circle cx={r} cy={r} r={r - 6} fill="none" stroke={CYAN} strokeWidth={5} strokeDasharray="40 22" />
      <circle cx={r} cy={r} r={r * 0.62} fill="none" stroke={CYAN} strokeWidth={3} opacity={0.6} />
    </svg>
    <div style={{position: 'absolute', left: -60, right: -60, top: r * 2 + 16, textAlign: 'center', ...MONO, fontSize: 32, color: CYAN, textShadow: glow(CYAN)}}>SCANNING… {pct}%</div>
  </div>;
};
const Reveal = ({o}: {o: number}) => {
  if (o < T.card || o >= S[3]) return null;
  const c = pop(o, T.card, 13, 150);
  return <>
    <div style={{position: 'absolute', left: 150, top: 720, width: 780, height: 606, transform: `perspective(1400px) rotateY(${(1 - c) * 70 + Math.sin(o / 500) * 8}deg) scale(${c})`,
      borderRadius: 18, overflow: 'hidden', border: '5px solid #f3d27a', boxShadow: `0 0 60px rgba(243,210,122,0.5), 0 30px 60px rgba(0,0,0,0.7)`, opacity: 1 - ease(o, n3(10000), 400)}}>
      <Img src={staticFile('img/b3/buzz_card.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${(o / 10) % 200 - 50}%, rgba(255,255,255,0.4) ${(o / 10) % 200 - 42}%, transparent ${(o / 10) % 200 - 34}%)`}} />
    </div>
    <div style={{position: 'absolute', top: 1370, width: W, textAlign: 'center'}}>
      <div style={{...ORB, fontSize: 104, color: 'white', textShadow: glow(PURP), lineHeight: 1, ...land(o, T.name, 'slam')}}>BUZZ</div>
      <div style={{...ORB, fontSize: 92, color: LIME, textShadow: glow(LIME), lineHeight: 1.05, ...land(o, T.name + 260, 'up')}}>LIGHTYEAR</div>
      <div style={{...MONO, fontSize: 34, color: CYAN, marginTop: 10, ...land(o, T.sup, 'up')}}>GOLDEN TOYS SUPER AUTO · SIGNED BY TIM ALLEN</div>
    </div>
    {o >= T.oneOf && <div style={{position: 'absolute', left: 800, top: 1230, ...ORB, fontSize: 92, color: '#111', background: LIME, padding: '2px 26px', borderRadius: 10,
      transform: `rotate(-8deg) scale(${2.2 - 1.2 * ease(o, T.oneOf, 160)})`, boxShadow: `0 0 30px ${LIME}`}}>1/1</div>}
  </>;
};
const Dangs = ({o}: {o: number}) => {
  if (o < T.dangs[0] || o >= S[3]) return null;
  return <div style={{position: 'absolute', top: 880, width: W, textAlign: 'center'}}>
    {T.dangs.map((at, i) => o >= at && <div key={i} style={{...ORB, fontSize: 120 + i * 30, lineHeight: 1, color: i === 2 ? LIME : 'white', textShadow: glow(i === 2 ? LIME : PURP),
      ...land(at === T.dangs[i] ? o : o, at, 'slam')}}>DANG!</div>)}
  </div>;
};
const Ending = ({o}: {o: number}) => {
  if (o < S[3]) return null;
  return <>
    <div style={{position: 'absolute', top: 160, width: W, textAlign: 'center'}}>
      {o < S[4] ? <div style={{...MONO, fontSize: 40, color: CYAN, textShadow: glow(CYAN), opacity: Math.floor(o / 400) % 2 ? 1 : 0.55, ...land(o, T.night - 100, 'up')}}>▌ TRANSMISSION ENDING…</div>
        : o >= T.done + 500 && <div style={{...ORB, fontSize: 96, lineHeight: 1, color: LIME, textShadow: glow(LIME), ...land(o, T.done + 500, 'slam')}}>MISSION<br />COMPLETE</div>}
    </div>
  </>;
};

const CAPS: Cap[] = [
  ...narrCaps(LINES, PLACED, 3, {}, {WOODY: '#FFB347', 'ONE OF ONE.': LIME, 'ONE OF': LIME, 'ONE CARD LEFT': CYAN, BACK: LIME}),
  [T.base, "LET'S GET OUR BASE"], [6260, 'OUT OF THE WAY.'],   [T.night, 'GOOD NIGHT,'], [16940, 'LADIES AND GENTLEMEN.'], [T.done, "THAT'S HOW IT'S DONE."],
];

export const Buzz = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const cam = camAt(o);
  const sh = shakeAt([[R, 18], [T.card, 10], [T.oneOf, 10], ...T.dangs.map((t) => [t, 12] as [number, number])], o);
  const trem = cam.tr ? {x: Math.sin(o * 0.9) * cam.tr, y: Math.cos(o * 1.1) * cam.tr} : {x: 0, y: 0};
  const warp = o >= R && o < R + 900 ? 1 - ease(o, R, 900) : o >= S[1] && o < R ? 0.15 * ease(o, S[1], R - S[1]) : 0;
  const flash = flashAt([[R, 0.85]], o);
  const hostGain = (t: number) => (t < L1[1] ? 0.25 : t < S[1] ? 1 : t < R ? 0 : t >= L3[0] - 100 && t < L3[1] ? 0.45 : 1);
  return (
    <AbsoluteFill style={{background: '#05061a'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + trem.x}px, ${sh.y + trem.y}px)`}}>
        {o < HOOK.ms ? <HookView file={HOOK.file} w={360} from={HOOK.from} cover={[20, 405, 320, 105]} push={1.04 + 0.05 * (o / HOOK.ms)} />
          : <AbsoluteFill style={{overflow: 'hidden'}}>
            <AbsoluteFill style={{transformOrigin: `${cam.x}px ${cam.y}px`, transform: `scale(${cam.z})`, filter: 'contrast(1.1) saturate(1.1) hue-rotate(-6deg)'}}>
              <StreamView src={SRC} srcW={1080} tl={tl} />
              <Blurs tl={tl} o={o} srcW={1080} boxes={[{src: [5300, 7600], box: [150, 850, 800, 800]}]} />
              <Mission o={o} />
            </AbsoluteFill>
            <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(20,10,60,0.55) 100%)'}} />
          </AbsoluteFill>}
        {(warp > 0 || (o >= S[1] && o < S[3])) && <Stars o={o} warp={warp} />}
        <Reticle o={o} />
        <Reveal o={o} />
        <Dangs o={o} />
        <Ending o={o} />
        {o < HOOK.ms && <div style={{position: 'absolute', top: 1480, width: W, textAlign: 'center', ...ORB, fontSize: 70, color: 'white', textShadow: glow(PURP), ...land(o, 300, 'up')}}>
          TWO 1/1s… <span style={{color: LIME}}>BACK TO BACK?</span></div>}
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, HOOK.ms], [T.name, S[3]]]} top={1640} anim="pop" keyColor={CYAN}
        style={{...ORB, fontSize: 52, color: '#fff', WebkitTextStroke: '3px #05061a', paintOrder: 'stroke fill', textShadow: glow(PURP)}} />
      <Grain frame={frame} opacity={0.07} />
      {flash > 0 && <AbsoluteFill style={{background: o < R + 60 ? '#fff' : CYAN, opacity: flash}} />}
      <HookAudio file={HOOK.file} from={HOOK.from} ms={HOOK.ms} vol={0.9} />
      <HostAudio src={SRC} tl={tl} gain={hostGain} />
      <Narration file="narr/b3_buzz_loud.mp3" lines={LINES} placed={PLACED} />
      <Riser peakAt={R} lead={2600} vol={0.22} />
      {/* Eclipser: 15.8 s drop on the reveal */}
      <Music file="eclipser.mp3" songFrom={15800 - R} level={(t) => {
        if (t < HOOK.ms) return 0;
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= R - 350 && t < R) return 0;
        if (t < R) return 0.07;
        if (t >= L3[0] && t < L3[1]) return 0.1 * end;
        return 0.3 * end;
      }} />
      <SfxTrack list={[
        sfx('fast-whoosh', S[0], 0.32), sfx('mg-click', T.woody, 0.3), sfx('scan-beep', S[1] + 100, 0.3), sfx('scan-beep', S[1] + 1800, 0.25),
        sfx('heartbeat-loud', S[1] + 300, 0.32, R - S[1] - 400), sfx('mg-whoosh', R, 0.35), sfx('mg-boom', R, 0.18), sfx('mg-shimmer', T.card, 0.35),
        sfx('ding-2', T.oneOf + 100, 0.35), sfx('mg-click', T.oneOf, 0.35), ...T.dangs.map((t) => sfx('mg-click', t, 0.25)),
        sfx('fast-whoosh', S[3], 0.3), sfx('scan-beep', T.night - 100, 0.25), sfx('fast-whoosh', S[4], 0.3), sfx('ding-2', T.done + 500, 0.3),
      ]} />
    </AbsoluteFill>
  );
};
