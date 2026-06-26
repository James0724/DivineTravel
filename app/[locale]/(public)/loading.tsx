export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero placeholder */}
      <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }} />

      {/* Trust strip placeholder */}
      <div style={{ padding: '24px 0', background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-site flex gap-6 justify-center flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-28 rounded" style={{ background: 'var(--bg-deep)' }} />
          ))}
        </div>
      </div>

      {/* Section stub — packages */}
      <section style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div className="container-site">
          <div className="h-3 w-40 rounded mb-4" style={{ background: 'var(--bg-deep)' }} />
          <div className="h-12 w-1/2 rounded mb-10" style={{ background: 'var(--bg-deep)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="mb-4" style={{ aspectRatio: '4/3', background: 'var(--bg-deep)' }} />
                <div className="h-3 w-1/3 rounded mb-2" style={{ background: 'var(--bg-soft)' }} />
                <div className="h-6 rounded mb-2" style={{ background: 'var(--bg-soft)' }} />
                <div className="h-4 w-2/3 rounded" style={{ background: 'var(--bg-soft)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
