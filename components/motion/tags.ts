import { motion } from "motion/react";

/**
 * Explicit map of the elements motion wrappers are allowed to render as. Using
 * a fixed map keeps the wrappers type-safe and avoids constructing a new motion
 * component on every render.
 */
export const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  ul: motion.ul,
} as const;

export type MotionTag = keyof typeof motionTags;
