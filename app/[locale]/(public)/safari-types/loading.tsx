import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";

function TypeGrid({ bg = "var(--bg)" }: { bg?: string }) {
  return (
    <section style={{ padding: "96px 0", background: bg }}>
      <div className="container-site">
        <div className="section-hd mb-10">
          <div>
            <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="h-12 sm:h-14 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
              <div className="p-5" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderTop: "none" }}>
                <div className="h-5 w-2/3 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Intro */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd mb-14 pb-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 sm:h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-14">
            <div className="space-y-3">
              <div className="h-4 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-4 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div style={{ aspectRatio: "4/3", background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-8" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                <div className="h-2.5 w-24 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                <div className="h-6 w-2/3 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TypeGrid bg="var(--bg)" />
      <TypeGrid bg="var(--paper)" />
      <TypeGrid bg="var(--bg)" />

      {/* Combine section */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd mb-10">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 w-1/2 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-7" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-6 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
                <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
