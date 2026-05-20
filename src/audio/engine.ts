import * as Tone from "tone";
import type { Motif } from "@/lib/types";

type VoiceKey = Motif["voice"];

interface Voices {
  pluck: Tone.PluckSynth;
  pad: Tone.PolySynth;
  bass: Tone.MonoSynth;
  bell: Tone.MetalSynth;
  noise: Tone.NoiseSynth;
}

class AudioEngine {
  private voices: Voices | null = null;
  private bus: Tone.Gain | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private started = false;

  async start(): Promise<void> {
    if (this.started) return;
    await Tone.start();
    Tone.getContext().lookAhead = 0.05;
    Tone.Transport.bpm.value = 96;

    const bus = new Tone.Gain(0.6).toDestination();
    const reverb = new Tone.Reverb({ decay: 3.2, wet: 0.28 }).connect(bus);
    const delay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.22, wet: 0.18 }).connect(
      reverb,
    );

    const pluck = new Tone.PluckSynth({ attackNoise: 0.6, dampening: 4200, resonance: 0.92 }).connect(
      delay,
    );
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsine" },
      envelope: { attack: 0.4, decay: 0.6, sustain: 0.5, release: 1.6 },
    }).connect(reverb);
    pad.volume.value = -10;
    const bass = new Tone.MonoSynth({
      oscillator: { type: "triangle" },
      filter: { Q: 1, type: "lowpass", rolloff: -12 },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.6 },
      filterEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.5, baseFrequency: 120, octaves: 2 },
    }).connect(bus);
    bass.volume.value = -8;
    const bell = new Tone.MetalSynth({
      envelope: { attack: 0.002, decay: 0.6, release: 1.2 },
      harmonicity: 5.1,
      modulationIndex: 24,
      resonance: 1200,
      octaves: 1.2,
    }).connect(reverb);
    bell.volume.value = -22;
    const noise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.005, decay: 0.18, sustain: 0, release: 0.05 },
    }).connect(delay);
    noise.volume.value = -18;

    this.voices = { pluck, pad, bass, bell, noise };
    this.bus = bus;
    this.reverb = reverb;
    this.delay = delay;
    this.started = true;
  }

  isStarted(): boolean {
    return this.started;
  }

  setVolume(linear: number): void {
    if (!this.bus) return;
    this.bus.gain.rampTo(Math.max(0, Math.min(1, linear)), 0.1);
  }

  setEnabled(on: boolean): void {
    if (!this.bus) return;
    this.bus.gain.rampTo(on ? 0.6 : 0, 0.2);
  }

  trigger(motif: Motif, when: number | string = "+0"): void {
    if (!this.started || !this.voices) return;
    const voice = this.voices[motif.voice as VoiceKey];
    const repeats = motif.repeats ?? 1;
    const baseTime = Tone.Time(when).toSeconds();
    const stepSec = Tone.Time(motif.duration).toSeconds();
    let t = baseTime;
    for (let r = 0; r < repeats; r += 1) {
      motif.notes.forEach((note) => {
        if (voice instanceof Tone.PluckSynth || voice instanceof Tone.MonoSynth) {
          voice.triggerAttackRelease(note, motif.duration, t);
        } else if (voice instanceof Tone.PolySynth) {
          voice.triggerAttackRelease(note, motif.duration, t);
        } else if (voice instanceof Tone.MetalSynth) {
          voice.triggerAttackRelease(note, motif.duration, t);
        } else if (voice instanceof Tone.NoiseSynth) {
          voice.triggerAttackRelease(motif.duration, t);
        }
        t += stepSec;
      });
    }
  }

  ping(voice: VoiceKey = "pluck", note = "C5"): void {
    if (!this.started || !this.voices) return;
    const v = this.voices[voice];
    if (v instanceof Tone.NoiseSynth) {
      v.triggerAttackRelease("16n");
    } else if (v instanceof Tone.MetalSynth) {
      v.triggerAttackRelease(note, "16n");
    } else if (v instanceof Tone.PolySynth) {
      v.triggerAttackRelease(note, "16n");
    } else {
      (v as Tone.MonoSynth | Tone.PluckSynth).triggerAttackRelease(note, "16n");
    }
  }

  dispose(): void {
    if (!this.started) return;
    Object.values(this.voices ?? {}).forEach((v) => v.dispose());
    this.reverb?.dispose();
    this.delay?.dispose();
    this.bus?.dispose();
    this.voices = null;
    this.started = false;
  }
}

export const audio = new AudioEngine();
