import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      {/* 背景色 */}
      <color attach="background" args={['#101010']} />

      {/* マウス操作 */}
      <OrbitControls />

      {/* シーンとエフェクト */}
      <EffectComposer>
        <Scene />
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.025}
          mipmapBlur={true}
        />
      </EffectComposer>
    </Canvas>
  )
}
