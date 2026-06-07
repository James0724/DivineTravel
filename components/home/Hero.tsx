"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SiteLink from "@/components/ui/SiteLink";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LettersPullUp } from "@/components/ui/LettersPullUp";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slides = [
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80",
    alt: "African savanna sunset with acacia trees",
  },
  {
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80",
    alt: "Luxury safari lodge with mountain backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1920&q=80",
    alt: "African elephant herd at a waterhole in the savanna",
  },
];

const INTERVAL = 5500;

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const heroHeight = "calc(100svh - var(--navbar-h, 90px))";

  const goTo = useCallback(
    (idx: number) =>
      setCurrent(((idx % slides.length) + slides.length) % slides.length),
    [],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ height: heroHeight }}
      aria-label="Hero"
    >
      {/* ── Background carousel ───────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
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

      {/* ── Gradient overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,10,0.48) 0%, rgba(20,16,10,0.12) 38%, rgba(20,16,10,0.72) 100%)",
        }}
      />

      {/* ── Slide progress bar ───────────────────────────────────────── */}
      <motion.div
        key={`pb-${current}`}
        className="absolute bottom-0 left-0 z-[4] h-[2px] w-full"
        style={{ background: "rgba(244,212,168,0.65)", transformOrigin: "0 0" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: INTERVAL / 1000, ease: "linear" }}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div
        className={[
          "relative z-[3] flex flex-col",
          "px-5 sm:px-8 lg:px-12",
          "pt-6 pb-5 sm:pt-10 sm:pb-6 lg:pt-12 lg:pb-10",
        ].join(" ")}
        style={{ height: "100%" }}
      >
        {/* Eyebrow — slides in from left */}
        <motion.div
          className="eyebrow shrink-0"
          style={{ color: "rgba(244,239,226,0.85)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
        >
          <span className="dot" />
          African Safari Experts
        </motion.div>

        {/* Headline — each line pulls up character-by-character */}
        <div className="flex-1 flex flex-col justify-center py-3 sm:py-6 lg:py-8 min-h-0 overflow-hidden">
          <h1
            className="font-serif font-light tracking-[-0.025em] max-w-[20ch]"
            style={{ fontSize: "clamp(36px, 4vw, 68px)", lineHeight: "1.12" }}
          >
            {/* Line 1 */}
            <LettersPullUp
              text="Kenya, Tanzania"
              initialDelay={0.15}
              charDelay={0.035}
            />
            {/* Line 2 */}
            <LettersPullUp
              text="& Beyond — your"
              initialDelay={0.3}
              charDelay={0.035}
            />
            {/* Line 3 — two inline segments to keep clay italic on "unforgettable" */}
            <span className="flex flex-wrap items-baseline">
              <LettersPullUp
                text="unforgettable"
                initialDelay={0.45}
                charDelay={0.035}
                charStyle={{ color: "#f4d4a8", fontStyle: "italic" }}
              />
              <LettersPullUp
                text=" East"
                initialDelay={0.45 + 13 * 0.035}
                charDelay={0.035}
              />
            </span>
            {/* Line 4 */}
            <LettersPullUp
              text="Africa safari."
              initialDelay={0.65}
              charDelay={0.035}
            />
          </h1>

          <motion.p
            className="hidden 2xl:block mt-4 sm:mt-7 max-w-[48ch] text-[13px] sm:text-[14px] leading-[1.6] opacity-90"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.92, ease: EASE }}
          >
            Divine Travel Nest Safaris offers Kenya safari tours, Tanzania
            safaris and combined Kenya–Tanzania circuits, plus Uganda gorilla
            trekking. Tailor-made by an in-country team — start your African
            journey with us today.
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div
          className="shrink-0 flex items-center gap-3 pb-4 sm:pb-6 lg:pb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.82, ease: EASE }}
        >
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
        </motion.div>

        {/* Footer row — staggered entrance */}
        <motion.div
          className="shrink-0 pt-4 sm:pt-7 lg:pt-8 border-t"
          style={{ borderColor: "rgba(244,239,226,0.22)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
        >
          {/* Mobile — stacked */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex flex-wrap gap-2.5 items-center">
              <SiteLink href="/contact" variant="outline-light" size="sm">
                Plan my safari
              </SiteLink>
              <SiteLink
                href="/safaris"
                variant="outline-light"
                size="sm"
                arrow={false}
              >
                Explore our journeys
              </SiteLink>
            </div>
          </div>

          {/* sm+ — side-by-side grid */}
          <div
            className="hidden sm:grid gap-8 lg:gap-12"
            style={{ gridTemplateColumns: "auto 1fr" }}
          >
            <div className="flex flex-wrap gap-3 items-end">
              <SiteLink
                href="/plan-my-safari"
                variant="outline-light"
                size="md"
                className="mt-7 sm:mt-8 self-start"
              >
                Plan my safari
              </SiteLink>
              <SiteLink
                href="/safaris"
                variant="outline-light"
                size="md"
                arrow={false}
              >
                Explore our journeys
              </SiteLink>
            </div>

            <div className="flex items-end justify-end gap-6 lg:gap-9 flex-wrap">
              {[
                { num: "10", sup: "+yr", label: "Guiding experience" },
                { num: "3", sup: "×", label: "Countries" },
                { num: "24", sup: "/7", label: "Support" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.05 + i * 0.1,
                    ease: EASE,
                  }}
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
