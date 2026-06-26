'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { getLowestPrice } from '@/lib/utils'
import { SAFARI_TYPES } from '@/components/safaris/SafariFilterPanel'
import { useCurrency } from '@/lib/currency/useCurrency'
import type { Safari } from '@/types'

interface PkgCardProps {
  safari: Safari
  index?: number
}

export default function PkgCard({ safari, index = 0 }: PkgCardProps) {
  const lowestPrice = getLowestPrice(safari.pricing)
  const { displayPrice } = useCurrency()

  const primaryCountry = safari.location.countries?.[0] ?? safari.location.country
  const categoryLabel = [primaryCountry, ...safari.category.slice(0, 1)].filter(Boolean).join(' · ')
  const styleLabel = SAFARI_TYPES.find((t) => t.value === safari.safariType?.[0])?.label

  const displayParks = safari.location.parks?.length ? safari.location.parks : safari.location.park ? [safari.location.park] : []
  const displayRegions = safari.location.regions?.length ? safari.location.regions : safari.location.region ? [safari.location.region] : []
  const locationTags = [...displayParks, ...displayRegions].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      className="h-full"
    >
      <Link
        href={`/safaris/${safari.slug}`}
        className="group flex flex-col w-full h-full bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
      >
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '3 / 2' }}>
          <Image
            src={safari.coverImage || safari.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={safari.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,22,18,0.35)] via-transparent to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          {/* Country · category + safari style pills */}
          {(categoryLabel || styleLabel) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryLabel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.12)]">
                  {categoryLabel}
                </span>
              )}
              {styleLabel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-clay border border-[rgba(23,22,18,0.12)]">
                  {styleLabel}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-[20px] sm:text-[22px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
            {safari.name}
          </h3>

          {/* Tagline */}
          {safari.tagline && (
            <p className="text-[13px] sm:text-[14px] leading-[1.65] text-bone-muted mb-4 line-clamp-3">
              {safari.tagline}
            </p>
          )}

          {/* Location tags */}
          {locationTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {locationTags.map((loc) => (
                <span
                  key={loc}
                  className="px-2 py-0.5 rounded font-mono text-[10px] tracking-[0.08em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.1)]"
                >
                  {loc}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-end justify-between pt-4 border-t border-[rgba(23,22,18,0.1)]">
            <div>
              <span className="block font-mono text-[9px] tracking-[0.16em] text-bone-muted mb-0.5">
                FROM
              </span>
              <strong className="font-serif text-[26px] sm:text-[28px] font-light text-bone-ink leading-none">
                {displayPrice(lowestPrice)}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.1em] text-bone-muted">
                {safari.duration} DAYS
              </span>
              <span className="w-7 h-7 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center text-[12px] flex-shrink-0 transition-colors duration-200 group-hover:bg-bone-clay">
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
