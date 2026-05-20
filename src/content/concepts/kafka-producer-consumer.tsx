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
import { T, useT } from "@/i18n/T";

export default function KafkaProducerConsumer() {
  const concept = conceptBySlug["kafka-producer-consumer"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [running, setRunning] = useState(true);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="Three roles, one contract. Producers publish records to a topic. The broker stores them. Consumers pull at their own pace and remember where they were."
              ko="역할은 셋, 계약은 하나입니다. 프로듀서는 토픽에 레코드를 발행하고, 브로커는 이를 저장하며, 컨슈머는 자신의 속도에 맞춰 가져가면서 위치를 기억합니다."
            />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Producer", ko: "프로듀서" }), body: t({ en: "Sends key + value to a topic. Picks the partition explicitly or via a hash of the key.", ko: "토픽에 키 + 값을 전송합니다. 파티션을 직접 지정하거나 키 해시로 결정합니다." }) },
              { heading: t({ en: "Broker", ko: "브로커" }), body: t({ en: "Persists segments on disk, replicates them, and serves consumers.", ko: "세그먼트를 디스크에 저장하고 복제하며 컨슈머에게 제공합니다." }) },
              { heading: t({ en: "Consumer", ko: "컨슈머" }), body: t({ en: "Polls in a loop, processes, commits offsets when safely handled.", ko: "루프 안에서 폴링하고, 처리한 뒤 안전하게 처리된 시점에 오프셋을 커밋합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Producers append · Brokers store · Consumers pull", ko: "프로듀서 추가 · 브로커 저장 · 컨슈머 가져오기" })} height={340}>
          <MessageFlow
            running={running}
            beats={[0, 1, 0, 2, 0, 1]}
            intervalMs={850}
            onBeat={(_, edge) => {
              if (edge === 0) {
                setProduced((n) => n + 1);
                void ping("pluck", "C5");
              } else {
                setConsumed((n) => n + 1);
                void ping("pluck", edge === 1 ? "E5" : "G5");
              }
            }}
            nodes={[
              { id: "p", label: "orders-svc", sub: "produces", kind: "producer", x: 0.08, y: 0.5 },
              { id: "b", label: "orders", sub: "1 broker", kind: "broker", x: 0.5, y: 0.5 },
              { id: "c1", label: "warehouse", sub: "consumer", kind: "consumer", x: 0.92, y: 0.25 },
              { id: "c2", label: "analytics", sub: "consumer", kind: "consumer", x: 0.92, y: 0.75 },
            ]}
            edges={[
              { from: "p", to: "b", label: "produce" },
              { from: "b", to: "c1", label: "poll" },
              { from: "b", to: "c2", label: "poll" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "loop", ko: "루프" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "produced", ko: "발행됨" })} value={produced} />
          <CounterDisplay label={t({ en: "consumed", ko: "소비됨" })} value={consumed} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="python"
          code={`from confluent_kafka import Producer, Consumer

p = Producer({"bootstrap.servers": "broker:9092"})
p.produce("orders", key="o-1", value=b'{"item":"book"}')
p.flush()

c = Consumer({
    "bootstrap.servers": "broker:9092",
    "group.id":          "warehouse",
    "auto.offset.reset": "earliest",
})
c.subscribe(["orders"])
while True:
    msg = c.poll(1.0)
    if msg and not msg.error():
        handle(msg)
        c.commit(asynchronous=False)`}
        />
      }
    />
  );
}
