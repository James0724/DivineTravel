import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface HeroStat { num: string; lbl: string }
export interface HeroBreadcrumb { label: string; href?: string }

interface PageHeroProps {
  image: string
  imageAlt: string
  breadcrumbs: HeroBreadcrumb[]
  title: React.ReactNode
  description: string
  stats?: HeroStat[]
  /** Eyebrow label shown above the h1 */
  eyebrow?: string
  /** Extra content (buttons etc.) rendered below the description */
  actions?: React.ReactNode
  /** Override the min-height; defaults to 'min-h-[52vh]' */
  minHeight?: string
  /** Image opacity override (0–1); defaults to 1 */
  imageOpacity?: number
  /** Add a top border + padding above the stats row */
  statsDivider?: boolean
}

export default function PageHero({
  image,
  imageAlt,
  breadcrumbs,
  title,
  description,
  stats,
  eyebrow,
  actions,
  minHeight = 'min-h-[52vh]',
  imageOpacity,
  statsDivider,
}: PageHeroProps) {
  return (
    <section className={`relative ${minHeight} flex items-end bg-bone-forest overflow-hidden`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={imageOpacity !== undefined ? { opacity: imageOpacity } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bone-ink/80 via-bone-ink/25 to-transparent" />
      <div className="relative container-site pb-16 pt-32 sm:pb-20 sm:pt-48">
        <nav className="flex items-center gap-2 text-xs text-bone-paper/55 font-sans mb-5">
          {breadcrumbs.map((bc, i) => (
            <Fragment key={bc.label}>
              {i > 0 && <ChevronRight size={12} className="opacity-50" />}
              {bc.href ? (
                <Link href={bc.href} className="hover:text-bone-paper transition-colors">
                  {bc.label}
                </Link>
              ) : (
                <span className="text-bone-paper/80">{bc.label}</span>
              )}
            </Fragment>
          ))}
        </nav>

        {eyebrow && (
          <div className="eyebrow mb-5" style={{ color: 'rgba(244,239,226,0.65)' }}>
            <span className="dot" />
            {eyebrow}
          </div>
        )}

        <h1
          className="font-serif font-light leading-[0.95] tracking-[-0.03em] text-bone-paper text-balance mb-5"
          style={{ fontSize: 'clamp(42px, 6.5vw, 96px)' }}
        >
          {title}
        </h1>
        <p className="text-bone-paper/70 text-sm max-w-2xl leading-relaxed mb-8">
          {description}
        </p>

        {actions}

        {stats && (
          <div className={`flex flex-wrap gap-8 sm:gap-10${statsDivider ? ' pt-7 border-t border-[rgba(244,239,226,0.22)]' : ''}`}>
            {stats.map((s) => (
              <div key={s.lbl}>
                <div className="font-serif text-3xl sm:text-4xl text-[#f4d4a8] leading-none mb-1">
                  {s.num}
                </div>
                <div className="text-xs text-bone-paper/55 font-mono uppercase tracking-[0.1em]">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
