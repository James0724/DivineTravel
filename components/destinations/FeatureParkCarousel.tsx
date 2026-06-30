"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import type { FeaturePark } from "@/types";

/* ── Card — image, tag, name, clamped description, top highlights & a
   "best for" chip, condensed into one scrollable card instead of a
   full-width alternating section ── */

function FeatureParkCard({
  park,
  index,
  total,
}: {
  park: FeaturePark;
  index: number;
  total: number;
}) {
  return (
    <Link
      href={park.href}
      data-carousel-card
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${park.name}`}
      className="group flex h-full w-[300px] xs:w-[360px] sm:w-[400px] md:w-[430px] lg:w-[450px] shrink-0 snap-start flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--bg-deep)]">
        <OptimizedImage
          src={park.image}
          alt={park.name}
          fill
          sizes="(max-width: 640px) 360px, (max-width: 1024px) 430px, 450px"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 bg-bone-paper px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] border border-bone-clay-soft">
          {park.num}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-[24px] pt-[24px] pb-[26px]">
        {park.tag && (
          <div className="mb-[10px] font-mono text-[10px] uppercase tracking-[0.14em] text-bone-clay">
            {park.tag}
          </div>
        )}
        <h3 className="mb-[10px] font-serif text-[28px] font-normal leading-[1.05] text-bone-ink">
          {park.name}{" "}
          {park.subtitle && (
            <em className="italic text-bone-ink/60">{park.subtitle}</em>
          )}
        </h3>
        <p className="mb-[16px] text-[14px] leading-relaxed text-bone-ink/65 line-clamp-4">
          {park.desc}
        </p>
        {park.highlights.length > 0 && (
          <ul className="mb-[18px] list-none">
            {park.highlights.slice(0, 4).map((h) => (
              <li
                key={h}
                className="relative py-[5px] pl-[16px] text-[13px] leading-snug text-bone-ink/70 before:absolute before:left-0 before:content-['›'] before:text-bone-clay"
              >
                {h}
              </li>
            ))}
          </ul>
        )}
        {park.bestFor && (
          <div className="mt-auto inline-flex w-fit items-center gap-[10px] rounded-full border border-[var(--line)] bg-bone-paper px-[16px] py-[9px] text-[13px]">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Best for
            </span>
            <b className="font-serif text-[16px] font-medium italic text-bone-clay">
              {park.bestFor}
            </b>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Carousel — narrow cards that peek at every breakpoint so there's
   always a visible hint of more content, a pair of round arrow buttons
   below the track (not overlaid on the photos) that dim rather than
   vanish at a boundary, and a mono "01 / 05" position readout instead of
   dots — per smashingmagazine.com/2022/04/designing-better-carousel-ux.
   Same scroll-snap pattern as AccommodationCarousel, no extra dependency. ── */

export default function FeatureParkCarousel({
  parks,
}: {
  parks: FeaturePark[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);

    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    if (card) {
      const gap =
        parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
      const step = card.offsetWidth + gap;
      if (step > 0) {
        setActiveIndex(
          Math.min(parks.length - 1, Math.round(el.scrollLeft / step)),
        );
      }
    }
  }, [parks.length]);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    if (!card) return;
    const gap = parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
    const step = card.offsetWidth + gap;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  if (parks.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured parks"
      onKeyDown={onKeyDown}
    >
      <div
        ref={scrollerRef}
        tabIndex={0}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none"
      >
        {parks.map((park, i) => (
          <FeatureParkCard
            key={park.id}
            park={park}
            index={i}
            total={parks.length}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--muted)" }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(parks.length).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous parks"
            className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Next parks"
            className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
