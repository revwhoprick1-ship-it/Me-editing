// Posable avatar for the "3D explainer" (Zack D-style) edit. Model: public/models/rpm_male.glb
// (three.js examples/models/gltf/readyplayer.me.glb, fetched by scripts/fetch_assets_v23.sh, kept out of git).
// Poses are given as rotations in the CHARACTER's frame (x = pitch, +Z is the way he faces), in degrees, applied root → leaf,
// so a child inherits its parent's turn: thigh [-90,0,0] lifts the leg forward, knee [90,0,0] drops the shin back down.
import {type ThreeElements} from '@react-three/fiber';
import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

let cache: GLTF | null = null;
export const useAvatar = () => {
  const [g, setG] = useState<GLTF | null>(cache);
  const [h] = useState(() => (cache ? null : delayRender('avatar', {timeoutInMilliseconds: 120000})));
  useEffect(() => {
    if (cache) return;
    new GLTFLoader().loadAsync(staticFile('models/rpm_male.glb')).then((x) => { cache = x; setG(x); if (h !== null) continueRender(h); });
  }, [h]);
  return g;
};

export type V3 = [number, number, number];
export type Pose = {[bone: string]: V3 | number | undefined; mouth?: number; smile?: number; drop?: number};
const ORDER = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftEye', 'RightEye',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot'];
const D = Math.PI / 180;

export type Look = {top?: string; bottom?: string; shoes?: string; hideHat?: boolean; hideBeard?: boolean; skin?: string; wig?: string; band?: string; cap?: string; chest?: string};
// mix two poses (for tweening between keyframes)
export const mix = (a: Pose, b: Pose, t: number): Pose => {
  const out: Pose = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  keys.forEach((k) => {
    const x = (a as Record<string, unknown>)[k], y = (b as Record<string, unknown>)[k];
    if (typeof x === 'number' || typeof y === 'number') (out as Record<string, unknown>)[k] = ((x as number) ?? 0) * (1 - t) + ((y as number) ?? 0) * t;
    else { const p = (x as V3) ?? [0, 0, 0], q = (y as V3) ?? [0, 0, 0]; (out as Record<string, unknown>)[k] = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]; }
  });
  return out;
};
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
// keyframed pose track: [[ms, pose], ...] → pose at o
export const track = (keys: [number, Pose][], o: number): Pose => {
  if (o <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, p] = keys[i], [b, q] = keys[i + 1];
    if (o < b) return mix(p, q, ease((o - a) / (b - a)));
  }
  return keys[keys.length - 1][1];
};

export const Person = ({g, pose, look = {}, ...rest}: {g: GLTF; pose: Pose; look?: Look} & ThreeElements['group']) => {
  const {obj, bones, restQ, morphs} = useMemo(() => {
    const obj = SkeletonUtils.clone(g.scene);
    const bones: Record<string, THREE.Bone> = {};
    const morphs: THREE.Mesh[] = [];
    obj.traverse((m) => {
      if ((m as THREE.Bone).isBone) bones[m.name] = m as THREE.Bone;
      const mesh = m as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false; mesh.castShadow = true; mesh.receiveShadow = true;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      const tint = (c?: string) => { if (c) { mat.color = new THREE.Color(c); mat.map = null; mat.roughness = 0.8; mat.metalness = 0; } };
      if (mat.name === 'Wolf3D_Outfit_Top') tint(look.top);
      if (mat.name === 'Wolf3D_Outfit_Bottom') tint(look.bottom);
      if (mat.name === 'Wolf3D_Outfit_Footwear') tint(look.shoes);
      if (mat.name === 'Wolf3D_Skin' || mat.name === 'Wolf3D_Body') { if (look.skin) mat.color = new THREE.Color(look.skin); }
      if (mat.name === 'Wolf3D_Headwear' && look.hideHat) mesh.visible = false;
      if (mat.name === 'Wolf3D_Beard' && look.hideBeard) mesh.visible = false;
      mesh.material = mat;
      if (mesh.morphTargetDictionary && 'mouthOpen' in mesh.morphTargetDictionary) morphs.push(mesh);
    });
    const restQ: Record<string, THREE.Quaternion> = {};
    Object.entries(bones).forEach(([n, b]) => (restQ[n] = b.quaternion.clone()));
    return {obj, bones, restQ, morphs};
  }, [g, look]);
  // pose: reset, then each bone gets a character-frame rotation on top of its parent's current one
  Object.entries(bones).forEach(([n, b]) => b.quaternion.copy(restQ[n]));
  obj.updateMatrixWorld(true);
  const rq = obj.getWorldQuaternion(new THREE.Quaternion()), rqi = rq.clone().invert();
  for (const n of ORDER) {
    const d = (pose as Record<string, V3 | undefined>)[n]; const b = bones[n];
    if (!d || !b || !b.parent) continue;
    const pw = b.parent.getWorldQuaternion(new THREE.Quaternion());
    const dq = new THREE.Quaternion().setFromEuler(new THREE.Euler(d[0] * D, d[1] * D, d[2] * D, 'YXZ'));
    const dw = rq.clone().multiply(dq).multiply(rqi);
    b.quaternion.copy(pw.clone().invert().multiply(dw).multiply(pw).multiply(restQ[n]));
  }
  morphs.forEach((m) => {
    const dict = m.morphTargetDictionary!, inf = m.morphTargetInfluences!;
    inf[dict.mouthOpen] = Math.min(1, pose.mouth ?? 0);
    if ('mouthSmile' in dict) inf[dict.mouthSmile] = Math.min(1, pose.smile ?? 0);
  });
  return <group {...rest}>
    <primitive object={obj} position={[0, -(pose.drop ?? 0), 0]} />
    {(look.wig || look.band || look.cap) && <HeadGear bone={bones.Head} look={look} />}
    {look.chest && <ChestNum bone={bones.Spine2} text={look.chest} />}
  </group>;
};

// extra hair / headband / cap, parented to the head bone (head-local metres: eyes y .088 z .082, crown y .226)
const HeadGear = ({bone, look}: {bone: THREE.Bone; look: Look}) => {
  const grp = useMemo(() => {
    const g = new THREE.Group();
    if (look.wig) {
      const m = new THREE.MeshStandardMaterial({color: look.wig, roughness: 0.7, side: THREE.DoubleSide});
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.108, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.56), m);
      top.position.set(0, 0.128, 0.004); top.scale.set(1.04, 0.98, 1.1);
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.104, 0.112, 0.16, 32, 1, true, Math.PI * 0.36, Math.PI * 1.28), m);
      back.position.set(0, 0.075, -0.012); back.scale.set(1, 1, 1.05);
      if (look.cap) g.add(back); else g.add(top, back);
    }
    if (look.band) {
      const b = new THREE.Mesh(new THREE.TorusGeometry(0.108, 0.013, 10, 48), new THREE.MeshStandardMaterial({color: look.band, roughness: 0.5}));
      b.rotation.x = Math.PI / 2 + 0.18; b.position.set(0, 0.16, 0.008); b.scale.set(1.03, 1.12, 1);
      g.add(b);
    }
    if (look.cap) {
      const m = new THREE.MeshStandardMaterial({color: look.cap, roughness: 0.55, side: THREE.DoubleSide});
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.116, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), m);
      dome.position.set(0, 0.122, 0.004); dome.scale.set(1.02, 0.92, 1.1);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.014, 32, 1, false, -Math.PI * 0.5, Math.PI), m);
      brim.position.set(0, 0.128, 0.072); brim.scale.set(0.92, 1, 1.45); brim.rotation.x = 0.14;
      g.add(dome, brim);
    }
    g.traverse((x) => { (x as THREE.Mesh).castShadow = true; });
    return g;
  }, [look]);
  useMemo(() => bone.add(grp), [bone, grp]);
  useEffect(() => () => { bone.remove(grp); }, [bone, grp]);
  return null;
};

// jersey number on the chest, parented to Spine2
const ChestNum = ({bone, text}: {bone: THREE.Bone; text: string}) => {
  const grp = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!;
    x.font = 'bold 200px Montserrat, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 14; x.strokeStyle = '#041E42'; x.strokeText(text, 128, 138); x.fillStyle = '#FFB81C'; x.fillText(text, 128, 138);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshStandardMaterial({map: t, transparent: true, roughness: 0.7}));
    m.position.set(0, 0.06, 0.16);
    const g = new THREE.Group(); g.add(m); return g;
  }, [text]);
  useMemo(() => bone.add(grp), [bone, grp]);
  useEffect(() => () => { bone.remove(grp); }, [bone, grp]);
  return null;
};
