'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface JumpNavLink { label: string; href: string }

interface JumpNavProps {
  links: JumpNavLink[]
  label?: string
  vertical?: boolean
}

export default function JumpNav({ links, label = 'Jump to', vertical = false }: JumpNavProps) {
  const [activeId, setActiveId]   = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!vertical) return
    const ids = links.map(l => l.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-15% 0px -65% 0px' }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [links, vertical])

  /* ── Vertical mode ────────────────────────────────────────────────── */
  if (vertical) {
    const activeLabel = links.find(l => l.href === `#${activeId}`)?.label

    return (
      <>
        {/* Mobile: sticky collapsible bar */}
        <div
          className="lg:hidden sticky z-20"
          style={{
            top: '56px',
            background: 'var(--paper, #faf6ec)',
            borderBottom: '1px solid rgba(31,29,24,0.12)',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3"
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--forest, #2a3a2a)' }}
            >
              {label}
            </span>
            <div className="flex items-center gap-2.5">
              {activeLabel && (
                <span
                  className="text-[12px] font-medium font-sans"
                  style={{ color: 'var(--forest, #2a3a2a)' }}
                >
                  {activeLabel}
                </span>
              )}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--muted)' }}
              />
            </div>
          </button>

          {mobileOpen && (
            <div
              className="px-4 pb-3"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '2px' }}
            >
              {links.map((l) => {
                const isActive = activeId === l.href.replace('#', '')
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 px-3 rounded-sm text-[13px] font-sans transition-colors duration-150"
                    style={{
                      background: isActive ? 'rgba(42,58,42,0.09)' : 'transparent',
                      color:      isActive ? 'var(--forest, #2a3a2a)' : 'var(--ink)',
                      fontWeight: isActive ? '500' : '400',
                    }}
                  >
                    {l.label}
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Desktop: sidebar nav list */}
        <nav aria-label={label} className="hidden lg:block">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em] pb-4 mb-3"
            style={{
              color: 'var(--forest, #2a3a2a)',
              borderBottom: '1.5px solid rgba(42,58,42,0.18)',
            }}
          >
            {label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {links.map((l) => {
              const isActive = activeId === l.href.replace('#', '')
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative flex items-center px-3 py-[9px] rounded-sm text-[13px] font-sans leading-snug transition-all duration-150"
                    style={{
                      background: isActive
                        ? 'rgba(42,58,42,0.08)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--forest, #2a3a2a)'
                        : 'rgba(31,29,24,0.72)',
                      fontWeight: isActive ? '500' : '400',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)'
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(31,29,24,0.72)'
                    }}
                  >
                    {/* Active indicator bar */}
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
                      style={{
                        width:   '2.5px',
                        height:  isActive ? '18px' : '0px',
                        opacity: isActive ? 1 : 0,
                        background: 'var(--clay, #9d4519)',
                      }}
                    />
                    <span className="pl-1">{l.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </>
    )
  }

  /* ── Horizontal mode (unchanged) ─────────────────────────────────── */
  return (
    <nav
      className="bg-bone-paper sticky top-14 z-30"
      style={{
        padding: '22px 0',
        borderTop: '1px solid rgba(31,29,24,0.14)',
        borderBottom: '1px solid rgba(31,29,24,0.14)',
      }}
    >
      <div className="container-site">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-muted mr-2">
            {label}
          </span>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-1.5 text-[12px] text-bone-ink transition-all duration-200 hover:border-bone-clay hover:text-bone-clay"
              style={{ border: '1px solid rgba(31,29,24,0.14)', borderRadius: '999px' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
