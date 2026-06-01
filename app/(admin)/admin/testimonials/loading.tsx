export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-32 bg-bone-bg rounded mb-1.5" />
          <div className="h-4 w-44 bg-bone-bg rounded" />
        </div>
        <div className="h-10 w-40 bg-bone-bg rounded" />
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        <div className="flex gap-6 px-4 py-3 border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
          {[130, 90, 120, 70, 80, 80, 80].map((w, i) => (
            <div key={i} className="h-3 bg-bone-bg rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 py-3.5 border-b border-[rgba(23,22,18,0.07)] last:border-0">
            {/* Name + country */}
            <div className="space-y-1.5" style={{ width: 130 }}>
              <div className="h-3.5 bg-bone-bg rounded" />
              <div className="h-2.5 bg-bone-bg rounded w-2/3" />
            </div>
            {[88, 120, 68, 76, 72, 36].map((w, j) => (
              <div key={j} className="h-4 bg-bone-bg rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
