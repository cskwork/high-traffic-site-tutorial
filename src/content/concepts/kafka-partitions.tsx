import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { PartitionRing3D } from "@/viz/PartitionRing3D";
import {
  SandboxControls,
  Toggle,
  ActionButton,
  CounterDisplay,
  SandboxSlider,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { useTick } from "@/viz/useTick";

export default function KafkaPartitions() {
  const concept = conceptBySlug["kafka-partitions"]!;
  const { play, ping } = useAudio();
  const [count, setCount] = useState(8);
  const [running, setRunning] = useState(true);
  const tick = useTick({
    running,
    intervalMs: 650,
    onTick: (n) => {
      const notes = ["C4", "E4", "G4", "A4", "G4", "E4"];
      const note = notes[n % notes.length];
      if (note) void ping("pluck", note);
    },
  });
  const active = ((tick - 1) % count + count) % count;

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            A topic splits into <span className="font-mono text-pattern-300">N</span> partitions —
            independent logs that can live on different brokers and be consumed in parallel.
          </p>
          <Bullets
            items={[
              {
                heading: "Routing",
                body: "If the producer sends a key, Kafka hashes it: same key → same partition → totally ordered for that key.",
              },
              {
                heading: "Throughput knob",
                body: "More partitions = more parallelism, more file handles, more rebalance time. Pick the smallest that hits your write throughput.",
              },
              {
                heading: "Ordering trade-off",
                body: "Global ordering across a topic is not free. Pick a partition key whose ordering you actually care about (e.g. user-id).",
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Partitions ring — same key always lands here" height={420}>
          <PartitionRing3D
            partitions={count}
            activePartition={active}
            family="kafka"
            spinning={running}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="ring" value={running} onToggle={() => setRunning((v) => !v)} />
          <SandboxSlider
            label="partitions"
            min={3}
            max={16}
            step={1}
            value={count}
            onValueChange={(v) => setCount(Math.round(v))}
            className="w-48"
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="active partition" value={active} hint={`of ${count}`} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# Create a topic with 12 partitions and replication factor 3
kafka-topics.sh --create \\
  --bootstrap-server broker:9092 \\
  --topic events \\
  --partitions 12 --replication-factor 3

# Inspect partition layout
kafka-topics.sh --describe \\
  --bootstrap-server broker:9092 \\
  --topic events`}
        />
      }
    />
  );
}
