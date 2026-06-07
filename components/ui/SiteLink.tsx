"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type SiteLinkVariant =
  | "solid"           // bone-forest bg + paper text — light-bg contexts
  | "paper"           // cream bg + dark text + clay arrow — dark-bg contexts
  | "outline"         // transparent + dark border — light-bg contexts
  | "outline-light"   // transparent + light border — dark-bg contexts
  | "ghost"           // text-only, serif-weight — inline/subtle
  | "ghost-mono"      // mono uppercase — small caps CTAs

export type SiteLinkSize = "sm" | "md" | "lg"

interface SiteLinkProps {
  href: string
  variant?: SiteLinkVariant
  size?: SiteLinkSize
  /** Circle-arrow badge. Defaults true for solid/paper, false for others. */
  arrow?: boolean
  external?: boolean
  className?: string
  children: React.ReactNode
}

const MotionLink = motion(Link)

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

/* Whole-button lift */
const liftVariants = {
  rest:  { y: 0 },
  hover: { y: -2 },
}

/* Shimmer sweep — diagonal light stripe left-to-right */
const shimmerVariants = {
  rest:  { x: "-130%", opacity: 0 },
  hover: { x: "230%",  opacity: 1 },
}

const variantBase: Record<SiteLinkVariant, string> = {
  solid:
    "bg-bone-forest text-bone-paper rounded-full font-sans tracking-[0.01em] hover:bg-bone-clay transition-colors relative overflow-hidden",
  paper:
    "bg-[#f4efe2] text-bone-ink rounded-full font-sans tracking-[0.01em] transition-colors relative overflow-hidden",
  outline:
    "bg-transparent border border-bone-ink/25 text-bone-ink rounded-full font-sans tracking-[0.01em] hover:bg-bone-ink/5 transition-colors",
  "outline-light":
    "bg-transparent text-white rounded-full font-sans tracking-[0.01em] hover:bg-white/10 transition-colors",
  ghost:
    "text-bone-forest hover:text-bone-clay font-sans transition-colors",
  "ghost-mono":
    "text-bone-forest hover:text-bone-clay font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
}

const sizeClasses: Record<SiteLinkSize, string> = {
  sm: "px-3.5 py-1.5 text-[12px] gap-2",
  md: "px-4 py-2 text-[13px] gap-2.5",
  lg: "px-5 py-[10px] text-[14px] gap-3",
}

/*
 * Circle badge config per variant.
 * bg         — matches the surrounding parent background ("punch-through" look)
 * colorRest  — arrow color at rest = same as button background color
 * colorHover — arrow color as it slides in on hover = warm accent
 */
const badgeConfig: Partial<Record<SiteLinkVariant, { bg: string; colorRest: string; colorHover: string }>> = {
  solid: { bg: "#f4efe2", colorRest: "#1a2e1a", colorHover: "#9d4519" },
  paper: { bg: "#1a2e1a", colorRest: "#f4efe2", colorHover: "#f4d4a8" },
}

const DEFAULT_ARROW_ON: Set<SiteLinkVariant> = new Set(["solid", "paper"])
const SHIMMER_ON: Set<SiteLinkVariant> = new Set(["solid", "paper"])

export default function SiteLink({
  href,
  variant = "solid",
  size = "md",
  arrow,
  external,
  className,
  children,
}: SiteLinkProps) {
  const isInline = variant === "ghost" || variant === "ghost-mono"
  const showArrow = arrow ?? DEFAULT_ARROW_ON.has(variant)
  const showShimmer = SHIMMER_ON.has(variant)
  const badge = badgeConfig[variant]
  const circleSize =
    size === "lg" ? "w-[26px] h-[26px] text-[13px]" : "w-[24px] h-[24px] text-[12px]"

  return (
    <MotionLink
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      initial="rest"
      whileHover="hover"
      variants={isInline ? undefined : liftVariants}
      transition={{ duration: 0.2, ease: EASE }}
      className={cn(
        "inline-flex items-center",
        !isInline && sizeClasses[size],
        variantBase[variant],
        variant === "outline-light" && "border",
        isInline && "gap-1.5",
        className,
      )}
      style={
        variant === "outline-light"
          ? { borderColor: "rgba(244,239,226,0.4)" }
          : undefined
      }
    >
      {/* Shimmer sweep — diagonal light stripe on hover */}
      {showShimmer && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          variants={shimmerVariants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)",
            skewX: "-20deg",
          }}
        />
      )}

      {children}

      {showArrow && (
        <span
          className={cn(
            "flex-shrink-0",
            !isInline && cn(
              "relative overflow-hidden",
              "rounded-full flex items-center justify-center",
              circleSize,
            ),
          )}
          style={badge ? { background: badge.bg } : undefined}
        >
          {isInline ? (
            /* Inline variants nudge the arrow forward */
            <motion.span
              variants={{ rest: { x: 0 }, hover: { x: 4 } }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              →
            </motion.span>
          ) : (
            <>
              {/* Current arrow — exits to the right on hover */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                variants={{
                  rest:  { x: "0%",    color: badge?.colorRest  ?? "currentColor" },
                  hover: { x: "110%",  color: badge?.colorRest  ?? "currentColor" },
                }}
                transition={{ duration: 0.25, ease: EASE }}
                aria-hidden
              >
                →
              </motion.span>
              {/* Clone arrow — slides in from the left, lands with accent color */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                variants={{
                  rest:  { x: "-110%", color: badge?.colorRest  ?? "currentColor" },
                  hover: { x: "0%",    color: badge?.colorHover ?? "currentColor" },
                }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                →
              </motion.span>
            </>
          )}
        </span>
      )}
    </MotionLink>
  )
}
