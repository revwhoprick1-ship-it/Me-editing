// Trevor Lawrence clip: Trevor meets his biggest superfans, the Traveling Trevors (Trevor Lawrence Clips tab).
import words from '../data/t3_traveling_trevors.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t3_traveling_trevors.mp4',
  cuts: [[50800, 52800], [57400, 62800], [64300, 84300], [91600, 98400]],
  seats: {L: 410, M: 990, R: 1560},
  speakers: [{from: 50800, who: 'L'}, {from: 57400, who: 'L'}, {from: 64300, who: 'M'}],
  words,
  fix: {TREVERS: 'TREVORS', WHACKED: 'WHACKED'},
  colors: {BEST: '#5CFF5C', QUARTERBACK: '#FFE14D', FANS: '#5CFF5C', TRAVELING: '#FFE14D', TREVORS: '#FFE14D',
    ALGORITHM: '#5CC8FF', INSTAGRAM: '#5CC8FF', WEIRD: '#FF4D4D', WHACKED: '#FF4D4D', FUNNY: '#5CFF5C'},
  emoji: {QUARTERBACK: '1f410', ALGORITHM: '1f440', WEIRD: '1f914', FUNNY: '1f602'},
  hook: {text: 'Trevor finally met his biggest superfans', emoji: '1f602'},
  punch: {at: 83000, to: 84300, sticker: '1f480', sfx: 'vine-boom.mp3'},
  laugh: {from: 83100, to: 84300, emoji: ['1f602', '1f62d', '1f480']},
  circle: {at: 57400, who: 'M'},
  extraSfx: [{file: 'rizz-sound-effect.mp3', at: 50900, volume: 0.35, onset: 60, maxMs: 1800}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
