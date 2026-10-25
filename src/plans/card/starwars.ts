// Obi-Wan, Anakin, Padme triple auto super 1/1 ($12,000+), Topps Finest Star Wars, Historical Big Pulls (batch 2).
// Source: footage/batch/b2_starwars_triple.mp4 (1080x1920: hosts cam 0-520, ticker, card cam from 700). Delayed "ONE OF ONE!" reaction.
import narration from '../../../public/narr/starwars.json';
import words from '../data/b2_starwars_triple.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/starwars_triple.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 520,
    hosts: {x: 0, y: 0, w: 1080, h: 520}, card: {x: 0, y: 700, w: 1080, h: 1220}, react: {x: 120, y: 0, w: 840, h: 520}, ringR: 100},
  still: {file: 'cards2/starwars.png', w: 404, h: 470},
  card: {name: 'OBI-WAN, ANAKIN & PADME', parallel: 'TRIPLE AUTO 1/1', price: '$12,000+', revealAt: 59600,
    center: {x: 460, y: 1160}, serial: {x: 520, y: 1300}, zoom: 1.2},
  hookClip: {file: 'hooks/trip_mind_boggling.mp4', from: 600, to: 3400, cover: [20, 860, 690, 110],
    words: [{text: 'NAH!', at: 800, color: '#FF4D4D'}, {text: 'THAT', at: 2200}, {text: 'IS', at: 2400}, {text: 'MIND-BOGGLING!', at: 2500, color: '#FFE14D'}]},
  music: {file: 'montagem-uranium.mp3', drop: 9300, length: 93000},
  cuts: [[48800, 52500], [53600, 55400]],
  suspense: [57800, 59600],
  after: [[59600, 70600]],
  reactionAt: 62800,
  questionAt: 69000,
  blurs: [{from: 48800, to: 59600, box: [40, 760, 1000, 1100]}],
  zooms: [{from: 50800, to: 52500, scale: 1.12, x: 540, y: 1200}, {from: 66500, to: 68500, scale: 1.12, x: 360, y: 300}],
  track: [{at: 63200, x: 364, y: 306}, {at: 63400, x: 330, y: 249}, {at: 63633, x: 288, y: 245}, {at: 63833, x: 299, y: 278}, {at: 64067, x: 280, y: 307}, {at: 64267, x: 296, y: 346}],
  banner: {count: '1', price: '$12,000', teaser: 'STAR WARS... WHO IS IT?', named: 'ANAKIN, OBI-WAN & PADME!'},
  narrColors: {ANAKIN: '#5CC8FF', 'OBI-WAN': '#5CC8FF', PADME: '#FF6EC7', TRIPLE: '#FFE14D', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D', NUMBER: '#FF4D4D'},
  words,
  narration, narrFile: 'narr/starwars_loud.mp3',
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
