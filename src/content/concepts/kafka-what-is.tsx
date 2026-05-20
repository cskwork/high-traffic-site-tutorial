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

export default function KafkaWhatIs() {
  const concept = conceptBySlug["kafka-what-is"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [running, setRunning] = useState(true);
  const [delivered, setDelivered] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en={`Forget the words "message queue" for a minute. A Kafka topic is more like a tape recorder: producers write to the end, consumers play back from any point.`}
              ko="잠깐 '메시지 큐'라는 단어는 잊어 주세요. 카프카 토픽은 테이프 레코더에 가깝습니다. 프로듀서는 끝에 이어 쓰고, 컨슈머는 원하는 위치부터 재생합니다."
            />
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Append-only log", ko: "추가 전용 로그" }),
                body: t({ en: "Producers can only add. Brokers never overwrite — they keep the tape running.", ko: "프로듀서는 오직 추가만 가능합니다. 브로커는 덮어쓰지 않고 테이프를 계속 이어 나갑니다." }),
              },
              {
                heading: t({ en: "Many readers, one tape", ko: "여러 독자, 하나의 테이프" }),
                body: t({ en: "Every consumer keeps its own playback head (an offset). Slow consumers do not block fast ones.", ko: "컨슈머마다 자기만의 재생 위치(오프셋)를 가집니다. 느린 컨슈머가 빠른 컨슈머를 막지 않습니다." }),
              },
              {
                heading: t({ en: "Replay any time", ko: "언제든 재생 가능" }),
                body: t({ en: "Retention is by time or size, not by 'has the message been read'.", ko: "보존 기간은 '메시지를 읽었는가'가 아니라 시간이나 크기로 결정됩니다." }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Producers append · Consumers play back", ko: "프로듀서 추가 · 컨슈머 재생" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 0, 1, 1]}
            intervalMs={900}
            onBeat={(_, edge) => {
              setDelivered((n) => n + 1);
              if (edge === 0) void ping("pluck", "C5");
              else void ping("pluck", "G5");
            }}
            nodes={[
              { id: "p1", label: "App A", sub: "produce", kind: "producer", x: 0.08, y: 0.5 },
              { id: "b", label: "topic: events", sub: "broker", kind: "broker", x: 0.5, y: 0.5 },
              { id: "c1", label: "Search index", sub: "consume", kind: "consumer", x: 0.92, y: 0.25 },
              { id: "c2", label: "Billing job", sub: "consume", kind: "consumer", x: 0.92, y: 0.75 },
            ]}
            edges={[
              { from: "p1", to: "b", label: "append" },
              { from: "b", to: "c1", label: "read" },
              { from: "b", to: "c2", label: "read" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "topic", ko: "토픽" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton
            primary
            label={t({ en: "▶ Play motif", ko: "▶ 모티프 재생" })}
            onAction={() => {
              void play(concept.motif);
            }}
          />
          <CounterDisplay label={t({ en: "events delivered", ko: "전달된 이벤트" })} value={delivered} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`Properties p = new Properties();
p.put("bootstrap.servers", "broker:9092");
p.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
p.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

try (var producer = new KafkaProducer<String,String>(p)) {
  producer.send(new ProducerRecord<>("events", "user-42", "{\\"event\\":\\"signup\\"}"));
}`}
        />
      }
    />
  );
}
