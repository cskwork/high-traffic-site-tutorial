import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { MessageFlow } from "@/viz/MessageFlow";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";

export default function KafkaEos() {
  const concept = conceptBySlug["kafka-eos"]!;
  const { play, ping } = useAudio();
  const [mode, setMode] = useState<"at-most" | "at-least" | "exactly">("exactly");
  const [running, setRunning] = useState(true);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Exactly-once is two things glued together: an idempotent producer (deduped by PID +
            sequence number) and a transactional commit that writes the output records and the
            consumer offsets in one atomic step.
          </p>
          <Bullets
            items={[
              { heading: "Producer idempotence", body: "enable.idempotence=true: broker dedupes retries by (PID, partition, seq)." },
              { heading: "Transactions", body: "beginTransaction → produce → sendOffsetsToTransaction → commit. All-or-nothing." },
              { heading: "Cost", body: "Two-phase commit overhead, higher latency, transactional coordinator state. Use where it matters." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Consume → process → produce + commit (atomic)" height={300}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={mode === "exactly" ? 950 : mode === "at-least" ? 700 : 500}
            onBeat={(_, edge) => {
              const notes = ["E4", "G4", "B4", "E5"];
              const note = notes[edge] ?? "C5";
              void ping("bell", note);
            }}
            nodes={[
              { id: "in", label: "input", sub: "topic", kind: "broker", x: 0.05, y: 0.5 },
              { id: "app", label: "app", sub: mode, kind: "queue", x: 0.36, y: 0.5 },
              { id: "out", label: "output", sub: "topic", kind: "broker", x: 0.66, y: 0.5 },
              { id: "ot", label: "__offsets", sub: "internal", kind: "store", x: 0.92, y: 0.5 },
            ]}
            edges={[
              { from: "in", to: "app", label: "consume" },
              { from: "app", to: "out", label: "produce" },
              { from: "app", to: "ot", label: "commit" },
              { from: "out", to: "in", label: "txn" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["at-most", "at-least", "exactly"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m + "-once"}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("bell", m === "exactly" ? "E5" : m === "at-least" ? "G4" : "E4");
              }}
            />
          ))}
          <ActionButton
            label={running ? "pause" : "run"}
            onAction={() => setRunning((v) => !v)}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="delivery"
            value={mode === "exactly" ? 1 : mode === "at-least" ? 2 : 0}
            hint={mode === "exactly" ? "atomic txn" : mode === "at-least" ? "may duplicate" : "may lose"}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`producerProps.put("enable.idempotence", "true");
producerProps.put("transactional.id", "billing-tx-7");

producer.initTransactions();
while (true) {
  var records = consumer.poll(Duration.ofMillis(500));
  producer.beginTransaction();
  var offsets = new HashMap<TopicPartition, OffsetAndMetadata>();
  for (var r : records) {
    producer.send(toOutput(r));
    offsets.put(new TopicPartition(r.topic(), r.partition()),
                new OffsetAndMetadata(r.offset() + 1));
  }
  producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
  producer.commitTransaction();
}`}
        />
      }
    />
  );
}
