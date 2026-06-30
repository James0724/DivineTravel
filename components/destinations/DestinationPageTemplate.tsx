"use client";

import { useState, useEffect, useMemo } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { X, AlignJustify } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BreadcrumbSchema,
  FaqSchema,
  TouristDestinationSchema,
} from "@/components/seo/StructuredData";
import PageHero, { type HeroStat } from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JumpNav from "@/components/ui/JumpNav";
import Price from "@/components/ui/Price";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { NAV_H } from "@/components/safaris/CountrySafariPage";
import { cn } from "@/lib/utils";
import TitleHero from "../ui/TitleHero";
import { destinationKeys } from "@/hooks/useDestinations";
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
  const slug = data.hero.slug;
  const countryLabel = slug.charAt(0).toUpperCase() + slug.slice(1);
  const countryCode = COUNTRY_CODES[slug] ?? slug.toUpperCase().slice(0, 2);

  const jumpLinks = useMemo(
    () => [
      { label: `Why ${countryLabel}`, href: `#${slug}-why` },
      ...(data.featureParks.length
        ? [{ label: "Top parks", href: `#${slug}-featured-parks` }]
        : []),
      ...data.moreParks.map((p) => ({ label: p.name, href: `#${p.id}` })),
      { label: "How to choose", href: `#${slug}-choose` },
      { label: "Best time", href: `#${slug}-besttime` },
      { label: "Safari packages", href: `#${slug}-packages` },
      { label: "FAQ", href: `#${slug}-faq` },
    ],
    [data.featureParks, data.moreParks, slug, countryLabel],
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  const MORE_PARKS_PAGE_SIZE = 10;
  const [morePage, setMorePage] = useState(1);
  const moreParksTotalPages = Math.ceil(
    data.moreParks.length / MORE_PARKS_PAGE_SIZE,
  );
  const visibleMoreParks = data.moreParks.slice(
    (morePage - 1) * MORE_PARKS_PAGE_SIZE,
    morePage * MORE_PARKS_PAGE_SIZE,
  );
  const handleMorePageChange = (p: number) => {
    setMorePage(p);
    document
      .getElementById(`${slug}-more-parks`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const ids = jumpLinks.map((l) => l.href.replace("#", ""));
    const getActive = () => {
      const threshold = window.innerHeight * 0.35;
      let active = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) active = id;
      }
      setActiveId(active);
    };
    window.addEventListener("scroll", getActive, { passive: true });
    getActive();
    return () => window.removeEventListener("scroll", getActive);
  }, [jumpLinks]);

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

      {/* Mobile: sticky trigger bar (< lg) */}
      <div
        className="lg:hidden sticky z-20 flex items-center justify-end px-4 py-3"
        style={{ top: `${NAV_H - 1}px` }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="bg-bone-bg flex items-center gap-1.5 px-3 py-1.5 border rounded-full font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 hover:border-[var(--forest)] hover:text-[var(--forest)]"
          style={{ borderColor: "rgba(31,29,24,0.14)", color: "var(--muted)" }}
        >
          <AlignJustify size={11} /> Page Sections
        </button>
      </div>

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
                      What makes
                      <br />
                      each one{" "}
                      <em className="italic text-bone-clay">special</em>.
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

                <Stagger
                  className={`grid gap-5 ${data.moreParksGridCols ?? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}
                >
                  {visibleMoreParks.map((park) => (
                    <RevealItem key={park.id} variant="scaleUp" className="h-full">
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
                          {park.bestFor && (
                            <div className="mt-auto border-t border-[var(--line)] pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                              Best for ·{" "}
                              <b className="font-medium text-[var(--forest)]">
                                {park.bestFor}
                              </b>
                            </div>
                          )}
                        </div>
                      </article>
                    </RevealItem>
                  ))}
                </Stagger>

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
                      How to choose
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                      style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
                    >
                      Tell us what
                      <br />
                      you&apos;re{" "}
                      <em className="italic text-bone-clay">after</em>.
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
                        Best time to visit
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
                      Call us at{" "}
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

      {/* ── Mobile slide-in drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.45)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col border-r"
              style={{
                width: "min(320px, 90vw)",
                background: "var(--paper)",
                borderColor: "var(--line)",
                overflowY: "auto",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <div
                className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--line-soft)" }}
              >
                <span className="font-serif text-[clamp(18px,5vw,24px)] uppercase tracking-[0.18em]">
                  On this page
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--line)]"
                  style={{ color: "var(--muted)" }}
                  aria-label="Close navigation"
                >
                  <X size={15} />
                </button>
              </div>

              <nav className="px-3 py-3 flex-1">
                <ul className="flex flex-col gap-0.5">
                  {jumpLinks.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between w-full py-[15px] border-b border-[rgba(23,22,18,0.07)]",
                          "font-serif font-light leading-[1.1] transition-colors duration-300",
                          "text-[clamp(26px,7vw,36px)]",
                          activeId === l.href.replace("#", "")
                            ? "text-bone-clay"
                            : "text-bone-ink hover:text-bone-clay",
                        )}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
