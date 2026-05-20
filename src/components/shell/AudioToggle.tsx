import { useAudio } from "@/audio/useAudio";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";

export function AudioToggle() {
  const { audio, enable, disable, setVolume } = useAudio();
  const on = audio.enabled;

  return (
    <div className="flex items-center gap-3" role="group" aria-label="Audio controls">
      <Button
        variant={on ? "primary" : "outline"}
        size="sm"
        onClick={() => (on ? disable() : void enable())}
        aria-pressed={on}
        aria-label={on ? "Mute soundtrack" : "Turn on soundtrack"}
        title={on ? "Mute soundtrack" : "Turn on soundtrack"}
      >
        <SoundIcon on={on} />
        <span className="hidden sm:inline">{on ? "Sound on" : "Turn on sound"}</span>
      </Button>
      {on ? (
        <Slider
          label="vol"
          value={audio.volume}
          onValueChange={setVolume}
          className="w-28 hidden md:flex"
          aria-label="Volume"
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
