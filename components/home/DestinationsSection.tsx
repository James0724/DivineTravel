"use client";

import { useState } from "react";
import Image from "next/image";
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
  },
  {
    id: "tz",
    count: "06 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966350/web_images/destinations/hashim-mbita-GG-JAveq-4U-unsplash_zpjyoh.jpg",
    href: "/safaris/tanzania",
  },
  {
    id: "ug",
    count: "03 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966309/web_images/destinations/nathalie-lays-m0y_GPr8lXA-unsplash_yx2vgm.jpg",
    href: "/safaris/uganda",
  },
  {
    id: "rw",
    count: "04 PARKS",
    image:
      "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
    href: "/safaris/rwanda",
  },
  {
    id: "cb",
    count: "CIRCUITS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966346/web_images/destinations/david-clode-qHliP9cWqx4-unsplash_ii2dlp.jpg",
    href: "/cross-country-safaris",
  },
];

type DestinationItem = {
  tab: string;
  country: string;
  title: string;
  blurb: string;
  parks: { name: string; note: string }[];
};

export default function DestinationsSection() {
  const t = useTranslations("home.destinations");
  const items = t.raw("items") as Record<string, DestinationItem>;
  const destinations = DESTINATION_META.map((meta) => ({
    ...meta,
    ...items[meta.id],
  }));

  const [active, setActive] = useState("ke");
  const dest = destinations.find((d) => d.id === active)!;
  const exploreCta = t("exploreCta", { tab: dest.tab });

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

            {/* Heading — character pull-up */}
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

        {/* ── Tabs — horizontally scrollable on mobile ────────────────────── */}
        <Reveal variant="fadeUp">
          <div
            className="flex gap-0 mb-10 border-b overflow-x-auto no-scrollbar"
            style={{ borderColor: "rgba(23,22,18,0.14)" }}
          >
            {destinations.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`
                flex-shrink-0 pb-[16px] mr-6 font-serif text-[18px] sm:text-[22px]
                border-b-2 -mb-px transition-all duration-200
                ${
                  active === d.id
                    ? "text-bone-forest border-bone-clay"
                    : "text-bone-muted border-transparent hover:text-bone-ink"
                }
              `}
              >
                {d.tab}
                <span
                  className={`
                  font-mono text-[9px] sm:text-[10px] tracking-[0.16em] ml-2 align-[6px]
                  ${active === d.id ? "text-bone-clay" : "text-bone-muted"}
                `}
                >
                  {d.count}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Pane ────────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-start lg:items-stretch"
          >
            {/* ── Image ─────────────────────────────────────────────────── */}
            <div
              className="relative overflow-hidden group w-full rounded-sm"
              style={{ aspectRatio: "16/10" }}
            >
              {/* Mobile gets 16:10, desktop stretches to fill grid height */}
              <div className="absolute inset-0 lg:relative lg:h-full lg:w-full">
                <Image
                  src={dest.image}
                  alt={dest.tab}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-bone-paper px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em]">
                <strong className="text-bone-clay font-medium">
                  {dest.country}
                </strong>
              </div>
            </div>

            {/* ── Content ───────────────────────────────────────────────── */}
            <div className="flex flex-col">
              <AnimatedHeading as="h3" textBefore={dest.title} />

              <p className="text-[14px] sm:text-[16px] leading-[1.65] text-bone-muted max-w-[48ch] mb-7 sm:mb-9">
                {dest.blurb}
              </p>

              {/* Park list */}
              <ul
                className="border-t flex-1"
                style={{ borderColor: "rgba(23,22,18,0.14)" }}
              >
                {dest.parks.map((p, i) => (
                  <li
                    key={p.name}
                    className="py-[14px] sm:py-[18px] border-b grid items-baseline gap-3 sm:gap-4 transition-all duration-300 hover:pl-2"
                    style={{
                      gridTemplateColumns: "22px 1fr auto",
                      borderColor: "rgba(23,22,18,0.14)",
                    }}
                  >
                    <span className="font-mono text-[9px] sm:text-[10px] text-bone-muted tracking-[0.12em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif italic text-[17px] sm:text-[22px] text-bone-ink leading-tight">
                      {p.name}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-bone-muted leading-[1.4] text-right max-w-[20ch] sm:max-w-[24ch]">
                      {p.note}
                    </span>
                  </li>
                ))}
              </ul>

              <SiteLink
                href={dest.href}
                variant="solid"
                size="md"
                className="mt-7 sm:mt-8 self-start"
              >
                {exploreCta}
              </SiteLink>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
