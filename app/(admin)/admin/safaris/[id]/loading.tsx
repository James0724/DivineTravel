export default function Loading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-bone-bg rounded" />
        <div>
          <div className="h-7 w-32 bg-bone-bg rounded mb-1" />
          <div className="h-3.5 w-48 bg-bone-bg rounded" />
        </div>
      </div>

      {/* Form sections */}
      {[
        { fields: 3, hasTextarea: true },
        { fields: 4, hasTextarea: false },
        { fields: 2, hasTextarea: false },
        { fields: 6, hasTextarea: false },
        { fields: 2, hasTextarea: true },
      ].map((s, i) => (
        <div key={i} className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(23,22,18,0.07)]">
            <div className="w-7 h-7 rounded bg-bone-bg" />
            <div className="h-4 w-36 bg-bone-bg rounded" />
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className={`grid gap-4 ${s.fields > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {Array.from({ length: s.fields }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-3.5 w-24 bg-bone-bg rounded" />
                  <div className="h-10 bg-bone-bg rounded" />
                </div>
              ))}
            </div>
            {s.hasTextarea && (
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 bg-bone-bg rounded" />
                <div className="h-28 bg-bone-bg rounded" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Submit */}
      <div className="flex justify-end">
        <div className="h-10 w-36 bg-bone-bg rounded" />
      </div>
    </div>
  )
}
