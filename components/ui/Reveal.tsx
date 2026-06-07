"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

type RevealVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleUp";

// Expo-out — strong initial acceleration, smooth landing; feels deliberate and premium
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Custom spring transition for the fade-up/down animations
const SPRING_TRANSITION = { type: "spring" } as const;

// Updated variants integrating the spring physical behavior for fadeUp/fadeDown
const VARIANTS: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -18 },
    visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 },
  },
};

// Trigger when element top is ~80 px from the bottom of the viewport
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

// ─── Reveal ───────────────────────────────────────────────────────────────────

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.9,
  className,
  style,
}: RevealProps) {
  // Check if this variant uses the built-in spring transition override
  const hasCustomTransition = variant === "fadeUp" || variant === "fadeDown";

  return (
    <motion.div
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={
        hasCustomTransition ? undefined : { duration, delay, ease: EASE }
      }
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger ──────────────────────────────────────────────────────────────────

interface StaggerProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Stagger({
  children,
  stagger = 0.13,
  delay = 0,
  className,
  style,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── RevealItem ───────────────────────────────────────────────────────────────

interface RevealItemProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RevealItem({
  children,
  variant = "fadeUp",
  duration = 0.8,
  className,
  style,
}: RevealItemProps) {
  const hasCustomTransition = variant === "fadeUp" || variant === "fadeDown";

  return (
    <motion.div
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      transition={hasCustomTransition ? undefined : { duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
