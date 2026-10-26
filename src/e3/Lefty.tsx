// Edit3 · t3 "Lefty": Trevor throws better rolling LEFT because coaches only ever let kids roll right.
// Look: chalkboard X's & O's + sepia flashback + mirror flip; everything moves leftward. Mood serious → phonk
// (Funk Sigilo, drop on "LEFT").
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/t3_traveling_trevors.seats.json';
import {
  Cam, Captions, Draw, Emoji, FPS, Grain, H, Music, SfxTrack, SpeechTrack, Vignette, W, Written, clamp, ease, f, flashAt, land,
  mattesFor, pop, punchAt, sfx, shakeAt, timeline, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod/t3_traveling_trevors.mp4';
const tl = timeline([[47880, 50800], [22460, 24220], [25860, 33760], [34160, 39860], [44780, 46560], [50800, 53320, 700]]);
export const LEFTY_MS = tl.total;
const S = tl.segOut; // 0, 2920, 4680, 12580, 18280, 20060
const T = {left: 1560, right: 2040, kid: 3960, split: S[2], roll: 6160, rollouts: 7040, rightWord: 7720, most: 8380, their: 9880,
  hated: 11620, back: S[3], wayMore: 13360, left2: 14480, flip: 15500, guy: 16280, onlyRight: 16960, strike: 17800, tally: S[4],
  left3: 19020, best: 20340, qb: 20540, ever: 21360, biased: 22000};
const TEAL = '#19D3DA';
const RED = '#FF5A5A';
const CHALK = 'rgba(245,245,235,0.92)';
const ANTON = {fontFamily: 'Anton', letterSpacing: '0.01em', lineHeight: 0.9} as const;
const HAND = {fontFamily: 'Caveat', fontWeight: 700} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.65)';

const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who: (s) => (s >= 50800 ? 'R' : 'M'), mattes: mattesFor('t3'),
  grade: 'contrast(1.12) saturate(0.92) brightness(0.92) hue-rotate(-6deg)',
  zoom: (o) => punchAt([[T.left, S[1], 1.15], [T.left2, T.flip, 1.15], [T.best, tl.total, 1.12]], o) * (1 + 0.04 * ((o % 4000) / 4000)),
};
// every cut smears to the LEFT (the whole edit leans left)
const leftWhip = (o: number) => {
  const c = [S[1], S[2], S[3], S[4], S[5]].find((t) => o >= t && o < t + 220);
  if (c === undefined) return {t: '', b: 0};
  const p = 1 - ease(o, c, 220);
  return {t: `translateX(${-p * 110}px)`, b: p * 22};
};

// chalk look: rough edges
const ChalkDefs = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={5} /></filter>
  </svg>
);
const Board = ({h}: {h: number}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: h, overflow: 'hidden',
    background: 'radial-gradient(ellipse at 45% 40%, #2c3b33 0%, #18231d 70%, #101813 100%)'}}>
    {[[220, 260, 420], [760, 520, 380], [430, 720, 300]].map(([x, y, r], i) => <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2,
      height: r, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(40px)'}} />)}
    <svg width={W} height={h} style={{position: 'absolute', inset: 0, opacity: 0.18, mixBlendMode: 'screen'}}>
      <filter id="dust"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} /></filter><rect width={W} height={h} filter="url(#dust)" /></svg>
  </div>
);

// ---- hook: "I throw it better moving LEFT than right" -----------------------------------------------
const HookBehind = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  const sweep = interpolate(o, [0, 520], [1300, -1400], {...clamp, easing: Easing.out(Easing.quad)});
  return <>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${sweep},0)`} filter="url(#chalk)">
        <path d="M1000,560 L120,560 M120,560 l80,-60 M120,560 l80,60" stroke={CHALK} strokeWidth={34} strokeLinecap="round" fill="none" opacity={0.5} />
      </g>
    </svg>
    <div style={{position: 'absolute', top: 230, left: 0, width: W, textAlign: 'center', ...ANTON, fontSize: 380, color: TEAL,
      textShadow: `0 0 60px ${TEAL}88, ${shadow}`, ...land(o, T.left, 'right')}}>LEFT</div>
  </>;
};
const HookFront = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  // left vs right bars: "a little bit better" = nearly equal, left a touch longer
  const b = ease(o, T.right + 120, 500);
  return <>
    <div style={{position: 'absolute', top: 130, width: W, textAlign: 'center', ...ANTON, fontSize: 92, color: 'white', textShadow: shadow}}>
      <span style={{display: 'inline-block', ...land(o, 40, 'left')}}>I THROW IT</span>{' '}
      <span style={{display: 'inline-block', color: TEAL, ...land(o, 960, 'left')}}>BETTER</span>
    </div>
    <div style={{position: 'absolute', left: 70, top: 1250, width: 940, ...land(o, T.right, 'left')}}>
      {[['LEFT', 0.92, TEAL], ['RIGHT', 0.86, 'rgba(255,255,255,0.55)']].map(([t, v, c], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16}}>
          <div style={{...ANTON, fontSize: 54, color: 'white', width: 170, textShadow: shadow}}>{t}</div>
          <div style={{height: 46, width: 740 * (v as number) * b, background: c as string, borderRadius: 8, boxShadow: i ? 'none' : `0 0 24px ${TEAL}`}} />
        </div>
      ))}
      <div style={{...HAND, fontSize: 40, color: 'rgba(255,255,255,0.8)', marginTop: 4, opacity: b}}>on the move</div>
    </div>
  </>;
};

// ---- flashback: "I remember being a kid too" ---------------------------------------------------------
const Flashback = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[2]) return null;
  const burn = interpolate(o - S[1], [0, 60, 260], [0, 0.9, 0], clamp);
  return <>
    <AbsoluteFill style={{background: 'rgba(120,70,20,0.25)', mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(20,10,0,0.85) 90%)'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 85% 20%, rgba(255,150,40,${burn}) 0%, transparent 60%)`}} />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: (Math.sin(o / 37 + i * 2) * 0.5 + 0.5) * W, top: 0, width: 2, height: H,
      background: 'rgba(255,240,210,0.35)'}} />)}
    <div style={{position: 'absolute', left: 60, top: 120, ...HAND, fontSize: 64, color: 'rgba(255,235,200,0.9)', transform: 'rotate(-4deg)', ...land(o, S[1] + 80, 'left')}}>
      flashback…</div>
    <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', ...ANTON, fontSize: 150, color: '#FFE7C2', textShadow: shadow, ...land(o, 3600, 'up')}}>
      BEING A <span style={{color: '#FFB347'}}>KID</span></div>
  </>;
};

// ---- split screen: coaches only want rollouts to the right ----------------------------------------------
const SplitBoard = ({o}: {o: number}) => {
  if (o < S[2] || o >= S[3]) return null;
  const inP = ease(o, S[2], 300);
  const roll = ease(o, T.roll, 900, Easing.inOut(Easing.cubic));
  const qb = {x: 540 + 300 * roll, y: 600 + 40 * Math.sin(roll * Math.PI)};
  const xP = ease(o, T.hated, 300);
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 900, transform: `translateY(${(inP - 1) * 900}px)`}}>
    <Board h={900} />
    <svg width={W} height={900} style={{position: 'absolute', inset: 0}} filter="url(#chalk)">
      {[160, 330, 500, 670].map((y) => <line key={y} x1={0} x2={W} y1={y} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth={5} strokeDasharray="30 22" />)}
      {[-2, -1, 0, 1, 2].map((i) => <circle key={i} cx={540 + i * 82} cy={500} r={30} stroke={CHALK} strokeWidth={8} fill="none" />)}
      <Draw d="M540,600 C640,640 760,660 840,640" p={roll} color={CHALK} width={9} len={330} />
      {roll > 0.95 && <path d="M840,640 l-34,-26 M840,640 l-38,16" stroke={CHALK} strokeWidth={9} strokeLinecap="round" />}
      <circle cx={qb.x} cy={qb.y} r={40} fill={TEAL} stroke={CHALK} strokeWidth={6} />
      <text x={qb.x} y={qb.y + 14} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#0b1712">16</text>
      {/* most people only want to throw to their right */}
      {Array.from({length: 7}).map((_, i) => {
        const at = T.most + i * 180;
        const p = ease(o, at, 160);
        const y = 120 + (i % 4) * 46;
        const x = 120 + Math.floor(i / 4) * 330 + (i % 2) * 60;
        return p > 0 && <g key={i} opacity={p}><path d={`M${x},${y} l${150 * p},0 m-30,-20 l30,20 l-30,20`} stroke="rgba(255,255,255,0.75)" strokeWidth={7} strokeLinecap="round" fill="none" /></g>;
      })}
      {xP > 0 && <g stroke={RED} strokeWidth={16} strokeLinecap="round"><line x1={90} y1={90} x2={90 + 800 * xP} y2={90 + 230 * xP} />
        <line x1={890} y1={90} x2={890 - 800 * Math.max(0, xP * 1.4 - 0.4)} y2={90 + 230 * Math.max(0, xP * 1.4 - 0.4)} /></g>}
    </svg>
    <div style={{position: 'absolute', left: 640, top: 690, ...HAND, fontSize: 70, color: CHALK, transform: 'rotate(-3deg)', ...land(o, T.rightWord, 'right')}}>roll RIGHT →</div>
    <div style={{position: 'absolute', left: 60, top: 680, ...HAND, fontSize: 50, color: 'rgba(255,255,255,0.7)', ...land(o, 5640, 'left')}}>coach's call:</div>
    <div style={{position: 'absolute', right: 70, top: 300, ...HAND, fontSize: 56, color: 'rgba(255,255,255,0.8)', transform: 'rotate(3deg)', ...land(o, T.most, 'up')}}>most people →</div>
    <div style={{position: 'absolute', left: 110, top: 360, ...HAND, fontSize: 120, color: RED, transform: 'rotate(-6deg)', ...land(o, T.hated, 'slam')}}>HATED IT.</div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: CHALK, filter: 'url(#chalk)'}} />
  </div>;
};

// ---- "way more going to my LEFT" (behind) + mirror flip + "the guy who only throws right" ---------------------
const LeftBehind = ({o}: {o: number}) => {
  if (o < S[3] || o >= T.flip) return null;
  return <>
    <div style={{position: 'absolute', top: 60, width: W, textAlign: 'center', ...ANTON, fontSize: 100, color: 'white', textShadow: shadow, ...land(o, T.wayMore, 'left')}}>WAY MORE</div>
    <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center', ...ANTON, fontSize: 340, color: TEAL, textShadow: `0 0 70px ${TEAL}aa, ${shadow}`,
      ...land(o, T.left2, 'slam')}}>← LEFT</div>
  </>;
};
const OnlyRight = ({o}: {o: number}) => {
  if (o < T.guy - 300 || o >= S[4]) return null;
  const st = ease(o, T.strike, 220);
  return <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center'}}>
    <div style={{...HAND, fontSize: 70, color: 'white', textShadow: shadow, ...land(o, 15860, 'left')}}>don't wanna be</div>
    <div style={{position: 'relative', display: 'inline-block', ...ANTON, fontSize: 120, color: 'white', textShadow: shadow, ...land(o, T.guy, 'left')}}>
      THE GUY WHO ONLY<br /><span style={{color: RED}}>THROWS RIGHT</span>
      <div style={{position: 'absolute', left: -20, top: '55%', height: 16, width: `${st * 108}%`, background: TEAL, transform: 'rotate(-4deg)', boxShadow: `0 0 20px ${TEAL}`}} />
    </div>
  </div>;
};

// ---- "so I've worked going left so much": chalk tallies right on the frame ------------------------------------
const Tallies = ({o}: {o: number}) => {
  if (o < S[4] || o >= S[5]) return null;
  const n = Math.floor(interpolate(o, [S[4] + 200, S[5] - 200], [0, 26], clamp));
  return <>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}} filter="url(#chalk)">
      {Array.from({length: n}).map((_, i) => {
        const g = Math.floor(i / 5), k = i % 5;
        const gx = 60 + (g % 3) * 150, gy = 260 + Math.floor(g / 3) * 150;
        return k < 4 ? <line key={i} x1={gx + k * 24} y1={gy} x2={gx + k * 24 + 6} y2={gy + 110} stroke={CHALK} strokeWidth={9} strokeLinecap="round" />
          : <line key={i} x1={gx - 14} y1={gy + 80} x2={gx + 96} y2={gy + 20} stroke={TEAL} strokeWidth={9} strokeLinecap="round" />;
      })}
    </svg>
    <div style={{position: 'absolute', left: 60, top: 150, ...HAND, fontSize: 76, color: CHALK, ...land(o, S[4] + 60, 'left')}}>reps going <span style={{color: TEAL}}>left</span></div>
  </>;
};

// ---- payoff: "you're the best quarterback I've ever seen in my life" -------------------------------------------
const BestBehind = ({o}: {o: number}) => {
  if (o < S[5]) return null;
  return <div style={{position: 'absolute', top: 160, width: W, textAlign: 'center', ...ANTON, lineHeight: 0.84}}>
    <div style={{fontSize: 360, color: 'white', textShadow: shadow, ...land(o, T.best, 'slam')}}>BEST</div>
    <div style={{fontSize: 260, color: TEAL, textShadow: `0 0 60px ${TEAL}88, ${shadow}`, ...land(o, T.qb, 'up')}}>QB EVER</div>
  </div>;
};
const BestFront = ({o}: {o: number}) => {
  if (o < T.qb) return null;
  const c = pop(o, T.qb + 100, 9, 180);
  const note = ease(o, T.biased, 500);
  return <>
    <Emoji code="1f451" size={200} style={{left: 440, top: 40 - (1 - c) * 300, transform: `rotate(${(1 - c) * -40 + Math.sin(o / 200) * 5}deg)`}} />
    {note > 0 && <div style={{position: 'absolute', left: 560, top: 1240, transform: 'rotate(-7deg)'}}>
      <Written text="he might be biased" w={440} size={64} p={note} family="Caveat" fill={CHALK} />
    </div>}
  </>;
};

const CAPS: Cap[] = [
  [S[1] + 40, 'I REMEMBER'], [3600, 'BEING A KID TOO', 'KID'], [4540, "AND YOU'RE"], [4720, 'PUTTING IN PLAYS'], [5420, 'AND YOUR COACHES', 'COACHES'],
  [5920, 'ONLY WANT TO DO'], [7040, 'ROLLOUTS TO YOUR RIGHT', 'RIGHT', RED], [7960, 'BECAUSE LIKE'], [8380, 'MOST PEOPLE'], [8780, 'ONLY WANT TO'],
  [9620, 'THROW TO THEIR RIGHT', 'RIGHT', RED], [10920, 'AND I REMEMBER'], [11460, 'I JUST HATED THAT', 'HATED', RED], [12640, 'SO I THREW LIKE'],
  [13360, 'WAY MORE', 'WAY MORE'], [13960, 'GOING TO MY LEFT', 'LEFT'], [14920, "BECAUSE I'M LIKE"], [15860, "I DON'T WANT TO BE"],
  [16280, 'THE GUY THAT CAN ONLY'], [16960, 'THROW TO HIS RIGHT', 'RIGHT', RED], [17720, 'LIKE ROLLING OUT'], [18320, "SO I'VE WORKED"],
  [18780, 'GOING LEFT', 'LEFT'], [19420, 'SO MUCH'], [20100, "YOU'RE THE BEST", 'BEST'], [20540, 'QUARTERBACK'], [21040, "I'VE EVER SEEN"], [21720, 'IN MY LIFE'],
];

export const Lefty = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.left, 10], [T.hated, 10], [T.left2, 14], [T.best, 12]], o);
  const wh = leftWhip(o);
  const split = o >= S[2] && o < S[3];
  const flip = o >= S[3] && o < S[4] ? interpolate(o, [T.flip, T.flip + 240], [1, -1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
  const flash = flashAt([[T.left2, 0.5], [S[1], 0.35]], o);
  const fb = o >= S[1] && o < S[2];
  return (
    <AbsoluteFill style={{background: '#0b0f0c'}}>
      <ChalkDefs />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.t} scale(1.03)`, filter: wh.b ? `blur(${wh.b}px)` : undefined}}>
        {split
          ? <div style={{position: 'absolute', left: 0, top: 900, width: W, height: 1020, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: -376, width: W, height: H}}><Cam c={cam} o={o} /></div></div>
          : <AbsoluteFill style={{transform: `scaleX(${flip})`}}>
            <Cam c={cam} o={o} style={fb ? {filter: `sepia(0.85) contrast(1.15) brightness(${0.85 + 0.08 * Math.sin(o / 23)})`} : undefined}
              behind={<><HookBehind o={o} /><LeftBehind o={o} /><BestBehind o={o} /></>} />
          </AbsoluteFill>}
        <SplitBoard o={o} />
        <Flashback o={o} />
        <HookFront o={o} />
        <OnlyRight o={o} />
        <Tallies o={o} />
        <BestFront o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, S[1]]]} top={1600} anim="rise" keyColor={TEAL}
        style={{...ANTON, fontSize: 78, color: 'white', WebkitTextStroke: '3px #061012', paintOrder: 'stroke fill', textShadow: '0 6px 22px rgba(0,0,0,0.75)'}} />
      <Vignette color="2,10,10" strength={0.75} />
      <Grain frame={frame} opacity={fb ? 0.2 : 0.08} />
      {flash > 0 && <AbsoluteFill style={{background: fb ? '#FFB347' : 'white', opacity: flash}} />}
      <SpeechTrack src={SRC} tl={tl} />
      {/* Funk Sigilo: 36.9 s drop lands on "LEFT" (T.left2) */}
      <Music file="funk-sigilo.mp3" songFrom={36900 - T.left2} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.left2 - 250 && t < T.left2) return 0.02;
        if (t >= tl.total - 700) return 0.4 * end;
        return (tl.playing(t) ? (t > T.left2 ? 0.14 : 0.1) : 0.3) * Math.min(1, t / 120);
      }} />
      <SfxTrack list={[
        sfx('mg-swoosh', 0, 0.35), sfx('chalk-scratch', 60, 0.3),
        sfx('mg-click', 40, 0.25), sfx('mg-click', 960, 0.3), sfx('mg-whoosh', T.left, 0.32), sfx('808-boom', T.left, 0.18), sfx('mg-click', T.right, 0.22),
        sfx('whoosh', S[1], 0.3), sfx('projector', S[1] + 40, 0.45),
        sfx('fast-whoosh', S[2], 0.35), sfx('chalk-scratch', T.roll, 0.4), sfx('chalk-scratch', T.roll + 450, 0.35), sfx('chalk-scratch', T.rightWord, 0.35),
        ...Array.from({length: 7}).map((_, i) => sfx('mg-click', T.most + i * 180, 0.16)),
        sfx('chalk-scratch', T.hated, 0.5), sfx('chalk-scratch', T.hated + 250, 0.4),
        sfx('fast-whoosh', S[3], 0.35), sfx('mg-swoosh2', T.wayMore, 0.25), sfx('808-boom', T.left2, 0.2), sfx('mg-swoosh2', T.left2, 0.3),
        sfx('whoosh', T.flip, 0.32), sfx('chalk-scratch', T.strike, 0.4),
        sfx('fast-whoosh', S[4], 0.35), ...Array.from({length: 6}).map((_, i) => sfx('chalk-scratch', S[4] + 250 + i * 250, 0.18, 200)),
        sfx('fast-whoosh', S[5], 0.35), sfx('mg-boom', T.best, 0.18), sfx('ding-2', T.qb + 120, 0.35), sfx('chalk-scratch', T.biased, 0.3),
      ]} />
    </AbsoluteFill>
  );
};
