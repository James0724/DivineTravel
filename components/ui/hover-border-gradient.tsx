"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

/**
 * Button / link with an animated gradient border that rotates around the edge.
 * On hover the border highlights with a warm clay burst.
 *
 * Usage as a link:
 *   import Link from "next/link"
 *   <HoverBorderGradient as={Link} href="/contact">Plan My Safari</HoverBorderGradient>
 *
 * Adapted from ui.indie-starter.dev / Aceternity UI — recoloured for the
 * Divine Travel Nest safari palette (forest green + cream border + clay highlight).
 */
export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<{
  as?: React.ElementType;
  containerClassName?: string;
  /** Applied to the inner content wrapper (controls bg, text, padding, size) */
  className?: string;
  duration?: number;
  clockwise?: boolean;
  /** Forward href so the component works as a Next.js Link */
  href?: string;
}> &
  Omit<React.HTMLAttributes<HTMLElement>, "className">) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (current: Direction): Direction => {
    const dirs: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const idx = dirs.indexOf(current);
    const next = clockwise
      ? (idx - 1 + dirs.length) % dirs.length
      : (idx + 1) % dirs.length;
    return dirs[next];
  };

  /* Warm cream/sand radial sweep — matches the site's bone-paper tone */
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(244,239,226,0.95) 0%, rgba(255,255,255,0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(244,239,226,0.95) 0%, rgba(255,255,255,0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, rgba(244,239,226,0.95) 0%, rgba(255,255,255,0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, rgba(244,239,226,0.95) 0%, rgba(255,255,255,0) 100%)",
  };

  /* Clay burst on hover */
  const highlight =
    "radial-gradient(75% 181.2% at 50% 50%, #9d4519 0%, rgba(255,255,255,0) 100%)";

  /* Auto-rotate border when idle */
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(
      () => setDirection((d) => rotateDirection(d)),
      duration * 1000,
    );
    return () => clearInterval(id);
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        /* Container: 1px padding so the gradient border shows through */
        "relative flex rounded-full border border-transparent",
        "content-center items-center flex-col flex-nowrap",
        "h-min justify-center overflow-visible p-px w-fit",
        "transition duration-300",
        containerClassName,
      )}
      {...props}
    >
      {/* ── Inner content ──────────────────────────────────────────────── */}
      <div
        className={cn(
          /* Inverts on hover: forest bg → clay bg, cream text stays */
          "relative z-10 w-auto rounded-[inherit]",
          "flex items-center justify-center text-center",
          "transition-colors duration-300",
          hovered ? "bg-bone-clay text-bone-paper" : "bg-bone-forest text-bone-paper",
          "px-3.5 py-1.5 text-[12px] font-sans tracking-[0.01em]",
          className,
        )}
      >
        {children}
      </div>

      {/* ── Animated gradient border (behind everything) ───────────────── */}
      <motion.div
        className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden"
        style={{ filter: "blur(2px)", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />

      {/* ── Fill — hides gradient except at the 1px edge; inverts on hover ─ */}
      <div
        className={cn(
          "absolute z-[1] inset-[2px] rounded-[100px] transition-colors duration-300",
          hovered ? "bg-bone-clay" : "bg-bone-forest",
        )}
      />
    </Tag>
  );
}
