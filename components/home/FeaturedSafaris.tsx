"use client";

import { Link } from "@/i18n/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useTranslations } from "next-intl";
import { useFeaturedSafaris } from "@/hooks/useSafaris";
import { useCurrency } from "@/lib/currency/useCurrency";
import { SafariCardSkeleton } from "@/components/ui/Skeleton";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";
import type { Safari } from "@/types";
import { AnimatedHeading } from "../ui/Heading";

interface FeaturedSafarisProps {
  initialData?: Safari[];
}

export default function FeaturedSafaris({ initialData }: FeaturedSafarisProps) {
  const t = useTranslations("home.featuredSafaris");
  const labels = {
    featuredBadge: t("featuredBadge"),
    fromLabel: t("fromLabel"),
    quoteOnRequest: t("quoteOnRequest"),
    daysLabel: t("daysLabel"),
  };
  const { data, isLoading } = useFeaturedSafaris();
  const safaris = data?.data ?? initialData ?? [];

  if (!isLoading && safaris.length === 0) return null;

  return (
    <section className="py-[140px] bg-bone-bg">
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
              textAfter={t("headingAfter")}
            />
          </div>
          <Reveal variant="fadeUp">
            <div className="flex flex-col justify-between gap-4">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("description")}
              </p>
              <SiteLink
                href="/safaris"
                variant="ghost-mono"
                arrow
                className="self-start"
              >
                {t("viewAllSafaris")}
              </SiteLink>
            </div>
          </Reveal>
        </header>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SafariCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {safaris.map((safari) => (
              <RevealItem key={safari._id}>
                <SafariPackageCard safari={safari} labels={labels} />
              </RevealItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}

function SafariPackageCard({
  safari,
  labels,
}: {
  safari: Safari;
  labels: { featuredBadge: string; fromLabel: string; quoteOnRequest: string; daysLabel: string };
}) {
  const price =
    safari.pricing?.budget?.pricePerPerson ??
    safari.pricing?.midRange?.pricePerPerson ??
    safari.pricing?.luxury?.pricePerPerson;
  const { displayPrice } = useCurrency();

  return (
    <Link
      href={`/safaris/${safari.slug}`}
      className="flex flex-col cursor-pointer group transition-transform duration-400 hover:-translate-y-1.5 h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden hover:shadow-card-hover"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "4/3.4", background: "#e4dac3" }}
      >
        {safari.coverImage ? (
          <OptimizedImage
            src={safari.coverImage}
            alt={safari.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif italic text-bone-muted text-[18px]">
              {safari.location?.country ?? "East Africa"}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex justify-between items-center mb-3">
          <span
            className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted border"
            style={{ borderColor: "rgba(23,22,18,0.14)" }}
          >
            {safari.category ?? "Safari"}
          </span>
          {safari.featured && (
            <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] text-bone-clay border border-bone-clay">
              {labels.featuredBadge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif font-normal text-[32px] leading-[1.05] tracking-[-0.01em] text-bone-ink mb-3">
          {safari.name}
        </h3>

        {/* Description */}
        {safari.tagline && (
          <p className="text-[14px] leading-[1.55] text-bone-muted mb-4 line-clamp-2 flex-1">
            {safari.tagline}
          </p>
        )}

        {/* Location tags */}
        {safari.location && (
          <div className="flex flex-wrap gap-1 mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-forest">
            {[safari.location.country, safari.location.region]
              .filter(Boolean)
              .map((loc, i) => (
                <span key={i}>
                  {i > 0 && <span className="opacity-50 mr-1">·</span>}
                  {loc}
                </span>
              ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-auto pt-4 border-t flex justify-between items-baseline"
          style={{ borderColor: "rgba(23,22,18,0.14)" }}
        >
          <div className="font-serif text-[22px]">
            {price ? (
              <>
                <span className="font-mono text-[10px] text-bone-muted tracking-[0.12em] mr-1.5 align-middle">
                  {labels.fromLabel}
                </span>
                <em className="italic">{displayPrice(price)}</em>
              </>
            ) : (
              <span className="font-mono text-[11px] text-bone-muted tracking-[0.1em]">
                {labels.quoteOnRequest}
              </span>
            )}
          </div>
          {safari.duration && (
            <span className="font-mono text-[11px] text-bone-muted uppercase tracking-[0.14em]">
              {safari.duration} {labels.daysLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
