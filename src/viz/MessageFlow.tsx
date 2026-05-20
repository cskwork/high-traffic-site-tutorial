import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTick } from "@/viz/useTick";
import { cx } from "@/lib/cx";

export interface FlowNode {
  readonly id: string;
  readonly label: string;
  readonly sub?: string;
  /** 0..1 x position */
  readonly x: number;
  /** 0..1 y position */
  readonly y: number;
  readonly kind: "producer" | "broker" | "consumer" | "store" | "queue";
}

export interface FlowEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
}

interface MessageFlowProps {
  nodes: ReadonlyArray<FlowNode>;
  edges: ReadonlyArray<FlowEdge>;
  /** Sequence of edge indices that messages travel each tick */
  beats: ReadonlyArray<number>;
  running: boolean;
  /** Optional callback when a beat fires, used to trigger audio */
  onBeat?: (beatIndex: number, edgeIndex: number) => void;
  intervalMs?: number;
  className?: string;
  width?: number;
  height?: number;
}

const nodeStyles: Record<FlowNode["kind"], { fill: string; ring: string; label: string }> = {
  producer: { fill: "#1a1f29", ring: "var(--concept)", label: "Producer" },
  broker: { fill: "#0b0d12", ring: "var(--concept)", label: "Broker" },
  consumer: { fill: "#1a1f29", ring: "var(--concept)", label: "Consumer" },
  store: { fill: "#11141b", ring: "#9aa3b5", label: "Store" },
  queue: { fill: "#11141b", ring: "var(--concept)", label: "Queue" },
};

export function MessageFlow({
  nodes,
  edges,
  beats,
  running,
  onBeat,
  intervalMs = 900,
  className,
  width = 720,
  height = 360,
}: MessageFlowProps) {
  const tick = useTick({
    running,
    intervalMs,
    onTick: (n) => {
      const beatIdx = (n - 1) % beats.length;
      const edgeIdx = beats[beatIdx]!;
      onBeat?.(beatIdx, edgeIdx);
    },
  });

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => map.set(n.id, { x: n.x * width, y: n.y * height }));
    return map;
  }, [nodes, width, height]);

  const activeEdgeIdx = beats[((tick - 1) % beats.length + beats.length) % beats.length];
  const activeEdge = edges[activeEdgeIdx ?? 0];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className={cx("h-full w-full", className)}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.45)" />
        </marker>
      </defs>

      {edges.map((edge, i) => {
        const a = positions.get(edge.from);
        const b = positions.get(edge.to);
        if (!a || !b) return null;
        const isActive = edge === activeEdge;
        return (
          <g key={`${edge.from}-${edge.to}-${i}`} opacity={isActive ? 1 : 0.55}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isActive ? "var(--concept)" : "rgba(255,255,255,0.18)"}
              strokeWidth={isActive ? 1.6 : 1}
              strokeDasharray={isActive ? undefined : "4 6"}
              markerEnd="url(#arrow)"
            />
            {edge.label ? (
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 6}
                fontSize="10"
                fill="rgba(207,212,223,0.7)"
                textAnchor="middle"
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {edges.map((edge, i) => {
        const a = positions.get(edge.from);
        const b = positions.get(edge.to);
        if (!a || !b) return null;
        if (i !== activeEdgeIdx) return null;
        return (
          <motion.circle
            key={`packet-${tick}-${i}`}
            r={5.5}
            fill="var(--concept)"
            initial={{ cx: a.x, cy: a.y, opacity: 0.2 }}
            animate={{ cx: b.x, cy: b.y, opacity: 1 }}
            transition={{ duration: intervalMs / 1000, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px var(--concept))" }}
          />
        );
      })}

      {nodes.map((n) => {
        const p = positions.get(n.id)!;
        const s = nodeStyles[n.kind];
        return (
          <g key={n.id} transform={`translate(${p.x},${p.y})`}>
            <circle
              r={26}
              fill={s.fill}
              stroke={s.ring as string}
              strokeWidth={1.4}
              style={{ filter: "drop-shadow(0 0 18px rgba(0,0,0,0.5))" }}
            />
            <text
              y={-2}
              fontSize="10"
              textAnchor="middle"
              fill="rgba(207,212,223,0.6)"
              style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
            >
              {s.label}
            </text>
            <text y={12} fontSize="12" textAnchor="middle" fill="#eef0f4">
              {n.label}
            </text>
            {n.sub ? (
              <text y={42} fontSize="10" textAnchor="middle" fill="rgba(154,163,181,0.8)">
                {n.sub}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
