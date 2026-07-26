import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  registerPlugin: vi.fn(),
  from: vi.fn(
    (_targets: unknown, _vars: Record<string, unknown>) => ({
      animation: true,
    }),
  ),
  splitCreate: vi.fn(
    (
      _element: HTMLElement,
      config: {
        onSplit: (split: { lines: HTMLElement[] }) => unknown;
      },
    ) => {
      config.onSplit({
        lines: [document.createElement("div"), document.createElement("div")],
      });
      return { split: true };
    },
  ),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: mocks.registerPlugin,
    from: mocks.from,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { name: "ScrollTrigger" },
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: {
    create: mocks.splitCreate,
  },
}));

import {
  scrollTextReveal,
  scrollTextRevealDefaults,
} from "../src";

const setBounds = (
  element: HTMLElement,
  top: number,
  bottom = top + 60,
): void => {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: top,
    top,
    bottom,
    left: 0,
    right: 320,
    width: 320,
    height: bottom - top,
    toJSON: () => ({}),
  });
};

beforeEach(() => {
  document.body.innerHTML = "";
  mocks.registerPlugin.mockClear();
  mocks.from.mockClear();
  mocks.splitCreate.mockClear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

describe("scrollTextReveal", () => {
  it("exposes the documented minimal defaults", () => {
    expect(scrollTextRevealDefaults).toEqual({
      duration: 0.85,
      delay: 0,
      stagger: 0.1,
      distance: 115,
      start: 86,
      ease: "power3.out",
      animateInitiallyVisible: false,
    });
    expect(Object.isFrozen(scrollTextRevealDefaults)).toBe(true);
  });

  it("creates a masked line reveal for elements below the viewport", () => {
    document.body.innerHTML = '<h2 class="reveal">Example heading</h2>';
    const heading = document.querySelector<HTMLElement>(".reveal");
    expect(heading).not.toBeNull();
    setBounds(heading!, 1200);

    scrollTextReveal(".reveal");

    expect(mocks.splitCreate).toHaveBeenCalledOnce();
    expect(mocks.splitCreate.mock.calls[0]?.[1]).toMatchObject({
      type: "lines",
      mask: "lines",
      linesClass: "scroll-text-reveal-line",
      autoSplit: true,
      aria: "auto",
    });
    expect(mocks.from).toHaveBeenCalledWith(expect.any(Array), {
      yPercent: 115,
      opacity: 0,
      duration: 0.85,
      delay: 0,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 86%",
        once: true,
      },
    });
  });

  it("applies the supported animation options", () => {
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 1000);

    scrollTextReveal(heading, {
      duration: 1.4,
      delay: 0.3,
      stagger: 0.18,
      distance: 80,
      start: 70,
      ease: "expo.out",
    });

    expect(mocks.from).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        duration: 1.4,
        delay: 0.3,
        stagger: 0.18,
        yPercent: 80,
        ease: "expo.out",
        scrollTrigger: expect.objectContaining({
          start: "top 70%",
        }),
      }),
    );
  });

  it("skips initially visible elements by default", () => {
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 100, 180);

    scrollTextReveal(heading);

    expect(mocks.splitCreate).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("animates initially visible elements immediately when enabled", () => {
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 100, 180);

    scrollTextReveal(heading, {
      animateInitiallyVisible: true,
      delay: 0.25,
    });

    expect(mocks.splitCreate).toHaveBeenCalledOnce();
    expect(mocks.from).toHaveBeenCalledWith(
      expect.any(Array),
      expect.not.objectContaining({
        scrollTrigger: expect.anything(),
      }),
    );
    expect(mocks.from.mock.calls[0]?.[1]).toMatchObject({
      delay: 0.25,
    });
  });

  it("accepts iterable element collections", () => {
    const first = document.createElement("h2");
    const second = document.createElement("p");
    document.body.append(first, second);
    setBounds(first, 900);
    setBounds(second, 1100);

    scrollTextReveal([first, second]);

    expect(mocks.splitCreate).toHaveBeenCalledTimes(2);
  });

  it("does nothing when reduced motion is requested", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
      })),
    );
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 1000);

    scrollTextReveal(heading);

    expect(mocks.splitCreate).not.toHaveBeenCalled();
  });

  it("does not initialize an element twice", () => {
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 1000);

    scrollTextReveal(heading);
    scrollTextReveal(heading);

    expect(mocks.splitCreate).toHaveBeenCalledOnce();
  });

  it("allows an initially skipped element to be explicitly animated later", () => {
    const heading = document.createElement("h2");
    document.body.append(heading);
    setBounds(heading, 100);

    scrollTextReveal(heading);
    scrollTextReveal(heading, { animateInitiallyVisible: true });

    expect(mocks.splitCreate).toHaveBeenCalledOnce();
  });

  it("accepts selectors that match no elements", () => {
    expect(() => scrollTextReveal(".missing")).not.toThrow();
    expect(mocks.splitCreate).not.toHaveBeenCalled();
  });

  it("rejects invalid selectors, targets, and option values", () => {
    expect(() => scrollTextReveal("[")).toThrow(/invalid selector/i);
    expect(() =>
      scrollTextReveal(null as unknown as HTMLElement),
    ).toThrow(/target must be/i);

    const heading = document.createElement("h2");
    expect(() => scrollTextReveal(heading, { duration: -1 })).toThrow(
      /duration/,
    );
    expect(() => scrollTextReveal(heading, { start: 101 })).toThrow(/start/);
    expect(() => scrollTextReveal(heading, { ease: " " })).toThrow(/ease/);
  });
});
