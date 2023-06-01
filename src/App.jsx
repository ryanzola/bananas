import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Banana({ z }) {
  const ref = useRef()
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])
  const { nodes, materials } = useGLTF('/banana-transformed.glb')

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    z: z,
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })

  useFrame(() => {
    ref.current.rotation.set(data.rX += 0.001, data.rY += 0.001, data.rZ += 0.001)
    ref.current.position.set(data.x * width, (data.y += 0.02), z)
    if (data.y > height / 1) data.y = -height / 1
  })

  return <mesh 
    ref={ ref } 
    geometry={nodes.banana.geometry} 
    material={materials.skin} 
    material-emissive="orange"
  />
}

export default function App({ count = 200, depth = 80 }) {
  return <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
    <color attach="background" args={['#FBE594']} />
    <Suspense fallback={ null }>
      <spotLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="sunset" />
      { Array.from({ length: count }, (_, i) => (
        <Banana key={i} z={ - (i / count) * depth - 20 } />
      )) }

      <EffectComposer>
        <DepthOfField target={[0, 0, depth / 2 ]} focalLength={0.1} bokehScale={11} height={700} />
      </EffectComposer>
    </Suspense>
  </Canvas>
}


