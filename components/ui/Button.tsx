'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'clay'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variants = {
  primary:
    'bg-bone-forest text-bone-paper border border-bone-forest hover:bg-bone-forest/90 active:scale-[0.98]',
  secondary:
    'bg-bone-paper text-bone-ink border border-[rgba(23,22,18,0.2)] hover:bg-bone-bg active:scale-[0.98]',
  outline:
    'bg-transparent text-bone-ink border border-[rgba(23,22,18,0.35)] hover:bg-bone-bg active:scale-[0.98]',
  ghost:
    'bg-transparent text-bone-ink border border-transparent hover:bg-bone-bg hover:border-[rgba(23,22,18,0.15)]',
  danger:
    'bg-red-700 text-white border border-red-700 hover:bg-red-800 active:scale-[0.98]',
  clay:
    'bg-bone-clay text-bone-paper border border-bone-clay hover:bg-bone-clay/90 active:scale-[0.98]',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded',
  md: 'h-10 px-4 text-sm gap-2 rounded',
  lg: 'h-12 px-6 text-base gap-2 rounded-md',
  xl: 'h-14 px-8 text-base gap-2.5 rounded-md',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-sans font-medium',
          'transition-all duration-150 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-bone-clay focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
