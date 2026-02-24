import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

interface CarPreview3DProps {
  model: string;
  bodyColor: string;
  wheelStyle: string;
  interiorColor: string;
}

// ─── Car Body Geometry ────────────────────────────────────────────────────────

interface CarModelProps {
  model: string;
  bodyColor: string;
  wheelStyle: string;
  interiorColor: string;
}

function WheelMesh({ position, wheelStyle }: { position: [number, number, number]; wheelStyle: string }) {
  const isSpoke = wheelStyle === 'Sport' || wheelStyle === 'Racing';
  const isSolid = wheelStyle === 'Classic';

  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.28, 0.10, 16, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.08, isSpoke ? 5 : 32, 1, false]} />
        <meshStandardMaterial
          color={isSolid ? '#888888' : '#cccccc'}
          roughness={isSolid ? 0.5 : 0.2}
          metalness={isSolid ? 0.6 : 0.9}
        />
      </mesh>
      {/* Spokes for sport/racing */}
      {isSpoke && [0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, (i * Math.PI * 2) / 5, 0]}
          castShadow
        >
          <boxGeometry args={[0.04, 0.38, 0.04]} />
          <meshStandardMaterial color="#dddddd" roughness={0.2} metalness={0.95} />
        </mesh>
      ))}
      {/* Center cap */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.10, 16]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

function CarModel({ model, bodyColor, wheelStyle, interiorColor }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Model-specific dimensions
  const modelDims = {
    'Apex GT': { bodyLength: 2.0, bodyHeight: 0.38, bodyWidth: 0.9, roofHeight: 0.32, roofLength: 1.0 },
    'Titan SUV': { bodyLength: 2.2, bodyHeight: 0.52, bodyWidth: 1.0, roofHeight: 0.42, roofLength: 1.4 },
    'Phantom Coupe': { bodyLength: 2.1, bodyHeight: 0.32, bodyWidth: 0.88, roofHeight: 0.26, roofLength: 0.9 },
    'Vortex Roadster': { bodyLength: 1.9, bodyHeight: 0.28, bodyWidth: 0.85, roofHeight: 0.18, roofLength: 0.7 },
    'Nexus Sedan': { bodyLength: 2.15, bodyHeight: 0.40, bodyWidth: 0.92, roofHeight: 0.34, roofLength: 1.1 },
  };

  const dims = modelDims[model as keyof typeof modelDims] || modelDims['Apex GT'];

  const bodyMaterial = (
    <meshStandardMaterial
      color={bodyColor}
      roughness={0.15}
      metalness={0.85}
      envMapIntensity={1.5}
    />
  );

  const glassMaterial = (
    <meshStandardMaterial
      color="#88aacc"
      roughness={0.05}
      metalness={0.1}
      transparent
      opacity={0.45}
    />
  );

  const interiorMat = (
    <meshStandardMaterial
      color={interiorColor}
      roughness={0.8}
      metalness={0.05}
    />
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[dims.bodyLength, dims.bodyHeight, dims.bodyWidth]} />
        {bodyMaterial}
      </mesh>

      {/* Roof / cabin */}
      <mesh position={[0, 0.18 + dims.bodyHeight / 2 + dims.roofHeight / 2, 0]} castShadow>
        <boxGeometry args={[dims.roofLength, dims.roofHeight, dims.bodyWidth * 0.85]} />
        {bodyMaterial}
      </mesh>

      {/* Windshield */}
      <mesh
        position={[dims.roofLength / 2 + 0.05, 0.18 + dims.bodyHeight / 2 + dims.roofHeight * 0.4, 0]}
        rotation={[0, 0, -Math.PI / 6]}
        castShadow
      >
        <boxGeometry args={[0.04, dims.roofHeight * 0.9, dims.bodyWidth * 0.82]} />
        {glassMaterial}
      </mesh>

      {/* Rear window */}
      <mesh
        position={[-dims.roofLength / 2 - 0.05, 0.18 + dims.bodyHeight / 2 + dims.roofHeight * 0.4, 0]}
        rotation={[0, 0, Math.PI / 6]}
        castShadow
      >
        <boxGeometry args={[0.04, dims.roofHeight * 0.9, dims.bodyWidth * 0.82]} />
        {glassMaterial}
      </mesh>

      {/* Side windows */}
      <mesh position={[0, 0.18 + dims.bodyHeight / 2 + dims.roofHeight * 0.5, dims.bodyWidth * 0.43]}>
        <boxGeometry args={[dims.roofLength * 0.85, dims.roofHeight * 0.7, 0.02]} />
        {glassMaterial}
      </mesh>
      <mesh position={[0, 0.18 + dims.bodyHeight / 2 + dims.roofHeight * 0.5, -dims.bodyWidth * 0.43]}>
        <boxGeometry args={[dims.roofLength * 0.85, dims.roofHeight * 0.7, 0.02]} />
        {glassMaterial}
      </mesh>

      {/* Interior visible through glass */}
      <mesh position={[0, 0.18 + dims.bodyHeight / 2 + dims.roofHeight * 0.3, 0]}>
        <boxGeometry args={[dims.roofLength * 0.8, dims.roofHeight * 0.5, dims.bodyWidth * 0.7]} />
        {interiorMat}
      </mesh>

      {/* Front bumper */}
      <mesh position={[dims.bodyLength / 2 + 0.06, 0.10, 0]} castShadow>
        <boxGeometry args={[0.12, 0.22, dims.bodyWidth * 0.9]} />
        {bodyMaterial}
      </mesh>

      {/* Rear bumper */}
      <mesh position={[-dims.bodyLength / 2 - 0.06, 0.10, 0]} castShadow>
        <boxGeometry args={[0.12, 0.22, dims.bodyWidth * 0.9]} />
        {bodyMaterial}
      </mesh>

      {/* Headlights */}
      <mesh position={[dims.bodyLength / 2 + 0.01, 0.20, dims.bodyWidth * 0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffaa" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[dims.bodyLength / 2 + 0.01, 0.20, -dims.bodyWidth * 0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffaa" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-dims.bodyLength / 2 - 0.01, 0.20, dims.bodyWidth * 0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff0000" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <mesh position={[-dims.bodyLength / 2 - 0.01, 0.20, -dims.bodyWidth * 0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff0000" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      <WheelMesh position={[dims.bodyLength * 0.35, 0, dims.bodyWidth * 0.52]} wheelStyle={wheelStyle} />
      <WheelMesh position={[dims.bodyLength * 0.35, 0, -dims.bodyWidth * 0.52]} wheelStyle={wheelStyle} />
      <WheelMesh position={[-dims.bodyLength * 0.35, 0, dims.bodyWidth * 0.52]} wheelStyle={wheelStyle} />
      <WheelMesh position={[-dims.bodyLength * 0.35, 0, -dims.bodyWidth * 0.52]} wheelStyle={wheelStyle} />

      {/* Exhaust pipes */}
      <mesh position={[-dims.bodyLength / 2 - 0.08, 0.06, dims.bodyWidth * 0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-dims.bodyLength / 2 - 0.08, 0.06, -dims.bodyWidth * 0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ model, bodyColor, wheelStyle, interiorColor }: CarModelProps) {
  return (
    <>
      {/* Ambient light - very dim for showroom feel */}
      <ambientLight intensity={0.3} color="#334455" />

      {/* Main spotlight from above-front */}
      <spotLight
        position={[3, 5, 3]}
        angle={0.35}
        penumbra={0.6}
        intensity={80}
        color="#fff8e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Fill light from side */}
      <spotLight
        position={[-4, 3, -2]}
        angle={0.4}
        penumbra={0.8}
        intensity={30}
        color="#aabbcc"
        castShadow={false}
      />

      {/* Rim light from behind */}
      <pointLight position={[-2, 2, -3]} intensity={15} color="#ffcc44" />

      {/* Ground reflection light */}
      <pointLight position={[0, -0.5, 0]} intensity={5} color="#334466" />

      {/* Car model */}
      <Suspense fallback={null}>
        <CarModel
          model={model}
          bodyColor={bodyColor}
          wheelStyle={wheelStyle}
          interiorColor={interiorColor}
        />
      </Suspense>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Reflective floor lines */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.135, 0]}>
          <planeGeometry args={[0.02, 20]} />
          <meshStandardMaterial color="#ffcc44" emissive="#ffcc44" emissiveIntensity={0.3} transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Contact shadow */}
      <ContactShadows
        position={[0, -0.13, 0]}
        opacity={0.8}
        scale={6}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Environment for reflections */}
      <Environment preset="warehouse" />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
        makeDefault
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CarPreview3D({ model, bodyColor, wheelStyle, interiorColor }: CarPreview3DProps) {
  return (
    <div className="w-full h-full relative">
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs text-white/50">
          <RotateIcon />
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [3.5, 1.8, 3.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: '#080a0e' }}
      >
        <Scene
          model={model}
          bodyColor={bodyColor}
          wheelStyle={wheelStyle}
          interiorColor={interiorColor}
        />
      </Canvas>
    </div>
  );
}

function RotateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
  );
}
