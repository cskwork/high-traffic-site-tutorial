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

export default function PatternOutbox() {
  const t = useT();
  const concept = conceptBySlug["pattern-outbox"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [emitted, setEmitted] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            {t({
              en: "The dual-write problem: write to the DB and publish to Kafka, both with their own failure modes. The outbox pattern collapses them: write the business row + an outbox row in the same DB transaction; a relay (or Debezium CDC) tails the outbox and publishes to Kafka.",
              ko: "이중 쓰기 문제: DB에 쓰는 것과 카프카에 발행하는 것은 각각 독립적인 실패 모드를 가집니다. 아웃박스 패턴은 이를 하나로 합칩니다. 비즈니스 행과 아웃박스 행을 같은 DB 트랜잭션에 쓰고, 릴레이(또는 Debezium CDC)가 아웃박스를 읽어 카프카에 발행합니다.",
            })}
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "One transaction", ko: "하나의 트랜잭션" }),
                body: t({
                  en: "Either both rows commit or neither. No more 'paid but no event'.",
                  ko: "두 행이 함께 커밋되거나 둘 다 롤백됩니다. '결제는 됐는데 이벤트가 없는' 상황이 사라집니다.",
                }),
              },
              {
                heading: t({ en: "Relay options", ko: "릴레이 선택지" }),
                body: t({
                  en: "Polling worker on the outbox table, or CDC (Debezium) on the WAL/binlog. Both deliver at-least-once.",
                  ko: "아웃박스 테이블을 폴링하는 워커 또는 WAL/binlog의 CDC(Debezium). 둘 다 최소 한 번 전달을 보장합니다.",
                }),
              },
              {
                heading: t({ en: "Idempotent consumers", ko: "멱등성 컨슈머" }),
                body: t({
                  en: "Use the outbox row's UUID as the Kafka key; downstream dedupes by it.",
                  ko: "아웃박스 행의 UUID를 카프카 키로 사용하세요. 다운스트림은 이를 기준으로 중복을 제거합니다.",
                }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Business write + outbox write — one txn — relay", ko: "비즈니스 쓰기 + 아웃박스 쓰기 — 하나의 트랜잭션 — 릴레이" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["F3", "A3", "C4", "F4"];
              const note = notes[edge] ?? "C4";
              void ping("bell", note);
              if (edge === 2) setEmitted((n) => n + 1);
            }}
            nodes={[
              { id: "a", label: "service", sub: "txn", kind: "producer", x: 0.08, y: 0.5 },
              { id: "db", label: "orders + outbox", sub: "1 commit", kind: "store", x: 0.4, y: 0.5 },
              { id: "rel", label: "relay / CDC", sub: "tail", kind: "queue", x: 0.68, y: 0.5 },
              { id: "k", label: "orders.events", sub: "kafka", kind: "broker", x: 0.94, y: 0.5 },
            ]}
            edges={[
              { from: "a", to: "db", label: "INSERT order" },
              { from: "a", to: "db", label: "INSERT outbox" },
              { from: "db", to: "rel", label: "tail" },
              { from: "rel", to: "k", label: "publish" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "relay", ko: "릴레이" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "events emitted", ko: "발행된 이벤트" })}
            value={emitted}
            hint={t({ en: "at-least-once", ko: "최소 한 번" })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="sql"
          code={`-- one transaction does both writes
BEGIN;
  INSERT INTO orders(id, user_id, total)
       VALUES ($1, $2, $3);
  INSERT INTO outbox(id, aggregate, payload, created_at)
       VALUES (gen_random_uuid(), 'order', $4::jsonb, now());
COMMIT;

-- relay loop (worker, every 200ms)
SELECT id, payload FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 100;
-- publish to Kafka, then:
UPDATE outbox SET published_at = now() WHERE id = ANY($1);`}
        />
      }
    />
  );
}
