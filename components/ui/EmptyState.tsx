'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'outline'
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const defaultIcon = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-30"
  >
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M16 24h16M24 16v16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function EmptyState({
  icon = defaultIcon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes[size],
        className
      )}
    >
      <div className="mb-4 text-bone-ink/40">{icon}</div>
      <h3
        className={cn(
          'font-serif text-bone-ink mb-2',
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-bone-ink/55 max-w-sm leading-relaxed',
            size === 'sm' ? 'text-sm' : 'text-base'
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant ?? 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </motion.div>
  )
}

// ─── Safari-specific empty states ────────────────────────────────────────────

export function NoSafarisFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      title="No safaris found"
      description="Try adjusting your filters or search terms to discover more adventures."
      action={
        onReset
          ? { label: 'Clear filters', onClick: onReset, variant: 'outline' }
          : undefined
      }
    />
  )
}

export function NoBookingsFound() {
  return (
    <EmptyState
      title="No bookings yet"
      description="Booking inquiries from guests will appear here."
    />
  )
}

export function NoTestimonialsFound() {
  return (
    <EmptyState
      title="No testimonials yet"
      description="Guest reviews and testimonials will appear here."
    />
  )
}
