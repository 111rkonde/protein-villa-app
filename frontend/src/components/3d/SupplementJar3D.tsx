import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Box, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface SupplementJar3DProps {
  color?: string;
  label?: string;
  categoryName?: string;
  fallbackImage?: string;
  productName?: string;
}

// 3D Jar Mesh Component
const SupplementJarModel: React.FC<{
  color: string;
  label: string;
  wireframe: boolean;
  categoryName: string;
}> = ({ color, label, wireframe, categoryName }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Subtle floating rotation when active
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing idle movement
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      {/* Main Tub Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.25, 2.6, 64]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : '#111827'}
          roughness={0.25}
          metalness={0.65}
          wireframe={wireframe}
        />
      </mesh>

      {/* Shoulder Taper */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.3, 0.3, 64]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : '#0f172a'}
          roughness={0.25}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.05, 0.2, 64]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : '#1e293b'}
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Screw Cap / Lid */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.45, 64]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : '#05070a'}
          roughness={0.15}
          metalness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top Cap Grip Ring */}
      <mesh position={[0, 2.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.12, 0.1, 64]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : color}
          roughness={0.2}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Shiny Metallic Top Logo Disc */}
      <mesh position={[0, 2.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>

      {/* Center Label Wrap (Front Accent) */}
      <mesh position={[0, 0, 0]} scale={[1.002, 1, 1.002]}>
        <cylinderGeometry args={[1.3, 1.25, 2.0, 64, 1, true, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial
          color={wireframe ? '#00ffff' : '#182234'}
          roughness={0.35}
          metalness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* Brand Color Banner Ribbon */}
      <mesh position={[0, 0.65, 0]} scale={[1.004, 1, 1.004]}>
        <cylinderGeometry args={[1.3, 1.29, 0.25, 64, 1, true, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Bottom Accent Ring */}
      <mesh position={[0, -0.9, 0]} scale={[1.003, 1, 1.003]}>
        <cylinderGeometry args={[1.26, 1.25, 0.12, 64, 1, true, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3D Embossed Label Typography (Front Facing) */}
      {!wireframe && (
        <group position={[0, 0, 1.33]} rotation={[0, 0, 0]}>
          {/* Brand header */}
          <Text
            position={[0, 0.65, 0.01]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            PROTEIN VILLA
          </Text>

          {/* Product main label */}
          <Text
            position={[0, 0.2, 0.02]}
            fontSize={0.24}
            color={color}
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
            textAlign="center"
            fontWeight="bold"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {label}
          </Text>

          {/* Category subtitle */}
          <Text
            position={[0, -0.22, 0.01]}
            fontSize={0.11}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            100% ULTRA-PURE FORMULA
          </Text>

          {/* Gold Quality Seal Badge */}
          <mesh position={[0, -0.55, 0.01]}>
            <planeGeometry args={[0.9, 0.26]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
          </mesh>
          <Text
            position={[0, -0.55, 0.02]}
            fontSize={0.09}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            ✓ HPLC LAB VERIFIED
          </Text>
        </group>
      )}

      {/* Nutrition Facts Label (Back Facing) */}
      {!wireframe && (
        <group position={[0, 0, -1.33]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 0.5, 0.01]}
            fontSize={0.13}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            SUPPLEMENT FACTS
          </Text>
          <Text
            position={[0, 0.1, 0.01]}
            fontSize={0.1}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.0}
            textAlign="center"
          >
            Per Scoop: 28g Native Protein
            {"\n"}6.5g BCAAs | 0g Sugar
            {"\n"}Fast Absorption Formula
          </Text>
          <Text
            position={[0, -0.4, 0.01]}
            fontSize={0.08}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
          >
            BATCH: PV-2026-HPLC-CERT
          </Text>
        </group>
      )}
    </group>
  );
};

export const SupplementJar3D: React.FC<SupplementJar3DProps> = ({
  color = '#10b981',
  label = 'WHEY ISOLATE',
  categoryName = 'Whey Protein',
  fallbackImage,
  productName = 'Product',
}) => {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const controlsRef = useRef<any>(null);

  const resetCamera = (targetPosition: [number, number, number] = [0, 0, 4.5]) => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(...targetPosition);
      controlsRef.current.update();
    }
  };

  const setAnglePreset = (angle: 'front' | 'side' | 'back' | 'top') => {
    if (!controlsRef.current) return;
    setAutoRotate(false);

    if (angle === 'front') {
      controlsRef.current.object.position.set(0, 0.3, 4.5);
    } else if (angle === 'side') {
      controlsRef.current.object.position.set(4.5, 0.3, 0);
    } else if (angle === 'back') {
      controlsRef.current.object.position.set(0, 0.3, -4.5);
    } else if (angle === 'top') {
      controlsRef.current.object.position.set(0, 4.5, 0.8);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-[420px] md:h-[500px] bg-gradient-to-b from-slate-900 via-[#0c121d] to-[#080b11] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center select-none group">
      {/* 3D / 2D Toggle Switch */}
      <div className="absolute top-4 left-4 z-20 flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg text-xs font-semibold">
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            viewMode === '3d'
              ? 'bg-brand-500 text-black shadow-neon'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          Interactive 3D
        </button>
        <button
          onClick={() => setViewMode('2d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            viewMode === '2d'
              ? 'bg-brand-500 text-black shadow-neon'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          2D Photo
        </button>
      </div>

      {/* 3D Control Badges */}
      {viewMode === '3d' && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe((prev) => !prev)}
            className={`p-2 rounded-xl border text-xs font-medium backdrop-blur-md transition ${
              wireframe
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-neon'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Holographic Wireframe"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`p-2 rounded-xl border text-xs font-medium backdrop-blur-md transition ${
              autoRotate
                ? 'bg-brand-500 text-black border-brand-400 shadow-neon'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle 360° Auto-Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Reset position */}
          <button
            onClick={() => resetCamera()}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Angle Presets Bar */}
      {viewMode === '3d' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-xl text-[11px] font-medium text-slate-300">
          <span className="text-slate-500 px-1 font-semibold">VIEW:</span>
          <button
            onClick={() => setAnglePreset('front')}
            className="px-2.5 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
          >
            Front
          </button>
          <button
            onClick={() => setAnglePreset('side')}
            className="px-2.5 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
          >
            Side
          </button>
          <button
            onClick={() => setAnglePreset('back')}
            className="px-2.5 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
          >
            Nutrition
          </button>
          <button
            onClick={() => setAnglePreset('top')}
            className="px-2.5 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
          >
            Cap
          </button>
        </div>
      )}

      {/* Main 3D Canvas or 2D Fallback */}
      {viewMode === '3d' ? (
        <Canvas
          shadows
          camera={{ position: [0, 0.4, 4.5], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, 3, -3]} intensity={0.7} color="#38bdf8" />
          <pointLight position={[0, -2, 2]} intensity={0.5} color={color} />
          <spotLight position={[0, 6, 2]} intensity={1.2} angle={0.6} penumbra={1} />

          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
              <SupplementJarModel
                color={color}
                label={label}
                categoryName={categoryName}
                wireframe={wireframe}
              />
            </Float>

            <ContactShadows
              position={[0, -1.6, 0]}
              opacity={0.75}
              scale={6}
              blur={2.5}
              far={4}
              color="#000000"
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2.5}
            maxDistance={7}
            autoRotate={autoRotate}
            autoRotateSpeed={2.5}
            maxPolarAngle={Math.PI / 2 + 0.15}
          />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-8">
          <img
            src={fallbackImage || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80'}
            alt={productName}
            className="max-h-[360px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Floating 3D Badge on hover */}
      {viewMode === '3d' && (
        <div className="absolute bottom-16 right-4 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          <span>Drag to orbit • Scroll to zoom</span>
        </div>
      )}
    </div>
  );
};
