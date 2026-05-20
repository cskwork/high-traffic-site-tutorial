import { lazy } from "react";
import type { LazyExoticComponent, ComponentType } from "react";

type View = LazyExoticComponent<ComponentType>;

export const conceptViews: Record<string, View> = {
  // Kafka beginner
  "kafka-what-is": lazy(() => import("@/content/concepts/kafka-what-is")),
  "kafka-producer-consumer": lazy(() => import("@/content/concepts/kafka-producer-consumer")),
  "kafka-offsets": lazy(() => import("@/content/concepts/kafka-offsets")),
  // Kafka intermediate
  "kafka-partitions": lazy(() => import("@/content/concepts/kafka-partitions")),
  "kafka-consumer-groups": lazy(() => import("@/content/concepts/kafka-consumer-groups")),
  "kafka-replication": lazy(() => import("@/content/concepts/kafka-replication")),
  // Kafka expert
  "kafka-streams": lazy(() => import("@/content/concepts/kafka-streams")),
  "kafka-eos": lazy(() => import("@/content/concepts/kafka-eos")),
  "kafka-multidc": lazy(() => import("@/content/concepts/kafka-multidc")),
  // Redis beginner
  "redis-data-types": lazy(() => import("@/content/concepts/redis-data-types")),
  "redis-expiry": lazy(() => import("@/content/concepts/redis-expiry")),
  "redis-pubsub": lazy(() => import("@/content/concepts/redis-pubsub")),
  // Redis intermediate
  "redis-streams": lazy(() => import("@/content/concepts/redis-streams")),
  "redis-tx-lua": lazy(() => import("@/content/concepts/redis-tx-lua")),
  "redis-rate-limit": lazy(() => import("@/content/concepts/redis-rate-limit")),
  // Redis expert
  "redis-cluster": lazy(() => import("@/content/concepts/redis-cluster")),
  "redis-replication": lazy(() => import("@/content/concepts/redis-replication")),
  "redis-persistence": lazy(() => import("@/content/concepts/redis-persistence")),
  // Patterns
  "pattern-cache-aside": lazy(() => import("@/content/concepts/pattern-cache-aside")),
  "pattern-write-through": lazy(() => import("@/content/concepts/pattern-write-through")),
  "pattern-event-sourcing": lazy(() => import("@/content/concepts/pattern-event-sourcing")),
  "pattern-outbox": lazy(() => import("@/content/concepts/pattern-outbox")),
  "pattern-leaderboard": lazy(() => import("@/content/concepts/pattern-leaderboard")),
};
