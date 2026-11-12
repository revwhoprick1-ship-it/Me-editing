export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
  color?: string;
}

export interface SceneConfig {
  id: string;
  videoStartSec: number;
  durationInFrames: number;
  zoom?: number;
  overlay?: {
    price: string;
    imageFile?: string;
    delayFrames?: number;
  };
  words: WordTiming[];
}

export const SCENES: SceneConfig[] = [
  {
    id: 'hook-question',
    videoStartSec: 412.5,
    durationInFrames: 42,
    zoom: 1.05,
    words: [
      { word: "what's", startFrame: 0, endFrame: 10 },
      { word: 'the', startFrame: 10, endFrame: 16 },
      { word: 'most', startFrame: 16, endFrame: 24 },
      { word: 'expensive', startFrame: 24, endFrame: 34, color: '#38bdf8' },
      { word: 'thing', startFrame: 34, endFrame: 38 },
      { word: 'they', startFrame: 38, endFrame: 40 },
      { word: 'bought', startFrame: 40, endFrame: 42 },
    ],
  },
  {
    id: 'hulk-lotus',
    videoStartSec: 418.0,
    durationInFrames: 54,
    overlay: { price: '$100,000+', delayFrames: 6 },
    words: [
      { word: 'lotus', startFrame: 4, endFrame: 20, color: '#fbbf24' },
      { word: 'emira', startFrame: 20, endFrame: 36 },
      { word: 'v6', startFrame: 36, endFrame: 54, color: '#38bdf8' },
    ],
  },
  {
    id: 'fomo-mercedes',
    videoStartSec: 435.2,
    durationInFrames: 54,
    overlay: { price: '$180,000+', delayFrames: 6 },
    words: [
      { word: 'mercedes', startFrame: 4, endFrame: 22, color: '#fbbf24' },
      { word: 'amg', startFrame: 22, endFrame: 38 },
      { word: 'gt', startFrame: 38, endFrame: 46 },
      { word: '63', startFrame: 46, endFrame: 54, color: '#38bdf8' },
    ],
  },
  {
    id: 'ironman-m3',
    videoStartSec: 452.8,
    durationInFrames: 57,
    overlay: { price: '$80,000+', delayFrames: 8 },
    words: [
      { word: 'bought', startFrame: 0, endFrame: 12 },
      { word: 'my', startFrame: 12, endFrame: 18 },
      { word: 'dad', startFrame: 18, endFrame: 26 },
      { word: 'a', startFrame: 26, endFrame: 30 },
      { word: 'm3', startFrame: 30, endFrame: 42, color: '#fbbf24' },
      { word: 'in', startFrame: 42, endFrame: 46 },
      { word: 'singapore', startFrame: 46, endFrame: 57, color: '#fbbf24' },
    ],
  },
  {
    id: 'batman-rolex',
    videoStartSec: 468.0,
    durationInFrames: 48,
    overlay: { price: '$40,000+', delayFrames: 5 },
    words: [
      { word: 'rolex', startFrame: 0, endFrame: 18, color: '#fbbf24' },
      { word: 'day-date', startFrame: 18, endFrame: 34 },
      { word: '40k', startFrame: 34, endFrame: 48, color: '#22c55e' },
    ],
  },
  {
    id: 'clown-mustangs',
    videoStartSec: 485.4,
    durationInFrames: 84,
    overlay: { price: '$150,000+', delayFrames: 10 },
    words: [
      { word: 'i', startFrame: 0, endFrame: 6 },
      { word: 'had', startFrame: 6, endFrame: 14 },
      { word: 'two', startFrame: 14, endFrame: 24, color: '#22c55e' },
      { word: 'mustangs', startFrame: 24, endFrame: 42 },
      { word: 'gts', startFrame: 42, endFrame: 56 },
      { word: 'i', startFrame: 56, endFrame: 62 },
      { word: 'had', startFrame: 62, endFrame: 68 },
      { word: 'to', startFrame: 68, endFrame: 74 },
      { word: 'sell', startFrame: 74, endFrame: 84, color: '#ef4444' },
    ],
  },
  {
    id: 'judges-laughing',
    videoStartSec: 493.0,
    durationInFrames: 115,
    zoom: 1.08,
    words: [
      { word: 'why', startFrame: 0, endFrame: 8, color: '#38bdf8' },
      { word: 'do', startFrame: 8, endFrame: 14 },
      { word: 'you', startFrame: 14, endFrame: 20 },
      { word: 'keep', startFrame: 20, endFrame: 28 },
      { word: 'laughing', startFrame: 28, endFrame: 42 },
      { word: 'i', startFrame: 42, endFrame: 48, color: '#fbbf24' },
      { word: 'believe', startFrame: 48, endFrame: 60 },
      { word: 'this', startFrame: 60, endFrame: 70 },
      { word: "he's", startFrame: 70, endFrame: 90 },
      { word: 'sus', startFrame: 90, endFrame: 115, color: '#38bdf8' },
    ],
  },
  {
    id: 'confessional-doubt',
    videoStartSec: 501.2,
    durationInFrames: 102,
    words: [
      { word: 'could', startFrame: 0, endFrame: 10, color: '#fbbf24' },
      { word: 'be', startFrame: 10, endFrame: 18 },
      { word: 'right', startFrame: 18, endFrame: 30 },
      { word: 'why', startFrame: 30, endFrame: 44 },
      { word: 'would', startFrame: 44, endFrame: 52 },
      { word: 'you', startFrame: 52, endFrame: 60 },
      { word: 'need', startFrame: 60, endFrame: 70, color: '#38bdf8' },
      { word: 'two', startFrame: 70, endFrame: 80, color: '#fbbf24' },
      { word: 'of', startFrame: 80, endFrame: 85 },
      { word: 'the', startFrame: 85, endFrame: 90 },
      { word: 'same', startFrame: 90, endFrame: 96, color: '#fbbf24' },
      { word: 'car', startFrame: 96, endFrame: 102, color: '#22c55e' },
    ],
  },
  {
    id: 'the-reveal',
    videoStartSec: 1480.0,
    durationInFrames: 104,
    zoom: 1.06,
    words: [
      { word: 'will', startFrame: 0, endFrame: 8 },
      { word: 'the', startFrame: 8, endFrame: 14 },
      { word: 'real', startFrame: 14, endFrame: 24 },
      { word: 'fake', startFrame: 24, endFrame: 36 },
      { word: 'please', startFrame: 36, endFrame: 44 },
      { word: 'step', startFrame: 44, endFrame: 52, color: '#38bdf8' },
      { word: 'forward', startFrame: 52, endFrame: 68 },
      { word: 'oh!', startFrame: 68, endFrame: 85, color: '#fbbf24' },
      { word: 'i', startFrame: 85, endFrame: 90 },
      { word: 'knew', startFrame: 90, endFrame: 97 },
      { word: 'it!', startFrame: 97, endFrame: 104, color: '#22c55e' },
    ],
  },
];
