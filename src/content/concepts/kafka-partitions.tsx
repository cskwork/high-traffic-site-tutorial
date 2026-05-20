import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { PartitionRing3D } from "@/viz/PartitionRing3D";
import {
  SandboxControls,
  Toggle,
  ActionButton,
  CounterDisplay,
  SandboxSlider,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { useTick } from "@/viz/useTick";
import { T, useT } from "@/i18n/T";

export default function KafkaPartitions() {
  const concept = conceptBySlug["kafka-partitions"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [count, setCount] = useState(8);
  const [running, setRunning] = useState(true);
  const tick = useTick({
    running,
    intervalMs: 650,
    onTick: (n) => {
      const notes = ["C4", "E4", "G4", "A4", "G4", "E4"];
      const note = notes[n % notes.length];
      if (note) void ping("pluck", note);
    },
  });
  const active = ((tick - 1) % count + count) % count;

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="A topic splits into" ko="토픽은" />{" "}
            <span className="font-mono text-pattern-300">N</span>{" "}
            <T
              en="partitions — independent logs that can live on different brokers and be consumed in parallel."
              ko="개의 파티션으로 분할됩니다. 각 파티션은 서로 다른 브로커에 위치할 수 있고 병렬로 소비 가능한 독립 로그입니다."
            />
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Routing", ko: "라우팅" }),
                body: t({ en: "If the producer sends a key, Kafka hashes it: same key → same partition → totally ordered for that key.", ko: "프로듀서가 키를 보내면 카프카가 이를 해시합니다. 같은 키 → 같은 파티션 → 해당 키에 대한 완전한 순서 보장." }),
              },
              {
                heading: t({ en: "Throughput knob", ko: "처리량 조절" }),
                body: t({ en: "More partitions = more parallelism, more file handles, more rebalance time. Pick the smallest that hits your write throughput.", ko: "파티션이 많을수록 병렬성이 높아지지만 파일 핸들과 리밸런스 시간도 늘어납니다. 쓰기 처리량을 감당하는 최솟값을 고르세요." }),
              },
              {
                heading: t({ en: "Ordering trade-off", ko: "순서 보장의 트레이드오프" }),
                body: t({ en: "Global ordering across a topic is not free. Pick a partition key whose ordering you actually care about (e.g. user-id).", ko: "토픽 전체의 전역 순서는 보장되지 않습니다. 실제로 순서가 필요한 기준(예: user-id)을 파티션 키로 선택하세요." }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Partitions ring — same key always lands here", ko: "파티션 링 — 같은 키는 항상 같은 곳으로" })} height={420}>
          <PartitionRing3D
            partitions={count}
            activePartition={active}
            family="kafka"
            spinning={running}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "ring", ko: "링" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <SandboxSlider
            label={t({ en: "partitions", ko: "파티션" })}
            min={3}
            max={16}
            step={1}
            value={count}
            onValueChange={(v) => setCount(Math.round(v))}
            className="w-48"
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "active partition", ko: "활성 파티션" })} value={active} hint={t({ en: `of ${count}`, ko: `/ ${count}` })} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# Create a topic with 12 partitions and replication factor 3
kafka-topics.sh --create \\
  --bootstrap-server broker:9092 \\
  --topic events \\
  --partitions 12 --replication-factor 3

# Inspect partition layout
kafka-topics.sh --describe \\
  --bootstrap-server broker:9092 \\
  --topic events`}
        />
      }
    />
  );
}
