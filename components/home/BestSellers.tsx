"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { AnimatedHeading } from "../ui/Heading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const bestsellers = [
  {
    num: "01",
    title: "7-Day Masai Mara & Amboseli",
    route:
      "Nairobi → Masai Mara → Amboseli → Nairobi. Big Five, wildebeest herds & Kilimanjaro views.",
    href: "/safaris",
  },
  {
    num: "02",
    title: "10-Day Kenya–Tanzania Classic",
    route:
      "Masai Mara → Serengeti → Ngorongoro → Amboseli. The ultimate cross-border safari.",
    href: "/safaris",
  },
  {
    num: "03",
    title: "5-Day Gorilla Trekking Uganda",
    route:
      "Entebbe → Bwindi Impenetrable Forest → Queen Elizabeth NP. Mountain gorillas & tree-climbing lions.",
    href: "/safaris",
  },
  {
    num: "04",
    title: "14-Day East Africa Grand Tour",
    route:
      "Kenya + Tanzania + Uganda. Masai Mara, Serengeti, Bwindi — the full East Africa experience.",
    href: "/safaris",
  },
];

/* ── Card with spring lift + clay border on hover ─────────────────────── */
function SafariCard({ b }: { b: (typeof bestsellers)[0] }) {
  return (
    <motion.div
      className="h-full"
      whileHover={{
        y: -6,
        boxShadow: "0 12px 40px rgba(23,22,18,0.13)",
      }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <Link
        href={b.href}
        className="flex flex-col gap-3.5 p-7 bg-bone-bg border h-full group transition-colors duration-300 hover:border-bone-clay"
        style={{ borderColor: "rgba(23,22,18,0.14)" }}
      >
        {/* Number — scales up slightly on hover via group */}
        <span className="font-serif italic text-[14px] text-bone-clay group-hover:scale-110 transition-transform duration-200 inline-block origin-left">
          {b.num}
        </span>

        <h3 className="font-serif font-normal text-[26px] leading-[1.1] tracking-[-0.01em] text-bone-ink group-hover:text-bone-clay transition-colors duration-200">
          <em>{b.title}</em>
        </h3>

        <p className="text-[13px] leading-[1.5] text-bone-muted flex-1">
          {b.route}
        </p>

        {/* Arrow row — arrow nudges forward on hover */}
        <div className="mt-auto flex items-center gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-forest group-hover:text-bone-clay transition-colors duration-200">
            View itinerary
          </span>
          <motion.span
            className="font-mono text-[11px] text-bone-forest group-hover:text-bone-clay transition-colors duration-200"
            style={{ display: "inline-block" }}
            animate={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BestSellers() {
  return (
    <section
      className="py-[120px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        {/* Header */}

        <header className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                Most Booked Tours
              </div>
            </Reveal>

            {/* Heading — character pull-up */}
            <AnimatedHeading
              as="h1"
              textBefore="Guest "
              highlightedText="favourites"
            />
          </div>
          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              These are our most-requested itineraries — handpicked by our team
              based on wildlife density, seasonal timing, and guest feedback.
            </p>
          </Reveal>
        </header>

        {/* Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestsellers.map((b) => (
            <RevealItem key={b.num}>
              <SafariCard b={b} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
