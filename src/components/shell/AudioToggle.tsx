import { useAudio } from "@/audio/useAudio";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { T, useT } from "@/i18n/T";

export function AudioToggle() {
  const t = useT();
  const { audio, enable, disable, setVolume } = useAudio();
  const on = audio.enabled;

  return (
    <div className="flex items-center gap-3" role="group" aria-label={t({ en: "Audio controls", ko: "오디오 컨트롤" })}>
      <Button
        variant={on ? "primary" : "outline"}
        size="sm"
        onClick={() => (on ? disable() : void enable())}
        aria-pressed={on}
        aria-label={on ? t({ en: "Mute soundtrack", ko: "사운드트랙 음소거" }) : t({ en: "Turn on soundtrack", ko: "사운드트랙 켜기" })}
        title={on ? t({ en: "Mute soundtrack", ko: "사운드트랙 음소거" }) : t({ en: "Turn on soundtrack", ko: "사운드트랙 켜기" })}
      >
        <SoundIcon on={on} />
        <span className="hidden sm:inline">
          {on ? <T en="Sound on" ko="사운드 켜짐" /> : <T en="Turn on sound" ko="사운드 켜기" />}
        </span>
      </Button>
      {on ? (
        <Slider
          label={t({ en: "vol", ko: "음량" })}
          value={audio.volume}
          onValueChange={setVolume}
          className="w-28 hidden md:flex"
          aria-label={t({ en: "Volume", ko: "음량" })}
        />
      ) : null}
    </div>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9h4l5-4v14l-5-4H4z"
        fill="currentColor"
        opacity="0.85"
      />
      {on ? (
        <>
          <path d="M16 9c1.4 1.1 1.4 4.9 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18.5 7c2.5 2 2.5 8 0 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <path
          d="M16 9l6 6M22 9l-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
