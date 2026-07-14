import CtaBandSkeleton from "@/components/ui/CtaBandSkeleton";

export default function Loading() {
  return (
    <div>
      {/* Full-bleed article hero */}
      <section
        className="relative flex items-end overflow-hidden animate-pulse"
        style={{ minHeight: "54vh", background: "var(--bg-deep)" }}
      >
        <div
          className="relative"
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px) 72px", width: "100%" }}
        >
          <div className="h-2.5 w-32 rounded mb-8" style={{ background: "rgba(244,239,226,0.18)" }} />
          <div className="flex gap-3.5 mb-6">
            <div className="h-2.5 w-16 rounded" style={{ background: "rgba(244,239,226,0.18)" }} />
            <div className="h-2.5 w-16 rounded" style={{ background: "rgba(244,239,226,0.18)" }} />
            <div className="h-2.5 w-16 rounded" style={{ background: "rgba(244,239,226,0.18)" }} />
          </div>
          <div className="h-16 sm:h-20 rounded mb-2" style={{ background: "rgba(244,239,226,0.22)", maxWidth: "620px" }} />
          <div className="h-16 sm:h-20 rounded" style={{ background: "rgba(244,239,226,0.22)", maxWidth: "420px" }} />
          <div className="flex items-center gap-3 mt-8">
            <div className="rounded-full" style={{ width: 46, height: 46, background: "rgba(244,239,226,0.18)" }} />
            <div>
              <div className="h-3 w-28 rounded mb-2" style={{ background: "rgba(244,239,226,0.18)" }} />
              <div className="h-2.5 w-20 rounded" style={{ background: "rgba(244,239,226,0.14)" }} />
            </div>
          </div>
        </div>
      </section>

      <CtaBandSkeleton variant="large" />

      {/* Article body */}
      <article className="animate-pulse" style={{ background: "var(--bg)", padding: "88px 0 100px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
          {/* Lead paragraph */}
          <div className="space-y-3 mb-8">
            <div className="h-5 rounded" style={{ background: "var(--bg-deep)" }} />
            <div className="h-5 rounded" style={{ background: "var(--bg-deep)" }} />
            <div className="h-5 w-3/4 rounded" style={{ background: "var(--bg-deep)" }} />
          </div>

          {Array.from({ length: 3 }).map((_, block) => (
            <div key={block} className="mb-10">
              <div className="h-8 w-1/2 rounded mb-5" style={{ background: "var(--bg-deep)" }} />
              <div className="space-y-2">
                {Array.from({ length: 4 + (block % 2) }).map((_, i, arr) => (
                  <div
                    key={i}
                    className="h-4 rounded"
                    style={{ background: "var(--bg-deep)", width: i === arr.length - 1 ? "70%" : "100%" }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Tags */}
          <div
            className="flex flex-wrap gap-2"
            style={{ marginTop: "48px", paddingTop: "36px", borderTop: "1px solid var(--line)" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 w-16 rounded-full" style={{ background: "var(--bg-deep)" }} />
            ))}
          </div>

          {/* Author card */}
          <div
            className="grid items-center"
            style={{
              maxWidth: "720px",
              margin: "56px auto 0",
              padding: "32px",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              gridTemplateColumns: "auto 1fr",
              gap: "24px",
            }}
          >
            <div className="rounded-full" style={{ width: 76, height: 76, background: "var(--bg-deep)" }} />
            <div>
              <div className="h-2.5 w-24 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
              <div className="h-5 w-40 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
              <div className="h-3.5 rounded mb-1.5" style={{ background: "var(--bg-deep)" }} />
              <div className="h-3.5 w-4/5 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      <section className="bg-bone-paper animate-pulse" style={{ borderTop: "1px solid rgba(31,29,24,0.14)", padding: "96px 0" }}>
        <div className="container-site">
          <div className="h-10 w-64 rounded mb-12" style={{ background: "var(--bg-deep)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "36px" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="h-3 w-1/3 rounded" style={{ background: "var(--bg-deep)" }} />
                <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
