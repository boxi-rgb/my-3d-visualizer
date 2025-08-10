import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useMusicContext } from '../contexts/MusicContext'

const bgVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const bgFragmentShader = `
  varying vec2 vUv;
  uniform float uOpacity;

  // Function to generate a grid pattern
  float grid(vec2 st, float resolution) {
    vec2 grid = fract(st * resolution);
    float line = step(0.98, grid.x) + step(0.98, grid.y);
    return 1.0 - clamp(line, 0.0, 1.0);
  }

  void main() {
    float gridValue = grid(vUv, 30.0);
    // Use a faint blue color for the grid
    vec3 color = vec3(0.2, 0.5, 1.0);
    gl_FragColor = vec4(color, gridValue * uOpacity);
  }
`

export function BackgroundPattern() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { isBeat } = useMusicContext()
  const targetOpacity = useRef(0)

  // Trigger the flash on beat
  useEffect(() => {
    if (isBeat) {
      targetOpacity.current = 0.15 // Set a low target opacity for a subtle effect
    }
  }, [isBeat])

  // Animate the opacity
  useFrame(() => {
    if (materialRef.current) {
      // Smoothly move the current opacity towards the target
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        targetOpacity.current,
        0.1
      )
      // Constantly decay the target opacity back to zero
      targetOpacity.current = THREE.MathUtils.lerp(targetOpacity.current, 0, 0.05)
    }
  })

  return (
    <mesh position-z={-20} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={bgVertexShader}
        fragmentShader={bgFragmentShader}
        uniforms={{ uOpacity: { value: 0 } }}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
