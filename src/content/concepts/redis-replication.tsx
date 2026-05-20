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

export default function RedisReplicationConcept() {
  const concept = conceptBySlug["redis-replication"]!;
  const { play, ping } = useAudio();
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
            A primary streams writes to one or more replicas via the replication backlog. Sentinel
            is a quorum-based watcher that detects failures, elects a new primary, and informs
            clients via Pub/Sub.
          </p>
          <Bullets
            items={[
              { heading: "PSYNC", body: "Replicas resume from the last offset they have; fall back to full RDB sync if the backlog is too short." },
              { heading: "Quorum", body: "An odd number of Sentinels (≥3) prevent split-brain. Quorum and majority decide failover." },
              { heading: "Notifications", body: "Sentinel publishes +switch-master and clients re-resolve via SENTINEL get-master-addr-by-name." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Primary · replicas · sentinels" height={420}>
          <ClusterScene3D nodes={nodes} family="redis" active={[primaryDown ? "r1" : "p"]} />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <ActionButton
            label={primaryDown ? "recover primary" : "kill primary"}
            onAction={() => {
              setPrimaryDown((d) => !d);
              void ping("noise");
            }}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="quorum"
            value={3}
            hint={primaryDown ? "failover completed" : "stable"}
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
