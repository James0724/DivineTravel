"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import type { Accommodation, AccommodationType } from "@/types";

const TYPE_LABEL: Record<AccommodationType, string> = {
  "luxury-lodge": "Luxury Lodge",
  "tented-camp": "Tented Camp",
  "beach-resort": "Beach Resort",
};

/* ── Card — cover image + overlay text only, per the simplified carousel design ── */

function AccommodationCarouselCard({ property }: { property: Accommodation }) {
  const coverImage =
    property.coverImage ||
    property.images?.[0]?.url ||
    "/images/placeholder.jpg";

  return (
    <a
      href="/contact"
      data-carousel-card
      className="group relative flex aspect-[3/2] w-[250px] xs:w-[320px] sm:w-[400px] md:w-[440px] shrink-0 snap-start cursor-pointer items-end overflow-hidden rounded-sm"
    >
      <OptimizedImage
        src={coverImage}
        alt={property.name}
        fill
        thumbSize={900}
        sizes="(max-width: 479px) 400px, (max-width: 639px) 512px, (max-width: 767px) 640px, 704px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

      <span className="absolute left-2 top-2 z-10 rounded-full bg-black/55 px-2 py-1 text-[9px] font-mono tracking-wide text-white backdrop-blur-sm">
        {TYPE_LABEL[property.type]}
      </span>

      <div className="relative z-10 flex flex-col gap-1 p-3 text-white">
        <p className="font-serif text-[15px] leading-[1.2] line-clamp-2">
          {property.name}
        </p>
        <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/75">
          {property.location.country}
        </p>
      </div>
    </a>
  );
}

/* ── Carousel — narrow portrait cards that peek at every breakpoint
   (arte.tv-style) so there's always a visible hint of more content, plus a
   pair of round arrow buttons below the track (not overlaid on the photos)
   that dim rather than vanish at a boundary, per smashingmagazine.com/
   2022/04/designing-better-carousel-ux. No dot/progress indicator by
   design. ── */

export default function AccommodationCarousel({
  accommodations,
}: {
  accommodations: Accommodation[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

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

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {accommodations.map((property) => (
          <AccommodationCarouselCard key={property._id} property={property} />
        ))}
      </div>

      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollPrev}
          aria-label="Previous properties"
          className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollNext}
          aria-label="Next properties"
          className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
