// Asset layer for Inside the Impossible #003 (dogs): loads the CC-BY rigged models (public/dogs/*.glb, see CREDITS.md),
// clones them per instance (SkeletonUtils), plays a named clip at an exact time (deterministic: mixer.setTime),
// normalises height, and lets a shot override bones (jaw for lip sync, head look) and hang props on bones.
import {createPortal, useThree, type ThreeElements} from '@react-three/fiber';
import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export const MODELS = ['golden', 'lab', 'shiba', 'boxer', 'shiba_tricks', 'jeff', 'bizman', 'walkers', 'woman'] as const;
export type ModelId = (typeof MODELS)[number];
let cache: Partial<Record<ModelId, GLTF>> = {};
export const useModels = (ids: readonly ModelId[]) => {
  const missing = ids.filter((i) => !cache[i]);
  const [, set] = useState(0);
  const [h] = useState(() => (missing.length ? delayRender(`models ${missing.join(',')}`, {timeoutInMilliseconds: 240000}) : null));
  useEffect(() => {
    if (!missing.length) return;
    const L = new GLTFLoader();
    Promise.all(missing.map((i) => L.loadAsync(staticFile(`dogs/${i}.glb`)).then((g) => { cache[i] = g; })))
      .then(() => { set((x) => x + 1); if (h !== null) continueRender(h); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ids.every((i) => cache[i]) ? (cache as Record<ModelId, GLTF>) : null;
};
export const resetModelCache = () => { cache = {}; };

// posed bounds: SkinnedMesh.computeBoundingBox() applies the current bone transforms (three r151+)
export const boundsOf = (o: THREE.Object3D, only?: RegExp) => {
  o.updateMatrixWorld(true);
  const box = new THREE.Box3();
  o.traverse((m) => {
    const mesh = m as THREE.SkinnedMesh;
    if (!mesh.isMesh || !mesh.visible || (only && !only.test(mesh.name))) return;
    let b: THREE.Box3;
    if (mesh.isSkinnedMesh) { mesh.skeleton.update(); mesh.computeBoundingBox(); b = mesh.boundingBox!.clone(); }
    else { mesh.geometry.computeBoundingBox(); b = mesh.geometry.boundingBox!.clone(); }
    box.union(b.applyMatrix4(mesh.matrixWorld));
  });
  return box;
};
const heightOf = (o: THREE.Object3D, only?: RegExp) => { const box = boundsOf(o, only); return {h: box.max.y - box.min.y || 1, minY: box.min.y, box}; };
export type BoneFn = (bones: Record<string, THREE.Bone>, root: THREE.Object3D) => void;
/** one animated instance. clip: name or index; t: seconds into the clip; h: target height (world units) */
export const Actor = ({g, clip = 0, t, h, tint, bones: boneFn, children, mouth, hide, measure, ...rest}: {g: GLTF; clip?: string | number; t: number; h: number; tint?: (mat: THREE.MeshStandardMaterial, name: string) => void; hide?: RegExp; measure?: RegExp;
  bones?: BoneFn; children?: (bones: Record<string, THREE.Bone>) => React.ReactNode; mouth?: number} & ThreeElements['group']) => {
  const inst = useMemo(() => {
    const obj = SkeletonUtils.clone(g.scene);
    const bones: Record<string, THREE.Bone> = {};
    obj.traverse((m) => {
      if ((m as THREE.Bone).isBone) bones[m.name] = m as THREE.Bone;
      const mesh = m as THREE.Mesh;
      if (mesh.isMesh && hide && hide.test(mesh.name)) mesh.visible = false;
      if (mesh.isMesh) {
        mesh.frustumCulled = false; mesh.castShadow = true; mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.material = mats.map((mm) => { const c = (mm as THREE.MeshStandardMaterial).clone(); if (tint) tint(c, c.name); return c; }) as unknown as THREE.Material;
        if (mats.length === 1) mesh.material = (mesh.material as unknown as THREE.Material[])[0];
      }
    });
    const mixer = new THREE.AnimationMixer(obj);
    const restQ: Record<string, THREE.Quaternion> = {};
    Object.entries(bones).forEach(([n, b]) => (restQ[n] = b.quaternion.clone()));
    // measure in the first frame of clip 0 (bind pose can be odd)
    const a0 = g.animations[0]; if (a0) { const ac = mixer.clipAction(a0); ac.play(); mixer.setTime(0); }
    const {h: h0, minY} = heightOf(obj, measure);
    mixer.stopAllAction();
    const jaw = Object.keys(bones).find((n) => /^jaw/i.test(n)) ?? Object.keys(bones).find((n) => /jaw/i.test(n));
    return {obj, bones, mixer, restQ, h0, minY, jaw};
  }, [g]); // eslint-disable-line react-hooks/exhaustive-deps
  const clipObj = typeof clip === 'number' ? g.animations[clip] : g.animations.find((a) => a.name === clip) ?? g.animations[0];
  inst.mixer.stopAllAction();
  if (clipObj) { const ac = inst.mixer.clipAction(clipObj); ac.reset(); ac.play(); inst.mixer.setTime(((t % clipObj.duration) + clipObj.duration) % clipObj.duration); }
  // lip sync: open the jaw on top of the clip pose
  if (mouth && inst.jaw) inst.bones[inst.jaw].rotateX(mouth * 0.45);
  boneFn?.(inst.bones, inst.obj);
  const k = h / inst.h0;
  return <group {...rest}>
    <group scale={k} position={[0, -inst.minY * k, 0]}><primitive object={inst.obj} /></group>
    {children?.(inst.bones)}
  </group>;
};
/** keep a prop glued to a bone (world-space copy each frame) */
export const OnBone = ({bone, children, offset = [0, 0, 0], rot = [0, 0, 0], scale = 1}: {bone?: THREE.Bone; children: React.ReactNode; offset?: [number, number, number]; rot?: [number, number, number]; scale?: number}) => {
  const {scene} = useThree();
  const grp = useMemo(() => new THREE.Group(), []);
  if (bone) { bone.updateWorldMatrix(true, false); bone.matrixWorld.decompose(grp.position, grp.quaternion, grp.scale); }
  const s = scale / Math.max(1e-6, grp.scale.x);
  // rendered in world space (portal to the scene root), so the actor's own transform is not applied twice
  return <>{createPortal(<primitive object={grp}><group position={offset} rotation={rot} scale={s}>{children}</group></primitive>, scene)}</>;
};

// ---- procedural gait (none of the open-licence dogs ships a walk cycle) -------------------------------------------------
// Rotations are applied in the CHARACTER frame: the swing axis is the dog's own sideways axis (from pelvis → head), so it
// works for any rig. Diagonal pairs move together (trot): front-left with hind-right.
const _q = new THREE.Quaternion(), _pw = new THREE.Quaternion(), _v = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3();
export const rotateWorld = (bone: THREE.Bone | undefined, axis: THREE.Vector3, ang: number) => {
  if (!bone || !bone.parent) return;
  bone.parent.getWorldQuaternion(_pw);
  _q.setFromAxisAngle(axis, ang);
  // local = pw^-1 * dq * pw * local
  const inv = _pw.clone().invert();
  bone.quaternion.premultiply(inv.multiply(_q).multiply(_pw));
  bone.updateMatrixWorld(true);
};
export type LegMap = {upper: string; lower?: string; foot?: string; phase: number; front: boolean}[];
export const findBone = (bones: Record<string, THREE.Bone>, re: RegExp) => Object.values(bones).find((b) => re.test(b.name));
export const gait = (bones: Record<string, THREE.Bone>, root: THREE.Object3D, legs: LegMap, t: number, opts: {freq?: number; amp?: number; head?: RegExp; pelvis?: RegExp; tail?: RegExp[]} = {}) => {
  root.updateMatrixWorld(true);
  const head = findBone(bones, opts.head ?? /head/i), pel = findBone(bones, opts.pelvis ?? /pelvis|hips/i);
  if (!head || !pel) return 0;
  head.getWorldPosition(_a); pel.getWorldPosition(_b);
  const fwd = _a.sub(_b).setY(0).normalize(), side = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
  const w = 2 * Math.PI * (opts.freq ?? 2.2) * t, A = opts.amp ?? 0.42;
  for (const L of legs) {
    const ph = w + L.phase * Math.PI;
    rotateWorld(findBone(bones, new RegExp(L.upper)), side, A * Math.sin(ph) * (L.front ? 1 : 0.9));
    if (L.lower) rotateWorld(findBone(bones, new RegExp(L.lower)), side, (L.front ? -1 : 1) * A * 1.1 * Math.max(0, Math.sin(ph + Math.PI / 2)));
    if (L.foot) rotateWorld(findBone(bones, new RegExp(L.foot)), side, (L.front ? 1 : -1) * A * 0.5 * Math.max(0, Math.sin(ph + Math.PI / 2)));
  }
  for (const [i, re] of (opts.tail ?? []).entries()) rotateWorld(findBone(bones, re), new THREE.Vector3(0, 1, 0), 0.35 * Math.sin(w * 1.5 + i * 0.6));
  rotateWorld(head, side, 0.05 * Math.sin(2 * w));
  return 0.012 * Math.abs(Math.sin(w)); // body bob (fraction of height)
};
// per-rig leg maps (phase 0 = front-left + hind-right, 1 = the other diagonal)
export const LEGS: Record<'golden' | 'lab' | 'shiba', LegMap> = {
  golden: [{upper: '^UpperArm\\.?L', lower: '^LowerArm\\.?L', foot: '^Hand\\.?L', phase: 0, front: true}, {upper: '^UpperArm\\.?R', lower: '^LowerArm\\.?R', foot: '^Hand\\.?R', phase: 1, front: true},
    {upper: '^Thigh\\.?R', foot: '^Foot\\.?R', phase: 0, front: false}, {upper: '^Thigh\\.?L', foot: '^Foot\\.?L', phase: 1, front: false}],
  lab: [{upper: '^DEF-front_thigh\\.?L_', lower: '^DEF-front_shin\\.?L_', foot: '^DEF-front_foot\\.?L_', phase: 0, front: true}, {upper: '^DEF-front_thigh\\.?R_', lower: '^DEF-front_shin\\.?R_', foot: '^DEF-front_foot\\.?R_', phase: 1, front: true},
    {upper: '^DEF-thigh\\.?R_', lower: '^DEF-shin\\.?R_', foot: '^DEF-foot\\.?R_', phase: 0, front: false}, {upper: '^DEF-thigh\\.?L_', lower: '^DEF-shin\\.?L_', foot: '^DEF-foot\\.?L_', phase: 1, front: false}],
  shiba: [{upper: '^L_shoulder', lower: '^L_elbow', foot: '^L_hand', phase: 0, front: true}, {upper: '^R_shoulder', lower: '^R_elbow', foot: '^R_hand', phase: 1, front: true},
    {upper: '^R_hip', lower: '^R_knee', foot: '^R_foot', phase: 0, front: false}, {upper: '^L_hip', lower: '^L_knee', foot: '^L_foot', phase: 1, front: false}],
};
