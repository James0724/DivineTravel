import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";
import ChooseGridSkeleton from "@/components/ui/ChooseGridSkeleton";
import WhyGridSkeleton from "@/components/ui/WhyGridSkeleton";
import SectionFaqSkeleton from "@/components/ui/SectionFaqSkeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <TitleHeroSkeleton />

      {/* Packages */}
      <section style={{ padding: "clamp(48px, 6.5vw, 96px) 0", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <div className="section-hd mb-10">
            <div>
              <div className="h-3 w-32 rounded mb-4" style={{ background: "var(--bg-deep)" }} />
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
      </section>

      <ChooseGridSkeleton bg="var(--bg)" />
      <WhyGridSkeleton bg="var(--paper)" />
      <SectionFaqSkeleton />
    </div>
  );
}
