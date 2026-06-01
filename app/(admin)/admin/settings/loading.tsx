export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-24 bg-bone-bg rounded mb-1.5" />
          <div className="h-4 w-72 bg-bone-bg rounded" />
        </div>
        <div className="h-10 w-28 bg-bone-bg rounded" />
      </div>

      {/* Section cards */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(23,22,18,0.07)]">
            <div className="w-8 h-8 rounded bg-bone-bg flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-bone-bg rounded" />
              <div className="h-3 w-52 bg-bone-bg rounded" />
            </div>
          </div>
          {/* Section body */}
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: i === 2 ? 5 : 2 + (i % 2) }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-bone-bg rounded" />
                  <div className="h-10 bg-bone-bg rounded" />
                </div>
              ))}
            </div>
            {i === 0 && (
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-bone-bg rounded" />
                <div className="h-24 bg-bone-bg rounded" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <div className="h-11 w-40 bg-bone-bg rounded" />
      </div>
    </div>
  )
}
