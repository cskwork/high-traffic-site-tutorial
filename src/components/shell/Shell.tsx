import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CurriculumRail } from "@/components/shell/CurriculumRail";
import { Inspector } from "@/components/shell/Inspector";
import { AudioToggle } from "@/components/shell/AudioToggle";
import { GlobalShortcuts } from "@/components/shell/GlobalShortcuts";
import { conceptBySlug } from "@/content/registry";
import { familyClass, familyLabel } from "@/lib/family";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const params = useParams();
  const location = useLocation();
  const slug = params.slug;
  const concept = slug ? conceptBySlug[slug] : undefined;
  const familyCls = concept ? familyClass[concept.family] : "concept-pattern";
  const toggleNav = useApp((s) => s.toggleNav);
  const toggleInspector = useApp((s) => s.toggleInspector);

  return (
    <div className={cx("flex h-screen w-screen overflow-hidden", familyCls)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink-50 focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:text-ink-900"
      >
        Skip to content
      </a>
      <GlobalShortcuts />
      <CurriculumRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          slug={slug}
          conceptTitle={concept?.title}
          conceptFamily={concept ? familyLabel[concept.family] : undefined}
          atHome={location.pathname === "/"}
          onToggleNav={toggleNav}
          onToggleInspector={toggleInspector}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="relative flex-1 overflow-y-auto scrollbar-thin focus:outline-none"
        >
          {children}
        </main>
      </div>
      <Inspector />
    </div>
  );
}

interface HeaderProps {
  slug?: string;
  conceptTitle?: string;
  conceptFamily?: string;
  atHome: boolean;
  onToggleNav: () => void;
  onToggleInspector: () => void;
}

function Header({ slug, conceptTitle, conceptFamily, atHome, onToggleNav, onToggleInspector }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/5 bg-ink-900/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleNav}
          aria-label="Toggle curriculum"
          className="lg:hidden"
        >
          <MenuIcon />
        </Button>
        <Link to="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-sm font-semibold tracking-tight text-ink-50">
            High-Traffic Tutorial
          </span>
        </Link>
        <div className="hidden items-center gap-1 text-[0.7rem] text-ink-300 sm:flex">
          <span className="opacity-60">/</span>
          {atHome ? (
            <span>Overview</span>
          ) : conceptTitle ? (
            <>
              <Badge tone="concept">{conceptFamily}</Badge>
              <span className="truncate max-w-[36ch]">{conceptTitle}</span>
            </>
          ) : (
            <span>Section</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AudioToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInspector}
          aria-label={slug ? "Toggle concept inspector" : "Toggle inspector panel"}
          className="hidden xl:inline-flex"
        >
          Inspector
        </Button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden>
      <defs>
        <radialGradient id="mg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb454" />
          <stop offset="60%" stopColor="#e23838" />
          <stop offset="100%" stopColor="#19b5c0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#06070a" />
      <circle cx="32" cy="32" r="18" fill="url(#mg)" />
      <circle cx="32" cy="32" r="9" fill="#06070a" />
    </svg>
  );
}
