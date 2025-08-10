import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
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

function OriginalCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const edgesRef = useRef<THREE.LineSegments>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x = state.clock.elapsedTime * 0.5
      edgesRef.current.rotation.y = state.clock.elapsedTime * 0.3
      
      // 虹色アニメーション（エッジのみ）
      const hue = (state.clock.elapsedTime * 100) % 360
      const color = new THREE.Color().setHSL(hue / 360, 1, 0.6)
      ;(edgesRef.current.material as THREE.LineBasicMaterial).color = color
    }
  })

  return (
    <>
      {/* ライト */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 3, 3]} intensity={2} />

      {/* メインの箱 */}
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
        
        {/* エッジのみ虹色発光 */}
        <Edges ref={edgesRef} threshold={15} lineWidth={3}>
          <lineBasicMaterial color="red" />
        </Edges>
      </mesh>
    </>
  )
}

interface SceneProps {
  mode?: 'sound' | 'original'
}

export function Scene({ mode = 'sound' }: SceneProps) {
  return (
    <>
      {mode === 'sound' ? (
        <>
          <ConcentricCircles />
          <Waveform />
          <Equalizer />
        </>
      ) : (
        <OriginalCube />
      )}
    </>
  )
}