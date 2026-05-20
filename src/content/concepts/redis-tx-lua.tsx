import { useState } from "react";
import { ConceptLayout, Bullets, CodeBlock } from "@/components/concept/ConceptLayout";
import { Stage } from "@/viz/Stage";
import { MessageFlow } from "@/viz/MessageFlow";
import {
  SandboxControls,
  Toggle,
  ActionButton,
  CounterDisplay,
} from "@/components/concept/SandboxControls";
import { conceptBySlug } from "@/content/registry";
import { useAudio } from "@/audio/useAudio";
import { T, useT } from "@/i18n/T";

export default function RedisTxLua() {
  const concept = conceptBySlug["redis-tx-lua"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<"multi-exec" | "watch" | "lua">("lua");

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T en="Redis is single-threaded for commands. MULTI/EXEC queues commands and runs them atomically. WATCH adds optimistic concurrency — abort if a watched key changed. Lua scripts execute server-side, all-or-nothing." ko="레디스는 명령 처리가 단일 스레드입니다. MULTI/EXEC는 명령을 큐에 쌓아 원자적으로 실행합니다. WATCH는 낙관적 동시성을 추가합니다. 감시 중인 키가 변경되면 트랜잭션을 중단합니다. Lua 스크립트는 서버 측에서 전부 아니면 전무(all-or-nothing) 방식으로 실행됩니다." />
          </p>
          <Bullets
            items={[
              { heading: t({ en: "MULTI/EXEC", ko: "MULTI/EXEC" }), body: t({ en: "Queue commands, atomic batch. Replies come back as an array.", ko: "명령을 큐에 쌓아 원자적 배치로 실행합니다. 응답은 배열로 반환됩니다." }) },
              { heading: t({ en: "WATCH", ko: "WATCH" }), body: t({ en: "Optimistic CAS: if any WATCH'd key changes before EXEC, the txn aborts (nil reply).", ko: "낙관적 CAS입니다. EXEC 전에 감시 중인 키가 변경되면 트랜잭션이 중단됩니다(nil 응답)." }) },
              { heading: t({ en: "Lua / EVAL", ko: "Lua / EVAL" }), body: t({ en: "Server-side scripts run atomically. Faster than multi roundtrip when you need branching logic.", ko: "서버 측 스크립트로 원자적으로 실행됩니다. 분기 로직이 필요할 때 여러 번 왕복하는 것보다 빠릅니다." }) },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "One atomic step on the single-threaded server", ko: "단일 스레드 서버에서의 원자적 처리" })} height={300}>
          <MessageFlow
            running={running}
            beats={[0, 1, 2]}
            intervalMs={780}
            onBeat={(_, edge) => {
              const notes = ["F4", "Ab4", "C5"];
              const note = notes[edge] ?? "C5";
              void ping("pluck", note);
            }}
            nodes={[
              { id: "c", label: "client", sub: mode, kind: "producer", x: 0.08, y: 0.5 },
              { id: "q", label: "server queue", sub: "single thread", kind: "queue", x: 0.4, y: 0.5 },
              { id: "r", label: "execute", sub: "atomic", kind: "broker", x: 0.7, y: 0.5 },
              { id: "s", label: "state", sub: "kv", kind: "store", x: 0.94, y: 0.5 },
            ]}
            edges={[
              { from: "c", to: "q", label: mode === "lua" ? "EVAL" : "MULTI" },
              { from: "q", to: "r", label: "atomic" },
              { from: "r", to: "s", label: "apply" },
            ]}
          />
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <Toggle label={t({ en: "step", ko: "단계" })} value={running} onToggle={() => setRunning((v) => !v)} />
          {(["multi-exec", "watch", "lua"] as const).map((m) => (
            <ActionButton
              key={m}
              label={m}
              primary={mode === m}
              onAction={() => {
                setMode(m);
                void ping("pluck", m === "lua" ? "C5" : m === "watch" ? "Ab4" : "F4");
              }}
            />
          ))}
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label={t({ en: "roundtrips", ko: "왕복 횟수" })} value={mode === "lua" ? 1 : mode === "multi-exec" ? 2 : 3} />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="lua"
          code={`-- buy.lua: decrement stock, charge wallet, atomically
local stock = tonumber(redis.call('GET', KEYS[1]))
local wallet = tonumber(redis.call('GET', KEYS[2]))
local price = tonumber(ARGV[1])

if stock < 1   then return {-1, 'oos'} end
if wallet < price then return {-2, 'broke'} end

redis.call('DECR', KEYS[1])
redis.call('DECRBY', KEYS[2], price)
return {1, 'ok'}`}
        />
      }
    />
  );
}
