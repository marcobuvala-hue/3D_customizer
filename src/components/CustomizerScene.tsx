import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import { CanvasTexture, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface CustomizerSceneProps {
  texture: CanvasTexture | null;
}

function RotatingCube({ texture }: { texture: CanvasTexture | null }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x = 0.35;
  });

  const materialProps = useMemo(() => ({
    map: texture ?? undefined,
    color: texture ? undefined : '#ffffff',
    metalness: 0.1,
    roughness: 0.6,
  }), [texture]);

  return (
    <mesh ref={meshRef} scale={2.4} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

export function CustomizerScene({ texture }: CustomizerSceneProps) {
  return (
    <Canvas
      camera={{ position: [2.8, 2.2, 3.4], fov: 45 }}
      shadows
      className="scene-canvas"
    >
      <color attach="background" args={[0.95, 0.96, 1]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <RotatingCube texture={texture} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

export default CustomizerScene;
