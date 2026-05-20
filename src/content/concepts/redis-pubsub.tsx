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

export default function RedisPubsub() {
  const concept = conceptBySlug["redis-pubsub"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [delivered, setDelivered] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            PUBLISH and SUBSCRIBE are fire-and-forget. The server fans out to every connected
            subscriber and forgets immediately. No persistence, no replay — perfect for live UI
            updates, not for durable events.
          </p>
          <Bullets
            items={[
              { heading: "Disconnected = silent", body: "A subscriber that drops misses messages forever. Use Streams if you need ack/replay." },
              { heading: "Pattern subscribe", body: "PSUBSCRIBE chat.* matches channels by glob. Useful for room-style routing." },
              { heading: "Sharded pub/sub", body: "SPUBLISH/SSUBSCRIBE confine to one shard in Cluster, avoiding the all-nodes broadcast." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="One publisher · many subscribers · no persistence" height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2]}
            intervalMs={780}
            onBeat={(_, edge) => {
              setDelivered((n) => n + 1);
              const notes = ["G4", "B4", "D5"];
              const note = notes[edge] ?? "C5";
              void ping("pluck", note);
            }}
            nodes={[
              { id: "p", label: "PUBLISH room:42", sub: "publisher", kind: "producer", x: 0.07, y: 0.5 },
              { id: "r", label: "redis", sub: "broker", kind: "broker", x: 0.42, y: 0.5 },
              { id: "s1", label: "tab A", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.2 },
              { id: "s2", label: "tab B", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.5 },
              { id: "s3", label: "tab C", sub: "subscriber", kind: "consumer", x: 0.85, y: 0.8 },
            ]}
            edges={[
              { from: "p", to: "r", label: "publish" },
              { from: "r", to: "s1", label: "→" },
              { from: "r", to: "s2", label: "→" },
              { from: "r", to: "s3", label: "→" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="publisher" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="delivered" value={delivered} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# tab 1
SUBSCRIBE room:42

# tab 2
PSUBSCRIBE room:*

# producer
PUBLISH room:42 '{"msg":"hi"}'   # → integer reply: 2 (delivered to 2 subscribers)`}
        />
      }
    />
  );
}
