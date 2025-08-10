import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useMusicContext } from '../contexts/MusicContext'
import { useInteraction } from '../contexts/InteractionContext'

const vertexShader = `
  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform vec3 uClickPos;
  uniform float uClickTime;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 newPosition = position;

    // Base wave
    vWave = sin(position.x * uFrequency + uTime) * uAmplitude;

    // Click ripple effect
    float timeSinceClick = uTime - uClickTime;
    if (uClickTime > 0.0 && timeSinceClick > 0.0 && timeSinceClick < 3.0) {
      float distanceToClick = length(position.xz - uClickPos.xz);
      float rippleWave = sin(distanceToClick * 20.0 - timeSinceClick * 10.0);
      // Dampen ripple over time and as it moves away from the center
      rippleWave *= smoothstep(3.0, 0.0, timeSinceClick);
      rippleWave *= (1.0 - smoothstep(0.0, 1.5, distanceToClick));
      vWave += rippleWave * 0.2;
    }

    newPosition.z += vWave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uChorus;

  const vec3 colorVerseA = vec3(0.1, 0.4, 1.0);
  const vec3 colorVerseB = vec3(0.7, 0.2, 1.0);
  const vec3 colorChorusA = vec3(1.0, 0.5, 0.0);
  const vec3 colorChorusB = vec3(1.0, 0.0, 0.0);

  void main() {
    vec3 verseGradient = mix(colorVerseA, colorVerseB, vUv.x);
    vec3 chorusGradient = mix(colorChorusA, colorChorusB, vUv.x);
    vec3 finalColor = mix(verseGradient, chorusGradient, uChorus);
    float brightness = smoothstep(0.0, 0.6, abs(vWave));
    finalColor += brightness * 0.8;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function Wave() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { section } = useMusicContext()
  const { clickData } = useInteraction()

  useEffect(() => {
    if (materialRef.current && clickData.time > 0) {
      materialRef.current.uniforms.uClickPos.value.copy(clickData.position);
      materialRef.current.uniforms.uClickTime.value = clickData.time;
    }
  }, [clickData])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      const targetChorusValue = section === 'chorus' ? 1.0 : 0.0;
      materialRef.current.uniforms.uChorus.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uChorus.value,
        targetChorusValue,
        0.05
      );
    }
  })

  const uniforms = {
    uTime: { value: 0 },
    uFrequency: { value: 5.0 },
    uAmplitude: { value: 0.3 },
    uChorus: { value: 0.0 },
    uClickPos: { value: new THREE.Vector3() },
    uClickTime: { value: -1.0 },
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
        <group rotation-x={-Math.PI / 2}>
            <Wave />
            <mesh scale={[1, -1, 1]}>
                <Wave />
            </mesh>
        </group>
    )
}
