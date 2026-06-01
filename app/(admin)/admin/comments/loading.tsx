export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="h-7 w-32 bg-bone-bg rounded mb-1.5" />
          <div className="h-4 w-72 bg-bone-bg rounded" />
        </div>
      </div>

      {/* Filters: status tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1.5">
          {[64, 72, 80, 72, 56].map((w, i) => (
            <div key={i} className="h-8 bg-bone-bg rounded" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-48 bg-bone-bg rounded" />
          <div className="h-8 w-16 bg-bone-bg rounded" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
          {[110, 100, 200, 72, 80, 100].map((w, i) => (
            <div key={i} className="h-3 bg-bone-bg rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-4 border-b border-[rgba(23,22,18,0.07)] last:border-0">
            {/* Commenter */}
            <div className="space-y-1.5" style={{ width: 110 }}>
              <div className="h-3.5 bg-bone-bg rounded" />
              <div className="h-2.5 bg-bone-bg rounded w-4/5" />
            </div>
            {/* Post */}
            <div className="h-4 bg-bone-bg rounded" style={{ width: 100 }} />
            {/* Comment body */}
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-bone-bg rounded" />
              <div className="h-3.5 bg-bone-bg rounded w-3/4" />
            </div>
            {/* Status */}
            <div className="h-5 w-16 bg-bone-bg rounded-full" />
            {/* Date */}
            <div className="h-3.5 w-20 bg-bone-bg rounded" />
            {/* Actions */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-7 h-7 bg-bone-bg rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
