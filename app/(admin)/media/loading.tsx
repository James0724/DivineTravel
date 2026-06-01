export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-32 bg-bone-bg rounded mb-1.5" />
        <div className="h-4 w-52 bg-bone-bg rounded" />
      </div>

      {/* Upload + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-44 bg-bone-bg rounded" />
        <div className="h-10 w-36 bg-bone-bg rounded" />
        <div className="h-10 w-56 bg-bone-bg rounded" />
      </div>

      {/* Media grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-bone-bg rounded-md" />
            <div className="mt-1.5 h-3 bg-bone-bg rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center">
        <div className="h-9 w-32 bg-bone-bg rounded" />
      </div>
    </div>
  )
}
