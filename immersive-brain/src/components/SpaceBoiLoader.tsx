import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/space_boi.glb';

type GLTFResult = {
	scene: THREE.Group;
	animations: THREE.AnimationClip[];
};

type SpaceBoiLoaderProps = {
	/** Vertical offset applied to the model group. */
	yOffset?: number;
};

function setFrustumCulled(root: THREE.Object3D, frustumCulled: boolean) {
	root.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			(child as THREE.Mesh).frustumCulled = frustumCulled;
		}
	});
}

export default function SpaceBoiLoader({ yOffset = 0.5 }: SpaceBoiLoaderProps) {
	const groupRef = useRef<THREE.Group>(null);
	const gltf = useGLTF(MODEL_URL) as unknown as GLTFResult;

	// NOTE: utilisé dans l'intro et la slide Playground.
	// On garde une seule instance (pas de clone) pour éviter de casser certains rigs/animations selon le GLB.
	const scene = useMemo(() => gltf.scene, [gltf.scene]);
	const animations = gltf.animations;
	const { actions } = useAnimations(animations, groupRef);

	const [scale, setScale] = useState(1);

	useEffect(() => {
		setFrustumCulled(scene, false);
		scene.updateMatrixWorld(true);

		// Centre le modèle autour de (0,0,0) => interaction OrbitControls naturelle.
		const box = new THREE.Box3().setFromObject(scene);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());

		if (
			Number.isFinite(center.x) &&
			Number.isFinite(center.y) &&
			Number.isFinite(center.z)
		) {
			scene.position.sub(center);
		}

		scene.updateMatrixWorld(true);

		const maxDim = Math.max(size.x, size.y, size.z);
		const targetMaxDim = 7; // Modèle encore plus grand
		const nextScale = maxDim > 0 ? targetMaxDim / maxDim : 1;

		// Clamp pour éviter un scale extrême si box bizarre.
		const clamped = Math.max(0.15, Math.min(18, nextScale));
		setScale(clamped);
	}, [scene]);

	useEffect(() => {
		const list = Object.values(actions);
		if (list.length === 0) return;

		list.forEach((a) => a?.reset().fadeIn(0.25).play());
		return () => {
			list.forEach((a) => a?.fadeOut(0.2));
			list.forEach((a) => a?.stop());
		};
	}, [actions]);

	return (
		<group ref={groupRef} position={[0, yOffset, 0]} rotation={[0.1, 0.5, 0]}>
			<primitive object={scene} scale={scale} />
		</group>
	);
}
