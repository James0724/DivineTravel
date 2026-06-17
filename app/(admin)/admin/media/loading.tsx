export default function MediaLoading() {
  return (
    <div className="p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-bone-paper rounded animate-pulse" />
          <div className="h-4 w-56 bg-bone-paper rounded animate-pulse" />
        </div>
        <div className="h-10 w-44 bg-bone-paper rounded animate-pulse" />
      </div>
      <div className="h-9 w-64 bg-bone-paper rounded animate-pulse" />
      <div className="flex gap-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-7 w-16 bg-bone-paper rounded animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="bg-bone-paper border border-[rgba(23,22,18,0.08)] rounded-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-bone-bg" />
            <div className="p-2.5 space-y-1.5">
              <div className="h-3 bg-bone-bg rounded w-3/4" />
              <div className="h-2.5 bg-bone-bg rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
