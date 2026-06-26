'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { LANGUAGE_META } from '@/i18n/languageMeta'
import FlagIcon from '@/components/ui/FlagIcon'

export default function LanguageSwitcher({
  className,
  variant = 'text',
  dropDirection = 'down',
}: {
  className?: string
  variant?: 'text' | 'pill'
  dropDirection?: 'down' | 'up'
}) {
  const t = useTranslations('common')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return routing.locales
    return routing.locales.filter((code) => {
      const meta = LANGUAGE_META[code]
      return code.toLowerCase().includes(q) || meta.nativeName.toLowerCase().includes(q)
    })
  }, [query])

  const activeMeta = LANGUAGE_META[locale]

  function selectLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale })
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          variant === 'pill'
            ? 'flex items-center gap-1 rounded-full border border-bone-ink/15 bg-bone-paper px-2.5 py-1 text-[10px] font-semibold text-bone-ink/80 transition-all hover:border-bone-clay hover:bg-white hover:text-bone-clay'
            : 'flex items-center gap-1.5 font-mono text-[12px] tracking-[0.04em] text-bone-ink/75 hover:text-bone-clay transition-colors',
        )}
        aria-label={t('languageSwitcher.ariaLabel')}
        aria-expanded={open}
      >
        {variant !== 'pill' && <Globe size={12} strokeWidth={2} aria-hidden="true" />}
        <FlagIcon countryCode={activeMeta.countryCode} className="h-[9px] w-3" />
        <span className="uppercase">{locale}</span>
        <ChevronDown
          size={variant === 'pill' ? 8 : 12}
          strokeWidth={2}
          className={cn(
            'text-bone-ink/50 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropDirection === 'up' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropDirection === 'up' ? 4 : -4 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
              'absolute right-0 z-[300] w-[260px] overflow-hidden rounded-xl border border-bone-ink/12 bg-white',
              'shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-black/5',
              dropDirection === 'up' ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]',
            )}
          >
            <div className="flex items-center justify-between border-b border-bone-ink/8 bg-bone-bg/40 px-2.5 py-1.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-bone-ink/55">
                {t('languageSwitcher.selectTitle')}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-bone-ink/40 transition-colors hover:bg-bone-ink/10 hover:text-bone-ink/70"
                aria-label={t('menu.close')}
              >
                <X size={10} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <div className="px-1.5 pt-1.5">
              <div className="relative">
                <Search size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-bone-ink/35" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('languageSwitcher.searchPlaceholder')}
                  className="h-7 w-full rounded-md border border-bone-ink/12 bg-white pl-7 pr-2 text-[11px] text-bone-ink placeholder:text-bone-ink/40 outline-none focus:border-bone-clay focus:ring-1 focus:ring-bone-clay/35"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-[12px] text-bone-ink/45 font-sans">
                {t('languageSwitcher.noResults')}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-0.5 p-1.5">
                {filtered.map((code) => {
                  const meta = LANGUAGE_META[code]
                  const active = code === locale
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => selectLocale(code)}
                      className={cn(
                        'flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] leading-tight transition-all',
                        active
                          ? 'bg-gradient-to-r from-bone-clay/10 to-bone-clay/5 font-semibold text-bone-clay ring-1 ring-bone-clay/25'
                          : 'text-bone-ink/70 hover:bg-bone-bg/60',
                      )}
                    >
                      <FlagIcon countryCode={meta.countryCode} className="h-[10px] w-3.5" />
                      <span className="min-w-0 flex-1 truncate font-medium" title={meta.nativeName}>
                        {meta.nativeName}
                      </span>
                      <span className="shrink-0 text-[8px] font-bold uppercase text-bone-ink/40">
                        {code}
                      </span>
                      {active && <span className="shrink-0 text-[9px] text-bone-clay">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="border-t border-bone-ink/8 px-2.5 py-1.5">
              <p className="text-center text-[9px] leading-snug text-bone-ink/55">
                {t('languageSwitcher.availableIn')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
