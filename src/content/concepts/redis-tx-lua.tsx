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

export default function RedisTxLua() {
  const concept = conceptBySlug["redis-tx-lua"]!;
  const { play, ping } = useAudio();
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<"multi-exec" | "watch" | "lua">("lua");

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            Redis is single-threaded for commands. MULTI/EXEC queues commands and runs them
            atomically. WATCH adds optimistic concurrency — abort if a watched key changed. Lua
            scripts execute server-side, all-or-nothing.
          </p>
          <Bullets
            items={[
              { heading: "MULTI/EXEC", body: "Queue commands, atomic batch. Replies come back as an array." },
              { heading: "WATCH", body: "Optimistic CAS: if any WATCH'd key changes before EXEC, the txn aborts (nil reply)." },
              { heading: "Lua / EVAL", body: "Server-side scripts run atomically. Faster than multi roundtrip when you need branching logic." },
            ]}
          />
        </>
      }
      viz={
        <Stage label="One atomic step on the single-threaded server" height={300}>
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
          <Toggle label="step" value={running} onToggle={() => setRunning((v) => !v)} />
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
          <ActionButton label="play motif" primary onAction={() => void play(concept.motif)} />
          <CounterDisplay label="roundtrips" value={mode === "lua" ? 1 : mode === "multi-exec" ? 2 : 3} />
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
