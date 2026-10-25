// Preset "Edit2": motion-graphics podcast Shorts (see vault/02 Style Guide/Motion graphics podcast style.md).
// A plan lists the source segments in play order and what to draw over them. ALL TIMES ARE SOURCE MS.

export type Seat = 'L' | 'M' | 'R';
export type RawWord = {text: string; startMs: number; endMs: number};
export type SeatTrack = {stepMs: number; fromMs: number} & Partial<Record<Seat, number[][]>>;
export type Font = 'sans' | 'bold' | 'boldI' | 'serif' | 'serifI';

// Kinetic stacked typography: each line blurs in at its spoken time `at`.
export type Line = {t: string; font: Font; size: number; at: number; color?: string};
export type Stack = {lines: Line[]; x: number; y: number; align: 'left' | 'right' | 'center'; to: number};

// Full-screen motion-graphics scenes (the face cam becomes a card, a corner card, or hides).
export type Scene =
  // video shrinks into a rounded card on a light gradient, person/name + chips below
  | {type: 'card'; from: number; to: number; name: [string, string]; chips?: string[]; cutout?: string}
  // white UI scene: kinetic title + rows that tick ✓ when said
  | {type: 'checklist'; from: number; to: number; title: Line[]; rows: {t: string; at: number; emoji: string}[]}
  // dark glow scene with a counter
  | {type: 'stat'; from: number; to: number; at: number; kicker: string; value: number; start?: number; prefix?: string; label: string; chip?: string}
  // animated top-down football field
  | {type: 'field'; from: number; to: number; variant: 'formation' | 'coverage' | 'cover3' | 'rollout';
      events: Record<string, number>; title?: string}
  // chapter card: big number on white (Chris Williamson list format)
  | {type: 'number'; from: number; to: number; n: string; label: string};

export type Edit2Plan = {
  name: string;
  src: string; // in public/ (1920x1080)
  words: RawWord[];
  track: SeatTrack;
  speakers: {from: number; who: Seat}[]; // whose face the cam follows
  segs: [number, number][]; // play order (hook first)
  hook: {small: string; big: string}; // title on top during the first segment (DOAC style)
  stacks: Stack[];
  subs: {from: number; to: number; y?: number; color?: string; size?: number; one?: boolean}[]; // plain small subs
  fix?: Record<string, string>; // transcription fixes for subs
  scenes: Scene[];
  punches?: [number, number, number][]; // [from, to, zoom]
  music: {file: string; from: number; volume?: number}; // `from` = song ms to start at
  outro: {lines: Omit<Line, 'at'>[]};
};
