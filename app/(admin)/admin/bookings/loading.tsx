export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-28 bg-bone-bg rounded mb-1.5" />
        <div className="h-4 w-40 bg-bone-bg rounded" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-72 bg-bone-bg rounded" />
        <div className="h-10 w-44 bg-bone-bg rounded" />
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
          {[80, 140, 140, 90, 70, 80, 90, 80].map((w, i) => (
            <div key={i} className="h-3 bg-bone-bg rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-[rgba(23,22,18,0.07)] last:border-0">
            <div className="h-4 bg-bone-bg rounded font-mono" style={{ width: 80 }} />
            <div className="space-y-1.5" style={{ width: 140 }}>
              <div className="h-3.5 bg-bone-bg rounded" />
              <div className="h-2.5 bg-bone-bg rounded w-3/4" />
            </div>
            {[140, 88, 68, 78, 86, 78].map((w, j) => (
              <div key={j} className="h-4 bg-bone-bg rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
