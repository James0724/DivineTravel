import PageHeroSkeleton from "@/components/ui/PageHeroSkeleton";
import CtaBandSkeleton from "@/components/ui/CtaBandSkeleton";
import FilteredGridSkeleton from "@/components/ui/FilteredGridSkeleton";

export default function Loading() {
  return (
    <div>
      <PageHeroSkeleton minHeight="min-h-[60vh]" stats={3} />
      <CtaBandSkeleton variant="large" />

      {/* Featured post */}
      <section className="bg-bone-bg pb-24 pt-2 animate-pulse">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-16 items-stretch">
            <div style={{ aspectRatio: "5/4", background: "var(--bg-deep)" }} />
            <div className="flex flex-col justify-center py-4">
              <div className="flex gap-3.5 mb-6">
                <div className="h-3 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
                <div className="h-3 w-20 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
              <div className="h-11 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
              <div className="h-11 w-4/5 rounded mb-6" style={{ background: "var(--bg-deep)" }} />
              <div className="space-y-2 mb-8">
                <div className="h-4 rounded" style={{ background: "var(--bg-deep)" }} />
                <div className="h-4 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="rounded-full" style={{ width: 42, height: 42, background: "var(--bg-deep)" }} />
                <div>
                  <div className="h-3 w-24 rounded mb-2" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-2.5 w-16 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              </div>
              <div className="h-11 w-40 rounded-full" style={{ background: "var(--bg-deep)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Posts section: sidebar filter + grid */}
      <section className="bg-bone-bg" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
        <div className="container-site">
          <FilteredGridSkeleton cards={9} aspectRatio="3/2" cols="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
        </div>
      </section>
    </div>
  );
}
