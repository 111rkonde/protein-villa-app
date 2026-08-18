import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

const HeroSupplementMesh = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.4;
      ringRef.current.rotation.z = t * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = -t * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Holographic Energy Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>

      {/* Floating 3D Gold Jar */}
      <group ref={groupRef} position={[0, -0.2, 0]}>
        {/* Main Tub */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.25, 2.6, 48]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Shoulder */}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[1.05, 1.3, 0.3, 48]} />
          <meshStandardMaterial color="#0b1120" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[1.0, 1.05, 0.2, 48]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Lid */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.45, 48]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Neon Emerald Top Ring */}
        <mesh position={[0, 2.05, 0]}>
          <cylinderGeometry args={[0.95, 1.12, 0.1, 48]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} metalness={0.9} />
        </mesh>

        {/* Label Foil Wrap */}
        <mesh position={[0, 0, 0]} scale={[1.002, 1, 1.002]}>
          <cylinderGeometry args={[1.3, 1.25, 2.0, 48, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Green Accent Ribbon */}
        <mesh position={[0, 0.65, 0]} scale={[1.004, 1, 1.004]}>
          <cylinderGeometry args={[1.3, 1.29, 0.25, 48, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>

        {/* 3D Label Text */}
        <group position={[0, 0, 1.33]}>
          <Text
            position={[0, 0.65, 0.01]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            PROTEIN VILLA
          </Text>
          <Text
            position={[0, 0.2, 0.02]}
            fontSize={0.26}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            ISO-GOLD
          </Text>
          <Text
            position={[0, -0.25, 0.01]}
            fontSize={0.11}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            28G NATIVE ISOLATE
          </Text>
        </group>
      </group>
    </group>
  );
};

export const Hero3DCanvas: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[380px] md:min-h-[480px] relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 5.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 6]} intensity={1.8} castShadow />
        <directionalLight position={[-6, -2, -4]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[0, 2, 3]} intensity={1.2} color="#10b981" />

        <Suspense fallback={null}>
          <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <HeroSupplementMesh />
          </Float>

          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.8}
            scale={7}
            blur={2.8}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Interactive Micro Badge */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
        <span>3D Interactive • Drag to inspect 360°</span>
      </div>
    </div>
  );
};
