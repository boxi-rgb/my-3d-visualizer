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

  // Enhanced cyberpunk color palette
  const vec3 colorDeepBlue = vec3(0.05, 0.15, 0.8);
  const vec3 colorElectricCyan = vec3(0.0, 0.9, 1.0);
  const vec3 colorNeonPink = vec3(1.0, 0.1, 0.6);
  const vec3 colorBrightOrange = vec3(1.0, 0.4, 0.0);
  const vec3 colorHotWhite = vec3(2.0, 2.0, 2.0);

  void main() {
    // Enhanced multi-layer color mixing
    float pos = vUv.x;
    float waveIntensity = abs(vWave);
    
    // Primary color transitions
    float step1 = smoothstep(0.0, 0.25, pos);
    float step2 = smoothstep(0.25, 0.5, pos);
    float step3 = smoothstep(0.5, 0.75, pos);
    float step4 = smoothstep(0.75, 1.0, pos);

    vec3 baseColor = mix(colorDeepBlue, colorElectricCyan, step1);
    baseColor = mix(baseColor, colorNeonPink, step2);
    baseColor = mix(baseColor, colorBrightOrange, step3);
    baseColor = mix(baseColor, colorHotWhite, step4 * 0.3);

    // Enhanced brightness and glow effects
    float brightness = smoothstep(0.0, 0.8, waveIntensity);
    float superBright = smoothstep(0.6, 1.0, waveIntensity);
    
    vec3 finalColor = baseColor * (1.0 + brightness * 1.5);
    
    // Add hot white peaks for maximum impact
    finalColor += colorHotWhite * superBright * 0.7;
    
    // Subtle edge glow
    float edgeGlow = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    finalColor += colorElectricCyan * edgeGlow * 0.3;

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
    uFrequency: { value: 8.0 },
    uAmplitude: { value: 0.5 },
  }

  return (
    <mesh>
      <planeGeometry args={[12, 3, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
        transparent={true}
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
