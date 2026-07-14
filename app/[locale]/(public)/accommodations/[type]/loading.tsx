import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";
import WhyGridSkeleton from "@/components/ui/WhyGridSkeleton";
import SectionFaqSkeleton from "@/components/ui/SectionFaqSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Intro + "good to know" panel */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd mb-14 pb-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-12 sm:h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="p-8" style={{ background: "rgba(31,29,24,0.04)", border: "1px dashed rgba(31,29,24,0.22)" }}>
            <div className="h-2.5 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyGridSkeleton bg="var(--paper)" />

      {/* Partner properties */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }}>
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
                <div className="mb-4" style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="h-5 w-2/3 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionFaqSkeleton />
    </div>
  );
}
