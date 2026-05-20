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

export default function PatternOutbox() {
  const concept = conceptBySlug["pattern-outbox"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [emitted, setEmitted] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            The dual-write problem: write to the DB <em>and</em> publish to Kafka, both with their
            own failure modes. The outbox pattern collapses them: write the business row + an
            outbox row in the same DB transaction; a relay (or Debezium CDC) tails the outbox and
            publishes to Kafka.
          </p>
          <Bullets
            items={[
              { heading: "One transaction", body: "Either both rows commit or neither. No more 'paid but no event'." },
              { heading: "Relay options", body: "Polling worker on the outbox table, or CDC (Debezium) on the WAL/binlog. Both deliver at-least-once." },
              { heading: "Idempotent consumers", body: "Use the outbox row's UUID as the Kafka key; downstream dedupes by it." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Business write + outbox write — one txn — relay" height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["F3", "A3", "C4", "F4"];
              const note = notes[edge] ?? "C4";
              void ping("bell", note);
              if (edge === 2) setEmitted((n) => n + 1);
            }}
            nodes={[
              { id: "a", label: "service", sub: "txn", kind: "producer", x: 0.08, y: 0.5 },
              { id: "db", label: "orders + outbox", sub: "1 commit", kind: "store", x: 0.4, y: 0.5 },
              { id: "rel", label: "relay / CDC", sub: "tail", kind: "queue", x: 0.68, y: 0.5 },
              { id: "k", label: "orders.events", sub: "kafka", kind: "broker", x: 0.94, y: 0.5 },
            ]}
            edges={[
              { from: "a", to: "db", label: "INSERT order" },
              { from: "a", to: "db", label: "INSERT outbox" },
              { from: "db", to: "rel", label: "tail" },
              { from: "rel", to: "k", label: "publish" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="relay" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="events emitted" value={emitted} hint="at-least-once" />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="sql"
          code={`-- one transaction does both writes
BEGIN;
  INSERT INTO orders(id, user_id, total)
       VALUES ($1, $2, $3);
  INSERT INTO outbox(id, aggregate, payload, created_at)
       VALUES (gen_random_uuid(), 'order', $4::jsonb, now());
COMMIT;

-- relay loop (worker, every 200ms)
SELECT id, payload FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 100;
-- publish to Kafka, then:
UPDATE outbox SET published_at = now() WHERE id = ANY($1);`}
        />
      }
    />
  );
}
