'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn, getPriceTierLabel } from '@/lib/utils'
import { useCurrency } from '@/lib/currency/useCurrency'
import Button from '@/components/ui/Button'
import type { Safari, PriceTier } from '@/types'

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

export default function PricingTiers({
  safari,
  selectedTier,
  onSelect,
}: PricingTiersProps) {
  const { displayPrice } = useCurrency()
  const tiers = (['budget', 'midRange', 'luxury'] as PriceTier[]).map(
    (tier) => ({
      key: tier,
      config: tierConfig[tier],
      data: safari.pricing[tier],
    })
  )

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-bone-ink mb-2">
          Choose Your Experience
        </h2>
        <p className="text-bone-ink/55 text-sm">
          All tiers include the same wildlife experience — only accommodation &amp;
          service level differs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {tiers.map(({ key, config, data }) => {
          const isSelected = selectedTier === key

          return (
            <motion.div
              key={key}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200',
                isSelected ? config.selectedColor : config.color,
                'bg-bone-paper'
              )}
              onClick={() => onSelect(key)}
            >
              {/* Popular badge */}
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

              {/* Price */}
              <div className="mb-4 pb-4 border-b border-[rgba(23,22,18,0.1)]">
                <p className="font-serif text-3xl font-bold text-bone-ink">
                  {displayPrice(data.pricePerPerson)}
                </p>
                <p className="text-xs text-bone-ink/45 font-sans mt-0.5">per person</p>
              </div>

              {/* Accommodation */}
              <div className="mb-4">
                <p className="text-xs font-sans font-medium text-bone-ink/60 uppercase tracking-wide mb-1">
                  Accommodation
                </p>
                <p className="text-sm font-sans text-bone-ink font-medium">
                  {data.accommodationType}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-bone-ink/65 leading-relaxed mb-5">
                {data.description}
              </p>

              {/* Includes */}
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

              {/* CTA */}
              <Button
                variant={isSelected ? 'primary' : config.button}
                fullWidth
                size="md"
                onClick={(e) => {
                  e.preventDefault()
                  onSelect(key)
                }}
              >
                {isSelected ? '✓ Selected' : `Book ${config.label}`}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
