import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshWobbleMaterial, ContactShadows, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

const FoodPlatter = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Plate */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.2}>
        <cylinderGeometry args={[2.5, 2.2, 0.1, 64]} />
        <meshStandardMaterial color="#222" roughness={0.1} metalness={0.5} />
      </mesh>

      {/* Benne Dosa (Simplified Stylized) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation-x={-Math.PI / 2.2} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[1.5, 1.4, 0.05, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.6} />
        </mesh>
        {/* Butter Dollop */}
        <mesh position={[0.2, 0.3, 0.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <MeshWobbleMaterial color="#CC5500" factor={0.4} speed={2} />
        </mesh>
      </Float>

      {/* Idlis */}
      <Float speed={1.5} position={[1, 0.2, 1]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} scale={[1, 0.4, 1]} />
          <meshStandardMaterial color="#FFFFF0" roughness={0.8} />
        </mesh>
      </Float>
      
      <Float speed={1.8} position={[1.4, 0.2, 0.4]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} scale={[1, 0.4, 1]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.8} />
        </mesh>
      </Float>

      {/* Chutney Bowls */}
      <mesh position={[-1.2, 0.1, 1.2]}>
        <cylinderGeometry args={[0.5, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
      </mesh>

      <mesh position={[-1.5, 0.1, 0.2]}>
        <cylinderGeometry args={[0.4, 0.3, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
          <meshStandardMaterial color="#FF5722" />
        </mesh>
      </mesh>
    </group>
  );
};

const Particles = ({ count = 50 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={COLORS.burntOrange} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

const Steam = ({ count = 20, position = [0, 0.5, 0] }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 0.5;
      p[i * 3 + 1] = Math.random() * 2;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Move up
        positions[i * 3 + 1] += 0.01;
        // Reset if too high
        if (positions[i * 3 + 1] > 2) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <points ref={ref} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#fff" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export default function ThreeScene() {
  return (
    <Canvas shadows="percentage" dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[0, 2, 7]} fov={45} />
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.gold} />
      
      <Suspense fallback={null}>
        <FoodPlatter />
        <Steam />
        <Particles />
        <Environment preset="city" />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2.5} far={0.8} />
      </Suspense>
    </Canvas>
  );
}
