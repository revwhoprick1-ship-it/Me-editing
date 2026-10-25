// Trevor Lawrence clip: Trevor on texting Peyton Manning and leaning on him as a rookie (wholesome -> Blue / W Speed).
import track from '../data/u4_peyton.seats.json';
import words from '../data/u4_peyton.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u4_peyton.mp4',
  cuts: [[11400, 19900], [25600, 29000], [38300, 46600]],
  seats: {L: 390, M: 930, R: 1440},
  track: track as SeatTrack,
  speakers: [{from: 11400, who: 'L'}, {from: 13600, who: 'M'}, {from: 14200, who: 'L'}, {from: 14800, who: 'M'}, {from: 25500, who: 'M'}],
  words,
  mood: 'wholesome',
  colors: {PEYTON: '#FFE14D', MANNING: '#FFE14D', RELATIONSHIP: '#FF6EC7', TEXT: '#5CC8FF', SEASON: '#5CFF5C', ROOKIE: '#5CFF5C', PERSPECTIVE: '#FFE14D', CHALLENGES: '#FF4D4D', INDY: '#5CC8FF', GREAT: '#5CFF5C'},
  emoji: {RELATIONSHIP: '1f979', TEXT: '1f4f1', GREAT: '1f64f'},
  hook: {text: 'Peyton Manning checks in on Trevor', emoji: '1f979'},
  cutouts: [{from: 38300, to: 41000, images: [{file: 'peyton.png', h: 620, x: 329}]}],
  actions: [{at: 16800, to: 19800, name: 'TREVOR', text: 'TEXTS PEYTON MANNING'}],
  wspeed: {at: 25600, text: 'W TREVOR', beatMs: 740, beats: 4, crowd: [{file: 'hooks/costco_guys_boom.mp4', from: 400}, {file: 'hooks/scream_yessir.mp4', from: 0}, {file: 'hooks/oh_my_god_our_first_one.mp4', from: 200}, {file: 'hooks/holy_scream.mp4', from: 100}]},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
