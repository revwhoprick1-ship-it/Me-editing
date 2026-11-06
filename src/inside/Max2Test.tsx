// Turnaround / pose / expression sheet for Max v2 (compare with the user's character sheet)
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Cam, Env, Post, gradientTex} from './kit/three';
import {Max2, gamer, idle, laugh, pockets, pointAt, run, shocked, think, walk, withP, type Pose2} from './kit/max2';
const Lights = () => <>
  <Env bg={gradientTex('#34363c', '#141518')} />
  <hemisphereLight args={['#ffffff', '#3a3530', 0.7]} />
  <directionalLight position={[2, 4, 5]} intensity={2.6} color="#fff2e6" />
  <directionalLight position={[-4, 3, -3]} intensity={2.2} color="#ffd6b0" />
  <directionalLight position={[0, 2, -5]} intensity={1.2} color="#b8d4ff" />
</>;
export const Max2Test = ({mode = 'line'}: {mode?: 'line' | 'faces'}) => {
  const f = useCurrentFrame(), t = f / 30 + 0.4;
  if (mode === 'faces') {
    const faces: Pose2[] = [idle(t), withP(idle(t), {face: {wide: 1, browUp: 1, open: 0.55, mouthO: 0.9, smile: -0.1}}), withP(idle(t), {headX: -0.12, face: {squint: 1, open: 0.65, smile: 1, mouthW: 0.6, browUp: 0.4}}),
      withP(idle(t), {headZ: 0.12, face: {squint: 1, smile: 0.6, browUp: 0.3}}), withP(idle(t), {headX: 0.08, face: {browAngry: 1, squint: 0.35, smile: 0.25}})];
    return <AbsoluteFill><ThreeCanvas width={1920} height={1080} gl={{toneMapping: THREE.NoToneMapping}}>
      <Lights /><Cam p={[0, 1.55, 1.25]} l={[0, 1.53, 0]} fov={34} />
      {faces.map((p, i) => <Max2 key={i} pose={withP(p, {x: (i - 2) * 0.33, yaw: (i - 2) * -0.12})} />)}
      <Post focus={[0, 1.55, 0.1]} bokeh={0.5} bloom={0.2} />
    </ThreeCanvas></AbsoluteFill>;
  }
  const poses: Pose2[] = [withP(pockets(t), {yaw: 0}), withP(pockets(t), {yaw: -0.8}), withP(pockets(t), {yaw: -Math.PI / 2}), withP(pockets(t), {yaw: Math.PI}),
    pointAt(t), think(t), walk(t), run(t), shocked(0.45, t), laugh(t), gamer(t)];
  return <AbsoluteFill><ThreeCanvas width={1920} height={1080} gl={{toneMapping: THREE.NoToneMapping}}>
    <Lights /><Cam p={[0, 1.0, 9.2]} l={[0, 0.9, 0]} fov={30} />
    {poses.map((p, i) => <Max2 key={i} pose={withP(p, {x: (i - 5) * 0.78})} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 10]} /><meshStandardMaterial color="#1c1d21" roughness={0.9} /></mesh>
    <Post focus={[0, 1, 0]} bokeh={0.3} bloom={0.15} />
  </ThreeCanvas></AbsoluteFill>;
};
