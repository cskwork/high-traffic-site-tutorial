import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { MessageFlow } from "@/viz/MessageFlow";
import {
  SandboxControls,
  Toggle,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { useT } from "@/i18n/T";

export default function PatternEventSourcing() {
  const t = useT();
  const concept = conceptBySlug["pattern-event-sourcing"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [events, setEvents] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            {t({
              en: "Don't store the current state — store every change as an immutable event in a Kafka topic. Materialized views (in Redis or a DB) project the log into shapes optimized for reads. CQRS separates the read side from the write side so each scales on its own axis.",
              ko: "현재 상태를 저장하지 말고, 모든 변경을 카프카 토픽에 불변 이벤트로 저장하세요. 머터리얼라이즈드 뷰(레디스 또는 DB)는 로그를 읽기에 최적화된 형태로 투영합니다. CQRS는 읽기 측과 쓰기 측을 분리해 각자 독립적으로 확장할 수 있게 합니다.",
            })}
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Truth = log", ko: "진실 = 로그" }),
                body: t({
                  en: "The Kafka topic is the source of truth. Views are derived and disposable; you can always rebuild them by replay.",
                  ko: "카프카 토픽이 진실의 원천입니다. 뷰는 파생된 것으로 언제든 재생으로 재구축할 수 있습니다.",
                }),
              },
              {
                heading: t({ en: "Read models", ko: "읽기 모델" }),
                body: t({
                  en: "One per query: a Redis Hash for hot lookups, a Postgres table for joins, an OpenSearch index for full-text.",
                  ko: "쿼리당 하나씩: 빠른 조회에는 레디스 해시, 조인에는 Postgres 테이블, 전문 검색에는 OpenSearch 인덱스.",
                }),
              },
              {
                heading: t({ en: "Schema evolution", ko: "스키마 진화" }),
                body: t({
                  en: "Use Schema Registry + backward-compatible additions; versioned events let old consumers keep working.",
                  ko: "Schema Registry와 하위 호환 추가를 사용하세요. 버전이 있는 이벤트는 기존 컨슈머가 계속 동작하게 합니다.",
                }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Command → Event log → Many read models", ko: "커맨드 → 이벤트 로그 → 다수의 읽기 모델" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3, 4]}
            intervalMs={760}
            onBeat={(_, edge) => {
              const notes = ["C4", "E4", "G4", "B4", "D5", "F5"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
              if (edge === 1) setEvents((n) => n + 1);
            }}
            nodes={[
              { id: "cmd", label: "POST /order", sub: "command", kind: "producer", x: 0.06, y: 0.5 },
              { id: "agg", label: "aggregate", sub: "decision", kind: "queue", x: 0.28, y: 0.5 },
              { id: "log", label: "orders.events", sub: "kafka log", kind: "broker", x: 0.55, y: 0.5 },
              { id: "h", label: "orders:hash", sub: "redis view", kind: "store", x: 0.85, y: 0.25 },
              { id: "pg", label: "orders_view", sub: "postgres", kind: "store", x: 0.85, y: 0.75 },
            ]}
            edges={[
              { from: "cmd", to: "agg", label: "validate" },
              { from: "agg", to: "log", label: "emit" },
              { from: "log", to: "h", label: "project" },
              { from: "log", to: "pg", label: "project" },
              { from: "log", to: "agg", label: "replay" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "stream", ko: "스트림" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "events emitted", ko: "발행된 이벤트" })} value={events} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="ts"
          code={`type OrderEvent =
  | { type: "OrderPlaced",  id: string, items: Item[], total: number }
  | { type: "OrderPaid",    id: string, paymentId: string }
  | { type: "OrderShipped", id: string, carrier: string };

async function handle(cmd: PlaceOrder) {
  const ok = validate(cmd);
  if (!ok) throw new BadRequest();
  await kafka.produce("orders.events", cmd.id, { type: "OrderPlaced", ... });
}

// projector
async function project(evt: OrderEvent) {
  if (evt.type === "OrderPlaced") {
    await redis.hset(\`order:\${evt.id}\`, { state: "placed", total: evt.total });
  }
}`}
        />
      }
    />
  );
}
