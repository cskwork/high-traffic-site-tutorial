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
import { useT } from "@/i18n/T";

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
  const t = useT();
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
            {t({
              en: "A Redis sorted set keeps members ranked by a numeric score in O(log N). Increment with ZINCRBY, read the top N with ZREVRANGE, find a player's rank with ZREVRANK. Pair with Kafka if you want every score change to fan out to other consumers.",
              ko: "레디스 정렬된 셋은 숫자 점수로 멤버를 O(log N)에 순위 정렬합니다. ZINCRBY로 증가시키고, ZREVRANGE로 상위 N명을 조회하며, ZREVRANK로 특정 플레이어의 순위를 찾습니다. 점수 변경을 다른 컨슈머에 팬아웃하려면 카프카와 조합하세요.",
            })}
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Time-bucketed boards", ko: "시간 버킷 리더보드" }),
                body: t({
                  en: "Use one ZSET per day (lb:2026-05-20). TTL old ones; aggregate into a 'season' ZSET periodically.",
                  ko: "하루에 ZSET 하나(lb:2026-05-20). 오래된 것은 TTL로 삭제하고, 주기적으로 '시즌' ZSET에 집계하세요.",
                }),
              },
              {
                heading: t({ en: "Tiebreaks", ko: "동점 처리" }),
                body: t({
                  en: "Pack a secondary signal into the score's fractional bits — e.g. score * 1e6 - earlier_timestamp.",
                  ko: "점수의 소수 부분에 보조 신호를 넣으세요. 예: score * 1e6 - earlier_timestamp.",
                }),
              },
              {
                heading: t({ en: "Pagination", ko: "페이지네이션" }),
                body: t({
                  en: "ZREVRANGE BYSCORE / BYLEX with LIMIT for cheap paginated rows; ZRANGESTORE for materialized snapshots.",
                  ko: "LIMIT과 함께 ZREVRANGE BYSCORE / BYLEX로 저렴하게 페이지네이션하고, 머터리얼라이즈드 스냅샷에는 ZRANGESTORE를 사용하세요.",
                }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "zset(leaderboard) — live ranked rows", ko: "zset(리더보드) — 실시간 순위" })} height={320}>
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
            label={t({ en: "reset", ko: "초기화" })}
            onAction={() => {
              setRows([...initial]);
              void ping("bell", "C5");
            }}
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "rows", ko: "행 수" })} value={rows.length} />
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
