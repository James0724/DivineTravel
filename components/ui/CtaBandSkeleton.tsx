interface CtaBandSkeletonProps {
  /** Matches CtaBand's `variant` prop */
  variant?: "default" | "large";
}

/** Mirrors components/ui/CtaBand.tsx so the loading state doesn't jump on hydration. */
export default function CtaBandSkeleton({ variant = "default" }: CtaBandSkeletonProps) {
  const barColor = "rgba(244,239,226,0.16)";
  const barColorDim = "rgba(244,239,226,0.1)";

  if (variant === "large") {
    return (
      <section className="py-8 sm:py-10 animate-pulse" style={{ background: "var(--forest, #2a3a2a)" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center">
            <div>
              <div className="h-14 sm:h-20 rounded mb-3" style={{ background: barColor, maxWidth: "480px" }} />
              <div className="h-14 sm:h-20 rounded" style={{ background: barColor, maxWidth: "320px" }} />
            </div>
            <div>
              <div className="h-3 rounded mb-2" style={{ background: barColorDim }} />
              <div className="h-3 w-4/5 rounded mb-6" style={{ background: barColorDim }} />
              <div className="h-11 w-44 rounded-full" style={{ background: barColor }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 animate-pulse" style={{ background: "var(--forest, #2a3a2a)" }}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="h-12 sm:h-16 rounded" style={{ background: barColor, maxWidth: "440px" }} />
          <div>
            <div className="h-3 rounded mb-2" style={{ background: barColorDim }} />
            <div className="h-3 w-3/4 rounded mb-7" style={{ background: barColorDim }} />
            <div className="h-11 w-40 rounded-full" style={{ background: barColor }} />
          </div>
        </div>
      </div>
    </section>
  );
}
