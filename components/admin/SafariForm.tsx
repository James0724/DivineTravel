'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, X, ChevronDown, ChevronUp, ArrowLeft, FolderOpen, AlertCircle, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import { SafariSchema, SafariFormValues } from '@/lib/validations/safari'
import type { Safari } from '@/types'

const MediaPicker = dynamic(() => import('@/components/admin/MediaPicker'), { ssr: false })

/* ─── Constants ──────────────────────────────────────────────────────────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const ACTIVITY_SAFARI_TYPES = [
  { value: 'game-drive',   label: 'Wildlife & Game Viewing' },
  { value: 'walking',      label: 'Walking Safari' },
  { value: 'photographic', label: 'Photography Safari' },
  { value: 'cultural',     label: 'Cultural Safari' },
  { value: 'adventure',    label: 'Adventure Safari' },
  { value: 'family',       label: 'Family Safari' },
  { value: 'birding',      label: 'Bird Watching Safari' },
  { value: 'fly-in',       label: 'Fly-in Safari' },
  { value: 'small-group',  label: 'Budget & Group Safari' },
]

const DIFFICULTIES = [
  { value: 'easy',        label: 'Easy' },
  { value: 'moderate',    label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
]

/* ─── Default inclusions / exclusions ────────────────────────────────────── */

const DEFAULT_INCLUSIONS = [
  'All park fees & conservancy charges',
  'Game drives as specified in the itinerary',
  'Professional English-speaking guide',
  'Full board meals (where specified)',
  'Airport / hotel transfers',
  'Drinking water during safaris',
]

const DEFAULT_EXCLUSIONS = [
  'International airfare',
  'Visa fees',
  'Travel insurance',
  'Personal expenses (laundry, phone calls, shopping)',
  'Tips & gratuities',
  'Alcoholic & soft beverages (unless specified)',
]

// Ordered default season calendar for multi-day safaris.
// When "Add Season" is clicked the next entry in this list is pre-filled.
const DEFAULT_SEASONS = [
  { seasonLabel: 'Low Season',  dateRange: 'Oct 21 – Dec 21, 2025' },
  { seasonLabel: 'Peak Season', dateRange: 'Dec 22, 2025 – Jan 2, 2026' },
  { seasonLabel: 'Low Season',  dateRange: 'Jan 3, 2026 – Jun 10, 2026' },
  { seasonLabel: 'High Season', dateRange: 'Jun 11, 2026 – Oct 30, 2026' },
  { seasonLabel: 'Low Season',  dateRange: 'Nov 1, 2026 – Dec 21, 2026' },
  { seasonLabel: 'Peak Season', dateRange: 'Dec 22, 2026 – Jan 2, 2027' },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function blankItineraryDay(day: number) {
  return { day, title: '', description: '', meals: [] as string[], accommodation: '', activities: [] as string[] }
}

function blankItineraryStop(order: number) {
  return { order, title: '', durationLabel: '', description: '', activities: [] as string[] }
}

function blankHotelLocation() {
  return { country: '', countries: [] as string[], region: '', regions: [] as string[], park: '', parks: [] as string[] }
}

function blankHotel() {
  return { name: '', rating: 3, location: blankHotelLocation() }
}

function withHotelLocationDefaults(hotels?: { name: string; rating: number; location?: ReturnType<typeof blankHotelLocation> }[]) {
  return (hotels ?? []).map((h) => ({
    name: h.name,
    rating: h.rating,
    location: h.location ?? blankHotelLocation(),
  }))
}

// Return a season row pre-filled with the nth default season, or a blank row if exhausted
function blankSeasonRow(index = 0) {
  const def = DEFAULT_SEASONS[index]
  return {
    seasonLabel: def?.seasonLabel ?? 'Low Season',
    dateRange:   def?.dateRange   ?? '',
    per2: 0, per3: 0, per4: 0, per5: 0, per6: 0,
  }
}

function blankPricingTier() {
  return {
    currency: 'USD',
    includes: [...DEFAULT_INCLUSIONS],
    accommodationType: '',
    hotels: [] as ReturnType<typeof blankHotel>[],
    // Pre-populate all 6 default seasons so the table is ready to fill in
    rows: DEFAULT_SEASONS.map((s) => ({ ...s, per2: 0, per3: 0, per4: 0, per5: 0, per6: 0 })),
  }
}

// Migrate an old-format tier (pricePerPerson) to new seasonal-rows format.
// Pass isShort=true for budget tier on a short safari — produces exactly ONE flat row.
function migratePricingTier(tier: Safari['pricing']['budget'], isShort = false) {
  const rows = (tier as unknown as { rows?: { seasonLabel: string; dateRange: string; per2: number; per3: number; per4: number; per5: number; per6: number }[] }).rows
  const hasRows = Array.isArray(rows) && rows.length > 0

  let migratedRows: typeof rows
  if (isShort) {
    // One flat row only — take existing rows[0] or seed from legacy pricePerPerson
    if (hasRows) {
      migratedRows = [rows[0]]
    } else if (tier.pricePerPerson) {
      const p = tier.pricePerPerson
      migratedRows = [{ seasonLabel: 'Flat Rate', dateRange: '', per2: p, per3: p, per4: p, per5: p, per6: p }]
    } else {
      migratedRows = []
    }
  } else {
    migratedRows = hasRows
      ? rows
      : tier.pricePerPerson
        ? DEFAULT_SEASONS.map((s) => ({ ...s, per2: tier.pricePerPerson!, per3: tier.pricePerPerson!, per4: tier.pricePerPerson!, per5: tier.pricePerPerson!, per6: tier.pricePerPerson! }))
        : DEFAULT_SEASONS.map((s) => ({ ...s, per2: 0, per3: 0, per4: 0, per5: 0, per6: 0 }))
  }

  return {
    currency: tier.currency || 'USD',
    includes: tier.includes?.filter(Boolean).length ? tier.includes.filter(Boolean) : [],
    accommodationType: tier.accommodationType || '',
    hotels: withHotelLocationDefaults(tier.hotels),
    rows: migratedRows,
  }
}

const defaultValues: SafariFormValues & { coverImage: string } = {
  name: '',
  tagline: '',
  description: '',
  location: { country: '', countries: [], region: '', regions: [], park: '', parks: [] },
  duration: 1,
  durationLabel: '1 day',
  tripLength: 'multi-day',
  highlights: [],
  included: [...DEFAULT_INCLUSIONS],
  excluded: [...DEFAULT_EXCLUSIONS],
  itinerary: [blankItineraryDay(1)],
  itineraryStops: [],
  pricing: {
    budget:   blankPricingTier(),
    midRange: blankPricingTier(),
    luxury:   blankPricingTier(),
  },
  safariType: ['game-drive'],
  difficulty: 'moderate',
  maxGroupSize: 8,
  minGroupSize: 2,
  minAge: 5,
  bestSeason: ['July'],
  featured: false,
  active: true,
  coverImage: '',
  seo: { metaTitle: '', metaDescription: '', keywords: [] },
}

function collectErrorMessages(node: unknown, messages: string[] = []): string[] {
  if (!node || typeof node !== 'object') return messages
  const obj = node as Record<string, unknown>
  if (typeof obj.message === 'string' && obj.message) messages.push(obj.message)
  for (const key of Object.keys(obj)) {
    if (key === 'message' || key === 'type' || key === 'types' || key === 'ref') continue
    collectErrorMessages(obj[key], messages)
  }
  return messages
}

/* ─── ArrayField ─────────────────────────────────────────────────────────── */

function ArrayField({
  label, values, onChange, placeholder = 'Add item…', hint, error, required,
}: {
  label: string; values: string[]; onChange: (v: string[]) => void
  placeholder?: string; hint?: string; error?: string; required?: boolean
}) {
  const [draft, setDraft] = useState('')
  const add = () => { const v = draft.trim(); if (v) { onChange([...values, v]); setDraft('') } }
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); add() } }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-bone-ink/80 font-sans">
        {label}{required && <span className="text-bone-clay ml-0.5">*</span>}
      </label>
      {hint && !error && <p className="text-xs text-bone-ink/45 font-sans -mt-1">{hint}</p>}
      {values.filter(Boolean).length > 0 && (
        <ul className="flex flex-col gap-1">
          {values.filter(Boolean).map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-sans">
              <span className="mt-0.5 text-bone-clay text-xs">–</span>
              <span className="flex-1 text-bone-ink/80">{v}</span>
              <button type="button" onClick={() => remove(i)} className="text-bone-ink/30 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} placeholder={placeholder}
          className={`flex-1 h-9 px-3 font-sans text-sm text-bone-ink bg-bone-paper border rounded focus:outline-none focus:ring-1 transition-colors placeholder:text-bone-ink/35 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-[rgba(23,22,18,0.2)] focus:border-bone-forest focus:ring-bone-forest/30'}`}
        />
        <button type="button" onClick={add} className="h-9 px-3 rounded bg-bone-bg border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-forest hover:border-bone-forest transition-colors text-sm font-sans flex items-center gap-1">
          <Plus size={13} /> Add
        </button>
      </div>
      {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
    </div>
  )
}

/* ─── Duration helpers ───────────────────────────────────────────────────── */

// Parse a human-readable duration string into decimal days for DB storage / filtering.
// Examples: "6 hrs" → 0.25 | "7 days" → 7 | "Half day" → 0.5 | "3 days 4 hrs" → 3.17
function parseDurationDays(label: string): number {
  const s = label.toLowerCase().trim()
  if (!s) return 1
  if (s.includes('half day') || s.includes('half-day')) return 0.5
  if (s.includes('full day') || s.includes('full-day')) return 1
  const hrMatch  = s.match(/(\d+(?:\.\d+)?)\s*(?:hr|hrs|hour|hours)/)
  const dayMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:day|days|night|nights)/)
  const hours = hrMatch  ? parseFloat(hrMatch[1])  : 0
  const days  = dayMatch ? parseFloat(dayMatch[1]) : 0
  if (days > 0) return days + hours / 24
  if (hours > 0) return hours / 24
  const num = parseFloat(s)
  return isNaN(num) ? 1 : num
}

/* ─── PricingTableEditor ─────────────────────────────────────────────────── */

type SeasonRow = { seasonLabel: string; dateRange: string; per2: number; per3: number; per4: number; per5: number; per6: number }
type PricingTierValue = SafariFormValues['pricing']['budget']
type PricingTierErrors = Partial<Record<keyof PricingTierValue, { message?: string }>> & {
  hotels?: { name?: { message?: string }; rating?: { message?: string } }[]
  rows?: { seasonLabel?: { message?: string }; per2?: { message?: string } }[] | { message?: string }
}

// Shared class for all table cell inputs — solid, no spinners
const cellInput = [
  'w-full h-8 px-2 text-xs font-sans text-bone-ink',
  'bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded',
  'focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/25',
  'placeholder:text-bone-ink/30',
  // Hide number-input spinners in all browsers
  '[appearance:textfield]',
  '[&::-webkit-outer-spin-button]:appearance-none',
  '[&::-webkit-inner-spin-button]:appearance-none',
].join(' ')

const seasonTextInput = [
  'w-full h-8 px-2 text-xs font-sans text-bone-ink',
  'bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded',
  'focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/25',
  'placeholder:text-bone-ink/30',
].join(' ')

function PricingTableEditor({
  rows, onChange, isShort, errors,
}: {
  rows: SeasonRow[]; onChange: (rows: SeasonRow[]) => void; isShort: boolean
  errors?: { message?: string } | { seasonLabel?: { message?: string } }[] | undefined
}) {
  const paxCols: { key: keyof SeasonRow; label: string }[] = [
    { key: 'per2', label: '2 pax' }, { key: 'per3', label: '3 pax' },
    { key: 'per4', label: '4 pax' }, { key: 'per5', label: '5 pax' }, { key: 'per6', label: '6 pax' },
  ]

  const updateRow = (i: number, patch: Partial<SeasonRow>) => {
    const updated = [...rows]
    updated[i] = { ...updated[i], ...patch }
    onChange(updated)
  }
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i))
  // Add next default season in sequence; fall back to blank if all defaults used
  const addRow = () => onChange([...rows, blankSeasonRow(rows.length)])

  const errorMsg = Array.isArray(errors) ? undefined : (errors as { message?: string } | undefined)?.message
  const displayRows = isShort ? rows.slice(0, 1) : rows

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-bone-ink/80 font-sans">
          Pricing Table <span className="text-bone-clay">*</span>
          <span className="ml-2 text-bone-ink/40 font-normal text-xs">— prices per person (USD)</span>
        </label>
        {!isShort && (
          <button type="button" onClick={addRow}
            className="flex items-center gap-1 text-xs font-sans text-bone-forest hover:text-bone-forest/70 transition-colors">
            <Plus size={12} /> Add Season
          </button>
        )}
      </div>

      {errorMsg && <p className="text-xs text-red-600 font-sans">{errorMsg}</p>}

      <div className="overflow-x-auto rounded border border-[rgba(23,22,18,0.15)]">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-bone-bg border-b border-[rgba(23,22,18,0.1)]">
              {!isShort && (
                <th className="text-left px-3 py-2.5 font-medium text-bone-ink/60 min-w-[200px]">
                  Season / Date Range
                </th>
              )}
              {paxCols.map((c) => (
                <th key={c.key} className="text-center px-2 py-2.5 font-medium text-bone-ink/60 min-w-[88px]">
                  {c.label}
                </th>
              ))}
              {!isShort && <th className="w-9" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(23,22,18,0.07)]">
            {displayRows.map((row, i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-bone-bg/40' : 'bg-bone-paper'}>
                {!isShort && (
                  <td className="px-2 py-2 space-y-1.5">
                    <input
                      value={row.seasonLabel}
                      onChange={(e) => updateRow(i, { seasonLabel: e.target.value })}
                      placeholder="e.g. Low Season"
                      className={seasonTextInput}
                    />
                    <input
                      value={row.dateRange}
                      onChange={(e) => updateRow(i, { dateRange: e.target.value })}
                      placeholder="e.g. Oct 21 – Dec 21, 2025"
                      className={seasonTextInput}
                    />
                  </td>
                )}
                {paxCols.map((c) => (
                  <td key={c.key} className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      value={row[c.key] === 0 ? '' : row[c.key]}
                      onChange={(e) => updateRow(i, { [c.key]: e.target.value === '' ? 0 : Number(e.target.value) } as Partial<SeasonRow>)}
                      placeholder="0"
                      className={cellInput + ' text-center'}
                    />
                  </td>
                ))}
                {!isShort && (
                  <td className="px-1 py-2 text-center">
                    {rows.length > 1 ? (
                      <button type="button" onClick={() => removeRow(i)} className="text-bone-ink/25 hover:text-red-500 transition-colors p-1 rounded">
                        <X size={13} />
                      </button>
                    ) : (
                      <span className="block w-7" />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isShort && (
        <p className="text-[11px] text-bone-ink/40 font-sans">
          Tip: The frontend shows the lowest 6-pax price across all seasons as the &ldquo;From&rdquo; price.
        </p>
      )}
    </div>
  )
}

/* ─── ShortSafariPricingTable ────────────────────────────────────────────── */

// Simple flat pricing table for short (sub-day) safaris: one row, one rate per pax count.
function ShortSafariPricingTable({
  values, onChange, errors,
}: {
  values: PricingTierValue
  onChange: (v: Partial<PricingTierValue>) => void
  errors?: PricingTierErrors
}) {
  const paxCols: { key: keyof SeasonRow; label: string }[] = [
    { key: 'per2', label: '2 pax' }, { key: 'per3', label: '3 pax' },
    { key: 'per4', label: '4 pax' }, { key: 'per5', label: '5 pax' }, { key: 'per6', label: '6 pax' },
  ]
  const rows = values.rows?.length ? (values.rows as SeasonRow[]) : [blankSeasonRow()]
  const row = rows[0]

  const updatePax = (key: keyof SeasonRow, val: number) => {
    // Always save exactly ONE flat row — discard any legacy multi-season rows
    onChange({ rows: [{ ...row, [key]: val }] })
  }

  const errorMsg = Array.isArray(errors?.rows) ? undefined : (errors?.rows as { message?: string } | undefined)?.message

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-bone-ink/80 font-sans">
          Flat Rates <span className="text-bone-clay">*</span>
          <span className="ml-2 text-bone-ink/40 font-normal text-xs">— per person (USD)</span>
        </label>
      </div>
      {errorMsg && <p className="text-xs text-red-600 font-sans">{errorMsg}</p>}
      <div className="overflow-x-auto rounded border border-[rgba(23,22,18,0.15)]">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-bone-bg border-b border-[rgba(23,22,18,0.1)]">
              <th className="text-left px-3 py-2.5 font-medium text-bone-ink/60 min-w-[130px]">
                Group size
              </th>
              {paxCols.map((c) => (
                <th key={c.key} className="text-center px-2 py-2.5 font-medium text-bone-ink/60 min-w-[88px]">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-bone-paper">
              <td className="px-3 py-2.5 font-medium text-bone-ink/70">Rate / person</td>
              {paxCols.map((c) => (
                <td key={c.key} className="px-2 py-2">
                  <input
                    type="number" min={0}
                    value={(row[c.key] as number) === 0 ? '' : (row[c.key] as number)}
                    onChange={(e) => updatePax(c.key, e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className={cellInput + ' text-center'}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="px-3 py-1.5 text-[11px] text-bone-ink/35 font-sans border-t border-[rgba(23,22,18,0.06)]">
          6 pax rate = best per-person price shown on the public page
        </p>
      </div>
    </div>
  )
}

/* ─── PricingTierSection ─────────────────────────────────────────────────── */

function PricingTierSection({
  tier, label, values, onChange, errors, isShort,
}: {
  tier: 'budget' | 'midRange' | 'luxury'; label: string
  values: PricingTierValue; onChange: (v: Partial<PricingTierValue>) => void
  errors?: PricingTierErrors; isShort: boolean
}) {
  const colors: Record<string, string> = {
    budget: 'border-l-blue-400', midRange: 'border-l-amber-400', luxury: 'border-l-bone-clay',
  }

  return (
    <div className={`pl-4 border-l-2 ${colors[tier]} space-y-4`}>
      <h4 className="text-sm font-semibold font-sans text-bone-ink uppercase tracking-wide">{label}</h4>

      <Input
        label="Accommodation type"
        value={values.accommodationType}
        onChange={(e) => onChange({ accommodationType: e.target.value })}
        placeholder="e.g. En-suite Tented Lodge"
        error={errors?.accommodationType?.message}
        required
      />

      <PricingTableEditor
        rows={(values.rows ?? []).length ? (values.rows as SeasonRow[]) : [blankSeasonRow()]}
        onChange={(rows) => onChange({ rows })}
        isShort={isShort}
        errors={errors?.rows as PricingTierErrors['rows']}
      />

      <ArrayField
        label="What's included"
        required
        values={values.includes}
        onChange={(v) => onChange({ includes: v })}
        placeholder="Add inclusion…"
        hint="Press Enter or click Add"
        error={errors?.includes?.message}
      />

      {/* Hotels */}
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Accommodation Hotels</label>
          <p className="text-xs text-bone-ink/45 font-sans mt-0.5">
            1–3 hotels shown on the public safari page. Location fields are optional.
          </p>
        </div>

        {(values.hotels ?? []).map((hotel, i) => {
          const hotelError = errors?.hotels?.[i]
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <input type="text" value={hotel.name}
                  onChange={(e) => { const u = [...(values.hotels ?? [])]; u[i] = { ...u[i], name: e.target.value }; onChange({ hotels: u }) }}
                  placeholder="Hotel name…"
                  className={`flex-1 h-9 px-3 font-sans text-sm text-bone-ink bg-bone-paper border rounded focus:outline-none focus:ring-1 transition-colors placeholder:text-bone-ink/35 ${hotelError?.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-[rgba(23,22,18,0.2)] focus:border-bone-forest focus:ring-bone-forest/30'}`}
                />
                <select value={hotel.rating}
                  onChange={(e) => { const u = [...(values.hotels ?? [])]; u[i] = { ...u[i], rating: Number(e.target.value) }; onChange({ hotels: u }) }}
                  className="h-9 px-2 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest">
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                </select>
                <button type="button" onClick={() => onChange({ hotels: (values.hotels ?? []).filter((_, idx) => idx !== i) })}
                  className="text-bone-ink/30 hover:text-red-500 transition-colors flex-shrink-0"><X size={13} /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([{ key: 'country', placeholder: 'Country…' }, { key: 'region', placeholder: 'Region/area…' }, { key: 'park', placeholder: 'Park/reserve…' }] as const).map(({ key, placeholder }) => (
                  <input key={key} type="text" value={hotel.location?.[key] ?? ''}
                    onChange={(e) => { const u = [...(values.hotels ?? [])]; u[i] = { ...u[i], location: { ...(u[i].location ?? blankHotelLocation()), [key]: e.target.value } }; onChange({ hotels: u }) }}
                    placeholder={placeholder}
                    className="h-8 px-2.5 font-sans text-xs text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 placeholder:text-bone-ink/35"
                  />
                ))}
              </div>
              {(hotelError?.name?.message || hotelError?.rating?.message) && (
                <p className="text-xs text-red-600 font-sans">{hotelError?.name?.message || hotelError?.rating?.message}</p>
              )}
            </div>
          )
        })}

        <button type="button" onClick={() => onChange({ hotels: [...(values.hotels ?? []), blankHotel()] })}
          className="flex items-center gap-1.5 text-sm font-sans text-bone-forest hover:text-bone-forest/70 transition-colors self-start">
          <Plus size={13} /> Add Hotel
        </button>
      </div>
    </div>
  )
}

/* ─── SectionErrorBanner ─────────────────────────────────────────────────── */

function SectionErrorBanner({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200">
      <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
      {messages.length === 1
        ? <p className="text-xs text-red-700 font-sans">{messages[0]}</p>
        : <ul className="text-xs text-red-700 font-sans space-y-1 list-disc list-inside">{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </div>
  )
}

/* ─── CollapsibleSection ─────────────────────────────────────────────────── */

function CollapsibleSection({ title, subtitle, isOpen, hasError, onToggle, children }: {
  title: string; subtitle?: string; isOpen: boolean; hasError?: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className={`bg-bone-paper border rounded-md overflow-hidden ${hasError ? 'border-red-400' : 'border-[rgba(23,22,18,0.12)]'}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-2">
          {hasError && <AlertCircle size={14} className="text-red-500 flex-shrink-0" />}
          <div>
            <p className={`font-sans font-semibold text-sm ${hasError ? 'text-red-600' : 'text-bone-ink'}`}>{title}</p>
            {subtitle && <p className="text-xs text-bone-ink/45 font-sans mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {isOpen ? <ChevronUp size={15} className="text-bone-ink/40 flex-shrink-0" /> : <ChevronDown size={15} className="text-bone-ink/40 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-6 border-t border-[rgba(23,22,18,0.07)] pt-5 space-y-5">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function SafariForm({ existing }: { existing?: Safari }) {
  const router = useRouter()
  const isEdit = !!existing

  const {
    register, handleSubmit, control, watch, setValue, getValues,
    formState: { errors, isSubmitting },
  } = useForm<SafariFormValues>({
    resolver: zodResolver(SafariSchema),
    defaultValues: existing
      ? {
          name:        existing.name,
          tagline:     existing.tagline,
          description: existing.description,
          location: {
            ...existing.location,
            countries: existing.location.countries?.length ? existing.location.countries : existing.location.country ? [existing.location.country] : [],
            regions:   existing.location.regions?.length   ? existing.location.regions   : existing.location.region  ? [existing.location.region]  : [],
            parks:     existing.location.parks?.length     ? existing.location.parks     : existing.location.park    ? [existing.location.park]    : [],
          },
          duration:       existing.duration,
          durationLabel:  existing.durationLabel ||
            (existing.tripLength === 'short'
              ? `${Math.round(existing.duration * 24)} hrs`
              : `${existing.duration} day${existing.duration !== 1 ? 's' : ''}`),
          tripLength:     existing.tripLength ?? 'multi-day',
          highlights:     existing.highlights ?? [],
          included:       existing.included?.filter(Boolean).length ? existing.included.filter(Boolean) : [...DEFAULT_INCLUSIONS],
          excluded:       existing.excluded?.filter(Boolean).length ? existing.excluded.filter(Boolean) : [...DEFAULT_EXCLUSIONS],
          itinerary:      existing.itinerary.length ? existing.itinerary : [blankItineraryDay(1)],
          itineraryStops: existing.itineraryStops?.length ? existing.itineraryStops : [],
          pricing: {
            budget:   migratePricingTier(existing.pricing.budget, existing.tripLength === 'short'),
            midRange: migratePricingTier(existing.pricing.midRange),
            luxury:   migratePricingTier(existing.pricing.luxury),
          },
          safariType:   existing.safariType?.length ? existing.safariType : ['game-drive'],
          difficulty:   existing.difficulty,
          maxGroupSize: existing.maxGroupSize,
          minGroupSize: existing.minGroupSize,
          minAge:       existing.minAge,
          bestSeason:   existing.bestSeason,
          featured:     existing.featured,
          active:       existing.active,
          seo:          existing.seo ?? {},
        }
      : defaultValues,
  })

  const [coverImage,         setCoverImage]         = useState(existing?.coverImage ?? '')
  const [coverImagePublicId, setCoverImagePublicId] = useState(existing?.coverImagePublicId ?? '')
  const [imageGallery, setImageGallery] = useState<{ url: string; alt: string; publicId: string }[]>(
    existing?.images?.filter((img) => img.url && img.publicId)?.map((img) => ({ url: img.url, alt: img.alt, publicId: img.publicId ?? '' })) ?? []
  )
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false)
  const [saveError,         setSaveError]         = useState<string | null>(null)
  const [isSavingDraft,     setIsSavingDraft]     = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true, location: true, details: true, content: false,
    itinerary: false, pricing: true, images: false, seo: false,
  })

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  const { fields: itineraryFields, append: appendDay, remove: removeDay }   = useFieldArray({ control, name: 'itinerary' })
  const { fields: itineraryStopFields, append: appendStop, remove: removeStop } = useFieldArray({ control, name: 'itineraryStops' })

  const watchedTripLength  = watch('tripLength') ?? 'multi-day'

  // Auto-select all months for short safaris (available year-round)
  // Also seed one blank stop when switching to short with no stops yet
  useEffect(() => {
    if (watchedTripLength === 'short') {
      setValue('bestSeason', MONTHS, { shouldValidate: false })
      if (itineraryStopFields.length === 0) appendStop(blankItineraryStop(1))
    }
  }, [watchedTripLength]) // eslint-disable-line react-hooks/exhaustive-deps

  const watchedDurationLabel = watch('durationLabel') ?? ''

  // Auto-compute numeric duration (days) whenever the label changes — keeps DB sortable
  useEffect(() => {
    if (watchedDurationLabel.trim()) {
      const parsed = parseDurationDays(watchedDurationLabel)
      setValue('duration', Math.max(0.1, Math.min(60, parsed)), { shouldValidate: false })
    }
  }, [watchedDurationLabel]) // eslint-disable-line react-hooks/exhaustive-deps

  const watchedHighlights  = watch('highlights') ?? []
  const watchedIncluded    = watch('included')   ?? []
  const watchedExcluded    = watch('excluded')   ?? []
  const watchedBestSeason  = watch('bestSeason') ?? []
  const watchedSafariType  = watch('safariType') ?? []
  const watchedFeatured    = watch('featured')
  const watchedActive      = watch('active')
  const watchedCountries   = watch('location.countries') ?? []
  const watchedRegions     = watch('location.regions')   ?? []
  const watchedParks       = watch('location.parks')     ?? []
  const watchedMetaTitle       = watch('seo.metaTitle')       ?? ''
  const watchedMetaDescription = watch('seo.metaDescription') ?? ''

  const knownSafariTypeValues = ACTIVITY_SAFARI_TYPES.map((t) => t.value)
  const unknownSafariTypes = watchedSafariType.filter((t) => !knownSafariTypeValues.includes(t))

  const removeUnknownSafariType = (val: string) =>
    setValue('safariType', watchedSafariType.filter((t) => t !== val) as typeof watchedSafariType, { shouldValidate: true })

  const toggleMonth = (month: string) => {
    const current = watch('bestSeason') ?? []
    setValue('bestSeason', current.includes(month) ? current.filter((m) => m !== month) : [...current, month])
  }

  const toggleSafariType = (type: string) => {
    const current = watch('safariType') ?? []
    const next = current.includes(type as never) ? current.filter((t) => t !== type) : [...current, type as never]
    setValue('safariType', next as typeof current)
  }

  /* ── Build payload ── */
  const buildPayload = (data: SafariFormValues, overrides?: { active?: boolean }) => ({
    ...data,
    ...overrides,
    location: { ...data.location, country: data.location.countries?.[0] ?? '', region: data.location.regions?.[0] ?? '', park: data.location.parks?.[0] ?? '' },
    coverImage,
    coverImagePublicId,
    images: imageGallery.filter((img) => img.url.trim() && img.publicId.trim()).map((img) => ({ url: img.url, publicId: img.publicId, alt: img.alt || data.name })),
    highlights: data.highlights.filter(Boolean),
    included:   data.included.filter(Boolean),
    excluded:   data.excluded.filter(Boolean),
  })

  /* ── Submit (publish) ── */
  const onSubmit = async (data: SafariFormValues) => {
    setSaveError(null)
    try {
      const url    = isEdit ? `/api/safaris/${existing!._id}` : '/api/safaris'
      const method = isEdit ? 'PATCH' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(data)) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save safari')
      toast.success(isEdit ? 'Safari updated!' : 'Safari created!')
      await new Promise((r) => setTimeout(r, 800))
      router.push('/admin/safaris')
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save safari'
      setSaveError(msg); toast.error(msg)
    }
  }

  /* ── Save as Draft (bypasses Zod, saves active:false) ── */
  const saveDraft = async () => {
    const name = getValues('name')
    if (!name?.trim()) { toast.error('Enter a safari name before saving a draft'); return }
    setSaveError(null); setIsSavingDraft(true)
    try {
      const raw = getValues()
      const url    = isEdit ? `/api/safaris/${existing!._id}` : '/api/safaris'
      const method = isEdit ? 'PATCH' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(raw, { active: false })) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save draft')
      toast.success('Draft saved!')
      // For new safaris, navigate to edit page so future saves are PATCHes
      if (!isEdit && json.data?._id) {
        router.push(`/admin/safaris/${json.data._id}`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save draft'
      setSaveError(msg); toast.error(msg)
    } finally {
      setIsSavingDraft(false)
    }
  }

  /* ── Validation error handler ── */
  const onValidationError = (errs: FieldErrors<SafariFormValues>) => {
    const sectionMap: Record<string, boolean> = {
      basic:     !!(errs.name || errs.tagline || errs.description),
      location:  !!errs.location,
      details:   !!(errs.duration || errs.durationLabel || errs.tripLength || errs.difficulty || errs.safariType || errs.bestSeason || errs.maxGroupSize || errs.minGroupSize || errs.minAge),
      content:   !!(errs.highlights || errs.included || errs.excluded),
      itinerary: !!(errs.itinerary || errs.itineraryStops),
      pricing:   !!errs.pricing,
      seo:       !!errs.seo,
    }
    setOpenSections((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.entries(sectionMap).filter(([, v]) => v).map(([k]) => [k, true])),
    }))
    const messages = Array.from(new Set(collectErrorMessages(errs)))
    if (messages.length === 0) toast.error('Please fix the highlighted errors before saving')
    else if (messages.length === 1) toast.error(messages[0])
    else toast.error(`${messages[0]} (+${messages.length - 1} more issue${messages.length - 1 > 1 ? 's' : ''} — see highlighted sections below)`)
  }

  const sectionErrors = {
    basic:     !!(errors.name || errors.tagline || errors.description),
    location:  !!errors.location,
    details:   !!(errors.duration || errors.durationLabel || errors.tripLength || errors.difficulty || errors.safariType || errors.bestSeason || errors.maxGroupSize || errors.minGroupSize || errors.minAge),
    content:   !!(errors.highlights || errors.included || errors.excluded),
    itinerary: !!(errors.itinerary || errors.itineraryStops),
    pricing:   !!errors.pricing,
    images:    false,
    seo:       !!errors.seo,
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="space-y-5 max-w-4xl">

      {/* Saving overlay */}
      {(isSubmitting || isSavingDraft) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-bone-paper/80 backdrop-blur-[2px]">
          <div className="w-10 h-10 border-2 border-bone-forest border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-bone-ink/70">{isSavingDraft ? 'Saving draft…' : isEdit ? 'Saving changes…' : 'Creating safari…'}</p>
        </div>
      )}

      {/* Back link */}
      <Link href="/admin/safaris" className="inline-flex items-center gap-1.5 text-sm font-sans text-bone-ink/50 hover:text-bone-ink transition-colors">
        <ArrowLeft size={14} /> Back to Safaris
      </Link>

      {/* Page title */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-bone-ink">{isEdit ? 'Edit Safari' : 'Add New Safari'}</h1>
        <p className="text-sm text-bone-ink/45 font-sans mt-1">
          {isEdit ? `Editing: ${existing!.name}` : 'Fill in the details below. Required fields are marked *.'}
        </p>
      </div>

      {/* Inline save error */}
      {saveError && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-md bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-sans text-red-700">{saveError}</p>
        </div>
      )}

      {/* ════════════ 1 · BASIC INFO ════════════ */}
      <CollapsibleSection title="Basic Information" subtitle="Name, tagline, description and status" isOpen={openSections.basic} hasError={sectionErrors.basic} onToggle={() => toggleSection('basic')}>
        <SectionErrorBanner messages={Array.from(new Set([...collectErrorMessages(errors.name), ...collectErrorMessages(errors.tagline), ...collectErrorMessages(errors.description)]))} />
        <div className="grid grid-cols-1 gap-4">
          <Input label="Safari Name" {...register('name')} placeholder="e.g. 7-Day Masai Mara & Amboseli Safari" error={errors.name?.message} required />
          <Input label="Tagline" {...register('tagline')} placeholder="One compelling sentence about this safari…" error={errors.tagline?.message} required />
          <Textarea label="Full Description" {...register('description')} rows={6} placeholder="Detailed description of the experience…" error={errors.description?.message} required />
        </div>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={watchedActive} onChange={(e) => setValue('active', e.target.checked)} className="w-4 h-4 accent-bone-forest rounded" />
            <span className="text-sm font-sans text-bone-ink/75">Published <span className="text-bone-ink/40">(visible on site)</span></span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={watchedFeatured} onChange={(e) => setValue('featured', e.target.checked)} className="w-4 h-4 accent-bone-clay rounded" />
            <span className="text-sm font-sans text-bone-ink/75">Featured <span className="text-bone-ink/40">(show on homepage)</span></span>
          </label>
        </div>
      </CollapsibleSection>

      {/* ════════════ 2 · LOCATION ════════════ */}
      <CollapsibleSection title="Location" subtitle="Countries, regions and parks / reserves" isOpen={openSections.location} hasError={sectionErrors.location} onToggle={() => toggleSection('location')}>
        <SectionErrorBanner messages={Array.from(new Set(collectErrorMessages(errors.location)))} />
        <ArrayField label="Countries" required values={watchedCountries} onChange={(v) => setValue('location.countries', v, { shouldValidate: true })} placeholder="e.g. Kenya" hint="Add every country this safari visits. First entry is the primary." error={(errors.location?.countries as { message?: string } | undefined)?.message} />
        <ArrayField label="Regions / Areas" values={watchedRegions} onChange={(v) => setValue('location.regions', v, { shouldValidate: true })} placeholder="e.g. Rift Valley" hint="Add each region or area covered by this safari." />
        <ArrayField label="Parks & Reserves" required values={watchedParks} onChange={(v) => setValue('location.parks', v, { shouldValidate: true })} placeholder="e.g. Masai Mara National Reserve" hint="Add every park or reserve visited. First entry is the primary." error={(errors.location?.parks as { message?: string } | undefined)?.message} />
      </CollapsibleSection>

      {/* ════════════ 3 · DETAILS ════════════ */}
      <CollapsibleSection title="Safari Details" subtitle="Duration, group size, safari type, best season" isOpen={openSections.details} hasError={sectionErrors.details} onToggle={() => toggleSection('details')}>
        <SectionErrorBanner messages={Array.from(new Set([...collectErrorMessages(errors.duration), ...collectErrorMessages(errors.durationLabel), ...collectErrorMessages(errors.tripLength), ...collectErrorMessages(errors.difficulty), ...collectErrorMessages(errors.safariType), ...collectErrorMessages(errors.bestSeason), ...collectErrorMessages(errors.maxGroupSize), ...collectErrorMessages(errors.minGroupSize), ...collectErrorMessages(errors.minAge)]))} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Trip length <span className="text-bone-clay">*</span></label>
          <p className="text-xs text-bone-ink/45 font-sans -mt-1">Controls which itinerary editor shows below and whether pricing uses seasonal rows (multi-day) or a single year-round row (short).</p>
          <div className="flex gap-3">
            {([{ value: 'multi-day', label: 'Multi-day (1+ nights)' }, { value: 'short', label: 'Short (under a day)' }] as const).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={opt.value} {...register('tripLength')} className="accent-bone-forest" />
                <span className="text-sm font-sans text-bone-ink/75">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              label="Duration"
              {...register('durationLabel')}
              placeholder={watchedTripLength === 'short' ? 'e.g. 6 hrs, Half day, 3 hours' : 'e.g. 7 days, 10 days, 5 nights'}
              error={errors.durationLabel?.message || errors.duration?.message}
              required
            />
            <p className="text-[11px] text-bone-ink/40 font-sans mt-1">Type naturally — "6 hrs", "7 days", "Half day". Numeric value auto-computed for filtering.</p>
          </div>
          <Input label="Min group size" type="number" {...register('minGroupSize', { valueAsNumber: true })} min={1} error={errors.minGroupSize?.message} />
          <Input label="Max group size" type="number" {...register('maxGroupSize', { valueAsNumber: true })} min={1} error={errors.maxGroupSize?.message} />
          <Input label="Minimum age" type="number" {...register('minAge', { valueAsNumber: true })} min={0} max={18} error={errors.minAge?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Difficulty <span className="text-bone-clay">*</span></label>
          <div className="flex gap-3">
            {DIFFICULTIES.map((d) => (
              <label key={d.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={d.value} {...register('difficulty')} className="accent-bone-forest" />
                <span className="text-sm font-sans text-bone-ink/75">{d.label}</span>
              </label>
            ))}
          </div>
          {errors.difficulty && <p className="text-xs text-red-600 font-sans">{errors.difficulty.message}</p>}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-bone-ink/80 font-sans">Safari Type <span className="text-bone-clay">*</span></label>
            <p className="text-xs text-bone-ink/45 font-sans mt-0.5">Style of experience — a package can have more than one type</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_SAFARI_TYPES.map((t) => {
              const active = watchedSafariType.includes(t.value as never)
              return (
                <button key={t.value} type="button" onClick={() => toggleSafariType(t.value)}
                  className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-colors ${active ? 'bg-bone-clay text-white border-bone-clay' : 'bg-transparent text-bone-ink/55 border-[rgba(23,22,18,0.2)] hover:border-bone-clay hover:text-bone-clay'}`}>
                  {t.label}
                </button>
              )
            })}
          </div>
          {unknownSafariTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unknownSafariTypes.map((val) => (
                <button key={val} type="button" onClick={() => removeUnknownSafariType(val)}
                  className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                  "{val}" — legacy, click to remove <X size={12} />
                </button>
              ))}
            </div>
          )}
          {errors.safariType && <p className="text-xs text-red-600 font-sans">{collectErrorMessages(errors.safariType)[0] ?? 'Select at least one safari type'}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Best Season <span className="text-bone-clay">*</span></label>
          {watchedTripLength === 'short' && (
            <p className="text-[11px] text-bone-ink/40 font-sans -mt-0.5">Short safaris run year-round — all months are selected automatically.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((month) => {
              const active = watchedBestSeason.includes(month)
              const isShortSafari = watchedTripLength === 'short'
              return (
                <button key={month} type="button"
                  onClick={() => !isShortSafari && toggleMonth(month)}
                  disabled={isShortSafari}
                  className={`text-xs font-sans px-2.5 py-1 rounded border transition-colors ${active ? 'bg-bone-clay text-white border-bone-clay' : 'bg-transparent text-bone-ink/55 border-[rgba(23,22,18,0.2)] hover:border-bone-clay hover:text-bone-clay'} ${isShortSafari ? 'cursor-default' : ''}`}>
                  {month.slice(0, 3)}
                </button>
              )
            })}
          </div>
          {errors.bestSeason && <p className="text-xs text-red-600 font-sans">{errors.bestSeason.message as string}</p>}
        </div>
      </CollapsibleSection>

      {/* ════════════ 4 · CONTENT ARRAYS ════════════ */}
      <CollapsibleSection title="Highlights, Inclusions & Exclusions" subtitle="What guests experience, what's included and what's not" isOpen={openSections.content} hasError={sectionErrors.content} onToggle={() => toggleSection('content')}>
        <SectionErrorBanner messages={Array.from(new Set([...collectErrorMessages(errors.highlights), ...collectErrorMessages(errors.included), ...collectErrorMessages(errors.excluded)]))} />

        <ArrayField
          label="Highlights"
          values={watchedHighlights}
          onChange={(v) => setValue('highlights', v, { shouldValidate: true })}
          placeholder="Add a highlight…"
          hint="Key selling points shown on the safari detail page"
        />

        <div className="h-px bg-[rgba(23,22,18,0.07)]" />

        <ArrayField
          label="What's Included"
          required
          values={watchedIncluded}
          onChange={(v) => setValue('included', v, { shouldValidate: true })}
          placeholder="Add inclusion…"
          error={errors.included?.message as string | undefined}
        />

        <div className="h-px bg-[rgba(23,22,18,0.07)]" />

        <ArrayField
          label="What's Excluded"
          values={watchedExcluded}
          onChange={(v) => setValue('excluded', v)}
          placeholder="Add exclusion…"
        />
      </CollapsibleSection>

      {/* ════════════ 5 · ITINERARY ════════════ */}
      <CollapsibleSection
        title={watchedTripLength === 'short' ? 'Itinerary Stops' : 'Day-by-Day Itinerary'}
        subtitle={watchedTripLength === 'short' ? 'Hour/segment breakdown for this sub-day excursion' : 'Detailed programme for each day of the safari'}
        isOpen={openSections.itinerary} hasError={sectionErrors.itinerary} onToggle={() => toggleSection('itinerary')}>
        <SectionErrorBanner messages={Array.from(new Set([...collectErrorMessages(errors.itinerary), ...collectErrorMessages(errors.itineraryStops)]))} />

        {watchedTripLength === 'short' ? (
          <div className="space-y-5">
            {itineraryStopFields.map((field, index) => (
              <div key={field.id} className="border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
                <div className="flex items-center justify-between bg-bone-bg px-4 py-2.5">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-bone-ink/60">Stop {index + 1}</span>
                  {itineraryStopFields.length > 1 && <button type="button" onClick={() => removeStop(index)} className="text-bone-ink/30 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>}
                </div>
                <div className="px-4 py-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Stop title" {...register(`itineraryStops.${index}.title`)} placeholder="e.g. Crater floor descent" error={errors.itineraryStops?.[index]?.title?.message} required />
                    <Input label="Duration label" {...register(`itineraryStops.${index}.durationLabel`)} placeholder="e.g. 9:00 - 11:00, 2 hrs" error={errors.itineraryStops?.[index]?.durationLabel?.message} required />
                  </div>
                  <Textarea label="Description" {...register(`itineraryStops.${index}.description`)} rows={3} placeholder="What happens during this stop…" error={errors.itineraryStops?.[index]?.description?.message} required />
                  <Controller control={control} name={`itineraryStops.${index}.activities`} render={({ field }) => (
                    <ArrayField label="Activities" values={(field.value as string[]) ?? []} onChange={field.onChange} placeholder="Add activity…" />
                  )} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendStop(blankItineraryStop(itineraryStopFields.length + 1))} className="flex items-center gap-2 text-sm font-sans text-bone-forest hover:text-bone-forest/70 transition-colors">
              <Plus size={15} /> Add Stop
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {itineraryFields.map((field, index) => (
              <div key={field.id} className="border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
                <div className="flex items-center justify-between bg-bone-bg px-4 py-2.5">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-bone-ink/60">Day {index + 1}</span>
                  {itineraryFields.length > 1 && <button type="button" onClick={() => removeDay(index)} className="text-bone-ink/30 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>}
                </div>
                <div className="px-4 py-4 space-y-4">
                  <Input label="Day title" {...register(`itinerary.${index}.title`)} placeholder="e.g. Nairobi → Masai Mara" error={errors.itinerary?.[index]?.title?.message} required />
                  <Textarea label="Description" {...register(`itinerary.${index}.description`)} rows={3} placeholder="What happens on this day…" error={errors.itinerary?.[index]?.description?.message} required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-bone-ink/80 font-sans">Meals</label>
                      <div className="flex flex-wrap gap-2">
                        {['Breakfast', 'Lunch', 'Dinner', 'Bush Lunch', 'Packed Lunch'].map((meal) => {
                          const meals = (watch(`itinerary.${index}.meals`) ?? []) as string[]
                          const on = meals.includes(meal)
                          return (
                            <button key={meal} type="button"
                              onClick={() => { const cur = (watch(`itinerary.${index}.meals`) ?? []) as string[]; setValue(`itinerary.${index}.meals`, on ? cur.filter((m) => m !== meal) : [...cur, meal]) }}
                              className={`text-xs px-2.5 py-1 rounded border font-sans transition-colors ${on ? 'bg-bone-forest text-bone-paper border-bone-forest' : 'text-bone-ink/50 border-[rgba(23,22,18,0.18)] hover:border-bone-forest hover:text-bone-forest'}`}>
                              {meal}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <Input label="Accommodation" {...register(`itinerary.${index}.accommodation`)} placeholder="See tier / Camp name" />
                  </div>
                  <Controller control={control} name={`itinerary.${index}.activities`} render={({ field }) => (
                    <ArrayField label="Activities" values={(field.value as string[]) ?? []} onChange={field.onChange} placeholder="Add activity…" />
                  )} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendDay(blankItineraryDay(itineraryFields.length + 1))} className="flex items-center gap-2 text-sm font-sans text-bone-forest hover:text-bone-forest/70 transition-colors">
              <Plus size={15} /> Add Day
            </button>
          </div>
        )}
      </CollapsibleSection>

      {/* ════════════ 6 · PRICING ════════════ */}
      <CollapsibleSection
        title={watchedTripLength === 'short' ? 'Pricing' : 'Pricing Tiers'}
        subtitle={watchedTripLength === 'short' ? 'Flat per-person rates by group size' : 'Budget, mid-range and luxury pricing — seasonal tables'}
        isOpen={openSections.pricing} hasError={sectionErrors.pricing} onToggle={() => toggleSection('pricing')}>
        <SectionErrorBanner messages={Array.from(new Set(collectErrorMessages(errors.pricing)))} />

        {watchedTripLength === 'short' ? (
          /* ── Short safari: one flat rate table, no tiers ── */
          <div className="space-y-5">
            <div className="px-3.5 py-2.5 rounded-md bg-bone-bg border border-[rgba(23,22,18,0.12)] text-xs font-sans text-bone-ink/60">
              Short safari — flat rate per group size. No seasonal pricing, no budget / mid-range / luxury split.
            </div>
            <Controller control={control} name="pricing.budget"
              render={({ field }) => (
                <div className="space-y-5">
                  <ShortSafariPricingTable
                    values={field.value}
                    onChange={(v) => field.onChange({ ...field.value, ...v })}
                    errors={errors.pricing?.budget as PricingTierErrors}
                  />
                  <ArrayField
                    label="What's included"
                    required
                    values={field.value.includes ?? []}
                    onChange={(v) => field.onChange({ ...field.value, includes: v })}
                    placeholder="Add inclusion…"
                    hint="Press Enter or click Add"
                    error={(errors.pricing?.budget as PricingTierErrors)?.includes?.message}
                  />
                </div>
              )}
            />
          </div>
        ) : (
          /* ── Multi-day: three tier sections ── */
          <div className="space-y-8">
            {([{ tier: 'budget' as const, label: 'Budget' }, { tier: 'midRange' as const, label: 'Mid-Range' }, { tier: 'luxury' as const, label: 'Luxury' }]).map(({ tier, label }) => (
              <Controller key={tier} control={control} name={`pricing.${tier}`}
                render={({ field }) => (
                  <PricingTierSection
                    tier={tier} label={label}
                    values={field.value}
                    onChange={(v) => field.onChange({ ...field.value, ...v })}
                    errors={errors.pricing?.[tier] as PricingTierErrors}
                    isShort={false}
                  />
                )}
              />
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* ════════════ 7 · IMAGES ════════════ */}
      <CollapsibleSection title="Images" subtitle="Cover image and gallery" isOpen={openSections.images} onToggle={() => toggleSection('images')}>
        <ImageUpload label="Cover Image" required usage="safari-cover" value={coverImage} publicId={coverImagePublicId}
          onChange={(url, publicId) => { setCoverImage(url); setCoverImagePublicId(publicId) }}
          onClear={() => { setCoverImage(''); setCoverImagePublicId('') }}
          aspectRatio="16/9" hint="Main listing image and OG image — required"
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-bone-ink/80 font-sans">Gallery Images <span className="ml-1.5 text-bone-ink/40 font-normal">({imageGallery.length})</span></label>
            <button type="button" onClick={() => setGalleryPickerOpen(true)} className="flex items-center gap-1.5 text-xs font-sans text-bone-forest hover:text-bone-clay transition-colors">
              <FolderOpen size={13} /> Add from library
            </button>
          </div>
          {imageGallery.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {imageGallery.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-[rgba(23,22,18,0.12)]">
                  <Image src={img.url} alt={img.alt || `Gallery ${i + 1}`} fill className="object-cover" sizes="120px" unoptimized />
                  <button type="button" onClick={() => setImageGallery(imageGallery.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {imageGallery.length === 0 && <p className="text-xs text-bone-ink/40 font-sans">No gallery images yet — click "Add from library" above.</p>}
        </div>
        {galleryPickerOpen && (
          <MediaPicker usage="safari-gallery"
            onSelect={(url, publicId) => { setImageGallery(prev => [...prev, { url, publicId, alt: '' }]); setGalleryPickerOpen(false) }}
            onClose={() => setGalleryPickerOpen(false)}
          />
        )}
      </CollapsibleSection>

      {/* ════════════ 8 · SEO ════════════ */}
      <CollapsibleSection title="SEO" subtitle="Search engine meta title, description and keywords" isOpen={openSections.seo} hasError={sectionErrors.seo} onToggle={() => toggleSection('seo')}>
        {sectionErrors.seo && (
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-sans">The meta title or description is too long. Shorten until the counter turns black.</p>
          </div>
        )}
        <Input label="Meta Title" {...register('seo.metaTitle')} placeholder="e.g. 7-Day Masai Mara Safari | Divine Travel Nest"
          error={errors.seo?.metaTitle ? `${errors.seo.metaTitle.message} — currently ${watchedMetaTitle.length}, remove ${watchedMetaTitle.length - 60}` : undefined}
          hint={`${watchedMetaTitle.length}/60 characters`}
        />
        <Textarea label="Meta Description" {...register('seo.metaDescription')} rows={3} placeholder="Compelling description for Google search results…"
          error={errors.seo?.metaDescription ? `${errors.seo.metaDescription.message} — currently ${watchedMetaDescription.length}, remove ${watchedMetaDescription.length - 160}` : undefined}
          hint={`${watchedMetaDescription.length}/160 characters`}
        />
        <Controller control={control} name="seo.keywords" render={({ field }) => (
          <ArrayField label="Keywords" values={(field.value as string[]) ?? []} onChange={field.onChange} placeholder="Add keyword…" hint="Press Enter or click Add" />
        )} />
      </CollapsibleSection>

      {/* ════════════ SUBMIT ════════════ */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {isEdit ? 'Save Changes' : 'Publish Safari'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={saveDraft} loading={isSavingDraft}
          className="flex items-center gap-2">
          <Save size={15} /> Save as Draft
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.push('/admin/safaris')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
