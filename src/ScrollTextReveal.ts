import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * A CSS selector, HTML element, or iterable collection of HTML elements.
 */
export type ScrollTextRevealTarget =
  | string
  | HTMLElement
  | Iterable<HTMLElement>;

/**
 * Controls the masked text reveal animation.
 */
export interface ScrollTextRevealOptions {
  /** Reveal whole lines or individual words. Defaults to lines. */
  split?: "lines" | "words";
  /** Animation duration in seconds. */
  duration?: number;
  /** Delay in seconds after the element reaches its viewport start position. */
  delay?: number;
  /** Delay in seconds between consecutive lines or words. */
  stagger?: number;
  /** Initial vertical offset as a percentage of each line or word. */
  distance?: number;
  /** Viewport percentage at which the animation starts. */
  start?: number;
  /** Any GSAP ease name accepted by gsap.to(). */
  ease?: string;
  /** Animate elements already visible when scrollTextReveal() is called. */
  animateInitiallyVisible?: boolean;
}

export interface ScrollTextRevealDefaults {
  readonly split: "lines";
  readonly duration: number;
  readonly delay: number;
  readonly stagger: number;
  readonly distance: number;
  readonly start: number;
  readonly ease: string;
  readonly animateInitiallyVisible: boolean;
}

export const scrollTextRevealDefaults: ScrollTextRevealDefaults = Object.freeze({
  split: "lines",
  duration: 0.85,
  delay: 0,
  stagger: 0.1,
  distance: 115,
  start: 86,
  ease: "power3.out",
  animateInitiallyVisible: false,
});

type ResolvedOptions = Required<ScrollTextRevealOptions>;

const initializedElements = new WeakSet<HTMLElement>();
let pluginsRegistered = false;
const readyAttribute = "data-scroll-text-reveal-ready";
const pendingAttribute = "data-scroll-text-reveal-pending";

const registerPlugins = (): void => {
  if (pluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  pluginsRegistered = true;
};

const isHTMLElement = (value: unknown): value is HTMLElement =>
  typeof HTMLElement !== "undefined" && value instanceof HTMLElement;

const resolveTargets = (target: ScrollTextRevealTarget): HTMLElement[] => {
  if (typeof document === "undefined") {
    throw new Error("scrollTextReveal requires a browser DOM.");
  }

  if (typeof target === "string") {
    try {
      return Array.from(document.querySelectorAll<HTMLElement>(target));
    } catch {
      throw new TypeError(`scrollTextReveal received an invalid selector: "${target}".`);
    }
  }

  if (isHTMLElement(target)) return [target];

  if (target && typeof target[Symbol.iterator] === "function") {
    const elements = Array.from(target);
    if (elements.every(isHTMLElement)) return elements;
  }

  throw new TypeError(
    "scrollTextReveal target must be a CSS selector, HTMLElement, or iterable of HTMLElements.",
  );
};

const finiteNumber = (
  name: keyof Pick<ResolvedOptions, "duration" | "delay" | "stagger" | "distance" | "start">,
  value: number,
  minimum: number,
  maximum = Number.POSITIVE_INFINITY,
): number => {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    const range = Number.isFinite(maximum)
      ? `between ${minimum} and ${maximum}`
      : `greater than or equal to ${minimum}`;
    throw new RangeError(`scrollTextReveal option "${name}" must be ${range}.`);
  }
  return value;
};

const resolveOptions = (options: ScrollTextRevealOptions): ResolvedOptions => {
  const { split = scrollTextRevealDefaults.split } = options;
  if (split !== "lines" && split !== "words") {
    throw new TypeError('scrollTextReveal option "split" must be "lines" or "words".');
  }

  const resolved = {
    ...scrollTextRevealDefaults,
    ...(split === "words" ? { duration: 1.1, stagger: 0.038, distance: 105 } : {}),
    ...options,
    split,
  };

  finiteNumber("duration", resolved.duration, 0);
  finiteNumber("delay", resolved.delay, 0);
  finiteNumber("stagger", resolved.stagger, 0);
  finiteNumber("distance", resolved.distance, 0);
  finiteNumber("start", resolved.start, 0, 100);

  if (typeof resolved.ease !== "string" || !resolved.ease.trim()) {
    throw new TypeError('scrollTextReveal option "ease" must be a non-empty string.');
  }
  if (typeof resolved.animateInitiallyVisible !== "boolean") {
    throw new TypeError(
      'scrollTextReveal option "animateInitiallyVisible" must be a boolean.',
    );
  }

  return resolved;
};

const isVisibleInViewport = (element: HTMLElement): boolean => {
  const bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
};

const markReady = (element: HTMLElement): void => {
  element.removeAttribute(pendingAttribute);
  element.setAttribute(readyAttribute, "");
};

/**
 * Reveals text by line or word when it enters the viewport.
 *
 * Calling the function more than once for the same element is safe: an element
 * is initialized only once.
 *
 * @example
 * scrollTextReveal("[data-scroll-text-reveal]", {
 *   duration: 0.9,
 *   delay: 0.15,
 *   stagger: 0.08,
 * });
 */
export const scrollTextReveal = (
  target: ScrollTextRevealTarget,
  options: ScrollTextRevealOptions = {},
): void => {
  if (typeof window === "undefined") {
    throw new Error("scrollTextReveal requires a browser DOM.");
  }

  const resolved = resolveOptions(options);
  const elements = resolveTargets(target);

  if (elements.length === 0) {
    return;
  }

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(markReady);
    return;
  }

  registerPlugins();

  const byLine = resolved.split === "lines";
  for (const element of elements) {
    if (initializedElements.has(element)) continue;

    const initiallyVisible = isVisibleInViewport(element);
    if (initiallyVisible && !resolved.animateInitiallyVisible) {
      markReady(element);
      continue;
    }

    element.setAttribute(pendingAttribute, "");
    let activeSplit: SplitText | undefined;
    try {
      SplitText.create(element, {
        type: resolved.split,
        mask: resolved.split,
        ...(byLine
          ? { linesClass: "scroll-text-reveal-line", autoSplit: true }
          : { wordsClass: "scroll-text-reveal-word" }),
        aria: "auto",
        onSplit: split => {
          activeSplit = split;
          const pieces = split[resolved.split];
          gsap.set(pieces, {
            yPercent: resolved.distance,
            ...(byLine ? { opacity: 0 } : {}),
          });

          return gsap.to(pieces, {
            yPercent: 0,
            ...(byLine ? { opacity: 1 } : {}),
            duration: resolved.duration,
            delay: resolved.delay,
            stagger: resolved.stagger,
            ease: resolved.ease,
            ...(initiallyVisible
              ? {}
              : {
                  scrollTrigger: {
                    trigger: element,
                    start: `top ${resolved.start}%`,
                    once: true,
                  },
                }),
          });
        },
      });
    } catch (error) {
      activeSplit?.revert();
      throw error;
    } finally {
      markReady(element);
    }

    initializedElements.add(element);
  }
};
