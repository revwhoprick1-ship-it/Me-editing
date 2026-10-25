// LeBron James Logoman ($350,000+), Eminence, Historical Big Pulls (batch 2).
// Source: footage/batch/b2_lebron_logoman.mp4 (1080x1920: hosts cam 0-486, ticker, card cam from 700).
import narration from '../../../public/narr/lebron2.json';
import words from '../data/b2_lebron_logoman.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/lebron_logoman.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 486,
    hosts: {x: 0, y: 0, w: 1080, h: 486}, card: {x: 0, y: 700, w: 1080, h: 1220}, react: {x: 160, y: 0, w: 820, h: 486}, ringR: 100},
  still: {file: 'cards2/lebron.png', w: 534, h: 714},
  card: {name: 'LEBRON JAMES', parallel: 'LOGOMAN 1/1', price: '$350,000', revealAt: 23000,
    center: {x: 720, y: 1520}, serial: {x: 780, y: 1700}, zoom: 1.1},
  hookClip: {file: 'hooks/the_greatest_player.mp4', from: 0, to: 3200, cover: [40, 940, 660, 190],
    words: [{text: 'THE', at: 0}, {text: 'GREATEST', at: 300, color: '#FFE14D'}, {text: 'PLAYER', at: 700}]},
  music: {file: 'acido-iii.mp3', drop: 21700, length: 108000},
  cuts: [[12300, 16000], [20400, 21300]],
  suspense: [21300, 23000],
  after: [[23000, 29500], [47600, 51500]],
  reactionAt: 24500,
  questionAt: 50000,
  blurs: [{from: 12300, to: 23000, box: [60, 760, 960, 1140]}],
  zooms: [{from: 14200, to: 16000, scale: 1.12, x: 540, y: 1400}, {from: 48000, to: 49800, scale: 1.12, x: 700, y: 300}],
  track: [{at: 24816, x: 798, y: 324}, {at: 25025, x: 778, y: 340}, {at: 25234, x: 788, y: 366}, {at: 25442, x: 802, y: 366}, {at: 25651, x: 827, y: 348}, {at: 25859, x: 803, y: 326}, {at: 26068, x: 798, y: 270}, {at: 26276, x: 745, y: 258}, {at: 26485, x: 702, y: 138}, {at: 26693, x: 658, y: 116}, {at: 26902, x: 653, y: 192}, {at: 27110, x: 626, y: 103}, {at: 27319, x: 611, y: 141}, {at: 27528, x: 640, y: 120}, {at: 27736, x: 650, y: 102}, {at: 27945, x: 658, y: 178}, {at: 28153, x: 648, y: 92}, {at: 28362, x: 671, y: 144}],
  banner: {count: '1', price: '$350,000', teaser: 'NBA LEGEND... WHO IS IT?', named: 'LEBRON JAMES LOGOMAN!'},
  narrColors: {LEBRON: '#FFE14D', JAMES: '#FFE14D', LOGOMAN: '#FFE14D', LOGO: '#FFE14D', MAN: '#FFE14D', ONE: '#FF4D4D', '$350,000': '#5CFF5C', CHASE: '#FF4D4D'},
  words,
  narration, narrFile: 'narr/lebron2_loud.mp3',
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
