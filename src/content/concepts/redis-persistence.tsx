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

type Mode = "rdb" | "aof" | "hybrid";

export default function RedisPersistence() {
  const concept = conceptBySlug["redis-persistence"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [mode, setMode] = useState<Mode>("hybrid");

  const traits: Record<Mode, { dur: string; size: string; recover: string }> = {
    rdb: { dur: "minutes", size: "small", recover: "fast" },
    aof: { dur: "≤ 1 second (everysec)", size: "large", recover: "slow (replay)" },
    hybrid: { dur: "≤ 1 second", size: "medium", recover: "fast (RDB preamble + AOF tail)" },
  };

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="Redis persistence is a trade between compactness, durability, and recovery speed. RDB is a periodic snapshot. AOF is a write-ahead log. Hybrid prepends an RDB to the AOF — best of both at the cost of more disk." ko="레디스 영속화는 압축성, 내구성, 복구 속도 사이의 트레이드오프입니다. RDB는 주기적인 스냅샷, AOF는 쓰기 전 로그(write-ahead log)입니다. 하이브리드는 AOF 앞에 RDB를 덧붙여 두 방식의 장점을 취하되, 디스크 사용량이 증가합니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "RDB", ko: "RDB" }), body: t({ en: "fork() + dump every N seconds / M changes. Tiny files, perfect for backups, lose up to N seconds of writes.", ko: "fork() 후 N초 / M번 변경마다 덤프합니다. 파일 크기가 작아 백업에 적합하지만, 최대 N초 치의 쓰기가 유실될 수 있습니다." }) },
              { heading: t({ en: "AOF", ko: "AOF" }), body: t({ en: "Append commands as they happen. fsync policy (always / everysec / no) trades durability for throughput.", ko: "명령이 발생하는 즉시 추가합니다. fsync 정책(always / everysec / no)으로 내구성과 처리량을 조절합니다." }) },
              { heading: t({ en: "Hybrid", ko: "하이브리드" }), body: t({ en: "aof-use-rdb-preamble yes — recovery is fast because most of the file is an RDB snapshot, only the tail is replayed.", ko: "aof-use-rdb-preamble yes 옵션을 사용합니다. 파일 대부분이 RDB 스냅샷이므로 복구가 빠르고, 마지막 부분만 재생합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "What lands on disk and when", ko: "디스크에 무엇이, 언제 기록되는가" })} height={280}>
          <svg viewBox="0 0 720 240" className="h-full w-full">
            <g transform="translate(40,40)">
              <rect width={640} height={60} rx={8} fill="#11141b" stroke="rgba(255,255,255,0.06)" />
              <text x={12} y={22} fontSize="11" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                time →
              </text>
              {Array.from({ length: 16 }).map((_, i) => {
                const x = 30 + i * 38;
                const isSnap = mode !== "aof" && i % 6 === 0;
                const isLog = mode !== "rdb";
                return (
                  <g key={i} transform={`translate(${x}, 36)`}>
                    {isLog ? (
                      <rect x={-3} y={-12} width={6} height={24} rx={2} fill="var(--concept-soft)" stroke="var(--concept)" />
                    ) : null}
                    {isSnap ? (
                      <circle r={9} fill="var(--concept)" opacity={0.6} />
                    ) : null}
                  </g>
                );
              })}
              <text x={0} y={110} fontSize="11" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                mode: {mode}  ·  durability {traits[mode].dur}  ·  size {traits[mode].size}  ·  recover {traits[mode].recover}
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          {(["rdb", "aof", "hybrid"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m.toUpperCase()}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("bass", m === "rdb" ? "C3" : m === "aof" ? "G3" : "Eb3");
              }}
            />
          ))}
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "data loss window", ko: "데이터 유실 허용 범위" })}
            value={mode === "rdb" ? 60 : mode === "aof" ? 1 : 1}
            hint={mode === "rdb" ? t({ en: "seconds", ko: "초" }) : t({ en: "second", ko: "초" })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="conf"
          code={`# redis.conf — hybrid persistence
save 900 1
save 300 10
save 60 10000

appendonly yes
appendfsync everysec
aof-use-rdb-preamble yes`}
        />
      }
    />
  );
}
