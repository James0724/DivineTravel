import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'forest' | 'clay' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

const variantStyles = {
  default:
    'bg-bone-bg text-bone-ink border-[rgba(23,22,18,0.2)]',
  forest:
    'bg-bone-forest/10 text-bone-forest border-bone-forest/25',
  clay:
    'bg-bone-clay/10 text-bone-clay border-bone-clay/25',
  success:
    'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning:
    'bg-amber-50 text-amber-800 border-amber-200',
  danger:
    'bg-red-50 text-red-700 border-red-200',
  neutral:
    'bg-stone-100 text-stone-700 border-stone-200',
}

const dotColors = {
  default: 'bg-bone-ink',
  forest: 'bg-bone-forest',
  clay: 'bg-bone-clay',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-stone-500',
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border rounded font-sans font-medium tracking-wide',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}
