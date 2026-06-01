'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useFeaturedSafaris } from '@/hooks/useSafaris'
import { SafariCardSkeleton } from '@/components/ui/Skeleton'
import Reveal, { Stagger, RevealItem } from '@/components/ui/Reveal'
import type { Safari } from '@/types'

interface FeaturedSafarisProps {
  initialData?: Safari[]
}

export default function FeaturedSafaris({ initialData }: FeaturedSafarisProps) {
  const { data, isLoading } = useFeaturedSafaris()
  const safaris = data?.data ?? initialData ?? []

  if (!isLoading && safaris.length === 0) return null

  return (
    <section className="py-[140px] bg-bone-bg">
      <div className="container-site">
        {/* Header */}
        <Reveal>
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Signature Packages
              </div>
              <h2
                className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
                style={{ fontSize: 'clamp(40px, 5.4vw, 76px)' }}
              >
                Our best{' '}
                <em className="italic text-bone-clay">journeys</em>.
              </h2>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <p className="text-[15px] leading-[1.65] text-bone-muted max-w-[56ch]">
                Handpicked itineraries designed by our in-country team — each one refined
                through years of guiding guests across East Africa.
              </p>
              <Link
                href="/safaris"
                className="self-start font-mono text-[11px] uppercase tracking-[0.14em] text-bone-forest hover:text-bone-clay transition-colors"
              >
                View all safaris →
              </Link>
            </div>
          </div>
        </Reveal>

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
                <SafariPackageCard safari={safari} />
              </RevealItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

function SafariPackageCard({ safari }: { safari: Safari }) {
  const price =
    safari.pricing?.budget?.pricePerPerson ??
    safari.pricing?.midRange?.pricePerPerson ??
    safari.pricing?.luxury?.pricePerPerson

  return (
    <Link
      href={`/safaris/${safari.slug}`}
      className="flex flex-col cursor-pointer group transition-transform duration-400 hover:-translate-y-1.5 h-full"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden mb-5"
        style={{ aspectRatio: '4/3.4', background: '#e4dac3' }}
      >
        {safari.coverImage ? (
          <Image
            src={safari.coverImage}
            alt={safari.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif italic text-bone-muted text-[18px]">
              {safari.location?.country ?? 'East Africa'}
            </span>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex justify-between items-center mb-3">
        <span
          className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted border"
          style={{ borderColor: 'rgba(23,22,18,0.14)' }}
        >
          {safari.category ?? 'Safari'}
        </span>
        {safari.featured && (
          <span
            className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] text-bone-clay border border-bone-clay"
          >
            Featured
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
        style={{ borderColor: 'rgba(23,22,18,0.14)' }}
      >
        <div className="font-serif text-[22px]">
          {price ? (
            <>
              <span className="font-mono text-[10px] text-bone-muted tracking-[0.12em] mr-1.5 align-middle">
                from
              </span>
              <em className="italic">
                ${price.toLocaleString()}
              </em>
            </>
          ) : (
            <span className="font-mono text-[11px] text-bone-muted tracking-[0.1em]">
              Quote on request
            </span>
          )}
        </div>
        {safari.duration && (
          <span className="font-mono text-[11px] text-bone-muted uppercase tracking-[0.14em]">
            {safari.duration} days
          </span>
        )}
      </div>
    </Link>
  )
}
