import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollReactive } from '../hooks/useScrollReactive';

export default function BrainScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { mouse } = useThree();
  const { velocity, distance } = useScrollReactive();

  // Custom hologram shader with subtle fresnel + scanlines
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#00d4ff') },
      uColorB: { value: new THREE.Color('#ff2fb6') }
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorld;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalMatrix * normal;
        vPosition = position;
        
        // Organic pulsing deformation
        vec3 transformed = position + normal * sin(uTime * 2.0 + position.y * 4.0) * 0.02;
        transformed += normal * sin(uTime * 1.5 + position.x * 3.0) * 0.015;
        
        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        vWorld = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec3 vNormal;
      varying vec3 vWorld;
      varying vec3 vPosition;
      
      void main() {
        // Enhanced fresnel effect
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.5);
        
        // Animated scanlines
        float scan = 0.5 + 0.5 * sin(vWorld.y * 80.0 + uTime * 6.0);
        float scan2 = 0.5 + 0.5 * sin(vWorld.x * 60.0 - uTime * 4.0);
        
        // Color mixing with position-based variation
        vec3 col = mix(uColorA, uColorB, scan * scan2 * fresnel);
        
        // Add some noise/detail
        float detail = sin(vPosition.x * 20.0 + uTime) * sin(vPosition.y * 20.0) * 0.1;
        col += detail;
        
        float alpha = fresnel * 0.85 + 0.15;
        gl_FragColor = vec4(col, alpha);
      }
    `
  }), []);

  // Create procedural brain-like geometry
  const brainGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 3);
    const positions = geometry.attributes.position;
    
    // Deform to create brain-like shape
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Create organic deformations
      const noise = Math.sin(x * 5) * Math.cos(y * 5) * Math.sin(z * 5) * 0.2;
      const scale = 1 + noise;
      
      positions.setXYZ(i, x * scale, y * scale * 0.9, z * scale * 1.1);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    
    if (groupRef.current) {
      // Scroll-driven rotation speed
      groupRef.current.rotation.y += 0.003 + velocity * 0.05;
      
      // Subtle vertical bob based on cumulative distance
      groupRef.current.position.y = Math.sin(distance * 0.3) * 0.15;
      
      // Mouse parallax (pointer normalized between -1..1)
      groupRef.current.rotation.x = mouse.y * -0.3;
      groupRef.current.rotation.z = mouse.x * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={'#00d4ff'} />
      <pointLight position={[-5, -5, -3]} intensity={0.8} color={'#ff2fb6'} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color={'#ffffff'} />
      
      {/* Main brain mesh */}
      <mesh geometry={brainGeometry} material={shaderMaterial} scale={1.8} />
      
      {/* Secondary brain layer for depth */}
      <mesh geometry={brainGeometry} material={shaderMaterial} scale={1.85}>
        <meshBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.05} 
          wireframe 
        />
      </mesh>
    </group>
  );
}

