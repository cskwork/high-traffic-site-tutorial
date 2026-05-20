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
import { T, useT } from "@/i18n/T";

type Policy = "noeviction" | "allkeys-lru" | "allkeys-lfu" | "volatile-ttl";

export default function RedisExpiry() {
  const concept = conceptBySlug["redis-expiry"]!;
  const { play, ping } = useAudio();
  const t = useT();
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
            <T en="Each key can carry a TTL. When it elapses, Redis evicts the key lazily on access or actively via the background sampler. Separately, when memory is full, an eviction policy decides which key to drop next." ko="각 키에는 TTL을 설정할 수 있습니다. TTL이 만료되면 레디스는 접근 시 지연 축출하거나 백그라운드 샘플러를 통해 능동적으로 삭제합니다. 메모리가 가득 찼을 때는 축출 정책이 다음으로 삭제할 키를 결정합니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "EXPIRE / PEXPIRE", ko: "EXPIRE / PEXPIRE" }), body: t({ en: "Seconds and milliseconds. TTL ↔ persists until set or PERSIST is called.", ko: "초 단위와 밀리초 단위로 TTL을 설정합니다. PERSIST를 호출하기 전까지는 TTL이 유지됩니다." }) },
              { heading: t({ en: "Eviction policies", ko: "축출 정책" }), body: t({ en: "noeviction (fail writes), allkeys-lru/lfu (any key), volatile-* (only those with TTL).", ko: "noeviction(쓰기 실패), allkeys-lru/lfu(모든 키), volatile-*(TTL이 있는 키만) 정책을 제공합니다." }) },
              { heading: t({ en: "Sampling", ko: "샘플링" }), body: t({ en: "Redis approximates LRU/LFU by sampling N keys. Increase maxmemory-samples for accuracy.", ko: "레디스는 N개의 키를 샘플링해 LRU/LFU를 근사합니다. 정확도를 높이려면 maxmemory-samples 값을 올리세요." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "One key, TTL countdown", ko: "키 하나, TTL 카운트다운" })} height={260}>
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
            label={t({ en: "TTL seconds", ko: "TTL 초" })}
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
            label={t({ en: "reset", ko: "초기화" })}
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
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "remaining", ko: "남은 시간" })} value={remaining} hint={t({ en: "seconds", ko: "초" })} />
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
