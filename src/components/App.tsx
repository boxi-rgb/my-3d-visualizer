import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useState } from 'react'

const OrbitControls = lazy(() => import('@react-three/drei').then(module => ({ default: module.OrbitControls })))
const Scene = lazy(() => import('./Scene').then(module => ({ default: module.Scene })))
const PatternScene = lazy(() => import('./PatternScene').then(module => ({ default: module.PatternScene })))

export default function App() {
  const [currentScene, setCurrentScene] = useState<'original' | 'patterns'>('original')

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
        {currentScene === 'original' ? (
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

      <Canvas camera={{ position: [0, 0, 8] }}>
        {/* 背景色 */}
        <color attach="background" args={currentScene === 'original' ? ['#101010'] : ['#1a202c']} />

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
          {currentScene === 'original' ? <Scene /> : <PatternScene />}
        </Suspense>
      </Canvas>
    </div>
  )
}
