/**
 * Cuelume — curated interaction sounds synthesized via the Web Audio API.
 * No audio files, no dependencies, one shared `AudioContext`.
 *
 * Declarative:
 *   import { bind } from "cuelume";
 *   bind(); // wires up all data-sound-* attributes
 *
 * Imperative:
 *   import { play } from "cuelume";
 *   play("droplet");
 */

export type { SoundName } from "./sounds.js";
export { sounds } from "./sounds.js";
export { play } from "./engine.js";
export { bind } from "./bind.js";
