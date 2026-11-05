// gait test: golden / lab / shiba(standing) trotting, side view; frame → time
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Cam, Env, gradientTex} from '../inside/kit/three';
import {Actor, LEGS, gait, useModels} from './assets';
export const DogTest = () => {
  const f = useCurrentFrame(), t = f / 30;
  const M = useModels(['golden', 'lab', 'shiba']);
  return <AbsoluteFill style={{background: '#888'}}>
    {M && <ThreeCanvas width={1920} height={1080} camera={{fov: 30, position: [0, 1, 20]}} gl={{toneMapping: THREE.ACESFilmicToneMapping}}>
      <Env bg={gradientTex('#cfd8e3', '#7d8794')} />
      <hemisphereLight args={['#fff', '#556', 1.2]} /><directionalLight position={[3, 6, 8]} intensity={2.5} />
      <Cam p={[0, 0.6, 5.5]} l={[0, 0.35, 0]} fov={30} />
      <Actor g={M.golden} clip={0} t={0.55 * M.golden.animations[0].duration} h={0.8} position={[-1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} bones={(b, r) => { gait(b, r, LEGS.golden, t, {tail: [/^Tail1/, /^Tail2/]}); }} />
      <Actor g={M.lab} clip={0} t={0} h={0.8} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} bones={(b, r) => { gait(b, r, LEGS.lab, t, {head: /^DEF-forehead\.?L/, pelvis: /^DEF-pelvis\.?L/}); }} />
      <Actor g={M.shiba} clip="0|standing_0" t={0.5} h={0.7} position={[1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} bones={(b, r) => { gait(b, r, LEGS.shiba, t, {tail: [/^tail_2/, /^tail_4/]}); }} />
    </ThreeCanvas>}
  </AbsoluteFill>;
};
