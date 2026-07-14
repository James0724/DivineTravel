interface FilteredGridSkeletonProps {
  cards?: number;
  /** Card image aspect ratio */
  aspectRatio?: string;
  cols?: string;
}

/** Mirrors the sidebar-filter + card-grid layout shared by the safaris and blog listing pages. */
export default function FilteredGridSkeleton({
  cards = 9,
  aspectRatio = "3/2",
  cols = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
}: FilteredGridSkeletonProps) {
  return (
    <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start animate-pulse">
      <div className="hidden lg:block flex-shrink-0 rounded-sm border" style={{ width: "364px", borderColor: "var(--line)" }}>
        <div className="p-5 space-y-6">
          <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
          <div className="space-y-2">
            <div className="h-2.5 w-16 rounded" style={{ background: "var(--bg-deep)" }} />
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-7 w-20 rounded-full" style={{ background: "var(--bg-deep)" }} />
              ))}
            </div>
          </div>
          <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
          <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="hidden lg:block mb-6">
          <div className="h-2.5 w-24 rounded" style={{ background: "var(--bg-deep)" }} />
        </div>
        <div className={`grid ${cols}`} style={{ gap: "56px 36px" }}>
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div style={{ aspectRatio, background: "var(--bg-deep)" }} />
              <div className="flex flex-col gap-3 pt-4">
                <div className="h-3 rounded w-1/3" style={{ background: "var(--bg-deep)" }} />
                <div className="h-6 rounded w-full" style={{ background: "var(--bg-deep)" }} />
                <div className="h-4 rounded w-3/4" style={{ background: "var(--bg-deep)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
