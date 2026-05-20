import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { ClusterScene3D, type ClusterNode } from "@/viz/ClusterScene3D";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { T, useT } from "@/i18n/T";

export default function RedisReplicationConcept() {
  const concept = conceptBySlug["redis-replication"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [primaryDown, setPrimaryDown] = useState(false);

  const nodes: ClusterNode[] = [
    { id: "p", label: primaryDown ? "primary (down)" : "primary", role: primaryDown ? "down" : "leader" },
    { id: "r1", label: primaryDown ? "promoted" : "replica-1", role: primaryDown ? "leader" : "follower" },
    { id: "r2", label: "replica-2", role: "follower" },
    { id: "s1", label: "sentinel-a", role: "client" },
    { id: "s2", label: "sentinel-b", role: "client" },
    { id: "s3", label: "sentinel-c", role: "client" },
  ];

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="A primary streams writes to one or more replicas via the replication backlog. Sentinel is a quorum-based watcher that detects failures, elects a new primary, and informs clients via Pub/Sub." ko="프라이머리는 복제 백로그를 통해 하나 이상의 레플리카에 쓰기를 스트리밍합니다. Sentinel은 쿼럼 기반의 감시자로, 장애를 감지하고 새로운 프라이머리를 선출한 뒤 Pub/Sub으로 클라이언트에 알립니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "PSYNC", ko: "PSYNC" }), body: t({ en: "Replicas resume from the last offset they have; fall back to full RDB sync if the backlog is too short.", ko: "레플리카는 마지막 오프셋부터 재개합니다. 백로그가 너무 짧으면 전체 RDB 동기화로 전환합니다." }) },
              { heading: t({ en: "Quorum", ko: "쿼럼" }), body: t({ en: "An odd number of Sentinels (≥3) prevent split-brain. Quorum and majority decide failover.", ko: "홀수 개의 Sentinel(3개 이상)이 스플릿 브레인을 방지합니다. 쿼럼과 과반수가 페일오버를 결정합니다." }) },
              { heading: t({ en: "Notifications", ko: "알림" }), body: t({ en: "Sentinel publishes +switch-master and clients re-resolve via SENTINEL get-master-addr-by-name.", ko: "Sentinel이 +switch-master를 발행하면 클라이언트는 SENTINEL get-master-addr-by-name으로 새 주소를 조회합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Primary · replicas · sentinels", ko: "프라이머리 · 레플리카 · Sentinel" })} height={420}>
          <ClusterScene3D nodes={nodes} family="redis" active={[primaryDown ? "r1" : "p"]} />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <ActionButton
            label={primaryDown ? t({ en: "recover primary", ko: "프라이머리 복구" }) : t({ en: "kill primary", ko: "프라이머리 중단" })}
            onAction={() => {
              setPrimaryDown((d) => !d);
              void ping("noise");
            }}
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "quorum", ko: "쿼럼" })}
            value={3}
            hint={primaryDown ? t({ en: "failover completed", ko: "페일오버 완료" }) : t({ en: "stable", ko: "안정적" })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="conf"
          code={`# sentinel.conf
sentinel monitor mymaster 10.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 30000
sentinel parallel-syncs mymaster 1`}
        />
      }
    />
  );
}
