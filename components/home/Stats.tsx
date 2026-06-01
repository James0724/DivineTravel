'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 1200, suffix: '+', label: 'Happy Travellers' },
  { value: 15, suffix: '+', label: 'Years of Experience' },
  { value: 48, suffix: '', label: 'Safari Destinations' },
  { value: 4.9, suffix: '/5', label: 'Average Rating' },
]

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = performance.now()
    const isDecimal = to % 1 !== 0

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(isDecimal ? parseFloat((eased * to).toFixed(1)) : Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [inView, to])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-bone-forest text-bone-paper py-16 sm:py-20">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl sm:text-5xl font-semibold text-bone-paper mb-2">
                {inView ? <CountUp to={stat.value} suffix={stat.suffix} /> : '0'}
              </p>
              <p className="text-sm font-sans text-bone-paper/55 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
