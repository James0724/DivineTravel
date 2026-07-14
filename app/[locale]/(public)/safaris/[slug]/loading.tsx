export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <section
        className="relative h-[42vh] sm:h-[48vh] md:h-[52vh] min-h-[340px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[540px] overflow-hidden"
        style={{ background: "var(--bg-deep)" }}
      >
        <div className="absolute bottom-7 md:bottom-14 left-0 right-0 max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-12 items-end">
            <div>
              <div className="h-2.5 w-64 rounded mb-3" style={{ background: "rgba(244,239,226,0.2)" }} />
              <div className="h-10 sm:h-14 rounded mb-2" style={{ background: "rgba(244,239,226,0.24)", maxWidth: "480px" }} />
              <div className="hidden sm:block h-3.5 rounded mt-4" style={{ background: "rgba(244,239,226,0.16)", maxWidth: "440px" }} />
            </div>
            <div className="hidden md:block p-6" style={{ background: "rgba(244,237,224,0.95)", minWidth: "200px" }}>
              <div className="h-2.5 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="h-3.5 w-16 rounded" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-4 w-14 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              ))}
              <div className="h-9 w-full rounded mt-3.5" style={{ background: "var(--bg-deep)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile price strip */}
      <div className="md:hidden px-5 py-6" style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div className="h-2.5 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
        <div className="h-9 w-full rounded" style={{ background: "var(--bg-deep)" }} />
      </div>

      {/* Body — itinerary + sidebar */}
      <section className="py-16 sm:py-20 lg:py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-start">
            {/* Left — itinerary */}
            <div>
              <div className="mb-12 sm:mb-14">
                <div className="h-2.5 w-28 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
                <div className="h-12 w-2/3 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="py-9 grid grid-cols-1 xs:grid-cols-[56px_1fr] md:grid-cols-[120px_1fr] gap-2 xs:gap-[18px] md:gap-9"
                  style={{ borderTop: "1px solid var(--line)" }}
                >
                  <div className="h-10 w-10 rounded" style={{ background: "var(--bg-deep)" }} />
                  <div>
                    <div className="h-6 w-2/3 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                    <div className="space-y-2">
                      <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                      <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — sidebar */}
            <aside>
              {Array.from({ length: 3 }).map((_, box) => (
                <div key={box} className="p-7 mb-4" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
                  <div className="h-2.5 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-2.5" style={{ borderBottom: i < 3 ? "1px solid var(--line)" : "none" }}>
                      <div className="h-3.5 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
                      <div className="h-3.5 w-16 rounded" style={{ background: "var(--bg-deep)" }} />
                    </div>
                  ))}
                </div>
              ))}
              <div className="p-7" style={{ background: "var(--forest, #2a3a2a)" }}>
                <div className="h-2.5 w-24 rounded mb-4" style={{ background: "rgba(244,239,226,0.2)" }} />
                <div className="h-5 rounded mb-4" style={{ background: "rgba(244,239,226,0.24)" }} />
                <div className="h-10 w-full rounded" style={{ background: "rgba(244,239,226,0.2)" }} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
