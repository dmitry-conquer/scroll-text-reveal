import {
  scrollTextReveal,
  scrollTextRevealDefaults,
} from "../src";
import "../src/styles.css";

const replayButton = document.querySelector<HTMLButtonElement>("[data-replay]");
const initialDefaultReveal = document.querySelector<HTMLElement>(
  "[data-reveal='default']",
);
const initialScrollReveal = document.querySelector<HTMLElement>(
  "[data-reveal='scroll']",
);
const scrollReplayStage = document.querySelector<HTMLElement>("[data-scroll-replay]");

if (
  !replayButton ||
  !initialDefaultReveal ||
  !initialScrollReveal ||
  !scrollReplayStage
) {
  throw new Error("ScrollTextReveal demo elements are missing.");
}

let defaultReveal = initialDefaultReveal;
const defaultMarkup = defaultReveal.innerHTML;
const defaultTemplate = defaultReveal.cloneNode(false) as HTMLElement;
let scrollReveal = initialScrollReveal;
const scrollMarkup = scrollReveal.innerHTML;
const scrollTemplate = scrollReveal.cloneNode(false) as HTMLElement;

const playDefaultReveal = (): void => {
  scrollTextReveal(defaultReveal, {
    animateInitiallyVisible: true,
  });
};

replayButton.addEventListener("click", () => {
  const replacement = defaultTemplate.cloneNode(false) as HTMLElement;
  replacement.innerHTML = defaultMarkup;
  defaultReveal.replaceWith(replacement);
  defaultReveal = replacement;
  playDefaultReveal();
});

playDefaultReveal();

const replayScrollReveal = (): void => {
  const replacement = scrollTemplate.cloneNode(false) as HTMLElement;
  replacement.innerHTML = scrollMarkup;
  scrollReveal.replaceWith(replacement);
  scrollReveal = replacement;
  scrollTextReveal(scrollReveal, {
    animateInitiallyVisible: true,
  });
};

const scrollReplayObserver = new IntersectionObserver(
  entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      replayScrollReveal();
    }
  },
  {
    rootMargin: "0px 0px -14% 0px",
    threshold: 0,
  },
);

scrollReplayObserver.observe(scrollReplayStage);

window.addEventListener("pagehide", () => {
  scrollReplayObserver.disconnect();
});

Object.assign(window, {
  scrollTextReveal,
  scrollTextRevealDefaults,
});
