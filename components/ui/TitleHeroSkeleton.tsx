/** Mirrors components/ui/TitleHero.tsx (variant="light") loading state. */
export default function TitleHeroSkeleton() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-[38vh] sm:min-h-[50vh] py-8 sm:py-10 animate-pulse" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-10 w-full">
        <div className="h-2.5 w-40 rounded mx-auto mb-4" style={{ background: "var(--bg-deep)" }} />
        <div className="h-10 sm:h-14 rounded mx-auto mb-3" style={{ background: "var(--bg-deep)", maxWidth: "560px" }} />
        <div className="h-[2px] w-[90px] rounded mx-auto my-3" style={{ background: "var(--bg-deep)" }} />
        <div className="h-4 rounded mx-auto" style={{ background: "var(--bg-deep)", maxWidth: "440px" }} />
      </div>
    </section>
  );
}
