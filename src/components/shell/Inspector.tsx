import { useParams } from "react-router-dom";
import { conceptBySlug, neighborSlugs } from "@/content/registry";
import { familyClass, familyLabel } from "@/lib/family";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { useNavigate } from "react-router-dom";
import { T, useT } from "@/i18n/T";

export function Inspector() {
  const t = useT();
  const { slug } = useParams();
  const inspectorOpen = useApp((s) => s.inspectorOpen);
  const navigate = useNavigate();
  const concept = slug ? conceptBySlug[slug] : undefined;

  if (!concept) {
    return (
      <aside
        className={cx(
          "h-full shrink-0 overflow-y-auto border-l border-white/5 bg-ink-900/70 backdrop-blur scrollbar-thin",
          inspectorOpen ? "w-80" : "w-0",
          "hidden xl:block",
        )}
        aria-label={t({ en: "Concept inspector", ko: "개념 인스펙터" })}
      >
        <div className="p-5 text-xs text-ink-300">
          <T
            en="Pick a concept from the left to see its details, related ideas, and try-it cues here."
            ko="왼쪽에서 개념을 선택하면 상세 내용, 관련 아이디어, 체험 힌트를 여기서 확인할 수 있습니다."
          />
        </div>
      </aside>
    );
  }

  const { prev, next } = neighborSlugs(concept.slug);
  const localTitle = t({ en: concept.title, ko: concept.title_ko ?? concept.title });
  const localSummary = t({ en: concept.summary, ko: concept.summary_ko ?? concept.summary });
  const localTags = concept.tags.map((tag, i) =>
    t({ en: tag, ko: concept.tags_ko?.[i] ?? tag }),
  );

  return (
    <aside
      className={cx(
        "h-full shrink-0 overflow-y-auto border-l border-white/5 bg-ink-900/70 backdrop-blur scrollbar-thin",
        familyClass[concept.family],
        inspectorOpen ? "w-80" : "w-0",
        "hidden xl:block",
      )}
      aria-label={t({ en: `Inspector for ${concept.title}`, ko: `${localTitle} 인스펙터` })}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <Badge tone="concept">{t(familyLabel[concept.family])}</Badge>
          <Badge>{concept.level}</Badge>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
            <T en="Concept" ko="개념" />
          </div>
          <h2 className="mt-1 font-display text-section text-ink-50">{localTitle}</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-200">{localSummary}</p>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
            <T en="Tags" ko="태그" />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {localTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
            <T en="Leitmotif" ko="라이트모티프" />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {concept.motif.notes.map((n, i) => (
              <span
                key={`${n}-${i}`}
                className="rounded-md border border-[color:var(--concept)]/30 bg-[var(--concept-soft)] px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-100"
              >
                {n}
              </span>
            ))}
          </div>
          <div className="mt-2 text-[0.7rem] text-ink-300">
            <T en="Voice:" ko="보이스:" /> <span className="font-mono">{concept.motif.voice}</span>{" "}
            · <T en="Step" ko="스텝" />{" "}
            <span className="font-mono">{concept.motif.duration}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={!prev}
            onClick={() => prev && navigate(`/learn/${prev}`)}
          >
            ← <T en="Prev" ko="이전" />
          </Button>
          <Button
            size="sm"
            variant="concept"
            disabled={!next}
            onClick={() => next && navigate(`/learn/${next}`)}
          >
            <T en="Next" ko="다음" /> →
          </Button>
        </div>
      </div>
    </aside>
  );
}
