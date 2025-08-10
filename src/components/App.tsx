import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { MusicProvider, useMusicContext } from '../contexts/MusicContext'
import { InteractionProvider } from '../contexts/InteractionContext'
import { useEffect } from 'react'
import * as THREE from 'three'

// A dedicated component to handle camera animations synced to the music.
function CameraRig() {
  const { camera } = useThree()
  const { isBeat } = useMusicContext()

  // This effect triggers the "pulse" on each beat
  useEffect(() => {
    if (isBeat) {
      camera.zoom = 1.1
      camera.updateProjectionMatrix()
    }
  }, [isBeat, camera])

  // This frame loop provides the smooth damping effect
  useFrame(() => {
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, 1, 0.1)
    camera.updateProjectionMatrix()
  })

  return null
}

// The main App component
export default function App() {
  return (
    // Canvas is the root for all R3F rendering and context
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      {/* Providers that use R3F hooks MUST be inside the Canvas */}
      <InteractionProvider>
        <MusicProvider>
          {/* Background color */}
          <color attach="background" args={['#101010']} />

          {/* Mouse controls */}
          <OrbitControls />

          {/* All visual components are wrapped by the providers */}
          <Scene />

          {/* The CameraRig uses the music context, so it must be inside the provider */}
          <CameraRig />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.025}
              mipmapBlur={true}
            />
          </EffectComposer>
        </MusicProvider>
      </InteractionProvider>
    </Canvas>
  )
}
