export function Scene() {
  return (
    <>
      {/* ライト */}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 3, 3]} intensity={3} />

      {/* 回転する箱 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}
