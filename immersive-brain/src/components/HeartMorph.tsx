import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Clone, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type HeartMorphProps = {
	delayMs?: number;
	word?: string;
	modelUrl: string;
};

function FitCameraToObject({ targetRef, margin = 1.22 }: { targetRef: React.RefObject<THREE.Object3D>; margin?: number }) {
	const { camera, size } = useThree();

	useLayoutEffect(() => {
		const target = targetRef.current;
		const cam = camera as THREE.PerspectiveCamera;
		if (!target) return;
		if (!('fov' in cam)) return;

		const box = new THREE.Box3().setFromObject(target);
		if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) return;

		const sphere = new THREE.Sphere();
		box.getBoundingSphere(sphere);
		const radius = sphere.radius || 1;

		const vFov = THREE.MathUtils.degToRad(cam.fov);
		const aspect = size.width / Math.max(1, size.height);
		const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

		const distV = radius / Math.sin(vFov / 2);
		const distH = radius / Math.sin(hFov / 2);
		const dist = Math.max(distV, distH) * margin;

		cam.near = Math.max(0.01, dist / 100);
		cam.far = dist * 100;
		cam.position.set(sphere.center.x, sphere.center.y, sphere.center.z + dist);
		cam.lookAt(sphere.center);
		cam.updateProjectionMatrix();
	}, [camera, size.width, size.height, targetRef, margin]);

	return null;
}

function InlineGltf({ url, fitRef }: { url: string; fitRef: React.RefObject<THREE.Group> }) {
	const { scene, animations } = useGLTF(url);
	const { actions } = useAnimations(animations, fitRef);

	useEffect(() => {
		const actionList = Object.values(actions ?? {}).filter(Boolean) as THREE.AnimationAction[];
		for (const action of actionList) {
			action.reset();
			action.setLoop(THREE.LoopRepeat, Infinity);
			action.play();
		}

		return () => {
			for (const action of actionList) {
				try {
					action.stop();
				} catch {
					// ignore
				}
			}
		};
	}, [actions]);

	return (
		<group ref={fitRef}>
			<Clone object={scene} />
		</group>
	);
}

export default function HeartMorph({ delayMs = 1800, word = 'cœur', modelUrl }: HeartMorphProps) {
	const fitRef = useRef<THREE.Group>(null);

	useEffect(() => {
		useGLTF.preload(modelUrl);
	}, [modelUrl]);

	const style = useMemo(() => ({ ['--hm-delay' as any]: `${delayMs}ms` }), [delayMs]);

	return (
		<span className="heart-morph heart-morph--model" style={style} aria-label={word}>
			{/* Reserve width so the line doesn't jump */}
			<span className="heart-morph-sizer" aria-hidden="true">
				{word}
			</span>

			{/* Word layer */}
			<span className="heart-morph-word" aria-hidden="true">
				{word}
			</span>

			{/* Model layer */}
			<span className="heart-morph-model heart-morph-replacement" aria-hidden="true">
				<span className="heart-morph-model-inner">
					<Canvas
						dpr={[1, 1.5]}
						gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
						camera={{ position: [0, 0, 2.2], fov: 35 }}
						style={{ width: '100%', height: '100%' }}
					>
						<ambientLight intensity={1.35} />
						<hemisphereLight intensity={0.55} groundColor="#08080c" />
						<directionalLight position={[2, 2, 3]} intensity={1.85} />
						<Suspense fallback={null}>
							<InlineGltf url={modelUrl} fitRef={fitRef} />
							<FitCameraToObject targetRef={fitRef} />
						</Suspense>
					</Canvas>
				</span>
			</span>
		</span>
	);
}

