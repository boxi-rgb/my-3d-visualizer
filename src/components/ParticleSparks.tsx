import { useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useMusicContext } from '../contexts/MusicContext'

const particleVertexShader = `
  uniform float uTime;
  attribute vec3 aVelocity;
  attribute float aSpawnTime;

  varying float vLifetime;

  void main() {
    float timeSinceSpawn = uTime - aSpawnTime;

    // Only calculate position for particles that have been spawned
    if (timeSinceSpawn >= 0.0) {
      vec3 newPosition = position + aVelocity * timeSinceSpawn;
      newPosition.y -= 0.5 * 4.0 * timeSinceSpawn * timeSinceSpawn; // Apply gravity

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      gl_PointSize = 4.0;
      vLifetime = timeSinceSpawn;
    } else {
      // Hide particles that haven't been spawned yet
      gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
      vLifetime = -1.0;
    }
  }
`

const particleFragmentShader = `
  uniform vec3 uColor;
  varying float vLifetime;

  void main() {
    if (vLifetime < 0.0) discard; // Discard unspawned particles

    float totalLifetime = 1.5; // Particle lives for 1.5 seconds
    float alpha = 1.0 - smoothstep(0.0, totalLifetime, vLifetime);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`

export function ParticleSparks() {
  const pointsRef = useRef<THREE.Points>(null!)
  const { isSnare } = useMusicContext()
  const currentParticleIndex = useRef(0)

  const particleCount = 500
  const [positions, velocities, spawnTimes] = useMemo(() => {
    const p = new Float32Array(particleCount * 3)
    const v = new Float32Array(particleCount * 3)
    const s = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      s[i] = -1.0 // Initialize spawn time to -1 (not spawned)
    }
    return [p, v, s]
  }, [particleCount])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('white') },
  }), [])

  useEffect(() => {
    if (isSnare && pointsRef.current) {
      const time = pointsRef.current.material.uniforms.uTime.value;
      const spawnCount = 10; // Spawn 10 particles per snare hit

      for (let i = 0; i < spawnCount; i++) {
        const idx = currentParticleIndex.current;

        // Starting position on the peaks of the waveform
        positions[idx * 3 + 0] = (Math.random() - 0.5) * 8; // Random x position
        positions[idx * 3 + 1] = Math.random() * 0.5 + 0.3; // Around the wave peak height
        positions[idx * 3 + 2] = 0;

        // Random outward velocity
        velocities[idx * 3 + 0] = (Math.random() - 0.5) * 2.0;
        velocities[idx * 3 + 1] = Math.random() * 2.0 + 1.0;
        velocities[idx * 3 + 2] = (Math.random() - 0.5) * 2.0;

        spawnTimes[idx] = time;

        currentParticleIndex.current = (idx + 1) % particleCount;
      }

      // We need to tell Three.js to update these attributes
      const geometry = pointsRef.current.geometry;
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aVelocity.needsUpdate = true;
      geometry.attributes.aSpawnTime.needsUpdate = true;
    }
  }, [isSnare, positions, velocities, spawnTimes])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aVelocity" count={particleCount} array={velocities} itemSize={3} />
        <bufferAttribute attach="attributes-aSpawnTime" count={particleCount} array={spawnTimes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
