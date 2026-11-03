import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill} from 'remotion';
import {Person, useAvatar, type Look} from './rig';
import {HERO, LAUGH_BACK, LAUGH_FWD, THINK} from './poses';
const Cam = () => { const {camera} = useThree(); camera.position.set(0, 1.2, 7.5); camera.lookAt(0, 0.95, 0); return null; };
const QB: Look = {top: '#5a3a26', bottom: '#2b3445', cap: '#111', hideHat: true};
const HOST: Look = {top: '#151515', bottom: '#2b3445', wig: '#e2bd6b', band: '#14a3a8', hideHat: true, hideBeard: true};
const DELLA: Look = {top: '#6F263D', bottom: '#6F263D', hideHat: true};
export const RigTest = () => {
  const g = useAvatar();
  return <AbsoluteFill style={{background: '#20242c'}}>
    {g && <ThreeCanvas width={1080} height={1920} camera={{fov: 40}}>
      <Cam />
      <ambientLight intensity={0.8} /><directionalLight position={[2, 4, 5]} intensity={2.2} />
      <Person g={g} pose={THINK} position={[-0.9, 0, 0]} look={QB} />
      <Person g={g} pose={LAUGH_BACK} position={[0, 0, 0]} look={HOST} />
      <Person g={g} pose={LAUGH_FWD} position={[0.9, 0, 0]} look={HOST} />
      <Person g={g} pose={HERO} position={[0, 0, -2.5]} look={DELLA} />
    </ThreeCanvas>}
  </AbsoluteFill>;
};
