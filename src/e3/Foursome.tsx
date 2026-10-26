// Edit3 · t2 "Foursome": dream golf foursome of all-time humans → "throw Jesus in there" → Tiger, the goat →
// the boys gift Trevor a game-worn Tiger patch auto. Look: country-club green + cream scorecard that fills in as the
// names land (slot 4 stays open: "your pick?"), heavenly rays, Tiger rising behind Trevor, ball-in-the-hole iris wipe.
// Mood funny → Du bist gut genug (full version, 42.5 s drop on "TIGER").
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import track from '../plans/data/t2_dream_golf_four.seats.json';
import {
  Cam, Captions, Emoji, FPS, Grain, H, Music, SfxTrack, Sparkle, SpeechTrack, Vignette, W, clamp, ease, flashAt, land,
  mattesFor, pop, punchAt, sfx, shakeAt, timeline, whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod/t2_dream_golf_four.mp4';
const tl = timeline([[11080, 14100], [16840, 18820], [32120, 35780], [45320, 48580], [50400, 54620], [76820, 79520], [83960, 84980],
  [85940, 86900], [87400, 89980, 900]]);
export const FOURSOME_MS = tl.total;
const S = tl.segOut; // 0 3020 5000 8660 11920 16140 18840 19860 20820
const T = {dream: 1300, four: 1760, course: 2440, allTime: 3480, humans: 3920, anybody: 4520, jesus: 6340, there: 6880, likeThat: 7780,
  good: 8340, obviously: 10100, tiger: 11340, goat: 12840, world: 13660, heGoat: 14720, sick: 15580, hole: S[5], note: 16700, gifts: 18540,
  exq: 19140, tiger2: 20040, gameWorn: 21000, patch: 22040, grade: 22920, end: 23300};
const GREEN = '#0E5A34';
const YELLOW = '#FFD24A';
const CREAM = '#F5EFDD';
const RED = '#D6182F';
const SERIF_I = {fontFamily: 'Cormorant Garamond', fontWeight: 700, fontStyle: 'italic'} as const;
const SERIF = {fontFamily: 'Cormorant Garamond', fontWeight: 700} as const;
const BLACK = {fontFamily: 'Archivo Black', letterSpacing: '-0.02em'} as const;
const PENCIL = {fontFamily: 'Caveat', fontWeight: 700} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.6)';

const who = (s: number) => {
  if (s < 34200) return 'L' as const;
  if (s < 45000) return 'R' as const;
  if (s < 52500) return 'M' as const;
  if (s < 53500) return 'R' as const;
  if (s < 60000) return 'M' as const;
  if (s < 80000) return 'W' as const;
  if (s < 87600) return 'R' as const;
  return 'L' as const;
};
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, mattes: mattesFor('t2'), wideX: 620,
  grade: 'contrast(1.1) saturate(1.12) brightness(0.95)',
  zoom: (o) => punchAt([[T.jesus, S[3], 1.12], [T.tiger, S[4], 1.12], [T.goat, T.heGoat, 1.1], [T.grade, tl.total, 1.12]], o) * (1 + 0.04 * ((o % 4500) / 4500)),
};

// ---- scorecard: slot 1 Trevor, 2 Jesus, 3 Tiger, 4 open ------------------------------------------------------
const SLOTS: [string, number, string][] = [['TREVOR', 700, '🏈'], ['JESUS', T.jesus, '✝'], ['TIGER', T.tiger, '🐐'], ['', 1e9, '']];
const Scorecard = ({o, y, last}: {o: number; y: number; last?: boolean}) => (
  <div style={{position: 'absolute', left: 90, top: y, width: 900, borderRadius: 18, overflow: 'hidden', background: CREAM,
    boxShadow: '0 40px 80px rgba(0,0,0,0.55)', transform: `rotate(-1.5deg)`}}>
    <div style={{background: GREEN, padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{...SERIF_I, fontSize: 52, color: YELLOW}}>Dream Foursome</div>
      <div style={{...SERIF, fontSize: 30, color: CREAM, letterSpacing: '0.2em'}}>ALL-TIME</div>
    </div>
    {SLOTS.map(([name, at], i) => {
      const p = ease(o, at, 350);
      const open = i === 3;
      return <div key={i} style={{display: 'flex', alignItems: 'center', height: 92, borderTop: i ? '2px solid rgba(14,90,52,0.25)' : undefined}}>
        <div style={{width: 90, textAlign: 'center', ...BLACK, fontSize: 40, color: GREEN}}>{i + 1}</div>
        <div style={{flex: 1, borderLeft: '2px solid rgba(14,90,52,0.25)', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 26}}>
          {open
            ? <span style={{...PENCIL, fontSize: 64, color: last ? RED : 'rgba(0,0,0,0.25)', transform: last ? `scale(${1 + 0.06 * Math.sin(o / 90)})` : undefined,
              display: 'inline-block'}}>{last ? 'your pick?' : '?'}</span>
            : <span style={{...PENCIL, fontSize: 70, color: i === 2 ? RED : '#1d2a22', clipPath: `inset(0 ${100 - p * 100}% 0 0)`}}>{name}</span>}
        </div>
        {Array.from({length: 4}).map((_, h) => <div key={h} style={{width: 70, height: '100%', borderLeft: '2px solid rgba(14,90,52,0.25)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', ...PENCIL, fontSize: 40, color: '#444', opacity: open ? 0 : p}}>{[3, 4, 3, 2][(h + i) % 4]}</div>)}
      </div>;
    })}
  </div>
);
const CardIn = ({o}: {o: number}) => {
  const shows: [number, number][] = [[250, S[1]], [T.jesus - 200, S[3]], [T.tiger - 100, S[4] + 600], [T.end + 100, tl.total + 1000]];
  const s = shows.find(([a, b]) => o >= a && o < b);
  if (!s) return null;
  const inP = pop(o, s[0], 15, 130);
  const outP = ease(o, s[1] - 250, 250);
  return <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - inP) * 800 + outP * 900}px)`}}>
    <Scorecard o={o} y={1010} last={s[0] > T.end} /></div>;
};

// ---- hook ----------------------------------------------------------------------------------------------------
const HookBehind = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', top: 120, width: W, textAlign: 'center', lineHeight: 0.86}}>
    <div style={{...SERIF_I, fontSize: 96, color: 'white', textShadow: shadow, ...land(o, 120, 'up')}}>what's your</div>
    <div style={{...SERIF_I, fontSize: 150, color: YELLOW, textShadow: shadow, ...land(o, T.dream, 'up')}}>dream</div>
    <div style={{...BLACK, fontSize: 168, color: 'white', textShadow: shadow, ...land(o, T.four, 'slam')}}>FOURSOME</div>
  </div>;
};
const AllTime = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[2]) return null;
  return <div style={{position: 'absolute', top: 200, width: W, textAlign: 'center', lineHeight: 0.9}}>
    <div style={{...SERIF_I, fontSize: 120, color: CREAM, textShadow: shadow, ...land(o, S[1] + 20, 'up')}}>all-time</div>
    <div style={{...BLACK, fontSize: 170, color: YELLOW, textShadow: shadow, ...land(o, T.humans, 'slam')}}>HUMANS</div>
    <div style={{...PENCIL, fontSize: 80, color: 'white', textShadow: shadow, marginTop: 20, ...land(o, T.anybody, 'up')}}>could be anybody</div>
  </div>;
};

// ---- "throw Jesus in there": heaven opens ------------------------------------------------------------------------
const Heaven = ({o}: {o: number}) => {
  if (o < T.jesus - 100 || o >= S[3]) return null;
  const p = ease(o, T.jesus, 500);
  return <>
    <AbsoluteFill style={{background: `conic-gradient(from ${180 + o / 40}deg at 50% -5%, ${Array.from({length: 14}).map((_, i) =>
      `rgba(255,248,214,${i % 2 ? 0 : 0.28 * p}) ${i * (360 / 14)}deg`).join(', ')})`, mixBlendMode: 'screen'}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 0%, rgba(255,250,225,${0.55 * p}) 0%, transparent 55%)`, mixBlendMode: 'screen'}} />
    <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center'}}>
      <div style={{width: 360, height: 70, margin: '0 auto', borderRadius: '50%', border: `10px solid ${YELLOW}`, boxShadow: `0 0 40px ${YELLOW}`,
        opacity: p, transform: `translateY(${(1 - p) * -80}px)`}} />
      <div style={{...SERIF_I, fontSize: 240, lineHeight: 0.9, color: '#FFF8DC', textShadow: `0 0 60px rgba(255,230,150,0.9), ${shadow}`, ...land(o, T.jesus, 'down', 450)}}>Jesus</div>
      <div style={{...PENCIL, fontSize: 70, color: 'white', textShadow: shadow, ...land(o, T.likeThat, 'up')}}>"that would be a good one"</div>
    </div>
  </>;
};

// ---- Tiger: rises behind Trevor, 15 majors ------------------------------------------------------------------------
const TigerBehind = ({o}: {o: number}) => {
  if (o < S[3] || o >= S[4]) return null;
  const r = pop(o, T.tiger - 150, 16, 90);
  return <>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 75% 80%, rgba(214,24,47,${0.4 * r}), transparent 55%)`}} />
    <Img src={staticFile('cutouts/tiger.png')} style={{position: 'absolute', left: 560, top: 640 + (1 - r) * 1100, height: 1050,
      filter: 'drop-shadow(0 0 40px rgba(214,24,47,0.6)) contrast(1.05)'}} />
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center', lineHeight: 0.88}}>
      <div style={{...SERIF_I, fontSize: 92, color: CREAM, textShadow: shadow, ...land(o, T.obviously, 'up')}}>obviously…</div>
      <div style={{...BLACK, fontSize: 300, color: RED, textShadow: `0 0 50px rgba(214,24,47,0.6), ${shadow}`, ...land(o, T.tiger, 'slam')}}>TIGER</div>
    </div>
  </>;
};
const Goat = ({o}: {o: number}) => {
  if (o < S[4] || o >= S[5]) return null;
  const n = Math.round(interpolate(o, [T.goat, T.world + 300], [1, 15], clamp));
  return <>
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center'}}>
      <div style={{...SERIF_I, fontSize: 110, color: CREAM, textShadow: shadow, ...land(o, S[4] + 40, 'up')}}>the</div>
      <div style={{...BLACK, fontSize: 250, lineHeight: 0.9, color: YELLOW, textShadow: shadow, ...land(o, T.goat, 'slam')}}>GOAT</div>
    </div>
    <Emoji code="1f410" size={170} style={{left: 820, top: 190, transform: `scale(${pop(o, T.goat + 80, 9, 220)}) rotate(14deg)`}} />
    {o >= T.goat && <div style={{position: 'absolute', left: 70, top: 1080, ...land(o, T.goat, 'left')}}>
      <div style={{...BLACK, fontSize: 200, lineHeight: 0.85, color: 'white', textShadow: shadow}}>{n}</div>
      <div style={{...SERIF, fontSize: 64, color: YELLOW, letterSpacing: '0.1em', textShadow: shadow}}>MAJORS</div>
    </div>}
    {o >= T.heGoat && <div style={{position: 'absolute', right: 60, top: 1130, ...PENCIL, fontSize: 80, color: 'white', transform: 'rotate(-6deg)', textShadow: shadow,
      ...land(o, T.heGoat, 'right')}}>"he IS the goat"</div>}
  </>;
};
// ball rolls into the cup, the cup opens into the next shot
const Ball = ({o}: {o: number}) => {
  if (o < T.hole - 650 || o >= T.hole) return null;
  const p = ease(o, T.hole - 650, 650, Easing.in(Easing.quad));
  return <>
    <div style={{position: 'absolute', left: 520, top: 1452, width: 110, height: 40, borderRadius: '50%', background: '#050805', boxShadow: '0 0 0 6px rgba(255,255,255,0.15)'}} />
    <div style={{position: 'absolute', left: -60 + 640 * p, top: 1400 + (p > 0.92 ? (p - 0.92) * 600 : 0), width: 70, height: 70, borderRadius: 35,
      background: 'radial-gradient(circle at 35% 30%, #fff, #d9d9d9 60%, #9a9a9a)', transform: `rotate(${p * 720}deg)`, boxShadow: '0 10px 18px rgba(0,0,0,0.5)'}} />
  </>;
};

// ---- the gift: game-worn Tiger patch auto, 9.5 ---------------------------------------------------------------------
const Gift = ({o}: {o: number}) => {
  if (o < S[5] || o >= S[6]) return null;
  return <>
    <div style={{position: 'absolute', top: 190, width: W, textAlign: 'center', lineHeight: 0.9}}>
      <div style={{...SERIF_I, fontSize: 110, color: CREAM, textShadow: shadow, ...land(o, T.note, 'up')}}>on that Tiger note…</div>
      <div style={{...BLACK, fontSize: 200, color: YELLOW, textShadow: shadow, ...land(o, T.gifts, 'slam')}}>GIFTS</div>
    </div>
    <Emoji code="1f381" size={190} style={{left: 445, top: 560, transform: `scale(${pop(o, T.gifts, 8, 200)}) rotate(${Math.sin(o / 80) * 8}deg)`}} />
  </>;
};
const Slab = ({o}: {o: number}) => {
  if (o < S[6]) return null;
  const inP = pop(o, S[6] + 60, 14, 120);
  const g = interpolate(o, [T.grade, T.grade + 400], [0, 9.5], clamp);
  const hide = o > T.end + 100 ? ease(o, T.end + 100, 250) : 0;
  return <>
    <div style={{position: 'absolute', top: 180, width: W, textAlign: 'center', lineHeight: 0.9, opacity: 1 - hide}}>
      <div style={{...SERIF_I, fontSize: 130, color: YELLOW, textShadow: shadow, ...land(o, T.exq, 'up')}}>exquisite.</div>
    </div>
    <div style={{position: 'absolute', left: 140, top: 520, width: 800, perspective: 1400, opacity: 1 - hide}}>
      <div style={{transform: `translateY(${(1 - inP) * 1200}px) rotateY(${Math.sin(o / 600) * 10}deg) rotateX(6deg)`, borderRadius: 26, padding: 22,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08))', border: '4px solid rgba(255,255,255,0.6)', boxShadow: '0 50px 90px rgba(0,0,0,0.7)'}}>
        <div style={{background: 'linear-gradient(180deg,#fafafa,#dedede)', borderRadius: 10, padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{...BLACK, fontSize: 40, color: RED, opacity: ease(o, T.tiger2, 200)}}>TIGER WOODS</div>
            <div style={{...BLACK, fontSize: 24, color: '#333', opacity: ease(o, T.gameWorn, 200)}}>GAME-WORN · <span style={{opacity: ease(o, T.patch, 200)}}>PATCH AUTO</span></div>
          </div>
          <div style={{width: 130, height: 110, borderRadius: 10, background: g > 0 ? `linear-gradient(160deg, #FFE48A, #C99A1C)` : '#ccc', display: 'flex', alignItems: 'center',
            justifyContent: 'center', ...BLACK, fontSize: 64, color: '#1b1b1b', boxShadow: g >= 9.5 ? '0 0 30px #FFD24A' : undefined}}>{g ? g.toFixed(1) : ''}</div>
        </div>
        <div style={{marginTop: 18, height: 420, borderRadius: 12, background: `linear-gradient(160deg, ${RED}, #5c0612)`, position: 'relative', overflow: 'hidden'}}>
          <Img src={staticFile('cutouts/tiger.png')} style={{position: 'absolute', left: -40, bottom: -30, height: 470}} />
          <div style={{position: 'absolute', right: 40, top: 70, width: 260, height: 170, borderRadius: 12, background: 'repeating-linear-gradient(45deg,#1a1a1a 0 8px,#2b2b2b 8px 16px)',
            border: '5px solid #e8e8e8', opacity: ease(o, T.patch, 250)}} />
          <div style={{position: 'absolute', right: 40, bottom: 40, ...PENCIL, fontSize: 70, color: 'white', opacity: ease(o, T.patch + 200, 400)}}>Tiger Woods</div>
        </div>
      </div>
    </div>
    {g >= 9.5 && [[220, 560, 80, T.grade + 400], [900, 640, 70, T.grade + 550], [700, 1050, 60, T.grade + 700]].map(([x, y, s, at], i) => <Sparkle key={i} x={x} y={y} s={s} o={o} at={at} />)}
  </>;
};

const CAPS: Cap[] = [
  [S[1] + 20, 'ALL-TIME HUMANS.'], [4400, 'COULD BE ANYBODY.'], [5120, 'I FEEL LIKE'], [5660, 'YOU GOT TO'], [6100, 'THROW JESUS IN THERE', 'JESUS'],
  [7660, 'I LIKE THAT.'], [8200, 'THAT WOULD BE A GOOD ONE.'], [8820, 'I FEEL LIKE'], [9360, 'IT WOULD BE COOL,'], [10100, 'OBVIOUSLY,'],
  [10480, 'TO PLAY WITH LIKE TIGER', 'TIGER', RED], [11980, 'LIKE THE GOAT', 'GOAT'], [13140, 'IN THE GOLF WORLD.'], [14280, 'HE IS THE GOAT.', 'GOAT'],
  [15280, "THAT'D BE PRETTY SICK."], [16200, 'BUT LIKE ON THAT'], [16700, 'TIGER NOTE,', 'TIGER', RED], [17580, 'YOU KNOW,'], [17820, 'I GOT YOU'],
  [18220, 'A BUNCH OF GIFTS.', 'GIFTS'], [18960, 'THIS IS EXQUISITE,'], [T.tiger2, 'TIGER,', 'TIGER', RED], [T.gameWorn, 'GAME-WORN,'],
  [T.patch, 'PATCH AUTO,'], [T.grade, '9.5', '9.5'],
];

export const Foursome = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.four, 8], [T.tiger, 14], [T.goat, 10], [T.grade + 400, 8]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4], S[6], S[7], S[8]], o, 'y', 220);
  const iris = o >= T.hole && o < T.hole + 380 ? interpolate(o, [T.hole, T.hole + 380], [0, 1500], {...clamp, easing: Easing.in(Easing.quad)}) : null;
  const flash = flashAt([[T.jesus, 0.45], [T.tiger, 0.3]], o);
  return (
    <AbsoluteFill style={{background: '#050a06'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.03)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined,
        clipPath: iris !== null ? `circle(${iris}px at 575px 1472px)` : undefined}}>
        <Cam c={cam} o={o} behind={<><HookBehind o={o} /><TigerBehind o={o} /></>} />
        <AllTime o={o} />
        <Heaven o={o} />
        <Goat o={o} />
        <Gift o={o} />
        <Slab o={o} />
        <CardIn o={o} />
        <Ball o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, S[1]], [T.four, S[1]], [T.end + 100, tl.total + 1]]} top={1600} keyColor={YELLOW}
        style={{...BLACK, fontSize: 60, color: 'white', WebkitTextStroke: '3px #04150b', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.75)'}} />
      <Vignette color="2,14,6" strength={0.7} />
      <Grain frame={frame} opacity={0.07} />
      {flash > 0 && <AbsoluteFill style={{background: '#FFF8DC', opacity: flash}} />}
      <SpeechTrack src={SRC} tl={tl} />
      {/* Du bist gut genug (full): 42.5 s drop on "TIGER" */}
      <Music file="du-bist-full.mp3" songFrom={42500 - T.tiger} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.tiger - 220 && t < T.tiger) return 0.03;
        if (t >= tl.total - 900) return 0.42 * end;
        return (tl.playing(t) ? 0.13 : 0.3) * Math.min(1, t / 120);
      }} />
      <SfxTrack list={[
        sfx('mg-swoosh2', 0, 0.25), sfx('mg-swoosh', 250, 0.3), sfx('pen-scribble', 700, 0.3), sfx('mg-click', T.dream, 0.3), sfx('mg-whoosh', T.four, 0.3), sfx('pen-scribble', T.four + 250, 0.35),
        sfx('whoosh', S[1], 0.3), sfx('mg-click', T.humans, 0.3), sfx('pen-scribble', T.anybody, 0.25),
        sfx('whoosh', S[2], 0.3), sfx('anime-wow', T.jesus, 0.3), sfx('mg-shimmer', T.jesus, 0.4), sfx('pen-scribble', T.jesus + 150, 0.35),
        sfx('whoosh', S[3], 0.3), sfx('mg-boom', T.tiger, 0.2), sfx('mg-swoosh2', T.tiger, 0.3), sfx('pen-scribble', T.tiger + 150, 0.35),
        sfx('mg-click', T.goat, 0.3), ...Array.from({length: 7}).map((_, i) => sfx('mg-click', T.goat + 100 + i * 110, 0.14)), sfx('mg-click', T.heGoat, 0.25),
        sfx('mg-swoosh', T.hole - 650, 0.25), sfx('ding', T.hole - 40, 0.3), sfx('mg-whoosh', T.hole, 0.3),
        sfx('mg-click', T.gifts, 0.3), sfx('mg-swoosh2', T.gifts, 0.25),
        sfx('whoosh', S[6], 0.3), sfx('mg-swoosh', S[6] + 60, 0.35), sfx('mg-click', T.tiger2, 0.3), sfx('mg-click', T.gameWorn, 0.25), sfx('mg-click', T.patch, 0.25),
        sfx('cha-ching', T.grade + 400, 0.3), sfx('mg-shimmer', T.grade + 400, 0.35), sfx('mg-swoosh2', T.end + 100, 0.3), sfx('pen-scribble', T.end + 400, 0.35),
      ]} />
    </AbsoluteFill>
  );
};
