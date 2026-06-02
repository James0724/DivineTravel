'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type SiteLinkVariant =
  | 'solid'          // bone-forest bg + paper text — light-bg contexts
  | 'paper'          // cream bg + dark text + clay arrow — dark-bg contexts
  | 'outline'        // transparent + dark border — light-bg contexts
  | 'outline-light'  // transparent + light border — dark-bg contexts
  | 'ghost'          // text-only, serif-weight — inline/subtle
  | 'ghost-mono'     // mono uppercase — small caps CTAs

export type SiteLinkSize = 'sm' | 'md' | 'lg'

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

// Motion-wrapped Next.js Link
const MotionLink = motion(Link)

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

// Whole-button lift on hover
const liftVariants = {
  rest:  { y: 0 },
  hover: { y: -2 },
}

// Arrow nudges forward on hover
const arrowVariants = {
  rest:  { x: 0 },
  hover: { x: 4 },
}

const variantBase: Record<SiteLinkVariant, string> = {
  solid:
    'bg-bone-forest text-bone-paper rounded-full font-sans tracking-[0.01em] hover:bg-bone-clay transition-colors',
  paper:
    'bg-[#f4efe2] text-bone-ink rounded-full font-sans tracking-[0.01em] transition-colors',
  outline:
    'bg-transparent border border-bone-ink/25 text-bone-ink rounded-full font-sans tracking-[0.01em] hover:bg-bone-ink/5 transition-colors',
  'outline-light':
    'bg-transparent text-white rounded-full font-sans tracking-[0.01em] hover:bg-white/10 transition-colors',
  ghost:
    'text-bone-forest hover:text-bone-clay font-sans transition-colors',
  'ghost-mono':
    'text-bone-forest hover:text-bone-clay font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
}

const sizeClasses: Record<SiteLinkSize, string> = {
  sm: 'px-3.5 py-1.5 text-[12px] gap-2',
  md: 'px-4 py-2 text-[13px] gap-2.5',
  lg: 'px-5 py-[10px] text-[14px] gap-3',
}

// Arrow circle styling per variant
const arrowCircle: Partial<Record<SiteLinkVariant, string>> = {
  solid: 'bg-bone-paper/15 text-bone-paper',
  paper: 'bg-[#9d4519] text-white',
}

const DEFAULT_ARROW_ON: Set<SiteLinkVariant> = new Set(['solid', 'paper'])

export default function SiteLink({
  href,
  variant = 'solid',
  size = 'md',
  arrow,
  external,
  className,
  children,
}: SiteLinkProps) {
  const isInline = variant === 'ghost' || variant === 'ghost-mono'
  const showArrow = arrow ?? DEFAULT_ARROW_ON.has(variant)
  const circleStyle = arrowCircle[variant] ?? 'bg-bone-paper/15 text-bone-paper'
  const circleSize = size === 'lg' ? 'w-[26px] h-[26px] text-[13px]' : 'w-[24px] h-[24px] text-[12px]'

  return (
    <MotionLink
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      initial="rest"
      whileHover="hover"
      variants={isInline ? undefined : liftVariants}
      transition={{ duration: 0.2, ease: EASE }}
      className={cn(
        'inline-flex items-center',
        !isInline && sizeClasses[size],
        variantBase[variant],
        variant === 'outline-light' && 'border',
        isInline && 'gap-1.5',
        className
      )}
      style={
        variant === 'outline-light'
          ? { borderColor: 'rgba(244,239,226,0.4)' }
          : undefined
      }
    >
      {children}
      {showArrow && (
        <motion.span
          variants={arrowVariants}
          transition={{ duration: 0.2, ease: EASE }}
          className={cn(
            'flex-shrink-0',
            !isInline && cn(
              'rounded-full flex items-center justify-center',
              circleSize,
              circleStyle
            )
          )}
        >
          →
        </motion.span>
      )}
    </MotionLink>
  )
}
