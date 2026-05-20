export type Family = "kafka" | "redis" | "pattern";
export type Level = "beginner" | "intermediate" | "expert";

export interface Motif {
  /** Tone.js note names in scientific pitch notation, e.g. "C4". */
  readonly notes: ReadonlyArray<string>;
  /** Beat duration per step, e.g. "8n", "16n". */
  readonly duration: string;
  /** Synth voice key from the audio engine registry. */
  readonly voice: "pluck" | "pad" | "bass" | "bell" | "noise";
  /** Optional repeat count (default 1). */
  readonly repeats?: number;
}

export interface ConceptMeta {
  readonly slug: string;
  readonly title: string;
  readonly family: Family;
  readonly level: Level;
  readonly summary: string;
  readonly tags: ReadonlyArray<string>;
  readonly motif: Motif;
}

export interface CurriculumNode {
  readonly id: string;
  readonly label: string;
  readonly family: Family;
  readonly level: Level;
  readonly slugs: ReadonlyArray<string>;
}
