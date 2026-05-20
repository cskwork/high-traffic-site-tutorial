import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";

type Mode = "rdb" | "aof" | "hybrid";

export default function RedisPersistence() {
  const concept = conceptBySlug["redis-persistence"]!;
  const { play, ping } = useAudio();
  const [mode, setMode] = useState<Mode>("hybrid");

  const traits: Record<Mode, { dur: string; size: string; recover: string }> = {
    rdb: { dur: "minutes", size: "small", recover: "fast" },
    aof: { dur: "≤ 1 second (everysec)", size: "large", recover: "slow (replay)" },
    hybrid: { dur: "≤ 1 second", size: "medium", recover: "fast (RDB preamble + AOF tail)" },
  };

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Redis persistence is a trade between compactness, durability, and recovery speed. RDB
            is a periodic snapshot. AOF is a write-ahead log. Hybrid prepends an RDB to the AOF —
            best of both at the cost of more disk.
          </p>
          <Bullets
            items={[
              { heading: "RDB", body: "fork() + dump every N seconds / M changes. Tiny files, perfect for backups, lose up to N seconds of writes." },
              { heading: "AOF", body: "Append commands as they happen. fsync policy (always / everysec / no) trades durability for throughput." },
              { heading: "Hybrid", body: "aof-use-rdb-preamble yes — recovery is fast because most of the file is an RDB snapshot, only the tail is replayed." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="What lands on disk and when" height={280}>
          <svg viewBox="0 0 720 240" className="h-full w-full">
            <g transform="translate(40,40)">
              <rect width={640} height={60} rx={8} fill="#11141b" stroke="rgba(255,255,255,0.06)" />
              <text x={12} y={22} fontSize="11" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                time →
              </text>
              {Array.from({ length: 16 }).map((_, i) => {
                const x = 30 + i * 38;
                const isSnap = mode !== "aof" && i % 6 === 0;
                const isLog = mode !== "rdb";
                return (
                  <g key={i} transform={`translate(${x}, 36)`}>
                    {isLog ? (
                      <rect x={-3} y={-12} width={6} height={24} rx={2} fill="var(--concept-soft)" stroke="var(--concept)" />
                    ) : null}
                    {isSnap ? (
                      <circle r={9} fill="var(--concept)" opacity={0.6} />
                    ) : null}
                  </g>
                );
              })}
              <text x={0} y={110} fontSize="11" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                mode: {mode}  ·  durability {traits[mode].dur}  ·  size {traits[mode].size}  ·  recover {traits[mode].recover}
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["rdb", "aof", "hybrid"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m.toUpperCase()}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("bass", m === "rdb" ? "C3" : m === "aof" ? "G3" : "Eb3");
              }}
            />
          ))}
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="data loss window"
            value={mode === "rdb" ? 60 : mode === "aof" ? 1 : 1}
            hint={mode === "rdb" ? "seconds" : "second"}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="conf"
          code={`# redis.conf — hybrid persistence
save 900 1
save 300 10
save 60 10000

appendonly yes
appendfsync everysec
aof-use-rdb-preamble yes`}
        />
      }
    />
  );
}
