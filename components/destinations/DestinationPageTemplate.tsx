"use client";

import { useState, useEffect, useRef } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BreadcrumbSchema,
  FaqSchema,
  TouristDestinationSchema,
} from "@/components/seo/StructuredData";
import { type HeroStat } from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import TitleHero from "../ui/TitleHero";
import PkgCard from "../safaris/PkgCard";
import Pagination from "@/components/ui/Pagination";
import FeatureParkCarousel from "./FeatureParkCarousel";
import { Safari, FeaturePark, CompactPark } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────

export type { FeaturePark, CompactPark };

export interface FaqItem {
  q: string;
  a: string;
}
export interface Season {
  badge: string;
  title: string;
  items: string[];
}
export interface WhyReason {
  n: string;
  title: string;
  desc: string;
}

export interface DestinationPageData {
  hero: {
    image: string;
    imageAlt: string;
    /** e.g. 'kenya' — used for breadcrumb href + last crumb label */
    slug: string;
    title: string;
    description: string;
    stats: HeroStat[];
  };

  why: {
    images: [{ src: string; alt: string }, { src: string; alt: string }];
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
    reasons: WhyReason[];
  };

  featureParks: FeaturePark[];
  featureParksHeader: { eyebrow: string; description: string };

  moreParks: CompactPark[];
  moreParksHeader: {
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
  };
  /** Tailwind grid-cols classes for the more-parks grid */
  moreParksGridCols?: string;

  howToChoose: Array<{ want: string; go: string }>;
  howToChooseDescription: string;

  bestTime: {
    heading: React.ReactNode;
    description: string;
    seasons: Season[];
  };

  packages: Safari[];
  packagesHref: string;
  packagesHeader: {
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
  };
  packagesLinkText: string;

  faqs: FaqItem[];
  faqHeader: { eyebrow: string; heading: React.ReactNode };

  cta: { heading: React.ReactNode; description: string };

  breadcrumbs: Array<{ name: string; href: string }>;
}

// ─── Template ───────────────────────────────────────────────────────────────

const COUNTRY_CODES: Record<string, string> = {
  kenya: "KE",
  tanzania: "TZ",
  uganda: "UG",
  rwanda: "RW",
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

export default function DestinationPageTemplate({
  data,
}: {
  data: DestinationPageData;
}) {
  const t = useTranslations("common.ui.safariPage");
  const slug = data.hero.slug;
  const countryLabel = slug.charAt(0).toUpperCase() + slug.slice(1);
  const countryCode = COUNTRY_CODES[slug] ?? slug.toUpperCase().slice(0, 2);

  const MORE_PARKS_PAGE_SIZE = 12;
  const [morePage, setMorePage] = useState(1);
  const moreSectionRef = useRef<HTMLElement>(null);
  const isFirstMount = useRef(true);

  const moreParksTotalPages = Math.ceil(
    data.moreParks.length / MORE_PARKS_PAGE_SIZE,
  );
  const visibleMoreParks = data.moreParks.slice(
    (morePage - 1) * MORE_PARKS_PAGE_SIZE,
    morePage * MORE_PARKS_PAGE_SIZE,
  );

  // Scroll to section top after the new page has painted — avoids the jitter
  // that happens when scrollIntoView is called before React has re-rendered.
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const el = moreSectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }, [morePage]);

  const handleMorePageChange = (p: number) => setMorePage(p);

  return (
    <>
      <BreadcrumbSchema items={data.breadcrumbs} />
      <FaqSchema
        items={data.faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <TouristDestinationSchema
        name={`${countryLabel} — National Parks & Wildlife Reserves`}
        description={data.hero.description}
        url={`${APP_URL}/destinations/${slug}`}
        image={data.hero.image}
        countryCode={countryCode}
        highlights={data.featureParks.map((p) => p.name)}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}

      <TitleHero
        eyebrow={countryLabel}
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.image}
      />

      <section id={`${slug}-why`} className="container-site ">
        <div className="items-center">
          {/* Staggered image pair */}

          {/* Text */}
          <Reveal variant="fadeUp" delay={0.1}>
            <div className="eyebrow mb-5">
              <span className="dot" />
              {data.why.eyebrow}
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-bone-ink mb-5"
              style={{ fontSize: "clamp(32px, 3.8vw, 54px)" }}
            >
              {data.why.heading}
            </h2>
            <p className="text-bone-ink/65 text-base leading-relaxed mb-7">
              {data.why.description}
            </p>
            <ul className="space-y-4">
              {data.why.reasons.map((r) => (
                <li
                  key={r.n}
                  className="flex items-start gap-4 border-b border-[var(--line-soft)] pb-2"
                >
                  <span className="w-7 h-7 italic text-bone-clay font-serif flex items-center justify-center flex-shrink-0 mt-0.5">
                    {r.n}
                  </span>
                  <span className="text-sm text-bone-ink/70 leading-relaxed">
                    <strong className="text-bone-ink">{r.title}</strong>{" "}
                    {r.desc}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Main layout: desktop sidebar + content column ─────────────── */}
      <div className="container-site">
        <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
          {/* Desktop: sticky sidebar panel (lg+) */}

          {/* Content column */}
          <main className="flex-1 min-w-0 py-20 sm:py-28">
            {/* ── Why [Country] ───────────────────────────────────────── */}

            {/* ── Feature parks ───────────────────────────────────────── */}
            <section
              id={`${slug}-featured-parks`}
              className="py-20 sm:py-28 bg-bone-bg scroll-mt-[90px]"
            >
              <Reveal>
                <div className="section-hd">
                  <div>
                    <div className="eyebrow mb-4">
                      <span className="dot" />
                      {data.featureParksHeader.eyebrow}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                      style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                    >
                      {t("whatMakesSpecial")}
                    </h2>
                  </div>
                  <p className="text-bone-muted text-sm leading-relaxed">
                    {data.featureParksHeader.description}
                  </p>
                </div>
              </Reveal>

              <Reveal variant="fadeUp" delay={0.1}>
                <FeatureParkCarousel parks={data.featureParks} />
              </Reveal>
            </section>

            {/* ── More parks ──────────────────────────────────────────── */}
            <section
              ref={moreSectionRef}
              id={`${slug}-more-parks`}
              className="py-20 sm:py-28 bg-bone-paper scroll-mt-[90px]"
            >
              <div className="container-site">
                <Reveal>
                  <div className="section-hd">
                    <div>
                      <div className="eyebrow mb-4">
                        <span className="dot" />
                        {data.moreParksHeader.eyebrow}
                      </div>
                      <h2
                        className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                        style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                      >
                        {data.moreParksHeader.heading}
                      </h2>
                    </div>
                    <p className="text-bone-muted text-sm leading-relaxed">
                      {data.moreParksHeader.description}
                    </p>
                  </div>
                </Reveal>

                {/* AnimatePresence keyed on morePage: old grid exits, new grid
                    enters. Each card uses animate (not whileInView) so cards
                    are never stuck at opacity:0 after pagination. */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={morePage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`grid gap-5 ${data.moreParksGridCols ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
                  >
                    {visibleMoreParks.map((park, i) => (
                      <motion.div
                        key={park.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full"
                      >
                        <Link href={park.href} className="h-full block">
                          <article
                            id={park.id}
                            className="group flex h-full scroll-mt-[90px] flex-col border border-[var(--line)] bg-[var(--bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <OptimizedImage
                                src={park.image}
                                alt={park.name}
                                fill
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                              {park.tag && (
                                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--clay)]">
                                  {park.tag}
                                </div>
                              )}
                              <h3 className="mb-2 font-serif text-xl font-normal leading-[1.1] tracking-[-0.01em]">
                                {park.name}{" "}
                                {park.subtitle && (
                                  <em className="italic text-[var(--clay)]">
                                    {park.subtitle}
                                  </em>
                                )}
                              </h3>
                              <p className="mb-3 text-[13px] leading-relaxed text-[var(--muted)] line-clamp-3">
                                {park.desc}
                              </p>
                              {park.highlights.length > 0 && (
                                <ul className="mb-3 list-none">
                                  {park.highlights.slice(0, 3).map((h) => (
                                    <li
                                      key={h}
                                      className="relative py-[4px] pl-[16px] text-[12px] leading-snug text-[var(--ink)] before:absolute before:left-[3px] before:font-bold before:text-[var(--clay)] before:content-['·']"
                                    >
                                      {h}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <div className="mt-auto border-t border-[var(--line)] pt-3 flex items-center justify-between gap-3">
                                {park.bestFor ? (
                                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)] truncate">
                                    Best for ·{" "}
                                    <b className="font-medium text-[var(--forest)]">
                                      {park.bestFor}
                                    </b>
                                  </span>
                                ) : (
                                  <span />
                                )}
                                <span className="shrink-0 inline-flex items-center gap-1 border border-[var(--line)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)] transition-all duration-200 group-hover:border-[var(--clay)] group-hover:text-[var(--clay)]">
                                  View <ChevronRight size={9} strokeWidth={2} />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <Pagination
                  page={morePage}
                  totalPages={moreParksTotalPages}
                  total={data.moreParks.length}
                  limit={MORE_PARKS_PAGE_SIZE}
                  onPageChange={handleMorePageChange}
                  itemLabel="park"
                />
              </div>
            </section>

            {/* ── How to choose ───────────────────────────────────────── */}
            <section
              id={`${slug}-choose`}
              className="bg-[var(--bg)] py-[76px] xl:py-[120px]"
            >
              <Reveal>
                <div className="section-hd">
                  <div>
                    <div className="eyebrow">
                      <span className="dot" />
                      {t("howToChoose")}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                      style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                    >
                      {t("tellUsAfter")}
                    </h2>
                  </div>
                  <p className="text-bone-muted text-sm leading-relaxed">
                    {data.howToChooseDescription}
                  </p>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-4">
                {data.howToChoose.map((item) => (
                  <RevealItem
                    key={item.want}
                    className="bg-[var(--bg)] px-[26px] py-[30px] transition-colors duration-200 hover:bg-[var(--paper)]"
                  >
                    <div className="mb-[12px] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {item.want}
                    </div>
                    <div className="font-serif text-[26px] leading-[1.1] tracking-[-0.01em]">
                      <em className="italic text-[var(--clay)]">{item.go}</em>
                    </div>
                  </RevealItem>
                ))}
              </Stagger>
            </section>

            {/* ── Best time ───────────────────────────────────────────── */}
            <section
              id={`${slug}-besttime`}
              className="py-20 sm:py-28 bg-bone-forest text-bone-paper"
            >
              <div className="container-site">
                <Reveal variant="fadeUp">
                  <div className="section-hd">
                    <div>
                      <div
                        className="eyebrow"
                        style={{ color: "rgba(244,239,226,0.55)" }}
                      >
                        <span className="dot" />
                        {t("bestTimeToVisit")}
                      </div>
                      <h2
                        className="font-serif font-normal leading-none tracking-[-0.02em] mt-4"
                        style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                      >
                        {data.bestTime.heading}
                      </h2>
                    </div>
                    <p className="text-bone-paper/65 text-sm leading-relaxed">
                      {data.bestTime.description}
                    </p>
                  </div>
                </Reveal>

                <Stagger
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  stagger={0.12}
                >
                  {data.bestTime.seasons.map((s) => (
                    <RevealItem
                      key={s.badge}
                      className="p-[40px] border border-bone-paper/15"
                    >
                      <div className="text-xs font-mono uppercase tracking-[0.12em] text-bone-paper/55 mb-4 inline-block">
                        {s.badge}
                      </div>
                      <h3
                        className="font-serif text-2xl sm:text-4xl leading-tight mb-5"
                        style={{ color: "#f4d4a8" }}
                      >
                        {s.title}
                      </h3>
                      <ul className="space-y-2.5 list-none">
                        {s.items.map((item) => (
                          <li
                            key={item}
                            className="relative pl-[22px] py-[12px] border-t border-[rgba(250,246,236,0.14)] text-[rgba(250,246,236,0.82)] text-sm leading-[1.5] before:content-['›'] before:absolute before:left-[2px] before:text-[#f4d4a8]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </RevealItem>
                  ))}
                </Stagger>
              </div>
            </section>

            {/* ── Safari packages ─────────────────────────────────────── */}
            <section
              id={`${slug}-packages`}
              className="py-20 sm:py-28 bg-bone-bg"
            >
              <Reveal>
                <div className="section-hd">
                  <div>
                    <div className="eyebrow mb-4">
                      <span className="dot" />
                      {data.packagesHeader.eyebrow}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                      style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                    >
                      {data.packagesHeader.heading}
                    </h2>
                  </div>
                  <p className="text-bone-muted text-sm leading-relaxed">
                    {data.packagesHeader.description}
                  </p>
                </div>
              </Reveal>

              {data?.packages && data.packages.length > 0 ? (
                <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.packages.map((pkg, i) => (
                    <RevealItem key={pkg.name}>
                      <PkgCard key={String(pkg._id)} safari={pkg} index={i} />
                    </RevealItem>
                  ))}
                </Stagger>
              ) : (
                <p className="text-sm text-bone-muted py-4">
                  No packages are tagged yet — contact us for a personalised
                  itinerary.
                </p>
              )}

              {data.packages.length > 4 && (
                <div className="mt-10 text-center">
                  <Link
                    href={data.packagesHref}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-bone-ink/20 text-bone-ink rounded-full text-sm font-sans hover:bg-bone-paper hover:border-bone-clay hover:text-bone-clay transition-colors"
                  >
                    {data.packagesLinkText}
                  </Link>
                </div>
              )}
            </section>

            {/* ── FAQ ─────────────────────────────────────────────────── */}
            <section
              id={`${slug}-faq`}
              className="py-20 sm:py-28 bg-bone-paper"
            >
              <div className="container-site">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16">
                  <Reveal variant="fadeUp">
                    <div className="eyebrow mb-4">
                      <span className="dot" />
                      {data.faqHeader.eyebrow}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                      style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
                    >
                      {data.faqHeader.heading}
                    </h2>
                    <p className="text-bone-muted text-sm leading-relaxed mt-5">
                      {t("callUs")}{" "}
                      <a
                        href="tel:+254722595916"
                        className="text-bone-clay hover:underline"
                      >
                        +254 722-595-916
                      </a>{" "}
                      — we pick up.
                    </p>
                  </Reveal>
                  <Reveal variant="fadeUp" delay={0.1}>
                    <FaqAccordion faqs={data.faqs} />
                  </Reveal>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
