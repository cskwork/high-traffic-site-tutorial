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

interface Row {
  id: string;
  score: number;
}

const initial: ReadonlyArray<Row> = [
  { id: "ada", score: 1410 },
  { id: "chi", score: 1280 },
  { id: "ben", score: 1150 },
  { id: "ria", score: 990 },
  { id: "kim", score: 870 },
];

export default function PatternLeaderboard() {
  const concept = conceptBySlug["pattern-leaderboard"]!;
  const { play, ping } = useAudio();
  const [rows, setRows] = useState<Row[]>([...initial]);

  const bump = (id: string, delta: number) => {
    setRows((rs) => {
      const next = rs.map((r) => (r.id === id ? { ...r, score: r.score + delta } : r));
      next.sort((a, b) => b.score - a.score);
      return next;
    });
    void ping("bell", delta > 0 ? "E5" : "G4");
  };

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            A Redis sorted set keeps members ranked by a numeric score in O(log N). Increment with
            ZINCRBY, read the top N with ZREVRANGE, find a player's rank with ZREVRANK. Pair with
            Kafka if you want every score change to fan out to other consumers.
          </p>
          <Bullets
            items={[
              { heading: "Time-bucketed boards", body: "Use one ZSET per day (lb:2026-05-20). TTL old ones; aggregate into a 'season' ZSET periodically." },
              { heading: "Tiebreaks", body: "Pack a secondary signal into the score's fractional bits — e.g. score * 1e6 - earlier_timestamp." },
              { heading: "Pagination", body: "ZREVRANGE BYSCORE / BYLEX with LIMIT for cheap paginated rows; ZRANGESTORE for materialized snapshots." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="zset(leaderboard) — live ranked rows" height={320}>
          <div className="absolute inset-0 flex flex-col gap-2 p-5">
            {rows.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right font-mono text-xs text-ink-300">#{i + 1}</span>
                  <span className="font-mono text-sm text-ink-50">{r.id}</span>
                </div>
                <span className="font-mono text-sm" style={{ color: "var(--concept)" }}>
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {initial.map((r) => (
            <ActionButton
              key={r.id}
              label={`+50 ${r.id}`}
              onAction={() => bump(r.id, 50)}
            />
          ))}
          <ActionButton
            label="reset"
            onAction={() => {
              setRows([...initial]);
              void ping("bell", "C5");
            }}
          />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="rows" value={rows.length} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="bash"
          code={`# add or bump scores
ZINCRBY leaderboard:daily 50 ada

# top 10
ZREVRANGE leaderboard:daily 0 9 WITHSCORES

# my rank (0-based)
ZREVRANK leaderboard:daily ada

# expire old buckets, keep them lean
EXPIRE leaderboard:2026-05-20 604800`}
        />
      }
    />
  );
}
