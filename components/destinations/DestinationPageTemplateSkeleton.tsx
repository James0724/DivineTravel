import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";

function Header() {
  return (
    <div className="section-hd mb-10">
      <div>
        <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
        <div className="h-12 sm:h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
        <div className="h-3.5 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
      </div>
    </div>
  );
}

/** Mirrors components/destinations/DestinationPageTemplate.tsx, shared by all four country destination pages. */
export default function DestinationPageTemplateSkeleton() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Why [country] — text block */}
      <section className="container-site" style={{ padding: "48px 0" }}>
        <div className="h-3 w-40 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
        <div className="h-14 w-2/3 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
        <div className="space-y-2 mb-7">
          <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
          <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 pb-2" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="h-7 w-7 rounded-full flex-shrink-0" style={{ background: "var(--bg-deep)" }} />
              <div className="h-3.5 w-3/5 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* Feature parks carousel */}
      <section className="bg-bone-bg" style={{ padding: "80px 0" }}>
        <div className="container-site">
          <Header />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shrink-0" style={{ width: "380px" }}>
                <div style={{ aspectRatio: "4/3", background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More parks grid */}
      <section className="bg-bone-paper" style={{ padding: "80px 0" }}>
        <div className="container-site">
          <Header />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
                <div style={{ aspectRatio: "4/3", background: "var(--bg-deep)" }} />
                <div className="p-5 space-y-2">
                  <div className="h-5 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to choose */}
      <section className="bg-bone-bg" style={{ padding: "76px 0" }}>
        <div className="container-site">
          <Header />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "1px", background: "var(--line)", border: "1px solid var(--line)" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ padding: "30px 26px", background: "var(--bg)" }}>
                <div className="h-2.5 w-16 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                <div className="h-6 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best time — dark band */}
      <section style={{ padding: "80px 0", background: "var(--forest, #2a3a2a)" }}>
        <div className="container-site">
          <div className="section-hd mb-10">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "rgba(244,239,226,0.18)" }} />
              <div className="h-12 sm:h-14 w-3/4 rounded" style={{ background: "rgba(244,239,226,0.22)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "rgba(244,239,226,0.14)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-10" style={{ border: "1px solid rgba(244,239,226,0.15)" }}>
                <div className="h-2.5 w-32 rounded mb-4" style={{ background: "rgba(244,239,226,0.18)" }} />
                <div className="h-8 w-2/3 rounded mb-5" style={{ background: "rgba(244,239,226,0.22)" }} />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3.5 rounded" style={{ background: "rgba(244,239,226,0.14)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-bone-bg" style={{ padding: "80px 0" }}>
        <div className="container-site">
          <Header />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
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

      {/* FAQ */}
      <section className="bg-bone-paper" style={{ padding: "80px 0" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16">
            <div>
              <div className="h-3 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-5 border-b" style={{ borderColor: "var(--line)" }}>
                  <div className="h-4 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
