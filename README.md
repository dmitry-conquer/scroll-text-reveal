# scroll-text-reveal

A tiny TypeScript library that reveals text line by line when it enters the
viewport. Built for static websites with GSAP, ScrollTrigger, and SplitText.

## Features

- Line-by-line masked text reveal
- One small function and seven practical options
- Configurable duration, trigger delay, line stagger, distance, start position,
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

## Configuration

```ts
scrollTextReveal(".reveal-heading", {
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
| `duration` | `number` | `0.85` | Animation duration in seconds |
| `delay` | `number` | `0` | Pause after the element reaches its viewport start position |
| `stagger` | `number` | `0.1` | Delay between consecutive lines in seconds |
| `distance` | `number` | `115` | Initial vertical offset as a percentage of each line |
| `start` | `number` | `86` | Viewport percentage at which the reveal starts |
| `ease` | `string` | `power3.out` | GSAP easing name |
| `animateInitiallyVisible` | `boolean` | `false` | Animate text already visible during initialization |

`start: 86` means that the animation is triggered when the top of the element
reaches a point 86% down the viewport.

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

When a visitor requests reduced motion, the function returns before splitting
or animating any text.

SplitText uses `aria: "auto"` so the original text is exposed as a single
accessible label while generated lines are hidden from screen readers. For text
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
