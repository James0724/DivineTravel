export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div style={{ minHeight: '65vh', background: 'var(--bg-deep)' }}>
        <div className="container-site" style={{ paddingTop: '60px' }}>
          <div className="h-3 w-48 rounded mb-5" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <div className="h-16 w-2/3 rounded mb-4" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <div className="h-4 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>

      {/* Quick-stats bar */}
      <div style={{ padding: '20px 0', background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-site flex gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-16 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-5 w-24 rounded" style={{ background: 'var(--bg-deep)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <section style={{ padding: '80px 0', background: 'var(--paper)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
            {/* Left — overview + itinerary */}
            <div className="space-y-4">
              <div className="h-8 w-1/3 rounded" style={{ background: 'var(--bg-deep)' }} />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded" style={{ background: 'var(--bg-deep)', width: i % 3 === 2 ? '75%' : '100%' }} />
              ))}

              <div className="mt-10 h-6 w-40 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="space-y-3 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded" style={{ background: 'var(--bg-deep)' }} />
                ))}
              </div>
            </div>

            {/* Right — booking card */}
            <div>
              <div className="h-96 rounded" style={{ background: 'var(--bg-deep)' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
