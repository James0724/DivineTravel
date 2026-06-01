'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface FaqItem { q: string; a: string }

interface FaqAccordionProps {
  faqs: FaqItem[]
  /** 'default' — compact style used on destination pages; 'large' — serif 22px used on safari pages */
  variant?: 'default' | 'large'
}

const ease = [0.4, 0, 0.2, 1] as const

export default function FaqAccordion({ faqs, variant = 'default' }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  if (variant === 'large') {
    return (
      <ul style={{ borderTop: '1px solid rgba(31,29,24,0.14)' }}>
        {faqs.map((faq, i) => (
          <li key={faq.q} style={{ borderBottom: '1px solid rgba(31,29,24,0.14)' }}>
            <button
              className="w-full text-left py-6 flex justify-between items-center cursor-pointer font-serif text-[22px] tracking-[-0.01em] text-bone-ink"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {faq.q}
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
                  <div className="pb-6 text-[15px] leading-[1.65] text-bone-muted">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="space-y-0 divide-y divide-[rgba(23,22,18,0.09)]">
      {faqs.map((faq, i) => (
        <li key={faq.q} className="py-5">
          <button
            className="flex items-start justify-between gap-4 cursor-pointer text-bone-ink font-sans text-sm font-medium hover:text-bone-clay transition-colors w-full text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <motion.span
              className="text-bone-clay text-lg leading-none flex-shrink-0"
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2, ease }}
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
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm text-bone-ink/65 leading-relaxed pr-8">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  )
}
