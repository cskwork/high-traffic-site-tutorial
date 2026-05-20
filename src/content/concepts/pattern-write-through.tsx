import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { MessageFlow } from "@/viz/MessageFlow";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { useT } from "@/i18n/T";

export default function PatternWriteThrough() {
  const t = useT();
  const concept = conceptBySlug["pattern-write-through"]!;
  const { play, ping } = useAudio();
  const [mode, setMode] = useState<"write-through" | "write-behind">("write-through");

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            {t({
              en: "Write-through writes the cache synchronously, then the DB. Read-after-write is consistent. Write-behind batches DB writes for throughput at the cost of durability during crashes. Pick by whether 'lost the last batch' is acceptable.",
              ko: "라이트 스루는 캐시에 먼저 동기적으로 쓰고, 그 다음 DB에 씁니다. 쓰기 후 읽기가 일관됩니다. 라이트 비하인드는 처리량을 위해 DB 쓰기를 배치로 묶지만, 충돌 시 내구성이 떨어집니다. '마지막 배치가 사라져도 괜찮은가'를 기준으로 선택하세요.",
            })}
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Write-through", ko: "라이트 스루" }),
                body: t({
                  en: "Cache holds the source of truth temporarily; same transaction propagates to DB. Reads are always cache-consistent.",
                  ko: "캐시가 일시적으로 진실의 원천을 보관하며, 동일 트랜잭션이 DB에도 전파됩니다. 읽기는 항상 캐시와 일관됩니다.",
                }),
              },
              {
                heading: t({ en: "Write-behind", ko: "라이트 비하인드" }),
                body: t({
                  en: "Cache acks fast, a worker flushes to DB. Add a Kafka outbox if you can't lose pending writes.",
                  ko: "캐시가 빠르게 응답하고, 워커가 나중에 DB에 플러시합니다. 대기 중인 쓰기를 잃으면 안 된다면 카프카 아웃박스를 추가하세요.",
                }),
              },
              {
                heading: t({ en: "Hot keys", ko: "핫 키" }),
                body: t({
                  en: "Both patterns put writes on the cache; size and shard accordingly.",
                  ko: "두 패턴 모두 쓰기를 캐시에 집중시킵니다. 그에 맞게 용량을 산정하고 샤딩하세요.",
                }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Where does the write commit?", ko: "쓰기는 어디에서 커밋되나요?" })} height={320}>
          <MessageFlow
            running
            beats={mode === "write-through" ? [0, 1] : [0, 2]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["E4", "A4", "C5"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
            }}
            nodes={[
              { id: "a", label: "app", sub: "service", kind: "producer", x: 0.08, y: 0.5 },
              { id: "c", label: "redis", sub: "cache", kind: "broker", x: 0.45, y: 0.5 },
              { id: "d", label: "db", sub: "primary", kind: "store", x: 0.85, y: 0.5 },
            ]}
            edges={[
              { from: "a", to: "c", label: "write" },
              { from: "c", to: "d", label: mode === "write-through" ? "sync flush" : "" },
              { from: "c", to: "d", label: mode === "write-behind" ? "async batch" : "" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["write-through", "write-behind"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("pad", m === "write-through" ? "E4" : "A4");
              }}
            />
          ))}
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "durability", ko: "내구성" })}
            value={mode === "write-through" ? 2 : 1}
            hint={mode === "write-through"
              ? t({ en: "DB + cache", ko: "DB + 캐시" })
              : t({ en: "cache only (until flush)", ko: "캐시만 (플러시 전까지)" })
            }
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="ts"
          code={`async function setUser(u: User) {
  // write-through
  await redis.set(\`user:\${u.id}\`, JSON.stringify(u));
  await db.update("users", u);
}

async function setUserWriteBehind(u: User) {
  await redis.set(\`user:\${u.id}\`, JSON.stringify(u));
  await redis.xadd("dirty:users", "*", "id", u.id);   // worker drains
}`}
        />
      }
    />
  );
}
