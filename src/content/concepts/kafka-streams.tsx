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

export default function KafkaStreams() {
  const concept = conceptBySlug["kafka-streams"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [windowed, setWindowed] = useState(0);

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Streams is a Java library that turns topics into transformations. Operators are
            stateless (filter, map) or stateful (aggregate, join, window). State lives in local
            RocksDB and is durable via changelog topics.
          </p>
          <Bullets
            items={[
              { heading: "KStream vs KTable", body: "KStream = a log. KTable = the latest value per key. join across them like SQL." },
              { heading: "Windows", body: "Tumbling, hopping, session, sliding — group records by event time, not wall clock." },
              { heading: "Local state", body: "State stores are sharded by partition. Failover restores from the changelog topic." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="raw → filter → aggregate(window) → sink" height={320}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2, 3]}
            intervalMs={750}
            onBeat={(_, edge) => {
              const notes = ["C4", "D4", "F4", "Bb4"];
              const note = notes[edge] ?? "C5";
              void ping("pad", note);
              if (edge === 2) setWindowed((n) => n + 1);
            }}
            nodes={[
              { id: "raw", label: "raw events", sub: "topic", kind: "broker", x: 0.06, y: 0.5 },
              { id: "flt", label: "filter", sub: "stateless", kind: "queue", x: 0.32, y: 0.5 },
              { id: "agg", label: "windowed sum", sub: "stateful 60s", kind: "store", x: 0.62, y: 0.5 },
              { id: "out", label: "metrics", sub: "topic", kind: "broker", x: 0.92, y: 0.5 },
            ]}
            edges={[
              { from: "raw", to: "flt", label: "filter(...)" },
              { from: "flt", to: "agg", label: "groupBy(key)" },
              { from: "agg", to: "out", label: "window 60s" },
              { from: "out", to: "raw", label: "(changelog)" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label="topology" value={running} onToggle={() => setRunning((v) => !v)} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="aggregated windows" value={windowed} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`StreamsBuilder b = new StreamsBuilder();
KStream<String, Click> clicks = b.stream("clicks");

clicks
  .filter((k, v) -> v.userId() != null)
  .groupBy((k, v) -> v.userId())
  .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofSeconds(60)))
  .count()
  .toStream()
  .to("clicks-per-min", Produced.with(Serdes.String(), Serdes.Long()));`}
        />
      }
    />
  );
}
