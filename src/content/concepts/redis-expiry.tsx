import { useEffect, useState } from "react";
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

type Policy = "noeviction" | "allkeys-lru" | "allkeys-lfu" | "volatile-ttl";

export default function RedisExpiry() {
  const concept = conceptBySlug["redis-expiry"]!;
  const { play, ping } = useAudio();
  const [ttl, setTtl] = useState(8);
  const [remaining, setRemaining] = useState(8);
  const [policy, setPolicy] = useState<Policy>("allkeys-lru");

  useEffect(() => {
    setRemaining(ttl);
  }, [ttl]);
  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining]);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Each key can carry a TTL. When it elapses, Redis evicts the key lazily on access or
            actively via the background sampler. Separately, when memory is full, an eviction
            policy decides which key to drop next.
          </p>
          <Bullets
            items={[
              { heading: "EXPIRE / PEXPIRE", body: "Seconds and milliseconds. TTL ↔ persists until set or PERSIST is called." },
              { heading: "Eviction policies", body: "noeviction (fail writes), allkeys-lru/lfu (any key), volatile-* (only those with TTL)." },
              { heading: "Sampling", body: "Redis approximates LRU/LFU by sampling N keys. Increase maxmemory-samples for accuracy." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="One key, TTL countdown" height={260}>
          <svg viewBox="0 0 720 240" className="h-full w-full">
            <g transform="translate(60,60)">
              <rect width={600} height={80} rx={12} fill="#11141b" stroke="rgba(255,106,106,0.4)" />
              <rect
                width={600 * (remaining / Math.max(1, ttl))}
                height={80}
                rx={12}
                fill="var(--concept-soft)"
                style={{ transition: "width 0.9s linear" }}
              />
              <text x={20} y={30} fontSize="12" fill="#cfd4df" fontFamily="JetBrains Mono">
                SET session:abc "..."  EX {ttl}
              </text>
              <text x={20} y={56} fontSize="11" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                eviction policy: {policy}
              </text>
              <text x={580} y={56} fontSize="11" textAnchor="end" fill="var(--concept)" fontFamily="JetBrains Mono">
                {remaining}s
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label="TTL seconds"
            min={2}
            max={20}
            step={1}
            value={ttl}
            onValueChange={(v) => {
              setTtl(Math.round(v));
              void ping("bell", "A4");
            }}
            className="w-48"
          />
          <ActionButton
            label="reset"
            onAction={() => {
              setRemaining(ttl);
              void ping("bell", "C5");
            }}
          />
          {(["noeviction", "allkeys-lru", "allkeys-lfu", "volatile-ttl"] as const).map((p) => (
            <ActionButton
              key={p}
              label={p}
              primary={policy === p}
              onAction={() => {
                setPolicy(p);
                void ping("bell", "E4");
              }}
            />
          ))}
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="remaining" value={remaining} hint="seconds" />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# Per-key TTL
SET session:abc "..." EX 600
TTL session:abc
PERSIST session:abc      # remove TTL

# Memory pressure policy (redis.conf)
maxmemory 4gb
maxmemory-policy allkeys-lru
maxmemory-samples 10`}
        />
      }
    />
  );
}
