# Changelog

All notable changes to scroll-text-reveal will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-11-23

### Added

- Optional `split: "words"` mode with a mask per word and 38 ms between starts.
- A word-wave example in the demo.

### Fixed

- Marked text stays visible if JavaScript is disabled or the library fails to load.

## [0.2.3] - 2026-07-30

### Changed

- Added a jsDelivr ESM example with the optional no-flash stylesheet to the
  README.

## [0.2.2] - 2026-07-28

### Fixed

- Prevented reveal targets from flashing in their final state before the
  animation starts
- Made the initial line state explicit before creating the reveal tween
- Ensured skipped and reduced-motion targets remain visible when using the
  no-flash stylesheet

### Added

- Optional `scroll-text-reveal/styles.css` export for hiding marked text until
  initialization

## [0.2.1] - 2026-07-26

### Added

- Default function export while preserving the named `scrollTextReveal` export

### Changed

- Refined the documentation demo and package metadata

## [0.1.0] - 2026-07-26

### Added

- Line-by-line masked text reveals powered by GSAP, ScrollTrigger, and SplitText
- CSS selector, HTMLElement, and iterable target support
- Duration, trigger delay, line stagger, distance, viewport start, and ease
  configuration
- Optional animation for elements visible during initialization
- Automatic responsive line re-splitting
- Reduced-motion and accessibility safeguards
- Duplicate element initialization protection
- ESM, CommonJS, and TypeScript declaration builds
- Scrolling documentation demo with multiple configurations
