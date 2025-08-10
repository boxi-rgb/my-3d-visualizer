import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Bar({ position, index }: { position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current) {
      const time = clock.getElapsedTime()
      
      // Complex wave combining multiple frequencies
      const primary = Math.sin(time * 5 + index * 0.4) * 0.8
      const secondary = Math.sin(time * 8.7 + index * 0.6) * 0.3
      const tertiary = Math.sin(time * 12.1 + index * 0.8) * 0.15
      
      const amplitude = (primary + secondary + tertiary + 2.2) / 2
      const scaleY = Math.max(0.05, amplitude * 3.5)
      
      // Smooth interpolation for natural movement
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleY, 0.15)
      
      // Dynamic color based on intensity
      const intensity = scaleY / 3.5
      const hue = (0.1 + index * 0.02 + time * 0.1) % 1
      const color = new THREE.Color().setHSL(hue, 0.9, 0.3 + intensity * 0.7)
      
      materialRef.current.color = color
      materialRef.current.emissive = color.clone().multiplyScalar(0.3 + intensity * 0.5)
      materialRef.current.emissiveIntensity = 1.5 + intensity * 2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.08, 1, 0.08]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#ff4400"
        emissive="#ff4400"
        emissiveIntensity={1.5}
        roughness={0.1}
        metalness={0.8}
        transmission={0.1}
        thickness={0.3}
        toneMapped={false}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  )
}

export function Equalizer() {
  const count = 60 // Increased bar count for denser effect
  const spacing = 0.15 // Tighter spacing
  const rows = 5 // Multiple rows for 3D depth

  // Create positions for the bars along the x-axis
  const bars = Array.from({ length: count }, (_, i) => {
    const x = (i - (count - 1) / 2) * spacing
    return x
  })

  // Create multiple rows at different Z positions
  const zPositions = Array.from({ length: rows }, (_, i) => {
    return (i - (rows - 1) / 2) * 0.8
  })

  return (
    <group>
      {zPositions.map((z, rowIndex) => (
        <group key={`row-${rowIndex}`} position-z={z}>
          {bars.map((x, i) => (
            <Bar 
              key={`row-${rowIndex}-bar-${i}`} 
              position={[x, 0, 0]} 
              index={i + rowIndex * count} 
            />
          ))}
        </group>
      ))}
    </group>
  )
}
