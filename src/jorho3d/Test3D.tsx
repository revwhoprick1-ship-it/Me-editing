import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const Test3D = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#101018'}}>
    <ThreeCanvas width={1080} height={1080} camera={{fov: 40, position: [0, 0, 6]}}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <mesh rotation={[f / 20, f / 30, 0]} scale={[1, 1.6, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#8a4b22" roughness={0.45} metalness={0.1} />
      </mesh>
    </ThreeCanvas>
  </AbsoluteFill>;
};
