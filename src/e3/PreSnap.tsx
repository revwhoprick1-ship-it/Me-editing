// Edit3 (black bars) · "How often do you KNOW he's open?" Trevor: 50–65% of the time; maybe 15% the coverage
// changes and you move on. Look: data piece: a read-percentage ring on the bottom bar that fills as he answers (and
// corrects himself: 70 → 65, 25 → 15), a "should go here / ends up there" route sketch, the number behind his head.
// Mood serious → phonk (Funk Abnormal, 43.7 s drop on "65").
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/v_presnap.seats.json';
import {BOX_BOTTOM, BOX_H, BOX_TOP, Bars, CAP_TOP, MONT} from './bars';
import {
  Cam, Captions, Draw, FPS, Grain, Music, SfxTrack, SpeechTrack, W, clamp, ease, land, mattesFor, punchAt, sfx, shakeAt, timeline,
  whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'b3/v_presnap.mp4';
const tl = timeline([[0, 5800], [9580, 10950], [13400, 17700], [18600, 26350], [29170, 32600, 600]]);
export const PRESNAP_MS = tl.total;
const S = tl.segOut; // 0 5800 7170 11470 19220
const T = {pct: 320, know: 3700, open: 5280, would: 5880, fifty: 7590, seventy: 9250, fifty2: 10550, sixty5: 10830, ofTime: 11310,
  here: 14210, there: 15310, sometimes: 16170, t25: 17530, t15: 19430, friction: 21470, moveOn: 21870};
const GREEN = '#3CFF8F';
const RED = '#FF4D5A';
const BLACK = {fontFamily: 'Archivo Black', letterSpacing: '-0.02em'} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 28px rgba(0,0,0,0.6)';

const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who: (s) => (s < 6000 ? 'L' : 'M'), mattes: mattesFor('presnap'), box: [W, BOX_H], baseH: 760,
  grade: 'contrast(1.1) saturate(0.95) brightness(0.93)',
  zoom: (o) => punchAt([[T.sixty5, S[3], 1.12], [T.moveOn, tl.total, 1.1]], o) * (1 + 0.04 * ((o % 4500) / 4500)),
};

// ring on the bottom bar: green = "I know he's open", red = "coverage changes"
const Ring = ({o}: {o: number}) => {
  const g = o < T.fifty ? 0 : o < T.seventy ? 50 * ease(o, T.fifty, 300) : o < T.fifty2 ? 50 + 20 * ease(o, T.seventy, 300) : 70 - 5 * ease(o, T.sixty5, 300);
  const r = o < T.t25 ? 0 : o < T.t15 ? 25 * ease(o, T.t25, 300) : 25 - 10 * ease(o, T.t15, 300);
  const R0 = 118;
  const C = 2 * Math.PI * R0;
  const think = o < T.fifty;
  const big = o < T.fifty ? '?' : o < T.fifty2 ? `${Math.round(Math.min(g, o < T.seventy ? 50 : 70))}` : '50–65';
  return <div style={{position: 'absolute', left: 60, top: BOX_BOTTOM + 40, width: 960, height: 300, display: 'flex', alignItems: 'center', gap: 46}}>
    <svg width={290} height={290} viewBox="-145 -145 290 290" style={{flex: 'none', transform: think ? `rotate(${o / 6}deg)` : undefined}}>
      <circle r={R0} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={34} />
      {think && <circle r={R0} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={34} strokeDasharray={`${C * 0.12} ${C}`} strokeLinecap="round" />}
      <circle r={R0} fill="none" stroke={GREEN} strokeWidth={34} strokeDasharray={`${(C * g) / 100} ${C}`} transform="rotate(-90)" style={{filter: `drop-shadow(0 0 10px ${GREEN})`}} />
      {o >= T.sixty5 && <circle r={R0} fill="none" stroke={GREEN} strokeOpacity={0.35} strokeWidth={34} strokeDasharray={`${(C * 15) / 100} ${C}`}
        transform={`rotate(${-90 + 180})`} />}
      <circle r={R0} fill="none" stroke={RED} strokeWidth={34} strokeDasharray={`${(C * r) / 100} ${C}`} transform={`rotate(${-90 + 360 * 0.65})`} />
      <text y={think ? 30 : 18} textAnchor="middle" fontFamily="Archivo Black" fontSize={think ? 110 : big.length > 3 ? 54 : 84} fill="white"
        transform={think ? `rotate(${-o / 6})` : undefined}>{big}{think ? '' : '%'}</text>
    </svg>
    <div style={{flex: 1}}>
      <div style={{...MONO, fontSize: 30, color: 'rgba(255,255,255,0.6)', marginBottom: 10}}>PRE-SNAP READ</div>
      <div style={{...BLACK, fontSize: 52, color: GREEN, lineHeight: 1.05, opacity: o >= T.fifty ? 1 : 0.25}}>I KNOW HE'S OPEN</div>
      {o >= T.t25 && <div style={{...BLACK, fontSize: 44, color: RED, lineHeight: 1.1, marginTop: 12, ...land(o, T.t25, 'left')}}>
        COVERAGE CHANGES <span style={{color: 'white'}}>
          {o < T.t15 ? '25%' : <><s style={{opacity: 0.45}}>25%</s> 15%</>}</span></div>}
    </div>
  </div>;
};

// "I know it should go here, and it ends up going there"
const Route = ({o}: {o: number}) => {
  if (o < S[3] || o >= T.sometimes) return null;
  const a = ease(o, T.here - 200, 500);
  const b = ease(o, T.there - 100, 600, Easing.inOut(Easing.cubic));
  const inP = ease(o, S[3], 300);
  return <div style={{position: 'absolute', left: 0, top: BOX_BOTTOM + 10, width: W, height: 370, background: '#050806', opacity: inP}}>
    <svg width={W} height={370}>
      {[90, 180, 270].map((y) => <line key={y} x1={40} x2={1040} y1={y} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={3} />)}
      <circle cx={540} cy={320} r={22} fill="white" />
      <text x={540} y={362} textAnchor="middle" fontFamily="Space Mono" fontWeight={700} fontSize={22} fill="rgba(255,255,255,0.6)">QB</text>
      <circle cx={300} cy={110} r={22} fill="none" stroke={GREEN} strokeWidth={6} />
      <circle cx={800} cy={150} r={22} fill="none" stroke="white" strokeWidth={6} />
      <Draw d="M540,300 L310,125" p={a} color={GREEN} width={7} len={300} />
      <Draw d="M540,300 C600,180 700,140 785,150" p={b} color={RED} width={9} len={330} />
      {a > 0.9 && <text x={300} y={62} textAnchor="middle" fontFamily="Archivo Black" fontSize={34} fill={GREEN}>SHOULD GO HERE</text>}
      {b > 0.9 && <text x={800} y={102} textAnchor="middle" fontFamily="Archivo Black" fontSize={34} fill={RED}>ENDS UP THERE</text>}
    </svg>
  </div>;
};

const HookWords = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', top: BOX_TOP + 60, width: W, textAlign: 'center', ...BLACK, fontSize: 104, lineHeight: 0.98, color: 'white', textShadow: shadow}}>
    <div style={land(o, T.pct - 200, 'up')}>HOW OFTEN</div>
    <div style={land(o, T.know, 'up')}>DO YOU <span style={{color: GREEN}}>KNOW</span></div>
    <div style={land(o, T.open, 'slam')}>HE'S OPEN?</div>
  </div>;
};
// the number behind Trevor's head
const NumberBehind = ({o}: {o: number}) => {
  if (o < T.fifty - 100 || o >= S[3]) return null;
  const fixed = o >= T.fifty2;
  return <div style={{position: 'absolute', top: 40, width: W, textAlign: 'center', ...BLACK, fontSize: 250, lineHeight: 1, color: 'white', textShadow: shadow}}>
    {!fixed ? <><span style={land(o, T.fifty, 'slam')}>50</span>{o >= T.seventy && <span style={{color: 'rgba(255,255,255,0.75)', ...land(o, T.seventy, 'right')}}>–70</span>}</>
      : <span style={land(o, T.fifty2, 'slam')}>50–<span style={{color: GREEN}}>65</span><span style={{fontSize: 140}}>%</span></span>}
  </div>;
};
const MoveOn = ({o}: {o: number}) => {
  if (o < T.friction - 100) return null;
  const arrow = ease(o, T.moveOn + 100, 500);
  return <div style={{position: 'absolute', top: BOX_TOP + 70, width: W, textAlign: 'center', ...BLACK, color: 'white', textShadow: shadow}}>
    <div style={{fontSize: 70, color: 'rgba(255,255,255,0.8)', ...land(o, T.friction, 'up')}}>FRICTION?</div>
    <div style={{fontSize: 150, lineHeight: 1, ...land(o, T.moveOn, 'slam')}}>MOVE ON<span style={{display: 'inline-block', color: GREEN, transform: `translateX(${arrow * 40}px)`}}>→</span></div>
  </div>;
};

const CAPS: Cap[] = [
  [0, 'HOW MUCH PERCENTAGE'], [980, 'OF PRE-SNAPS'], [2260, 'DO YOU ACTUALLY THINK,'], [3620, 'I KNOW THIS GUY'], [5280, "IS GOING TO BE OPEN?", 'OPEN'],
  [T.would, 'I WOULD SAY PROBABLY…'], [7350, 'ABOUT 50 TO 70,', '50'], [T.fifty2, '50 TO 65%', '50 TO 65%'], [T.ofTime, 'OF THE TIME.'],
  [11670, 'IT GOES WHERE, LIKE,'], [13290, 'I KNOW IT SHOULD GO HERE', 'HERE'], [15110, 'AND IT ENDS UP GOING THERE.', 'THERE', RED],
  [16050, 'AND THEN SOMETIMES'], [16670, "I'D SAY 25% OF THE TIME,", '25%', RED], [19250, 'MAYBE 15% OF THE TIME', '15%', RED],
  [20590, 'COVERAGE CHANGES', 'CHANGES', RED], [21310, 'AND KIND OF FRICTION,'], [21870, 'YOU GOT TO MOVE ON.', 'MOVE ON'],
];

export const PreSnap = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.sixty5, 8], [T.moveOn, 8]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4]], o, 'zoom', 220);
  return (
    <Bars top="How often does a QB really know who's open?" emoji="1f914" over={<>
      <Ring o={o} />
      <Route o={o} />
      <HookWords o={o} />
      <MoveOn o={o} />
      <Captions o={o} caps={CAPS} top={CAP_TOP} keyColor={GREEN}
        style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: 'white', WebkitTextStroke: '3px black', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.7)'}} />
      <Grain frame={frame} opacity={0.06} />
    </>}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.02)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} behind={<NumberBehind o={o} />} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      </AbsoluteFill>
      <SpeechTrack src={SRC} tl={tl} />
      <Music file="funk-abnormal.mp3" songFrom={43700 - T.sixty5} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.sixty5 - 200 && t < T.sixty5) return 0.03;
        if (t >= tl.total - 600) return 0.38 * end;
        return (tl.playing(t) ? 0.12 : 0.28) * Math.min(1, t / 150) * (interpolate(t, [0, 400], [0.6, 1], clamp));
      }} />
      <SfxTrack list={[
        sfx('mg-click', 120, 0.25), sfx('mg-click', T.know, 0.25), sfx('mg-swoosh2', T.open, 0.28),
        sfx('fast-whoosh', S[1], 0.3), sfx('fast-whoosh', S[2], 0.3), sfx('mg-click', T.fifty, 0.3), sfx('mg-click', T.seventy, 0.25),
        sfx('pen-scribble', T.fifty2, 0.3), sfx('ding-2', T.sixty5 + 150, 0.3),
        sfx('fast-whoosh', S[3], 0.3), sfx('scan-beep', T.here - 200, 0.25), sfx('mg-swoosh', T.there - 100, 0.3),
        sfx('mg-click', T.t25, 0.28), sfx('fast-whoosh', S[4], 0.3), sfx('pen-scribble', T.t15, 0.3), sfx('mg-swoosh2', T.moveOn, 0.32),
      ]} />
    </Bars>
  );
};
