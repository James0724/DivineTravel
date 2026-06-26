export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div style={{ minHeight: '60vh', background: 'var(--bg-deep)' }} />

      {/* Featured post */}
      <section style={{ padding: '48px 0 96px', background: 'var(--bg)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-16 items-center">
            <div style={{ aspectRatio: '5/4', background: 'var(--bg-deep)' }} />
            <div className="flex flex-col gap-4">
              <div className="h-3 w-32 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-14 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-10 w-3/4 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-4 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-4 w-4/5 rounded" style={{ background: 'var(--bg-deep)' }} />
              <div className="h-10 w-36 rounded-full mt-4" style={{ background: 'var(--bg-deep)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <div
        style={{
          padding: '22px 0',
          background: 'var(--paper)',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="container-site flex gap-2 flex-wrap">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full" style={{ background: 'var(--bg-deep)' }} />
          ))}
        </div>
      </div>

      {/* Posts grid */}
      <section style={{ padding: '96px 0 120px', background: 'var(--bg)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '56px 36px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div style={{ aspectRatio: '3/2', background: 'var(--bg-deep)' }} />
                <div className="h-3 w-1/3 rounded" style={{ background: 'var(--bg-deep)' }} />
                <div className="h-8 rounded" style={{ background: 'var(--bg-deep)' }} />
                <div className="h-4 rounded" style={{ background: 'var(--bg-deep)' }} />
                <div className="h-4 w-3/4 rounded" style={{ background: 'var(--bg-deep)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
