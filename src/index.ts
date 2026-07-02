/**
 * tactile — tiny synthesized tactile UI sounds via the Web Audio API.
 * No audio files, no dependencies, one shared `AudioContext`.
 *
 * Declarative:
 *   import { bind } from "tactile";
 *   bind(); // wires up all data-sound-* attributes
 *
 * Imperative:
 *   import { play } from "tactile";
 *   play("droplet");
 */

export type { SoundName } from "./sounds.js";
export { sounds } from "./sounds.js";
export { play } from "./engine.js";
export { bind } from "./bind.js";
