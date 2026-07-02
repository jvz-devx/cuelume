/**
 * Declarative binding — one call to `bind()` wires up every element
 * carrying a `data-sound-*` attribute:
 *
 *   data-sound-hover    → plays on pointerenter (mouse-only, debounced)
 *   data-sound-press    → plays on pointerdown  (mouse-only)
 *   data-sound-release  → plays on pointerup    (mouse-only)
 *   data-sound-toggle   → plays on click
 *
 * The attribute's value picks the sound; an empty or unrecognized value
 * falls back to that attribute's default ("chime", "press", "release",
 * "toggle" respectively). Mouse-only guards skip touch, so sounds read
 * as a physical response to the actual gesture.
 *
 * Idempotent — safe to call repeatedly (e.g. after view transitions or
 * client-side navigation swap in new DOM).
 */

import { play } from "./engine.js";
import { RECIPES, type SoundName } from "./sounds.js";

const BOUND_ATTR = "data-sound-bound";
const RETRIGGER_GAP_MS = 150;

let lastTarget: EventTarget | null = null;
let lastTriggerTime = 0;

function resolve(el: HTMLElement, attr: string, fallback: SoundName): SoundName {
  const requested = el.getAttribute(attr) || fallback;
  return (requested in RECIPES ? requested : fallback) as SoundName;
}

function isMouse(event: PointerEvent): boolean {
  return event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Binds all `data-sound-*` attributes under `root` (default: the whole
 * document). Safe no-op during SSR. Idempotent — already-bound elements
 * are marked with `data-sound-bound` and skipped on later calls.
 */
export function bind(root?: ParentNode): void {
  if (typeof document === "undefined") return;
  const scope = root ?? document;

  scope
    .querySelectorAll<HTMLElement>("[data-sound-hover], [data-sound-press], [data-sound-release], [data-sound-toggle]")
    .forEach((el) => {
      if (el.getAttribute(BOUND_ATTR) === "true") return;
      el.setAttribute(BOUND_ATTR, "true");

      if (el.hasAttribute("data-sound-hover")) {
        el.addEventListener("pointerenter", (event) => {
          if (!isMouse(event)) return;

          const now = performance.now();
          if (event.currentTarget === lastTarget && now - lastTriggerTime < RETRIGGER_GAP_MS) {
            return;
          }
          lastTarget = event.currentTarget;
          lastTriggerTime = now;

          play(resolve(el, "data-sound-hover", "chime"));
        });
      }

      if (el.hasAttribute("data-sound-press")) {
        el.addEventListener("pointerdown", (event) => {
          if (isMouse(event)) play(resolve(el, "data-sound-press", "press"));
        });
      }

      if (el.hasAttribute("data-sound-release")) {
        el.addEventListener("pointerup", (event) => {
          if (isMouse(event)) play(resolve(el, "data-sound-release", "release"));
        });
      }

      if (el.hasAttribute("data-sound-toggle")) {
        el.addEventListener("click", () => play(resolve(el, "data-sound-toggle", "toggle")));
      }
    });
}
