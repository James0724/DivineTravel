/** Mirrors components/ui/WhyGrid.tsx */
export default function WhyGridSkeleton({ bg = "var(--paper)" }: { bg?: string }) {
  return (
    <section className="animate-pulse" style={{ padding: "120px 0", background: bg, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container-site">
        <header className="section-hd mb-10">
          <div>
            <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
            <div className="h-3.5 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "var(--line)", border: "1px solid var(--line)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-8" style={{ background: bg }}>
              <div className="h-8 w-8 rounded-full mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-4 w-2/3 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
              <div className="h-3 w-full rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
