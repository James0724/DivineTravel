"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import * as React from "react"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface GradualSpacingProps {
  text: string
  className?: string
  delay?: number
  /** seconds between each character animation */
  charDelay?: number
}

/**
 * Reveals text character-by-character, sliding in from the left.
 * Best used for short eyebrow labels and section headings (≤40 chars).
 */
export function GradualSpacing({
  text,
  className,
  delay = 0,
  charDelay = 0.035,
}: GradualSpacingProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "baseline" }}
      aria-label={text}
    >
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.42, delay: delay + i * charDelay, ease: EASE }}
          >
            {char === " " ? <>&nbsp;</> : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}
