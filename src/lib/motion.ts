import type { Variants, Transition } from "motion/react";

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inExpo: [0.7, 0, 0.84, 0] as [number, number, number, number],
};

export const spring = {
  interactive: { type: "spring" as const, stiffness: 400, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.outExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: ease.outExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: ease.outExpo },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.outExpo },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.outExpo },
  },
};

export const popIn: Variants = {
  initial: { scale: 1 },
  pop: {
    scale: [1, 1.06, 0.97, 1],
    transition: { duration: 0.35, ease: ease.outExpo },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 6 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: ease.outExpo },
  },
};

export const defaultTransition: Transition = {
  duration: 0.5,
  ease: ease.outExpo,
};
