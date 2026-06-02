"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDES  — swap these for production images when ready
═══════════════════════════════════════════════════════════════════════════ */

const slides = [
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80",
    alt: "African savanna sunset with acacia trees",
  },
  {
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80",
    alt: "Nice hotel with swimming pool with mountain backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1920&q=80",
    alt: "Elephant walking in the savanna",
  },
];

const INTERVAL = 5500; // ms between auto-advances

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Height formula (same as before) ── */
  const heroHeight = "clamp(400px, calc(100vh - 116px), 92vh)";

  /* ── Navigation helpers ── */
  const goTo = useCallback(
    (idx: number) =>
      setCurrent(((idx % slides.length) + slides.length) % slides.length),
    [],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* ── Auto-advance (resets whenever slide or pause state changes) ── */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, next]);

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ minHeight: heroHeight }}
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background carousel ─────────────────────────────────────────
          AnimatePresence (default sync mode, v11): old slide exits while
          new slide enters simultaneously → pure crossfade.
          The scale 1.04→1 on enter gives a Ken-Burns zoom-out feel.
      ──────────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: "easeInOut" },
            scale: { duration: 7, ease: "easeOut" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlay (above slides, below content) ────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,10,0.45) 0%, rgba(20,16,10,0.15) 35%, rgba(20,16,10,0.65) 100%)",
        }}
      />

      {/* ── Main content (sits above gradient + slides) ─────────────────
          Layout is identical to the previous responsive version.
      ──────────────────────────────────────────────────────────────── */}
      <div
        className={[
          "relative z-[3] flex flex-col",
          "px-5 sm:px-8 lg:px-12",
          "pt-6 pb-5 sm:pt-14 sm:pb-8 lg:pt-20 lg:pb-14",
        ].join(" ")}
        style={{ minHeight: heroHeight }}
      >
        {/* Eyebrow */}
        <div
          className="eyebrow shrink-0"
          style={{ color: "rgba(244,239,226,0.85)" }}
        >
          <span className="dot" />
          African Safari Experts
        </div>

        {/* Headline + body copy + dot indicators */}
        <div className="flex-1 flex flex-col justify-center py-3 sm:py-7 lg:py-10 min-h-0">
          <h1
            className="font-serif font-light leading-[0.96] tracking-[-0.025em] max-w-[17ch]"
            style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }}
          >
            Kenya, Tanzania
            <br />
            &amp; Beyond — your
            <br />
            <em
              style={{ color: "#f4d4a8", fontStyle: "italic", fontWeight: 300 }}
            >
              unforgettable
            </em>{" "}
            East
            <br />
            Africa safari.
          </h1>

          <p className="hidden md:block mt-4 sm:mt-7 max-w-[48ch] text-[13px] sm:text-[14px] leading-[1.6] opacity-90">
            Divine Travel Nest Safaris offers Kenya safari tours, Tanzania
            safaris and combined Kenya–Tanzania circuits, plus Uganda gorilla
            trekking. Tailor-made by an in-country team — start your African
            journey with us today.
          </p>

          {/* ── Controls: prev/next + dot indicators grouped together ── */}
          <div className="flex items-center gap-3 mt-5 sm:mt-7">
            {/* Prev */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full flex items-center justify-center
                         bg-black/25 hover:bg-black/50 backdrop-blur-[3px]
                         border border-white/25 hover:border-white/55
                         text-white/80 hover:text-white
                         transition-all duration-200 flex-shrink-0"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* Dots */}
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Slide indicators"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Slide ${i + 1} of ${slides.length}`}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  style={{
                    height: "3px",
                    width: i === current ? "24px" : "10px",
                    background:
                      i === current
                        ? "rgba(244,212,168,1)"
                        : "rgba(244,239,226,0.35)",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full flex items-center justify-center
                         bg-black/25 hover:bg-black/50 backdrop-blur-[3px]
                         border border-white/25 hover:border-white/55
                         text-white/80 hover:text-white
                         transition-all duration-200 flex-shrink-0"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Footer row ──────────────────────────────────────────────── */}
        <div
          className="shrink-0 pt-4 sm:pt-7 lg:pt-8 border-t"
          style={{ borderColor: "rgba(244,239,226,0.22)" }}
        >
          {/* Mobile — stacked */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex flex-wrap gap-2.5 items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                           text-[13px] tracking-[0.01em]
                           transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "#f4efe2", color: "#171612" }}
              >
                Plan my safari
                <span
                  className="w-[24px] h-[24px] rounded-full flex items-center justify-center
                             text-[12px] text-white flex-shrink-0"
                  style={{ background: "#9d4519" }}
                >
                  →
                </span>
              </Link>
              <Link
                href="/safaris"
                className="inline-flex items-center px-4 py-2 rounded-full
                           text-[13px] tracking-[0.01em] text-white
                           transition-all duration-200 hover:bg-white/10"
                style={{ border: "1px solid rgba(244,239,226,0.4)" }}
              >
                Explore our journeys
              </Link>
            </div>

            {/* <div className="flex items-end gap-6">
              {[
                { num: "10", sup: "+yr", label: "Experience" },
                { num: "3", sup: "×", label: "Countries" },
                { num: "24", sup: "/7", label: "Support" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-serif leading-none"
                    style={{ fontSize: "clamp(27px, 3.24vw, 37.8px)" }}
                  >
                    {s.num}
                    <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
                      {s.sup}
                    </em>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.14em] mt-1 opacity-70">
                    {s.label}
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* sm+ — side-by-side grid */}
          <div
            className="hidden sm:grid gap-8 lg:gap-12"
            style={{ gridTemplateColumns: "auto 1fr" }}
          >
            <div className="flex flex-wrap gap-3 items-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full
                           text-[14px] tracking-[0.01em]
                           transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "#f4efe2", color: "#171612" }}
              >
                Plan my safari
                <span
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center
                             text-[13px] text-white flex-shrink-0"
                  style={{ background: "#9d4519" }}
                >
                  →
                </span>
              </Link>
              <Link
                href="/safaris"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full
                           text-[14px] tracking-[0.01em] text-white
                           transition-all duration-200 hover:bg-white/10"
                style={{ border: "1px solid rgba(244,239,226,0.4)" }}
              >
                Explore our journeys
              </Link>
            </div>

            <div className="flex items-end justify-end gap-6 lg:gap-9 flex-wrap">
              {[
                { num: "10", sup: "+yr", label: "Guiding experience" },
                { num: "3", sup: "×", label: "Countries" },
                { num: "24", sup: "/7", label: "Support" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-serif leading-none"
                    style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}
                  >
                    {s.num}
                    <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
                      {s.sup}
                    </em>
                  </div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.16em] mt-1.5"
                    style={{ opacity: 0.72 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
