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

export default function RedisStreams() {
  const concept = conceptBySlug["redis-streams"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [running, setRunning] = useState(true);
  const [pending, setPending] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="Redis Streams give Kafka-style durability inside Redis. XADD appends; XREADGROUP reads via consumer groups; XACK closes the loop. Unacked records sit in the Pending Entries List until reclaimed by XCLAIM." ko="레디스 스트림즈는 레디스 내부에서 카프카 수준의 내구성을 제공합니다. XADD로 추가하고, XREADGROUP으로 컨슈머 그룹을 통해 읽으며, XACK으로 처리를 완료합니다. ack되지 않은 레코드는 XCLAIM으로 회수할 때까지 Pending Entries List에 남습니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "XADD ... MAXLEN ~ N", ko: "XADD ... MAXLEN ~ N" }), body: t({ en: "Cap the stream by length (approximate trims are cheap). Or trim by id range.", ko: "길이로 스트림 크기를 제한합니다. 근사 트리밍은 비용이 저렴합니다. ID 범위로 트리밍할 수도 있습니다." }) },
              { heading: t({ en: "Consumer groups", ko: "컨슈머 그룹" }), body: t({ en: "One group per logical reader; each entry is delivered to exactly one consumer per group.", ko: "논리적 리더 하나당 그룹 하나를 사용합니다. 각 항목은 그룹 내 컨슈머 중 정확히 하나에게 전달됩니다." }) },
              { heading: t({ en: "Recovery", ko: "복구" }), body: t({ en: "If a consumer dies with unacked entries, another member can XCLAIM the idle ones and finish.", ko: "컨슈머가 ack되지 않은 항목을 남기고 종료되면, 다른 멤버가 XCLAIM으로 해당 항목을 가져와 처리를 완료할 수 있습니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "XADD → XREADGROUP → process → XACK", ko: "XADD → XREADGROUP → 처리 → XACK" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["E4", "G4", "B4", "G4"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
              if (edge === 1) setPending((p) => p + 1);
              if (edge === 3) setPending((p) => Math.max(0, p - 1));
            }}
            nodes={[
              { id: "p", label: "XADD", sub: "producer", kind: "producer", x: 0.07, y: 0.5 },
              { id: "s", label: "stream:events", sub: "broker", kind: "broker", x: 0.4, y: 0.5 },
              { id: "c", label: "consumer-7", sub: "group: workers", kind: "consumer", x: 0.7, y: 0.5 },
              { id: "a", label: "XACK", sub: "commit", kind: "store", x: 0.94, y: 0.5 },
            ]}
            edges={[
              { from: "p", to: "s", label: "append" },
              { from: "s", to: "c", label: "read" },
              { from: "c", to: "a", label: "ack" },
              { from: "a", to: "s", label: "PEL clear" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "stream", ko: "스트림" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "pending entries", ko: "대기 중인 항목" })}
            value={pending}
            hint={pending > 2 ? t({ en: "XCLAIM idle", ko: "XCLAIM 유휴" }) : t({ en: "healthy", ko: "정상" })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`XADD events * type signup user 42

XGROUP CREATE events workers $ MKSTREAM

XREADGROUP GROUP workers c-1 COUNT 10 BLOCK 2000 STREAMS events >

XACK events workers 1700000000000-0

# Recover idle entries
XAUTOCLAIM events workers c-2 30000 0`}
        />
      }
    />
  );
}
