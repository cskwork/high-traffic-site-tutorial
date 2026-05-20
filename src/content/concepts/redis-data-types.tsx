import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import {
  SandboxControls,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";

type Kind = "string" | "hash" | "list" | "set" | "zset";

const palette: Record<Kind, { note: string; color: string }> = {
  string: { note: "C5", color: "#ffb454" },
  hash: { note: "E5", color: "#ff6a6a" },
  list: { note: "G5", color: "#5be6ee" },
  set: { note: "A5", color: "#a78bfa" },
  zset: { note: "B5", color: "#fbbf24" },
};

export default function RedisDataTypes() {
  const concept = conceptBySlug["redis-data-types"]!;
  const { play, ping } = useAudio();
  const [active, setActive] = useState<Kind>("string");

  const previews: Record<Kind, string> = {
    string: `SET user:42:name "Ada"\nGET user:42:name\n# → "Ada"`,
    hash: `HSET user:42 name "Ada" age 36\nHGETALL user:42\n# 1) "name" 2) "Ada" 3) "age" 4) "36"`,
    list: `LPUSH queue:jobs "send-email-1"\nLPUSH queue:jobs "send-email-2"\nRPOP queue:jobs\n# → "send-email-1"`,
    set: `SADD online:users 7 11 42\nSISMEMBER online:users 42  # → 1\nSCARD online:users          # → 3`,
    zset: `ZADD leaderboard 1200 ada 980 bob 1410 chi\nZREVRANGE leaderboard 0 2 WITHSCORES\n# 1) chi 1410 2) ada 1200 3) bob 980`,
  };

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Redis is a typed in-memory data structure server. Each command targets one of these
            primitives — pick by the access pattern you actually need.
          </p>
          <Bullets
            items={[
              { heading: "Strings", body: "Binary-safe bytes. KV cache, counters (INCR), bit ops, JSON blobs." },
              { heading: "Hashes", body: "Small object maps with field-level reads. Great for user profiles." },
              { heading: "Lists / Sets / ZSets", body: "Queues, unique sets, ranked sets — each with O(1) or O(log N) operations." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Data-type playground" height={300}>
          <div className="absolute inset-0 grid grid-cols-5 gap-3 p-5">
            {(Object.keys(palette) as Kind[]).map((k) => {
              const isActive = active === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setActive(k);
                    void ping("pluck", palette[k].note);
                  }}
                  className={
                    "group relative flex flex-col items-center justify-center gap-2 rounded-xl border " +
                    (isActive ? "border-pattern-300 bg-white/[0.04]" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]")
                  }
                  aria-pressed={isActive}
                >
                  <span
                    aria-hidden
                    className="block h-2 w-2 rounded-full"
                    style={{ background: palette[k].color }}
                  />
                  <span className="font-mono text-sm text-ink-100">{k.toUpperCase()}</span>
                  <span className="text-[0.65rem] text-ink-300">{palette[k].note}</span>
                </button>
              );
            })}
          </div>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="picked" value={1} hint={active.toUpperCase()} />
        </SandboxControls>
      }
      code={<CodeBlock lang="bash" code={previews[active]} />}
    />
  );
}
