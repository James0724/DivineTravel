"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { NAV_H } from "@/components/safaris/CountrySafariPage";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FeaturePark {
  id: string;
  num: string;
  name: string;
  subtitle: string;
  tag: string;
  image: string;
  desc: string;
  highlights: string[];
  bestFor: string;
  flip: boolean;
}

export interface CompactPark {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  image: string;
  desc: string;
  highlights: string[];
  bestFor: string;
}

export interface SafariPkg {
  img: string;
  tag: string;
  name: string;
  desc: string;
  parks: string[];
  from: string;
  days: string;
}

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
    title: React.ReactNode;
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

  packages: SafariPkg[];
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
      ...data.featureParks.map((p) => ({ label: p.name, href: `#${p.id}` })),
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
      <PageHero
        image={data.hero.image}
        imageAlt={data.hero.imageAlt}
        minHeight="min-h-[75vh]"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: `/destinations/${slug}` },
          { label: `${countryLabel} · Wildlife Parks` },
        ]}
        title={data.hero.title}
        description={data.hero.description}
        stats={data.hero.stats}
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

      {/* ── Main layout: desktop sidebar + content column ─────────────── */}
      <div className="container-site">
        <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
          {/* Desktop: sticky sidebar panel (lg+) */}
          <aside
            className="hidden lg:block flex-shrink-0 sticky pm-20 sm:my-28"
            style={{ top: "90px", width: "220px" }}
          >
            <div
              className="flex flex-col border rounded-sm"
              style={{ background: "var(--paper)", borderColor: "var(--line)" }}
            >
              <div className="px-4 py-4">
                <JumpNav label="Page Sections" links={jumpLinks} vertical />
              </div>
            </div>
          </aside>

          {/* Content column */}
          <main className="flex-1 min-w-0 py-20 sm:py-28">
            {/* ── Why [Country] ───────────────────────────────────────── */}
            <section id={`${slug}-why`} className=" bg-bone-bg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 items-center">
                {/* Staggered image pair */}
                <Reveal variant="fadeUp">
                  <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
                    <Image
                      src={data.why.images[1].src}
                      alt={data.why.images[1].alt}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  {/* <div className="relative aspect-[4/5] rounded-sm overflow-hidden mt-8">
                      <Image
                        src={data.why.images[1].src}
                        alt={data.why.images[1].alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div> */}
                </Reveal>

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

            {/* ── Feature parks ───────────────────────────────────────── */}
            <section className="py-20 sm:py-28 bg-bone-bg">
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
                  <p className="text-bone-muted text-[15px] leading-relaxed">
                    {data.featureParksHeader.description}
                  </p>
                </div>
              </Reveal>

              <div className=" space-y-20">
                {data.featureParks.map((park, i) => {
                  const flip = i % 2 !== 0;
                  return (
                    <article
                      key={park.id}
                      id={park.id}
                      className="scroll-mt-[90px] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center"
                    >
                      {/* Image — always first in DOM (mobile stays image→content);
                            on lg odd parks: pushed right via order-last */}
                      <div className={flip ? "md:order-last" : undefined}>
                        <Reveal variant="fadeUp">
                          <div className="relative aspect-[4/5] overflow-hidden group bg-[var(--bg-deep)]">
                            <Image
                              src={park.image}
                              alt={park.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                            />
                            <div className="absolute left-[22px] top-[22px] bg-bone-paper px-[16px] py-[10px] font-mono text-[10px] uppercase tracking-[0.18em] border border-bone-clay-soft">
                              {park.num} ·{" "}
                              <b className="font-medium text-bone-clay">
                                {park.name}
                              </b>
                            </div>
                          </div>
                        </Reveal>
                      </div>

                      {/* Content — always second in DOM; on lg odd parks: sits in left column */}
                      <Reveal
                        variant="fadeUp"
                        delay={0.1}
                      >
                        <div>
                          <div className="text-xs font-mono uppercase tracking-[0.14em] text-bone-clay mb-3">
                            {park.tag}
                          </div>
                          <h3 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.1] text-bone-ink mb-4">
                            {park.name}{" "}
                            <em className="italic">{park.subtitle}</em>
                          </h3>
                          <p className="text-bone-ink/65 text-[15px] leading-relaxed mb-5">
                            {park.desc}
                          </p>
                          <ul className="list-none mb-[26px]">
                            {park.highlights.map((h) => (
                              <li
                                key={h}
                                className="relative border-b border-[var(--line-soft)] py-[9px] pl-[22px] text-[15px] text-bone-ink/70 before:absolute before:left-[2px] before:content-['›'] before:text-bone-clay"
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                          <div className="inline-flex items-center gap-[10px] rounded-full border border-[var(--line)] bg-bone-paper px-[16px] py-[9px] text-[13px]">
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                              Best for
                            </span>
                            <b className="font-serif text-[16px] font-medium italic text-bone-clay">
                              {park.bestFor}
                            </b>
                          </div>
                        </div>
                      </Reveal>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── More parks ──────────────────────────────────────────── */}
            <section className="py-20 sm:py-28 bg-bone-paper">
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
                    <p className="text-bone-muted text-[15px] leading-relaxed">
                      {data.moreParksHeader.description}
                    </p>
                  </div>
                </Reveal>

                <Stagger
                  className={`grid gap-[28px] ${data.moreParksGridCols ?? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}
                >
                  {data.moreParks.map((park) => (
                    <RevealItem key={park.id} variant="scaleUp">
                      <article
                        id={park.id}
                        className="group flex scroll-mt-[90px] flex-col border border-[var(--line)] bg-[var(--bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
                      >
                        <div className="relative aspect-[16/11] overflow-hidden">
                          <Image
                            src={park.image}
                            alt={park.name}
                            fill
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-1 flex-col px-[24px] pt-[24px] pb-[26px]">
                          <div className="mb-[10px] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--clay)]">
                            {park.tag}
                          </div>
                          <h3 className="mb-[10px] font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.01em]">
                            {park.name}{" "}
                            <em className="italic text-[var(--clay)]">
                              {park.subtitle}
                            </em>
                          </h3>
                          <p className="mb-[16px] text-[14px] leading-[1.55] text-[var(--muted)]">
                            {park.desc}
                          </p>
                          <ul className="mb-[18px] list-none">
                            {park.highlights.map((h) => (
                              <li
                                key={h}
                                className="relative py-[5px] pl-[16px] text-[13px] text-[var(--ink)] before:absolute before:left-[3px] before:font-bold before:text-[var(--clay)] before:content-['·']"
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-auto border-t border-[var(--line)] pt-[14px] font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                            Best for ·{" "}
                            <b className="font-medium text-[var(--forest)]">
                              {park.bestFor}
                            </b>
                          </div>
                        </div>
                      </article>
                    </RevealItem>
                  ))}
                </Stagger>
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
                  <p className="text-bone-muted text-[15px] leading-relaxed">
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
                    <p className="text-bone-paper/65 text-[15px] leading-relaxed">
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
                            className="relative pl-[22px] py-[12px] border-t border-[rgba(250,246,236,0.14)] text-[rgba(250,246,236,0.82)] text-[15px] leading-[1.5] before:content-['›'] before:absolute before:left-[2px] before:text-[#f4d4a8]"
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
                  <p className="text-bone-muted text-[15px] leading-relaxed">
                    {data.packagesHeader.description}
                  </p>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.packages.map((pkg) => (
                  <RevealItem key={pkg.name}>
                    <Link
                      href={data.packagesHref}
                      className="group flex flex-col bg-bone-paper border border-[rgba(23,22,18,0.09)] rounded-sm overflow-hidden hover:shadow-md transition-shadow h-full"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={pkg.img}
                          alt={pkg.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-mono uppercase tracking-[0.12em] bg-bone-clay text-bone-paper px-2 py-1 rounded">
                            {pkg.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-serif text-xl leading-tight text-bone-ink mb-2 group-hover:text-bone-clay transition-colors">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-bone-ink/60 leading-relaxed mb-3 flex-1">
                          {pkg.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {pkg.parks.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] font-sans bg-bone-bg border border-[rgba(23,22,18,0.12)] text-bone-muted px-2 py-0.5 rounded"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(23,22,18,0.08)]">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-bone-muted">
                              From{" "}
                            </span>
                            <span className="font-serif text-xl text-bone-ink">
                              {pkg.from}
                            </span>
                          </div>
                          <span className="text-xs text-bone-muted font-mono">
                            {pkg.days}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealItem>
                ))}
              </Stagger>

              <div className="mt-10 text-center">
                <Link
                  href={data.packagesHref}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-bone-ink/20 text-bone-ink rounded-full text-sm font-sans hover:bg-bone-paper hover:border-bone-clay hover:text-bone-clay transition-colors"
                >
                  {data.packagesLinkText}
                </Link>
              </div>
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
