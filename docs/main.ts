import {
  scrollTextReveal,
  scrollTextRevealDefaults,
} from "../src";

scrollTextReveal("[data-reveal='hero']", {
  animateInitiallyVisible: true,
  delay: 0.2,
  duration: 1,
});

scrollTextReveal("[data-reveal='default']");

scrollTextReveal("[data-reveal='slow']", {
  duration: 1.5,
  stagger: 0.14,
});

scrollTextReveal("[data-reveal='delay']", {
  delay: 0.55,
});

scrollTextReveal("[data-reveal='tight']", {
  duration: 0.65,
  stagger: 0.035,
  distance: 75,
});

scrollTextReveal("[data-reveal='deep']", {
  duration: 1.05,
  stagger: 0.12,
  distance: 180,
  start: 72,
  ease: "expo.out",
});

scrollTextReveal("[data-reveal='soft']", {
  duration: 1.2,
  stagger: 0.08,
  distance: 55,
  start: 82,
  ease: "power2.out",
});

Object.assign(window, {
  scrollTextReveal,
  scrollTextRevealDefaults,
});
