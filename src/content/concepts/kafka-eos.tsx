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
import { T, useT } from "@/i18n/T";

export default function KafkaEos() {
  const concept = conceptBySlug["kafka-eos"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [mode, setMode] = useState<"at-most" | "at-least" | "exactly">("exactly");
  const [running, setRunning] = useState(true);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="Exactly-once is two things glued together: an idempotent producer (deduped by PID + sequence number) and a transactional commit that writes the output records and the consumer offsets in one atomic step."
              ko="정확히 한 번 전달은 두 가지를 결합한 것입니다. 멱등 프로듀서(PID + 시퀀스 번호로 중복 제거)와 출력 레코드 및 컨슈머 오프셋을 하나의 원자적 단계로 기록하는 트랜잭션 커밋입니다."
            />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Producer idempotence", ko: "프로듀서 멱등성" }), body: t({ en: "enable.idempotence=true: broker dedupes retries by (PID, partition, seq).", ko: "enable.idempotence=true: 브로커가 (PID, 파티션, seq)로 재시도 중복을 제거합니다." }) },
              { heading: t({ en: "Transactions", ko: "트랜잭션" }), body: t({ en: "beginTransaction → produce → sendOffsetsToTransaction → commit. All-or-nothing.", ko: "beginTransaction → produce → sendOffsetsToTransaction → commit. 모두 처리되거나 아무것도 처리되지 않습니다." }) },
              { heading: t({ en: "Cost", ko: "비용" }), body: t({ en: "Two-phase commit overhead, higher latency, transactional coordinator state. Use where it matters.", ko: "2단계 커밋 오버헤드, 높은 지연, 트랜잭션 코디네이터 상태가 발생합니다. 꼭 필요한 곳에만 사용하세요." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Consume → process → produce + commit (atomic)", ko: "소비 → 처리 → 발행 + 커밋 (원자적)" })} height={300}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={mode === "exactly" ? 950 : mode === "at-least" ? 700 : 500}
            onBeat={(_, edge) => {
              const notes = ["E4", "G4", "B4", "E5"];
              const note = notes[edge] ?? "C5";
              void ping("bell", note);
            }}
            nodes={[
              { id: "in", label: "input", sub: "topic", kind: "broker", x: 0.05, y: 0.5 },
              { id: "app", label: "app", sub: mode, kind: "queue", x: 0.36, y: 0.5 },
              { id: "out", label: "output", sub: "topic", kind: "broker", x: 0.66, y: 0.5 },
              { id: "ot", label: "__offsets", sub: "internal", kind: "store", x: 0.92, y: 0.5 },
            ]}
            edges={[
              { from: "in", to: "app", label: "consume" },
              { from: "app", to: "out", label: "produce" },
              { from: "app", to: "ot", label: "commit" },
              { from: "out", to: "in", label: "txn" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["at-most", "at-least", "exactly"] as const).map((m) => (
            <ActionButton
              key={m}
              label={t({
                en: m + "-once",
                ko: m === "at-most" ? "최대 한 번" : m === "at-least" ? "최소 한 번" : "정확히 한 번",
              })}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("bell", m === "exactly" ? "E5" : m === "at-least" ? "G4" : "E4");
              }}
            />
          ))}
          <ActionButton
            label={t({ en: running ? "pause" : "run", ko: running ? "일시정지" : "실행" })}
            onAction={() => setRunning((v) => !v)}
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "delivery", ko: "전달 방식" })}
            value={mode === "exactly" ? 1 : mode === "at-least" ? 2 : 0}
            hint={t({
              en: mode === "exactly" ? "atomic txn" : mode === "at-least" ? "may duplicate" : "may lose",
              ko: mode === "exactly" ? "원자적 트랜잭션" : mode === "at-least" ? "중복 가능" : "유실 가능",
            })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`producerProps.put("enable.idempotence", "true");
producerProps.put("transactional.id", "billing-tx-7");

producer.initTransactions();
while (true) {
  var records = consumer.poll(Duration.ofMillis(500));
  producer.beginTransaction();
  var offsets = new HashMap<TopicPartition, OffsetAndMetadata>();
  for (var r : records) {
    producer.send(toOutput(r));
    offsets.put(new TopicPartition(r.topic(), r.partition()),
                new OffsetAndMetadata(r.offset() + 1));
  }
  producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
  producer.commitTransaction();
}`}
        />
      }
    />
  );
}
