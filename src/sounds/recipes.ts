/**
 * The sound palette — layer/recipe types plus the twenty-four built-in recipes.
 * Each sound has its own distinct shape — a chime, an arpeggio, a pitch
 * glide, a warm pad, a breath — rather than being a volume/EQ tweak on
 * the same click. Add a new one here without touching any audio graph code.
 */

type BaseLayer = {
  /** Seconds after the trigger that this layer starts. */
  offset?: number;
  /** Fade-in time, in seconds. */
  attack: number;
  /** Fade-out time, in seconds, starting right after the attack. */
  decay: number;
  /** Peak volume reached at the end of the attack. */
  peak: number;
};

/** A single note — the building block for chimes, arpeggios, and pads. */
export type ToneLayer = BaseLayer & {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  /** Detune in cents, for a gentle chorus/beating effect between layers. */
  detune?: number;
  /** If set, the pitch glides smoothly from `frequency` to this value. */
  glideTo?: number;
  /** How long the glide takes, in seconds. Defaults to attack + decay. */
  glideTime?: number;
};

/** A soft filtered noise bed — used for breathy, textural layers. */
export type NoiseLayer = BaseLayer & {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ?: number;
};

export type SoundLayer = ToneLayer | NoiseLayer;

/** A soft, spacious echo tail applied to the whole sound — the "magic dust". */
export type Shimmer = {
  delay: number;
  feedback: number;
  wet: number;
  lowpass: number;
};

export type SoundRecipe = {
  masterGain: number;
  layers: SoundLayer[];
  shimmer?: Shimmer;
};

export const RECIPES = {
  /** A soft two-note ascending bell, like an iOS/macOS confirmation tink. */
  chime: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1046.5, attack: 0.006, decay: 0.22, peak: 0.09 },
      { kind: "tone", waveform: "sine", frequency: 1568, offset: 0.09, attack: 0.006, decay: 0.26, peak: 0.08 },
    ],
    shimmer: { delay: 0.12, feedback: 0.25, wet: 0.18, lowpass: 4000 },
  },
  /** A quick ascending twinkle of four notes — bright and playful. */
  sparkle: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1760, offset: 0, attack: 0.003, decay: 0.09, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 2217, offset: 0.045, attack: 0.003, decay: 0.09, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.09, attack: 0.003, decay: 0.1, peak: 0.038 },
      { kind: "tone", waveform: "sine", frequency: 3520, offset: 0.135, attack: 0.003, decay: 0.12, peak: 0.032 },
    ],
    shimmer: { delay: 0.07, feedback: 0.35, wet: 0.22, lowpass: 6000 },
  },
  /** A single note gliding smoothly downward, like a drop of water. */
  droplet: {
    masterGain: 0.55,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1200, glideTo: 550, glideTime: 0.14, attack: 0.004, decay: 0.2, peak: 0.075 },
    ],
    shimmer: { delay: 0.09, feedback: 0.2, wet: 0.15, lowpass: 3000 },
  },
  /** A warm, slow-swelling pad from two gently detuned sines. */
  bloom: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 528, attack: 0.06, decay: 0.32, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 528, detune: 12, attack: 0.06, decay: 0.34, peak: 0.05 },
    ],
    shimmer: { delay: 0.15, feedback: 0.2, wet: 0.12, lowpass: 2500 },
  },
  /** The quietest option — a breathy, textureless swell for dense lists. */
  whisper: {
    masterGain: 0.5,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1200, filterQ: 0.7, attack: 0.04, decay: 0.16, peak: 0.05 },
    ],
  },
  /** A focused, bandpass-filtered tick with a bright sine ping on top — crisp and instant. */
  tick: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 5400, filterQ: 1.8, attack: 0.001, decay: 0.018, peak: 0.14 },
      { kind: "tone", waveform: "sine", frequency: 2600, attack: 0.001, decay: 0.012, peak: 0.018 },
    ],
  },
  /** A dull, muted knock — the "down" half of a press/release pair, like a key bottoming out. */
  press: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1700, filterQ: 1.4, attack: 0.001, decay: 0.02, peak: 0.13 },
    ],
  },
  /** A brighter, springier tick — the "up" half of a press/release pair, like a key returning. */
  release: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 4600, filterQ: 1.8, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "tone", waveform: "sine", frequency: 3200, offset: 0.006, attack: 0.001, decay: 0.05, peak: 0.02 },
    ],
  },
  /** A two-part click-clack, like a mechanical switch flipping between states. */
  toggle: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2200, filterQ: 1.6, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 3800, filterQ: 1.6, offset: 0.024, attack: 0.001, decay: 0.02, peak: 0.1 },
    ],
  },
  /** A short, warm three-note ascending confirmation — "done", not a fanfare. */
  success: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 880, attack: 0.004, decay: 0.09, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1108.73, offset: 0.06, attack: 0.004, decay: 0.1, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.12, attack: 0.004, decay: 0.18, peak: 0.07 },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.16, lowpass: 4500 },
  },
  /** A tiny elastic blip for selections, chips, and lightweight additions. */
  pop: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 520, glideTo: 880, glideTime: 0.045, attack: 0.002, decay: 0.07, peak: 0.08 },
    ],
  },
  /** A short airy sweep for transitions and items moving in or out. */
  whoosh: {
    masterGain: 0.35,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1400, filterQ: 0.8, attack: 0.035, decay: 0.14, peak: 0.09 },
      { kind: "tone", waveform: "sine", frequency: 280, glideTo: 620, glideTime: 0.16, attack: 0.025, decay: 0.14, peak: 0.025 },
    ],
  },
  /** A clear two-note call that gets attention without implying success. */
  notification: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 659.25, attack: 0.004, decay: 0.13, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 880, offset: 0.1, attack: 0.004, decay: 0.2, peak: 0.065 },
    ],
    shimmer: { delay: 0.11, feedback: 0.2, wet: 0.14, lowpass: 4000 },
  },
  /** Two restrained descending notes for caution and validation hints. */
  warning: {
    masterGain: 0.4,
    layers: [
      { kind: "tone", waveform: "triangle", frequency: 440, attack: 0.004, decay: 0.11, peak: 0.06 },
      { kind: "tone", waveform: "triangle", frequency: 349.23, offset: 0.11, attack: 0.004, decay: 0.16, peak: 0.065 },
    ],
  },
  /** A muted knock followed by two descending tones — a calm, recoverable refusal. */
  error: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 850, filterQ: 1.1, attack: 0.001, decay: 0.035, peak: 0.13 },
      { kind: "tone", waveform: "triangle", frequency: 440, offset: 0.025, attack: 0.004, decay: 0.09, peak: 0.045 },
      { kind: "tone", waveform: "triangle", frequency: 349.23, offset: 0.1, attack: 0.004, decay: 0.14, peak: 0.04 },
    ],
  },
  /** A crisp paper-and-table snap for placing a card. */
  card: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2600, filterQ: 0.8, attack: 0.001, decay: 0.035, peak: 0.13 },
      { kind: "tone", waveform: "sine", frequency: 180, attack: 0.001, decay: 0.045, peak: 0.035 },
    ],
  },
  /** A light papery slide for taking a card from the deck. */
  draw: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1100, filterQ: 0.55, attack: 0.015, decay: 0.11, peak: 0.08 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 3400, filterQ: 0.8, offset: 0.035, attack: 0.006, decay: 0.075, peak: 0.065 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2100, filterQ: 0.9, offset: 0.105, attack: 0.001, decay: 0.028, peak: 0.11 },
      { kind: "tone", waveform: "sine", frequency: 150, offset: 0.105, attack: 0.001, decay: 0.035, peak: 0.025 },
    ],
  },
  /** Two quick card snaps for dealing into a hand. */
  deal: {
    masterGain: 0.35,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2300, filterQ: 0.9, attack: 0.001, decay: 0.03, peak: 0.12 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2500, filterQ: 0.9, offset: 0.065, attack: 0.001, decay: 0.035, peak: 0.11 },
    ],
  },
  /** A compact run of papery bursts that suggests a deck being shuffled. */
  shuffle: {
    masterGain: 0.3,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1700, filterQ: 0.65, attack: 0.005, decay: 0.055, peak: 0.1 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2400, filterQ: 0.65, offset: 0.045, attack: 0.005, decay: 0.055, peak: 0.11 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 1900, filterQ: 0.65, offset: 0.09, attack: 0.005, decay: 0.055, peak: 0.1 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2700, filterQ: 0.65, offset: 0.135, attack: 0.005, decay: 0.07, peak: 0.1 },
    ],
  },
  /** A bright compact flourish for winning a round or game. */
  victory: {
    masterGain: 0.45,
    layers: [
      { kind: "tone", waveform: "triangle", frequency: 523.25, attack: 0.004, decay: 0.11, peak: 0.05 },
      { kind: "tone", waveform: "triangle", frequency: 659.25, offset: 0.075, attack: 0.004, decay: 0.12, peak: 0.055 },
      { kind: "tone", waveform: "triangle", frequency: 783.99, offset: 0.15, attack: 0.004, decay: 0.14, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1046.5, offset: 0.225, attack: 0.004, decay: 0.24, peak: 0.065 },
    ],
    shimmer: { delay: 0.1, feedback: 0.24, wet: 0.18, lowpass: 4800 },
  },
  /** Two distinct wooden knocks for calls, challenges, and table actions. */
  knock: {
    masterGain: 0.5,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 950, filterQ: 0.7, attack: 0.001, decay: 0.045, peak: 0.18 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2100, filterQ: 0.8, attack: 0.001, decay: 0.025, peak: 0.07 },
      { kind: "tone", waveform: "triangle", frequency: 200, glideTo: 160, glideTime: 0.04, attack: 0.001, decay: 0.06, peak: 0.06 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 950, filterQ: 0.7, offset: 0.28, attack: 0.001, decay: 0.045, peak: 0.18 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 2100, filterQ: 0.8, offset: 0.28, attack: 0.001, decay: 0.025, peak: 0.07 },
      { kind: "tone", waveform: "triangle", frequency: 200, glideTo: 160, glideTime: 0.04, offset: 0.28, attack: 0.001, decay: 0.06, peak: 0.06 },
    ],
  },
  /** A papery filtered flick with a tiny glass tick — for pages, galleries, and carousels. */
  page: {
    masterGain: 0.38,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1800, filterQ: 0.7, attack: 0.006, decay: 0.08, peak: 0.11 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 4200, filterQ: 1.2, offset: 0.04, attack: 0.004, decay: 0.065, peak: 0.08 },
      { kind: "tone", waveform: "sine", frequency: 2400, offset: 0.075, attack: 0.002, decay: 0.045, peak: 0.02 },
    ],
  },
  /** A brief unresolved lift — signals that user-initiated work has started. */
  loading: {
    masterGain: 0.42,
    layers: [
      { kind: "noise", filterType: "lowpass", filterFrequency: 1400, filterQ: 0.6, attack: 0.035, decay: 0.14, peak: 0.035 },
      { kind: "tone", waveform: "sine", frequency: 420, glideTo: 630, glideTime: 0.18, attack: 0.025, decay: 0.18, peak: 0.05 },
    ],
    shimmer: { delay: 0.11, feedback: 0.18, wet: 0.12, lowpass: 2800 },
  },
  /** A precise focus tick opening into a soft harmonic bloom — content is ready. */
  ready: {
    masterGain: 0.45,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 3200, filterQ: 1.7, attack: 0.001, decay: 0.018, peak: 0.1 },
      { kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.025, attack: 0.012, decay: 0.2, peak: 0.05 },
      { kind: "tone", waveform: "sine", frequency: 987.77, offset: 0.025, attack: 0.012, decay: 0.22, peak: 0.035 },
    ],
    shimmer: { delay: 0.13, feedback: 0.2, wet: 0.13, lowpass: 3600 },
  },
} as const satisfies Record<string, SoundRecipe>;

export type SoundName = keyof typeof RECIPES;

export function isSoundName(value: unknown): value is SoundName {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(RECIPES, value);
}

/** All available sound names, derived from the recipe palette. */
export const sounds = Object.keys(RECIPES) as readonly SoundName[];
