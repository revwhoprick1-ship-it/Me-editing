// Edit3 (black bars) · "The other team's cheering more than the Jags... it sounded like we were in Philly."
// → "That Steelers game could be Rogers Realm vs Traveling Trevors. We should box him." Look: fight night: a crowd
// noise meter, the home pin crossed out for PHILLY??, a distressed fight poster built on the bottom bar, VS behind
// the host, bell + gloves. Mood hype → phonk (Montagem Uranium, 37 s drop on "ROGERS").
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/v_rogers_realm.seats.json';
import {BOX_BOTTOM, BOX_H, BOX_TOP, Bars, CAP_TOP, MONT} from './bars';
import {
  Cam, Captions, Emoji, FPS, Grain, Music, SfxTrack, SpeechTrack, W, clamp, ease, land, mattesFor, pop, punchAt, sfx, shakeAt, timeline,
  whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'b3/v_rogers_realm.mp4';
const tl = timeline([[0, 5700], [6150, 9450], [9550, 13600], [14420, 16900], [17450, 20400, 700]]);
export const ROGERS_MS = tl.total;
const S = tl.segOut; // 0 5700 9000 13050 15530
const T = {cheering: 1480, jags: 2260, eagles: 3180, insane: 4200, nuts: 5340, notHome: 5810, home: 6470, philly: 8690, steelers: 9570,
  rogers: 10650, traveling: 11410, omg: 12410, box: 13330, takeOut: 14650, vs: 16440, makeIt: 17760};
const RED = '#E63A2E';
const YEL = '#FFD23F';
const TEAL = '#0FA3B1';
const EAGLE = '#2E8B57';
const ANTON = {fontFamily: 'Anton', letterSpacing: '0.01em', lineHeight: 0.9} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 28px rgba(0,0,0,0.65)';

const who = (s: number) => (s < 3700 ? 'R' : s < 9500 ? 'L' : s < 14000 ? 'R' : s < 19500 ? 'L' : 'R') as 'R' | 'L';
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, mattes: mattesFor('rogers'), box: [W, BOX_H], baseH: 760,
  grade: 'contrast(1.15) saturate(1.05) brightness(0.9)',
  zoom: (o) => punchAt([[T.philly, S[2], 1.12], [T.rogers, T.omg, 1.1], [T.box, T.takeOut, 1.14]], o) * (1 + 0.04 * ((o % 4000) / 4000)),
};

// crowd noise meter (bottom bar)
const Meter = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  const away = interpolate(o, [T.cheering - 300, T.jags], [0.3, 0.95], clamp) + Math.sin(o / 60) * 0.03;
  const home = interpolate(o, [T.cheering - 300, T.jags], [0.3, 0.45], clamp) + Math.sin(o / 75 + 1) * 0.02;
  const bar = (v: number, c: string, l: string) => <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18}}>
    <div style={{...MONO, fontSize: 30, color: 'white', width: 230}}>{l}</div>
    <div style={{flex: 1, height: 58, background: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden', display: 'flex', gap: 4, padding: 5, boxSizing: 'border-box'}}>
      {Array.from({length: 20}).map((_, i) => <div key={i} style={{flex: 1, borderRadius: 3, background: i / 20 < v ? (i > 15 ? RED : c) : 'rgba(255,255,255,0.06)'}} />)}
    </div>
  </div>;
  return <div style={{position: 'absolute', left: 60, top: BOX_BOTTOM + 60, width: 960, ...land(o, 80, 'up')}}>
    <div style={{...MONO, fontSize: 26, color: 'rgba(255,255,255,0.55)', marginBottom: 14, letterSpacing: '0.2em'}}>CROWD NOISE · JAGS HOME GAME</div>
    {bar(away, EAGLE, 'AWAY FANS')}
    {bar(home, TEAL, 'JAGS FANS')}
  </div>;
};
const Pin = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[2]) return null;
  const x = ease(o, T.philly - 150, 250);
  return <div style={{position: 'absolute', left: 0, top: BOX_BOTTOM + 70, width: W, textAlign: 'center', ...land(o, S[1] + 60, 'up')}}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 20, padding: '16px 34px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
      <Emoji code="1f4cd" size={64} style={{position: 'static'}} />
      <div style={{position: 'relative', ...ANTON, fontSize: 76, color: '#111'}}>
        JACKSONVILLE, FL
        <div style={{position: 'absolute', left: -8, right: -8, top: '48%', height: 10, background: RED, transform: `scaleX(${x})`, transformOrigin: 'left'}} />
      </div>
    </div>
    {o >= T.philly && <div style={{...ANTON, fontSize: 120, color: EAGLE, marginTop: 14, textShadow: '0 6px 0 #fff', ...land(o, T.philly, 'slam')}}>PHILLY??</div>}
  </div>;
};
const NotHome = ({o}: {o: number}) => {
  if (o < S[1] || o >= S[2]) return null;
  return <div style={{position: 'absolute', top: BOX_TOP + 60, width: W, textAlign: 'center', ...ANTON, fontSize: 130, color: 'white', textShadow: shadow}}>
    <div style={land(o, T.notHome, 'up')}>NOT A</div><div style={{color: YEL, ...land(o, T.home, 'slam')}}>HOME GAME.</div>
  </div>;
};

// the fight poster
const VsBehind = ({o}: {o: number}) => {
  if (o < S[2] || o >= S[3]) return null;
  return <div style={{position: 'absolute', top: 30, width: W, textAlign: 'center', ...ANTON, fontSize: 380, color: YEL, lineHeight: 1,
    textShadow: `0 0 40px rgba(255,210,63,0.5), ${shadow}`, ...land(o, T.rogers, 'slam')}}>VS</div>;
};
const Poster = ({o}: {o: number}) => {
  if (o < T.steelers - 100) return null;
  const inP = pop(o, T.steelers - 100, 15, 140);
  const ko = o >= T.takeOut;
  const final = o >= T.vs;
  return <div style={{position: 'absolute', left: 30, top: BOX_BOTTOM + 30, width: 1020, height: 330, transform: `translateY(${(1 - inP) * 400}px)`}}>
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${RED}, #8E1C14)`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.6)'}}>
      <svg width={1020} height={330} style={{position: 'absolute', inset: 0, opacity: 0.25, mixBlendMode: 'multiply'}}>
        <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} /></filter><rect width={1020} height={330} filter="url(#rough)" /></svg>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', ...MONO, fontSize: 26, color: YEL, letterSpacing: '0.3em'}}>
      {final ? 'WE NEED TO MAKE THIS HAPPEN' : 'THE STEELERS GAME'}</div>
    <div style={{position: 'absolute', left: 30, top: 70, width: 400, textAlign: 'center', ...ANTON, fontSize: 84, color: 'white', ...land(o, T.traveling, 'left')}}>TRAVELING<br />TREVORS</div>
    <div style={{position: 'absolute', left: 430, top: 105, width: 160, textAlign: 'center', ...ANTON, fontSize: 110, color: YEL, ...land(o, T.rogers, 'zoom')}}>VS</div>
    <div style={{position: 'absolute', right: 30, top: 70, width: 400, textAlign: 'center', ...ANTON, fontSize: 84, color: 'white', ...land(o, T.rogers, 'right')}}>ROGERS<br />REALM</div>
    {ko && <div style={{position: 'absolute', left: 395, top: 70, width: 230, textAlign: 'center', ...ANTON, fontSize: 130, color: '#111', background: YEL, borderRadius: 10,
      transform: `rotate(-10deg) scale(${2 - ease(o, T.takeOut, 160)})`, boxShadow: '6px 6px 0 #000', opacity: final ? 0 : 1}}>K.O.</div>}
    {final && <div style={{position: 'absolute', left: 340, top: 230, ...ANTON, fontSize: 70, color: '#111', background: YEL, padding: '2px 26px', transform: 'rotate(-3deg)',
      ...land(o, T.makeIt, 'slam')}}>WHO WINS?</div>}
  </div>;
};
const Gloves = ({o}: {o: number}) => {
  if (o < S[3] - 100 || o >= S[4]) return null;
  const hit = ease(o, T.box, 140);
  return <>
    <Emoji code="1f94a" size={260} style={{left: -260 + hit * 420, top: BOX_TOP + 380, transform: `rotate(${-20 + hit * 20}deg)`}} />
    <div style={{position: 'absolute', top: BOX_TOP + 60, width: W, textAlign: 'center', ...ANTON, fontSize: 140, color: 'white', textShadow: shadow}}>
      <div style={land(o, T.box, 'slam')}>"WE SHOULD</div><div style={{color: YEL, ...land(o, T.box + 250, 'slam')}}>BOX HIM."</div>
    </div>
  </>;
};

const CAPS: Cap[] = [
  [0, "THE OTHER TEAM'S CHEERING"], [1700, 'MORE THAN THE JAGS.', 'JAGS', TEAL], [2640, 'YOU HEAR THE EAGLES GAME?', 'EAGLES', EAGLE],
  [4020, 'YEAH, IT WAS INSANE.'], [5340, 'IT WAS NUTS.'], [T.notHome, 'THAT WAS NOT A HOME GAME.', 'NOT'], [7310, 'IT SOUNDED LIKE'],
  [8130, 'WE WERE IN PHILLY.', 'PHILLY', EAGLE], [9110, 'LISTEN, THAT STEELERS GAME'], [10090, 'COULD BE A LITTLE'], [10650, 'ROGERS REALM,', 'ROGERS REALM'],
  [11410, 'TRAVELING TREVOR.', 'TRAVELING TREVOR'], [T.omg, 'OH MY GOD.'], [13070, 'WE SHOULD BOX HIM.', 'BOX'], [14650, 'I SHOULD TAKE THEM OUT.'],
  [15740, 'TRAVELING TREVOR VERSUS', 'VERSUS'], [16760, 'ROGERS REALM.', 'ROGERS REALM'], [T.makeIt, 'WE NEED TO'], [17980, 'MAKE THAT HAPPEN.', 'MAKE THAT HAPPEN'],
];

export const Rogers = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.rogers, 12], [T.box, 16], [T.takeOut, 10]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4]], o, 'x', 200);
  return (
    <Bars top="Jags fans, we need this" emoji="1f94a" over={<>
      <Meter o={o} />
      <Pin o={o} />
      <Poster o={o} />
      <NotHome o={o} />
      <Gloves o={o} />
      <Captions o={o} caps={CAPS} top={CAP_TOP} keyColor={YEL}
        style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: 'white', WebkitTextStroke: '3px black', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.7)'}} />
      <Grain frame={frame} opacity={0.08} />
    </>}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.02)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} behind={<VsBehind o={o} />} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
      </AbsoluteFill>
      <SpeechTrack src={SRC} tl={tl} />
      <Music file="montagem-uranium.mp3" songFrom={37000 - T.rogers} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.rogers - 200 && t < T.rogers) return 0.03;
        if (t >= tl.total - 700) return 0.4 * end;
        return (tl.playing(t) ? (t > T.rogers ? 0.14 : 0.1) : 0.3) * Math.min(1, t / 150);
      }} />
      <SfxTrack list={[
        sfx('crowd-cheer', 0, 0.16, 5400), sfx('mg-click', T.jags, 0.25), sfx('mg-click', T.eagles, 0.2),
        sfx('fast-whoosh', S[1], 0.3), sfx('mg-click', T.notHome, 0.25), sfx('pen-scribble', T.philly - 150, 0.3), sfx('mg-swoosh2', T.philly, 0.3),
        sfx('fast-whoosh', S[2], 0.3), sfx('mg-swoosh', T.steelers - 100, 0.3), sfx('boxing-bell', T.rogers, 0.35), sfx('mg-click', T.traveling, 0.25),
        sfx('fast-whoosh', S[3], 0.3), sfx('mg-whoosh', T.box - 140, 0.3), sfx('mg-boom', T.box, 0.18), sfx('mg-click', T.takeOut, 0.3),
        sfx('fast-whoosh', S[4], 0.3), sfx('boxing-bell', T.makeIt, 0.3), sfx('crowd-cheer', T.makeIt, 0.15, 2600),
      ]} />
    </Bars>
  );
};
