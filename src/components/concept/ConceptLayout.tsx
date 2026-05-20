import type { ReactNode } from "react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { familyLabel } from "@/lib/family";
import type { ConceptMeta } from "@/lib/types";
import { cx } from "@/lib/cx";
import { useT } from "@/i18n/T";

interface ConceptLayoutProps {
  concept: ConceptMeta;
  story: ReactNode;
  viz: ReactNode;
  sandbox?: ReactNode;
  code?: ReactNode;
  className?: string;
}

export function ConceptLayout({ concept, story, viz, sandbox, code, className }: ConceptLayoutProps) {
  const t = useT();
  const localFamily = t(familyLabel[concept.family]);
  const localTitle = t({ en: concept.title, ko: concept.title_ko ?? concept.title });
  const localSummary = t({ en: concept.summary, ko: concept.summary_ko ?? concept.summary });
  const localTags = concept.tags.map((tag, i) =>
    t({ en: tag, ko: concept.tags_ko?.[i] ?? tag }),
  );

  return (
    <div className={cx("mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:py-12", className)}>
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
          <Badge tone="concept">{localFamily}</Badge>
          <Badge>{concept.level}</Badge>
          {localTags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="font-display text-hero text-ink-50">{localTitle}</h1>
        <p className="max-w-3xl text-ink-100">{localSummary}</p>
      </header>

      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-12 lg:col-span-5">
          <SectionTitle
            eyebrow={t({ en: "Story", ko: "이야기" })}
            title={t({ en: "The mental model", ko: "핵심 멘탈 모델" })}
          />
          <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-ink-100">{story}</div>
        </Card>
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
          <Card padded={false} className="overflow-hidden p-0">
            <div className="px-5 pt-5 pb-3">
              <SectionTitle
                eyebrow={t({ en: "Visualization", ko: "시각화" })}
                title={t({ en: "See it move", ko: "동작을 눈으로 확인하세요" })}
              />
            </div>
            <div className="px-5 pb-5">{viz}</div>
          </Card>
          {sandbox ? (
            <Card>
              <SectionTitle
                eyebrow={t({ en: "Try it", ko: "직접 해보기" })}
                title={t({ en: "Drive the model yourself", ko: "직접 모델을 조작해 보세요" })}
              />
              <div className="mt-4">{sandbox}</div>
            </Card>
          ) : null}
        </div>
      </div>

      {code ? (
        <Card>
          <SectionTitle
            eyebrow={t({ en: "In code", ko: "코드로 보기" })}
            title={t({ en: "What it looks like", ko: "실제 코드는 이렇게 생겼습니다" })}
          />
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

