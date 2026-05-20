import type { Family } from "@/lib/types";

export const familyLabel: Record<Family, string> = {
  kafka: "Kafka",
  redis: "Redis",
  pattern: "Patterns",
};

export const familyClass: Record<Family, string> = {
  kafka: "concept-kafka",
  redis: "concept-redis",
  pattern: "concept-pattern",
};

export const familyAccent: Record<Family, string> = {
  kafka: "#ffb454",
  redis: "#ff6a6a",
  pattern: "#5be6ee",
};

export const familyAccentDeep: Record<Family, string> = {
  kafka: "#c96b0a",
  redis: "#b8201f",
  pattern: "#0d8a93",
};
