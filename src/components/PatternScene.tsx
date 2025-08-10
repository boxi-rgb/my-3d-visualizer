import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

// SVGパターンをテクスチャに変換する関数
const createPatternTexture = (svgString: string): Promise<THREE.Texture> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 512
    canvas.height = 512
    
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 512, 512)
      ctx.drawImage(img, 0, 0, 512, 512)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2)
      texture.needsUpdate = true
      
      resolve(texture)
    }
    
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
  })
}

// SVGパターンの定義
const SVG_PATTERNS = {
  hexagonal: `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,4 52,17 52,35 30,48 8,35 8,17" 
                   fill="none" stroke="#4299e1" stroke-width="3"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#hexPattern)"/>
    </svg>
  `,
  weave: `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="weavePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#e2e8f0"/>
          <rect x="10" y="10" width="10" height="10" fill="#e2e8f0"/>
          <rect x="0" y="10" width="10" height="10" fill="#4a5568"/>
          <rect x="10" y="0" width="10" height="10" fill="#4a5568"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#weavePattern)"/>
    </svg>
  `,
  wave: `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wavePattern" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
          <path d="M0,15 Q15,5 30,15 T60,15" fill="none" stroke="#4299e1" stroke-width="3"/>
          <path d="M0,0 Q15,10 30,0 T60,0" fill="none" stroke="#ed8936" stroke-width="2"/>
          <path d="M0,30 Q15,20 30,30 T60,30" fill="none" stroke="#48bb78" stroke-width="2"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#wavePattern)"/>
    </svg>
  `,
  dots: `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
          <circle cx="12.5" cy="12.5" r="4" fill="#4299e1"/>
          <circle cx="0" cy="0" r="2" fill="#ed8936"/>
          <circle cx="25" cy="0" r="2" fill="#ed8936"/>
          <circle cx="0" cy="25" r="2" fill="#ed8936"/>
          <circle cx="25" cy="25" r="2" fill="#ed8936"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#dotPattern)"/>
    </svg>
  `,
  spiral: `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="spiralPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M50,50 Q60,40 70,50 Q60,60 50,50 Q40,40 30,50 Q40,60 50,50" 
                fill="none" stroke="#4299e1" stroke-width="3"/>
          <circle cx="50" cy="50" r="3" fill="#ed8936"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#spiralPattern)"/>
    </svg>
  `
}

interface PatternedMeshProps {
  position: [number, number, number]
  patternName: keyof typeof SVG_PATTERNS
  geometry: 'box' | 'sphere' | 'torus' | 'plane'
}

function PatternedMesh({ position, patternName, geometry }: PatternedMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  
  useEffect(() => {
    createPatternTexture(SVG_PATTERNS[patternName]).then(setTexture)
  }, [patternName])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  const getGeometry = () => {
    switch (geometry) {
      case 'sphere': return <sphereGeometry args={[1, 32, 32]} />
      case 'torus': return <torusGeometry args={[1, 0.4, 16, 100]} />
      case 'plane': return <planeGeometry args={[2, 2]} />
      default: return <boxGeometry />
    }
  }
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {patternName}
      </Text>
    </group>
  )
}

export function PatternScene() {
  const patterns: Array<keyof typeof SVG_PATTERNS> = ['hexagonal', 'weave', 'wave', 'dots', 'spiral']
  const geometries: Array<'box' | 'sphere' | 'torus' | 'plane'> = ['box', 'sphere', 'torus', 'plane', 'box']
  
  return (
    <>
      {/* ライト設定 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, 0, -20]} intensity={0.5} />
      
      {/* カメラコントロール */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* パターンメッシュの配置 */}
      {patterns.map((pattern, index) => {
        const angle = (index / patterns.length) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <PatternedMesh
            key={pattern}
            position={[x, 0, z]}
            patternName={pattern}
            geometry={geometries[index]}
          />
        )
      })}
      
      {/* 中央のタイトル */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#2d3748"
        anchorX="center"
        anchorY="middle"
      >
        SVG Patterns in 3D
      </Text>
      
      {/* グラウンドプレーン */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>
    </>
  )
}