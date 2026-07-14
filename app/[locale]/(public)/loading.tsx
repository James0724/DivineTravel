function Bar({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`rounded ${className}`} style={{ background: "var(--bg-deep)", ...style }} />;
}

function SectionHeader({ withLink = false }: { withLink?: boolean }) {
  return (
    <header className="section-hd mb-10">
      <div>
        <Bar className="h-3 w-32 mb-4" />
        <Bar className="h-11 sm:h-14 w-3/4" />
      </div>
      <div className="flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <Bar className="h-3.5 w-full" />
          <Bar className="h-3.5 w-2/3" />
        </div>
        {withLink && <Bar className="h-3 w-32" />}
      </div>
    </header>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* 01 · Hero — full-bleed slideshow */}
      <div
        className="relative h-[calc(90svh_-_var(--navbar-h,90px))] sm:h-[calc(92svh_-_var(--navbar-h,90px))]"
        style={{ background: "var(--bg-deep)" }}
      />

      {/* 02 · Trust strip — logo marquee */}
      <div style={{ padding: "24px 0", background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site flex gap-8 justify-center flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bar key={i} className="h-8 w-24" />
          ))}
        </div>
      </div>

      {/* 03 · Intro — two-column: eyebrow/heading/contacts | copy/quote */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-24 items-start">
            <div>
              <Bar className="h-3 w-28 mb-4" />
              <Bar className="h-14 w-full mb-2" />
              <Bar className="h-14 w-3/4 mb-8" />
              <div className="grid sm:grid-cols-1 2xl:grid-cols-2 gap-4 mt-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-4 border" style={{ borderColor: "var(--line)" }}>
                    <Bar className="h-2.5 w-20 mb-2" />
                    <Bar className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="space-y-3 mb-6">
                <Bar className="h-4 w-full" />
                <Bar className="h-4 w-full" />
                <Bar className="h-4 w-3/4" />
              </div>
              <div className="space-y-2 mb-8">
                <Bar className="h-3.5 w-5/6" />
                <Bar className="h-3.5 w-4/6" />
              </div>
              <Bar className="h-24 w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Signature packages — featured grid */}
      <section style={{ padding: "80px 0 96px", background: "var(--bg)" }}>
        <div className="container-site">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Bar style={{ aspectRatio: "16/10" }} className="w-full mb-4" />
                <Bar className="h-3 w-1/3 mb-2" />
                <Bar className="h-6 w-full mb-2" />
                <Bar className="h-4 w-2/3" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Bar style={{ aspectRatio: "3/2" }} className="w-full mb-4" />
                <Bar className="h-3 w-1/3 mb-2" />
                <Bar className="h-6 w-full mb-2" />
                <Bar className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Destinations — tabbed showcase */}
      <section style={{ padding: "80px 0 96px", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <SectionHeader />
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bar key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Bar style={{ aspectRatio: "4/3" }} className="w-full" />
            <div className="space-y-3">
              <Bar className="h-3 w-1/3" />
              <Bar className="h-10 w-4/5" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-3/4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Bar key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 · Safari types — horizontal carousel */}
      <section style={{ padding: "80px 0 96px", background: "var(--bg)" }}>
        <div className="container-site">
          <SectionHeader withLink />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0" style={{ width: "360px" }}>
                <Bar style={{ aspectRatio: "4/5" }} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · Best sellers */}
      <section style={{ padding: "80px 0 96px", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Bar style={{ aspectRatio: "3/2" }} className="w-full mb-4" />
                <Bar className="h-3 w-1/3 mb-2" />
                <Bar className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 · Photo marquee strip */}
      <div className="flex gap-0 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bar
            key={i}
            className="shrink-0"
            style={{ height: "clamp(220px,25vw,320px)", width: "clamp(320px,40vw,480px)" }}
          />
        ))}
      </div>

      {/* 10 · Why choose us — feature cells */}
      <section style={{ padding: "96px 0 112px", background: "var(--bg)" }}>
        <div className="container-site">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t" style={{ borderColor: "var(--line)", gap: "1px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-8" style={{ background: "var(--bg)" }}>
                <Bar className="h-8 w-8 mb-4 rounded-full" />
                <Bar className="h-4 w-2/3 mb-2" />
                <Bar className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 · Stand out — image + checklist */}
      <section style={{ padding: "112px 0", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Bar style={{ aspectRatio: "4/5" }} className="w-full" />
            <div>
              <Bar className="h-3 w-28 mb-4" />
              <Bar className="h-14 w-full mb-2" />
              <Bar className="h-14 w-2/3 mb-8" />
              <div className="border-t" style={{ borderColor: "var(--line)" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-4 border-b flex gap-3.5" style={{ borderColor: "var(--line)" }}>
                    <Bar className="h-8 w-8 rounded-full flex-shrink-0" />
                    <Bar className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 · Tailor-made — checklist + photo */}
      <section style={{ padding: "112px 0", background: "var(--bg)" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
            <div>
              <Bar className="h-3 w-28 mb-4" />
              <Bar className="h-14 w-full mb-2" />
              <Bar className="h-14 w-2/3 mb-8" />
              <div className="border-t" style={{ borderColor: "var(--line)" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-4 border-b flex gap-3.5" style={{ borderColor: "var(--line)" }}>
                    <Bar className="h-8 w-8 rounded-full flex-shrink-0" />
                    <Bar className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <Bar style={{ aspectRatio: "4/5" }} className="w-full" />
          </div>
        </div>
      </section>

      {/* 14 · Testimonials — horizontal carousel */}
      <section style={{ padding: "80px 0 112px", background: "var(--bg)" }}>
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <Bar className="h-3 w-24 mb-2" />
              <Bar className="h-9 w-56" />
            </div>
            <div className="flex gap-2">
              <Bar className="h-10 w-10 rounded" />
              <Bar className="h-10 w-10 rounded" />
            </div>
          </div>
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-none" style={{ width: "420px" }}>
                <Bar className="h-full w-full" style={{ minHeight: "220px" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15 · Journal previews */}
      <section style={{ padding: "112px 0", background: "var(--bg)" }}>
        <div className="container-site">
          <SectionHeader withLink />
          <div className="grid gap-9 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            <Bar style={{ aspectRatio: "16/11" }} className="w-full" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Bar key={i} style={{ aspectRatio: "4/3" }} className="w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* 16 · FAQ — accordion */}
      <section style={{ padding: "96px 0 112px", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-24 items-start">
            <div>
              <Bar className="h-3 w-24 mb-4" />
              <Bar className="h-14 w-full mb-3" />
              <Bar className="h-3.5 w-4/5" />
            </div>
            <div className="border-t" style={{ borderColor: "var(--line)" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-6 border-b" style={{ borderColor: "var(--line)" }}>
                  <Bar className="h-5 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
