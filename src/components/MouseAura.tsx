import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export function MouseAura() {
  const particleCount = 20;
  const pointsRef = useRef<THREE.Points>(null!);
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0));

  const [positions, randomFactors] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const r = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      r[i * 3 + 0] = Math.random() - 0.5;
      r[i * 3 + 1] = Math.random() - 0.5;
      r[i * 3 + 2] = Math.random() - 0.5;
    }
    return [p, r];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Calculate the target position for this particle, with a random offset from the mouse
        const target = new THREE.Vector3(
          mousePosition.current.x + randomFactors[i3 + 0] * 0.5,
          mousePosition.current.y + randomFactors[i3 + 1] * 0.5,
          mousePosition.current.z + randomFactors[i3 + 2] * 0.5
        );

        // Lerp the particle's position towards the target
        const currentVec = new THREE.Vector3(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);
        currentVec.lerp(target, delta * 5.0);

        currentPositions[i3] = currentVec.x;
        currentPositions[i3 + 1] = currentVec.y;
        currentPositions[i3 + 2] = currentVec.z;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Invisible plane to capture mouse events */}
      <mesh
        position-z={1}
        visible={false}
        onPointerMove={(e) => {
          // The event gives us the 3D intersection point
          mousePosition.current.copy(e.point);
        }}
      >
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial />
      </mesh>

      {/* The visible particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
