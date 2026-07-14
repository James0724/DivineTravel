import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";
import SectionFaqSkeleton from "@/components/ui/SectionFaqSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Intro + "what's included" panel */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd mb-14 pb-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 sm:h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-3">
              <div className="h-4 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-4 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-4 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="p-8" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
              <div className="h-2.5 w-32 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3" style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                  <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd mb-10">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 sm:h-14 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="p-6" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderTop: "none" }}>
                  <div className="h-5 w-2/3 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                  <div className="space-y-1.5 mb-5">
                    <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                    <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
                  </div>
                  <div className="h-3 w-24 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionFaqSkeleton />
    </div>
  );
}
