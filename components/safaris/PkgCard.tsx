'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLowestPrice } from '@/lib/utils'
import type { Safari } from '@/types'

interface PkgCardProps {
  safari: Safari
  index?: number
  featured?: boolean
}

export default function PkgCard({ safari, index = 0, featured = false }: PkgCardProps) {
  const lowestPrice = getLowestPrice(safari.pricing)
  const nights = Math.max(safari.duration - 1, 0)

  const tagLabel = safari.featured
    ? 'Featured'
    : safari.category[0]
      ? safari.category[0].charAt(0).toUpperCase() + safari.category[0].slice(1)
      : 'Wildlife'

  const isGold = safari.featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      className={`cursor-pointer flex flex-col transition-transform duration-[400ms] hover:-translate-y-1.5${featured ? ' col-span-2' : ''}`}
    >
      <Link href={`/safaris/${safari.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div
          className="relative overflow-hidden mb-5"
          style={{
            aspectRatio: featured ? '16/10' : '4/3.4',
            background: 'var(--bg-deep)',
          }}
        >
          <Image
            src={safari.coverImage || safari.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={safari.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 hover:scale-[1.05]"
          />
        </div>

        {/* Meta row */}
        <div className="flex justify-between items-center mb-3">
          <span
            className="inline-block px-2.5 py-1 border rounded-full font-mono text-[10px] uppercase tracking-[0.14em]"
            style={
              isGold
                ? { borderColor: 'var(--clay)', color: 'var(--clay)' }
                : { borderColor: 'var(--line)', color: 'var(--muted)' }
            }
          >
            {tagLabel}
          </span>
          {safari.rating > 0 && (
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--muted)' }}
            >
              ★ {safari.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-serif font-normal leading-[1.05] tracking-[-0.01em] mb-3"
          style={{
            fontSize: featured ? '42px' : '32px',
            color: 'var(--ink)',
          }}
        >
          {safari.name}
        </h3>

        {/* Description */}
        <p
          className="text-[14px] leading-[1.55] mb-[18px]"
          style={{ color: 'var(--muted)' }}
        >
          {safari.tagline}
        </p>

        {/* Parks / location tags */}
        <div
          className="flex flex-wrap gap-x-3 gap-y-1 mb-4 font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--forest)' }}
        >
          {safari.location.park && <span>{safari.location.park}</span>}
          {safari.location.country && (
            <span className="before:content-['·_'] before:opacity-50 before:mr-1">
              {safari.location.country}
            </span>
          )}
          {safari.category.slice(0, 2).map((cat, i) => (
            <span
              key={cat}
              className={i === 0 && !safari.location.park && !safari.location.country ? '' : 'before:content-["·_"] before:opacity-50 before:mr-1'}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-auto pt-4 border-t flex justify-between items-baseline"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="font-serif text-[22px]" style={{ color: 'var(--ink)' }}>
            <span
              className="font-mono text-[10px] mr-1.5 tracking-[0.12em]"
              style={{ color: 'var(--muted)' }}
            >
              FROM
            </span>
            <b className="italic">${lowestPrice.toLocaleString()}</b>
          </div>
          <span
            className="font-mono text-[11px] tracking-[0.14em]"
            style={{ color: 'var(--muted)' }}
          >
            {safari.duration}D · {nights}N
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
