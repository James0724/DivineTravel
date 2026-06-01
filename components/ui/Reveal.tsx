"use client"

import { motion, type Variants } from "framer-motion"

// ─── Shared constants ─────────────────────────────────────────────────────────

type RevealVariant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleUp"

const VARIANTS: Record<RevealVariant, Variants> = {
  fadeUp:     { hidden: { opacity: 0, y: 32 },       visible: { opacity: 1, y: 0 } },
  fadeIn:     { hidden: { opacity: 0 },              visible: { opacity: 1 } },
  slideLeft:  { hidden: { opacity: 0, x: -44 },      visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 44 },       visible: { opacity: 1, x: 0 } },
  scaleUp:    { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
}

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]
const VIEWPORT = { once: true, margin: "-60px" } as const

// ─── Reveal ───────────────────────────────────────────────────────────────────
// Standalone scroll-triggered reveal wrapper.

interface RevealProps {
  children: React.ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.55,
  className,
  style,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger ──────────────────────────────────────────────────────────────────
// Container that staggers the reveal of its RevealItem children.

interface StaggerProps {
  children: React.ReactNode
  stagger?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function Stagger({ children, stagger = 0.08, delay = 0, className, style }: StaggerProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── RevealItem ───────────────────────────────────────────────────────────────
// Direct child of Stagger — inherits the hidden/visible orchestration.

interface RevealItemProps {
  children: React.ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function RevealItem({
  children,
  variant = "fadeUp",
  duration = 0.5,
  className,
  style,
}: RevealItemProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
