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

export default function PatternWriteThrough() {
  const concept = conceptBySlug["pattern-write-through"]!;
  const { play, ping } = useAudio();
  const [mode, setMode] = useState<"write-through" | "write-behind">("write-through");

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Write-through writes the cache synchronously, then the DB. Read-after-write is
            consistent. Write-behind batches DB writes for throughput at the cost of durability
            during crashes. Pick by whether 'lost the last batch' is acceptable.
          </p>
          <Bullets
            items={[
              { heading: "Write-through", body: "Cache holds the source of truth temporarily; same transaction propagates to DB. Reads are always cache-consistent." },
              { heading: "Write-behind", body: "Cache acks fast, a worker flushes to DB. Add a Kafka outbox if you can't lose pending writes." },
              { heading: "Hot keys", body: "Both patterns put writes on the cache; size and shard accordingly." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Where does the write commit?" height={320}>
          <MessageFlow
            running
            beats={mode === "write-through" ? [0, 1] : [0, 2]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["E4", "A4", "C5"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
            }}
            nodes={[
              { id: "a", label: "app", sub: "service", kind: "producer", x: 0.08, y: 0.5 },
              { id: "c", label: "redis", sub: "cache", kind: "broker", x: 0.45, y: 0.5 },
              { id: "d", label: "db", sub: "primary", kind: "store", x: 0.85, y: 0.5 },
            ]}
            edges={[
              { from: "a", to: "c", label: "write" },
              { from: "c", to: "d", label: mode === "write-through" ? "sync flush" : "" },
              { from: "c", to: "d", label: mode === "write-behind" ? "async batch" : "" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["write-through", "write-behind"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("pad", m === "write-through" ? "E4" : "A4");
              }}
            />
          ))}
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label="durability"
            value={mode === "write-through" ? 2 : 1}
            hint={mode === "write-through" ? "DB + cache" : "cache only (until flush)"}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="ts"
          code={`async function setUser(u: User) {
  // write-through
  await redis.set(\`user:\${u.id}\`, JSON.stringify(u));
  await db.update("users", u);
}

async function setUserWriteBehind(u: User) {
  await redis.set(\`user:\${u.id}\`, JSON.stringify(u));
  await redis.xadd("dirty:users", "*", "id", u.id);   // worker drains
}`}
        />
      }
    />
  );
}
