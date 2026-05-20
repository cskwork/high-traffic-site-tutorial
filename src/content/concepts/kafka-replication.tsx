import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { ClusterScene3D } from "@/viz/ClusterScene3D";
import type { ClusterNode } from "@/viz/ClusterScene3D";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { T, useT } from "@/i18n/T";

export default function KafkaReplication() {
  const concept = conceptBySlug["kafka-replication"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [downBroker, setDownBroker] = useState<number | null>(null);
  const [acks, setAcks] = useState<"0" | "1" | "all">("all");

  const nodes: ClusterNode[] = [
    { id: "l", label: "broker-1 (leader)", role: "leader" },
    { id: "f1", label: "broker-2", role: downBroker === 2 ? "down" : "follower" },
    { id: "f2", label: "broker-3", role: downBroker === 3 ? "down" : "follower" },
    { id: "p", label: "producer", role: "client" },
  ];

  const inSync = nodes.filter((n) => n.role === "leader" || n.role === "follower").length;
  const durabilityNote =
    acks === "all"
      ? inSync >= 2
        ? t({ en: "Write durable: ISR has the data.", ko: "내구성 있는 쓰기: ISR이 데이터를 보유합니다." })
        : t({ en: "Producer stalls — ISR below min.insync.replicas.", ko: "프로듀서 멈춤 — ISR이 min.insync.replicas 미만입니다." })
      : acks === "1"
        ? t({ en: "Leader-ack — data lost if leader crashes before replicating.", ko: "리더 ack — 복제 전 리더 장애 시 데이터 유실 가능." })
        : t({ en: "Fire-and-forget — fastest, least durable.", ko: "Fire-and-forget — 가장 빠르지만 내구성이 가장 낮습니다." });

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="Every partition has a leader and N-1 followers across brokers. Only the leader handles reads and writes. Followers fetch like consumers; the in-sync set (ISR) is what Kafka considers safe to acknowledge."
              ko="모든 파티션에는 리더 하나와 N-1개의 팔로워가 브로커에 분산됩니다. 읽기·쓰기는 리더만 처리합니다. 팔로워는 컨슈머처럼 데이터를 가져오며, ISR(동기화된 레플리카 집합)이 카프카가 안전하게 ack(확인 응답)할 수 있는 기준입니다."
            />
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "acks=0", ko: "acks=0" }),
                body: t({ en: "Producer does not wait. Fastest, can lose data.", ko: "프로듀서가 대기하지 않습니다. 가장 빠르지만 데이터 유실 가능." }),
              },
              {
                heading: t({ en: "acks=1", ko: "acks=1" }),
                body: t({ en: "Leader ack only. Lose data if the leader crashes before replicating.", ko: "리더 ack만 받습니다. 복제 전 리더 장애 시 데이터 유실 가능." }),
              },
              {
                heading: t({ en: "acks=all + min.insync.replicas=2", ko: "acks=all + min.insync.replicas=2" }),
                body: t({ en: "The recommended floor for production: durable, survives one broker failure.", ko: "프로덕션 권장 최솟값입니다. 브로커 한 대 장애에도 내구성을 보장합니다." }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Leader + followers · drop a broker", ko: "리더 + 팔로워 · 브로커 다운 시뮬레이션" })} height={420}>
          <ClusterScene3D nodes={nodes} family="kafka" active={["l"]} />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["0", "1", "all"] as const).map((opt) => (
            <ActionButton
              key={opt}
              label={`acks=${opt}`}
              primary={acks === opt}
              onAction={() => {
                setAcks(opt);
                void ping("bass", opt === "all" ? "C3" : opt === "1" ? "G3" : "E3");
              }}
            />
          ))}
          <ActionButton
            label={downBroker === 2 ? t({ en: "revive b-2", ko: "b-2 복구" }) : t({ en: "drop b-2", ko: "b-2 다운" })}
            onAction={() => {
              setDownBroker((d) => (d === 2 ? null : 2));
              void ping("noise");
            }}
          />
          <ActionButton
            label={downBroker === 3 ? t({ en: "revive b-3", ko: "b-3 복구" }) : t({ en: "drop b-3", ko: "b-3 다운" })}
            onAction={() => {
              setDownBroker((d) => (d === 3 ? null : 3));
              void ping("noise");
            }}
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "in-sync replicas", ko: "동기화된 레플리카(ISR)" })} value={inSync} hint={durabilityNote} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="properties"
          code={`# topic config
min.insync.replicas=2
unclean.leader.election.enable=false

# producer
acks=all
enable.idempotence=true
retries=2147483647
max.in.flight.requests.per.connection=5`}
        />
      }
    />
  );
}
