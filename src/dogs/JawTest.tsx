// jaw-axis check: frame 0 closed, frame 1 open (mouth = 1) for each dog rig
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Cam, Env} from '../inside/kit/three';
import {Actor, useModels} from './assets';
export const JawTest = ({ax = [[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0]]}: {ax?: [number, number, number][]}) => {
  const f = useCurrentFrame(), M = useModels(['golden', 'lab', 'shiba', 'boxer']);
  if (!M) return null;
  const m = f % 2;
  return <AbsoluteFill><ThreeCanvas width={1920} height={1080} gl={{toneMapping: THREE.NoToneMapping}}>
    <Env bg="#9aa7b8" /><hemisphereLight args={['#fff', '#667', 1.2]} /><directionalLight position={[3, 5, 6]} intensity={2.5} />
    <Cam p={[0, 0.5, 4.2]} l={[0, 0.4, 0]} fov={30} />
    <Actor g={M.golden} t={0} h={0.6} position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} mouth={m} jaw={{axis: ax[0]}} />
    <Actor g={M.lab} t={0} h={0.6} position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} mouth={m} jaw={{axis: ax[1]}} />
    <Actor g={M.shiba} clip="0|sitting_0" t={0.5} h={0.5} position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} mouth={m} jaw={{axis: ax[2]}} />
    <Actor g={M.boxer} t={0} h={0.45} position={[1.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} mouth={m} jaw={{axis: ax[3]}} hide={/^Object_(79|81)$/} />
  </ThreeCanvas></AbsoluteFill>;
};
