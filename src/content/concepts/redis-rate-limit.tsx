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

export default function RedisRateLimit() {
  const concept = conceptBySlug["redis-rate-limit"]!;
  const { play, ping } = useAudio();
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
            A token bucket is the classic recipe. Capacity = burst. Refill rate = sustained. INCR
            with EXPIRE, or store tokens + last-refill timestamp in a key and atomically update with
            Lua. Sliding-window uses a sorted set of timestamps; old ones are ZREM'd at the edge.
          </p>
          <Bullets
            items={[
              { heading: "Token bucket", body: "Smooths bursts. Simple to reason about. Pick capacity for the max burst you'll accept." },
              { heading: "Fixed window", body: "INCR key, EXPIRE to window size. Cheap but burst-prone at boundaries." },
              { heading: "Sliding window", body: "ZADD timestamps, ZREMRANGEBYSCORE older than now-window, ZCARD to count. More accurate." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="Token bucket — drop a request, watch tokens drain" height={300}>
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
            label="capacity"
            min={5}
            max={30}
            step={1}
            value={capacity}
            onValueChange={(v) => setCapacity(Math.round(v))}
            className="w-44"
          />
          <SandboxSlider
            label="refill/s"
            min={0}
            max={10}
            step={1}
            value={refill}
            onValueChange={(v) => setRefill(Math.round(v))}
            className="w-40"
          />
          <ActionButton label="request" primary onAction={drop} />
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="allowed" value={allowed} />
          <CounterDisplay label="denied" value={denied} />
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
