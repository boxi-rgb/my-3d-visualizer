import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <>
      {/* ライト */}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 3, 3]} intensity={3} />

      {/* 回転する箱 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <Canvas>
      {/* 背景色 */}
      <color attach="background" args={['#101010']} />

      {/* マウス操作 */}
      <OrbitControls />

      {/* シーンコンポーネント */}
      <Scene />
    </Canvas>
  )
}
