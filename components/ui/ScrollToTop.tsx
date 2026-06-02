'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.75, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 12 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-7 right-7 z-50 w-11 h-11 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:bg-bone-clay transition-colors"
        >
          <ArrowUp size={18} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
