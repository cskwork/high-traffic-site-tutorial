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

type Topology = "stretch" | "active-active" | "active-passive";

export default function KafkaMultidc() {
  const concept = conceptBySlug["kafka-multidc"]!;
  const { play, ping } = useAudio();
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
            One DC is rarely enough at scale. Three common shapes: stretch the cluster across DCs;
            run two clusters and mirror; or run one active and a warm passive. Pick by RTO/RPO,
            latency tolerance, and consumer commutativity.
          </p>
          <Bullets
            items={[
              { heading: "Stretch", body: "One logical cluster, brokers in 2-3 DCs. Latency hits every write; only works close (<5 ms)." },
              { heading: "Active-active + MirrorMaker2", body: "Two clusters mirror to each other. Producers write locally, consumers must be idempotent or topic-prefixed." },
              { heading: "Active-passive", body: "Primary serves; passive replicates and is promoted on disaster. Simpler, but cold idle capacity." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Inter-DC replication topology" height={420}>
          <ClusterScene3D nodes={nodes} family="kafka" active={["a1"]} />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["stretch", "active-active", "active-passive"] as const).map((t) => (
            <ActionButton
              key={t}
              label={t}
              primary={topology === t}
              onAction={() => {
                setTopology(t);
                void ping("pad", t === "stretch" ? "C3" : t === "active-active" ? "F3" : "Ab3");
              }}
            />
          ))}
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="RTO"
            value={topology === "stretch" ? 0 : topology === "active-active" ? 1 : 5}
            hint={topology === "stretch" ? "seconds" : topology === "active-active" ? "minute" : "minutes"}
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
