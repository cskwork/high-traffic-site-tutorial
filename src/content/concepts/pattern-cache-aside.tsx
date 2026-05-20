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
import { useT } from "@/i18n/T";

export default function PatternCacheAside() {
  const t = useT();
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
            {t({
              en: "Read-heavy workloads love cache-aside: try Redis first. On miss, load from the DB and write back. On write, update DB and invalidate the cached value. The cache stays a faithful read-through, not a write target.",
              ko: "읽기가 많은 워크로드는 캐시 어사이드를 선호합니다. 레디스를 먼저 확인하고, 미스 시 DB에서 불러와 캐시에 저장합니다. 쓰기 시에는 DB를 갱신하고 캐시를 무효화합니다. 캐시는 충실한 읽기 캐시로 유지되며, 쓰기 대상이 되지 않습니다.",
            })}
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Stampede", ko: "스탬피드" }),
                body: t({
                  en: "Many misses for the same hot key hit the DB at once. Protect with single-flight (SETNX + TTL) or request coalescing.",
                  ko: "같은 핫 키에 대한 다수의 미스가 DB를 동시에 강타합니다. 싱글 플라이트(SETNX + TTL) 또는 요청 합치기로 방어하세요.",
                }),
              },
              {
                heading: t({ en: "Negative caching", ko: "네거티브 캐싱" }),
                body: t({
                  en: "Cache 'not found' too — short TTL — so 404s do not pummel the DB.",
                  ko: "'찾을 수 없음'도 짧은 TTL로 캐싱하세요. 그래야 404 응답이 DB를 두드리지 않습니다.",
                }),
              },
              {
                heading: t({ en: "Staleness", ko: "오래된 데이터" }),
                body: t({
                  en: "Set a TTL even with explicit invalidation; it bounds drift if an invalidate is missed.",
                  ko: "명시적 무효화를 사용하더라도 TTL을 설정하세요. 무효화가 누락될 때 데이터 편차를 제한합니다.",
                }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Cache → DB · read miss · write invalidate", ko: "캐시 → DB · 읽기 미스 · 쓰기 무효화" })} height={320}>
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
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "hits", ko: "히트" })} value={hits} />
          <CounterDisplay label={t({ en: "misses", ko: "미스" })} value={misses} />
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
