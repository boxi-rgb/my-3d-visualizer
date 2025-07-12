import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'

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
