import type { ConceptMeta, CurriculumNode, Family, Level } from "@/lib/types";

export const concepts: ReadonlyArray<ConceptMeta> = [
  // Kafka — beginner
  {
    slug: "kafka-what-is",
    title: "What Kafka actually is",
    family: "kafka",
    level: "beginner",
    summary:
      "Kafka is a distributed, durable log of events. Producers append, consumers read at their own pace. Not a queue, not a database — a replayable timeline.",
    tags: ["broker", "topic", "log", "mental-model"],
    motif: {
      notes: ["C4", "E4", "G4", "B4"],
      duration: "8n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-producer-consumer",
    title: "Producers, brokers, consumers",
    family: "kafka",
    level: "beginner",
    summary:
      "Producers publish messages to a topic. Brokers store them in append-only segments. Consumers pull at their own offset and never block producers.",
    tags: ["producer", "consumer", "broker", "topic"],
    motif: {
      notes: ["G3", "C4", "E4", "G4", "E4", "C4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-offsets",
    title: "Offsets and replay",
    family: "kafka",
    level: "beginner",
    summary:
      "Each partition is a totally ordered log. Consumers track an offset per partition; rewind any time to replay. Retention is configured by time or size.",
    tags: ["offset", "retention", "replay"],
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
    family: "kafka",
    level: "intermediate",
    summary:
      "A topic splits into partitions to parallelize reads and writes. Partition is the unit of ordering, the unit of placement, and the unit of consumption.",
    tags: ["partition", "parallelism", "ordering"],
    motif: {
      notes: ["A3", "C4", "E4", "A4", "E4", "C4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-consumer-groups",
    title: "Consumer groups and rebalance",
    family: "kafka",
    level: "intermediate",
    summary:
      "A consumer group is a logical reader: each partition is owned by exactly one member. Add a consumer → rebalance reassigns partitions across the group.",
    tags: ["consumer group", "rebalance", "scale"],
    motif: {
      notes: ["F4", "A4", "C5", "A4"],
      duration: "8n",
      voice: "pluck",
    },
  },
  {
    slug: "kafka-replication",
    title: "Replication and ISR",
    family: "kafka",
    level: "intermediate",
    summary:
      "Each partition has N replicas. One leader, the rest followers; the in-sync replica set (ISR) is what counts for durability. acks=all blocks until the ISR catches up.",
    tags: ["replication", "isr", "durability", "acks"],
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
    family: "kafka",
    level: "expert",
    summary:
      "Streams turn topics into transformations: filters, maps, windowed aggregations, stream-table joins. State lives in local RocksDB, backed by changelog topics.",
    tags: ["streams", "state", "windowing", "join"],
    motif: {
      notes: ["C4", "D4", "F4", "G4", "Bb4", "C5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "kafka-eos",
    title: "Exactly-once semantics",
    family: "kafka",
    level: "expert",
    summary:
      "Idempotent producers + transactions across producer-and-consumer give exactly-once. Pay for it in throughput and complexity; it is not free.",
    tags: ["transactions", "idempotent", "exactly-once"],
    motif: {
      notes: ["E4", "B4", "G4", "E5"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "kafka-multidc",
    title: "Multi-DC: MirrorMaker, stretch, active-active",
    family: "kafka",
    level: "expert",
    summary:
      "MirrorMaker2 replicates topics + offsets across clusters. Stretch clusters span DCs but pay latency. Active-active needs idempotent or commutative consumers.",
    tags: ["multi-dc", "mirrormaker", "disaster-recovery"],
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
    family: "redis",
    level: "beginner",
    summary:
      "Redis is a typed in-memory data structure server. Each type maps to a different access pattern: KV, document, queue, set, ranked.",
    tags: ["data types", "kv", "hash", "list", "set", "zset"],
    motif: {
      notes: ["C5", "E5", "G5", "E5"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "redis-expiry",
    title: "TTL, eviction, and memory",
    family: "redis",
    level: "beginner",
    summary:
      "Keys can expire (EXPIRE / PEXPIRE). When memory is full, an eviction policy picks victims: noeviction, allkeys-lru, volatile-lfu, etc.",
    tags: ["ttl", "expiry", "eviction", "lru"],
    motif: {
      notes: ["A4", "G4", "E4", "C4"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "redis-pubsub",
    title: "Pub/Sub: fire and forget",
    family: "redis",
    level: "beginner",
    summary:
      "PUBLISH a message to a channel; every connected SUBSCRIBE receives it once. No persistence, no replay. Cheap fanout for live UIs.",
    tags: ["pubsub", "fanout", "live"],
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
    family: "redis",
    level: "intermediate",
    summary:
      "XADD appends; XREADGROUP gives Kafka-like consumer groups with acks (XACK) and per-consumer pending entries lists. Trim by length or time.",
    tags: ["streams", "xreadgroup", "ack", "pel"],
    motif: {
      notes: ["E4", "G4", "B4", "G4", "E4"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "redis-tx-lua",
    title: "Transactions and Lua",
    family: "redis",
    level: "intermediate",
    summary:
      "MULTI/EXEC queues commands; WATCH gives optimistic concurrency. Lua scripts run atomically on the server — single-threaded, all-or-nothing.",
    tags: ["transactions", "watch", "lua", "atomic"],
    motif: {
      notes: ["F4", "Ab4", "C5"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "redis-rate-limit",
    title: "Rate limiting recipes",
    family: "redis",
    level: "intermediate",
    summary:
      "Token bucket via INCR+EXPIRE, sliding window via sorted-set timestamps, leaky bucket via Lua. Pick by precision needs and memory budget.",
    tags: ["rate-limit", "token-bucket", "sliding-window"],
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
    family: "redis",
    level: "expert",
    summary:
      "Keys map to 16,384 hash slots; slots map to shards. CLUSTER MEET, MOVED, ASK redirects coordinate the client. Resharding migrates slots live.",
    tags: ["cluster", "slots", "sharding"],
    motif: {
      notes: ["C3", "E3", "G3", "B3", "D4"],
      duration: "8n",
      voice: "pad",
    },
  },
  {
    slug: "redis-replication",
    title: "Replication, Sentinel, failover",
    family: "redis",
    level: "expert",
    summary:
      "Replicas pull a partial sync (PSYNC) from the primary. Sentinel watches health, elects a new primary on failure, and notifies clients via Pub/Sub.",
    tags: ["replication", "sentinel", "failover"],
    motif: {
      notes: ["A2", "E3", "A3", "E3"],
      duration: "8n",
      voice: "bass",
    },
  },
  {
    slug: "redis-persistence",
    title: "Persistence: AOF, RDB, hybrid",
    family: "redis",
    level: "expert",
    summary:
      "RDB snapshots are compact but lose recent writes. AOF rewrites a command log — durable, larger. Hybrid (AOF preamble + RDB) gets you the best of both.",
    tags: ["aof", "rdb", "persistence", "durability"],
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
    family: "pattern",
    level: "intermediate",
    summary:
      "Read: try cache → on miss, hit DB → write back. Write: update DB → invalidate cache. Simple, robust, dominant pattern for read-heavy services.",
    tags: ["cache-aside", "read-through", "invalidation"],
    motif: {
      notes: ["G4", "B4", "D5", "B4"],
      duration: "16n",
      voice: "pluck",
    },
  },
  {
    slug: "pattern-write-through",
    title: "Write-through and write-behind",
    family: "pattern",
    level: "intermediate",
    summary:
      "Write-through: cache writes synchronously to DB — read-after-write safe. Write-behind: cache batches asynchronously — fast writes, risk of loss on crash.",
    tags: ["write-through", "write-behind"],
    motif: {
      notes: ["E4", "A4", "C5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "pattern-event-sourcing",
    title: "Event sourcing + CQRS",
    family: "pattern",
    level: "expert",
    summary:
      "Persist every change as an immutable event in Kafka; rebuild materialized views (in Redis or DB) by replaying. Read-side and write-side scale independently.",
    tags: ["event-sourcing", "cqrs", "projection"],
    motif: {
      notes: ["C4", "E4", "G4", "B4", "D5", "F5"],
      duration: "16n",
      voice: "pad",
    },
  },
  {
    slug: "pattern-outbox",
    title: "Transactional outbox",
    family: "pattern",
    level: "expert",
    summary:
      "Write business row + outbox row in the same DB transaction; a relay tails the outbox to Kafka. Solves dual-write between DB and broker.",
    tags: ["outbox", "dual-write", "cdc"],
    motif: {
      notes: ["F3", "A3", "C4", "F4"],
      duration: "16n",
      voice: "bell",
    },
  },
  {
    slug: "pattern-leaderboard",
    title: "Realtime leaderboards",
    family: "pattern",
    level: "intermediate",
    summary:
      "Redis ZSET keeps scores sorted O(log N). Increment with ZINCRBY, range with ZRANGE. Pair with Kafka for write fanout to multiple projections.",
    tags: ["leaderboard", "zset", "ranking"],
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
}

const groupSpecs: ReadonlyArray<CurriculumGroupSpec> = [
  { family: "kafka", level: "beginner", label: "Kafka · Beginner" },
  { family: "kafka", level: "intermediate", label: "Kafka · Intermediate" },
  { family: "kafka", level: "expert", label: "Kafka · Expert" },
  { family: "redis", level: "beginner", label: "Redis · Beginner" },
  { family: "redis", level: "intermediate", label: "Redis · Intermediate" },
  { family: "redis", level: "expert", label: "Redis · Expert" },
  { family: "pattern", level: "intermediate", label: "Patterns · Architecture" },
  { family: "pattern", level: "expert", label: "Patterns · Advanced" },
];

export const curriculum: ReadonlyArray<CurriculumNode> = groupSpecs
  .map((spec) => {
    const slugs = concepts
      .filter((c) => c.family === spec.family && c.level === spec.level)
      .map((c) => c.slug);
    return {
      id: `${spec.family}-${spec.level}`,
      label: spec.label,
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
