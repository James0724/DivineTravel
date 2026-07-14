import TitleHeroSkeleton from "@/components/ui/TitleHeroSkeleton";
import CtaBandSkeleton from "@/components/ui/CtaBandSkeleton";
import FilteredGridSkeleton from "@/components/ui/FilteredGridSkeleton";

export default function Loading() {
  return (
    <div>
      <TitleHeroSkeleton />
      <CtaBandSkeleton variant="large" />
      <section style={{ padding: "80px 0 140px", background: "var(--bg)" }}>
        <div className="container-site">
          <FilteredGridSkeleton cards={12} aspectRatio="4/3.4" cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>
    </div>
  );
}
