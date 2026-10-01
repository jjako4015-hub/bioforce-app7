import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, TorusKnot, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function DnaMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.9;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <TorusKnot ref={meshRef} args={[0.9, 0.22, 128, 32]}>
        <meshStandardMaterial
          color="#39FF88"
          emissive="#18C875"
          emissiveIntensity={0.8}
          wireframe
          roughness={0.1}
        />
      </TorusKnot>
    </Float>
  );
}

export const DnaCanvas3D: React.FC<{ label?: string; height?: string }> = ({ label, height = "h-64" }) => {
  return (
    <div className={`w-full ${height} rounded-2xl bg-gradient-to-b from-[#E8FFF1]/80 to-[#B8FFD6]/30 border border-[#39FF88]/50 relative overflow-hidden my-3`}>
      <Canvas camera={{ position: [0, 0, 3.2] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} color="#39FF88" intensity={2.5} />
        <directionalLight position={[-5, -5, -5]} color="#52FF9A" intensity={1} />
        <DnaMesh />
        <Sparkles count={30} scale={3.5} size={3.5} speed={0.5} color="#39FF88" />
        <OrbitControls enableZoom autoRotate autoRotateSpeed={1.5} enablePan={false} />
      </Canvas>
      {label && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0B3D24]/80 text-[#39FF88] text-xs font-extrabold backdrop-blur-md border border-[#39FF88]/40">
          3D MODEL: {label.toUpperCase()}
        </div>
      )}
    </div>
  );
};