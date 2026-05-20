import { useMemo, useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
  SandboxSlider,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";

const TOTAL_SLOTS = 16384;

function slotOf(key: string): number {
  // Demo-only string hash, not real CRC16. Redis uses CRC16(key) mod 16384.
  // We use a stable polynomial hash here just to get a believable slot id for the UI.
  let h = 0xcafe;
  for (let i = 0; i < key.length; i += 1) {
    h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % TOTAL_SLOTS;
}

export default function RedisCluster() {
  const concept = conceptBySlug["redis-cluster"]!;
  const { play, ping } = useAudio();
  const [shards, setShards] = useState(4);
  const [keyName, setKeyName] = useState("user:42");

  const ranges = useMemo(() => {
    const per = Math.floor(TOTAL_SLOTS / shards);
    return Array.from({ length: shards }).map((_, i) => ({
      shard: i,
      from: i * per,
      to: i === shards - 1 ? TOTAL_SLOTS - 1 : (i + 1) * per - 1,
    }));
  }, [shards]);

  const slot = slotOf(keyName);
  const owner = ranges.findIndex((r) => slot >= r.from && slot <= r.to);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Redis Cluster sharding is fixed: every key hashes to one of 16,384 slots, and slots are
            assigned to shards. The client routes directly. Cross-slot operations require hashtags:
            wrap part of the key in <span className="font-mono">{"{}"}</span> to force two keys onto
            the same slot.
          </p>
          <Bullets
            items={[
              { heading: "Hash slots", body: "CRC16(key) mod 16384. Same slot → guaranteed same shard." },
              { heading: "MOVED / ASK", body: "Server tells the client the new slot owner. Smart clients update their slot map." },
              { heading: "Resharding", body: "Migrate slots live with CLUSTER SETSLOT MIGRATING/IMPORTING + MIGRATE; clients follow ASK redirects." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="16,384 slots split across shards" height={320}>
          <svg viewBox="0 0 720 240" className="h-full w-full">
            <g transform="translate(40,60)">
              {ranges.map((r) => {
                const width = (640 * (r.to - r.from + 1)) / TOTAL_SLOTS;
                const x = (640 * r.from) / TOTAL_SLOTS;
                const isOwner = r.shard === owner;
                return (
                  <g key={r.shard} transform={`translate(${x},0)`}>
                    <rect
                      width={width - 2}
                      height={48}
                      rx={6}
                      fill={isOwner ? "var(--concept-soft)" : "#11141b"}
                      stroke={isOwner ? "var(--concept)" : "rgba(255,255,255,0.08)"}
                    />
                    <text x={6} y={18} fontSize="11" fill="#cfd4df" fontFamily="JetBrains Mono">
                      shard {r.shard}
                    </text>
                    <text x={6} y={36} fontSize="10" fill="rgba(207,212,223,0.6)" fontFamily="JetBrains Mono">
                      slots {r.from}…{r.to}
                    </text>
                  </g>
                );
              })}
              <g transform={`translate(${(640 * slot) / TOTAL_SLOTS}, 60)`}>
                <line x1={0} y1={-10} x2={0} y2={32} stroke="var(--concept)" strokeWidth={1.4} />
                <text fontSize="10" fill="var(--concept)" fontFamily="JetBrains Mono">
                  {keyName} → slot {slot}
                </text>
              </g>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label="shards"
            min={2}
            max={12}
            step={1}
            value={shards}
            onValueChange={(v) => setShards(Math.round(v))}
            className="w-44"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-300">key</span>
            <input
              value={keyName}
              onChange={(e) => {
                setKeyName(e.target.value);
                void ping("pad", "C4");
              }}
              className="h-7 w-48 rounded-md border border-white/10 bg-white/[0.04] px-2 font-mono text-xs text-ink-100"
              aria-label="redis key"
            />
          </div>
          <ActionButton
            label="hashtag"
            onAction={() => {
              setKeyName((k) => (k.startsWith("{") ? k : `{user}:${k}`));
              void ping("pad", "G4");
            }}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="slot" value={slot} hint={`shard ${owner}`} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# create a 3-master 3-replica cluster
redis-cli --cluster create \\
  10.0.0.1:6379 10.0.0.2:6379 10.0.0.3:6379 \\
  10.0.0.4:6379 10.0.0.5:6379 10.0.0.6:6379 \\
  --cluster-replicas 1

# hashtags force keys onto the same slot
SET {user:42}:profile "..."
SET {user:42}:cart    "..."`}
        />
      }
    />
  );
}
