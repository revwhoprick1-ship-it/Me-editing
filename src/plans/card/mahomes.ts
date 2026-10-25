// Patrick Mahomes Green Kaboom auto 1/1 ($60-100K), Panini Authentically Mahomes, Historical Big Pulls (batch 2).
// Source: footage/batch/b2_mahomes_kaboom.mp4 (1080x1920: hosts cam 0-500, ticker, card cam from 530).
import narration from '../../../public/narr/mahomes.json';
import words from '../data/b2_mahomes_kaboom.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/mahomes_kaboom.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 500,
    hosts: {x: 0, y: 0, w: 1080, h: 500}, card: {x: 0, y: 530, w: 1080, h: 1390}, react: {x: 180, y: 90, w: 820, h: 410}, ringR: 100},
  still: {file: 'cards2/mahomes.png', w: 600, h: 800},
  card: {name: 'PATRICK MAHOMES', parallel: 'GREEN KABOOM AUTO 1/1', price: '$100,000', revealAt: 20400,
    center: {x: 560, y: 1450}, serial: {x: 640, y: 1300}, zoom: 1.15},
  hookClip: {file: 'hooks/thats_the_goat.mp4', from: 0, to: 2900, cover: [20, 950, 680, 240],
    words: [{text: "THAT'S", at: 0}, {text: 'THE', at: 300}, {text: 'GOAT!', at: 400, color: '#5CFF5C'}]},
  music: {file: 'eclipser.mp3', drop: 15800, length: 172000},
  cuts: [[0, 2600], [16600, 19000]],
  suspense: [19000, 20400],
  after: [[20400, 26000], [33800, 36100]],
  reactionAt: 23800,
  questionAt: 34600,
  blurs: [{from: 0, to: 20400, box: [40, 620, 1000, 1300]}],
  zooms: [{from: 1200, to: 2600, scale: 1.1, x: 540, y: 1300}, {from: 24300, to: 25800, scale: 1.12, x: 840, y: 330}],
  track: [{at: 24200, x: 844, y: 340}, {at: 24400, x: 850, y: 350}, {at: 24633, x: 872, y: 376}, {at: 24833, x: 888, y: 400}, {at: 25033, x: 908, y: 418}, {at: 25233, x: 921, y: 422}, {at: 25467, x: 930, y: 428}, {at: 25667, x: 936, y: 432}, {at: 25867, x: 944, y: 434}, {at: 26067, x: 948, y: 436}, {at: 26267, x: 958, y: 438}, {at: 26467, x: 966, y: 439}, {at: 26667, x: 957, y: 432}, {at: 26867, x: 943, y: 424}, {at: 27067, x: 918, y: 416}],
  banner: {count: '1', price: '$100,000', teaser: 'NFL GOAT... WHAT DID THEY PULL?', named: 'MAHOMES GREEN KABOOM 1/1!'},
  narrColors: {PATRICK: '#FFE14D', MAHOMES: '#FFE14D', GREEN: '#5CFF5C', KABOOM: '#5CFF5C', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D', '$100,000': '#5CFF5C', RECORD: '#FF4D4D'},
  words,
  narration, narrFile: 'narr/mahomes_loud.mp3',
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
