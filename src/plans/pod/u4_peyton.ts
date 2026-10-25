// Trevor Lawrence clip: Trevor on texting Peyton Manning and leaning on him as a rookie (wholesome -> Blue / W Speed).
import track from '../data/u4_peyton_w.seats.json';
import words from '../data/u4_peyton_w.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u4_peyton_w.mp4', // 5.92 s freeze inserted at 49.9 s (W Speed)
  cuts: [[11400, 19900], [39100, 55820]],
  seats: {L: 390, M: 930, R: 1440},
  track: track as SeatTrack,
  speakers: [{from: 11400, who: 'L'}, {from: 13600, who: 'M'}, {from: 14200, who: 'L'}, {from: 14800, who: 'M'}, {from: 39100, who: 'M'}],
  words,
  mood: 'wholesome',
  colors: {PEYTON: '#FFE14D', MANNING: '#FFE14D', RELATIONSHIP: '#FF6EC7', TEXT: '#5CC8FF', SEASON: '#5CFF5C', ROOKIE: '#5CFF5C', PERSPECTIVE: '#FFE14D', CHALLENGES: '#FF4D4D', INDY: '#5CC8FF', GREAT: '#5CFF5C'},
  emoji: {RELATIONSHIP: '1f979', TEXT: '1f4f1', GREAT: '1f64f'},
  hook: {text: 'Peyton Manning checks in on Trevor', emoji: '1f979'},
  cutouts: [{from: 44000, to: 46600, images: [{file: 'peyton.png', h: 620, x: 329}]}],
  actions: [{at: 16800, to: 19800, name: 'TREVOR', text: 'TEXTS PEYTON MANNING'}],
  wspeed: {at: 49900, text: 'W TREVOR', beatMs: 740, beats: 8},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
