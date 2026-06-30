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

export function LettersPullUp({
  text,
  className = "",
  charStyle,
  initialDelay = 0,
  charDelay = 0.04,
  justify = "start",
}: LettersPullUpProps) {
  // Split text into words first
  const words = text.split(" ");

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

  // Keep a global character index tracker to maintain proper staggered delay timing
  let charIndexCounter = 0;

  return (
    <span
      ref={ref}
      className={cn(
        "flex flex-wrap items-baseline gap-x-[0.25em]",
        justifyClass[justify],
      )}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        /* The inline-block and whitespace-nowrap wrappers keep words whole */
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const currentIdx = charIndexCounter;
            charIndexCounter++; // increment for the next letter

            return (
              <motion.span
                key={currentIdx}
                aria-hidden="true"
                variants={pullupVariant}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                custom={currentIdx}
                className={cn("inline-block", className)}
                style={charStyle}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
