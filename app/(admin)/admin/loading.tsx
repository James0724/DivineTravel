export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-36 bg-bone-bg rounded mb-1.5" />
        <div className="h-4 w-56 bg-bone-bg rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-4 space-y-3">
            <div className="w-9 h-9 rounded bg-bone-bg" />
            <div>
              <div className="h-7 w-12 bg-bone-bg rounded mb-1" />
              <div className="h-3 w-20 bg-bone-bg rounded mb-1" />
              <div className="h-3 w-16 bg-bone-bg rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 bg-bone-bg rounded" />
          <div className="h-3 w-16 bg-bone-bg rounded" />
        </div>
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
          {/* thead */}
          <div className="flex gap-6 px-4 py-3 border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
            {[80, 120, 140, 80, 60, 70].map((w, i) => (
              <div key={i} className="h-3 bg-bone-bg rounded" style={{ width: w }} />
            ))}
          </div>
          {/* rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-6 px-4 py-3.5 border-b border-[rgba(23,22,18,0.07)] last:border-0">
              {[80, 110, 140, 70, 55, 64].map((w, j) => (
                <div key={j} className="h-4 bg-bone-bg rounded" style={{ width: w }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="h-5 w-28 bg-bone-bg rounded mb-4" />
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-bone-bg rounded" />
          <div className="h-10 w-36 bg-bone-bg rounded" />
        </div>
      </div>
    </div>
  )
}
