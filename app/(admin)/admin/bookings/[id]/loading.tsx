export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-bone-bg rounded" />
          <div>
            <div className="h-7 w-48 bg-bone-bg rounded mb-1.5" />
            <div className="h-3.5 w-32 bg-bone-bg rounded" />
          </div>
        </div>
        <div className="h-10 w-32 bg-bone-bg rounded" />
      </div>

      {/* Status badges row */}
      <div className="flex gap-3">
        <div className="h-8 w-24 bg-bone-bg rounded-full" />
        <div className="h-8 w-20 bg-bone-bg rounded-full" />
      </div>

      {/* Info sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[rgba(23,22,18,0.07)]">
              <div className="w-4 h-4 bg-bone-bg rounded" />
              <div className="h-4 w-32 bg-bone-bg rounded" />
            </div>
            <div className="px-5 py-5 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-3 w-20 bg-bone-bg rounded" />
                  <div className="h-4 w-28 bg-bone-bg rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Internal notes */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[rgba(23,22,18,0.07)]">
          <div className="w-4 h-4 bg-bone-bg rounded" />
          <div className="h-4 w-32 bg-bone-bg rounded" />
        </div>
        <div className="px-5 py-5">
          <div className="h-24 bg-bone-bg rounded" />
        </div>
      </div>
    </div>
  )
}
