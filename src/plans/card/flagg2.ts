// Cooper Flagg Papa auto 1/1 ($100,000+), Topps Chrome Sapphire NBA, Historical Big Pulls (batch 2).
// Source: footage/batch/b2_flagg_papa.mp4 (1080x1920: hosts cam 0-520, ticker, card cam from 745).
import narration from '../../../public/narr/flagg2.json';
import words from '../data/b2_flagg_papa.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/flagg_papa.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 520,
    hosts: {x: 0, y: 0, w: 1080, h: 520}, card: {x: 0, y: 745, w: 1080, h: 1175}, react: {x: 100, y: 0, w: 840, h: 520}, ringR: 100},
  still: {file: 'cards2/flagg.png', w: 372, h: 500},
  card: {name: 'COOPER FLAGG', parallel: 'PAPA AUTO 1/1', price: '$100,000+', revealAt: 48000,
    center: {x: 510, y: 1110}, serial: {x: 520, y: 1300}, zoom: 1.15},
  hookClip: {file: 'hooks/rise_up_and_bring_the_earth_down.mp4', from: 0, to: 2600, cover: [20, 850, 690, 170],
    words: [{text: 'RISE', at: 0}, {text: 'UP!', at: 700, color: '#5CFF5C'}]},
  music: {file: 'vem-pere-reka.mp3', drop: 21100, length: 127000},
  cuts: [[29100, 36000]],
  suspense: [46500, 48000],
  after: [[48000, 56500], [101800, 104500]],
  reactionAt: 49500,
  questionAt: 103000,
  blurs: [{from: 29100, to: 48000, box: [40, 760, 1000, 1150]}],
  zooms: [{from: 32000, to: 35800, scale: 1.1, x: 540, y: 1150}, {from: 52800, to: 55000, scale: 1.12, x: 500, y: 260}],
  track: [],
  banner: {count: '1', price: '$100,000', teaser: 'NBA ROOKIE... WHO IS IT?', named: 'COOPER FLAGG PAPA AUTO!'},
  narrColors: {COOPER: '#FFE14D', FLAGG: '#FFE14D', PAPA: '#FF6EC7', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D', '$100,000': '#5CFF5C', PINK: '#FF6EC7'},
  words,
  narration, narrFile: 'narr/flagg2_loud.mp3',
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
