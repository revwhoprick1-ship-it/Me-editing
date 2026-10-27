// Edit3 card pull · Pokémon God Pack (every card in the pack is a hit; roughly 1 in 1,000 packs).
// Look: odds + binder: a wall of 1,000 packs that ticks up while the narrator says "most people open a thousand packs
// and never see this", one dot turns gold at the reveal and blooms into GOD PACK, then the real cards drop into binder
// pockets as he shows them. Holo-foil accents, rounded type, cards blurred until the reveal.
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import narr from '../../../public/narr/b3_pokemon.json';
import {Blurs, HookAudio, HookView, HostAudio, Narration, Riser, StreamView, cardTimeline, narrCaps, narrSpans, type NarrLine, type Placed} from '../cardkit';
import {Captions, FPS, Grain, Music, SfxTrack, W, clamp, ease, flashAt, land, pop, sfx, shakeAt, type Cap} from '../kit';

const SRC = 'b3/k_pokemon_god_pack.mp4';
const HOOK = {file: 'hooks/oh_my_god_our_first_one.mp4', from: 0, ms: 2800};
const tl = cardTimeline(HOOK.ms, [{src: [1500, 5000]}, {src: [5000, 7400], rate: 0.5}, {src: [7400, 11400]}, {src: [14600, 23900]}]);
export const GODPACK_MS = tl.total;
const S = tl.segOut; // 2800 6300 11100 15100
const R = S[2];
const LINES = narr as NarrLine[];
const PLACED: Placed[] = [{line: 0, at: HOOK.ms + 20}, {line: 1, at: S[1] - 60}, {line: 2, at: S[3] + 100}];
const [L1, L2, L3] = narrSpans(LINES, PLACED);
const T = {thousand: L1[0] + 1080, never: L1[0] + 2160, happened: 11380, godpack: 13320, real: 14620, cards: [15340, 16900, 18580, 20020], gross: 22800, shaking: 23600};
const HOLO = 'linear-gradient(100deg, #ff6ad5, #c774e8 20%, #ad8cff 35%, #8795e8 50%, #94d0ff 65%, #77ffd6 80%, #ffe86b)';
const FRED = {fontFamily: 'Fredoka', fontWeight: 700, letterSpacing: '-0.01em'} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 26px rgba(0,0,0,0.6)';
const holoText = {background: HOLO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #1b1033) drop-shadow(0 10px 24px rgba(0,0,0,0.5))'} as const;

const camAt = (o: number) => {
  if (o >= S[1] && o < R) { const p = ease(o, S[1], R - S[1], Easing.in(Easing.quad)); return {z: 1 + 0.28 * p, x: 540, y: 1150, tr: p * 5}; }
  if (o >= S[3]) return {z: 1.25, x: 520, y: 1120, tr: 0};
  return {z: 1.02, x: 540, y: 960, tr: 0};
};

// 1,000 packs: a grid that fills while the narrator talks; one dot turns gold at the reveal
const Odds = ({o}: {o: number}) => {
  if (o < HOOK.ms || o >= S[3]) return null;
  const n = Math.floor(interpolate(o, [HOOK.ms + 200, R - 300], [0, 999], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const gold = o >= R;
  const bloom = ease(o, R, 600);
  const cols = 40, cell = 24;
  const gi = 1000 - 1 - 12; // the god pack
  return <div style={{position: 'absolute', left: (W - cols * cell) / 2, top: 70, width: cols * cell, opacity: 1 - ease(o, R + 1500, 400)}}>
    <div style={{...MONO, fontSize: 30, color: 'white', display: 'flex', justifyContent: 'space-between', marginBottom: 10, textShadow: shadow}}>
      <span>PACKS OPENED</span><span>{gold ? 1000 : n + 1} / 1,000</span></div>
    <svg width={cols * cell} height={25 * cell}>
      {Array.from({length: 1000}).map((_, i) => {
        const on = i <= n || gold;
        const isGod = i === gi && gold;
        return <rect key={i} x={(i % cols) * cell + 3} y={Math.floor(i / cols) * cell + 3} width={cell - 6} height={cell - 6} rx={3}
          fill={isGod ? '#FFD84D' : on ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.08)'} />;
      })}
      {gold && <circle cx={(gi % cols) * cell + cell / 2} cy={Math.floor(gi / cols) * cell + cell / 2} r={14 + bloom * 120} fill="none" stroke="#FFD84D" strokeWidth={6 * (1 - bloom) + 1} opacity={1 - bloom} />}
    </svg>
    <div style={{...FRED, fontSize: 46, color: 'white', marginTop: 8, textAlign: 'center', textShadow: shadow, opacity: ease(o, T.never, 300)}}>
      {gold ? <span style={{color: '#FFD84D'}}>…this is the one.</span> : 'most never see it'}</div>
  </div>;
};
const GodPackWord = ({o}: {o: number}) => {
  if (o < R || o >= S[3]) return null;
  return <div style={{position: 'absolute', top: 760, width: W, textAlign: 'center'}}>
    <div style={{...FRED, fontSize: 82, color: 'white', textShadow: shadow, ...land(o, T.happened, 'up')}}>IT HAPPENED!</div>
    <div style={{...FRED, fontSize: 210, lineHeight: 0.95, ...holoText, ...land(o, T.godpack - 200, 'slam')}}>GOD PACK</div>
    <div style={{...FRED, fontSize: 70, color: '#FFD84D', textShadow: shadow, ...land(o, T.real, 'zoom')}}>FOR REAL?!</div>
  </div>;
};
// binder pockets fill with the real cards as he shows them
const Binder = ({o}: {o: number}) => {
  if (o < S[3]) return null;
  const inP = pop(o, S[3], 15, 140);
  return <div style={{position: 'absolute', left: 40, top: 60, width: 1000, transform: `translateY(${(1 - inP) * -700}px)`}}>
    <div style={{background: 'rgba(20,14,40,0.88)', borderRadius: 28, padding: 22, border: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', ...MONO, fontSize: 26, color: 'white', marginBottom: 14}}>
        <span>THE PACK</span><span style={{...holoText, filter: undefined}}>EVERY CARD A HIT</span></div>
      <div style={{display: 'flex', gap: 18}}>
        {T.cards.map((at, i) => {
          const p = pop(o, at, 12, 200);
          return <div key={i} style={{flex: 1, height: 318, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '2px dashed rgba(255,255,255,0.25)', position: 'relative', overflow: 'hidden'}}>
            {o >= at && <div style={{position: 'absolute', inset: 6, transform: `translateY(${(1 - p) * -360}px) rotate(${(1 - p) * 8}deg)`}}>
              <Img src={staticFile(`img/b3/poke_${i}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10}} />
              <div style={{position: 'absolute', inset: 0, borderRadius: 10, background: `linear-gradient(115deg, transparent ${(o / 10 + i * 40) % 200 - 50}%, rgba(255,255,255,0.45) ${(o / 10 + i * 40) % 200 - 42}%, transparent ${(o / 10 + i * 40) % 200 - 34}%)`,
                mixBlendMode: 'screen'}} />
            </div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
};
const Shaking = ({o}: {o: number}) => {
  if (o < T.gross - 100) return null;
  const word = (t: string, at: number, size: number, c: string) => <div style={{...land(o, at, 'slam')}}>
    {t.split('').map((ch, i) => <span key={i} style={{display: 'inline-block', ...FRED, fontSize: size, color: c, textShadow: shadow,
      transform: `translate(${Math.sin(o * 0.9 + i * 2) * 5}px, ${Math.cos(o * 1.1 + i) * 5}px)`}}>{ch === ' ' ? ' ' : ch}</span>)}</div>;
  return <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center'}}>
    {word('THIS IS GROSS!', T.gross, 104, 'white')}
    {o >= T.shaking && word("I'M SHAKING", T.shaking, 120, '#FFD84D')}
  </div>;
};

const CAPS: Cap[] = [
  [3800, 'OH!'], [4900, 'NO!'], [6140, 'NO!'],
  ...narrCaps(LINES, PLACED, 3, {'GODPACK!': 'GOD PACK!'}, {THOUSAND: '#FFD84D', 'HIT?': '#ff7ad9', 'GOD PACK!': '#FFD84D', 'HAPPENED!': '#77ffd6'}),
  [11180, 'IT HAPPENED!', 'HAPPENED', '#77ffd6'], [13320, 'GOD PACK!', 'GOD PACK', '#FFD84D'], [14120, 'IS IT A GOD PACK?'],
  [21460, 'S-I-R!', 'S-I-R', '#ff7ad9'], [T.gross, 'THIS IS GROSS!'], [T.shaking, "I'M SHAKING!"],
];

export const GodPack = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const cam = camAt(o);
  const sh = shakeAt([[R, 20], [T.godpack, 12], ...T.cards.map((t) => [t, 6] as [number, number])], o);
  const trem = cam.tr ? {x: Math.sin(o * 0.9) * cam.tr, y: Math.cos(o * 1.1) * cam.tr} : {x: 0, y: 0};
  const flash = flashAt([[R, 0.9]], o);
  const hostGain = (t: number) => (t < S[1] ? 0.25 : t < R ? 0 : t >= L3[0] - 100 && t < L3[1] ? 0.25 : 1);
  return (
    <AbsoluteFill style={{background: '#0b0716'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + trem.x}px, ${sh.y + trem.y}px)`}}>
        {o < HOOK.ms ? <>
          <HookView file={HOOK.file} w={720} from={HOOK.from} cover={[76, 900, 568, 180]} push={1.05 + 0.05 * (o / HOOK.ms)} />
          <AbsoluteFill style={{background: HOLO, opacity: 0.16, mixBlendMode: 'color-dodge', transform: `translateX(${Math.sin(o / 300) * 120}px) scale(1.4)`}} />
        </> : <AbsoluteFill style={{overflow: 'hidden'}}>
          <AbsoluteFill style={{transformOrigin: `${cam.x}px ${cam.y}px`, transform: `scale(${cam.z})`, filter: 'contrast(1.08) saturate(1.1)'}}>
            <StreamView src={SRC} srcW={1080} tl={tl} />
            <Blurs tl={tl} o={o} srcW={1080} boxes={[{src: [1500, 7400], box: [40, 600, 1000, 1200]}]} />
          </AbsoluteFill>
          {o < R && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,7,22,0.82) 0 33%, transparent 45%)'}} />}
        </AbsoluteFill>}
        {o >= S[1] && o < R && <AbsoluteFill style={{background: HOLO, opacity: 0.1 * ease(o, S[1], R - S[1]), mixBlendMode: 'color-dodge'}} />}
        <Odds o={o} />
        <GodPackWord o={o} />
        <Binder o={o} />
        <Shaking o={o} />
        {o < HOOK.ms && <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', ...FRED, fontSize: 96, ...holoText, ...land(o, 400, 'slam')}}>1 IN 1,000 PACKS…</div>}
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, HOOK.ms], [R, S[3]]]} top={1640} anim="pop" keyColor="#FFD84D"
        style={{...FRED, fontSize: 70, color: '#fff', WebkitTextStroke: '5px #1b1033', paintOrder: 'stroke fill', textShadow: shadow}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(8,4,20,0.6) 100%)', pointerEvents: 'none'}} />
      <Grain frame={frame} opacity={0.07} />
      {flash > 0 && <AbsoluteFill style={{background: HOLO, opacity: flash}} />}
      <HookAudio file={HOOK.file} from={HOOK.from} ms={HOOK.ms} vol={0.9} />
      <HostAudio src={SRC} tl={tl} gain={hostGain} />
      <Narration file="narr/b3_pokemon_loud.mp3" lines={LINES} placed={PLACED} />
      <Riser peakAt={R} lead={2400} vol={0.22} />
      {/* Tipo Insta Buzeira: 19.3 s drop on the reveal */}
      <Music file="tipo-insta-buzeira.mp3" songFrom={19300 - R} level={(t) => {
        if (t < HOOK.ms) return 0;
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= R - 350 && t < R) return 0;
        if (t < R) return 0.06;
        if (t >= L3[0] && t < L3[1]) return 0.08 * end;
        return 0.3 * end;
      }} />
      <SfxTrack list={[
        sfx('fast-whoosh', S[0], 0.32), ...Array.from({length: 12}).map((_, i) => sfx('mg-click', HOOK.ms + 300 + i * 300, 0.08)),
        sfx('heartbeat-loud', S[1] + 200, 0.32, R - S[1] - 300), sfx('mg-boom', R, 0.2), sfx('mg-shimmer', R, 0.4), sfx('mg-click', T.godpack - 200, 0.35),
        sfx('fast-whoosh', S[3], 0.3), ...T.cards.map((t) => sfx('mg-swoosh', t, 0.3)), sfx('mg-shimmer', T.cards[3] + 200, 0.3),
        sfx('mg-click', T.gross, 0.3), sfx('mg-click', T.shaking, 0.3),
      ]} />
    </AbsoluteFill>
  );
};
