"use client";

import { useState, useEffect } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PkgCard from "@/components/safaris/PkgCard";
import { type HeroStat } from "@/components/ui/PageHero";
import { type JumpNavLink } from "@/components/ui/JumpNav";
import WhyGrid, { type WhyItem } from "@/components/ui/WhyGrid";
import ChooseGrid, { type ChooseCell } from "@/components/ui/ChooseGrid";
import SectionFaq from "@/components/ui/SectionFaq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import type { Safari } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import TitleHero from "../ui/TitleHero";

export interface Season {
  badge: string;
  title: React.ReactNode;
  points: string[];
}

export interface TailorPoint {
  ic: string;
  b: string;
  s: string;
}

export interface LodgeItem {
  name: string;
  stars: number; // 3 | 4 | 5
}

export interface LodgeTier {
  label: string; // "Budget options"
  fromPrice: string; // "From $380 / person"
  lodges: LodgeItem[];
}

export interface LodgeSection {
  eyebrow?: string;
  heading: React.ReactNode;
  description: string;
  tiers: LodgeTier[];
}

export interface CountrySafariPageConfig {
  packagesId: string;
  idPrefix: string;
  countryName: string;

  hero: {
    image: string;
    imageAlt: string;
    breadcrumbs: { label: string; href?: string }[];
    title: string;
    description: string;
    stats: HeroStat[];
  };

  packages: {
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
    ctaText: string;
  };

  jumpLinks: JumpNavLink[];

  choose: {
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
    cells: ChooseCell[];
    ctaText: string;
    ctaHref: string;
  };

  why: {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: string;
    items: WhyItem[];
  };

  bestTime: {
    intro: string;
    seasons: Season[];
  };

  tailor: {
    eyebrow: string;
    description: string;
    points: TailorPoint[];
    image: string;
    imageAlt: string;
  };

  faq: {
    eyebrow: string;
    heading?: React.ReactNode;
    items: { q: string; a: string }[];
    contactNote: React.ReactNode;
  };

  cta: {
    heading: React.ReactNode;
    description: string;
    buttonText: string;
  };

  lodges?: LodgeSection;
}

interface Props extends CountrySafariPageConfig {
  safaris: Safari[];
}

export const NAV_H = 57;

export default function CountrySafariPage({
  packagesId,
  idPrefix,
  countryName,
  hero,
  packages,
  jumpLinks,
  choose,
  why,
  bestTime,
  tailor,
  faq,
  cta,
  lodges,
  safaris,
}: Props) {
  const t = useTranslations("common.ui.safariPage");
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
      <TitleHero
        eyebrow="Safari Tours"
        title={hero.title}
        description={hero.description}
        backgroundImage={hero.image}
      />
      {/* <PageHero
        image={hero.image}
        imageAlt={hero.imageAlt}
        breadcrumbs={hero.breadcrumbs}
        title={hero.title}
        description={hero.description}
        stats={hero.stats}
      /> */}

      {/* ── Packages section ──────────────────────────────────────────── */}
      <section
        id={packagesId}
        style={{
          padding: "clamp(48px, 6.5vw, 96px) 0",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="section-hd">
              <div>
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {packages.eyebrow}
                </div>
                <h2
                  className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                  style={{ fontSize: "clamp(36px, 4.8vw, 68px)" }}
                >
                  {packages.heading}
                </h2>
              </div>
              <p
                className="text-sm leading-[1.65] text-bone-muted"
                style={{ maxWidth: "56ch" }}
              >
                {packages.description}
              </p>
            </div>

            {safaris.length === 0 ? (
              <p className="text-sm text-bone-muted py-8">
                No {countryName} safari packages found — check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {safaris.map((safari, i) => (
                  <PkgCard key={String(safari._id)} safari={safari} index={i} />
                ))}
              </div>
            )}

            <div className="mt-14 text-center">
              <Link href="/contact" className="btn-forest">
                {packages.ctaText}
              </Link>
            </div>

            {/* ── Lodge listing section ──────────────────────────────── */}
            {lodges && (
              <section
                id={`${idPrefix}-lodges`}
                style={{
                  padding: "96px 0",
                  borderTop: "1px solid rgba(31,29,24,0.14)",
                  background: "var(--paper)",
                }}
              >
                <Reveal>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    {lodges.eyebrow ?? "Where you will stay"}
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                    style={{ fontSize: "clamp(36px, 4.8vw, 64px)" }}
                  >
                    {lodges.heading}
                  </h2>
                  <p
                    className="text-sm leading-[1.65] text-bone-muted mb-12"
                    style={{ maxWidth: "56ch" }}
                  >
                    {lodges.description}
                  </p>
                </Reveal>

                <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-7">
                  {lodges.tiers.map((tier) => (
                    <RevealItem key={tier.label}>
                      <div
                        style={{
                          padding: "28px",
                          background: "var(--bg)",
                          border: "1px solid rgba(31,29,24,0.14)",
                        }}
                      >
                        <h3
                          className="font-serif font-normal leading-tight mb-1"
                          style={{ fontSize: "26px" }}
                        >
                          {tier.label.split(" ").slice(0, -1).join(" ")}{" "}
                          <em
                            className="italic"
                            style={{ color: "var(--clay)" }}
                          >
                            {tier.label.split(" ").slice(-1)[0]}
                          </em>
                        </h3>
                        <div
                          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5"
                          style={{ color: "var(--muted)" }}
                        >
                          {tier.fromPrice}
                        </div>
                        <ul>
                          {tier.lodges.map((lodge, i) => (
                            <li
                              key={lodge.name}
                              className="flex justify-between items-baseline text-[14px]"
                              style={{
                                padding: "12px 0",
                                borderTop:
                                  i === 0
                                    ? "none"
                                    : "1px solid rgba(31,29,24,0.14)",
                              }}
                            >
                              <span>{lodge.name}</span>
                              <span
                                className="font-mono text-[11px] ml-3 flex-shrink-0"
                                style={{ color: "var(--clay)" }}
                              >
                                {"★".repeat(lodge.stars)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </RevealItem>
                  ))}
                </Stagger>
              </section>
            )}

            <ChooseGrid
              id={`${idPrefix}-destinations`}
              eyebrow={choose.eyebrow}
              heading={choose.heading}
              description={choose.description}
              cells={choose.cells}
              actions={
                <div className="mt-12">
                  <Link href={choose.ctaHref} className="btn-forest">
                    {choose.ctaText}
                  </Link>
                </div>
              }
            />

            <WhyGrid
              id={`${idPrefix}-why`}
              eyebrow={why.eyebrow ?? "Why choose our packages"}
              heading={
                why.heading ?? (
                  <>
                    The <em className="italic text-bone-clay">divine</em>
                    <br />
                    touch.
                  </>
                )
              }
              description={
                why.description ??
                "Every safari includes our signature attention to detail — and the practical things that actually make a trip run smoothly, before, during and after you travel."
              }
              items={why.items}
            />

            {/* Best time to visit */}
            <section
              id={`${idPrefix}-besttime`}
              className="bg-bone-forest text-bone-paper"
              style={{ padding: "clamp(56px, 8vw, 120px) 0" }}
            >
              <div className="container-site">
                <div className="section-hd">
                  <div>
                    <div
                      className="eyebrow mb-4"
                      style={{ color: "rgba(244,239,226,0.6)" }}
                    >
                      <span className="dot" />
                      {t("bestTimeToVisit")}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] mt-4"
                      style={{
                        fontSize: "clamp(40px, 5.4vw, 76px)",
                        color: "var(--paper, #faf6ec)",
                      }}
                    >
                      {t("whenToGo")}
                    </h2>
                  </div>
                  <p
                    className="text-sm leading-[1.65]"
                    style={{
                      color: "rgba(244,239,226,0.62)",
                      maxWidth: "56ch",
                    }}
                  >
                    {bestTime.intro}
                  </p>
                </div>
                <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                  {bestTime.seasons.map((s, i) => (
                    <RevealItem key={i}>
                      <div
                        style={{
                          padding: "40px",
                          border: "1px solid rgba(244,239,226,0.22)",
                        }}
                      >
                        <div
                          className="font-mono text-[10px] uppercase tracking-[0.16em] mb-4"
                          style={{ color: "#f4d4a8" }}
                        >
                          {s.badge}
                        </div>
                        <h3
                          className="font-serif font-normal leading-none mb-5"
                          style={{ fontSize: "40px" }}
                        >
                          {s.title}
                        </h3>
                        <ul>
                          {s.points.map((p) => (
                            <li
                              key={p}
                              className="py-3 pl-6 relative"
                              style={{
                                borderTop: "1px solid rgba(244,239,226,0.14)",
                                color: "rgba(244,239,226,0.82)",
                                fontSize: "15px",
                                lineHeight: "1.5",
                              }}
                            >
                              <span
                                className="absolute left-0.5 top-3.5"
                                style={{ color: "#f4d4a8" }}
                              >
                                ›
                              </span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </RevealItem>
                  ))}
                </Stagger>
              </div>
            </section>

            {/* Tailor-made */}
            <section
              id={`${idPrefix}-tailor`}
              className="bg-bone-bg"
              style={{ padding: "clamp(64px, 9vw, 140px) 0" }}
            >
              <div className="container-site">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
                <Reveal variant="fadeUp">
                  <div>
                    <div className="eyebrow mb-4">
                      <span className="dot" />
                      {tailor.eyebrow}
                    </div>
                    <h2
                      className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                      style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                    >
                      {t("everyTravellerDifferent")}
                    </h2>
                    <p
                      className="text-[16px] leading-[1.65] text-bone-muted mb-8"
                      style={{ maxWidth: "48ch" }}
                    >
                      {tailor.description}
                    </p>
                    <ul>
                      {tailor.points.map((t) => (
                        <li
                          key={t.ic}
                          className="py-4 grid items-center gap-3.5"
                          style={{
                            borderTop: "1px solid rgba(31,29,24,0.14)",
                            gridTemplateColumns: "32px 1fr",
                          }}
                        >
                          <div className="font-serif italic text-[18px] text-bone-clay">
                            {t.ic}
                          </div>
                          <div>
                            <strong className="font-medium text-sm text-bone-ink">
                              {t.b}
                            </strong>{" "}
                            <span className="text-[13px] text-bone-muted">
                              · {t.s}
                            </span>
                          </div>
                        </li>
                      ))}
                      <li
                        style={{
                          borderTop: "1px solid rgba(31,29,24,0.14)",
                          borderBottom: "1px solid rgba(31,29,24,0.14)",
                        }}
                      />
                    </ul>
                    <Link
                      href="/contact"
                      className="btn-forest inline-flex items-center gap-3 mt-8"
                    >
                      {t("chatWithExpert")}
                    </Link>
                  </div>
                </Reveal>
                <Reveal variant="fadeUp" delay={0.1}>
                  <div
                    className="overflow-hidden"
                    style={{ aspectRatio: "5/6" }}
                  >
                    <OptimizedImage
                      src={tailor.image}
                      alt={tailor.imageAlt}
                      width={900}
                      height={1080}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Reveal>
              </div>
              </div>
            </section>

            <SectionFaq
              id={`${idPrefix}-faq`}
              eyebrow={faq.eyebrow}
              heading={
                faq.heading ?? (
                  <>
                    Before you <em className="italic text-bone-clay">book</em>.
                  </>
                )
              }
              contactNote={faq.contactNote}
              faqs={faq.items}
            />
          </div>
        </div>
      </section>

      {/* ── Mobile slide-in drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop — full viewport */}
            <motion.div
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.45)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel — full height */}
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
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--line-soft)" }}
              >
                <span className="font-serif text-[clamp(18px,5vw,24px)] uppercase tracking-[0.18em]">
                  {t("onThisPage")}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--line)]"
                  style={{ color: "var(--muted)" }}
                  aria-label={t("closeNav")}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Navigation links */}
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
