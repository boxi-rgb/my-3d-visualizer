import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Create a "comet" or "tracer" effect that travels along the tube
    float speed = 0.8;
    float trailLength = 0.2;

    // Calculate the position of the head of the comet
    float headPosition = fract(uTime * speed);

    // Calculate the distance from the current fragment to the head
    float distance = fract(vUv.x - headPosition);

    // Create a smooth falloff for the tail
    float alpha = 1.0 - smoothstep(0.0, trailLength, distance);

    // Discard fragments that are not part of the comet to improve performance
    if (alpha < 0.01) discard;

    // A bright, slightly blueish-white color
    gl_FragColor = vec4(0.8, 0.9, 1.0, alpha);
  }
`

// A custom curve that defines the path for the melody line.
// It should roughly follow the main waveform's shape.
class MelodyCurve extends THREE.Curve<THREE.Vector3> {
  private waveFrequency: number;
  private waveAmplitude: number;

  constructor() {
    super();
    this.waveFrequency = 5.0; // Corresponds to uFrequency in Waveform.tsx
    this.waveAmplitude = 0.3; // Corresponds to uAmplitude in Waveform.tsx
  }

  getPoint(t: number): THREE.Vector3 {
    const x = (t - 0.5) * 10; // Match the length of the waveform plane
    // A sine wave path that sits slightly above the main waveform
    const y = Math.sin(t * this.waveFrequency) * this.waveAmplitude + 0.1;
    const z = 0;
    return new THREE.Vector3(x, y, z);
  }
}

export function MelodyLine() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if(materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  })

  const curve = new MelodyCurve();

  return (
    <mesh>
      <tubeGeometry args={[curve, 128, 0.02, 8, false]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
