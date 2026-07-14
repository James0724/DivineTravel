/** Mirrors components/ui/ChooseGrid.tsx */
export default function ChooseGridSkeleton({ bg = "var(--bg)" }: { bg?: string }) {
  return (
    <section className="animate-pulse" style={{ padding: "120px 0", background: bg }}>
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
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: "1px", background: "var(--line)", border: "1px solid var(--line)" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: "30px 26px", background: bg }}>
              <div className="h-2.5 w-16 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
              <div className="h-6 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
