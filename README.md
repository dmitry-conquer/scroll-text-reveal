# scroll-text-reveal

A tiny TypeScript library that reveals text by line or word when it enters the
viewport. Built for static websites with GSAP, ScrollTrigger, and SplitText.

## Features

- Masked reveal by line or word, with a wave effect in word mode
- Readable text when JavaScript is unavailable
- Configurable duration, trigger delay, stagger, distance, start position,
  and easing
- Optional animation for elements visible during initialization
- Responsive line re-splitting after font loading and width changes
- Automatic screen-reader attributes through SplitText
- Automatic `prefers-reduced-motion` safeguard
- Duplicate initialization protection
- ESM, CommonJS, and TypeScript declarations

## Installation

```bash
pnpm add scroll-text-reveal gsap
```

```bash
npm install scroll-text-reveal gsap
```

```bash
yarn add scroll-text-reveal gsap
```

GSAP 3.13 or newer is required.

### CDN

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/scroll-text-reveal/dist/styles.css"
>

<script type="module">
  import scrollTextReveal from "https://cdn.jsdelivr.net/npm/scroll-text-reveal/+esm";

  scrollTextReveal("[data-scroll-text-reveal]");
</script>
```

The jsDelivr ESM endpoint resolves the required GSAP modules. The optional
stylesheet keeps marked text hidden while the library prepares its animation.

## Quick start

Add a selector to the text you want to reveal:

```html
<h2 data-scroll-text-reveal>
  A heading that reveals one line at a time.
</h2>
```

Initialize it once after the page markup is available:

```ts
import { scrollTextReveal } from "scroll-text-reveal";

scrollTextReveal("[data-scroll-text-reveal]");
```

Default and named imports are both supported:

```ts
import scrollTextReveal from "scroll-text-reveal";
```

```ts
import { scrollTextReveal } from "scroll-text-reveal";
```

The function accepts a CSS selector, one `HTMLElement`, or an iterable
collection of `HTMLElement`s.

### Optional stylesheet

Import the stylesheet to hide marked targets during animation setup.

```ts
import "scroll-text-reveal/styles.css";
import { scrollTextReveal } from "scroll-text-reveal";
```

Marked text is visible before initialization and when JavaScript is unavailable.
If an initially visible heading is configured to animate and the script loads
after the first paint, the heading can briefly appear in its original state.

## Configuration

```ts
scrollTextReveal(".reveal-heading", {
  split: "lines",
  duration: 0.85,
  delay: 0,
  stagger: 0.1,
  distance: 115,
  start: 86,
  ease: "power3.out",
  animateInitiallyVisible: false,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `split` | `"lines"` or `"words"` | `"lines"` | Unit of the reveal and its mask |
| `duration` | `number` | `0.85` for lines, `1.1` for words | Animation duration in seconds |
| `delay` | `number` | `0` | Pause after the element reaches its viewport start position |
| `stagger` | `number` | `0.1` for lines, `0.038` for words | Delay between consecutive starts in seconds |
| `distance` | `number` | `115` for lines, `105` for words | Initial vertical offset as a percentage of each line or word |
| `start` | `number` | `86` | Viewport percentage at which the reveal starts |
| `ease` | `string` | `power3.out` | GSAP easing name |
| `animateInitiallyVisible` | `boolean` | `false` | Animate text already visible during initialization |

`start: 86` means that the animation is triggered when the top of the element
reaches a point 86% down the viewport.

### Word wave

Use `split: "words"` to slide each word up through its own mask. Each word starts
38 ms after the previous one by default. The stagger continues across line breaks.

```ts
scrollTextReveal(".wave-heading", { split: "words" });
```

### Delayed reveal

`delay` starts after ScrollTrigger activates the animation:

```ts
scrollTextReveal(".delayed-heading", {
  delay: 0.5,
});
```

### Initially visible text

By default, text already visible when `scrollTextReveal()` runs is left
untouched. Enable its animation explicitly:

```ts
scrollTextReveal(".hero-heading", {
  animateInitiallyVisible: true,
  delay: 0.2,
});
```

### Direct elements

```ts
const heading = document.querySelector<HTMLElement>(".heading");

if (heading) {
  scrollTextReveal(heading);
}
```

```ts
scrollTextReveal(document.querySelectorAll<HTMLElement>(".reveal"));
```

Calling `scrollTextReveal()` more than once for an element is safe. An element
that has already been initialized is ignored.

## Accessibility

When a visitor requests reduced motion, the text stays visible in its original
markup.

SplitText uses `aria: "auto"` so the original text is exposed as a single
accessible label while generated lines or words are hidden from screen readers. For text
containing interactive nested elements such as links, review the alternative
accessibility strategy in the
[SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/).

## Browser support

The library targets modern browsers supported by GSAP and requires a browser
DOM. Call it after the relevant HTML has been parsed, either from a module at
the end of `body` or after `DOMContentLoaded`.

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm build:docs
```

Use `pnpm dev` to open the demo.
