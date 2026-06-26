"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  ChevronUp,
  Facebook,
  Instagram,
  Youtube,
  Landmark,
  X,
} from "lucide-react";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";
import CurrencySwitcher from "@/components/ui/CurrencySwitcher";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import type { ContactSettings } from "@/lib/getSiteSettings";

/* ── Brand icons not covered by lucide-react ─────────────────────────── */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.15-1.65-.8-1.9-.9-.25-.1-.45-.15-.6.15-.2.3-.7.9-.85 1.05-.15.15-.3.2-.55.05-1.5-.75-2.5-1.35-3.5-3.05-.25-.45.25-.4.7-1.35.1-.2.05-.35-.05-.5-.1-.15-.55-1.3-.75-1.8-.2-.45-.4-.4-.6-.4-.15 0-.4 0-.6 0-.2 0-.55.1-.8.4-.3.35-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.25 3.2.15.2 2.05 3.25 5.1 4.4 2.55 1 2.55.65 3.05.6.5-.05 1.65-.65 1.9-1.3.25-.65.25-1.2.15-1.3-.1-.1-.4-.2-.85-.4z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.55 3.7 1.5 5.2L2 22l4.95-1.45C8.4 21.45 10.15 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.15c-1.65 0-3.2-.45-4.55-1.3l-.3-.2-3.05.9.9-2.95-.2-.3c-.95-1.4-1.45-3.05-1.45-4.8 0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
    </svg>
  );
}

function TripAdvisorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12.006 19.7l1.928-2.088a5.976 5.976 0 0 0 4.075 1.6 5.997 5.997 0 0 0 4.04-10.43L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM6.01 9.34a3.998 3.998 0 1 1 0 7.997 3.998 3.998 0 0 1 0-7.997zm11.994 0a3.998 3.998 0 1 1 0 7.997 3.998 3.998 0 0 1 0-7.997zM6.01 11.6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11.994 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Payment wordmarks — placeholder badges, swap for verified processors ── */

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 152 108" className={className} aria-hidden="true">
      <circle cx="52" cy="54" r="44" fill="#EB001B" />
      <circle cx="100" cy="54" r="44" fill="#F79E1B" />
      <path
        d="M76 17.8a43.9 43.9 0 0 1 0 72.4 43.9 43.9 0 0 1 0-72.4z"
        fill="#FF5F00"
      />
    </svg>
  );
}

/* ── Accreditation badges ─────────────────────────────────────────────── */

type CertKey = "kato" | "tra";

const ACCREDITATIONS: {
  key: CertKey;
  logo: string;
  nameKey: string;
  certImage: string;
}[] = [
  {
    key: "kato",
    logo: "/logos/kato.png",
    nameKey: "katoName",
    certImage: "/documents/DIVINE-TRAVEL-NEST-KATO-CERT.jpg",
  },
  {
    key: "tra",
    logo: "/logos/tra.png",
    nameKey: "traName",
    certImage: "/documents/divine-tra-licence-2025.jpg",
  },
];

const PAYMENT_MARKS = [
  {
    label: "VISA",
    logo: "/images/Visa_Inc.-Logo.png",
    width: 2308,
    height: 746,
  },
  {
    label: "PayPal",
    logo: "/images/PayPal-Logo.png",
    width: 2308,
    height: 564,
  },
  {
    label: "Pesapal",
    logo: "/images/pesapal-logo.png",
    width: 772,
    height: 204,
  },
  { label: "M-PESA", logo: "/images/M-PESA.png", width: 3645, height: 1327 },
  {
    label: "MasterCard",
    logo: "/images/Mastercard-Logo.png",
    width: 2158,
    height: 1334,
  },
];

/* ── Column link config ───────────────────────────────────────────────── */

interface ColumnLink {
  key: string;
  href: string;
}

const TOUR_LINKS: ColumnLink[] = [
  { key: "kenya", href: "/safaris/kenya" },
  { key: "tanzania", href: "/safaris/tanzania" },
  { key: "crossCountry", href: "/safaris/cross-country-safaris" },
  { key: "uganda", href: "/safaris/uganda" },
  { key: "migration", href: "/safaris/great-migration" },
  { key: "nairobi", href: "/safaris/nairobi-day-tours" },
  { key: "all", href: "/safaris" },
];

const DISCOVER_LINKS: ColumnLink[] = [
  { key: "family", href: "/safari-types/family" },
  { key: "honeymoon", href: "/safari-types/honeymoon" },
  { key: "photographic", href: "/safari-types/photographic" },
  { key: "luxuryLodges", href: "/accommodations/luxury-lodges" },
  { key: "beachBush", href: "/safaris/beach-and-bush" },
  { key: "zanzibar", href: "/destinations/zanzibar" },
];

const PLAN_LINKS: ColumnLink[] = [
  { key: "costEstimator", href: "/tools/safari-cost-calculator" },
  { key: "packingChecklist", href: "/tools/packing-checklist" },
  { key: "bestTime", href: "/tools/best-time-to-visit" },
  { key: "visaGuide", href: "/tools/travel-visa-guide" },
  { key: "withKids", href: "/safari-with-kids" },
  { key: "faq", href: "/faq" },
];

const COMPANY_LINKS: ColumnLink[] = [
  { key: "about", href: "/about" },
  { key: "whyDivine", href: "/about/why-divine" },
  { key: "reviews", href: "/reviews" },
  { key: "responsible", href: "/responsible-travel" },
  { key: "bookingTerms", href: "/safari-booking-terms" },
  { key: "contact", href: "/contact" },
];

/* ── Link column with tick-mark hover ─────────────────────────────────── */

function FooterColumn({
  heading,
  links,
  namespace,
  t,
}: {
  heading: string;
  links: ColumnLink[];
  namespace: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0cf9c]">
        {heading}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-[13px] text-bone-paper/65 transition-colors hover:text-[#e8c080]"
            >
              <span className="h-px w-0 bg-[#e8c080] transition-all duration-200 group-hover:w-2.5" />
              {t(`footer.${namespace}.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Accreditation badge — logo chip + "view certificate" trigger ──────── */

function AccreditationBadge({
  logo,
  name,
  viewLabel,
  onView,
}: {
  logo: string;
  name: string;
  viewLabel: string;
  onView: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.button
        type="button"
        onClick={onView}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        aria-label={`${name} — ${viewLabel}`}
        className="flex h-12 w-[88px] items-center justify-center bg-bone-paper p-2 shadow-sm ring-1 ring-transparent transition-all hover:ring-[#e8c080]/60"
      >
        <Image
          src={logo}
          alt={name}
          width={140}
          height={56}
          className="h-full w-full object-contain"
        />
      </motion.button>
      <button
        type="button"
        onClick={onView}
        className="group/lnk inline-flex items-center gap-1 text-[10px] font-semibold text-[#e8c080] transition-colors hover:text-[#f0cf9c]"
      >
        {viewLabel}
      </button>
    </div>
  );
}

/* ── Footer ────────────────────────────────────────────────────────────── */

export default function Footer({ settings }: { settings: ContactSettings }) {
  const t = useTranslations("common");
  const [activeCert, setActiveCert] = useState<CertKey | null>(null);

  const phoneHref = settings.phone
    ? `tel:${settings.phone.replace(/[^+\d]/g, "")}`
    : "";
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`
    : "";
  const hasSocial = !!(
    settings.facebook ||
    settings.instagram ||
    settings.youtube
  );

  return (
    <footer className="relative overflow-hidden bg-bone-forest text-bone-paper">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f0cf9c]/45 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-[-12%] h-[60%] w-[70vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(184,84,42,0.14), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-[1] py-20 sm:py-24">
        {/* ── CTA band ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 border-b border-bone-paper/10 pb-16 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Reveal variant="fadeUp">
              <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0cf9c]">
                <span className="h-1.5 w-1.5 rounded-full bg-bone-clay" />
                {t("footer.eyebrow")}
              </span>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.05}>
              <h2 className="mt-5 max-w-[15ch] font-serif text-[clamp(36px,4.6vw,72px)] font-light leading-[1.02] tracking-[-0.02em]">
                {t.rich("footer.heading", {
                  em: (chunks) => (
                    <em className="italic text-[#f0cf9c]">{chunks}</em>
                  ),
                })}
              </h2>
            </Reveal>
          </div>
          <div>
            <Reveal variant="fadeUp" delay={0.1}>
              <p className="max-w-[42ch] text-[15px] leading-[1.65] text-bone-paper/65">
                {t("footer.subtext")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <SiteLink href="/plan-my-safari" variant="paper" size="md">
                  {t("footer.requestQuote")}
                </SiteLink>
                {settings.whatsapp && (
                  <SiteLink
                    href={whatsappHref}
                    variant="outline-light"
                    size="md"
                    external
                    arrow={false}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t("footer.whatsappUs")}
                  </SiteLink>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Link columns + side card ──────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-[1.9fr_1fr] lg:gap-14">
          <Stagger className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <RevealItem>
              <FooterColumn
                heading={t("footer.toursHeading")}
                links={TOUR_LINKS}
                namespace="tours"
                t={t}
              />
            </RevealItem>
            <RevealItem>
              <FooterColumn
                heading={t("footer.discoverHeading")}
                links={DISCOVER_LINKS}
                namespace="discover"
                t={t}
              />
            </RevealItem>
            <RevealItem>
              <FooterColumn
                heading={t("footer.planHeading")}
                links={PLAN_LINKS}
                namespace="plan"
                t={t}
              />
            </RevealItem>
            <RevealItem>
              <FooterColumn
                heading={t("footer.companyHeading")}
                links={COMPANY_LINKS}
                namespace="company"
                t={t}
              />
            </RevealItem>
          </Stagger>

          <div className="flex flex-col gap-4">
            <Reveal variant="fadeUp">
              <div className="">
                <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0cf9c]">
                  {t("footer.reachHeading")}
                </h4>
                <div className="flex flex-col gap-3">
                  {settings.phone && (
                    <a
                      href={phoneHref}
                      className="flex items-center gap-3 text-[13.5px] text-bone-paper/70 transition-colors hover:text-[#e8c080]"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#e8c080]/10 text-[#e8c080]">
                        <Phone size={14} strokeWidth={2} aria-hidden="true" />
                      </span>
                      {settings.phone}
                    </a>
                  )}
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-3 text-[13.5px] text-bone-paper/70 transition-colors hover:text-[#e8c080]"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#e8c080]/10 text-[#e8c080]">
                        <Mail size={14} strokeWidth={2} aria-hidden="true" />
                      </span>
                      {settings.email}
                    </a>
                  )}
                  <span className="flex items-center gap-3 text-[13.5px] text-bone-paper/50">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#e8c080]/10 text-[#e8c080]/50">
                      <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                    </span>
                    {t("footer.location")}
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="flex gap-3">
              {settings.googleReviews && (
                <motion.a
                  href={settings.googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 bg-bone-paper p-3.5 text-bone-ink shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <GoogleIcon className="h-6 w-6" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone-ink/55">
                      {t("footer.googleReviewsLabel")}
                    </span>
                  </span>
                  <span className="mt-1.5 block font-serif text-[28px] font-medium leading-none">
                    4.9
                  </span>
                  <span className="mt-1 block text-[10.5px] text-bone-ink/55">
                    {t("footer.verifiedReviews")}
                  </span>
                </motion.a>
              )}
              {settings.tripadvisor && (
                <motion.a
                  href={settings.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 bg-bone-paper p-3.5 text-bone-ink shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00aa6c] text-white">
                      <TripAdvisorIcon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone-ink/55">
                      {t("footer.tripadvisorLabel")}
                    </span>
                  </span>
                  <span className="mt-1.5 block font-serif text-[28px] font-medium leading-none">
                    5.0
                  </span>
                  <span className="mt-1 block text-[10.5px] text-bone-ink/55">
                    {t("footer.excellentChoice")}
                  </span>
                </motion.a>
              )}
              <div style={{ display: "block", padding: "0 0 5px 0" }}>
                <span className="ca6ea56409f15">&nbsp;</span>
                <Script
                  id="safaribookings-widget"
                  src="https://s3.amazonaws.com/z_437er23a/22f5640a0.js"
                  strategy="lazyOnload"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust + social strip ──────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-bone-paper/10 pt-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-paper/40">
              <Shield size={13} className="text-[#e8c080]" aria-hidden="true" />
              {t("footer.accreditationLabel")}
            </span>
            {ACCREDITATIONS.map((cert) => (
              <AccreditationBadge
                key={cert.key}
                logo={cert.logo}
                name={t(`footer.${cert.nameKey}`)}
                viewLabel={t("footer.viewCertificate")}
                onView={() => setActiveCert(cert.key)}
              />
            ))}
          </div>

          {hasSocial && (
            <div className="flex items-center gap-2 lg:justify-self-end">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("topbar.facebookAria")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-bone-paper/10 text-bone-paper/70 transition-all hover:border-[#e8c080]/40 hover:text-[#e8c080]"
                >
                  <Facebook size={16} strokeWidth={1.8} aria-hidden="true" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("topbar.instagramAria")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-bone-paper/10 text-bone-paper/70 transition-all hover:border-[#e8c080]/40 hover:text-[#e8c080]"
                >
                  <Instagram size={16} strokeWidth={1.8} aria-hidden="true" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("topbar.youtubeAria")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-bone-paper/10 text-bone-paper/70 transition-all hover:border-[#e8c080]/40 hover:text-[#e8c080]"
                >
                  <Youtube size={16} strokeWidth={1.8} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Payments ───────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center gap-3.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone-paper/40">
            {t("footer.paymentsHeading")}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_MARKS.map((mark) => (
              <span
                key={mark.label}
                className="flex h-7 min-w-[44px] items-center justify-center rounded-full bg-bone-paper px-2.5"
              >
                <Image
                  src={mark.logo}
                  alt={mark.label}
                  width={mark.width}
                  height={mark.height}
                  className="h-4 w-auto"
                />
              </span>
            ))}

            <span className="flex h-7 items-center gap-1.5 rounded-full bg-bone-paper px-2.5 text-[10px] font-semibold text-bone-ink/70">
              <Landmark size={13} strokeWidth={2} aria-hidden="true" />
              Bank
            </span>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-bone-paper/10 pt-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <CurrencySwitcher variant="pill" dropDirection="up" />
            <LanguageSwitcher variant="pill" dropDirection="up" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-bone-paper/50">
            <span>
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </span>
            <span className="text-bone-paper/20">·</span>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#e8c080]"
            >
              {t("footer.terms")}
            </Link>
            <span className="text-bone-paper/20">·</span>
            <Link
              href="/guidelines"
              className="transition-colors hover:text-[#e8c080]"
            >
              {t("footer.guidelines")}
            </Link>
          </div>

          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 rounded-full border border-bone-paper/15 px-3.5 py-1.5 text-[11px] text-bone-paper/70 transition-colors hover:border-[#e8c080]/40 hover:text-[#e8c080]"
          >
            <ChevronUp size={13} strokeWidth={2.2} aria-hidden="true" />
            {t("footer.backToTop")}
          </motion.button>
        </div>
      </div>

      {/* ── Accreditation certificates — full-screen viewer ────────────── */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-bone-ink/95 p-4 sm:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={t(
              `footer.${ACCREDITATIONS.find((c) => c.key === activeCert)!.nameKey}`,
            )}
            onClick={() => setActiveCert(null)}
          >
            <button
              type="button"
              onClick={() => setActiveCert(null)}
              aria-label={t("footer.closeModal")}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-bone-paper/10 text-bone-paper transition-colors hover:bg-bone-paper/20"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full max-h-[85vh] w-full max-w-3xl"
            >
              <Image
                src={
                  ACCREDITATIONS.find((c) => c.key === activeCert)!.certImage
                }
                alt={t(
                  `footer.${ACCREDITATIONS.find((c) => c.key === activeCert)!.nameKey}`,
                )}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
