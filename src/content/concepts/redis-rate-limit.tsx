import { useEffect, useState } from "react";
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
import { T, useT } from "@/i18n/T";

export default function RedisRateLimit() {
  const concept = conceptBySlug["redis-rate-limit"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [capacity, setCapacity] = useState(10);
  const [refill, setRefill] = useState(2); // tokens per second
  const [tokens, setTokens] = useState(10);
  const [allowed, setAllowed] = useState(0);
  const [denied, setDenied] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTokens((t) => Math.min(capacity, t + refill));
    }, 1000);
    return () => window.clearInterval(id);
  }, [capacity, refill]);

  useEffect(() => {
    setTokens((t) => Math.min(capacity, t));
  }, [capacity]);

  const drop = () => {
    if (tokens > 0) {
      setTokens((t) => t - 1);
      setAllowed((a) => a + 1);
      void ping("noise");
    } else {
      setDenied((d) => d + 1);
      void ping("bell", "B3");
    }
  };

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="A token bucket is the classic recipe. Capacity = burst. Refill rate = sustained. INCR with EXPIRE, or store tokens + last-refill timestamp in a key and atomically update with Lua. Sliding-window uses a sorted set of timestamps; old ones are ZREM'd at the edge." ko="토큰 버킷이 가장 일반적인 구현 방식입니다. Capacity(용량)는 최대 버스트, refill rate(보충 속도)는 지속 처리량을 의미합니다. INCR과 EXPIRE를 조합하거나, 토큰 수와 마지막 보충 타임스탬프를 키에 저장하고 Lua로 원자적으로 업데이트합니다. 슬라이딩 윈도우는 타임스탬프 정렬된 셋(ZSET)을 사용하며, 윈도우 경계를 넘은 오래된 항목을 ZREM합니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "Token bucket", ko: "토큰 버킷" }), body: t({ en: "Smooths bursts. Simple to reason about. Pick capacity for the max burst you'll accept.", ko: "버스트를 완화합니다. 이해하기 쉬운 방식입니다. 허용할 최대 버스트에 맞게 capacity를 설정하세요." }) },
              { heading: t({ en: "Fixed window", ko: "고정 윈도우" }), body: t({ en: "INCR key, EXPIRE to window size. Cheap but burst-prone at boundaries.", ko: "INCR 키에 EXPIRE를 윈도우 크기로 설정합니다. 구현이 간단하지만 윈도우 경계에서 버스트가 발생할 수 있습니다." }) },
              { heading: t({ en: "Sliding window", ko: "슬라이딩 윈도우" }), body: t({ en: "ZADD timestamps, ZREMRANGEBYSCORE older than now-window, ZCARD to count. More accurate.", ko: "ZADD로 타임스탬프를 추가하고, ZREMRANGEBYSCORE로 윈도우 바깥의 항목을 제거한 뒤 ZCARD로 셉니다. 더 정확합니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Token bucket — drop a request, watch tokens drain", ko: "토큰 버킷 — 요청을 보내 토큰이 줄어드는 걸 확인하세요" })} height={300}>
          <svg viewBox="0 0 720 240" className="h-full w-full">
            <g transform="translate(60,40)">
              {Array.from({ length: capacity }).map((_, i) => {
                const filled = i < tokens;
                const x = (i % 10) * 50;
                const y = Math.floor(i / 10) * 50;
                return (
                  <g key={i} transform={`translate(${x},${y})`}>
                    <rect
                      width={40}
                      height={40}
                      rx={6}
                      fill={filled ? "var(--concept-soft)" : "#11141b"}
                      stroke={filled ? "var(--concept)" : "rgba(255,255,255,0.06)"}
                    />
                  </g>
                );
              })}
              <text x={0} y={Math.ceil(capacity / 10) * 50 + 30} fontSize="11" fill="rgba(207,212,223,0.8)" fontFamily="JetBrains Mono">
                tokens {tokens}/{capacity} · refill {refill}/s
              </text>
            </g>
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label={t({ en: "capacity", ko: "용량" })}
            min={5}
            max={30}
            step={1}
            value={capacity}
            onValueChange={(v) => setCapacity(Math.round(v))}
            className="w-44"
          />
          <SandboxSlider
            label={t({ en: "refill/s", ko: "보충/초" })}
            min={0}
            max={10}
            step={1}
            value={refill}
            onValueChange={(v) => setRefill(Math.round(v))}
            className="w-40"
          />
          <ActionButton label={t({ en: "request", ko: "요청" })} primary onAction={drop} />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "allowed", ko: "허용됨" })} value={allowed} />
          <CounterDisplay label={t({ en: "denied", ko: "거부됨" })} value={denied} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="lua"
          code={`-- token bucket as a Lua script
-- KEYS[1] = bucket key  ARGV[1] = capacity  ARGV[2] = refill/s  ARGV[3] = now_ms
local cap, refill, now = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
local data = redis.call('HMGET', KEYS[1], 'tokens', 'last')
local tokens = tonumber(data[1]) or cap
local last   = tonumber(data[2]) or now

local elapsed = math.max(0, now - last) / 1000
tokens = math.min(cap, tokens + elapsed * refill)

if tokens < 1 then
  redis.call('HMSET', KEYS[1], 'tokens', tokens, 'last', now)
  return 0
end
redis.call('HMSET', KEYS[1], 'tokens', tokens - 1, 'last', now)
return 1`}
        />
      }
    />
  );
}
