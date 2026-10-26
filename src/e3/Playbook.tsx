// Edit3 · u1 "Playbook": how an NFL playbook changes week to week. You install hundreds of plays in camp, then the
// coaches pull this week's plan from that inventory, tweak formations and motions, and add 8–10 new plays.
// Look: blueprint (navy grid, cyan linework, Oswald + Space Mono): a literal "INSTALLING OFFENSE" progress bar, route
// tiles drawn on, an inventory wall where this week's plays light up and fly forward. Mood serious → phonk (Montagem
// Pegadora, 15.7 s drop on "HUNDREDS").
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/u1_playbook.seats.json';
import {
  Cam, Captions, Draw, FPS, Grain, H, Music, SfxTrack, SpeechTrack, Vignette, W, clamp, ease, flashAt, land, mattesFor, pop, punchAt,
  sfx, shakeAt, timeline, whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod2/u1_playbook.mp4';
const tl = timeline([[14280, 18300], [20100, 24360], [36780, 45070], [48700, 54900, 800]]);
export const PLAYBOOK_MS = tl.total;
const S = tl.segOut; // 0 4020 8280 16570
const T = {installing: 280, entire: 1460, offense: 1900, hundreds: 2720, plays: 3680, pass: 4740, pa: 5840, screens: 6540, everything: 7680,
  coaches: 9140, inventory: 10560, system: 12380, thisWeek: 13360, week: 14200, formation: 15280, motion: 16140, add: 17450, newPlays: 18390,
  eight: 20450, ten: 21850, aWeek: 22530};
const NAVY = '#06214D';
const CYAN = '#7FD3FF';
const ORANGE = '#FF8A3D';
const OSW = {fontFamily: 'Oswald', fontWeight: 700, letterSpacing: '0.01em', lineHeight: 0.92} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.6)';

const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who: () => 'M', mattes: mattesFor('u1'),
  grade: 'contrast(1.12) saturate(0.85) brightness(0.9) hue-rotate(-8deg)',
  faceY: (o) => (o >= S[2] && o < S[3] ? 0.62 : 0.42),
  zoom: (o) => punchAt([[T.hundreds, S[1], 1.15], [T.eight, tl.total, 1.12]], o) * (1 + 0.04 * ((o % 4200) / 4200)),
};

// blueprint grid overlay
const Grid = ({o, a = 1}: {o: number; a?: number}) => (
  <AbsoluteFill style={{opacity: a, backgroundImage: `linear-gradient(rgba(127,211,255,0.16) 2px, transparent 2px), linear-gradient(90deg, rgba(127,211,255,0.16) 2px, transparent 2px),
    linear-gradient(rgba(127,211,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(127,211,255,0.07) 1px, transparent 1px)`,
    backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px', backgroundPosition: `0 ${(o / 40) % 120}px`}} />
);
// a little play diagram (routes drawn on)
const PlayTile = ({o, at, kind, label, w = 300, lit = true}: {o: number; at: number; kind: number; label?: string; w?: number; lit?: boolean}) => {
  const p = ease(o, at, 600);
  const h = w * 0.72;
  const routes = [
    ['M150,150 C150,90 150,60 150,30', 'M70,150 L70,70 L120,40', 'M230,150 L230,90 L180,60'],
    ['M150,160 C150,110 170,80 230,60', 'M60,150 L60,40', 'M240,150 L240,80 L270,60'],
    ['M150,160 L140,170 M140,170 C120,120 90,90 60,60', 'M250,150 L250,40', 'M50,150 L50,90 L120,90'],
    ['M150,165 L200,175 C240,170 260,150 270,130', 'M80,150 L80,60', 'M220,150 L220,70 L160,50'],
  ][kind % 4];
  return <div style={{width: w, height: h, borderRadius: 10, border: `3px solid ${lit ? CYAN : 'rgba(127,211,255,0.35)'}`, background: lit ? 'rgba(6,33,77,0.85)' : 'rgba(6,33,77,0.55)',
    boxShadow: lit ? `0 0 24px rgba(127,211,255,0.35)` : undefined, position: 'relative', overflow: 'hidden'}}>
    <svg width={w} height={h} viewBox="0 0 300 216">
      <line x1={0} x2={300} y1={150} y2={150} stroke="rgba(127,211,255,0.35)" strokeWidth={3} strokeDasharray="8 8" />
      {[-2, -1, 0, 1, 2].map((i) => <circle key={i} cx={150 + i * 26} cy={150} r={9} fill="none" stroke="white" strokeWidth={3} />)}
      <circle cx={150} cy={175} r={9} fill={ORANGE} />
      {routes.map((d, i) => <Draw key={i} d={d} p={p} color={i ? CYAN : ORANGE} width={5} len={260} />)}
    </svg>
    {label && <div style={{position: 'absolute', left: 10, top: 6, ...MONO, fontSize: w / 14, color: 'white'}}>{label}</div>}
  </div>;
};

// ---- hook: "installing your entire offense, which is HUNDREDS of plays" ---------------------------------------------
const Install = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  const pct = Math.round(interpolate(o, [T.installing, T.plays + 200], [0, 100], {...clamp, easing: Easing.inOut(Easing.quad)}));
  return <>
    <Grid o={o} a={0.55} />
    <div style={{position: 'absolute', left: 80, top: 1180, width: 920, ...land(o, 80, 'up')}}>
      <div style={{...MONO, fontSize: 34, color: CYAN, marginBottom: 12}}>{pct < 100 ? '> INSTALLING OFFENSE…' : '> OFFENSE INSTALLED ✓'}</div>
      <div style={{height: 44, border: `3px solid ${CYAN}`, borderRadius: 8, padding: 5}}>
        <div style={{height: '100%', width: `${pct}%`, background: `repeating-linear-gradient(90deg, ${CYAN} 0 18px, rgba(127,211,255,0.6) 18px 24px)`, borderRadius: 4,
          boxShadow: `0 0 20px ${CYAN}`}} /></div>
      <div style={{...MONO, fontSize: 30, color: 'white', marginTop: 10, textAlign: 'right'}}>{pct}%</div>
    </div>
  </>;
};
const HookBehind = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', top: 110, width: W, textAlign: 'center'}}>
    <div style={{...OSW, fontSize: 120, color: 'white', textShadow: shadow, ...land(o, T.installing, 'left')}}>INSTALLING</div>
    <div style={{...OSW, fontSize: 84, color: CYAN, textShadow: shadow, ...land(o, T.entire, 'up')}}>YOUR ENTIRE OFFENSE</div>
    <div style={{...OSW, fontSize: 210, color: CYAN, textShadow: `0 0 50px rgba(127,211,255,0.6), ${shadow}`, ...land(o, T.hundreds, 'slam')}}>HUNDREDS</div>
    <div style={{...MONO, fontSize: 64, color: 'white', textShadow: shadow, ...land(o, T.plays, 'up')}}>OF PLAYS.</div>
  </div>;
};

// ---- "runs, pass concepts, play action, screens. You're installing everything." ----------------------------------------
const Concepts = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[2]) return null;
  const all = ease(o, T.everything, 500);
  const items: [string, number][] = [['RUNS', S[1] + 100], ['PASS CONCEPTS', T.pass], ['PLAY ACTION', T.pa], ['SCREENS', T.screens]];
  return <>
    <AbsoluteFill style={{background: `rgba(6,33,77,${0.55 + 0.25 * all})`}} />
    <Grid o={o} />
    <div style={{position: 'absolute', left: 60, top: 300, width: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, perspective: 1400,
      transform: `scale(${1 - 0.5 * all}) translateY(${-all * 200}px)`, transformOrigin: '50% 0'}}>
      {items.map(([l, at], i) => o >= at && <div key={l} style={{transform: `rotateX(${(1 - pop(o, at, 14, 160)) * 70}deg)`, transformOrigin: '50% 100%'}}>
        <PlayTile o={o} at={at} kind={i} label={l} w={465} /></div>)}
    </div>
    {all > 0 && <div style={{position: 'absolute', left: 30, top: 760, width: 1020, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, opacity: all}}>
      {Array.from({length: 24}).map((_, i) => <div key={i} style={{transform: `scale(${pop(o, T.everything + i * 18, 14, 200)})`}}>
        <PlayTile o={o} at={T.everything + i * 18} kind={i} w={160} /></div>)}
    </div>}
    <div style={{position: 'absolute', top: 120, width: W, textAlign: 'center', ...OSW, fontSize: 120, color: 'white', textShadow: shadow}}>
      {o < T.everything ? <span style={land(o, S[1] + 60, 'up')}>INSTALL IT ALL</span> : <span style={{color: ORANGE, ...land(o, T.everything, 'slam')}}>EVERYTHING.</span>}
    </div>
  </>;
};

// ---- "the coaches take our whole inventory... this is what we're running this week... formation / motion" -------------------
const Inventory = ({o}: {o: number}) => {
  if (o < S[2] || o >= S[3]) return null;
  const pick = [3, 9, 14, 20, 27, 31, 38, 44];
  const sel = ease(o, T.thisWeek, 600, Easing.inOut(Easing.cubic));
  const tweak = o >= T.formation - 200;
  return <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1000, background: `linear-gradient(180deg, ${NAVY} 80%, rgba(6,33,77,0))`}}><Grid o={o} /></div>
    <div style={{position: 'absolute', top: 90, width: W, textAlign: 'center'}}>
      <div style={{...MONO, fontSize: 40, color: CYAN, ...land(o, T.coaches, 'up')}}>THE COACHES TAKE OUR WHOLE</div>
      <div style={{...OSW, fontSize: 130, color: 'white', textShadow: shadow, ...land(o, T.inventory, 'slam')}}>{sel > 0.5 ? <span style={{color: ORANGE}}>THIS WEEK</span> : 'INVENTORY'}</div>
    </div>
    {!tweak && <div style={{position: 'absolute', left: 40, top: 330, width: 1000, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8}}>
      {Array.from({length: 48}).map((_, i) => {
        const k = pick.indexOf(i);
        const chosen = k >= 0;
        const p = pop(o, T.inventory - 300 + i * 12, 14, 220);
        const tx = chosen ? sel * ((k % 4) * 245 + 30 - ((i % 8) * 125)) : 0;
        const ty = chosen ? sel * (40 + Math.floor(k / 4) * 190 - Math.floor(i / 8) * 95) : 0;
        return <div key={i} style={{transform: `translate(${tx}px, ${ty}px) scale(${p * (chosen ? 1 + sel * 0.75 : 1)})`, opacity: chosen ? 1 : 1 - 0.75 * sel, zIndex: chosen ? 2 : 1}}>
          <PlayTile o={o} at={T.inventory + i * 12} kind={i} w={115} lit={!chosen || sel > 0.3} /></div>;
      })}
    </div>}
    {tweak && <div style={{position: 'absolute', left: 140, top: 320, width: 800, height: 560, ...land(o, T.formation - 200, 'zoom')}}>
      <svg width={800} height={560} viewBox="0 0 400 280" style={{overflow: 'visible'}}>
        <rect x={0} y={0} width={400} height={280} rx={10} fill="rgba(6,33,77,0.9)" stroke={CYAN} strokeWidth={2} />
        <line x1={0} x2={400} y1={190} y2={190} stroke="rgba(127,211,255,0.4)" strokeDasharray="6 6" />
        {[-2, -1, 0, 1, 2].map((i) => <circle key={i} cx={200 + i * 24} cy={190} r={8} fill="none" stroke="white" strokeWidth={2.5} />)}
        <circle cx={200} cy={215} r={8} fill={ORANGE} />
        {(() => {
          const fx = interpolate(o, [T.formation, T.formation + 400], [60, 300], {...clamp, easing: Easing.inOut(Easing.cubic)});
          const mx = interpolate(o, [T.motion, T.motion + 500], [340, 130], {...clamp, easing: Easing.inOut(Easing.cubic)});
          return <>
            <circle cx={fx} cy={192} r={8} fill={CYAN} /><circle cx={o >= T.motion ? mx : 340} cy={194} r={8} fill={CYAN} />
            {o >= T.motion && <path d={`M340,200 L${mx},200`} stroke={ORANGE} strokeWidth={3} strokeDasharray="5 5" />}
          </>;
        })()}
        <text x={14} y={30} fontFamily="Space Mono" fontWeight={700} fontSize={16} fill={o >= T.formation ? ORANGE : 'white'}>FORMATION ✓</text>
        <text x={14} y={56} fontFamily="Space Mono" fontWeight={700} fontSize={16} fill={o >= T.motion ? ORANGE : 'rgba(255,255,255,0.4)'}>MOTION ✓</text>
      </svg>
    </div>}
  </>;
};

// ---- "add a couple new plays, give or take 8 to 10 a week" ------------------------------------------------------------
const NewBehind = ({o}: {o: number}) => {
  if (o < S[3]) return null;
  return <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center'}}>
    <div style={{...OSW, fontSize: 104, color: 'white', textShadow: shadow, ...land(o, T.add, 'up')}}>+ NEW PLAYS</div>
    <div style={{...OSW, fontSize: 330, color: ORANGE, textShadow: `0 0 50px rgba(255,138,61,0.5), ${shadow}`}}>
      <span style={{display: 'inline-block', ...land(o, T.eight, 'slam')}}>8</span><span style={{display: 'inline-block', ...land(o, T.ten, 'slam')}}>–10</span></div>
    <div style={{...MONO, fontSize: 70, color: 'white', textShadow: shadow, marginTop: -20, ...land(o, T.aWeek, 'up')}}>A WEEK</div>
  </div>;
};
const WeekBoard = ({o}: {o: number}) => {
  if (o < S[3]) return null;
  const n = Math.round(interpolate(o, [T.newPlays, T.ten + 200], [0, 10], clamp));
  return <div style={{position: 'absolute', left: 60, top: 1170, width: 960, ...land(o, S[3] + 100, 'up')}}>
    <div style={{display: 'flex', justifyContent: 'space-between', ...MONO, fontSize: 30, color: CYAN, marginBottom: 10}}><span>THIS WEEK</span><span>+{n} NEW</span></div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8}}>
      {Array.from({length: 10}).map((_, i) => <div key={i} style={{height: 70, borderRadius: 6, border: `2px solid ${i < n ? ORANGE : 'rgba(127,211,255,0.3)'}`,
        background: i < n ? 'rgba(255,138,61,0.25)' : 'rgba(6,33,77,0.6)', transform: `translateY(${i < n ? 0 : -6}px)`, boxShadow: i < n ? `0 0 16px rgba(255,138,61,0.5)` : undefined}} />)}
    </div>
  </div>;
};

const CAPS: Cap[] = [
  [S[1] + 100, 'ALL THESE DIFFERENT'], [T.pass, 'PASS CONCEPTS,', 'PASS CONCEPTS'], [T.pa, 'PLAY ACTION,', 'PLAY ACTION'], [T.screens, 'SCREENS.', 'SCREENS'],
  [6960, "YOU'RE INSTALLING"], [7340, 'JUST EVERYTHING.', 'EVERYTHING', ORANGE], [8340, 'BUT THE COACHES'], [9360, 'ARE JUST TAKING'], [10020, 'OUR WHOLE INVENTORY', 'INVENTORY'],
  [11040, 'OF ALL THE PLAYS'], [11900, 'WE HAVE IN OUR SYSTEM'], [12740, 'AND THIS IS'], [13680, "WHAT WE'RE RUNNING"], [14000, 'THIS WEEK', 'THIS WEEK', ORANGE],
  [14380, 'AND WE MIGHT CHANGE'], [15180, 'THE FORMATION HERE', 'FORMATION'], [15900, 'OR THE MOTION HERE', 'MOTION'], [16690, 'AND WE MIGHT ADD'],
  [17970, 'A COUPLE NEW PLAYS', 'NEW PLAYS', ORANGE], [19030, 'LIKE, GIVE OR TAKE'], [20450, 'EIGHT TO TEN', 'EIGHT TO TEN', ORANGE], [22270, 'A WEEK.'],
];

export const Playbook = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.hundreds, 12], [T.everything, 8], [T.eight, 10], [T.ten, 10]], o);
  const cuts = [S[1], S[2], S[3]];
  const wh = whipAt(cuts, o, 'x', 220);
  const scan = cuts.map((c) => (o >= c && o < c + 350 ? ease(o, c, 350) : -1)).find((v) => v >= 0);
  const flash = flashAt([[T.hundreds, 0.25], [T.thisWeek + 300, 0.2]], o);
  return (
    <AbsoluteFill style={{background: '#020a18'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.03)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} behind={<><HookBehind o={o} /><NewBehind o={o} /></>} />
        <AbsoluteFill style={{background: 'rgba(10,40,90,0.22)', mixBlendMode: 'multiply'}} />
        <Install o={o} />
        <Concepts o={o} />
        <Inventory o={o} />
        <WeekBoard o={o} />
      </AbsoluteFill>
      {scan !== undefined && <div style={{position: 'absolute', left: 0, top: scan * H - 6, width: W, height: 12, background: CYAN, boxShadow: `0 0 40px 12px ${CYAN}`, opacity: 1 - scan}} />}
      <Captions o={o} caps={CAPS} off={[[0, S[1] + 100]]} top={1650} keyColor={CYAN}
        style={{...OSW, fontSize: 60, color: 'white'}} box={{background: 'rgba(6,33,77,0.92)', padding: '8px 22px 12px', borderRadius: 10, border: `2px solid ${CYAN}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
      <Vignette color="0,6,20" strength={0.75} />
      <Grain frame={frame} opacity={0.07} />
      {flash > 0 && <AbsoluteFill style={{background: CYAN, opacity: flash, mixBlendMode: 'screen'}} />}
      <SpeechTrack src={SRC} tl={tl} />
      {/* Montagem Pegadora: 15.7 s drop on "HUNDREDS" */}
      <Music file="montagem-pegadora.mp3" songFrom={15700 - T.hundreds} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.hundreds - 200 && t < T.hundreds) return 0.03;
        if (t >= tl.total - 800) return 0.4 * end;
        return (tl.playing(t) ? (t > T.hundreds ? 0.14 : 0.1) : 0.3) * Math.min(1, t / 120);
      }} />
      <SfxTrack list={[
        sfx('scan-beep', 0, 0.3), sfx('keyboard-typing', T.installing, 0.22, 2300), sfx('mg-click', T.entire, 0.25), sfx('mg-boom', T.hundreds, 0.18),
        sfx('mg-swoosh2', T.hundreds, 0.28), sfx('ding', T.plays + 200, 0.3),
        sfx('scan-beep', S[1], 0.3), sfx('mg-whoosh', S[1], 0.28), ...[S[1] + 100, T.pass, T.pa, T.screens].map((t) => sfx('mg-click', t, 0.3)),
        ...Array.from({length: 8}).map((_, i) => sfx('mg-click', T.everything + i * 50, 0.12)), sfx('mg-swoosh', T.everything, 0.3),
        sfx('scan-beep', S[2], 0.3), sfx('mg-whoosh', S[2], 0.28), ...Array.from({length: 10}).map((_, i) => sfx('mg-click', T.inventory - 300 + i * 60, 0.1)),
        sfx('mg-swoosh2', T.thisWeek, 0.35), sfx('ding-2', T.week, 0.3), sfx('mg-whoosh', T.formation - 200, 0.25), sfx('mg-click', T.formation, 0.3), sfx('mg-swoosh', T.motion, 0.3),
        sfx('scan-beep', S[3], 0.3), sfx('mg-whoosh', S[3], 0.28), ...Array.from({length: 10}).map((_, i) => sfx('mg-click', T.newPlays + i * 300, 0.16)),
        sfx('mg-boom', T.eight, 0.16), sfx('mg-boom', T.ten, 0.18), sfx('mg-shimmer', T.aWeek, 0.3),
      ]} />
    </AbsoluteFill>
  );
};
