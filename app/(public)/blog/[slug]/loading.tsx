export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div style={{ minHeight: '55vh', background: 'var(--bg-deep)' }} />

      {/* Article body */}
      <article style={{ padding: '80px 0 120px', background: 'var(--paper)' }}>
        <div className="container-site" style={{ maxWidth: '760px' }}>
          {/* Category + meta */}
          <div className="flex gap-4 mb-6">
            <div className="h-3 w-24 rounded" style={{ background: 'var(--bg-deep)' }} />
            <div className="h-3 w-24 rounded" style={{ background: 'var(--bg-deep)' }} />
          </div>

          {/* Title */}
          <div className="h-14 rounded mb-3" style={{ background: 'var(--bg-deep)' }} />
          <div className="h-10 w-4/5 rounded mb-10" style={{ background: 'var(--bg-deep)' }} />

          {/* Excerpt / lead */}
          <div className="space-y-3 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-5 rounded" style={{ background: 'var(--bg-deep)', width: i === 2 ? '65%' : '100%' }} />
            ))}
          </div>

          {/* Cover image */}
          <div className="mb-10" style={{ aspectRatio: '16/9', background: 'var(--bg-deep)' }} />

          {/* Body paragraphs */}
          {Array.from({ length: 3 }).map((_, block) => (
            <div key={block} className="space-y-2 mb-8">
              {Array.from({ length: 4 + (block % 2) }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded"
                  style={{ background: 'var(--bg-deep)', width: i === 3 ? '70%' : '100%' }}
                />
              ))}
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
