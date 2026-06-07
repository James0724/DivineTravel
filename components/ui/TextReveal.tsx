"use client"

import { motion, useInView } from "framer-motion"
import * as React from "react"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─── SplitWords ─────────────────────────────────────────────────────────────
   Reveals a plain-string heading word-by-word.
   Each word slides up from behind an overflow-hidden mask (the "curtain" reveal).
   Only accepts a string child — for mixed JSX use LineReveal instead.
────────────────────────────────────────────────────────────────────────────── */
export function SplitWords({
  children,
  className,
  delay = 0,
  wordDelay = 0.07,
  duration = 0.68,
}: {
  children: string
  className?: string
  delay?: number
  wordDelay?: number
  duration?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })
  const words = children.split(" ")

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {/* The overflow-hidden parent clips the rising word */}
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "112%" }}
              animate={isInView ? { y: "0%" } : {}}
              transition={{ duration, delay: delay + i * wordDelay, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </span>
  )
}

/* ─── LineReveal ─────────────────────────────────────────────────────────────
   Curtain-reveal for a single line of content (including JSX children).
   Wrap each heading line in its own <LineReveal> with increasing delay.
────────────────────────────────────────────────────────────────────────────── */
export function LineReveal({
  children,
  delay = 0,
  duration = 0.75,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", overflow: "hidden" }}
    >
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "106%", opacity: 0 }}
        animate={isInView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* ─── BlurReveal ─────────────────────────────────────────────────────────────
   Blur + opacity + subtle y-lift for body paragraphs and block elements.
────────────────────────────────────────────────────────────────────────────── */
export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
  style,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  style?: React.CSSProperties
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ─── ClipReveal ─────────────────────────────────────────────────────────────
   Clip-path wipe — reveals content with a directional sweep.
   direction="bottom"  → curtain lifts upward   (default, good for images)
   direction="left"    → sweeps left-to-right
   direction="right"   → sweeps right-to-left
────────────────────────────────────────────────────────────────────────────── */
export function ClipReveal({
  children,
  className,
  delay = 0,
  duration = 1.05,
  direction = "bottom",
  style,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "bottom" | "top" | "left" | "right"
  style?: React.CSSProperties
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  const clipStart: Record<string, string> = {
    bottom: "inset(100% 0% 0% 0%)",
    top:    "inset(0% 0% 100% 0%)",
    left:   "inset(0% 100% 0% 0%)",
    right:  "inset(0% 0% 0% 100%)",
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ clipPath: clipStart[direction] }}
      animate={isInView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
