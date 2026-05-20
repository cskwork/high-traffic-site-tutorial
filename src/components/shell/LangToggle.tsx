import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

export function LangToggle() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const isKo = lang === "ko";
  return (
    <div
      role="group"
      aria-label={isKo ? "언어 선택" : "Language"}
      className="inline-flex overflow-hidden rounded-md border border-white/10 bg-white/[0.02]"
    >
      <LangButton active={!isKo} onClick={() => setLang("en")} label="EN" />
      <LangButton active={isKo} onClick={() => setLang("ko")} label="KO" />
    </div>
  );
}

function LangButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-none px-2 text-[0.72rem] font-mono",
        active ? "bg-white/10 text-ink-50" : "text-ink-300 hover:text-ink-100",
      )}
    >
      {label}
    </Button>
  );
}
