// Edit2: how Trevor knows the coverage before the snap, what Liam Coen taught him (Trevor Lawrence Clips, u6).
import track from '../data/u6_coen_duo.seats.json';
import words from '../data/u6_coen_duo.words.json';
import type {Edit2Plan, SeatTrack} from './types';

export const PLAN: Edit2Plan = {
  name: 'coverage',
  src: 'pod2/u6_coen_duo.mp4',
  words,
  track: track as SeatTrack,
  speakers: [{from: 0, who: 'M'}],
  segs: [[109000, 113400], [66480, 68200], [76580, 83300], [91800, 100100], [106720, 108700]],
  hook: {small: 'TREVOR LAWRENCE', big: 'How an NFL QB knows the coverage before the snap'},
  stacks: [
    {x: 80, y: 1000, align: 'left', to: 113400, lines: [
      {t: 'I have the most', font: 'sans', size: 60, at: 109080},
      {t: 'CONFIDENCE', font: 'bold', size: 148, at: 110460},
      {t: 'before the ball', font: 'serif', size: 100, at: 110920},
      {t: 'is snapped.', font: 'serifI', size: 140, at: 111580},
    ]},
    {x: 80, y: 960, align: 'left', to: 108700, lines: [
      {t: 'I know right away,', font: 'sans', size: 60, at: 106720},
      {t: "it's", font: 'serif', size: 110, at: 107700},
      {t: 'COVER 3.', font: 'bold', size: 200, at: 107760},
      {t: 'I got the seam.', font: 'serifI', size: 120, at: 108260},
    ]},
  ],
  subs: [
    {from: 66480, to: 68200, y: 940, size: 46},
    {from: 76580, to: 83300, y: 1745, size: 44},
    {from: 91800, to: 100100, y: 1745, size: 44},
  ],
  fix: {lineback: 'linebacker'},
  scenes: [
    {type: 'card', from: 66480, to: 68200, name: ['Liam', 'Coen.'], chips: ['JAGUARS HEAD COACH']},
    {type: 'field', from: 76580, to: 83300, variant: 'coverage', title: "Why's he wide open?",
      events: {open: 77300, motion: 79360, show: 82100}},
    {type: 'field', from: 91800, to: 100100, variant: 'cover3', title: 'Then you see it.',
      events: {seams: 95820, zones: 98320, throw: 99840}},
  ],
  punches: [[110460, 111000, 1.1], [107760, 108300, 1.12]],
  music: {file: 'interstellar-piano.mp3', from: 10000},
  outro: {lines: [
    {t: 'Know it', font: 'sans', size: 70},
    {t: 'before', font: 'serif', size: 210},
    {t: 'the snap.', font: 'serifI', size: 170, color: '#FFE3A3'},
  ]},
};
