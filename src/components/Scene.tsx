import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Waveform } from './Waveform'
import { Equalizer } from './Equalizer'
import { MelodyLine } from './Melody'
import { ParticleSparks } from './ParticleSparks'
import { BackgroundPattern } from './BackgroundPattern'
import { MouseAura } from './MouseAura'
import { ClickManager } from './ClickManager'
import { useMusicContext } from '../contexts/MusicContext'

function Circle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { section } = useMusicContext()
  const materialColor = useRef(new THREE.Color())

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime()

    const verseHue = 0.6 + (Math.sin(time * 0.5 + index * 0.5) + 1) / 2 * 0.3
    const chorusHue = 0.95 + (Math.sin(time * 0.5 + index * 0.5) + 1) / 2 * 0.15

    const targetHue = section === 'chorus' ? chorusHue : verseHue

    const currentHSL = (meshRef.current.material as THREE.MeshBasicMaterial).color.getHSL(materialColor.current)
    const newHue = THREE.MathUtils.lerp(currentHSL.h, targetHue, 0.05)

    ;(meshRef.current.material as THREE.MeshBasicMaterial).color.setHSL(newHue, 0.8, 0.6)
  })

  const radius = 0.5 + index * 0.6
  const tube = 0.15

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[radius, radius + tube, 64]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  )
}

function ConcentricCircles() {
  const groupRef = useRef<THREE.Group>(null!)
  const { isBeat } = useMusicContext()

  useEffect(() => {
    if (isBeat && groupRef.current) {
      groupRef.current.scale.set(1.2, 1.2, 1.2)
    }
  }, [isBeat])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  const circles = Array.from({ length: 5 }, (_, i) => i)

  return (
    <group ref={groupRef}>
      {circles.map(i => <Circle key={i} index={i} />)}
    </group>
  )
}

export function Scene() {
  return (
    <>
      <ConcentricCircles />
      <Waveform />
      <Equalizer />
      <group rotation-x={-Math.PI / 2}>
        <MelodyLine />
        <ParticleSparks />
      </group>
      <BackgroundPattern />
      <MouseAura />
      <ClickManager />
    </>
  )
}
