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
import { T, useT } from "@/i18n/T";

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
  const t = useT();
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
            <T en="Redis is a typed in-memory data structure server. Each command targets one of these primitives — pick by the access pattern you actually need." ko="레디스는 타입이 있는 인메모리 데이터 구조 서버입니다. 각 명령은 이 중 하나의 기본 타입을 대상으로 합니다. 실제 필요한 접근 패턴에 맞는 타입을 고르세요." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Strings", ko: "문자열" }), body: t({ en: "Binary-safe bytes. KV cache, counters (INCR), bit ops, JSON blobs.", ko: "바이너리 안전 바이트입니다. KV 캐시, 카운터(INCR), 비트 연산, JSON 저장에 활용합니다." }) },
              { heading: t({ en: "Hashes", ko: "해시" }), body: t({ en: "Small object maps with field-level reads. Great for user profiles.", ko: "필드 단위로 읽을 수 있는 소형 객체 맵입니다. 사용자 프로필 저장에 적합합니다." }) },
              { heading: t({ en: "Lists / Sets / ZSets", ko: "리스트 / 셋 / 정렬된 셋(ZSET)" }), body: t({ en: "Queues, unique sets, ranked sets — each with O(1) or O(log N) operations.", ko: "큐, 중복 없는 셋, 순위 셋을 제공합니다. 각각 O(1) 또는 O(log N) 연산을 지원합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Data-type playground", ko: "데이터 타입 체험" })} height={300}>
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
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "picked", ko: "선택됨" })} value={1} hint={active.toUpperCase()} />
        </SandboxControls>
      }
      code={<CodeBlock lang="bash" code={previews[active]} />}
    />
  );
}
