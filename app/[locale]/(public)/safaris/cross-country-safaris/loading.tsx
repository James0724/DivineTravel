import PageHeroSkeleton from "@/components/ui/PageHeroSkeleton";
import ChooseGridSkeleton from "@/components/ui/ChooseGridSkeleton";
import WhyGridSkeleton from "@/components/ui/WhyGridSkeleton";
import SectionFaqSkeleton from "@/components/ui/SectionFaqSkeleton";
import CtaBandSkeleton from "@/components/ui/CtaBandSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <PageHeroSkeleton minHeight="min-h-[52vh]" stats={3} />

      {/* Packages grid — sidebar layout */}
      <section className="bg-bone-paper" style={{ padding: "96px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
            {/* Jump nav sidebar */}
            <div className="hidden lg:block flex-shrink-0" style={{ width: "220px" }}>
              <div className="h-5 w-24 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
              <div className="space-y-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-[11px] border-b" style={{ borderColor: "var(--line)" }}>
                    <div className="h-4 rounded" style={{ background: "var(--bg-deep)", width: `${55 + i * 8}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="section-hd mb-8">
                <div>
                  <div className="h-3 w-56 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-14 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
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
          </div>
        </div>
      </section>

      <ChooseGridSkeleton bg="var(--bg)" />
      <WhyGridSkeleton bg="var(--paper)" />
      <SectionFaqSkeleton />
      <CtaBandSkeleton variant="large" />
    </div>
  );
}
