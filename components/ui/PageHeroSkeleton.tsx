interface PageHeroSkeletonProps {
  /** Match the `minHeight` passed to the real PageHero for this route */
  minHeight?: string;
  /** Number of stat blocks shown at the end of the hero (0 to omit) */
  stats?: number;
}

/** Mirrors components/ui/PageHero.tsx so the loading state doesn't jump on hydration. */
export default function PageHeroSkeleton({
  minHeight = "min-h-[52vh]",
  stats = 3,
}: PageHeroSkeletonProps) {
  return (
    <section
      className={`relative ${minHeight} flex items-end overflow-hidden animate-pulse`}
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="relative container-site pb-16 pt-32 sm:pb-20 sm:pt-48 w-full">
        <div className="h-3 w-48 rounded mb-5" style={{ background: "rgba(244,239,226,0.18)" }} />
        <div className="h-3 w-28 rounded mb-5" style={{ background: "rgba(244,239,226,0.18)" }} />
        <div
          className="h-16 sm:h-20 rounded mb-3"
          style={{ background: "rgba(244,239,226,0.22)", maxWidth: "620px" }}
        />
        <div
          className="h-16 sm:h-20 rounded mb-8"
          style={{ background: "rgba(244,239,226,0.22)", maxWidth: "420px" }}
        />
        {stats > 0 && (
          <div className="hidden md:flex items-end justify-end gap-6 lg:gap-9 flex-wrap">
            {Array.from({ length: stats }).map((_, i) => (
              <div key={i}>
                <div className="h-6 w-14 rounded mb-2" style={{ background: "rgba(244,239,226,0.18)" }} />
                <div className="h-2.5 w-20 rounded" style={{ background: "rgba(244,239,226,0.14)" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
