import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars, Line } from "@react-three/drei";
import type { Group, Mesh } from "three";

export interface ClusterNode {
  readonly id: string;
  readonly label: string;
  readonly role: "leader" | "follower" | "client" | "down";
}

interface ClusterScene3DProps {
  nodes: ReadonlyArray<ClusterNode>;
  family: "kafka" | "redis" | "pattern";
  /** ids of nodes that pulse / are active right now */
  active: ReadonlyArray<string>;
}

const accent = { kafka: "#ffb454", redis: "#ff6a6a", pattern: "#5be6ee" };
const roleColor: Record<ClusterNode["role"], string> = {
  leader: "#5be6ee",
  follower: "#9aa3b5",
  client: "#ff6a6a",
  down: "#3a4252",
};

export function ClusterScene3D({ nodes, family, active }: ClusterScene3DProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 2.6, 8], fov: 50 }}>
      <color attach="background" args={["#06070a"]} />
      <Stars radius={60} depth={40} count={1400} factor={4} fade speed={0.4} />
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 8, 6]} intensity={1.3} color={accent[family]} />
      <pointLight position={[-6, -2, -4]} intensity={0.55} color="#5be6ee" />
      <ClusterBody nodes={nodes} family={family} active={active} />
      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  );
}

function ClusterBody({ nodes, family, active }: ClusterScene3DProps) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  const positions = useMemo(() => {
    const n = nodes.length;
    return nodes.map((node, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = node.role === "client" ? 4 : 2.2;
      const y = node.role === "leader" ? 0.4 : node.role === "client" ? -0.4 : 0;
      return { node, x: Math.cos(a) * r, z: Math.sin(a) * r, y };
    });
  }, [nodes]);

  const leaderToFollowerLines = useMemo(() => {
    const leader = positions.find((p) => p.node.role === "leader");
    if (!leader) return [];
    return positions
      .filter((p) => p.node.role === "follower" || p.node.role === "down")
      .map((p) => ({
        a: [leader.x, leader.y, leader.z] as [number, number, number],
        b: [p.x, p.y, p.z] as [number, number, number],
        dim: p.node.role === "down",
      }));
  }, [positions]);

  const clientLines = useMemo(() => {
    const leader = positions.find((p) => p.node.role === "leader");
    if (!leader) return [];
    return positions
      .filter((p) => p.node.role === "client")
      .map((p) => ({
        a: [p.x, p.y, p.z] as [number, number, number],
        b: [leader.x, leader.y, leader.z] as [number, number, number],
      }));
  }, [positions]);

  return (
    <group ref={group}>
      {leaderToFollowerLines.map((ln, i) => (
        <Line
          key={`lf-${i}`}
          points={[ln.a, ln.b]}
          color={ln.dim ? "#272e3c" : "#9aa3b5"}
          opacity={ln.dim ? 0.4 : 0.6}
          transparent
          lineWidth={1}
          dashed={false}
        />
      ))}
      {clientLines.map((ln, i) => (
        <Line
          key={`cl-${i}`}
          points={[ln.a, ln.b]}
          color={accent[family]}
          opacity={0.7}
          transparent
          lineWidth={1.2}
          dashed
          dashSize={0.15}
          gapSize={0.12}
        />
      ))}
      {positions.map((p) => (
        <Node key={p.node.id} pos={p} active={active.includes(p.node.id)} accent={accent[family]} />
      ))}
    </group>
  );
}

function Node({
  pos,
  active,
  accent: a,
}: {
  pos: { node: ClusterNode; x: number; y: number; z: number };
  active: boolean;
  accent: string;
}) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const scale = active ? 1 + Math.sin(t * 5) * 0.07 : 1;
    mesh.current.scale.setScalar(scale);
  });
  const c = roleColor[pos.node.role];
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={c}
          emissive={active ? a : c}
          emissiveIntensity={active ? 0.8 : 0.15}
          metalness={0.3}
          roughness={0.4}
          wireframe={pos.node.role === "down"}
        />
      </mesh>
      <Html position={[0, 0.95, 0]} center distanceFactor={9} sprite transform>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: active ? a : "rgba(207,212,223,0.8)",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
          }}
        >
          {pos.node.label}
        </span>
      </Html>
    </group>
  );
}
