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

type Topology = "stretch" | "active-active" | "active-passive";

export default function KafkaMultidc() {
  const concept = conceptBySlug["kafka-multidc"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [topology, setTopology] = useState<Topology>("active-active");

  const nodes: ClusterNode[] =
    topology === "stretch"
      ? [
          { id: "a1", label: "us-east a", role: "leader" },
          { id: "a2", label: "us-east b", role: "follower" },
          { id: "b1", label: "us-west a", role: "follower" },
          { id: "b2", label: "us-west b", role: "follower" },
          { id: "p", label: "client", role: "client" },
        ]
      : topology === "active-active"
        ? [
            { id: "a1", label: "us-east leader", role: "leader" },
            { id: "b1", label: "us-west leader", role: "leader" },
            { id: "a2", label: "us-east replica", role: "follower" },
            { id: "b2", label: "us-west replica", role: "follower" },
            { id: "p", label: "client", role: "client" },
          ]
        : [
            { id: "a1", label: "primary DC", role: "leader" },
            { id: "a2", label: "primary follower", role: "follower" },
            { id: "b1", label: "passive DC", role: "follower" },
            { id: "b2", label: "passive follower", role: "down" },
            { id: "p", label: "client", role: "client" },
          ];

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="One DC is rarely enough at scale. Three common shapes: stretch the cluster across DCs; run two clusters and mirror; or run one active and a warm passive. Pick by RTO/RPO, latency tolerance, and consumer commutativity."
              ko="규모가 커지면 DC 하나로는 부족합니다. 일반적인 구성은 세 가지입니다. 클러스터를 여러 DC에 걸쳐 확장하거나, 두 클러스터를 미러링하거나, 하나를 활성으로 두고 워밍된 패시브를 유지하는 방식입니다. RTO/RPO, 지연 허용 범위, 컨슈머 교환법칙 성립 여부를 기준으로 선택하세요."
            />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Stretch", ko: "스트레치" }), body: t({ en: "One logical cluster, brokers in 2-3 DCs. Latency hits every write; only works close (<5 ms).", ko: "하나의 논리적 클러스터에 브로커를 2-3개 DC에 분산합니다. 모든 쓰기에 지연이 발생하며 DC 간 거리가 가까울 때(<5ms)만 실용적입니다." }) },
              { heading: t({ en: "Active-active + MirrorMaker2", ko: "액티브-액티브 + MirrorMaker2" }), body: t({ en: "Two clusters mirror to each other. Producers write locally, consumers must be idempotent or topic-prefixed.", ko: "두 클러스터가 서로 미러링합니다. 프로듀서는 로컬에 쓰고, 컨슈머는 멱등성을 갖추거나 토픽 접두사로 충돌을 방지해야 합니다." }) },
              { heading: t({ en: "Active-passive", ko: "액티브-패시브" }), body: t({ en: "Primary serves; passive replicates and is promoted on disaster. Simpler, but cold idle capacity.", ko: "기본 DC가 서비스하고, 패시브는 복제하다가 장애 시 승격됩니다. 단순하지만 유휴 용량이 낭비됩니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Inter-DC replication topology", ko: "DC 간 복제 토폴로지" })} height={420}>
          <ClusterScene3D nodes={nodes} family="kafka" active={["a1"]} />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["stretch", "active-active", "active-passive"] as const).map((topo) => (
            <ActionButton
              key={topo}
              label={topo}
              primary={topology === topo}
              onAction={() => {
                setTopology(topo);
                void ping("pad", topo === "stretch" ? "C3" : topo === "active-active" ? "F3" : "Ab3");
              }}
            />
          ))}
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="RTO"
            value={topology === "stretch" ? 0 : topology === "active-active" ? 1 : 5}
            hint={t({
              en: topology === "stretch" ? "seconds" : topology === "active-active" ? "minute" : "minutes",
              ko: topology === "stretch" ? "초" : topology === "active-active" ? "분" : "분",
            })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="properties"
          code={`# MirrorMaker2 — active-active with prefixed topics
clusters = east, west
east.bootstrap.servers = east-broker:9092
west.bootstrap.servers = west-broker:9092

east->west.enabled = true
west->east.enabled = true
east->west.topics = .*
replication.policy.class = org.apache.kafka.connect.mirror.IdentityReplicationPolicy`}
        />
      }
    />
  );
}
