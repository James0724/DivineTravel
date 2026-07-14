/** Mirrors components/ui/SectionFaq.tsx */
export default function SectionFaqSkeleton() {
  return (
    <section className="animate-pulse" style={{ padding: "140px 0", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
          <div>
            <div className="h-3 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="h-14 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-6 border-b" style={{ borderColor: "var(--line)" }}>
                <div className="h-5 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
