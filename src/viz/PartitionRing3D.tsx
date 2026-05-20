import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import type { Group } from "three";

interface PartitionRing3DProps {
  partitions: number;
  activePartition: number;
  family: "kafka" | "redis" | "pattern";
  spinning?: boolean;
  labels?: ReadonlyArray<string>;
}

const accent = {
  kafka: "#ffb454",
  redis: "#ff6a6a",
  pattern: "#5be6ee",
};
const deep = {
  kafka: "#c96b0a",
  redis: "#b8201f",
  pattern: "#0d8a93",
};

export function PartitionRing3D({
  partitions,
  activePartition,
  family,
  spinning = true,
  labels,
}: PartitionRing3DProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 3.2, 7], fov: 50 }}>
      <color attach="background" args={["#06070a"]} />
      <Stars radius={40} depth={40} count={1200} factor={3} fade speed={0.6} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 8, 6]} intensity={1.2} color={accent[family]} />
      <pointLight position={[-6, -2, -4]} intensity={0.5} color={deep[family]} />
      <Ring
        partitions={partitions}
        activePartition={activePartition}
        family={family}
        spinning={spinning}
        labels={labels}
      />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

function Ring({
  partitions,
  activePartition,
  family,
  spinning,
  labels,
}: PartitionRing3DProps) {
  const group = useRef<Group>(null);
  const radius = 3;

  useFrame((_, delta) => {
    if (!group.current) return;
    if (spinning) group.current.rotation.y += delta * 0.18;
  });

  const items = useMemo(() => {
    const arr = new Array<{ angle: number; label: string }>(partitions);
    for (let i = 0; i < partitions; i += 1) {
      arr[i] = {
        angle: (i / partitions) * Math.PI * 2,
        label: labels?.[i] ?? `P${i}`,
      };
    }
    return arr;
  }, [partitions, labels]);

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.04, 16, 200]} />
        <meshStandardMaterial color={deep[family]} emissive={deep[family]} emissiveIntensity={0.4} />
      </mesh>
      {items.map((it, i) => {
        const x = Math.cos(it.angle) * radius;
        const z = Math.sin(it.angle) * radius;
        const active = i === activePartition;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <boxGeometry args={[0.7, active ? 0.9 : 0.45, 0.7]} />
              <meshStandardMaterial
                color={active ? accent[family] : "#1a1f29"}
                emissive={active ? accent[family] : "#000"}
                emissiveIntensity={active ? 0.7 : 0}
                metalness={0.2}
                roughness={0.5}
              />
            </mesh>
            <Html
              position={[0, active ? 1.2 : 0.6, 0]}
              center
              distanceFactor={9}
              transform
              sprite
              style={{ pointerEvents: "none" }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: active ? accent[family] : "rgba(207,212,223,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                {it.label}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
