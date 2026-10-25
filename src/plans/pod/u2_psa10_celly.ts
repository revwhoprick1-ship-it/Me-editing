// Trevor Lawrence clip: the boys give Trevor a PSA 10 touchdown celly (funny).
import track from '../data/u2_psa10_celly.seats.json';
import words from '../data/u2_psa10_celly.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u2_psa10_celly.mp4',
  cuts: [[4000, 8700], [18900, 32300]],
  seats: {L: 360, M: 930, R: 1410},
  track: track as SeatTrack,
  speakers: [{from: 4000, who: 'L'}, {from: 8400, who: 'M'}, {from: 18900, who: 'L'}, {from: 30600, who: 'M'}, {from: 31800, who: 'L'}],
  words,
  mood: 'funny',
  fix: {SELLY: 'CELLY', '1010': '10'},
  colors: {CELLY: '#FFE14D', TOUCHDOWN: '#5CFF5C', PSA: '#FF4D4D', '10': '#5CFF5C', BEST: '#5CFF5C', GRADE: '#FFE14D', EASY: '#5CFF5C', COLLECTORS: '#5CC8FF', MAYBE: '#FF4D4D'},
  emoji: {MAYBE: '1f914', EASY: '1f60e', COLLECTORS: '1f0cf'},
  hook: {text: 'They gave Trevor a new touchdown celly', emoji: '1f4af'},
  punch: {at: 27600, to: 28700, sticker: '1f4af', sfx: 'vine-boom.mp3'},
  laugh: {from: 28700, to: 32300, emoji: ['1f602', '1f4af', '1f525']},
  circle: {at: 4000, who: 'M'},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
