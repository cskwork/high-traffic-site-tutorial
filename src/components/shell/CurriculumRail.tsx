import { NavLink, useLocation } from "react-router-dom";
import { conceptBySlug } from "@/content/registry";
import { familyClass, familyLabel } from "@/lib/family";
import { useApp } from "@/lib/store";
import { cx } from "@/lib/cx";
import { T, useT } from "@/i18n/T";
import { useLocalizedCurriculum } from "@/content/useLocalizedConcept";

export function CurriculumRail() {
  const t = useT();
  const location = useLocation();
  const completed = useApp((s) => s.completed);
  const navOpen = useApp((s) => s.navOpen);
  const localCurriculum = useLocalizedCurriculum();

  return (
    <aside
      className={cx(
        "h-full shrink-0 overflow-y-auto border-r border-white/5 bg-ink-900/70 backdrop-blur scrollbar-thin",
        navOpen ? "w-72" : "w-0 lg:w-72",
        "hidden lg:block",
      )}
      aria-label={t({ en: "Curriculum navigation", ko: "커리큘럼 탐색" })}
    >
      <div className="sticky top-0 z-10 bg-ink-900/85 px-5 pt-6 pb-3">
        <div className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-300">
          <T en="Curriculum" ko="커리큘럼" />
        </div>
        <NavLink
          to="/"
          className={({ isActive }) =>
            cx(
              "mt-2 flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
              isActive || location.pathname === "/"
                ? "bg-white/5 text-ink-50"
                : "text-ink-200 hover:bg-white/5",
            )
          }
        >
          <span><T en="Overview" ko="개요" /></span>
          <span className="text-[0.65rem] text-ink-300">
            {completed.length}/{Object.keys(conceptBySlug).length}
          </span>
        </NavLink>
      </div>
      <nav className="px-3 pb-12">
        {localCurriculum.map((group) => (
          <div key={group.id} className={cx("mt-5", familyClass[group.family])}>
            <div className="flex items-center gap-2 px-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--concept)" }}
              />
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-300">
                {group.label}
              </span>
            </div>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {group.slugs.map((slug) => {
                const concept = conceptBySlug[slug];
                if (!concept) return null;
                const done = completed.includes(slug);
                const localTitle = t({ en: concept.title, ko: concept.title_ko ?? concept.title });
                return (
                  <li key={slug}>
                    <NavLink
                      to={`/learn/${slug}`}
                      className={({ isActive }) =>
                        cx(
                          "group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[0.85rem]",
                          isActive
                            ? "bg-[var(--concept-soft)] text-ink-50"
                            : "text-ink-200 hover:bg-white/5",
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={cx(
                            "h-1 w-1 rounded-full",
                            done ? "bg-emerald-400" : "bg-white/15 group-hover:bg-white/30",
                          )}
                        />
                        <span className="truncate">{localTitle}</span>
                      </span>
                      <span className="hidden text-[0.6rem] uppercase tracking-wider text-ink-300 lg:inline">
                        {t(familyLabel[concept.family])[0]}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
