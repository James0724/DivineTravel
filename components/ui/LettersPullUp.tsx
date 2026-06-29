"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import * as React from "react";

interface LettersPullUpProps {
  text: string;
  /** Applied to every character span */
  className?: string;
  /** Inline style applied to every character span — useful for clay/italic accents */
  charStyle?: React.CSSProperties;
  /** Seconds added before the first character animates (for staggering multiple lines) */
  initialDelay?: number;
  /** Seconds between each consecutive character */
  charDelay?: number;
  /** Horizontal alignment of the flex row */
  justify?: "center" | "start" | "end";
}

/**
 * Reveals text character-by-character with a pull-up (y: 10→0) animation.
 * Adapted from ui.indie-starter.dev — extended with initialDelay, charStyle,
 * and justify so it can be used for multi-line hero headings.
 */
export function LettersPullUp({
  text,
  className = "",
  charStyle,
  initialDelay = 0,
  charDelay = 0.04,
  justify = "start",
}: LettersPullUpProps) {
  const chars = text.split("");

  const pullupVariant = {
    initial: { y: 12, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: initialDelay + i * charDelay,
        ease: [0.22, 1, 0.36, 1],
        duration: 0.5,
      },
    }),
  };

  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const justifyClass: Record<string, string> = {
    center: "justify-center",
    start: "justify-start",
    end: "justify-end",
  };

  return (
    <span
      ref={ref}
      className={cn("flex flex-wrap items-baseline", justifyClass[justify])}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          custom={i}
          className={cn(className)}
          style={charStyle}
        >
          {char === " " ? (
            <span className="hidden md:block">&nbsp;</span>
          ) : (
            char
          )}
        </motion.span>
      ))}
    </span>
  );
}
