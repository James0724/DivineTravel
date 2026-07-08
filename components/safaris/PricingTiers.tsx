'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn, getPriceTierLabel } from '@/lib/utils'
import { useCurrency } from '@/lib/currency/useCurrency'
import Button from '@/components/ui/Button'
import type { Safari, PriceTier, SeasonalPriceRow } from '@/types'

interface PricingTiersProps {
  safari: Safari
  selectedTier: PriceTier | null
  onSelect: (tier: PriceTier) => void
}

interface TierConfig {
  label: string
  subtitle: string
  color: string
  selectedColor: string
  badge: string
  button: 'outline' | 'secondary' | 'clay'
  popular?: boolean
}

const tierConfig: Record<string, TierConfig> = {
  budget: {
    label: 'Budget',
    subtitle: 'Great value, authentic adventure',
    color: 'border-blue-200 hover:border-blue-400',
    selectedColor: 'border-blue-500 bg-blue-50/60',
    badge: 'bg-blue-100 text-blue-700',
    button: 'outline',
  },
  midRange: {
    label: 'Mid-Range',
    subtitle: 'Comfort meets wilderness',
    color: 'border-amber-200 hover:border-amber-400',
    selectedColor: 'border-amber-500 bg-amber-50/60',
    badge: 'bg-amber-100 text-amber-700',
    button: 'secondary',
    popular: true,
  },
  luxury: {
    label: 'Luxury',
    subtitle: 'Ultimate safari indulgence',
    color: 'border-bone-clay/25 hover:border-bone-clay/60',
    selectedColor: 'border-bone-clay bg-bone-clay/5',
    badge: 'bg-bone-clay/15 text-bone-clay',
    button: 'clay',
  },
}

// Return the cheapest per6 price across all seasonal rows (lowest-season 6-pax price)
function getFromPrice(tier: Safari['pricing']['budget']): number {
  if (!tier) return 0
  if (tier.rows?.length) {
    const per6s = tier.rows.map((r) => r.per6).filter((p): p is number => typeof p === 'number' && p > 0)
    return per6s.length ? Math.min(...per6s) : 0
  }
  return tier.pricePerPerson ?? 0
}

// Price table component shared inside each tier card
function PriceTable({ rows, isShort, displayPrice }: {
  rows: SeasonalPriceRow[]
  isShort: boolean
  displayPrice: (usd: number) => string
}) {
  if (!rows?.length) return null

  const paxCols: { key: keyof SeasonalPriceRow; label: string }[] = [
    { key: 'per1', label: 'Solo' },
    { key: 'per2', label: '2 pax' },
    { key: 'per3', label: '3 pax' },
    { key: 'per4', label: '4 pax' },
    { key: 'per5', label: '5 pax' },
    { key: 'per6', label: '6 pax' },
  ]

  const displayRows = isShort ? rows.slice(0, 1) : rows

  return (
    <div className="overflow-x-auto rounded border border-[rgba(23,22,18,0.1)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-bone-bg/60">
            {!isShort && (
              <th className="text-left px-2.5 py-2 font-sans font-medium text-bone-ink/50 border-b border-[rgba(23,22,18,0.08)]">
                Season
              </th>
            )}
            {paxCols.map((c) => (
              <th key={c.key} className="text-center px-2 py-2 font-sans font-medium text-bone-ink/50 border-b border-[rgba(23,22,18,0.08)]">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-transparent' : 'bg-bone-bg/30'}>
              {!isShort && (
                <td className="px-2.5 py-2 font-sans text-bone-ink/70">
                  <span className="block font-medium">{row.seasonLabel}</span>
                  {row.dateRange && (
                    <span className="block text-[10px] text-bone-ink/40 mt-0.5">{row.dateRange}</span>
                  )}
                </td>
              )}
              {paxCols.map((c) => {
                const val = row[c.key] as number
                const isMin = c.key === 'per6'
                return (
                  <td key={c.key} className={`text-center px-2 py-2 font-sans ${isMin ? 'font-semibold text-bone-forest' : 'text-bone-ink/70'}`}>
                    {val > 0 ? displayPrice(val) : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-2.5 py-1.5 text-[10px] text-bone-ink/35 font-sans border-t border-[rgba(23,22,18,0.06)]">
        Per person · {paxCols[paxCols.length - 1].label} = best rate
      </p>
    </div>
  )
}

export default function PricingTiers({ safari, selectedTier, onSelect }: PricingTiersProps) {
  const { displayPrice } = useCurrency()
  const isShort = safari.tripLength === 'short'
  const tiers = (['budget', 'midRange', 'luxury'] as PriceTier[]).map((tier) => ({
    key: tier,
    config: tierConfig[tier],
    data: safari.pricing[tier],
    fromPrice: getFromPrice(safari.pricing[tier]),
  }))

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-bone-ink mb-2">
          Choose Your Experience
        </h2>
        <p className="text-bone-ink/55 text-sm">
          All tiers include the same wildlife experience — only accommodation &amp; service level differs
        </p>
        <p className="text-bone-ink/40 text-xs mt-1">
          Prices shown per person · best rate at {isShort ? 'any group size' : '6 pax in low season'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {tiers.map(({ key, config, data, fromPrice }) => {
          const isSelected = selectedTier === key
          const rows = data?.rows ?? []

          return (
            <motion.div
              key={key}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 bg-bone-paper',
                isSelected ? config.selectedColor : config.color
              )}
              onClick={() => onSelect(key)}
            >
              {config.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-sans font-semibold px-3 py-1 rounded-full bg-bone-forest text-bone-paper shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className="mb-4">
                <span className={cn('text-xs font-sans font-semibold px-2.5 py-1 rounded-full', config.badge)}>
                  {config.label}
                </span>
                <p className="mt-2 text-xs text-bone-ink/50 font-sans">{config.subtitle}</p>
              </div>

              {/* From price */}
              <div className="mb-4 pb-4 border-b border-[rgba(23,22,18,0.1)]">
                <p className="text-xs text-bone-ink/45 font-sans mb-0.5">From</p>
                {fromPrice > 0 ? (
                  <p className="font-serif text-3xl font-bold text-bone-ink">
                    {displayPrice(fromPrice)}
                    <span className="text-sm font-sans font-normal text-bone-ink/50"> / person</span>
                  </p>
                ) : (
                  <p className="text-sm text-bone-ink/40 font-sans">Contact us for pricing</p>
                )}
                <p className="text-[10px] text-bone-ink/35 font-sans mt-0.5">
                  {isShort ? '6 pax rate' : '6 pax · low season'}
                </p>
              </div>

              {/* Accommodation */}
              {data?.accommodationType && (
                <div className="mb-4">
                  <p className="text-xs font-sans font-medium text-bone-ink/60 uppercase tracking-wide mb-1">
                    Accommodation
                  </p>
                  <p className="text-sm font-sans text-bone-ink font-medium">{data.accommodationType}</p>
                </div>
              )}

              {/* Seasonal price table */}
              {rows.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-sans font-medium text-bone-ink/60 uppercase tracking-wide mb-2">
                    {isShort ? 'Pricing' : 'Seasonal Rates'}
                  </p>
                  <PriceTable rows={rows} isShort={isShort} displayPrice={displayPrice} />
                </div>
              )}

              {/* Includes */}
              {data?.includes?.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {data.includes.slice(0, 5).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-bone-forest" />
                      <span className="text-bone-ink/70">{item}</span>
                    </li>
                  ))}
                  {data.includes.length > 5 && (
                    <li className="text-xs text-bone-ink/40 font-sans pl-5">
                      +{data.includes.length - 5} more inclusions
                    </li>
                  )}
                </ul>
              )}

              <Button
                variant={isSelected ? 'primary' : config.button}
                fullWidth size="md"
                onClick={(e) => { e.preventDefault(); onSelect(key) }}
              >
                {isSelected ? '✓ Selected' : `Book ${getPriceTierLabel(key)}`}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
