import { Link } from "react-router-dom";
import { Card, SectionTitle } from "@/components/ui/Card";
import { T, useT } from "@/i18n/T";

export function NotFoundPage() {
  const t = useT();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-16">
      <Card>
        <SectionTitle
          eyebrow="404"
          title={t({ en: "That concept is not on the map yet.", ko: "아직 지도에 없는 개념입니다." })}
          description={t({
            en: "Pick something from the curriculum on the left, or head back to the overview.",
            ko: "왼쪽 커리큘럼에서 다른 개념을 선택하거나, 개요로 돌아가세요.",
          })}
        />
        <div className="mt-5">
          <Link to="/" className="text-sm text-pattern-300 underline-offset-4 hover:underline">
            <T en="← Back to overview" ko="← 개요로 돌아가기" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
