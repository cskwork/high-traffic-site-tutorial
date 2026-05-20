import { useMemo, useState } from "react";
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

export default function KafkaConsumerGroups() {
  const concept = conceptBySlug["kafka-consumer-groups"]!;
  const { play, ping } = useAudio();
  const t = useT();
  const [partitions, setPartitions] = useState(8);
  const [consumers, setConsumers] = useState(3);

  const assignments = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < partitions; i += 1) arr.push(i % Math.max(1, consumers));
    return arr;
  }, [partitions, consumers]);

  const palette = ["#ffb454", "#5be6ee", "#ff6a6a", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"];

  return (
    <ConceptLayout
      concept={concept}
      story={
        <>
          <p>
            <T
              en="A consumer group is one logical reader. Each partition is owned by exactly one consumer in the group at a time. Add a member → rebalance reassigns slices."
              ko="컨슈머 그룹은 하나의 논리적 독자입니다. 각 파티션은 그룹 내 컨슈머 하나가 독점 소유합니다. 멤버가 추가되면 리밸런스가 발생해 할당이 재조정됩니다."
            />
          </p>
          <Bullets
            items={[
              {
                heading: t({ en: "Cap on parallelism", ko: "병렬성의 한계" }),
                body: t({ en: "More consumers than partitions = some sit idle. Pick partition count for peak parallelism, not group size.", ko: "컨슈머 수가 파티션 수를 초과하면 일부는 유휴 상태가 됩니다. 파티션 수는 그룹 크기가 아닌 최대 병렬성을 기준으로 정하세요." }),
              },
              {
                heading: t({ en: "Rebalance cost", ko: "리밸런스 비용" }),
                body: t({ en: "Joins, leaves, and crashes pause the whole group while assignments are recomputed. Sticky and cooperative assignors reduce churn.", ko: "가입·이탈·장애 시 할당이 재계산되는 동안 그룹 전체가 일시 중단됩니다. Sticky·Cooperative 어사이너를 사용하면 중단을 줄일 수 있습니다." }),
              },
              {
                heading: t({ en: "Group is the unit of progress", ko: "그룹이 진행 단위" }),
                body: t({ en: "Each group has its own committed offsets. Two groups on the same topic read independently.", ko: "각 그룹은 독립된 커밋 오프셋을 가집니다. 같은 토픽을 읽는 두 그룹은 서로 영향을 주지 않습니다." }),
              },
            ]}
          />
        </>
      }
      viz={
        <Stage label={t({ en: "Each partition → exactly one consumer", ko: "각 파티션 → 정확히 하나의 컨슈머" })} height={300}>
          <svg viewBox="0 0 720 280" className="h-full w-full">
            <g transform="translate(40,30)">
              <text fontSize="10" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                <T en="topic: orders" ko="토픽: orders" />
              </text>
              {Array.from({ length: partitions }).map((_, p) => {
                const owner = assignments[p] ?? 0;
                const color = palette[owner % palette.length] ?? "#fff";
                return (
                  <g key={p} transform={`translate(${p * 60}, 16)`}>
                    <rect
                      x={0}
                      y={0}
                      width={50}
                      height={32}
                      rx={4}
                      fill="#0b0d12"
                      stroke={color}
                      strokeWidth={1.2}
                    />
                    <text x={25} y={20} fontSize="11" textAnchor="middle" fill="#eef0f4" fontFamily="JetBrains Mono">
                      P{p}
                    </text>
                  </g>
                );
              })}
            </g>
            <g transform="translate(40,180)">
              <text fontSize="10" fill="rgba(154,163,181,0.7)" fontFamily="JetBrains Mono">
                <T en="group: warehouse" ko="그룹: warehouse" />
              </text>
              {Array.from({ length: consumers }).map((_, c) => {
                const color = palette[c % palette.length] ?? "#fff";
                const owned = assignments
                  .map((o, i) => (o === c ? i : -1))
                  .filter((i) => i >= 0);
                return (
                  <g key={c} transform={`translate(${c * 130}, 16)`}>
                    <rect x={0} y={0} width={110} height={56} rx={6} fill="#11141b" stroke={color} strokeWidth={1.2} />
                    <text x={10} y={20} fontSize="11" fill="#eef0f4" fontFamily="JetBrains Mono">
                      c-{c}
                    </text>
                    <text x={10} y={40} fontSize="10" fill="rgba(207,212,223,0.7)" fontFamily="JetBrains Mono">
                      owns {owned.length ? owned.map((i) => `P${i}`).join(",") : "—"}
                    </text>
                  </g>
                );
              })}
            </g>
            {assignments.map((owner, p) => {
              const color = palette[owner % palette.length] ?? "#fff";
              const x1 = 40 + p * 60 + 25;
              const y1 = 30 + 16 + 32;
              const x2 = 40 + owner * 130 + 55;
              const y2 = 180 + 16;
              return (
                <line
                  key={p}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={0.8}
                  opacity={0.6}
                />
              );
            })}
          </svg>
        </Stage>
      }
      sandbox={
        <SandboxControls>
          <SandboxSlider
            label={t({ en: "partitions", ko: "파티션" })}
            min={1}
            max={12}
            step={1}
            value={partitions}
            onValueChange={(v) => {
              setPartitions(Math.round(v));
              void ping("pluck", "F4");
            }}
            className="w-44"
          />
          <SandboxSlider
            label={t({ en: "consumers", ko: "컨슈머" })}
            min={1}
            max={6}
            step={1}
            value={consumers}
            onValueChange={(v) => {
              setConsumers(Math.round(v));
              void ping("pluck", "A4");
            }}
            className="w-44"
          />
          <ActionButton label={t({ en: "play motif", ko: "모티프 재생" })} primary onAction={() => void play(concept.motif)} />
          <CounterDisplay
            label={t({ en: "idle consumers", ko: "유휴 컨슈머" })}
            value={Math.max(0, consumers - partitions)}
            hint={t({ en: consumers > partitions ? "scale up partitions" : "all working", ko: consumers > partitions ? "파티션 수를 늘리세요" : "모두 작동 중" })}
          />
        </SandboxControls>
      }
      code={
        <CodeBlock
          lang="properties"
          code={`# Reduce rebalance pause: sticky + cooperative
partition.assignment.strategy=org.apache.kafka.clients.consumer.CooperativeStickyAssignor
session.timeout.ms=10000
heartbeat.interval.ms=3000
max.poll.interval.ms=300000
group.instance.id=warehouse-3   # static membership: no rebalance on quick restart`}
        />
      }
    />
  );
}
