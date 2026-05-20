import type { ReactNode } from "react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { familyLabel } from "@/lib/family";
import type { ConceptMeta } from "@/lib/types";
import { cx } from "@/lib/cx";

interface ConceptLayoutProps {
  concept: ConceptMeta;
  story: ReactNode;
  viz: ReactNode;
  sandbox?: ReactNode;
  code?: ReactNode;
  className?: string;
}

export function ConceptLayout({ concept, story, viz, sandbox, code, className }: ConceptLayoutProps) {
  return (
    <div className={cx("mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:py-12", className)}>
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
          <Badge tone="concept">{familyLabel[concept.family]}</Badge>
          <Badge>{concept.level}</Badge>
          {concept.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <h1 className="font-display text-hero text-ink-50">{concept.title}</h1>
        <p className="max-w-3xl text-ink-100">{concept.summary}</p>
      </header>

      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-12 lg:col-span-5">
          <SectionTitle eyebrow="Story" title="The mental model" />
          <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-ink-100">{story}</div>
        </Card>
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
          <Card padded={false} className="overflow-hidden p-0">
            <div className="px-5 pt-5 pb-3">
              <SectionTitle eyebrow="Visualization" title="See it move" />
            </div>
            <div className="px-5 pb-5">{viz}</div>
          </Card>
          {sandbox ? (
            <Card>
              <SectionTitle eyebrow="Try it" title="Drive the model yourself" />
              <div className="mt-4">{sandbox}</div>
            </Card>
          ) : null}
        </div>
      </div>

      {code ? (
        <Card>
          <SectionTitle eyebrow="In code" title="What it looks like" />
          <div className="mt-4 text-sm">{code}</div>
        </Card>
      ) : null}
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = "txt" }: CodeBlockProps) {
  return (
    <pre className="scrollbar-thin overflow-x-auto rounded-lg border border-white/5 bg-black/40 p-4 font-mono text-[0.78rem] leading-relaxed text-ink-100">
      <code data-lang={lang}>{code.trim()}</code>
    </pre>
  );
}

interface BulletsProps {
  items: ReadonlyArray<{ heading: string; body: string }>;
}

export function Bullets({ items }: BulletsProps) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((it) => (
        <li key={it.heading} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <div className="text-[0.85rem] font-medium text-ink-50">{it.heading}</div>
          <div className="mt-0.5 text-[0.82rem] text-ink-200">{it.body}</div>
        </li>
      ))}
    </ul>
  );
}
