import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Class merging ────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency formatting ──────────────────────────────────────────────────────

export function formatPrice(
  amount: number,
  currency = 'USD',
  compact = false
): string {
  if (compact && amount >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isDateInPast(date: string | Date): boolean {
  return new Date(date) < new Date()
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => capitalize(txt))
}

export function slugToTitle(slug: string): string {
  return titleCase(slug.replace(/-/g, ' '))
}

// ─── Safari helpers ───────────────────────────────────────────────────────────

export function getPriceTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    budget: 'Budget',
    midRange: 'Mid-Range',
    luxury: 'Luxury',
  }
  return labels[tier] ?? tier
}

export function getPriceTierColor(tier: string): string {
  const colors: Record<string, string> = {
    budget: 'bg-blue-50 text-blue-800 border-blue-200',
    midRange: 'bg-amber-50 text-amber-800 border-amber-200',
    luxury: 'bg-bone-paper text-bone-clay border-bone-clay/30',
  }
  return colors[tier] ?? ''
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-green-50 text-green-800 border-green-200',
    moderate: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    challenging: 'bg-red-50 text-red-800 border-red-200',
  }
  return colors[difficulty] ?? ''
}

// If durationLabel is provided it is shown as-is (admin's own words).
// Any sub-day value (< 1) is always shown as hours, regardless of tripLength.
export function formatDuration(value: number, tripLength?: string, durationLabel?: string): string {
  if (durationLabel?.trim()) return durationLabel.trim()
  if (tripLength === 'short' || value < 1) {
    const hours = Math.round(value * 24)
    return hours === 1 ? '1 hr' : `${hours} hrs`
  }
  if (value === 1) return '1 Day'
  if (value < 7) return `${value} Days`
  const weeks = Math.floor(value / 7)
  const remainder = value % 7
  if (remainder === 0) return weeks === 1 ? '1 Week' : `${weeks} Weeks`
  return `${weeks}W ${remainder}D`
}

function extractMinPer6(tier?: {
  rows?: { per6?: number }[]
  pricePerPerson?: number
}): number {
  if (!tier) return 0
  if (tier.rows?.length) {
    const prices = tier.rows
      .map((r) => r.per6)
      .filter((p): p is number => typeof p === 'number' && p > 0)
    return prices.length ? Math.min(...prices) : 0
  }
  return typeof tier.pricePerPerson === 'number' && tier.pricePerPerson > 0
    ? tier.pricePerPerson
    : 0
}

// Short safaris → budget tier flat rate (6 pax).
// Multi-day → midRange tier 6-pax price, fallback to budget if midRange has no data.
export function getLowestPrice(
  pricing?: {
    budget?:   { rows?: { per6?: number }[]; pricePerPerson?: number }
    midRange?: { rows?: { per6?: number }[]; pricePerPerson?: number }
    luxury?:   { rows?: { per6?: number }[]; pricePerPerson?: number }
  },
  tripLength?: string
): number {
  if (!pricing) return 0
  if (tripLength === 'short') return extractMinPer6(pricing.budget)
  return extractMinPer6(pricing.midRange) || extractMinPer6(pricing.budget)
}

export function getRatingStars(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

// ─── Object helpers ───────────────────────────────────────────────────────────

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result as Omit<T, K>
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) acc[key] = obj[key]
      return acc
    },
    {} as Pick<T, K>
  )
}

// ─── Cloudinary helpers ───────────────────────────────────────────────────────

/** Insert a Cloudinary transformation into a delivery URL. Leaves non-Cloudinary URLs untouched. */
export function cloudinaryUrl(url: string, transform: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/${transform}/`)
}

/** Square, CDN-resized thumbnail for list/grid rows — avoids downloading the full-size original. */
export function cloudinaryThumb(url: string, size = 96): string {
  return cloudinaryUrl(url, `w_${size},h_${size},c_fill,q_auto,f_auto`)
}

// ─── URL / SEO helpers ────────────────────────────────────────────────────────

export function buildAbsoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function generateKeywords(safari: {
  name: string
  location: { country: string; park: string }
  category: string[]
}): string[] {
  return [
    safari.name,
    `${safari.location.country} safari`,
    `${safari.location.park} safari`,
    ...safari.category.map((c) => `${c} safari`),
    'African safari',
    'wildlife safari',
    'safari tour',
    'Africa travel',
  ]
}
