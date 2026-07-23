"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import GoogleIcon from "@/components/icons/GoogleIcon";
import type { Testimonial } from "@/types";

interface ReviewsPageContentProps {
  testimonials: Testimonial[];
  googleRating: string;
  googleReviews: string;
  total: number;
}

function SourceBadge({
  testimonial,
  t,
}: {
  testimonial: Testimonial;
  t: ReturnType<typeof useTranslations>;
}) {
  if (testimonial.source === "google") {
    return (
      <a
        href={testimonial.sourceUrl || undefined}
        target={testimonial.sourceUrl ? "_blank" : undefined}
        rel={testimonial.sourceUrl ? "noopener noreferrer" : undefined}
        onClick={(e) => !testimonial.sourceUrl && e.preventDefault()}
        className="ml-auto flex items-center gap-1.5 text-xs font-sans font-medium bg-bone-ink/[0.04] hover:bg-bone-ink/[0.08] px-2 py-1 rounded-full transition-colors flex-shrink-0"
      >
        <GoogleIcon className="h-3.5 w-3.5" />
        {t("postedOnGoogle")}
      </a>
    );
  }
  if (testimonial.verified) {
    return (
      <span className="ml-auto text-xs text-bone-forest font-sans bg-bone-forest/10 px-2 py-0.5 rounded-full flex-shrink-0">
        ✓ {t("verified")}
      </span>
    );
  }
  return null;
}

export default function ReviewsPageContent({
  testimonials,
  googleRating,
  googleReviews,
  total,
}: ReviewsPageContentProps) {
  const t = useTranslations("reviews");
  const [active, setActive] = useState<Testimonial | null>(null);

  return (
    <div className="bg-bone-bg py-16 sm:py-20">
      <div className="container-site">
        {/* Rating summary */}
        <Reveal variant="fadeUp">
          <div
            className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-10 rounded-md bg-bone-paper px-8 py-8 mb-14"
            style={{ border: "1px solid rgba(23,22,18,0.12)" }}
          >
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-serif text-5xl text-bone-ink leading-none">
                {googleRating}
              </span>
              <span className="text-xs text-bone-ink/45 font-sans mt-1.5">
                {t("summary.ratingLabel")}
              </span>
            </div>
            <div className="hidden sm:block w-px bg-[rgba(23,22,18,0.12)]" />
            <div className="flex flex-col items-center sm:items-start justify-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-bone-clay text-bone-clay" />
                ))}
              </div>
              {total > 0 && (
                <p className="text-sm text-bone-ink/60 font-sans">
                  {t(total === 1 ? "summary.reviewCountOne" : "summary.reviewCountOther", { count: total })}
                </p>
              )}
            </div>
            <div className="flex-1" />
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {googleReviews && (
                <a
                  href={googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium px-4 py-2.5 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink hover:border-bone-ink/40 transition-colors"
                >
                  <GoogleIcon className="h-4 w-4" />
                  {t("summary.readOnGoogle")}
                </a>
              )}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        {testimonials.length > 0 ? (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <RevealItem key={item._id}>
                <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 h-full flex flex-col">
                  <Quote size={24} className="text-bone-clay/40 mb-4" />

                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < item.rating
                            ? "fill-bone-clay text-bone-clay"
                            : "text-bone-ink/15"
                        }
                      />
                    ))}
                  </div>

                  <h4 className="font-serif text-lg font-semibold text-bone-ink mb-2">
                    &ldquo;{item.title}&rdquo;
                  </h4>

                  <div className="mb-5 flex-1">
                    <p className="text-sm text-bone-ink/65 leading-relaxed line-clamp-4">
                      {item.body}
                    </p>
                    {item.body.length > 180 && (
                      <button
                        onClick={() => setActive(item)}
                        className="text-xs font-sans font-medium text-bone-clay hover:underline mt-1"
                      >
                        {t("readMore")}
                      </button>
                    )}
                  </div>

                  {item.safariName && (
                    <p className="text-xs text-bone-clay font-sans font-medium mb-4 border-t border-[rgba(23,22,18,0.08)] pt-4">
                      {item.safariName}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        thumbSize={80}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-bone-forest/15 flex items-center justify-center text-bone-forest font-serif font-semibold text-sm flex-shrink-0">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-sans font-medium text-bone-ink truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-bone-ink/45 truncate">{item.country}</p>
                    </div>
                    <SourceBadge testimonial={item} t={t} />
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        ) : (
          <Reveal variant="fadeUp">
            <div
              className="mx-auto max-w-lg rounded-sm bg-bone-paper px-8 py-12 text-center"
              style={{ border: "1px solid rgba(23,22,18,0.12)" }}
            >
              <h2 className="font-serif text-2xl font-normal text-bone-ink mb-3">
                {t("empty.heading")}
              </h2>
              <p className="text-sm leading-relaxed text-bone-ink/60 mb-7">
                {t("empty.body")}
              </p>
              {googleReviews && (
                <a
                  href={googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-bone-clay hover:underline text-sm font-medium"
                >
                  <GoogleIcon className="h-4 w-4" />
                  {t("empty.cta")}
                </a>
              )}
            </div>
          </Reveal>
        )}

        {/* Bottom CTA banner */}
        {googleReviews && testimonials.length > 0 && (
          <Reveal variant="fadeUp">
            <div
              className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-md bg-bone-forest text-bone-paper px-8 py-10"
            >
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-xl mb-1.5">{t("ctaBanner.heading")}</h3>
                <p className="text-sm text-bone-paper/70 max-w-md">{t("ctaBanner.body")}</p>
              </div>
              <a
                href={googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 flex-shrink-0 bg-bone-paper text-bone-ink text-sm font-sans font-medium px-5 py-3 rounded hover:bg-bone-paper/90 transition-colors"
              >
                <GoogleIcon className="h-4 w-4" />
                {t("ctaBanner.cta")}
              </a>
            </div>
          </Reveal>
        )}
      </div>

      {/* Full review modal */}
      <AnimatePresence>
        {active && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-bone-ink/50 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 flex-shrink-0 border-b border-[rgba(23,22,18,0.08)]">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < active.rating
                          ? "fill-bone-clay text-bone-clay"
                          : "text-bone-ink/15"
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="flex-shrink-0 p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-6 flex-1 space-y-4">
                <h4 className="font-serif text-lg font-semibold text-bone-ink">
                  &ldquo;{active.title}&rdquo;
                </h4>
                <p className="text-sm text-bone-ink/70 leading-relaxed whitespace-pre-wrap">
                  {active.body}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(23,22,18,0.08)]">
                  {active.avatar ? (
                    <OptimizedImage
                      src={active.avatar}
                      alt={active.name}
                      width={40}
                      height={40}
                      thumbSize={80}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-bone-forest/15 flex items-center justify-center text-bone-forest font-serif font-semibold text-sm">
                      {active.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-sans font-medium text-bone-ink">
                      {active.name}
                    </p>
                    <p className="text-xs text-bone-ink/45">{active.country}</p>
                  </div>
                  <SourceBadge testimonial={active} t={t} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
