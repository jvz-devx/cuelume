# Cuelume

Ten carefully designed interaction sounds for the web. Synthesized live with Web Audio, with no audio files and zero runtime dependencies.

Cuelume is a curated sound palette, not an audio engine. It gives buttons, links, toggles, and completed actions clear feedback without asking developers to design sounds themselves. Add an attribute, call `bind()`, done.

## Install

```sh
npm install cuelume
```

## Quick start

Add data attributes to your markup:

```html
<button data-sound-press data-sound-release>Save</button>
<a data-sound-hover="tick">Docs</a>
<button data-sound-toggle>Dark mode</button>
```

Then wire everything up once:

```ts
import { bind } from "cuelume";

bind();
```

| Attribute            | Fires on       | Default sound |
| -------------------- | -------------- | ------------- |
| `data-sound-hover`   | `pointerenter` | `chime`       |
| `data-sound-press`   | `pointerdown`  | `press`       |
| `data-sound-release` | `pointerup`    | `release`     |
| `data-sound-toggle`  | `click`        | `toggle`      |

Leave the attribute value empty to use the default, or set it to any sound name.

Prefer code? Play sounds imperatively:

```ts
import { play } from "cuelume";

await navigator.clipboard.writeText(text);
play("success");
```

## Sounds

| Name      | Character                    | Suggested use                    |
| --------- | ---------------------------- | -------------------------------- |
| `chime`   | Soft two-note ascending bell | Default hover                    |
| `sparkle` | Quick four-note twinkle      | Playful accents                  |
| `droplet` | Single note gliding down     | Dismiss, collapse                |
| `bloom`   | Warm slow swell              | Reveal, expand                   |
| `whisper` | Breathy quiet swell          | Dense lists                      |
| `tick`    | Crisp instant tick           | Nav and menu hover               |
| `press`   | Dull muted knock             | Pointer down                     |
| `release` | Brighter springy tick        | Pointer up                       |
| `toggle`  | Mechanical click-clack       | Switches, tabs                   |
| `success` | Warm three-note confirmation | After an action succeeds (e.g. copy to clipboard) |

## API

```ts
import { play, bind, sounds, type SoundName } from "cuelume";
```

- **`play(name?: SoundName)`** — play a sound immediately. Defaults to `"chime"`.
- **`bind(root?: ParentNode)`** — wire all `data-sound-*` attributes under `root` (defaults to the whole document). Idempotent — safe to call repeatedly, e.g. after DOM swaps.
- **`sounds`** — the list of all sound names.
- **`SoundName`** — union type of the ten sound names.

## Defaults that behave

- **Pointer-aware.** Hover, press, and release require a fine mouse pointer. Toggle follows native click activation, including keyboard and touch.
- **Hover repeat guard.** The same hover target won't replay within 150ms.
- **One lazy `AudioContext`.** Shared across all sounds, created on first use.
- **Autoplay-friendly.** Respects the browser's autoplay policy and resumes on the first user gesture.
- **SSR-safe.** Importing on the server is a no-op.
- **Safe fallback.** Where Web Audio isn't available, `play()` is a no-op.
- **Idempotent binding.** `bind()` never double-attaches listeners.

## Frameworks

Cuelume works anywhere HTML does — plain pages, Astro, React, Vue. Call `bind()` once the DOM is ready, and again after client-side navigation or DOM swaps.

React:

```tsx
useEffect(() => {
  bind();
});
```

Astro (with view transitions):

```js
import { bind } from "cuelume";

bind();
document.addEventListener("astro:after-swap", bind);
```

## License

MIT
