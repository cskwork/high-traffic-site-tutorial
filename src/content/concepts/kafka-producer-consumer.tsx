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

export default function KafkaProducerConsumer() {
  const concept = conceptBySlug["kafka-producer-consumer"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Three roles, one contract. Producers publish records to a topic. The broker stores them.
            Consumers pull at their own pace and remember where they were.
          </p>
          <Bullets
            items={[
              { heading: "Producer", body: "Sends key + value to a topic. Picks the partition explicitly or via a hash of the key." },
              { heading: "Broker", body: "Persists segments on disk, replicates them, and serves consumers." },
              { heading: "Consumer", body: "Polls in a loop, processes, commits offsets when safely handled." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Producers append · Brokers store · Consumers pull" height={340}>
          <MessageFlow
            running={running}
            beats={[0, 1, 0, 2, 0, 1]}
            intervalMs={850}
            onBeat={(_, edge) => {
              if (edge === 0) {
                setProduced((n) => n + 1);
                void ping("pluck", "C5");
              } else {
                setConsumed((n) => n + 1);
                void ping("pluck", edge === 1 ? "E5" : "G5");
              }
            }}
            nodes={[
              { id: "p", label: "orders-svc", sub: "produces", kind: "producer", x: 0.08, y: 0.5 },
              { id: "b", label: "orders", sub: "1 broker", kind: "broker", x: 0.5, y: 0.5 },
              { id: "c1", label: "warehouse", sub: "consumer", kind: "consumer", x: 0.92, y: 0.25 },
              { id: "c2", label: "analytics", sub: "consumer", kind: "consumer", x: 0.92, y: 0.75 },
            ]}
            edges={[
              { from: "p", to: "b", label: "produce" },
              { from: "b", to: "c1", label: "poll" },
              { from: "b", to: "c2", label: "poll" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="loop" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="produced" value={produced} />
          <CounterDisplay label="consumed" value={consumed} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="python"
          code={`from confluent_kafka import Producer, Consumer

p = Producer({"bootstrap.servers": "broker:9092"})
p.produce("orders", key="o-1", value=b'{"item":"book"}')
p.flush()

c = Consumer({
    "bootstrap.servers": "broker:9092",
    "group.id":          "warehouse",
    "auto.offset.reset": "earliest",
})
c.subscribe(["orders"])
while True:
    msg = c.poll(1.0)
    if msg and not msg.error():
        handle(msg)
        c.commit(asynchronous=False)`}
        />
      }
    />
  );
}
