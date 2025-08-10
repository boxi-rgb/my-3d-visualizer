import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Waveform } from './Waveform'
import { Equalizer } from './Equalizer'

function Circle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    // Animate hue from blue (0.6) towards magenta (0.9)
    const hue = 0.6 + (Math.sin(time * 0.5 + index * 0.5) + 1) / 2 * 0.3
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).color.setHSL(hue, 0.8, 0.6)
    }
  })

  const radius = 0.5 + index * 0.6
  const tube = 0.15

  return (
    // Rotate the rings to be flat on the XZ plane
    <mesh ref={meshRef} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[radius, radius + tube, 64]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  )
}

function ConcentricCircles() {
  // Create 5 concentric circles
  const circles = Array.from({ length: 5 }, (_, i) => i)

  return (
    <group>
      {circles.map(i => <Circle key={i} index={i} />)}
    </group>
  )
}

export function Scene() {
  return (
    <>
      <ConcentricCircles />
      <Waveform />
      <Equalizer />
    </>
  )
}
