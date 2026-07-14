import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";
import WhyGridSkeleton from "@/components/ui/WhyGridSkeleton";
import SectionFaqSkeleton from "@/components/ui/SectionFaqSkeleton";
import CtaBandSkeleton from "@/components/ui/CtaBandSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Intro — what is it / best for */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 lg:gap-20">
          <div>
            <div className="h-3 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
            <div className="h-11 w-3/4 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
            <div className="space-y-2 mb-6">
              <div className="h-4 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-4 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <div className="h-2.5 w-16 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-8" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
            <div className="h-2.5 w-24 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-3" style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>

        <div className="container-site mt-10">
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

      {/* Matching packages */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }}>
        <div className="container-site">
          <div className="section-hd mb-10">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="h-14 w-2/3 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
            <div className="h-3.5 w-full rounded" style={{ background: "var(--bg-deep)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
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

      {/* Pairs well with */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
          <div className="h-11 w-2/3 rounded mb-12" style={{ background: "var(--bg-deep)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="p-5" style={{ background: "var(--bg)", border: "1px solid var(--line)", borderTop: "none" }}>
                  <div className="h-4 w-2/3 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-3.5 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionFaqSkeleton />
      <CtaBandSkeleton variant="large" />
    </div>
  );
}
