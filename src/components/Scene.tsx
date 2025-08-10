import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export function Scene() {
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
