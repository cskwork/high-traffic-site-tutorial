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

export default function KafkaStreams() {
  const concept = conceptBySlug["kafka-streams"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [running, setRunning] = useState(true);
  const [windowed, setWindowed] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="Streams is a Java library that turns topics into transformations. Operators are stateless (filter, map) or stateful (aggregate, join, window). State lives in local RocksDB and is durable via changelog topics."
              ko="Kafka Streams는 토픽을 변환 파이프라인으로 바꾸는 Java 라이브러리입니다. 연산자는 무상태(filter, map)이거나 유상태(aggregate, join, window)입니다. 상태는 로컬 RocksDB에 저장되며 체인지로그 토픽으로 내구성을 보장합니다."
            />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "KStream vs KTable", ko: "KStream vs KTable" }), body: t({ en: "KStream = a log. KTable = the latest value per key. join across them like SQL.", ko: "KStream은 로그, KTable은 키별 최신 값입니다. SQL처럼 둘을 조인할 수 있습니다." }) },
              { heading: t({ en: "Windows", ko: "윈도우" }), body: t({ en: "Tumbling, hopping, session, sliding — group records by event time, not wall clock.", ko: "텀블링·호핑·세션·슬라이딩 — 벽시계가 아닌 이벤트 시간을 기준으로 레코드를 묶습니다." }) },
              { heading: t({ en: "Local state", ko: "로컬 상태" }), body: t({ en: "State stores are sharded by partition. Failover restores from the changelog topic.", ko: "상태 저장소는 파티션 단위로 샤딩됩니다. 페일오버 시 체인지로그 토픽으로 복구합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "raw → filter → aggregate(window) → sink", ko: "원시 → 필터 → 집계(윈도우) → 싱크" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={750}
            onBeat={(_, edge) => {
              const notes = ["C4", "D4", "F4", "Bb4"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
              if (edge === 2) setWindowed((n) => n + 1);
            }}
            nodes={[
              { id: "raw", label: "raw events", sub: "topic", kind: "broker", x: 0.06, y: 0.5 },
              { id: "flt", label: "filter", sub: "stateless", kind: "queue", x: 0.32, y: 0.5 },
              { id: "agg", label: "windowed sum", sub: "stateful 60s", kind: "store", x: 0.62, y: 0.5 },
              { id: "out", label: "metrics", sub: "topic", kind: "broker", x: 0.92, y: 0.5 },
            ]}
            edges={[
              { from: "raw", to: "flt", label: "filter(...)" },
              { from: "flt", to: "agg", label: "groupBy(key)" },
              { from: "agg", to: "out", label: "window 60s" },
              { from: "out", to: "raw", label: "(changelog)" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "topology", ko: "토폴로지" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "aggregated windows", ko: "집계된 윈도우" })} value={windowed} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`StreamsBuilder b = new StreamsBuilder();
KStream<String, Click> clicks = b.stream("clicks");

clicks
  .filter((k, v) -> v.userId() != null)
  .groupBy((k, v) -> v.userId())
  .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofSeconds(60)))
  .count()
  .toStream()
  .to("clicks-per-min", Produced.with(Serdes.String(), Serdes.Long()));`}
        />
      }
    />
  );
}
