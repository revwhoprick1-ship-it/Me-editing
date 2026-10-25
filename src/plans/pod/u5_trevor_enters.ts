// Trevor Lawrence clip: the boys chant "all hail the king" and bow as Trevor walks in (wholesome -> W Speed).
// Source = original 13.7 s + a 2x slow-mo replay of the bow (8-11 s), built with ffmpeg.
import track from '../data/u5_trevor_enters.seats.json';
import words from '../data/u5_trevor_enters.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u5_trevor_enters_w.mp4', // 13.7 s + 2x replay of the bow + 5.92 s freeze (W Speed)
  cuts: [[0, 24100]],
  seats: {L: 750, M: 1150, R: 1600},
  track: track as SeatTrack,
  // people walk around here: wide shots, tracking only the bowing host (M)
  speakers: [{from: 0, who: 'W'}, {from: 9000, who: 'M'}, {from: 11000, who: 'W'}, {from: 13700, who: 'M'}, {from: 18200, who: 'W'}],
  words,
  mood: 'wholesome',
  colors: {HAIL: '#FFE14D', KING: '#FFE14D', BOYS: '#5CFF5C'},
  emoji: {KING: '1f451'},
  hook: {text: 'The boys bowed down when Trevor walked in', emoji: '1f451'},
  actions: [{at: 7300, to: 9000, name: 'TREVOR', text: 'WALKS IN'}, {at: 9000, to: 11200, name: 'THE BOYS', text: 'BOW DOWN'}],
  wspeed: {at: 18200, text: 'W TREVOR', beatMs: 740, beats: 8},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
