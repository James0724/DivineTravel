"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getSafariType } from "@/lib/data/safariTypes";
import Reveal from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";
import SafariTypeCard from "@/components/safaris/SafariTypeCard";
import { AnimatedHeading } from "../ui/Heading";

export default function SafariTypesSection() {
  const t = useTranslations("home.safariTypes");
  const exploreLabel = t("exploreLabel");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const types = HOMEPAGE_SAFARI_TYPE_SLUGS
    .map((slug) => getSafariType(slug))
    .filter((type): type is NonNullable<typeof type> => Boolean(type));

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    if (card) {
      const gap = parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
      const step = card.offsetWidth + gap;
      if (step > 0) {
        setActiveIndex(Math.min(types.length - 1, Math.round(el.scrollLeft / step)));
      }
    }
  }, [types.length]);

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
    if (e.key === "ArrowRight") { e.preventDefault(); scrollByCard(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCard(-1); }
  };

  return (
    <section className="py-20 sm:py-[120px] bg-bone-bg border-b" style={{ borderColor: "rgba(23,22,18,0.12)" }}>
      <div className="container-site">
        {/* Header */}
        <header className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                {t("eyebrow")}
              </div>
            </Reveal>

            <AnimatedHeading
              as="h2"
              textBefore={t("headingBefore")}
              highlightedText={t("headingHighlight")}
              textAfter={t("headingAfter")}
            />
          </div>
          <Reveal variant="fadeUp">
            <div className="flex flex-col justify-between gap-4">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("description")}
              </p>
              <SiteLink
                href="/safari-types"
                variant="ghost-mono"
                arrow
                className="self-start"
              >
                {t("viewAllTypes")}
              </SiteLink>
            </div>
          </Reveal>
        </header>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Safari types"
          onKeyDown={onKeyDown}
        >
          <div
            ref={scrollerRef}
            tabIndex={0}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none"
          >
            {types.map((type, i) => (
              <div
                key={type.slug}
                data-carousel-card
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${types.length}: ${type.label}`}
                className="shrink-0 snap-start w-[280px] xs:w-[320px] sm:w-[360px] md:w-[390px] lg:w-[400px]"
              >
                <SafariTypeCard type={type} exploreLabel={exploreLabel} priority={i < 3} />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--muted)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(types.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canScrollPrev}
                aria-label="Previous safari types"
                className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canScrollNext}
                aria-label="Next safari types"
                className="flex w-10 h-10 items-center justify-center rounded-full bg-bone-paper text-bone-ink shadow-md ring-1 ring-bone-ink/10 transition-opacity duration-200 hover:bg-bone-bg-soft disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


