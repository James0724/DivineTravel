import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, padding = 'md', className, children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    return (
      <div
        ref={ref}
        className={cn(
          'bg-bone-paper border border-[rgba(23,22,18,0.14)] rounded-md',
          hover &&
            'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// ─── CardHeader ──────────────────────────────────────────────────────────────

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divided?: boolean
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ divided = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between gap-4',
        divided && 'pb-4 mb-4 border-b border-[rgba(23,22,18,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

// ─── CardTitle ────────────────────────────────────────────────────────────────

const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-serif text-xl font-semibold text-bone-ink leading-snug',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

// ─── CardDescription ─────────────────────────────────────────────────────────

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-bone-ink/60 leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
))
CardDescription.displayName = 'CardDescription'

// ─── CardFooter ───────────────────────────────────────────────────────────────

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 pt-4 mt-4 border-t border-[rgba(23,22,18,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardFooter }
