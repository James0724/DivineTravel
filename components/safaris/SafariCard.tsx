'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Clock, Users, MapPin, Star } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import {
  formatDuration,
  getLowestPrice,
  truncate,
} from '@/lib/utils'
import { useCurrency } from '@/lib/currency/useCurrency'
import type { Safari } from '@/types'

interface SafariCardProps {
  safari: Safari
  index?: number
  compact?: boolean
}

export default function SafariCard({ safari, index = 0, compact = false }: SafariCardProps) {
  const lowestPrice = getLowestPrice(safari.pricing)
  const { displayPrice } = useCurrency()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
    >
      <Link
        href={`/safaris/${safari.slug}`}
        className="group block h-full bg-bone-paper border border-[rgba(23,22,18,0.14)] rounded-md overflow-hidden hover:shadow-card-hover transition-shadow duration-200"
        aria-label={`View ${safari.name} safari`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-56 sm:h-60'}`}>
          <Image
            src={safari.coverImage || safari.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={safari.images?.[0]?.alt || safari.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {safari.featured && (
              <Badge variant="clay" size="sm">
                Featured
              </Badge>
            )}
            {safari.category.slice(0, 1).map((cat) => (
              <Badge key={cat} size="sm" className="capitalize bg-bone-paper/90 text-bone-ink border-0">
                {cat}
              </Badge>
            ))}
          </div>
          {/* Duration pill */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-sans font-medium bg-bone-ink/70 text-bone-paper px-2 py-0.5 rounded">
              <Clock size={10} />
              {formatDuration(safari.duration)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-bone-ink/50 font-sans mb-1.5">
            <MapPin size={11} />
            {safari.location.park}, {safari.location.country}
          </p>

          {/* Name */}
          <h3 className="font-serif text-lg font-semibold text-bone-ink leading-snug mb-2 group-hover:text-bone-clay transition-colors">
            {safari.name}
          </h3>

          {/* Description */}
          {!compact && (
            <p className="text-sm text-bone-ink/60 leading-relaxed mb-4">
              {truncate(safari.tagline, 95)}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-bone-ink/50 font-sans mb-4">
            <span className="flex items-center gap-1">
              <Users size={11} />
              {safari.minGroupSize}–{safari.maxGroupSize} pax
            </span>
            {safari.rating > 0 && (
              <span className="flex items-center gap-1 text-bone-clay">
                <Star size={11} className="fill-bone-clay" />
                {safari.rating.toFixed(1)}
                <span className="text-bone-ink/40">({safari.reviewCount})</span>
              </span>
            )}
          </div>

          {/* Pricing tiers summary */}
          <div className="flex items-center justify-between border-t border-[rgba(23,22,18,0.1)] pt-4">
            <div>
              <p className="text-xs text-bone-ink/45 font-sans">From</p>
              <p className="font-serif text-xl font-semibold text-bone-ink">
                {displayPrice(lowestPrice)}
                <span className="text-sm font-sans font-normal text-bone-ink/50">
                  {' '}/ person
                </span>
              </p>
            </div>
            <div className="flex gap-1.5">
              {(['budget', 'midRange', 'luxury'] as const).map((tier) => {
                const colors = {
                  budget: 'bg-blue-100 text-blue-700',
                  midRange: 'bg-amber-100 text-amber-700',
                  luxury: 'bg-bone-clay/15 text-bone-clay',
                }
                const labels = { budget: 'B', midRange: 'M', luxury: 'L' }
                return (
                  <span
                    key={tier}
                    title={tier.charAt(0).toUpperCase() + tier.slice(1)}
                    className={`w-6 h-6 rounded text-xs font-sans font-semibold flex items-center justify-center ${colors[tier]}`}
                  >
                    {labels[tier]}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
