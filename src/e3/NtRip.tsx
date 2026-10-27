// Edit3 (black bars) · Trevor rips National Treasures: the reel lands on Dan Marino ("he could sling it"), then the
// next card gets an "Ew. Don't show that, man." Look: a slot-machine reel on the bottom bar (a pack is a pull of the
// lever), cold open on the "EW." with a VHS rewind back to the Marino pull, a RETURN TO SENDER stamp at the end.
// The "Ew" card is never named. Mood funny → Du bist gut genug (loop version).
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/v_nt_rip.seats.json';
import {BOX_BOTTOM, BOX_H, BOX_TOP, Bars, CAP_TOP, MONT} from './bars';
import {
  Cam, Captions, Draw, FPS, Grain, Music, SfxTrack, SpeechTrack, W, clamp, ease, land, mattesFor, pop, punchAt, sfx, shakeAt, timeline,
  whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'b3/v_nt_rip.mp4';
const tl = timeline([[77920, 80700], [61400, 66100], [66950, 71000], [75320, 81900, 600]]);
export const NTRIP_MS = tl.total;
const S = tl.segOut; // 0 2780 7480 11530
const T = {ew: 260, dont: 1400, man: 2520, dan: 3060, marino: 3540, where: 4380, top10: 6140, gotta: 7020, sling: 8110, rip1: 9210,
  rip2: 10630, rip3: 11150, comeOn: 11550, no: 13290, ew2: 14390, dont2: 15530, getOut: 17190};
const GOLD = '#E7C46A';
const RED = '#FF3B3B';
const UNB = {fontFamily: 'Unbounded', fontWeight: 800, letterSpacing: '-0.04em'} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 28px rgba(0,0,0,0.65)';

// the left host stands during this rip (his face track drops out), so his lines play wide
const who = (s: number) => (s >= 77400 ? 'R' : s >= 75000 ? 'W' : s >= 66900 ? 'W' : s >= 65000 ? 'M' : 'W') as 'R' | 'W' | 'M';
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, wideX: (s) => (s >= 66900 && s < 75000 ? 1100 : 760), mattes: mattesFor('ntrip'), box: [W, BOX_H], baseH: 760,
  grade: 'contrast(1.12) saturate(1.02) brightness(0.92)',
  zoom: (o) => punchAt([[T.ew, T.dont, 1.15], [T.marino, T.where, 1.1], [T.ew2, T.dont2, 1.15]], o) * (1 + 0.04 * ((o % 4000) / 4000)),
};

// slot reel on the bottom bar
const NAMES = ['MICAH PARSONS', 'STEVE ATWATER', 'TREVOR?', 'DAN MARINO'];
const Reel = ({o}: {o: number}) => {
  if (o < S[1] - 200) return null;
  const spin2 = o >= T.comeOn - 100;
  // first spin lands on DAN MARINO at T.marino; second spin (T.comeOn) lands on "???"
  const p1 = interpolate(o, [S[1], T.marino], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const p2 = interpolate(o, [T.comeOn, T.no], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const list = spin2 ? [...NAMES, '• • •', '• • •', '? ? ?'] : NAMES;
  const idx = spin2 ? 3 + p2 * 3 : p1 * 3;
  const landed = spin2 ? p2 >= 1 : p1 >= 1;
  const rowH = 120;
  return <div style={{position: 'absolute', left: 70, top: BOX_BOTTOM + 60, width: 940, height: 260, ...land(o, S[1] - 200, 'up')}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: 'linear-gradient(180deg,#1a1408,#0b0904)', border: `5px solid ${GOLD}`,
      boxShadow: `0 0 30px rgba(231,196,106,0.35), inset 0 0 40px rgba(0,0,0,0.9)`}} />
    <div style={{position: 'absolute', left: 30, top: 18, ...MONO, fontSize: 24, color: GOLD, letterSpacing: '0.2em'}}>NATIONAL TREASURES · PACK PULL</div>
    <div style={{position: 'absolute', left: 30, right: 30, top: 70, height: rowH, overflow: 'hidden', borderRadius: 12, background: '#000'}}>
      <div style={{transform: `translateY(${-idx * rowH}px)`, filter: landed ? undefined : `blur(${Math.min(6, Math.abs(Math.sin(idx * Math.PI)) * 10)}px)`}}>
        {list.map((n, i) => <div key={i} style={{height: rowH, display: 'flex', alignItems: 'center', justifyContent: 'center', ...UNB, fontSize: 64,
          color: n === 'DAN MARINO' ? GOLD : n === '? ? ?' ? RED : 'white'}}>{n}</div>)}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 30%, transparent 70%, rgba(0,0,0,0.7))'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', ...MONO, fontSize: 30,
      color: spin2 ? RED : GOLD}}>{landed ? (spin2 ? 'EW.' : '★ ★ ★  TOP 10 ALL-TIME?') : '…'}</div>
  </div>;
};

// cold open: "EW." behind the host, and a card nobody wants to see
const EwBehind = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', top: 40, width: W, textAlign: 'center', ...UNB, fontSize: 330, color: RED, lineHeight: 1,
    textShadow: `0 0 50px rgba(255,59,59,0.5), ${shadow}`, ...land(o, T.ew, 'slam')}}>EW.</div>;
};
const Mystery = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', left: 0, top: BOX_BOTTOM + 40, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40}}>
    <div style={{width: 190, height: 266, borderRadius: 14, background: 'linear-gradient(150deg,#3a3a3a,#111)', border: '4px solid #666', filter: 'blur(5px)',
      transform: `rotate(${-6 + Math.sin(o / 200) * 3}deg)`}} />
    <div style={{...UNB, fontSize: 56, color: 'white', lineHeight: 1.05, ...land(o, T.dont, 'left')}}>"DON'T SHOW<br />THAT, MAN."</div>
  </div>;
};
// VHS rewind back to the Marino pull
const Rewind = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[1] + 650) return null;
  const p = (o - S[1]) / 650;
  return <AbsoluteFill style={{top: BOX_TOP, height: BOX_H}}>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 3px, transparent 3px 7px)', opacity: 1 - p}} />
    <div style={{position: 'absolute', left: 50, top: 50, ...MONO, fontSize: 52, color: 'white', textShadow: '3px 0 #f0f, -3px 0 #0ff', opacity: 1 - p * 0.6}}>◀◀ EARLIER</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300 + (p * 900) % 700, height: 40, background: 'rgba(255,255,255,0.18)'}} />
  </AbsoluteFill>;
};
// Marino: top 10? he could sling it
const Marino = ({o}: {o: number}) => {
  if (o < T.where - 100 || o >= S[3]) return null;
  const arc = ease(o, T.sling, 700, Easing.inOut(Easing.quad));
  return <>
    <div style={{position: 'absolute', top: BOX_TOP + 60, width: W, textAlign: 'center', color: 'white', textShadow: shadow}}>
      {o < S[2] ? <>
        <div style={{...MONO, fontSize: 44, color: GOLD, ...land(o, T.where - 100, 'up')}}>WHERE'S HE ALL-TIME?</div>
        <div style={{...UNB, fontSize: 150, lineHeight: 1, ...land(o, T.top10, 'slam')}}>TOP 10</div>
        <div style={{...UNB, fontSize: 64, color: GOLD, ...land(o, T.gotta, 'up')}}>"GOT TO BE."</div>
      </> : <>
        <div style={{...UNB, fontSize: 96, lineHeight: 1, ...land(o, T.sling, 'left')}}>HE COULD</div>
        <div style={{...UNB, fontSize: 160, lineHeight: 1, color: GOLD, ...land(o, T.sling + 150, 'slam')}}>SLING IT</div>
        <div style={{...MONO, fontSize: 52, marginTop: 10}}>
          {[T.rip1, T.rip2, T.rip3].map((at, i) => <span key={i} style={{display: 'inline-block', margin: '0 12px', ...land(o, at, 'zoom')}}>RIP IT.</span>)}</div>
      </>}
    </div>
    {o >= T.sling && <svg width={W} height={BOX_H} style={{position: 'absolute', top: BOX_TOP, left: 0}}>
      <Draw d="M120,1000 C360,520 720,520 960,860" p={arc} color={GOLD} width={10} dash="22 18" />
      {arc > 0.05 && arc < 0.98 && (() => {
        const t = arc; const x = (1 - t) ** 3 * 120 + 3 * (1 - t) ** 2 * t * 360 + 3 * (1 - t) * t * t * 720 + t ** 3 * 960;
        const y = (1 - t) ** 3 * 1000 + 3 * (1 - t) ** 2 * t * 520 + 3 * (1 - t) * t * t * 520 + t ** 3 * 860;
        return <ellipse cx={x} cy={y} rx={30} ry={18} fill="#7a4a1f" stroke="white" strokeWidth={3} transform={`rotate(${t * 400} ${x} ${y})`} />;
      })()}
    </svg>}
  </>;
};
// the "Ew" card: stamped and flicked away
const ReturnToSender = ({o}: {o: number}) => {
  if (o < T.ew2 - 100) return null;
  const st = ease(o, T.ew2, 150);
  const fly = ease(o, T.getOut, 450, Easing.in(Easing.cubic));
  return <div style={{position: 'absolute', left: 640, top: BOX_TOP + 60, width: 380, height: 510, transform: `translate(${fly * 900}px, ${-fly * 300}px) rotate(${-4 + fly * 60}deg)`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: 'linear-gradient(150deg,#2b2b2b,#0d0d0d)', border: '6px solid #555', filter: 'blur(4px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.7)', transform: `scale(${pop(o, T.ew2 - 100, 14, 180)})`}} />
    {st > 0 && <div style={{position: 'absolute', left: -60, top: 190, ...UNB, fontSize: 52, color: RED, border: `8px solid ${RED}`, padding: '6px 18px', borderRadius: 14,
      transform: `rotate(-18deg) scale(${2 - st})`, opacity: st, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.35)'}}>RETURN TO SENDER</div>}
  </div>;
};

const CAPS: Cap[] = [
  [T.ew, 'EW.', 'EW', RED], [T.dont, "DON'T SHOW THAT, MAN."], [T.dan, 'DAN MARINO.', 'DAN MARINO'], [T.where, "WHERE'S HE ALL-TIME FOR YOU?"],
  [T.top10, 'TOP TEN?', 'TOP TEN'], [6680, 'I MEAN, GOT TO BE.'], [7550, 'HE COULD SLING IT.', 'SLING IT'], [9030, 'HE COULD RIP IT.', 'RIP IT'],
  [10210, 'HE COULD RIP IT.', 'RIP IT'], [10930, 'HE COULD RIP IT.', 'RIP IT'], [T.comeOn, 'COME ON.'], [T.no, 'NO.'], [T.ew2, 'EW.', 'EW', RED],
  [T.dont2, "DON'T SHOW THAT, MAN."], [T.getOut, 'GET THAT OUT OF HERE.', 'OUT OF HERE', RED],
];

export const NtRip = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.ew, 12], [T.marino, 8], [T.ew2, 12]], o);
  const wh = whipAt([S[2], S[3]], o, 'x', 220);
  const rw = o >= S[1] && o < S[1] + 650;
  return (
    <Bars top="Nobody wanted this card" emoji="1f62d" over={<>
      <Mystery o={o} />
      <Reel o={o} />
      <Marino o={o} />
      <ReturnToSender o={o} />
      <Rewind o={o} />
      <Captions o={o} caps={CAPS} top={CAP_TOP} keyColor={GOLD}
        style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: 'white', WebkitTextStroke: '3px black', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.7)'}} />
      <Grain frame={frame} opacity={rw ? 0.25 : 0.06} />
    </>}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.02)`, filter: `${wh.blur ? `blur(${wh.blur}px)` : ''} ${rw ? 'saturate(0.4) contrast(1.3)' : ''}`.trim() || undefined}}>
        <Cam c={cam} o={o} behind={<EwBehind o={o} />} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      </AbsoluteFill>
      <SpeechTrack src={SRC} tl={tl} />
      <Music file="du-bist-gut-genug.mp3" songFrom={0} loop level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= S[1] && t < S[1] + 650) return 0.05;
        if (t >= tl.total - 600) return 0.4 * end;
        return (tl.playing(t) ? 0.12 : 0.28) * Math.min(1, t / 120);
      }} />
      <SfxTrack list={[
        sfx('record-scratch', T.ew - 40, 0.25), sfx('mg-click', T.dont, 0.2),
        sfx('whoosh', S[1], 0.32), sfx('projector', S[1], 0.3, 650),
        ...Array.from({length: 7}).map((_, i) => sfx('mg-click', S[1] + 80 + i * (i < 4 ? 70 : 130), 0.14)), sfx('ding-2', T.marino + 60, 0.32),
        sfx('mg-click', T.top10, 0.28), sfx('fast-whoosh', S[2], 0.3), sfx('mg-swoosh', T.sling, 0.32),
        sfx('mg-click', T.rip1, 0.2), sfx('mg-click', T.rip2, 0.2), sfx('mg-click', T.rip3, 0.2),
        sfx('fast-whoosh', S[3], 0.3), ...Array.from({length: 7}).map((_, i) => sfx('mg-click', T.comeOn + 80 + i * (i < 4 ? 80 : 160), 0.14)),
        sfx('error', T.no + 60, 0.2), sfx('mg-boom', T.ew2, 0.16), sfx('mg-click', T.ew2, 0.3), sfx('mg-whoosh', T.getOut, 0.3),
      ]} />
    </Bars>
  );
};
