"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import type { Accommodation, AccommodationPriceTier } from "@/types";

interface AccommodationCardProps {
  property: Accommodation;
  index?: number;
}

const PRICE_TIER_LABEL: Record<AccommodationPriceTier, string> = {
  budget: "Budget-Friendly",
  midRange: "Mid-Range",
  luxury: "Luxury",
};

export default function AccommodationCard({ property, index = 0 }: AccommodationCardProps) {
  const coverImage = property.coverImage || property.images?.[0]?.url || "/images/placeholder.jpg";
  const chips = property.amenities?.length ? property.amenities : property.highlights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      className="h-full"
    >
      <div className="group flex flex-col w-full h-full bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover">
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "3 / 2" }}>
          <OptimizedImage
            src={coverImage}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,22,18,0.35)] via-transparent to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          {/* Location + price-tier pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.12)]">
              {property.location.region} · {property.location.country}
            </span>
            {property.priceTier && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-clay border border-[rgba(23,22,18,0.12)]">
                {PRICE_TIER_LABEL[property.priceTier]}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-serif text-[20px] sm:text-[22px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
            {property.name}
          </h3>

          {/* Description excerpt */}
          <p className="text-[13px] sm:text-[14px] leading-[1.65] text-bone-muted mb-4 line-clamp-3">
            {property.description}
          </p>

          {/* Amenity/highlight chips */}
          {chips?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {chips.slice(0, 3).map((chip) => (
                <span
                  key={chip}
                  className="px-2 py-0.5 rounded font-mono text-[10px] tracking-[0.08em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.1)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Footer — enquire/book through us, no price shown */}
          <div className="mt-auto pt-4 border-t border-[rgba(23,22,18,0.1)]">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-forest hover:text-bone-clay transition-colors"
            >
              Enquire & book this stay
              <span className="w-6 h-6 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center text-[11px] flex-shrink-0 transition-colors duration-200 group-hover:bg-bone-clay">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
