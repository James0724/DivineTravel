"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SiteLink from "@/components/ui/SiteLink";
import { AnimatedHeading } from "../ui/Heading";
import Reveal from "../ui/Reveal";

const destinations = [
  {
    id: "ke",
    tab: "Kenya",
    count: "07 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966309/web_images/destinations/sutirta-budiman-89IBtfoz3Vw-unsplash_oqy9hl.jpg",
    country: "Kenya · East Africa",
    title: "The Masai Mara & beyond.",
    blurb:
      "Home to the Great Wildebeest Migration and the Big Five, Kenya's parks offer some of the most dramatic wildlife encounters on Earth — from the sweeping Mara plains to the snow-capped peaks of Mount Kenya.",
    parks: [
      { name: "Masai Mara National Reserve", note: "Migration July–Oct" },
      { name: "Amboseli National Park", note: "Kilimanjaro backdrop" },
      { name: "Tsavo East & West", note: "Red elephants" },
      { name: "Lake Nakuru National Park", note: "Flamingo flocks" },
      { name: "Samburu National Reserve", note: "Special Five" },
      { name: "Mount Kenya National Park", note: "Trekking & wildlife" },
      { name: "Aberdare National Park", note: "Forest elephants" },
    ],
    href: "/safaris/kenya",
  },
  {
    id: "tz",
    tab: "Tanzania",
    count: "06 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966350/web_images/destinations/hashim-mbita-GG-JAveq-4U-unsplash_zpjyoh.jpg",
    country: "Tanzania · East Africa",
    title: "Serengeti, Ngorongoro & Zanzibar.",
    blurb:
      "Tanzania's vast wilderness holds the world's largest wildlife spectacle. The endless Serengeti plains, the ancient Ngorongoro Crater, and the spice-scented beaches of Zanzibar await.",
    parks: [
      { name: "Serengeti National Park", note: "Migration year-round" },
      { name: "Ngorongoro Conservation Area", note: "World's largest caldera" },
      { name: "Tarangire National Park", note: "Elephant herds" },
      { name: "Lake Manyara National Park", note: "Tree-climbing lions" },
      { name: "Ruaha National Park", note: "Wild & remote" },
      { name: "Zanzibar Archipelago", note: "Beach extension" },
    ],
    href: "/safaris/tanzania",
  },
  {
    id: "ug",
    tab: "Uganda",
    count: "03 PARKS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966309/web_images/destinations/nathalie-lays-m0y_GPr8lXA-unsplash_yx2vgm.jpg",
    country: "Uganda · East Africa",
    title: "Gorillas in the heart of Africa.",
    blurb:
      "Uganda is the Pearl of Africa — trekking mountain gorillas in Bwindi Impenetrable Forest is a once-in-a-lifetime encounter. Add chimpanzee tracking and dramatic Nile cruises.",
    parks: [
      { name: "Bwindi Impenetrable Forest", note: "Mountain gorilla trekking" },
      { name: "Queen Elizabeth National Park", note: "Tree-climbing lions" },
      { name: "Kibale Forest National Park", note: "Chimp tracking" },
    ],
    href: "/safaris/uganda",
  },
  {
    id: "rw",
    tab: "Rwanda",
    count: "04 PARKS",
    image:
      "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
    country: "Rwanda · East Africa",
    title: "The land of a thousand hills.",
    blurb:
      "Rwanda offers an intimate, luxury approach to East African wildlife — gorilla trekking in the misty Virunga volcanoes, chimpanzees in Nyungwe's ancient forest canopy, and the Big Five in Akagera's vast savannah.",
    parks: [
      { name: "Volcanoes National Park", note: "Gorilla & golden monkey trekking" },
      { name: "Nyungwe Forest National Park", note: "Chimps & canopy walk" },
      { name: "Akagera National Park", note: "Big Five savannah safari" },
      { name: "Lake Kivu", note: "Scenic beach extension" },
    ],
    href: "/safaris/rwanda",
  },
  {
    id: "cb",
    tab: "Cross Country",
    count: "CIRCUITS",
    image:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1779966346/web_images/destinations/david-clode-qHliP9cWqx4-unsplash_ii2dlp.jpg",
    country: "East Africa · Multi-country",
    title: "One circuit, three countries.",
    blurb:
      "The Mara and the Serengeti are one ecosystem divided by a line on a map. Combine Kenya, Tanzania and Uganda into a single unforgettable cross-border itinerary.",
    parks: [
      { name: "Masai Mara + Serengeti", note: "Great Migration circuit" },
      { name: "Kenya + Tanzania + Uganda", note: "14–21 day grand tour" },
      { name: "Nairobi + Kilimanjaro fly-in", note: "Luxury combination" },
    ],
    href: "/cross-country-safaris",
  },
];

export default function DestinationsSection() {
  const [active, setActive] = useState("ke");
  const dest = destinations.find((d) => d.id === active)!;

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
                Top East Africa Safari Destinations
              </div>
            </Reveal>

            {/* Heading — character pull-up */}
            <AnimatedHeading
              as="h1"
              textBefore="Four countries, one "
              highlightedText="circuit"
            />
          </div>
          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              The Mara and the Serengeti are one ecosystem split by a line on a
              map. Choose a country to begin, or let us combine them into a
              single cross-border itinerary.
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
                Explore {dest.tab} safaris
              </SiteLink>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
