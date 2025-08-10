import { useThree } from '@react-three/fiber'
import { useInteraction } from '../contexts/InteractionContext'

export function ClickManager() {
  const { triggerClick } = useInteraction()
  const { clock } = useThree()

  return (
    <mesh
      visible={false}
      rotation-x={-Math.PI / 2} // Lay it flat on the "floor"
      onPointerDown={(e) => {
        // Stop event propagation to not interfere with OrbitControls etc.
        e.stopPropagation()
        // Trigger the context update with the click position and time
        triggerClick(e.point, clock.elapsedTime)
      }}
    >
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial />
    </mesh>
  )
}
