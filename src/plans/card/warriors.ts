// Warriors triple Logoman (Curry, Klay, Draymond) ($350,000), Panini Flawless, Historical Big Pulls (batch 2).
// Source: footage/batch/b2_warriors_logoman.mp4 from 425 s (trimmed to public/cards2; 1920x1080: hosts left, Whatnot phone right).
import narration from '../../../public/narr/warriors.json';
import words from '../data/b2_warriors_logoman.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/warriors_logoman.mp4',
  geom: {srcW: 1920, srcH: 1080, topH: 610,
    hosts: {x: 0, y: 150, w: 1340, h: 757}, card: {x: 1340, y: 0, w: 580, h: 1080}, react: {x: 0, y: 0, w: 1340, h: 1080}, ringR: 120},
  still: {file: 'cards2/warriors.png', w: 460, h: 320},
  card: {name: 'CURRY, KLAY & DRAYMOND', parallel: 'TRIPLE LOGOMAN', price: '$350,000', revealAt: 40800,
    center: {x: 1610, y: 520}, serial: {x: 1700, y: 600}, zoom: 1.3},
  hookClip: {file: 'hooks/theyre_gonna_say_its_rigged.mp4', from: 1000, to: 4700, cover: [70, 105, 580, 130],
    words: [{text: 'OH', at: 1100}, {text: 'NO!', at: 1600, color: '#FF4D4D'}, {text: "THEY'RE", at: 1800}, {text: 'GONNA', at: 1900}, {text: 'SAY', at: 2100}, {text: "IT'S", at: 2300}, {text: 'RIGGED!', at: 2500, color: '#FF4D4D'}]},
  music: {file: 'funk-do-balkan.mp3', drop: 11900, length: 86000},
  cuts: [[12400, 16800], [21100, 23100], [32400, 35000]],
  suspense: [39300, 40800],
  after: [[40800, 47000], [49400, 51500]],
  reactionAt: 42000,
  questionAt: 50300,
  blurs: [{from: 12400, to: 40800, box: [1360, 150, 540, 750]}],
  zooms: [{from: 21100, to: 23100, scale: 1.12, x: 1600, y: 500}, {from: 43500, to: 46000, scale: 1.12, x: 700, y: 450}],
  track: [],
  banner: {count: '1', price: '$350,000', teaser: 'NBA LEGENDS... WHO IS IT?', named: 'WARRIORS TRIPLE LOGOMAN!'},
  narrColors: {CURRY: '#FFE14D', KLAY: '#FFE14D', DRAYMOND: '#FFE14D', TRIPLE: '#FF4D4D', LOGOMAN: '#FFE14D', '$350,000': '#5CFF5C', LEGENDS: '#5CC8FF'},
  words,
  narration, narrFile: 'narr/warriors_loud.mp3',
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
