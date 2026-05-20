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

export default function KafkaReplication() {
  const concept = conceptBySlug["kafka-replication"]!;
  const { play, ping } = useAudio();
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
        ? "Write durable: ISR has the data."
        : "Producer stalls — ISR below min.insync.replicas."
      : acks === "1"
        ? "Leader-ack — data lost if leader crashes before replicating."
        : "Fire-and-forget — fastest, least durable.";

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Every partition has a leader and N-1 followers across brokers. Only the leader handles
            reads and writes. Followers fetch like consumers; the in-sync set (ISR) is what Kafka
            considers safe to acknowledge.
          </p>
          <Bullets
            items={[
              {
                heading: "acks=0",
                body: "Producer does not wait. Fastest, can lose data.",
              },
              {
                heading: "acks=1",
                body: "Leader ack only. Lose data if the leader crashes before replicating.",
              },
              {
                heading: "acks=all + min.insync.replicas=2",
                body: "The recommended floor for production: durable, survives one broker failure.",
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Leader + followers · drop a broker" height={420}>
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
            label={downBroker === 2 ? "revive b-2" : "drop b-2"}
            onAction={() => {
              setDownBroker((d) => (d === 2 ? null : 2));
              void ping("noise");
            }}
          />
          <ActionButton
            label={downBroker === 3 ? "revive b-3" : "drop b-3"}
            onAction={() => {
              setDownBroker((d) => (d === 3 ? null : 3));
              void ping("noise");
            }}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="in-sync replicas" value={inSync} hint={durabilityNote} />
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
