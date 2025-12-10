import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/stores/useGameStore";

interface ParticleSystemProps {
  count?: number;
  color?: string;
  position?: [number, number, number];
  active?: boolean;
  type?: "burst" | "continuous" | "sparkle";
}

export function ParticleSystem({
  count = 50,
  color = "#ffd700",
  position = [0, 0, 0],
  active = false,
  type = "burst",
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const lifetimesRef = useRef<Float32Array | null>(null);

  const { positions, velocities, lifetimes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 3;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.cos(phi) * speed + 2;
      vel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      life[i] = Math.random();
    }

    velocitiesRef.current = vel;
    lifetimesRef.current = life;

    return { positions: pos, velocities: vel, lifetimes: life };
  }, [count, position]);

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return;

    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const velArray = velocitiesRef.current!;
    const lifeArray = lifetimesRef.current!;

    for (let i = 0; i < count; i++) {
      lifeArray[i] -= delta * 0.5;

      if (lifeArray[i] > 0) {
        posArray[i * 3] += velArray[i * 3] * delta;
        posArray[i * 3 + 1] += velArray[i * 3 + 1] * delta;
        posArray[i * 3 + 2] += velArray[i * 3 + 2] * delta;
        velArray[i * 3 + 1] -= 9.8 * delta;
      }
    }

    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export function CoinCollectEffect({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <ParticleSystem
      count={30}
      color="#ffd700"
      position={position}
      active={active}
      type="burst"
    />
  );
}

export function CorrectAnswerEffect({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <ParticleSystem
      count={40}
      color="#22c55e"
      position={position}
      active={active}
      type="burst"
    />
  );
}

export function WrongAnswerEffect({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <ParticleSystem
      count={20}
      color="#ef4444"
      position={position}
      active={active}
      type="burst"
    />
  );
}

export function SparkleEffect({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Points>(null);
  const time = useRef(0);

  const { positions, colors } = useMemo(() => {
    const count = 20;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.random() * 0.5;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      col[i * 3] = 1;
      col[i * 3 + 1] = 0.84 + Math.random() * 0.16;
      col[i * 3 + 2] = 0;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < 20; i++) {
      posArray[i * 3 + 1] = Math.sin(time.current * 2 + i) * 0.3 + 0.5;
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={20}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={20}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

export function ScreenShakeController({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenShake = useGameStore((state) => state.screenShake);

  useFrame(() => {
    if (!groupRef.current) return;

    if (screenShake > 0) {
      groupRef.current.position.x = (Math.random() - 0.5) * screenShake * 0.1;
      groupRef.current.position.y = (Math.random() - 0.5) * screenShake * 0.1;
    } else {
      groupRef.current.position.x = 0;
      groupRef.current.position.y = 0;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export function HitFlashOverlay() {
  const hitFlash = useGameStore((state) => state.hitFlash);

  if (!hitFlash) return null;

  return (
    <mesh position={[0, 0, 5]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </mesh>
  );
}
