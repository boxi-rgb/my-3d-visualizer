import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useMusicContext } from '../contexts/MusicContext'

const barVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const barFragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    // Create a vertical gradient by mixing two colors based on the vUv.y coordinate
    vec3 finalColor = mix(uColorA, uColorB, vUv.y);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function Bar({ position, index }: { position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { isBeat, section } = useMusicContext()
  const targetScale = useRef(0.1)

  // Define color pairs for verse and chorus gradients
  const verseColors = { a: new THREE.Color("#ff9900"), b: new THREE.Color("#ff5500") }
  const chorusColors = { a: new THREE.Color("#ff4422"), b: new THREE.Color("#ff0000") }

  const uniforms = useMemo(() => ({
    uColorA: { value: verseColors.a },
    uColorB: { value: verseColors.b },
  }), [verseColors.a, verseColors.b])

  useEffect(() => {
    if (isBeat && Math.random() > 0.5) {
      targetScale.current = Math.random() * 2.5 + 0.5
    }
  }, [isBeat, index])

  useFrame(() => {
    if (meshRef.current) {
      // Animate scale
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale.current, 0.1)
      targetScale.current = THREE.MathUtils.lerp(targetScale.current, 0.1, 0.02)

      // Animate gradient colors based on section
      const targetColorA = section === 'chorus' ? chorusColors.a : verseColors.a
      const targetColorB = section === 'chorus' ? chorusColors.b : verseColors.b

      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uColorA.value.lerp(targetColorA, 0.05)
      material.uniforms.uColorB.value.lerp(targetColorB, 0.05)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.05, 1, 0.05]} />
      <shaderMaterial
        vertexShader={barVertexShader}
        fragmentShader={barFragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  )
}

export function Equalizer() {
  const count = 40
  const spacing = 0.25

  const bars = Array.from({ length: count }, (_, i) => {
    const x = (i - (count - 1) / 2) * spacing
    return x
  })

  return (
    <group>
      <group position-z={-2}>
        {bars.map((x, i) => <Bar key={`front-${i}`} position={[x, 0, 0]} index={i} />)}
      </group>
      <group position-z={2}>
        {bars.map((x, i) => <Bar key={`back-${i}`} position={[x, 0, 0]} index={i} />)}
      </group>
    </group>
  )
}
