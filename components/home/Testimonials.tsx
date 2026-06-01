'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
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
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

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
              Guest Stories
            </p>
            <h2 className="font-serif text-display-md text-bone-ink">
              Told by Travellers
            </h2>
          </div>
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded border border-[rgba(23,22,18,0.2)] flex items-center justify-center text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded border border-[rgba(23,22,18,0.2)] flex items-center justify-center text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40 transition-colors"
              aria-label="Next testimonial"
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
            {testimonials.map((t) => (
              <div
                key={t._id}
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
                          i < t.rating
                            ? 'fill-bone-clay text-bone-clay'
                            : 'text-bone-ink/15'
                        }
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-lg font-semibold text-bone-ink mb-2">
                    &ldquo;{t.title}&rdquo;
                  </h4>

                  {/* Body */}
                  <p className="text-sm text-bone-ink/65 leading-relaxed mb-5 line-clamp-4">
                    {t.body}
                  </p>

                  {/* Safari tag */}
                  {t.safariName && (
                    <p className="text-xs text-bone-clay font-sans font-medium mb-4 border-t border-[rgba(23,22,18,0.08)] pt-4">
                      {t.safariName}
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-bone-forest/15 flex items-center justify-center text-bone-forest font-serif font-semibold text-sm">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-sans font-medium text-bone-ink">
                        {t.name}
                      </p>
                      <p className="text-xs text-bone-ink/45">{t.country}</p>
                    </div>
                    {t.verified && (
                      <span className="ml-auto text-xs text-bone-forest font-sans bg-bone-forest/10 px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
