"use client";

import { useState, useEffect, useCallback } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SiteLink from "@/components/ui/SiteLink";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import TitleHero from "@/components/ui/TitleHero";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slides = [
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782656201/Gallarey/pexels-luya-29415794_cso8gm.jpg",
    alt: "A Leopard roaming in the African savanna",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782655866/Gallarey/pexels-g-n-403098-13098956_hq5wof.jpg",
    alt: "Zebra grazing",
  },
  {
    src: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1920&q=80",
    alt: "African elephant herd at a waterhole in the savanna",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782655855/Gallarey/pexels-gsn-travel-28708345_rfgkdr.jpg",
    alt: "African zebra and wilbest herd grazing in the savanna",
  },
];

const INTERVAL = 5500;
const PARTICLE_COUNT = 34;

type Particle = {
  left: number;
  top: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
};

/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENT PARTICLES — generated client-side only to avoid hydration mismatch
═══════════════════════════════════════════════════════════════════════════ */

function HeroParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => {
        // Random size between 1px and 4px
        const size = 0.5 + Math.random() * 2;
        // Larger particles are slightly more opaque, smaller ones are faint
        const opacity = 0.2 + Math.random() * 0.6;

        return {
          left: Math.random() * 100,
          top: 55 + Math.random() * 45,
          // Dust moves slowly, so let's keep the durations longer (8s to 20s)
          duration: 8 + Math.random() * 12,
          delay: Math.random() * -20, // Negative delay forces animations to start mid-way immediately
          size,
          opacity,
        };
      }),
    );
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="hero-particle absolute block rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `rgba(244, 212, 168, ${p.opacity})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: p.size > 2.5 ? "blur(0.5px)" : "none", // Subtle blur on larger dust flakes
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const t = useTranslations("home.hero");
  const [current, setCurrent] = useState(0);
  const nextIndex = (current + 1) % slides.length;

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
      className="relative text-white overflow-hidden
                 h-[calc(90svh_-_var(--navbar-h,90px))]
                 sm:h-[calc(92svh_-_var(--navbar-h,90px))]
                 md:h-[calc(94svh_-_var(--navbar-h,90px))]
                 lg:h-[calc(96svh_-_var(--navbar-h,90px))]
                 xl:h-[calc(100svh_-_var(--navbar-h,90px))]"
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
          <OptimizedImage
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Preload the upcoming slide so it's already cached when its turn comes —
          fixes the visible blank gap between crossfades. Kept in the layout (not
          display:none) and 1x1px so next/image's "fill" sizing is satisfied. */}
      <div
        className="relative w-px h-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <OptimizedImage
          src={slides[nextIndex].src}
          alt=""
          fill
          sizes="100vw"
          priority
        />
      </div>

      {/* ── Gradient overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,11,7,0.45) 0%, rgba(14,11,7,0.25) 38%, rgba(14,11,7,0.55) 100%",
        }}
      />

      {/* ── Ambient decoration — particles, glow orb, rotating rings ───── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <HeroParticles />

        <div
          className="hero-glow-orb absolute top-1/2 left-1/2 rounded-full
                      w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] lg:w-[700px] lg:h-[700px]"
          style={{
            transform: "translate(-50%, -55%)",
            background:
              "radial-gradient(ellipse at center, rgba(245,201,122,0.18) 0%, rgba(240,180,80,0.06) 35%, transparent 70%)",
          }}
        />
        <div
          className="hero-ring-1 absolute top-[60%] left-1/2 rounded-full
                      w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px]"
          style={{
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(245,201,122,0.12)",
          }}
        />
        <div
          className="hero-ring-2 absolute top-[60%] left-1/2 rounded-full
                      w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px]"
          style={{
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(245,201,122,0.07)",
          }}
        />
      </div>

      {/* ── Slide progress bar ───────────────────────────────────────── */}
      <motion.div
        key={`pb-${current}`}
        className="absolute bottom-0 left-0 z-[5] h-[2px] w-full"
        style={{ background: "rgba(244,212,168,0.65)", transformOrigin: "0 0" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: INTERVAL / 1000, ease: "linear" }}
      />

      {/* ── Main content — title centered, footer pinned to the bottom ── */}
      <div
        className="relative z-[3] flex flex-col items-center
                   text-center h-full px-5 sm:px-8 pt-6 md:pt-8 lg:pt-10 xl:pt-12 pb-14 sm:pb-28"
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-4 sm:gap-5 xl:gap-10">
          <TitleHero
            variant="transparent"
            eyebrow={t("eyebrow")}
            title="East Africa Safari"
            accent={"(KE/TZ/UG/RW)"}
            description={t("description")}
          />
        </div>

        <motion.div
          className="shrink-0 pt-4 sm:pt-7 lg:pt-8 border-t w-full"
          style={{ borderColor: "rgba(244,239,226,0.22)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
        >
          {/* Mobile — stacked */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex flex-wrap gap-2.5 items-center">
              <SiteLink href="/contact" variant="outline-light" size="sm">
                {t("planSafari")}
              </SiteLink>
              <SiteLink
                href="/safaris"
                variant="outline-light"
                size="sm"
                arrow={false}
              >
                {t("exploreJourneys")}
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
                {t("planSafari")}
              </SiteLink>
              <SiteLink
                href="/safaris"
                variant="outline-light"
                size="md"
                arrow={false}
              >
                {t("exploreJourneys")}
              </SiteLink>
            </div>

            <div className="flex items-end justify-end gap-6 lg:gap-9 flex-wrap">
              {(
                t.raw("stats") as { num: string; sup: string; label: string }[]
              ).map((s, i) => (
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
                    style={{
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2.4vw, 28px)",
                    }}
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

      {/* ── Slide arrows — fixed to the edges so the centered layout stays clear ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[4]
                   w-9 h-9 rounded-full flex items-center justify-center
                   bg-black/25 hover:bg-black/50 backdrop-blur-[3px]
                   border border-white/25 hover:border-white/55
                   text-white/80 hover:text-white
                   transition-all duration-200"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[4]
                   w-9 h-9 rounded-full flex items-center justify-center
                   bg-black/25 hover:bg-black/50 backdrop-blur-[3px]
                   border border-white/25 hover:border-white/55
                   text-white/80 hover:text-white
                   transition-all duration-200"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      {/* ── Slide indicators + scroll hint ──────────────────────────────── */}
      <div className="absolute bottom-7 sm:bottom-9 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-4">
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

        <div
          className="hidden sm:flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]"
          style={{ color: "rgba(244,239,226,0.55)" }}
        >
          <span
            className="hero-scroll-line block w-px h-9"
            style={{
              background:
                "linear-gradient(to bottom, rgba(168,130,58,0.8), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
