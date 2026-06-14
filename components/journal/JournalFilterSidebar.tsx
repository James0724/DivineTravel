'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import type { PostCategory } from '@/types'

const CATEGORY_LABELS: Record<PostCategory, string> = {
  migration: 'Migration',
  destinations: 'Destinations',
  planning: 'Planning',
  wildlife: 'Wildlife',
  culture: 'Culture',
  conservation: 'Conservation',
  photography: 'Photography',
  tips: 'Tips & Practical',
}

const ALL_CATEGORIES: PostCategory[] = [
  'migration', 'destinations', 'planning', 'wildlife',
  'culture', 'conservation', 'photography', 'tips',
]

// Height of the sticky navbar (py-[10px] top+bottom + h-9 logo = 56px + 1px border)
const NAV_H = 57

interface JournalFilterSidebarProps {
  postCount: number
}

export default function JournalFilterSidebar({ postCount }: JournalFilterSidebarProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer after navigation completes (URL category changes).
  // setMobileOpen(false) on initial mount is a no-op since drawer starts closed.
  useEffect(() => {
    setMobileOpen(false)
  }, [category])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const activeLabel = category ? (CATEGORY_LABELS[category as PostCategory] ?? category) : null

  const pillStyle = (active: boolean) => ({
    borderColor: active ? 'var(--forest)' : 'var(--line)',
    background: active ? 'var(--forest)' : 'transparent',
    color: active ? 'var(--paper)' : 'var(--ink)',
  })
  const pillClass = 'px-3 py-1 border rounded-full text-[11px] font-mono tracking-[0.08em] whitespace-nowrap transition-all duration-200 hover:border-[var(--ink)]'

  return (
    <>
      {/* ── Mobile: sticky trigger (< lg) ─────────────────────────── */}
      <div
        className="lg:hidden sticky z-20 flex items-center justify-end py-3 mb-3 -mx-4 px-4 sm:-mx-6 sm:px-6"
        style={{ top: `${NAV_H}px` }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 hover:border-[var(--forest)] hover:text-[var(--forest)]"
          style={{
            background: 'var(--paper)',
            borderColor: category ? 'var(--forest)' : 'var(--line)',
            color: category ? 'var(--forest)' : 'var(--muted)',
          }}
        >
          Filter by
          {activeLabel && (
            <span
              className="text-[11px] normal-case tracking-normal"
              style={{ color: 'var(--forest)' }}
            >
              · {activeLabel}
            </span>
          )}
          {category && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
              style={{ background: 'var(--clay)', color: 'var(--paper)' }}
            >
              1
            </span>
          )}
          <ChevronDown size={11} />
        </button>
      </div>

      {/* ── Desktop: bordered panel sidebar (lg+) ─────────────────── */}
      <aside
        className="hidden lg:block flex-shrink-0 sticky"
        style={{ top: '90px', width: '220px' }}
      >
        <div
          className="flex flex-col border rounded-sm"
          style={{ background: 'var(--paper)', borderColor: 'var(--line)', overflowY: 'auto' }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            <span
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--muted)' }}
            >
              Filter by
              {category && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                  style={{ background: 'var(--clay)', color: 'var(--paper)' }}
                >
                  1
                </span>
              )}
            </span>
            {category && (
              <Link
                href="/journal"
                scroll={false}
                className="font-mono text-[10px] uppercase tracking-[0.1em] underline underline-offset-2 transition-opacity hover:opacity-60"
                style={{ color: 'var(--clay)' }}
              >
                Clear
              </Link>
            )}
          </div>

          {/* Category pills */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <div
              className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5"
              style={{ color: 'var(--muted)' }}
            >
              Category
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link href="/journal" scroll={false} className={pillClass} style={pillStyle(!category)}>
                All articles
              </Link>
              {ALL_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/journal?category=${cat}`}
                  scroll={false}
                  className={pillClass}
                  style={pillStyle(category === cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </div>

          {/* Article count */}
          <div className="px-5 py-3">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--muted)' }}
            >
              {postCount} article{postCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </aside>

      {/* ── Mobile: slide-in drawer ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop — starts below navbar so nav remains accessible */}
            <motion.div
              className="lg:hidden fixed inset-x-0 bottom-0 z-[108]"
              style={{ top: `${NAV_H}px`, background: 'rgba(0,0,0,0.45)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel — starts below navbar */}
            <motion.div
              className="lg:hidden fixed left-0 bottom-0 z-[110] flex flex-col border-r"
              style={{
                top: `${NAV_H}px`,
                width: 'min(320px, 90vw)',
                background: 'var(--paper)',
                borderColor: 'var(--line)',
                overflowY: 'auto',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--line-soft)' }}
              >
                <span
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--muted)' }}
                >
                  Filter by
                  {category && (
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                      style={{ background: 'var(--clay)', color: 'var(--paper)' }}
                    >
                      1
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-4">
                  {/* "Clear filter" is a plain text link — visually distinct from the close button */}
                  {category && (
                    <Link
                      href="/journal"
                      scroll={false}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] underline underline-offset-2 transition-opacity hover:opacity-60"
                      style={{ color: 'var(--clay)' }}
                    >
                      Clear filter
                    </Link>
                  )}
                  {/* Close button — icon-only, clearly a dismiss action */}
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--line)]"
                    style={{ color: 'var(--muted)' }}
                    aria-label="Close filters"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Category pills — no onClick close; useEffect handles it after navigation */}
              <div className="px-5 py-4 flex-1" style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5"
                  style={{ color: 'var(--muted)' }}
                >
                  Category
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href="/journal"
                    scroll={false}
                    className={pillClass}
                    style={pillStyle(!category)}
                  >
                    All articles
                  </Link>
                  {ALL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/journal?category=${cat}`}
                      scroll={false}
                      className={pillClass}
                      style={pillStyle(category === cat)}
                    >
                      {CATEGORY_LABELS[cat]}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-5 py-5 flex-shrink-0"
                style={{ borderTop: '1px solid var(--line-soft)' }}
              >
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-10 rounded-full font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-90"
                  style={{ background: 'var(--forest)', color: 'var(--paper)' }}
                >
                  View {postCount} article{postCount !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
