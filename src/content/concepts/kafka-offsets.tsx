import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
  SandboxSlider,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";

export default function KafkaOffsets() {
  const concept = conceptBySlug["kafka-offsets"]!;
  const { play, ping } = useAudio();
  const [offset, setOffset] = useState(7);
  const high = 20;

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Inside a partition, every record gets a monotonically increasing integer offset.
            A consumer just remembers "I am at offset N". To replay, set it back.
          </p>
          <Bullets
            items={[
              { heading: "Per-partition", body: "Offsets are per-partition, not per-topic. Each partition is its own ordered tape." },
              { heading: "Stored per group", body: "Kafka stores committed offsets in a special internal topic, keyed by group + partition." },
              { heading: "Replay = seek", body: "consumer.seek(partition, n) jumps the playback head. Retention determines how far back you can go." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="One partition · the playback head moves" height={260}>
          <svg viewBox="0 0 720 220" className="h-full w-full">
            <g transform="translate(40,80)">
              {Array.from({ length: high + 1 }).map((_, i) => {
                const active = i <= offset;
                return (
                  <g key={i} transform={`translate(${i * 30},0)`}>
                    <rect
                      x={-12}
                      y={-22}
                      width={24}
                      height={44}
                      rx={3}
                      fill={active ? "var(--concept-soft)" : "#11141b"}
                      stroke={active ? "var(--concept)" : "rgba(255,255,255,0.08)"}
                      strokeWidth={1}
                    />
                    <text textAnchor="middle" y={6} fontSize="10" fill="#cfd4df" fontFamily="JetBrains Mono">
                      {i}
                    </text>
                  </g>
                );
              })}
              <g transform={`translate(${offset * 30}, -48)`}>
                <path d="M0,18 L-8,0 L8,0 Z" fill="var(--concept)" />
                <text textAnchor="middle" y={-4} fontSize="10" fill="var(--concept)" fontFamily="JetBrains Mono">
                  consumer head
                </text>
              </g>
              <text x={0} y={50} fontSize="10" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                offset 0
              </text>
              <text x={high * 30} y={50} fontSize="10" textAnchor="end" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                high-water {high}
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label="seek offset"
            min={0}
            max={high}
            step={1}
            value={offset}
            onValueChange={(v) => {
              setOffset(v);
              void ping("bell", "C5");
            }}
            className="w-56"
          />
          <ActionButton
            label="rewind to 0"
            onAction={() => {
              setOffset(0);
              void ping("bell", "G4");
            }}
          />
          <ActionButton
            label="seek to latest"
            onAction={() => {
              setOffset(high);
              void ping("bell", "G5");
            }}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="position" value={offset} hint={`/${high}`} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="java"
          code={`var topic = new TopicPartition("orders", 0);
consumer.assign(List.of(topic));

// Rewind one minute
long minuteAgo = System.currentTimeMillis() - 60_000L;
var map = consumer.offsetsForTimes(Map.of(topic, minuteAgo));
consumer.seek(topic, map.get(topic).offset());`}
        />
      }
    />
  );
}
