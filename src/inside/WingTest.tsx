import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import * as THREE from 'three';
import {Max} from './kit/character';
import {Cam} from './kit/three';
import {Wings} from './kit/world';
export const WingTest = () => <AbsoluteFill style={{background: '#7ab'}}>
  <ThreeCanvas width={1080} height={1920} camera={{fov: 40, position: [0, 0, 40]}} gl={{toneMapping: THREE.ACESFilmicToneMapping}}>
    <Cam p={[0, -1, 46]} l={[0, -1, 0]} fov={40} />
    <ambientLight intensity={1} /><directionalLight position={[3, 5, 8]} intensity={2} />
    <Max f={{}} body={{armL: 0.6, armR: 0.6}}><Wings pose={{open: 1}} /></Max>
    <mesh position={[0, -1, -3]}><planeGeometry args={[40, 0.05]} /><meshBasicMaterial color="red" /></mesh>
  </ThreeCanvas>
</AbsoluteFill>;
