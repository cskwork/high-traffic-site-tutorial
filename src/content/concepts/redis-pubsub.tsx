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

export default function RedisPubsub() {
  const concept = conceptBySlug["redis-pubsub"]!;
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
            <T en="PUBLISH and SUBSCRIBE are fire-and-forget. The server fans out to every connected subscriber and forgets immediately. No persistence, no replay — perfect for live UI updates, not for durable events." ko="PUBLISH와 SUBSCRIBE는 발행 후 망각(fire-and-forget) 방식입니다. 서버는 연결된 모든 구독자에게 메시지를 전달하고 즉시 잊어버립니다. 영속성도 재생도 없으므로 실시간 UI 업데이트에는 적합하지만, 내구성이 필요한 이벤트에는 사용하지 마세요." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Disconnected = silent", ko: "연결 끊김 = 메시지 소실" }), body: t({ en: "A subscriber that drops misses messages forever. Use Streams if you need ack/replay.", ko: "연결이 끊긴 구독자는 그 사이의 메시지를 영영 받지 못합니다. ack/재생이 필요하다면 스트림을 사용하세요." }) },
              { heading: t({ en: "Pattern subscribe", ko: "패턴 구독" }), body: t({ en: "PSUBSCRIBE chat.* matches channels by glob. Useful for room-style routing.", ko: "PSUBSCRIBE chat.*처럼 글로브 패턴으로 채널을 구독합니다. 방(room) 기반 라우팅에 유용합니다." }) },
              { heading: t({ en: "Sharded pub/sub", ko: "샤딩된 Pub/Sub" }), body: t({ en: "SPUBLISH/SSUBSCRIBE confine to one shard in Cluster, avoiding the all-nodes broadcast.", ko: "SPUBLISH/SSUBSCRIBE는 클러스터에서 특정 샤드에만 발행해 전체 노드 브로드캐스트를 방지합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "One publisher · many subscribers · no persistence", ko: "발행자 하나 · 구독자 여럿 · 영속성 없음" })} height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2]}
            intervalMs={780}
            onBeat={(_, edge) => {
              setDelivered((n) => n + 1);
              const notes = ["G4", "B4", "D5"];
              const note = notes[edge] ?? "C5";
              void ping("pluck", note);
            }}
            nodes={[
              { id: "p", label: "PUBLISH room:42", sub: "publisher", kind: "producer", x: 0.07, y: 0.5 },
              { id: "r", label: "redis", sub: "broker", kind: "broker", x: 0.42, y: 0.5 },
              { id: "s1", label: "tab A", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.2 },
              { id: "s2", label: "tab B", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.5 },
              { id: "s3", label: "tab C", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.8 },
            ]}
            edges={[
              { from: "p", to: "r", label: "publish" },
              { from: "r", to: "s1", label: "→" },
              { from: "r", to: "s2", label: "→" },
              { from: "r", to: "s3", label: "→" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "publisher", ko: "발행자" })} value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "delivered", ko: "전달됨" })} value={delivered} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# tab 1
SUBSCRIBE room:42

# tab 2
PSUBSCRIBE room:*

# producer
PUBLISH room:42 '{"msg":"hi"}'   # → integer reply: 2 (delivered to 2 subscribers)`}
        />
      }
    />
  );
}
