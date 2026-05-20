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

export default function KafkaWhatIs() {
  const concept = conceptBySlug["kafka-what-is"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [delivered, setDelivered] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Forget the words "message queue" for a minute. A Kafka topic is more like a tape
            recorder: producers write to the end, consumers play back from any point.
          </p>
          <Bullets
            items={[
              {
                heading: "Append-only log",
                body: "Producers can only add. Brokers never overwrite — they keep the tape running.",
              },
              {
                heading: "Many readers, one tape",
                body: "Every consumer keeps its own playback head (an offset). Slow consumers do not block fast ones.",
              },
              {
                heading: "Replay any time",
                body: "Retention is by time or size, not by 'has the message been read'.",
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Producers append · Consumers play back" height={320}>
          <MessageFlow
            running={running}
            beats={[0, 0, 1, 1]}
            intervalMs={900}
            onBeat={(_, edge) => {
              setDelivered((n) => n + 1);
              if (edge === 0) void ping("pluck", "C5");
              else void ping("pluck", "G5");
            }}
            nodes={[
              { id: "p1", label: "App A", sub: "produce", kind: "producer", x: 0.08, y: 0.5 },
              { id: "b", label: "topic: events", sub: "broker", kind: "broker", x: 0.5, y: 0.5 },
              { id: "c1", label: "Search index", sub: "consume", kind: "consumer", x: 0.92, y: 0.25 },
              { id: "c2", label: "Billing job", sub: "consume", kind: "consumer", x: 0.92, y: 0.75 },
            ]}
            edges={[
              { from: "p1", to: "b", label: "append" },
              { from: "b", to: "c1", label: "read" },
              { from: "b", to: "c2", label: "read" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="topic" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton
            primary
            label="▶ Play motif"
            onAction={() => {
              void play(concept.motif);
            }}
          />
          <CounterDisplay label="events delivered" value={delivered} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`Properties p = new Properties();
p.put("bootstrap.servers", "broker:9092");
p.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
p.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

try (var producer = new KafkaProducer<String,String>(p)) {
  producer.send(new ProducerRecord<>("events", "user-42", "{\\"event\\":\\"signup\\"}"));
}`}
        />
      }
    />
  );
}
