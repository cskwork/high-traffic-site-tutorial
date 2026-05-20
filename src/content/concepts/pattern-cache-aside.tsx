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

export default function PatternCacheAside() {
  const concept = conceptBySlug["pattern-cache-aside"]!;
  const { play, ping } = useAudio();
  const [scenario, setScenario] = useState<"hit" | "miss" | "write">("hit");
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const beats =
    scenario === "hit"
      ? [0, 1] // app → redis → app
      : scenario === "miss"
        ? [0, 2, 3, 4] // app → redis (miss) → db → redis (set) → app
        : [5, 6, 7]; // app → db (write) → redis (invalidate)

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Read-heavy workloads love cache-aside: try Redis first. On miss, load from the DB and
            write back. On write, update DB and invalidate the cached value. The cache stays a
            faithful read-through, not a write target.
          </p>
          <Bullets
            items={[
              { heading: "Stampede", body: "Many misses for the same hot key hit the DB at once. Protect with single-flight (SETNX + TTL) or request coalescing." },
              { heading: "Negative caching", body: "Cache 'not found' too — short TTL — so 404s do not pummel the DB." },
              { heading: "Staleness", body: "Set a TTL even with explicit invalidation; it bounds drift if an invalidate is missed." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Cache → DB · read miss · write invalidate" height={320}>
          <MessageFlow
            running
            beats={beats}
            intervalMs={780}
            onBeat={(b, _edge) => {
              if (scenario === "miss" && b === 0) {
                setMisses((n) => n + 1);
                void ping("pluck", "G4");
              } else if (scenario === "hit") {
                setHits((n) => n + 1);
                void ping("pluck", "C5");
              } else if (scenario === "write") {
                void ping("pluck", "E5");
              }
            }}
            nodes={[
              { id: "a", label: "app", sub: "service", kind: "producer", x: 0.08, y: 0.5 },
              { id: "c", label: "redis", sub: "cache", kind: "broker", x: 0.42, y: 0.32 },
              { id: "d", label: "db", sub: "primary", kind: "store", x: 0.42, y: 0.78 },
            ]}
            edges={[
              { from: "a", to: "c", label: "GET" },
              { from: "c", to: "a", label: "hit" },
              { from: "c", to: "a", label: "miss" },
              { from: "a", to: "d", label: "SELECT" },
              { from: "d", to: "c", label: "SETEX" },
              { from: "a", to: "d", label: "UPDATE" },
              { from: "d", to: "c", label: "DEL" },
              { from: "c", to: "a", label: "ok" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["hit", "miss", "write"] as const).map((s) => (
            <ActionButton
              key={s}
              label={s}
              primary={scenario === s}
              onAction={() => {
                setScenario(s);
                void ping("pluck", s === "hit" ? "C5" : s === "miss" ? "G4" : "E5");
              }}
            />
          ))}
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="hits" value={hits} />
          <CounterDisplay label="misses" value={misses} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="go"
          code={`func GetUser(ctx context.Context, id string) (*User, error) {
  if u, ok := cache.Get(ctx, "user:"+id); ok { return u, nil }
  u, err := db.QueryUser(ctx, id)
  if err != nil { return nil, err }
  cache.SetEX(ctx, "user:"+id, u, 5*time.Minute)
  return u, nil
}

func UpdateUser(ctx context.Context, u *User) error {
  if err := db.UpdateUser(ctx, u); err != nil { return err }
  return cache.Del(ctx, "user:"+u.ID)
}`}
        />
      }
    />
  );
}
