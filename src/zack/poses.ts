// pose library for the 3D explainer edit (character-frame degrees, see rig.tsx)
import type {Pose} from './rig';
export const SIT: Pose = {drop: 0.5, LeftUpLeg: [-90, 0, 0], RightUpLeg: [-90, 0, 0], LeftLeg: [90, 0, 0], RightLeg: [90, 0, 0],
  LeftArm: [-25, 0, -40], RightArm: [-25, 0, 40], LeftForeArm: [-70, 0, 0], RightForeArm: [-70, 0, 0]};
export const THINK: Pose = {...SIT, RightArm: [-55, 0, 50], RightForeArm: [-140, 0, 45], Head: [10, 0, -4], LeftEye: [-18, 12, 0], RightEye: [-18, 12, 0]};
export const LAUGH_BACK: Pose = {...SIT, Spine: [-14, 0, 0], Head: [-22, 0, 0], RightArm: [-70, 0, 135], RightForeArm: [-40, 0, 60], mouth: 0.8, smile: 1};
export const LAUGH_FWD: Pose = {...SIT, Spine: [18, 0, 0], Spine1: [10, 0, 0], Head: [12, 0, 0], mouth: 0.7, smile: 1};
export const HERO: Pose = {LeftArm: [0, 0, -38], RightArm: [-10, 0, 150], RightForeArm: [-20, 0, 10], Head: [-6, 0, 0], smile: 0.6};
