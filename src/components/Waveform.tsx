import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 newPosition = position;

    // Calculate wave height and pass to fragment shader
    vWave = sin(position.x * uFrequency + uTime) * uAmplitude;
    newPosition.z += vWave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying float vWave;

  // Define neon colors
  const vec3 colorBlue = vec3(0.1, 0.4, 1.0);
  const vec3 colorPurple = vec3(0.7, 0.2, 1.0);
  const vec3 colorPink = vec3(1.0, 0.2, 0.7);
  const vec3 colorOrange = vec3(1.0, 0.6, 0.2);

  void main() {
    // Create a multi-color gradient based on horizontal position (uv.x)
    float step1 = smoothstep(0.0, 0.3, vUv.x);
    float step2 = smoothstep(0.3, 0.6, vUv.x);
    float step3 = smoothstep(0.6, 1.0, vUv.x);

    vec3 finalColor = mix(colorBlue, colorPurple, step1);
    finalColor = mix(finalColor, colorPink, step2);
    finalColor = mix(finalColor, colorOrange, step3);

    // Add brightness based on the wave height to make peaks glow more
    float brightness = smoothstep(0.0, 0.6, abs(vWave));
    finalColor += brightness * 0.8;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function Wave() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const uniforms = {
    uTime: { value: 0 },
    uFrequency: { value: 5.0 },
    uAmplitude: { value: 0.3 },
  }

  return (
    <mesh>
      <planeGeometry args={[10, 2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function Waveform() {
    return (
        // Rotate the entire waveform to be flat on the XZ plane
        <group rotation-x={-Math.PI / 2}>
            <Wave />
            <mesh scale={[1, -1, 1]}>
                <Wave />
            </mesh>
        </group>
    )
}
