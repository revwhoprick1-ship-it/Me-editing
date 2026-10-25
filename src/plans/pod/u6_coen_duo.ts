// Trevor Lawrence clip: what Liam Coen has taught Trevor (wholesome -> Blue / W Speed).
import track from '../data/u6_coen_duo.seats.json';
import words from '../data/u6_coen_duo.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u6_coen_duo.mp4',
  cuts: [[6500, 15400], [18300, 27700], [66500, 67600], [109000, 114300]],
  seats: {L: 420, M: 945, R: 1410},
  track: track as SeatTrack,
  speakers: [{from: 6500, who: 'L'}, {from: 18300, who: 'M'}],
  words,
  mood: 'wholesome',
  fix: {COHEN: 'COEN'},
  colors: {LIAM: '#FFE14D', COEN: '#FFE14D', TAUGHT: '#5CFF5C', DEFINITELY: '#5CFF5C', SYSTEM: '#5CC8FF', DIFFERENT: '#FFE14D', CONFIDENCE: '#5CFF5C', RIP: '#FF4D4D', COVERAGES: '#5CC8FF'},
  emoji: {TAUGHT: '1f9e0', DEFINITELY: '1f64f'},
  hook: {text: 'Trevor on what Liam Coen changed for him', emoji: '1f64f'},
  actions: [{at: 18300, to: 20300, name: 'TREVOR', text: 'CONFIRMS IT'}],
  wspeed: {at: 109400, text: 'W TREVOR', beatMs: 740, beats: 6, crowd: [{file: 'hooks/costco_guys_boom.mp4', from: 400}, {file: 'hooks/scream_yessir.mp4', from: 0}, {file: 'hooks/oh_my_god_our_first_one.mp4', from: 200}, {file: 'hooks/holy_scream.mp4', from: 100}]},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
