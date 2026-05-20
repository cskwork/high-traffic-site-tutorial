import { useParams } from "react-router-dom";
import { conceptBySlug, neighborSlugs } from "@/content/registry";
import { familyClass, familyLabel } from "@/lib/family";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { useNavigate } from "react-router-dom";

export function Inspector() {
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
        aria-label="Concept inspector"
      >
        <div className="p-5 text-xs text-ink-300">
          Pick a concept from the left to see its details, related ideas, and try-it cues here.
        </div>
      </aside>
    );
  }

  const { prev, next } = neighborSlugs(concept.slug);

  return (
    <aside
      className={cx(
        "h-full shrink-0 overflow-y-auto border-l border-white/5 bg-ink-900/70 backdrop-blur scrollbar-thin",
        familyClass[concept.family],
        inspectorOpen ? "w-80" : "w-0",
        "hidden xl:block",
      )}
      aria-label={`Inspector for ${concept.title}`}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <Badge tone="concept">{familyLabel[concept.family]}</Badge>
          <Badge>{concept.level}</Badge>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">Concept</div>
          <h2 className="mt-1 font-display text-section text-ink-50">{concept.title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-200">{concept.summary}</p>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">Tags</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {concept.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">Leitmotif</div>
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
            Voice: <span className="font-mono">{concept.motif.voice}</span> · Step{" "}
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
            ← Prev
          </Button>
          <Button
            size="sm"
            variant="concept"
            disabled={!next}
            onClick={() => next && navigate(`/learn/${next}`)}
          >
            Next →
          </Button>
        </div>
      </div>
    </aside>
  );
}
