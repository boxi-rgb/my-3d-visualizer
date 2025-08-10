import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Bar({ position, index }: { position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Animate the scale.y to simulate an equalizer
      const time = clock.getElapsedTime()
      // Use a sine wave with offsets for a dynamic, non-uniform animation
      const scaleY = (Math.sin(time * 4 + index * 0.3) + 1) / 2 * 2.5 + 0.1
      meshRef.current.scale.y = scaleY
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.05, 1, 0.05]} />
      {/* Use an emissive material that is not tone-mapped to ensure it glows with Bloom */}
      <meshBasicMaterial color="#ff9900" toneMapped={false} />
    </mesh>
  )
}

export function Equalizer() {
  const count = 40 // Number of bars per row
  const spacing = 0.25

  // Create positions for the bars along the x-axis
  const bars = Array.from({ length: count }, (_, i) => {
    const x = (i - (count - 1) / 2) * spacing
    return x
  })

  return (
    <group>
      {/* A row of bars in front of the center */}
      <group position-z={-2}>
        {bars.map((x, i) => <Bar key={`front-${i}`} position={[x, 0, 0]} index={i} />)}
      </group>
      {/* A row of bars behind the center */}
      <group position-z={2}>
        {bars.map((x, i) => <Bar key={`back-${i}`} position={[x, 0, 0]} index={i} />)}
      </group>
    </group>
  )
}
