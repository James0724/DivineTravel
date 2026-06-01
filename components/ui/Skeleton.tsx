import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: boolean
}

export function Skeleton({ className, rounded = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-bone-bg',
        'after:absolute after:inset-0',
        'after:bg-shimmer-gradient after:bg-[length:200%_100%]',
        'after:animate-shimmer',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      {...props}
    />
  )
}

// ─── Safari Card Skeleton ─────────────────────────────────────────────────────

export function SafariCardSkeleton() {
  return (
    <div className="bg-bone-paper border border-[rgba(23,22,18,0.14)] rounded-md overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}

// ─── Safari Grid Skeleton ─────────────────────────────────────────────────────

export function SafariGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SafariCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Hero Skeleton ────────────────────────────────────────────────────────────

export function HeroSkeleton() {
  return (
    <div className="relative h-screen bg-bone-forest/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-16 w-96 mx-auto" />
        <Skeleton className="h-16 w-80 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
        <div className="flex gap-3 justify-center pt-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  )
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-[rgba(23,22,18,0.08)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  )
}

// ─── Detail Page Skeleton ─────────────────────────────────────────────────────

export function SafariDetailSkeleton() {
  return (
    <div className="min-h-screen bg-bone-bg">
      <Skeleton className="h-[70vh] w-full rounded-none" />
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
