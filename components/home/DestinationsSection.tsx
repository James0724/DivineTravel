"use client";

import { useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import SiteLink from "@/components/ui/SiteLink";
import { AnimatedHeading } from "../ui/Heading";
import Reveal from "../ui/Reveal";

const DESTINATION_META = [
  {
    id: "ke",
    count: "07 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966309/web_images/destinations/sutirta-budiman-89IBtfoz3Vw-unsplash_oqy9hl.jpg",
    href: "/safaris/kenya",
    flag: "https://flagcdn.com/ke.svg",
  },
  {
    id: "tz",
    count: "06 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966350/web_images/destinations/hashim-mbita-GG-JAveq-4U-unsplash_zpjyoh.jpg",
    href: "/safaris/tanzania",
    flag: "https://flagcdn.com/tz.svg",
  },
  {
    id: "ug",
    count: "03 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966309/web_images/destinations/nathalie-lays-m0y_GPr8lXA-unsplash_yx2vgm.jpg",
    href: "/safaris/uganda",
    flag: "https://flagcdn.com/ug.svg",
  },
  {
    id: "rw",
    count: "04 PARKS",
    image:
      "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
    href: "/safaris/rwanda",
    flag: "https://flagcdn.com/rw.svg",
  },
  {
    id: "cb",
    count: "CIRCUITS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966346/web_images/destinations/david-clode-qHliP9cWqx4-unsplash_ii2dlp.jpg",
    href: "/cross-country-safaris",
    flag: null,
  },
];

type DestinationItem = {
  tab: string;
  country: string;
  title: string;
  blurb: string;
  parks: { name: string; note: string }[];
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function ArrowLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="fill-current"
      aria-hidden
    >
      <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="fill-current"
      aria-hidden
    >
      <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
    </svg>
  );
}

export default function DestinationsSection() {
  const t = useTranslations("home.destinations");
  const items = t.raw("items") as Record<string, DestinationItem>;
  const destinations = DESTINATION_META.map((meta) => ({
    ...meta,
    ...items[meta.id],
  }));

  const [current, setCurrent] = useState(0);

  const goNext = () => setCurrent((prev) => (prev + 1) % destinations.length);
  const goPrev = () =>
    setCurrent(
      (prev) => (prev - 1 + destinations.length) % destinations.length,
    );

  const dest = destinations[current];

  return (
    <section
      className="py-20 sm:py-[120px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="section-hd">
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
            />
          </div>
          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              {t("lead")}
            </p>
          </Reveal>
        </div>

        {/* ── Carousel ───────────────────────────────────────────────────── */}
        <Reveal variant="fadeUp">
          {/* ── Mobile (< lg): stacked single-slide ───────────────────────── */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={dest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-bone-paper"
              >
                {/* Image */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <OptimizedImage
                    src={dest.image}
                    alt={dest.tab}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute bottom-3 left-3 bg-bone-paper px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em]">
                    <strong className="text-bone-clay font-medium">
                      {dest.country}
                    </strong>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 py-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone-muted mb-2">
                    {dest.country} · {dest.count}
                  </p>
                  <h3 className="font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink text-[24px] mb-3">
                    {dest.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-bone-muted mb-5">
                    {dest.blurb}
                  </p>
                  <ul
                    className="border-t mb-5"
                    style={{ borderColor: "rgba(23,22,18,0.14)" }}
                  >
                    {dest.parks.slice(0, 3).map((p, i) => (
                      <li
                        key={p.name}
                        className="py-2.5 border-b grid items-center gap-2"
                        style={{
                          gridTemplateColumns: "16px 1fr",
                          borderColor: "rgba(23,22,18,0.14)",
                        }}
                      >
                        <span className="font-mono text-[9px] text-bone-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif italic text-[14px] text-bone-ink leading-tight">
                          {p.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <SiteLink href={dest.href} variant="solid" size="md">
                    {t("exploreCta", { tab: dest.tab })}
                  </SiteLink>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile nav */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2 items-center">
                {destinations.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => setCurrent(i)}
                    className={`h-px transition-all duration-300 ${
                      i === current
                        ? "w-8 bg-bone-clay"
                        : "w-4 bg-[rgba(23,22,18,0.25)]"
                    }`}
                    aria-label={`Go to ${d.tab}`}
                  />
                ))}
              </div>
              <div className="flex bg-bone-paper">
                <button
                  onClick={goPrev}
                  className="relative p-3 text-bone-muted hover:text-bone-ink transition-colors"
                  aria-label="Previous destination"
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-[rgba(23,22,18,0.2)]" />
                  <ArrowLeft />
                </button>
                <button
                  onClick={goNext}
                  className="p-3 text-bone-muted hover:text-bone-ink transition-colors"
                  aria-label="Next destination"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* ── Desktop (lg+): fixed-height split-panel carousel ──────────── */}
          <div
            className="hidden lg:block relative overflow-hidden bg-bone-paper"
            style={{ height: "560px" }}
          >
            {/* All slides — absolutely stacked, reference-style z-index switching */}
            {destinations.map((d, i) => {
              const isActive = i === current;
              return (
                <div
                  key={d.id}
                  className="absolute inset-0 flex"
                  style={{
                    zIndex: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {/* ── Left info panel ──────────────────────────────────── */}
                  <div className="relative z-10 flex flex-col justify-center w-[42%] h-full px-10 xl:px-16 overflow-hidden">
                    {/* Flag fills the entire left panel behind the content */}
                    {d.flag && (
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="absolute inset-0 select-none pointer-events-none"
                        aria-hidden
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.flag}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{ opacity: 0.08 }}
                        />
                      </motion.div>
                    )}
                    {/* Subtitle / country + count */}
                    <motion.p
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        visibility: isActive ? "visible" : "hidden",
                      }}
                      transition={{
                        delay: isActive ? 0.08 : 0,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-muted mb-3"
                    >
                      {d.country} · {d.count}
                    </motion.p>

                    {/* Title — serif, large */}
                    <motion.h3
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        visibility: isActive ? "visible" : "hidden",
                      }}
                      transition={{
                        delay: isActive ? 0.18 : 0,
                        duration: 0.55,
                        ease: EASE,
                      }}
                      className="font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink text-[30px] xl:text-[38px] mb-5"
                    >
                      {d.title}
                    </motion.h3>

                    {/* Blurb */}
                    <motion.p
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        visibility: isActive ? "visible" : "hidden",
                      }}
                      transition={{
                        delay: isActive ? 0.28 : 0,
                        duration: 0.55,
                        ease: EASE,
                      }}
                      className="text-[13px] leading-[1.78] text-bone-muted max-w-[36ch] mb-6"
                    >
                      {d.blurb}
                    </motion.p>

                    {/* Park list */}
                    <motion.ul
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        visibility: isActive ? "visible" : "hidden",
                      }}
                      transition={{
                        delay: isActive ? 0.38 : 0,
                        duration: 0.55,
                        ease: EASE,
                      }}
                      className="border-t mb-6"
                      style={{ borderColor: "rgba(23,22,18,0.14)" }}
                    >
                      {d.parks.slice(0, 4).map((p, idx) => (
                        <li
                          key={p.name}
                          className="py-[11px] border-b grid items-center gap-3"
                          style={{
                            gridTemplateColumns: "20px 1fr auto",
                            borderColor: "rgba(23,22,18,0.14)",
                          }}
                        >
                          <span className="font-mono text-[9px] text-bone-muted tracking-widest">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-serif italic text-[16px] text-bone-ink leading-tight">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-bone-muted text-right max-w-[18ch]">
                            {p.note}
                          </span>
                        </li>
                      ))}
                    </motion.ul>

                    {/* CTA */}
                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        visibility: isActive ? "visible" : "hidden",
                      }}
                      transition={{
                        delay: isActive ? 0.48 : 0,
                        duration: 0.55,
                        ease: EASE,
                      }}
                    >
                      <SiteLink href={d.href} variant="solid" size="md">
                        {t("exploreCta", { tab: d.tab })}
                      </SiteLink>
                    </motion.div>
                  </div>

                  {/* ── Right image panel — slides in from right ─────────── */}
                  <motion.div
                    className="relative w-[58%] h-full overflow-hidden"
                    animate={{ x: isActive ? "0%" : "100%" }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <OptimizedImage
                      src={d.image}
                      alt={d.tab}
                      fill
                      className="object-cover"
                      sizes="60vw"
                    />
                    {/* Country badge */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute bottom-5 left-5 bg-bone-paper px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em]"
                    >
                      <strong className="text-bone-clay font-medium">
                        {d.country}
                      </strong>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}

            {/* ── Arrow navigation — bottom-right ──────────────────────────── */}
            <div className="absolute bottom-0 right-0 z-20 bg-bone-paper flex items-center">
              <span className="font-mono text-[10px] text-bone-muted tracking-[0.15em] px-4">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(destinations.length).padStart(2, "0")}
              </span>
              <button
                onClick={goPrev}
                className="relative p-4 text-bone-muted hover:text-bone-ink transition-colors duration-200"
                aria-label="Previous destination"
              >
                {/* Divider */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-[rgba(23,22,18,0.2)]" />
                <ArrowLeft />
              </button>
              <button
                onClick={goNext}
                className="p-4 text-bone-muted hover:text-bone-ink transition-colors duration-200"
                aria-label="Next destination"
              >
                <ArrowRight />
              </button>
            </div>

            {/* ── Slide indicators — bottom-left ────────────────────────────── */}
            <div className="absolute bottom-[18px] left-10 z-20 flex items-center gap-2">
              {destinations.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setCurrent(i)}
                  className={`h-px transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-bone-clay"
                      : "w-4 bg-[rgba(23,22,18,0.25)] hover:bg-[rgba(23,22,18,0.45)]"
                  }`}
                  aria-label={`Go to ${d.tab}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
