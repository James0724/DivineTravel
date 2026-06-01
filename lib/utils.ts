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

export function formatDuration(days: number): string {
  if (days === 1) return '1 Day'
  if (days < 7) return `${days} Days`
  const weeks = Math.floor(days / 7)
  const remainder = days % 7
  if (remainder === 0) return weeks === 1 ? '1 Week' : `${weeks} Weeks`
  return `${weeks}W ${remainder}D`
}

export function getLowestPrice(pricing: {
  budget: { pricePerPerson: number }
  midRange: { pricePerPerson: number }
  luxury: { pricePerPerson: number }
}): number {
  return Math.min(
    pricing.budget.pricePerPerson,
    pricing.midRange.pricePerPerson,
    pricing.luxury.pricePerPerson
  )
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
