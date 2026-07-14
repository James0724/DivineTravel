import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Country cards — 2x2 */}
      <section className="py-20 sm:py-28 bg-bone-paper">
        <div className="container-site">
          <div className="mb-14">
            <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="h-12 sm:h-14 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col border" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <div style={{ aspectRatio: "16/9", background: "var(--bg-deep)" }} />
                <div className="p-6 lg:p-7">
                  <div className="h-4 w-1/2 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                  <div className="space-y-2 mb-5">
                    <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                    <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                  </div>
                  <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-5 w-16 rounded-full" style={{ background: "var(--bg-deep)" }} />
                    ))}
                  </div>
                  <div className="pt-5 border-t flex items-end justify-between" style={{ borderColor: "var(--line)" }}>
                    <div className="flex gap-6">
                      <div className="h-6 w-10 rounded" style={{ background: "var(--bg-deep)" }} />
                      <div className="h-6 w-10 rounded" style={{ background: "var(--bg-deep)" }} />
                    </div>
                    <div className="h-7 w-7 rounded-full" style={{ background: "var(--bg-deep)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare strip — 4 col */}
      <section className="py-14 sm:py-16 bg-bone-bg border-y" style={{ borderColor: "var(--line)" }}>
        <div className="container-site">
          <div className="text-center mb-10">
            <div className="h-3 w-32 rounded mx-auto mb-3" style={{ background: "var(--bg-deep)" }} />
            <div className="h-9 w-1/2 rounded mx-auto" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1px", background: "var(--line)", border: "1px solid var(--line)" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-7" style={{ background: "var(--paper)" }}>
                <div className="h-2.5 w-20 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                <div className="h-6 w-2/3 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
                <div className="space-y-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-3 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular safaris */}
      <section className="py-20 sm:py-28 bg-bone-paper">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-11 w-64 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="mb-4" style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="h-3 w-1/3 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                <div className="h-6 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                <div className="h-4 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
