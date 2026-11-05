// sample a model's clip: frame f shows t = f/(n-1) * duration
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Cam, Env} from '../inside/kit/three';
import {Actor, useModels, type ModelId} from './assets';
export const PoseTest = ({id = 'golden', clip = 0, n = 8, h = 0.6}: {id?: ModelId; clip?: string | number; n?: number; h?: number}) => {
  const f = useCurrentFrame(), M = useModels([id]);
  if (!M) return null;
  const g = M[id], c = typeof clip === 'number' ? g.animations[clip] : g.animations.find((a) => a.name === clip)!;
  return <AbsoluteFill><ThreeCanvas width={1080} height={1080} gl={{toneMapping: THREE.NoToneMapping}}>
    <Env bg="#9aa7b8" /><hemisphereLight args={['#fff', '#667', 1.2]} /><directionalLight position={[3, 5, 6]} intensity={2.5} />
    <Cam p={[0, h * 0.7, h * 3.2]} l={[0, h * 0.5, 0]} fov={30} />
    <Actor g={g} clip={clip} t={(f / (n - 1)) * c.duration * 0.999} h={h} rotation={[0, Math.PI / 2.6, 0]} />
  </ThreeCanvas></AbsoluteFill>;
};
