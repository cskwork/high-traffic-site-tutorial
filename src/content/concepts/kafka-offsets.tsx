import { useState } from "react";
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

export default function KafkaOffsets() {
  const concept = conceptBySlug["kafka-offsets"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [offset, setOffset] = useState(7);
  const high = 20;

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en={`Inside a partition, every record gets a monotonically increasing integer offset. A consumer just remembers "I am at offset N". To replay, set it back.`}
              ko="파티션 안에서 모든 레코드는 단조 증가하는 정수 오프셋을 받습니다. 컨슈머는 단순히 '나는 오프셋 N에 있다'는 것만 기억합니다. 재생하려면 이 위치를 되돌리면 됩니다."
            />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Per-partition", ko: "파티션별 관리" }), body: t({ en: "Offsets are per-partition, not per-topic. Each partition is its own ordered tape.", ko: "오프셋은 토픽 단위가 아닌 파티션 단위입니다. 각 파티션은 독립된 순서 테이프입니다." }) },
              { heading: t({ en: "Stored per group", ko: "그룹별 저장" }), body: t({ en: "Kafka stores committed offsets in a special internal topic, keyed by group + partition.", ko: "카프카는 커밋된 오프셋을 그룹 + 파티션을 키로 하는 내부 토픽에 저장합니다." }) },
              { heading: t({ en: "Replay = seek", ko: "재생 = 탐색" }), body: t({ en: "consumer.seek(partition, n) jumps the playback head. Retention determines how far back you can go.", ko: "consumer.seek(partition, n)으로 재생 위치를 이동합니다. 보존 기간이 얼마나 되돌아갈 수 있는지를 결정합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "One partition · the playback head moves", ko: "파티션 하나 · 재생 헤드 이동" })} height={260}>
          <svg viewBox="0 0 720 220" className="h-full w-full">
            <g transform="translate(40,80)">
              {Array.from({ length: high + 1 }).map((_, i) => {
                const active = i <= offset;
                return (
                  <g key={i} transform={`translate(${i * 30},0)`}>
                    <rect
                      x={-12}
                      y={-22}
                      width={24}
                      height={44}
                      rx={3}
                      fill={active ? "var(--concept-soft)" : "#11141b"}
                      stroke={active ? "var(--concept)" : "rgba(255,255,255,0.08)"}
                      strokeWidth={1}
                    />
                    <text textAnchor="middle" y={6} fontSize="10" fill="#cfd4df" fontFamily="JetBrains Mono">
                      {i}
                    </text>
                  </g>
                );
              })}
              <g transform={`translate(${offset * 30}, -48)`}>
                <path d="M0,18 L-8,0 L8,0 Z" fill="var(--concept)" />
                <text textAnchor="middle" y={-4} fontSize="10" fill="var(--concept)" fontFamily="JetBrains Mono">
                  <T en="consumer head" ko="컨슈머 헤드" />
                </text>
              </g>
              <text x={0} y={50} fontSize="10" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                <T en="offset 0" ko="오프셋 0" />
              </text>
              <text x={high * 30} y={50} fontSize="10" textAnchor="end" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                <T en={`high-water ${high}`} ko={`최고 수위 ${high}`} />
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label={t({ en: "seek offset", ko: "오프셋 탐색" })}
            min={0}
            max={high}
            step={1}
            value={offset}
            onValueChange={(v) => {
              setOffset(v);
              void ping("bell", "C5");
            }}
            className="w-56"
          />
          <ActionButton
            label={t({ en: "rewind to 0", ko: "0으로 되감기" })}
            onAction={() => {
              setOffset(0);
              void ping("bell", "G4");
            }}
          />
          <ActionButton
            label={t({ en: "seek to latest", ko: "최신으로 이동" })}
            onAction={() => {
              setOffset(high);
              void ping("bell", "G5");
            }}
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "position", ko: "현재 위치" })} value={offset} hint={`/${high}`} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`var topic = new TopicPartition("orders", 0);
consumer.assign(List.of(topic));

// Rewind one minute
long minuteAgo = System.currentTimeMillis() - 60_000L;
var map = consumer.offsetsForTimes(Map.of(topic, minuteAgo));
consumer.seek(topic, map.get(topic).offset());`}
        />
      }
    />
  );
}
