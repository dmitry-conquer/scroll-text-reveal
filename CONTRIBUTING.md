# Contributing

Thanks for helping improve scroll-text-reveal.

## Development

Requirements: Node.js 18 or newer and pnpm.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm build:docs
```

Use `pnpm dev` to open the scrolling demo.

Keep the public API small and framework-agnostic. New behavior should directly
support line reveals in static websites, include tests, and update the README
and changelog when it changes the public API.
