"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stats = [
  { value: 1200, suffix: "+",  label: "Happy Travellers" },
  { value: 15,   suffix: "+",  label: "Years of Experience" },
  { value: 48,   suffix: "",   label: "Safari Destinations" },
  { value: 4.9,  suffix: "/5", label: "Average Rating" },
]

function CountUp({
  to,
  suffix,
  isActive,
}: {
  to: number
  suffix: string
  isActive: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const duration = 2200
    const start = performance.now()
    const isDecimal = to % 1 !== 0

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Quartic ease-out — snappy start, graceful landing
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(
        isDecimal
          ? parseFloat((eased * to).toFixed(1))
          : Math.floor(eased * to),
      )
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isActive, to])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section className="relative bg-bone-forest text-bone-paper py-16 sm:py-20 overflow-hidden">
      {/* Subtle dot-grid background texture */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(244,239,226,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 0.3 }}
      />

      <div
        ref={ref}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Eyebrow */}
        <motion.div
          className="eyebrow text-center mb-10 sm:mb-14"
          style={{ color: "rgba(244,239,226,0.5)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span
            className="dot"
            style={{ background: "#c0612e" }}
          />
          By the numbers
        </motion.div>

        {/* Horizontal rule — draws outward from center */}
        <motion.div
          className="hidden md:block h-px mb-10 mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(244,239,226,0.12) 30%, rgba(244,239,226,0.12) 70%, transparent 100%)",
            maxWidth: "800px",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12, ease: EASE }}
              className="text-center relative px-4 md:px-6"
            >
              {/* Vertical separator between items (desktop only) */}
              {i > 0 && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block w-px"
                  style={{
                    height: "48px",
                    background: "rgba(244,239,226,0.13)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.35 + i * 0.12,
                    ease: EASE,
                  }}
                />
              )}

              {/* Big number */}
              <p
                className="font-serif font-light text-4xl sm:text-5xl text-bone-paper mb-2 tracking-[-0.02em]"
              >
                {inView ? (
                  <CountUp to={stat.value} suffix={stat.suffix} isActive={inView} />
                ) : (
                  <>0{stat.suffix}</>
                )}
              </p>

              {/* Clay accent line — scales in after the number arrives */}
              <motion.div
                className="h-px mx-auto mb-2.5"
                style={{ background: "#c0612e", width: "20px" }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 0.45,
                  delay: 0.55 + i * 0.12,
                  ease: EASE,
                }}
              />

              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-bone-paper/55">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
