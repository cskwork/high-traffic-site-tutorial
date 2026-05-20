import { Card, SectionTitle } from "@/components/ui/Card";
import { useT } from "@/i18n/T";

export function CreditsPage() {
  const t = useT();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-12">
      <Card>
        <SectionTitle
          eyebrow={t({ en: "Credits", ko: "크레딧" })}
          title={t({ en: "Built with", ko: "사용 기술" })}
          description={t({
            en: "An interactive tutorial standing on the shoulders of these excellent open-source projects.",
            ko: "이 인터랙티브 튜토리얼을 만드는 데 쓰인 훌륭한 오픈소스 프로젝트들입니다.",
          })}
        />
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-100">
          <li>React 18</li>
          <li>Vite</li>
          <li>TypeScript (strict)</li>
          <li>Tailwind CSS</li>
          <li>React Three Fiber + drei</li>
          <li>three.js</li>
          <li>Tone.js</li>
          <li>Framer Motion</li>
          <li>Zustand</li>
          <li>React Router</li>
        </ul>
      </Card>
    </div>
  );
}
