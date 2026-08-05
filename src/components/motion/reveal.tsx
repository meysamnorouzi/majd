"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

const offsets: Record<RevealVariant, { x?: number; y?: number; scale?: number }> =
  {
    up: { y: 36 },
    down: { y: -24 },
    left: { x: 40 },
    right: { x: -40 },
    fade: {},
    scale: { scale: 0.96, y: 16 },
  };

function buildVariants(
  variant: RevealVariant,
  reduced: boolean | null,
): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.01 },
      },
    };
  }

  const offset = offsets[variant];
  return {
    hidden: {
      opacity: 0,
      x: offset.x ?? 0,
      y: offset.y ?? 0,
      scale: offset.scale ?? 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: EASE,
      },
    },
  };
}

/** "some" = any pixel visible. Avoid amount ratios — tall wrappers never hit 20% in-view. */
const viewport = { once: true, amount: "some" as const, margin: "0px 0px -40px 0px" };

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  as?: "div" | "section" | "article" | "header" | "footer" | "li" | "span";
  /** Use for above-the-fold content that should animate on mount */
  immediate?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "animate">;

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as = "div",
  immediate = false,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as ElementType;

  return (
    <Component
      className={className}
      variants={buildVariants(variant, reduced)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" as const }
        : { whileInView: "visible" as const, viewport })}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
  /** Use for above-the-fold content that should animate on mount */
  immediate?: boolean;
};

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
  as = "div",
  immediate = false,
}: StaggerProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as ElementType;
  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };

  if (immediate) {
    return (
      <Component
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "li" | "article";
};

export function StaggerItem({
  children,
  className,
  variant = "up",
  as = "div",
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as ElementType;

  return (
    <Component
      className={className}
      variants={buildVariants(variant, reduced)}
    >
      {children}
    </Component>
  );
}

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

/** Immediate entrance (hero / page load) — not scroll-triggered */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
}: FadeInProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.01 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
