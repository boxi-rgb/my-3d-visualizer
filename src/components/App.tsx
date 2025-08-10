import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, lazy, useState } from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'

const Scene = lazy(() => import('./Scene').then(module => ({ default: module.Scene })))
const PatternScene = lazy(() => import('./PatternScene').then(module => ({ default: module.PatternScene })))

export default function App() {
  const [currentScene, setCurrentScene] = useState<'original' | 'patterns' | 'sound'>('sound')

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* シーン切り替えUI */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setCurrentScene('sound')}
          style={{
            padding: '10px 20px',
            background: currentScene === 'sound' ? '#4299e1' : 'rgba(255,255,255,0.2)',
            color: currentScene === 'sound' ? 'white' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentScene === 'sound' ? 'bold' : 'normal',
            backdropFilter: 'blur(10px)'
          }}
        >
          🎵 Sound Wave
        </button>
        <button
          onClick={() => setCurrentScene('original')}
          style={{
            padding: '10px 20px',
            background: currentScene === 'original' ? '#4299e1' : 'rgba(255,255,255,0.2)',
            color: currentScene === 'original' ? 'white' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentScene === 'original' ? 'bold' : 'normal',
            backdropFilter: 'blur(10px)'
          }}
        >
          🎮 Original
        </button>
        <button
          onClick={() => setCurrentScene('patterns')}
          style={{
            padding: '10px 20px',
            background: currentScene === 'patterns' ? '#4299e1' : 'rgba(255,255,255,0.2)',
            color: currentScene === 'patterns' ? 'white' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentScene === 'patterns' ? 'bold' : 'normal',
            backdropFilter: 'blur(10px)'
          }}
        >
          🎨 Patterns
        </button>
      </div>

      {/* 説明テキスト */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 100,
        color: 'white',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.5)',
        padding: '15px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        maxWidth: '300px'
      }}>
        {currentScene === 'sound' ? (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🎵 Sound Wave Visualizer</div>
            <div>インタラクティブ音波ビジュアライザー</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
              マウス: 回転 | ホイール: ズーム | クリック: インタラクション
            </div>
          </>
        ) : currentScene === 'original' ? (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🎮 Original Scene</div>
            <div>虹色エッジの回転キューブ</div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🎨 Pattern Gallery</div>
            <div>SVGパターンを3Dテクスチャとして表示</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
              マウス: 回転 | ホイール: ズーム
            </div>
          </>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, currentScene === 'sound' ? 10 : 8], fov: 75 }}>
        {/* 背景色 */}
        <color attach="background" args={
          currentScene === 'sound' ? ['#101010'] : 
          currentScene === 'original' ? ['#101010'] : ['#1a202c']
        } />

        <Suspense fallback={null}>
          {/* マウス操作 */}
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />

          {/* シーンコンポーネント */}
          {currentScene === 'sound' ? (
            <EffectComposer>
              <Scene mode="sound" />
              <Bloom
                intensity={2.5}
                luminanceThreshold={0.05}
                luminanceSmoothing={0.015}
                mipmapBlur={true}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.008, 0.012]}
              />
              <Glitch
                delay={[2.0, 8.0]}
                duration={[0.2, 0.6]}
                strength={[0.1, 0.3]}
                mode={GlitchMode.SPORADIC}
                active={true}
                ratio={0.95}
              />
              <Vignette
                eskil={false}
                offset={0.15}
                darkness={0.4}
              />
              <Noise
                opacity={0.03}
                blendFunction={BlendFunction.SCREEN}
              />
            </EffectComposer>
          ) : currentScene === 'original' ? (
            <Scene mode="original" />
          ) : (
            <PatternScene />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}