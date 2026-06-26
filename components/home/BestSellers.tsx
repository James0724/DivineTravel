"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { AnimatedHeading } from "../ui/Heading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BESTSELLER_NUMS = ["01", "02", "03", "04"];
const BESTSELLER_HREFS = ["/safaris", "/safaris", "/safaris", "/safaris"];

type BestsellerCard = { num: string; title: string; route: string; href: string };

/* ── Card with spring lift + clay border on hover ─────────────────────── */
function SafariCard({ b, viewItinerary }: { b: BestsellerCard; viewItinerary: string }) {
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
            {viewItinerary}
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
  const t = useTranslations("home.bestSellers");
  const itemsData = t.raw("items") as { title: string; route: string }[];
  const bestsellers = BESTSELLER_NUMS.map((num, i) => ({
    num,
    title: itemsData[i].title,
    route: itemsData[i].route,
    href: BESTSELLER_HREFS[i],
  }));

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
              {t("description")}
            </p>
          </Reveal>
        </header>

        {/* Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestsellers.map((b) => (
            <RevealItem key={b.num}>
              <SafariCard b={b} viewItinerary={t("viewItinerary")} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
