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

export default function PatternEventSourcing() {
  const concept = conceptBySlug["pattern-event-sourcing"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [events, setEvents] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Don't store the current state — store every change as an immutable event in a Kafka
            topic. Materialized views (in Redis or a DB) project the log into shapes optimized for
            reads. CQRS separates the read side from the write side so each scales on its own axis.
          </p>
          <Bullets
            items={[
              { heading: "Truth = log", body: "The Kafka topic is the source of truth. Views are derived and disposable; you can always rebuild them by replay." },
              { heading: "Read models", body: "One per query: a Redis Hash for hot lookups, a Postgres table for joins, an OpenSearch index for full-text." },
              { heading: "Schema evolution", body: "Use Schema Registry + backward-compatible additions; versioned events let old consumers keep working." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Command → Event log → Many read models" height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3, 4]}
            intervalMs={760}
            onBeat={(_, edge) => {
              const notes = ["C4", "E4", "G4", "B4", "D5", "F5"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
              if (edge === 1) setEvents((n) => n + 1);
            }}
            nodes={[
              { id: "cmd", label: "POST /order", sub: "command", kind: "producer", x: 0.06, y: 0.5 },
              { id: "agg", label: "aggregate", sub: "decision", kind: "queue", x: 0.28, y: 0.5 },
              { id: "log", label: "orders.events", sub: "kafka log", kind: "broker", x: 0.55, y: 0.5 },
              { id: "h", label: "orders:hash", sub: "redis view", kind: "store", x: 0.85, y: 0.25 },
              { id: "pg", label: "orders_view", sub: "postgres", kind: "store", x: 0.85, y: 0.75 },
            ]}
            edges={[
              { from: "cmd", to: "agg", label: "validate" },
              { from: "agg", to: "log", label: "emit" },
              { from: "log", to: "h", label: "project" },
              { from: "log", to: "pg", label: "project" },
              { from: "log", to: "agg", label: "replay" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="stream" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="events emitted" value={events} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="ts"
          code={`type OrderEvent =
  | { type: "OrderPlaced",  id: string, items: Item[], total: number }
  | { type: "OrderPaid",    id: string, paymentId: string }
  | { type: "OrderShipped", id: string, carrier: string };

async function handle(cmd: PlaceOrder) {
  const ok = validate(cmd);
  if (!ok) throw new BadRequest();
  await kafka.produce("orders.events", cmd.id, { type: "OrderPlaced", ... });
}

// projector
async function project(evt: OrderEvent) {
  if (evt.type === "OrderPlaced") {
    await redis.hset(\`order:\${evt.id}\`, { state: "placed", total: evt.total });
  }
}`}
        />
      }
    />
  );
}
