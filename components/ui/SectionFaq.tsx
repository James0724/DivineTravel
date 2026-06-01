'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface FaqEntry { q: string; a: string }

interface SectionFaqProps {
  id?: string
  eyebrow: string
  heading: React.ReactNode
  /** Brief contact line shown below the heading */
  contactNote?: React.ReactNode
  faqs: FaqEntry[]
}

const ease = [0.4, 0, 0.2, 1] as const

export default function SectionFaq({ id, eyebrow, heading, contactNote, faqs }: SectionFaqProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id={id}
      className="bg-bone-paper"
      style={{
        padding: '140px 0',
        borderTop: '1px solid rgba(31,29,24,0.14)',
        borderBottom: '1px solid rgba(31,29,24,0.14)',
      }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
          {/* Left */}
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              {eyebrow}
            </div>
            <h2
              className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              {heading}
            </h2>
            {contactNote && (
              <p className="text-[14px] text-bone-muted mt-4 leading-[1.6]" style={{ maxWidth: '32ch' }}>
                {contactNote}
              </p>
            )}
          </div>

          {/* Right — accordion */}
          <ul style={{ borderTop: '1px solid rgba(31,29,24,0.14)' }}>
            {faqs.map((f, i) => (
              <li key={f.q} style={{ borderBottom: '1px solid rgba(31,29,24,0.14)' }}>
                <button
                  className="w-full text-left py-6 flex justify-between items-center cursor-pointer font-serif text-[22px] tracking-[-0.01em] text-bone-ink"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  {f.q}
                  <motion.span
                    className="font-mono text-[18px] text-bone-clay flex-shrink-0 ml-4"
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-[15px] leading-[1.65] text-bone-muted">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
