"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSignaturePackages } from "@/hooks/useSafaris";
import { useCurrency } from "@/lib/currency/useCurrency";
import SiteLink from "@/components/ui/SiteLink";
import type { Safari } from "@/types";
import { AnimatedHeading } from "../ui/Heading";
import Reveal from "../ui/Reveal";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface SignaturePackagesProps {
  initialData?: Safari[];
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function PackageCard({
  safari,
  large,
  index,
  labels,
}: {
  safari: Safari;
  large: boolean;
  index: number;
  labels: { signatureBadge: string; fromLabel: string; onRequest: string; daysLabel: string };
}) {
  const price =
    safari.pricing?.budget?.pricePerPerson ??
    safari.pricing?.midRange?.pricePerPerson ??
    safari.pricing?.luxury?.pricePerPerson;
  const { displayPrice } = useCurrency();

  const categoryLabel = Array.isArray(safari.category)
    ? safari.category[0]
    : safari.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="flex"
    >
      <Link
        href={`/safaris/${safari.slug}`}
        className="group flex flex-col w-full bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
      >
        {/* Image */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ aspectRatio: large ? "16/10" : "3/2" }}
        >
          {safari.coverImage ? (
            <OptimizedImage
              src={safari.coverImage}
              alt={safari.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-bone-bg-deep flex items-center justify-center">
              <span className="font-serif italic text-bone-muted text-[18px]">
                {safari.location?.country ?? "East Africa"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,22,18,0.35)] via-transparent to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {safari.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-clay/12 text-bone-clay border border-bone-clay/30">
                ★ {labels.signatureBadge}
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.12)]">
              {safari.location?.country} · {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[20px] sm:text-[22px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
            {safari.name}
          </h3>

          {/* Description */}
          <p className="text-[13px] sm:text-[14px] leading-[1.65] text-bone-muted mb-4 line-clamp-3">
            {safari.tagline}
          </p>

          {/* Parks */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {[safari.location?.park, safari.location?.region]
              .filter(Boolean)
              .slice(0, 3)
              .map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded font-mono text-[10px] tracking-[0.08em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.1)]"
                >
                  {p}
                </span>
              ))}
          </div>

          {/* Footer — pushed to bottom */}
          <div className="mt-auto flex items-end justify-between pt-4 border-t border-[rgba(23,22,18,0.1)]">
            <div>
              <span className="block font-mono text-[9px] tracking-[0.16em] text-bone-muted mb-0.5">
                {labels.fromLabel}
              </span>
              <strong className="font-serif text-[26px] sm:text-[28px] font-light text-bone-ink leading-none">
                {price ? displayPrice(price) : labels.onRequest}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.1em] text-bone-muted">
                {safari.duration} {labels.daysLabel}
              </span>
              <span className="w-7 h-7 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center text-[12px] flex-shrink-0 transition-colors duration-200 group-hover:bg-bone-clay">
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */

function CardSkeleton({ large }: { large: boolean }) {
  return (
    <div className="flex flex-col bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-sm overflow-hidden animate-pulse">
      <div
        className="bg-bone-bg-deep flex-shrink-0"
        style={{ aspectRatio: large ? "16/10" : "3/2" }}
      />
      <div className="p-5 sm:p-6 flex flex-col gap-3">
        <div className="h-3 bg-bone-bg-deep rounded w-1/3" />
        <div className="h-5 bg-bone-bg-deep rounded w-3/4" />
        <div className="h-3 bg-bone-bg-deep rounded w-full" />
        <div className="h-3 bg-bone-bg-deep rounded w-2/3" />
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

export default function SignaturePackages({
  initialData,
}: SignaturePackagesProps) {
  const t = useTranslations("home.signaturePackages");
  const labels = {
    signatureBadge: t("signatureBadge"),
    fromLabel: t("fromLabel"),
    onRequest: t("onRequest"),
    daysLabel: t("daysLabel"),
  };
  const { data, isLoading } = useSignaturePackages();
  const safaris = data?.data ?? initialData ?? [];

  const featuredCards = safaris.filter((s) => s.featured).slice(0, 2);
  const featuredIds = new Set(featuredCards.map((s) => s._id));
  const regularCards = safaris
    .filter((s) => !featuredIds.has(s._id))
    .slice(0, 4);

  const showSkeleton = isLoading && safaris.length === 0;

  return (
    <section
      className="py-20 sm:py-[120px] bg-bone-bg border-b"
      style={{ borderColor: "rgba(23,22,18,0.12)" }}
    >
      <div className="container-site">
        {/* ── Section header ──────────────────────────────────────────── */}
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
              textAfter={t("headingAfter")}
            />
          </div>

          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.7] text-bone-muted max-w-[54ch]">
              {t("description")}
            </p>
          </Reveal>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────── */}
        {showSkeleton ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
              <CardSkeleton large={true} />
              <CardSkeleton large={true} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <CardSkeleton key={i} large={false} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Featured row (2 large cards) */}
            {featuredCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
                {featuredCards.map((safari, i) => (
                  <PackageCard
                    key={safari._id}
                    safari={safari}
                    large={true}
                    index={i}
                    labels={labels}
                  />
                ))}
              </div>
            )}

            {/* Regular grid (up to 4 cards) */}
            {regularCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
                {regularCards.map((safari, i) => (
                  <PackageCard
                    key={safari._id}
                    safari={safari}
                    large={false}
                    index={featuredCards.length + i}
                    labels={labels}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-[rgba(23,22,18,0.12)]">
          <p className="text-[14px] text-bone-muted max-w-[42ch] text-center sm:text-left">
            {t("ctaText")}
          </p>
          <SiteLink
            href="/safaris"
            variant="solid"
            size="md"
            className="flex-shrink-0"
          >
            {t("ctaButton")}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
