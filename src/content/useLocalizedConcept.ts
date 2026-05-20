import { useT } from "@/i18n/T";
import { conceptBySlug, curriculum } from "@/content/registry";

export function useLocalizedConcept(slug: string | undefined) {
  const t = useT();
  if (!slug) return undefined;
  const c = conceptBySlug[slug];
  if (!c) return undefined;
  return {
    ...c,
    title: t({ en: c.title, ko: c.title_ko ?? c.title }),
    summary: t({ en: c.summary, ko: c.summary_ko ?? c.summary }),
    tags: c.tags.map((tag, i) => t({ en: tag, ko: c.tags_ko?.[i] ?? tag })),
  };
}

export function useLocalizedCurriculum() {
  const t = useT();
  return curriculum.map((g) => ({
    ...g,
    label: t({ en: g.label, ko: g.label_ko ?? g.label }),
  }));
}
