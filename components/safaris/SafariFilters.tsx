'use client'

import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Input, { Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { SafariFilters } from '@/types'

interface SafariFiltersProps {
  filters: SafariFilters
  onFiltersChange: (filters: Partial<SafariFilters>) => void
  onReset: () => void
  total?: number
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'gorilla', label: 'Gorilla Trekking' },
  { value: 'beach', label: 'Beach & Safari' },
  { value: 'mountain', label: 'Mountain' },
]

const difficultyOptions = [
  { value: '', label: 'Any Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
]

const durationOptions = [
  { value: '', label: 'Any Duration' },
  { value: '1-3', label: '1–3 Days' },
  { value: '4-7', label: '4–7 Days' },
  { value: '8-14', label: '8–14 Days' },
  { value: '15+', label: '15+ Days' },
]

const tierOptions = [
  { value: '', label: 'All Tiers' },
  { value: 'budget', label: 'Budget' },
  { value: 'midRange', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
]

const sortOptions = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'duration_asc', label: 'Shortest First' },
]

const hasActiveFilters = (f: SafariFilters) =>
  !!(f.search || f.category || f.difficulty || f.tier || f.minDays || f.maxDays)

export default function SafariFilters({
  filters,
  onFiltersChange,
  onReset,
  total,
}: SafariFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const active = hasActiveFilters(filters)

  const handleDuration = useCallback(
    (value: string) => {
      if (!value) return onFiltersChange({ minDays: undefined, maxDays: undefined })
      const [min, max] = value.split('-')
      onFiltersChange({
        minDays: parseInt(min),
        maxDays: max ? parseInt(max) : undefined,
      })
    },
    [onFiltersChange]
  )

  const durationValue =
    filters.minDays && filters.maxDays
      ? `${filters.minDays}-${filters.maxDays}`
      : filters.minDays
      ? `${filters.minDays}+`
      : ''

  return (
    <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-4 sm:p-5 mb-8">
      {/* Primary row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search safaris, parks, countries…"
            value={filters.search ?? ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full h-10 pl-9 pr-3 font-sans text-sm text-bone-ink bg-bone-bg border border-[rgba(23,22,18,0.18)] rounded placeholder:text-bone-ink/35 focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors"
          />
        </div>

        {/* Category */}
        <Select
          options={categoryOptions}
          value={filters.category ?? ''}
          onChange={(e) => onFiltersChange({ category: e.target.value as SafariFilters['category'] || undefined })}
          className="sm:w-44"
        />

        {/* Sort */}
        <Select
          options={sortOptions}
          value={filters.sort ?? 'rating'}
          onChange={(e) => onFiltersChange({ sort: e.target.value as SafariFilters['sort'] })}
          className="sm:w-44"
        />

        {/* Advanced toggle */}
        <Button
          variant={showAdvanced ? 'secondary' : 'outline'}
          size="md"
          leftIcon={<SlidersHorizontal size={14} />}
          onClick={() => setShowAdvanced((v) => !v)}
          className="whitespace-nowrap"
        >
          Filters
          {active && (
            <span className="ml-1 w-4 h-4 rounded-full bg-bone-clay text-bone-paper text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[rgba(23,22,18,0.1)]">
              <Select
                label="Difficulty"
                options={difficultyOptions}
                value={filters.difficulty ?? ''}
                onChange={(e) =>
                  onFiltersChange({ difficulty: e.target.value as SafariFilters['difficulty'] || undefined })
                }
              />
              <Select
                label="Duration"
                options={durationOptions}
                value={durationValue}
                onChange={(e) => handleDuration(e.target.value)}
              />
              <Select
                label="Tier"
                options={tierOptions}
                value={filters.tier ?? ''}
                onChange={(e) =>
                  onFiltersChange({ tier: e.target.value as SafariFilters['tier'] || undefined })
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results + reset row */}
      {(active || total !== undefined) && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(23,22,18,0.08)]">
          {total !== undefined && (
            <p className="text-xs text-bone-ink/50 font-sans">
              {total} safari{total !== 1 ? 's' : ''} found
            </p>
          )}
          {active && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-bone-ink/50 hover:text-bone-clay transition-colors font-sans ml-auto"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
