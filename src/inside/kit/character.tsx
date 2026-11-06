// "Max", the channel's recurring test subject: a procedural stylised character (no third-party model, licence-clean).
// Soft vinyl-toy proportions, physical skin with sheen, glossy eyes with iris/pupil/catchlight, blinking lids, brows,
// a jaw that opens/chews, an orange hoodie (channel colour). Optional x-ray mode for "inside the body" shots.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {xrayMat} from './three';

export type Face = {jaw?: number; eyesWide?: number; blink?: number; brow?: number; lookX?: number; lookY?: number; smile?: number; gum?: boolean; gulp?: number; headTilt?: number; xray?: number; frost?: number; sick?: number; puff?: number; beard?: number; gray?: number};
export type Body = {armL?: number; armR?: number; legSwing?: number; legsBack?: number; armLFwd?: number; armRFwd?: number}; // radians
const SKIN = '#eab48f', HAIR = '#2b1d16', HOODIE = '#ff7a2f';

const headGeo = () => {
  const g = new THREE.SphereGeometry(1, 96, 72);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < 0) { const k = 1 - 0.16 * Math.min(1, -y * 1.2); x *= k; z *= 1 - 0.06 * -y; } // narrower jaw/chin
    if (y < -0.55) y -= 0.06 * (y + 0.55) * (z > 0 ? 1 : 0); // slight chin
    z *= z > 0 ? 1.02 : 0.96;
    p.setXYZ(i, x * 0.86, y * 1.04, z * 0.94);
  }
  g.computeVertexNormals();
  return g;
};
const hairGeo = () => {
  const g = new THREE.SphereGeometry(1.05, 72, 48, 0, Math.PI * 2, 0, Math.PI * 0.38);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const tuft = 1 + 0.035 * Math.sin(x * 9 + z * 7) * Math.cos(y * 8 + x * 3);
    p.setXYZ(i, x * 0.9 * tuft, y * 1.0 * tuft + 0.05, z * 0.98 * tuft - 0.03);
  }
  g.computeVertexNormals();
  return g;
};

export const Max = ({f, body, children, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1}: {f: Face; body?: Body; children?: React.ReactNode; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number}) => {
  const m = useMemo(() => ({
    head: headGeo(), hair: hairGeo(),
    skin: new THREE.MeshPhysicalMaterial({color: SKIN, roughness: 0.48, sheen: 0.45, sheenColor: new THREE.Color('#ff9a7a'), clearcoat: 0.08, clearcoatRoughness: 0.6}),
    hairM: new THREE.MeshPhysicalMaterial({color: HAIR, roughness: 0.62, sheen: 0.8, sheenColor: new THREE.Color('#6b4a3a')}),
    white: new THREE.MeshPhysicalMaterial({color: '#f7f4ef', roughness: 0.12, clearcoat: 1}),
    iris: new THREE.MeshStandardMaterial({color: '#3a6ea5', roughness: 0.3}),
    pupil: new THREE.MeshBasicMaterial({color: '#050505'}),
    glint: new THREE.MeshBasicMaterial({color: '#ffffff'}),
    brow: new THREE.MeshStandardMaterial({color: HAIR, roughness: 0.8}),
    mouth: new THREE.MeshStandardMaterial({color: '#4a0f17', roughness: 0.7}),
    lip: new THREE.MeshPhysicalMaterial({color: '#c9746a', roughness: 0.35, clearcoat: 0.5}),
    teeth: new THREE.MeshPhysicalMaterial({color: '#f3efe6', roughness: 0.25, clearcoat: 0.6}),
    gum: new THREE.MeshPhysicalMaterial({color: '#ff6fb1', roughness: 0.35, clearcoat: 0.8, sheen: 0.6, sheenColor: new THREE.Color('#ffd0e6')}),
    hood: new THREE.MeshPhysicalMaterial({color: HOODIE, roughness: 0.85, sheen: 1, sheenColor: new THREE.Color('#ffc09a')}),
    xr: xrayMat('#7fd8ff'),
    pants: new THREE.MeshPhysicalMaterial({color: '#2c3e66', roughness: 0.8, sheen: 0.5, sheenColor: new THREE.Color('#5a74b0')}),
    shoe: new THREE.MeshPhysicalMaterial({color: '#f4f4f4', roughness: 0.4, clearcoat: 0.6}),
  }), []);
  // frost / altitude-sickness tints on the skin
  m.hairM.color.set(HAIR).lerp(new THREE.Color('#d9d6d0'), f.gray ?? 0);
  m.skin.color.set(SKIN).lerp(new THREE.Color('#bfe3ff'), 0.55 * (f.frost ?? 0)).lerp(new THREE.Color('#b9d99a'), 0.45 * (f.sick ?? 0));
  const jaw = f.jaw ?? 0, wide = f.eyesWide ?? 0, blink = f.blink ?? 0, brow = f.brow ?? 0, smile = f.smile ?? 0, xr = f.xray ?? 0;
  const lid = Math.max(blink, 0.18 - 0.18 * wide); // upper lid cover 0..1
  const eye = (s: 1 | -1) => (
    <group position={[0.31 * s, 0.14, 0.74]} rotation={[0, 0.12 * s, 0]}>
      <mesh material={m.white} scale={[1 + 0.08 * wide, 1 + 0.12 * wide, 1]}><sphereGeometry args={[0.17, 40, 30]} /></mesh>
      <group rotation={[-(f.lookY ?? 0) * 0.35, (f.lookX ?? 0) * 0.4, 0]}>
        {/* iris / pupil as spherical caps just above the eyeball surface, so they read from any angle */}
        <mesh material={m.iris} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.1735, 40, 12, 0, Math.PI * 2, 0, 0.55]} /></mesh>
        <mesh material={m.pupil} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.175, 32, 8, 0, Math.PI * 2, 0, 0.24 - 0.07 * wide]} /></mesh>
        <mesh material={m.glint} position={[0.045, 0.05, 0.168]}><sphereGeometry args={[0.014, 12, 8]} /></mesh>
      </group>
      {/* upper lid: skin cap that rotates down to blink */}
      <mesh material={m.skin} rotation={[-0.7 + lid * (Math.PI / 2 + 0.7), 0, 0]}><sphereGeometry args={[0.178, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh material={m.brow} position={[0, 0.215 + 0.06 * brow + 0.04 * wide, 0.1]} rotation={[0, 0, Math.PI / 2 - s * (0.12 - 0.22 * brow)]}><capsuleGeometry args={[0.026, 0.17, 6, 12]} /></mesh>
    </group>
  );
  const open = Math.max(0.05, jaw);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[(f.headTilt ?? 0), 0, 0]}>
        <mesh geometry={m.head} material={xr > 0.5 ? m.xr : m.skin} />
        <mesh geometry={m.hair} material={m.hairM} visible={xr < 0.5} />
        {/* back of the head */}
        <mesh material={m.hairM} visible={xr < 0.5} scale={[0.9, 1.02, 0.95]} position={[0, 0.02, -0.03]}><sphereGeometry args={[1.04, 64, 40, Math.PI, Math.PI, Math.PI * 0.25, Math.PI * 0.42]} /></mesh>
        {[1, -1].map((s) => <mesh key={s} material={m.skin} position={[0.84 * s, 0.03, -0.02]} scale={[0.16, 0.26, 0.12]} visible={xr < 0.5}><sphereGeometry args={[1, 24, 16]} /></mesh>)}
        {xr < 0.5 && <>
          {eye(1)}{eye(-1)}
          <mesh material={m.skin} position={[0, -0.06, 0.9]} scale={[0.075, 0.1, 0.09]}><sphereGeometry args={[1, 32, 24]} /></mesh>
          {/* mouth: dark cavity + lips + teeth + the gum */}
          <group position={[0, -0.42 - 0.05 * jaw, 0.8]} rotation={[-0.22, 0, 0]}>
            <mesh material={m.mouth} scale={[0.19 + 0.04 * smile, 0.03 + 0.16 * open, 0.06]}><sphereGeometry args={[1, 32, 20]} /></mesh>
            <mesh material={m.lip} position={[0, 0.03 + 0.07 * open, 0.02]} scale={[0.17 + 0.04 * smile, 0.024, 0.035]}><sphereGeometry args={[1, 32, 16]} /></mesh>
            <mesh material={m.lip} position={[0, -0.03 - 0.12 * open, 0.02]} scale={[0.16 + 0.04 * smile, 0.03, 0.035]}><sphereGeometry args={[1, 32, 16]} /></mesh>
            {jaw > 0.2 && <mesh material={m.teeth} position={[0, 0.02 + 0.05 * open, 0.02]} scale={[0.14, 0.03, 0.03]}><boxGeometry args={[1, 1, 1]} /></mesh>}
            {(f.puff ?? 0) > 0 && [1, -1].map((s) => <mesh key={s} material={m.skin} position={[0.36 * s, 0.25, -0.12]} scale={[0.2 * (f.puff ?? 0), 0.17 * (f.puff ?? 0), 0.16 * (f.puff ?? 0)]}><sphereGeometry args={[1, 24, 16]} /></mesh>)}
            {f.gum && <mesh material={m.gum} position={[0.05, -0.02, 0.02]} scale={[0.07, 0.05 + 0.03 * jaw, 0.05]}><sphereGeometry args={[1, 24, 16]} /></mesh>}
          </group>
        </>}
        {/* beard: grows from the chin down (beard 1 = to the floor) */}
        {(f.beard ?? 0) > 0.01 && xr < 0.5 && <group position={[0, -0.62, 0.62]} rotation={[0.12, 0, 0]}>
          {[0, 1, -1, 2, -2].map((k) => { const L = 0.25 + 3.6 * (f.beard ?? 0) * (1 - 0.12 * Math.abs(k)); return <mesh key={k} material={m.hairM} position={[0.12 * k, -L / 2, 0.08 - 0.03 * Math.abs(k)]} rotation={[Math.PI, 0, 0.04 * k]}><coneGeometry args={[0.2 - 0.02 * Math.abs(k), L, 10, 1, true]} /></mesh>; })}
          <mesh material={m.hairM} position={[0, 0.05, 0]} scale={[0.52, 0.32, 0.3]}><sphereGeometry args={[1, 24, 16]} /></mesh>
        </group>}
      </group>
      {/* neck + hoodie */}
      <mesh material={xr > 0.5 ? m.xr : m.skin} position={[0, -1.05 - 0.04 * (f.gulp ?? 0), 0]}><cylinderGeometry args={[0.32, 0.36, 0.6, 32]} /></mesh>
      {(f.gulp ?? 0) > 0 && xr < 0.5 && <mesh material={m.skin} position={[0, -0.95 - 0.35 * (f.gulp ?? 0), 0.3]} scale={[0.09, 0.07, 0.06]}><sphereGeometry args={[1, 16, 12]} /></mesh>}
      <mesh material={xr > 0.5 ? m.xr : m.hood} position={[0, -2.15, 0]} scale={[1.55, 1.05, 0.95]}><sphereGeometry args={[1, 64, 48]} /></mesh>
      <mesh material={m.hood} visible={xr < 0.5} position={[0, -1.32, -0.18]} rotation={[Math.PI / 2 + 0.25, 0, 0]}><torusGeometry args={[0.55, 0.2, 20, 48]} /></mesh>
      {body && xr < 0.5 && <>
        {/* arms: pivot at the shoulder, hang down; armL/armR rotate them outward */}
        {([[1, body.armL ?? 0.15, body.armLFwd ?? 0], [-1, body.armR ?? 0.15, body.armRFwd ?? 0]] as const).map(([s, a, fw]) => <group key={s} position={[1.3 * s, -1.75, 0]} rotation={[-fw, 0, a * s]}>
          <mesh material={m.hood} position={[0, -0.6, 0]}><capsuleGeometry args={[0.3, 0.9, 8, 16]} /></mesh>
          <mesh material={m.skin} position={[0, -1.35, 0.02]}><sphereGeometry args={[0.24, 24, 16]} /></mesh>
        </group>)}
        {/* legs */}
        {[1, -1].map((s) => <group key={s} position={[0.5 * s, -3.05, 0]} rotation={[(body.legsBack ?? 0) + s * (body.legSwing ?? 0), 0, 0]}>
          <mesh material={m.pants} position={[0, -0.6, 0]}><capsuleGeometry args={[0.33, 0.85, 8, 16]} /></mesh>
          <mesh material={m.shoe} position={[0, -1.25, 0.18]} scale={[0.36, 0.22, 0.6]}><sphereGeometry args={[1, 24, 16]} /></mesh>
        </group>)}
      </>}
      {children}
    </group>
  );
};
