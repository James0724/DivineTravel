'use client'

import { useRef, useCallback, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Star, Quote, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import type { Testimonial } from '@/types'

async function fetchTestimonials(): Promise<{ data: Testimonial[] }> {
  const res = await fetch('/api/testimonials?featured=true&limit=8')
  if (!res.ok) throw new Error('Failed to load testimonials')
  return res.json()
}

interface TestimonialsProps {
  initialData?: Testimonial[]
}

export default function Testimonials({ initialData }: TestimonialsProps) {
  const t = useTranslations('home.testimonials')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<Testimonial | null>(null)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  )

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const { data } = useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: fetchTestimonials,
    staleTime: 1000 * 60 * 10,
    initialData: initialData ? { data: initialData } : undefined,
  })

  const testimonials = data?.data ?? []

  if (testimonials.length === 0) return null

  return (
    <section ref={ref} className="bg-bone-bg py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs font-sans font-semibold text-bone-clay uppercase tracking-widest mb-2">
              {t('eyebrow')}
            </p>
            <h2 className="font-serif text-display-md text-bone-ink">
              {t('heading')}
            </h2>
          </div>
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded border border-[rgba(23,22,18,0.2)] flex items-center justify-center text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40 transition-colors"
              aria-label={t('prevAria')}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded border border-[rgba(23,22,18,0.2)] flex items-center justify-center text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40 transition-colors"
              aria-label={t('nextAria')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex gap-5">
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="flex-none w-[90vw] sm:w-[480px] lg:w-[420px]"
              >
                <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 h-full">
                  {/* Quote icon */}
                  <Quote size={24} className="text-bone-clay/40 mb-4" />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < item.rating
                            ? 'fill-bone-clay text-bone-clay'
                            : 'text-bone-ink/15'
                        }
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-lg font-semibold text-bone-ink mb-2">
                    &ldquo;{item.title}&rdquo;
                  </h4>

                  {/* Body */}
                  <div className="mb-5">
                    <p className="text-sm text-bone-ink/65 leading-relaxed line-clamp-4">
                      {item.body}
                    </p>
                    {item.body.length > 180 && (
                      <button
                        onClick={() => setActive(item)}
                        className="text-xs font-sans font-medium text-bone-clay hover:underline mt-1"
                      >
                        {t('readMore')}
                      </button>
                    )}
                  </div>

                  {/* Safari tag */}
                  {item.safariName && (
                    <p className="text-xs text-bone-clay font-sans font-medium mb-4 border-t border-[rgba(23,22,18,0.08)] pt-4">
                      {item.safariName}
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-bone-forest/15 flex items-center justify-center text-bone-forest font-serif font-semibold text-sm">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-sans font-medium text-bone-ink">
                        {item.name}
                      </p>
                      <p className="text-xs text-bone-ink/45">{item.country}</p>
                    </div>
                    {item.verified && (
                      <span className="ml-auto text-xs text-bone-forest font-sans bg-bone-forest/10 px-2 py-0.5 rounded-full">
                        ✓ {t('verified')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full testimonial modal */}
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
                          ? 'fill-bone-clay text-bone-clay'
                          : 'text-bone-ink/15'
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
                    <Image
                      src={active.avatar}
                      alt={active.name}
                      width={40}
                      height={40}
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
                  {active.verified && (
                    <span className="ml-auto text-xs text-bone-forest font-sans bg-bone-forest/10 px-2 py-0.5 rounded-full">
                      ✓ {t('verified')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
