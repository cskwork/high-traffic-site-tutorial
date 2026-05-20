import type { Bilingual } from "@/i18n/T";
import type { Family } from "@/lib/types";

export const familyLabel: Record<Family, Bilingual> = {
  kafka: { en: "Kafka", ko: "카프카" },
  redis: { en: "Redis", ko: "레디스" },
  pattern: { en: "Patterns", ko: "패턴" },
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
