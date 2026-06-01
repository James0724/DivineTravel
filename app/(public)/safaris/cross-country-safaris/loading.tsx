export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="relative" style={{ minHeight: '520px', background: 'var(--bg-deep)' }}>
        <div className="container-site" style={{ paddingTop: '60px' }}>
          <div className="h-3 w-48 rounded mb-6" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <div className="h-16 w-2/3 rounded mb-4" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <div className="h-4 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>

      {/* Packages section */}
      <section style={{ padding: '96px 0', background: 'var(--paper)' }}>
        <div className="container-site">
          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
            {/* Jump nav sidebar */}
            <div className="hidden lg:block flex-shrink-0" style={{ width: '156px' }}>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded"
                    style={{ background: 'var(--bg-deep)', width: `${55 + i * 7}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div className="flex-1 min-w-0">
              <div className="h-3 w-64 rounded mb-3" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-12 w-1/2 rounded mb-10" style={{ background: 'var(--bg-deep)' }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="mb-4" style={{ aspectRatio: '4/3', background: 'var(--bg-deep)' }} />
                    <div className="h-3 w-1/3 rounded mb-2" style={{ background: 'var(--bg-deep)' }} />
                    <div className="h-6 rounded mb-2" style={{ background: 'var(--bg-deep)' }} />
                    <div className="h-4 w-3/4 rounded mb-2" style={{ background: 'var(--bg-deep)' }} />
                    <div className="h-3 w-1/2 rounded" style={{ background: 'var(--bg-deep)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
