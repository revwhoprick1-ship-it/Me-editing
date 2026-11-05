// Stage for #003: a CC0 Poly Haven panorama projected onto a ground dome (three's GroundedSkybox), used as background AND
// image-based light, plus a sun with soft shadows caught on an invisible floor. All set imperatively per frame (see the
// black-sky gotcha in the inside-impossible skill), so shots can swap freely.
import {useThree} from '@react-three/fiber';
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GroundedSkybox} from 'three/examples/jsm/objects/GroundedSkybox.js';

export const ENVS = ['anniversary_lounge', 'urban_street_01', 'newman_lobby', 'school_hall', 'music_hall_01', 'church_meeting_room', 'theater_01', 'palermo_square'] as const;
export type EnvId = (typeof ENVS)[number];
const cache: Partial<Record<EnvId, THREE.Texture>> = {};
export const useEnvs = (ids: readonly EnvId[]) => {
  const missing = ids.filter((i) => !cache[i]);
  const [, set] = useState(0);
  const [h] = useState(() => (missing.length ? delayRender(`envs ${missing.join(',')}`, {timeoutInMilliseconds: 120000}) : null));
  useEffect(() => {
    if (!missing.length) return;
    const L = new THREE.TextureLoader();
    Promise.all(missing.map((i) => L.loadAsync(staticFile(`env/dogs/${i}_4k.jpg`)).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; cache[i] = t;
    }))).then(() => { set((x) => x + 1); if (h !== null) continueRender(h); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ids.every((i) => cache[i]) ? (cache as Record<EnvId, THREE.Texture>) : null;
};

export type StageProps = {tex: THREE.Texture; h?: number; r?: number; rot?: number; bright?: number; ibl?: number;
  sun?: {p: [number, number, number]; i?: number; c?: string}; fill?: number; shadow?: number; tint?: string};
export const Stage = ({tex, h = 1.6, r = 20, rot = 0, bright = 1.15, ibl = 0.9, sun = {p: [3, 6, 4]}, fill = 0.6, shadow = 0.35, tint = '#ffffff'}: StageProps) => {
  const {scene} = useThree();
  const sky = useMemo(() => { const s = new GroundedSkybox(tex, h, r, 96); s.position.y = h - 0.01; return s; }, [tex, h, r]);
  (sky.material as THREE.MeshBasicMaterial).color.set(tint).multiplyScalar(bright);
  sky.rotation.y = rot;
  scene.background = null; scene.fog = null;
  scene.environment = tex; scene.environmentIntensity = ibl; scene.environmentRotation.set(0, rot, 0);
  const sunL = useMemo(() => {
    const d = new THREE.DirectionalLight('#fff', 2);
    d.castShadow = true; d.shadow.mapSize.set(2048, 2048); d.shadow.bias = -0.0004; d.shadow.normalBias = 0.02; d.shadow.radius = 4;
    const c = d.shadow.camera; c.left = c.bottom = -4; c.right = c.top = 4; c.near = 0.5; c.far = 30;
    return d;
  }, []);
  sunL.position.set(...sun.p); sunL.intensity = sun.i ?? 2.2; sunL.color.set(sun.c ?? '#fff4e6'); sunL.target.position.set(0, 0, 0); sunL.target.updateMatrixWorld();
  return <>
    <primitive object={sky} />
    <primitive object={sunL} />
    <hemisphereLight args={['#ffffff', '#8a7b6a', fill]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow><planeGeometry args={[30, 30]} /><shadowMaterial opacity={shadow} /></mesh>
  </>;
};
