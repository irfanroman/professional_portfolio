import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/**
 * The single signature curve, expressed once and shared by both engines.
 * This is the exact SVG-path equivalent of the CSS
 * `cubic-bezier(0.16, 1, 0.3, 1)` declared in index.css, so a GSAP tween and a
 * CSS transition on the same page decelerate identically.
 */
CustomEase.create("signature", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("exit", "M0,0 C0.3,0 1,1 1,1");

export const EASE = {
  signature: "signature",
  exit: "exit",
  ambient: "sine.inOut",
};

/** Duration palette in seconds (GSAP's unit). Mirrors --dur-* in index.css. */
export const DUR = {
  quick: 0.18,
  standard: 0.38,
  slow: 0.62,
};

/** Stagger budgets — total must stay under 500ms (motion-design quality rule). */
export const STAGGER = {
  micro: 0.03,
  standard: 0.07,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor has asked their OS to reduce motion.
 * Every ambient/continuous effect (film-strip orbit, magnetic hover, parallax)
 * must check this and opt out — those are the effects most likely to cause
 * discomfort, and none of them carry information.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Subscribe to reduced-motion preference changes.
 * Returns an unsubscribe function.
 */
export function onReducedMotionChange(handler) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  const listener = (e) => handler(e.matches);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}

export { gsap };
