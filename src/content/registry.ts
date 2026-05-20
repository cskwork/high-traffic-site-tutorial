import type { ConceptMeta, CurriculumNode, Family, Level } from "@/lib/types";

export const concepts: ReadonlyArray<ConceptMeta> = [
  // Kafka — beginner
  {
    slug: "kafka-what-is",
    title: "What Kafka actually is",
    title_ko: "카프카란 무엇인가",
    family: "kafka",
    level: "beginner",
    summary:
      "Kafka is a distributed, durable log of events. Producers append, consumers read at their own pace. Not a queue, not a database — a replayable timeline.",
    summary_ko:
      "카프카는 분산형 내구성 이벤트 로그입니다. 프로듀서는 이벤트를 추가하고, 컨슈머는 각자의 속도로 읽습니다. 큐도 아니고 데이터베이스도 아닌, 재생 가능한 타임라인입니다.",
    tags: ["broker", "topic", "log", "mental-model"],
    tags_ko: ["브로커", "토픽", "로그", "멘탈 모델"],
    motif: {
      notes: ["C4", "E4", "G4", "B4"],
      duration: "8n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-producer-consumer",
    title: "Producers, brokers, consumers",
    title_ko: "프로듀서, 브로커, 컨슈머",
    family: "kafka",
    level: "beginner",
    summary:
      "Producers publish messages to a topic. Brokers store them in append-only segments. Consumers pull at their own offset and never block producers.",
    summary_ko:
      "프로듀서는 토픽에 메시지를 발행합니다. 브로커는 메시지를 추가 전용 세그먼트에 저장합니다. 컨슈머는 자신의 오프셋에서 메시지를 가져오며, 프로듀서를 절대 차단하지 않습니다.",
    tags: ["producer", "consumer", "broker", "topic"],
    tags_ko: ["프로듀서", "컨슈머", "브로커", "토픽"],
    motif: {
      notes: ["G3", "C4", "E4", "G4", "E4", "C4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-offsets",
    title: "Offsets and replay",
    title_ko: "오프셋과 재생",
    family: "kafka",
    level: "beginner",
    summary:
      "Each partition is a totally ordered log. Consumers track an offset per partition; rewind any time to replay. Retention is configured by time or size.",
    summary_ko:
      "파티션은 완전히 순서가 보장된 로그입니다. 컨슈머는 파티션별 오프셋을 추적하며, 언제든지 되감아 재생할 수 있습니다. 보존 기간은 시간 또는 크기로 설정합니다.",
    tags: ["offset", "retention", "replay"],
    tags_ko: ["오프셋", "보존", "재생"],
    motif: {
      notes: ["E4", "G4", "B4", "E5"],
      duration: "8n",
      voice: "bell",
    },
  },
  // Kafka — intermediate
  {
    slug: "kafka-partitions",
    title: "Partitions: parallelism in one topic",
    title_ko: "파티션: 하나의 토픽 안에서의 병렬 처리",
    family: "kafka",
    level: "intermediate",
    summary:
      "A topic splits into partitions to parallelize reads and writes. Partition is the unit of ordering, the unit of placement, and the unit of consumption.",
    summary_ko:
      "토픽은 읽기와 쓰기를 병렬화하기 위해 파티션으로 분할됩니다. 파티션은 순서 보장, 배치, 소비의 기본 단위입니다.",
    tags: ["partition", "parallelism", "ordering"],
    tags_ko: ["파티션", "병렬 처리", "순서 보장"],
    motif: {
      notes: ["A3", "C4", "E4", "A4", "E4", "C4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-consumer-groups",
    title: "Consumer groups and rebalance",
    title_ko: "컨슈머 그룹과 리밸런스",
    family: "kafka",
    level: "intermediate",
    summary:
      "A consumer group is a logical reader: each partition is owned by exactly one member. Add a consumer → rebalance reassigns partitions across the group.",
    summary_ko:
      "컨슈머 그룹은 논리적 독자로, 각 파티션은 정확히 하나의 멤버가 소유합니다. 컨슈머를 추가하면 리밸런스가 발생해 파티션이 그룹 전체에 재할당됩니다.",
    tags: ["consumer group", "rebalance", "scale"],
    tags_ko: ["컨슈머 그룹", "리밸런스", "확장"],
    motif: {
      notes: ["F4", "A4", "C5", "A4"],
      duration: "8n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-replication",
    title: "Replication and ISR",
    title_ko: "복제와 ISR",
    family: "kafka",
    level: "intermediate",
    summary:
      "Each partition has N replicas. One leader, the rest followers; the in-sync replica set (ISR) is what counts for durability. acks=all blocks until the ISR catches up.",
    summary_ko:
      "각 파티션에는 N개의 레플리카가 있습니다. 하나의 리더와 나머지 팔로워로 구성되며, ISR(인 싱크 레플리카 셋)이 내구성의 기준입니다. acks=all은 ISR이 따라잡을 때까지 차단합니다.",
    tags: ["replication", "isr", "durability", "acks"],
    tags_ko: ["복제", "ISR", "내구성", "acks"],
    motif: {
      notes: ["C3", "G3", "C4", "G3"],
      duration: "8n",
      voice: "bass",
    },
  },
  // Kafka — expert
  {
    slug: "kafka-streams",
    title: "Kafka Streams: state, joins, windows",
    title_ko: "카프카 스트림즈: 상태, 조인, 윈도우",
    family: "kafka",
    level: "expert",
    summary:
      "Streams turn topics into transformations: filters, maps, windowed aggregations, stream-table joins. State lives in local RocksDB, backed by changelog topics.",
    summary_ko:
      "스트림즈는 토픽을 변환 파이프라인으로 만듭니다: 필터, 맵, 윈도우 집계, 스트림-테이블 조인. 상태는 로컬 RocksDB에 저장되며 변경 로그 토픽으로 백업됩니다.",
    tags: ["streams", "state", "windowing", "join"],
    tags_ko: ["스트림즈", "상태", "윈도우", "조인"],
    motif: {
      notes: ["C4", "D4", "F4", "G4", "Bb4", "C5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "kafka-eos",
    title: "Exactly-once semantics",
    title_ko: "정확히 한 번 의미론",
    family: "kafka",
    level: "expert",
    summary:
      "Idempotent producers + transactions across producer-and-consumer give exactly-once. Pay for it in throughput and complexity; it is not free.",
    summary_ko:
      "멱등성 프로듀서와 프로듀서-컨슈머 간 트랜잭션을 결합하면 정확히 한 번 처리가 가능합니다. 처리량과 복잡성이라는 비용이 따르니, 공짜가 아님을 명심하세요.",
    tags: ["transactions", "idempotent", "exactly-once"],
    tags_ko: ["트랜잭션", "멱등성", "정확히 한 번"],
    motif: {
      notes: ["E4", "B4", "G4", "E5"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "kafka-multidc",
    title: "Multi-DC: MirrorMaker, stretch, active-active",
    title_ko: "멀티 DC: MirrorMaker, 스트레치, 액티브-액티브",
    family: "kafka",
    level: "expert",
    summary:
      "MirrorMaker2 replicates topics + offsets across clusters. Stretch clusters span DCs but pay latency. Active-active needs idempotent or commutative consumers.",
    summary_ko:
      "MirrorMaker2는 클러스터 간에 토픽과 오프셋을 복제합니다. 스트레치 클러스터는 DC에 걸쳐 구성하지만 지연 비용이 있습니다. 액티브-액티브는 멱등성 또는 교환 법칙이 성립하는 컨슈머가 필요합니다.",
    tags: ["multi-dc", "mirrormaker", "disaster-recovery"],
    tags_ko: ["멀티 DC", "MirrorMaker", "재해 복구"],
    motif: {
      notes: ["C3", "F3", "Ab3", "C4", "Eb4"],
      duration: "8n",
      voice: "pad",
    },
  },

  // Redis — beginner
  {
    slug: "redis-data-types",
    title: "Strings, hashes, lists, sets, sorted sets",
    title_ko: "문자열, 해시, 리스트, 셋, 정렬된 셋",
    family: "redis",
    level: "beginner",
    summary:
      "Redis is a typed in-memory data structure server. Each type maps to a different access pattern: KV, document, queue, set, ranked.",
    summary_ko:
      "레디스는 타입이 있는 인메모리 자료구조 서버입니다. 각 타입은 KV, 문서, 큐, 셋, 순위 등 서로 다른 접근 패턴에 대응합니다.",
    tags: ["data types", "kv", "hash", "list", "set", "zset"],
    tags_ko: ["자료형", "KV", "해시", "리스트", "셋", "ZSET"],
    motif: {
      notes: ["C5", "E5", "G5", "E5"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "redis-expiry",
    title: "TTL, eviction, and memory",
    title_ko: "TTL, 축출, 메모리 관리",
    family: "redis",
    level: "beginner",
    summary:
      "Keys can expire (EXPIRE / PEXPIRE). When memory is full, an eviction policy picks victims: noeviction, allkeys-lru, volatile-lfu, etc.",
    summary_ko:
      "키는 만료될 수 있습니다(EXPIRE / PEXPIRE). 메모리가 가득 차면 축출 정책이 삭제 대상을 선택합니다: noeviction, allkeys-lru, volatile-lfu 등.",
    tags: ["ttl", "expiry", "eviction", "lru"],
    tags_ko: ["TTL", "만료", "축출", "LRU"],
    motif: {
      notes: ["A4", "G4", "E4", "C4"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "redis-pubsub",
    title: "Pub/Sub: fire and forget",
    title_ko: "Pub/Sub: 발행 후 잊기",
    family: "redis",
    level: "beginner",
    summary:
      "PUBLISH a message to a channel; every connected SUBSCRIBE receives it once. No persistence, no replay. Cheap fanout for live UIs.",
    summary_ko:
      "채널에 메시지를 발행하면, 연결된 모든 구독자가 한 번씩 받습니다. 영속성도 재생도 없습니다. 실시간 UI를 위한 저렴한 팬아웃 방식입니다.",
    tags: ["pubsub", "fanout", "live"],
    tags_ko: ["Pub/Sub", "팬아웃", "실시간"],
    motif: {
      notes: ["G4", "B4", "D5"],
      duration: "16n",
      voice: "pluck",
    },
  },

  // Redis — intermediate
  {
    slug: "redis-streams",
    title: "Streams: durable log",
    title_ko: "스트림: 내구성 있는 로그",
    family: "redis",
    level: "intermediate",
    summary:
      "XADD appends; XREADGROUP gives Kafka-like consumer groups with acks (XACK) and per-consumer pending entries lists. Trim by length or time.",
    summary_ko:
      "XADD로 추가하고, XREADGROUP은 카프카형 컨슈머 그룹에 확인 응답(XACK)과 컨슈머별 대기 항목 목록을 제공합니다. 길이 또는 시간으로 트리밍합니다.",
    tags: ["streams", "xreadgroup", "ack", "pel"],
    tags_ko: ["스트림", "XREADGROUP", "확인 응답", "PEL"],
    motif: {
      notes: ["E4", "G4", "B4", "G4", "E4"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "redis-tx-lua",
    title: "Transactions and Lua",
    title_ko: "트랜잭션과 Lua",
    family: "redis",
    level: "intermediate",
    summary:
      "MULTI/EXEC queues commands; WATCH gives optimistic concurrency. Lua scripts run atomically on the server — single-threaded, all-or-nothing.",
    summary_ko:
      "MULTI/EXEC는 명령을 큐에 넣고, WATCH는 낙관적 동시성을 제공합니다. Lua 스크립트는 서버에서 원자적으로 실행됩니다 — 단일 스레드, 전부 아니면 전무.",
    tags: ["transactions", "watch", "lua", "atomic"],
    tags_ko: ["트랜잭션", "WATCH", "Lua", "원자성"],
    motif: {
      notes: ["F4", "Ab4", "C5"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "redis-rate-limit",
    title: "Rate limiting recipes",
    title_ko: "속도 제한 레시피",
    family: "redis",
    level: "intermediate",
    summary:
      "Token bucket via INCR+EXPIRE, sliding window via sorted-set timestamps, leaky bucket via Lua. Pick by precision needs and memory budget.",
    summary_ko:
      "토큰 버킷은 INCR+EXPIRE로, 슬라이딩 윈도우는 정렬된 셋 타임스탬프로, 누출 버킷은 Lua로 구현합니다. 정밀도 요구 사항과 메모리 예산에 맞게 선택하세요.",
    tags: ["rate-limit", "token-bucket", "sliding-window"],
    tags_ko: ["속도 제한", "토큰 버킷", "슬라이딩 윈도우"],
    motif: {
      notes: ["A3", "C4", "E4", "A4"],
      duration: "16n",
      voice: "noise",
    },
  },

  // Redis — expert
  {
    slug: "redis-cluster",
    title: "Cluster: hash slots and resharding",
    title_ko: "클러스터: 해시 슬롯과 리샤딩",
    family: "redis",
    level: "expert",
    summary:
      "Keys map to 16,384 hash slots; slots map to shards. CLUSTER MEET, MOVED, ASK redirects coordinate the client. Resharding migrates slots live.",
    summary_ko:
      "키는 16,384개의 해시 슬롯에 매핑되고, 슬롯은 샤드에 매핑됩니다. CLUSTER MEET, MOVED, ASK 리다이렉트가 클라이언트를 조율합니다. 리샤딩은 슬롯을 실시간으로 이동합니다.",
    tags: ["cluster", "slots", "sharding"],
    tags_ko: ["클러스터", "슬롯", "샤딩"],
    motif: {
      notes: ["C3", "E3", "G3", "B3", "D4"],
      duration: "8n",
      voice: "pad",
    },
  },
  {
    slug: "redis-replication",
    title: "Replication, Sentinel, failover",
    title_ko: "복제, Sentinel, 페일오버",
    family: "redis",
    level: "expert",
    summary:
      "Replicas pull a partial sync (PSYNC) from the primary. Sentinel watches health, elects a new primary on failure, and notifies clients via Pub/Sub.",
    summary_ko:
      "레플리카는 기본 노드에서 부분 동기화(PSYNC)를 가져옵니다. Sentinel은 상태를 감시하고, 장애 시 새 기본 노드를 선출하며, Pub/Sub으로 클라이언트에 알립니다.",
    tags: ["replication", "sentinel", "failover"],
    tags_ko: ["복제", "Sentinel", "페일오버"],
    motif: {
      notes: ["A2", "E3", "A3", "E3"],
      duration: "8n",
      voice: "bass",
    },
  },
  {
    slug: "redis-persistence",
    title: "Persistence: AOF, RDB, hybrid",
    title_ko: "영속화: AOF, RDB, 하이브리드",
    family: "redis",
    level: "expert",
    summary:
      "RDB snapshots are compact but lose recent writes. AOF rewrites a command log — durable, larger. Hybrid (AOF preamble + RDB) gets you the best of both.",
    summary_ko:
      "RDB 스냅샷은 용량이 작지만 최근 쓰기를 잃을 수 있습니다. AOF는 명령 로그를 재작성하며 내구성이 높지만 용량이 큽니다. 하이브리드(AOF 프리앰블 + RDB)는 두 방식의 장점을 모두 취합니다.",
    tags: ["aof", "rdb", "persistence", "durability"],
    tags_ko: ["AOF", "RDB", "영속화", "내구성"],
    motif: {
      notes: ["D3", "A3", "D4"],
      duration: "8n",
      voice: "bass",
    },
  },

  // Patterns track
  {
    slug: "pattern-cache-aside",
    title: "Cache-aside",
    title_ko: "캐시 어사이드",
    family: "pattern",
    level: "intermediate",
    summary:
      "Read: try cache → on miss, hit DB → write back. Write: update DB → invalidate cache. Simple, robust, dominant pattern for read-heavy services.",
    summary_ko:
      "읽기: 캐시를 먼저 확인하고, 미스 시 DB를 조회한 뒤 캐시에 저장합니다. 쓰기: DB를 갱신하고 캐시를 무효화합니다. 읽기가 많은 서비스에서 가장 널리 쓰이는 단순하고 강건한 패턴입니다.",
    tags: ["cache-aside", "read-through", "invalidation"],
    tags_ko: ["캐시 어사이드", "읽기 캐시", "무효화"],
    motif: {
      notes: ["G4", "B4", "D5", "B4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "pattern-write-through",
    title: "Write-through and write-behind",
    title_ko: "라이트 스루와 라이트 비하인드",
    family: "pattern",
    level: "intermediate",
    summary:
      "Write-through: cache writes synchronously to DB — read-after-write safe. Write-behind: cache batches asynchronously — fast writes, risk of loss on crash.",
    summary_ko:
      "라이트 스루: 캐시가 DB에 동기적으로 쓰므로 쓰기 후 읽기가 일관됩니다. 라이트 비하인드: 캐시가 비동기 배치로 DB에 씁니다 — 빠른 쓰기, 단 충돌 시 데이터 손실 위험.",
    tags: ["write-through", "write-behind"],
    tags_ko: ["라이트 스루", "라이트 비하인드"],
    motif: {
      notes: ["E4", "A4", "C5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "pattern-event-sourcing",
    title: "Event sourcing + CQRS",
    title_ko: "이벤트 소싱 + CQRS",
    family: "pattern",
    level: "expert",
    summary:
      "Persist every change as an immutable event in Kafka; rebuild materialized views (in Redis or DB) by replaying. Read-side and write-side scale independently.",
    summary_ko:
      "모든 변경을 불변 이벤트로 카프카에 저장하고, 재생을 통해 머터리얼라이즈드 뷰(레디스 또는 DB)를 재구축합니다. 읽기 측과 쓰기 측이 독립적으로 확장됩니다.",
    tags: ["event-sourcing", "cqrs", "projection"],
    tags_ko: ["이벤트 소싱", "CQRS", "프로젝션"],
    motif: {
      notes: ["C4", "E4", "G4", "B4", "D5", "F5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "pattern-outbox",
    title: "Transactional outbox",
    title_ko: "트랜잭셔널 아웃박스",
    family: "pattern",
    level: "expert",
    summary:
      "Write business row + outbox row in the same DB transaction; a relay tails the outbox to Kafka. Solves dual-write between DB and broker.",
    summary_ko:
      "비즈니스 행과 아웃박스 행을 같은 DB 트랜잭션에 씁니다. 릴레이(또는 CDC)가 아웃박스를 읽어 카프카에 발행합니다. DB와 브로커 사이의 이중 쓰기 문제를 해결합니다.",
    tags: ["outbox", "dual-write", "cdc"],
    tags_ko: ["아웃박스", "이중 쓰기", "CDC"],
    motif: {
      notes: ["F3", "A3", "C4", "F4"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "pattern-leaderboard",
    title: "Realtime leaderboards",
    title_ko: "실시간 리더보드",
    family: "pattern",
    level: "intermediate",
    summary:
      "Redis ZSET keeps scores sorted O(log N). Increment with ZINCRBY, range with ZRANGE. Pair with Kafka for write fanout to multiple projections.",
    summary_ko:
      "레디스 ZSET은 O(log N)으로 점수를 정렬 유지합니다. ZINCRBY로 증가시키고, ZRANGE로 범위를 조회합니다. 여러 프로젝션에 쓰기를 팬아웃하려면 카프카와 조합하세요.",
    tags: ["leaderboard", "zset", "ranking"],
    tags_ko: ["리더보드", "ZSET", "순위"],
    motif: {
      notes: ["C5", "E5", "G5", "B5"],
      duration: "16n",
      voice: "bell",
    },
  },
];

export const conceptBySlug: Record<string, ConceptMeta> = Object.fromEntries(
  concepts.map((c) => [c.slug, c]),
);

interface CurriculumGroupSpec {
  readonly family: Family;
  readonly level: Level;
  readonly label: string;
  readonly label_ko: string;
}

const groupSpecs: ReadonlyArray<CurriculumGroupSpec> = [
  { family: "kafka", level: "beginner", label: "Kafka · Beginner", label_ko: "카프카 · 입문" },
  { family: "kafka", level: "intermediate", label: "Kafka · Intermediate", label_ko: "카프카 · 중급" },
  { family: "kafka", level: "expert", label: "Kafka · Expert", label_ko: "카프카 · 심화" },
  { family: "redis", level: "beginner", label: "Redis · Beginner", label_ko: "레디스 · 입문" },
  { family: "redis", level: "intermediate", label: "Redis · Intermediate", label_ko: "레디스 · 중급" },
  { family: "redis", level: "expert", label: "Redis · Expert", label_ko: "레디스 · 심화" },
  { family: "pattern", level: "intermediate", label: "Patterns · Architecture", label_ko: "패턴 · 아키텍처" },
  { family: "pattern", level: "expert", label: "Patterns · Advanced", label_ko: "패턴 · 심화" },
];

export const curriculum: ReadonlyArray<CurriculumNode> = groupSpecs
  .map((spec) => {
    const slugs = concepts
      .filter((c) => c.family === spec.family && c.level === spec.level)
      .map((c) => c.slug);
    return {
      id: `${spec.family}-${spec.level}`,
      label: spec.label,
      label_ko: spec.label_ko,
      family: spec.family,
      level: spec.level,
      slugs,
    } satisfies CurriculumNode;
  })
  .filter((node) => node.slugs.length > 0);

export function neighborSlugs(slug: string): { prev?: string; next?: string } {
  const idx = concepts.findIndex((c) => c.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? concepts[idx - 1]!.slug : undefined,
    next: idx < concepts.length - 1 ? concepts[idx + 1]!.slug : undefined,
  };
}
