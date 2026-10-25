// Edit2: a righty who throws better rolling LEFT, because coaches only rolled him right as a kid (Trevor Lawrence Clips, t3).
import track from '../data/t3_traveling_trevors.seats.json';
import words from '../data/t3_traveling_trevors.words.json';
import type {Edit2Plan, SeatTrack} from './types';

export const PLAN: Edit2Plan = {
  name: 'goleft',
  src: 'pod/t3_traveling_trevors.mp4',
  words,
  track: track as SeatTrack,
  speakers: [{from: 0, who: 'M'}],
  segs: [[46720, 50650], [16220, 19350], [25720, 31250], [32100, 39600], [44820, 46300]],
  hook: {small: 'TREVOR LAWRENCE', big: 'A righty who throws better going LEFT?'},
  stacks: [
    {x: 80, y: 900, align: 'left', to: 50650, lines: [
      {t: 'I throw it a little bit', font: 'sans', size: 58, at: 48300},
      {t: 'better', font: 'serif', size: 120, at: 48840},
      {t: 'moving', font: 'serifI', size: 110, at: 49040},
      {t: 'LEFT', font: 'bold', size: 260, at: 49440},
      {t: 'than right.', font: 'serifI', size: 120, at: 49760},
    ]},
    {x: 80, y: 1000, align: 'left', to: 19350, lines: [
      {t: "it's something I've worked on", font: 'sans', size: 56, at: 16260},
      {t: 'since I was a', font: 'serif', size: 110, at: 17400},
      {t: 'KID.', font: 'bold', size: 240, at: 18860},
    ]},
    {x: 1000, y: 950, align: 'right', to: 39600, lines: [
      {t: "I don't want to be the guy", font: 'sans', size: 56, at: 37440},
      {t: 'that can only throw', font: 'serif', size: 100, at: 38240},
      {t: 'to his', font: 'serifI', size: 100, at: 38700},
      {t: 'RIGHT.', font: 'bold', size: 220, at: 38940},
    ]},
    {x: 80, y: 1000, align: 'left', to: 46300, lines: [
      {t: "So I've worked going", font: 'sans', size: 58, at: 44820},
      {t: 'LEFT', font: 'bold', size: 260, at: 45520},
      {t: 'so much.', font: 'serifI', size: 140, at: 45920},
    ]},
  ],
  subs: [
    {from: 46720, to: 48300, one: true, y: 1080},
    {from: 25720, to: 31250, y: 1745, size: 44},
    {from: 32100, to: 36500, y: 1745, size: 44},
    {from: 36500, to: 37440, one: true, y: 1080},
  ],
  scenes: [
    {type: 'field', from: 25720, to: 36500, variant: 'rollout', title: 'Coaches only roll you right.',
      events: {right: 28220, cross: 32800, left: 34440, throw: 36000}},
  ],
  punches: [[49440, 50000, 1.12], [45520, 46000, 1.1]],
  music: {file: 'experience-einaudi.mp3', from: 44000},
  outro: {lines: [
    {t: 'Train', font: 'sans', size: 70},
    {t: 'your weak', font: 'serif', size: 190},
    {t: 'side.', font: 'serifI', size: 190, color: '#FFE3A3'},
  ]},
};
