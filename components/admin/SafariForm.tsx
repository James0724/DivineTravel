'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, X, ChevronDown, ChevronUp, ArrowLeft, FolderOpen, AlertCircle } from 'lucide-react'
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

const CATEGORIES = [
  { value: 'wildlife',   label: 'Wildlife' },
  { value: 'adventure',  label: 'Adventure' },
  { value: 'cultural',   label: 'Cultural' },
  { value: 'beach',      label: 'Beach' },
  { value: 'mountain',   label: 'Mountain' },
  { value: 'gorilla',    label: 'Gorilla' },
]

const DIFFICULTIES = [
  { value: 'easy',        label: 'Easy' },
  { value: 'moderate',    label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
]

/* ─── Defaults ───────────────────────────────────────────────────────────── */

function blankItineraryDay(day: number) {
  return {
    day,
    title: '',
    description: '',
    meals: [] as string[],
    accommodation: '',
    activities: [] as string[],
  }
}

function blankPricingTier() {
  return {
    pricePerPerson: 0,
    currency: 'USD',
    description: '',
    includes: [''],
    accommodationType: '',
    hotels: [] as { name: string; rating: number }[],
  }
}

const defaultValues: SafariFormValues & {
  coverImage: string
  itinerary: ReturnType<typeof blankItineraryDay>[]
} = {
  name: '',
  tagline: '',
  description: '',
  location: { country: '', countries: [], region: '', regions: [], park: '', parks: [] },
  duration: 1,
  highlights: [''],
  included: [''],
  excluded: [''],
  itinerary: [blankItineraryDay(1)],
  pricing: {
    budget:   blankPricingTier(),
    midRange: blankPricingTier(),
    luxury:   blankPricingTier(),
  },
  category: ['wildlife'],
  difficulty: 'easy',
  maxGroupSize: 8,
  minGroupSize: 2,
  minAge: 5,
  bestSeason: ['July'],
  featured: false,
  active: true,
  coverImage: '',
  seo: { metaTitle: '', metaDescription: '', keywords: [] },
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function ArrayField({
  label,
  values,
  onChange,
  placeholder = 'Add item…',
  hint,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  hint?: string
}) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (v) { onChange([...values, v]); setDraft('') }
  }

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-bone-ink/80 font-sans">{label}</label>
      {hint && <p className="text-xs text-bone-ink/45 font-sans -mt-1">{hint}</p>}

      {values.filter(Boolean).length > 0 && (
        <ul className="flex flex-col gap-1">
          {values.filter(Boolean).map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-sans">
              <span className="mt-0.5 text-bone-clay text-xs">–</span>
              <span className="flex-1 text-bone-ink/80">{v}</span>
              <button type="button" onClick={() => remove(i)} className="text-bone-ink/30 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="flex-1 h-9 px-3 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors placeholder:text-bone-ink/35"
        />
        <button
          type="button"
          onClick={add}
          className="h-9 px-3 rounded bg-bone-bg border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-forest hover:border-bone-forest transition-colors text-sm font-sans flex items-center gap-1"
        >
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  )
}

function PricingTierSection({
  tier,
  label,
  values,
  onChange,
  errors,
}: {
  tier: 'budget' | 'midRange' | 'luxury'
  label: string
  values: SafariFormValues['pricing']['budget']
  onChange: (v: Partial<SafariFormValues['pricing']['budget']>) => void
  errors?: Partial<Record<keyof SafariFormValues['pricing']['budget'], { message?: string }>>
}) {
  const colors: Record<string, string> = {
    budget: 'border-l-blue-400',
    midRange: 'border-l-amber-400',
    luxury: 'border-l-bone-clay',
  }

  return (
    <div className={`pl-4 border-l-2 ${colors[tier]} space-y-4`}>
      <h4 className="text-sm font-semibold font-sans text-bone-ink uppercase tracking-wide">{label}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Price per person (USD)"
          type="number"
          value={values.pricePerPerson || ''}
          onChange={(e) => onChange({ pricePerPerson: Number(e.target.value) })}
          min={0}
          error={errors?.pricePerPerson?.message}
          required
        />
        <Input
          label="Accommodation type"
          value={values.accommodationType}
          onChange={(e) => onChange({ accommodationType: e.target.value })}
          placeholder="e.g. En-suite Tented Lodge"
          error={errors?.accommodationType?.message}
          required
        />
      </div>

      <Textarea
        label="Tier description"
        value={values.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={3}
        placeholder="What makes this tier special…"
        error={errors?.description?.message}
        required
      />

      <ArrayField
        label="What's included"
        values={values.includes}
        onChange={(v) => onChange({ includes: v })}
        placeholder="Add inclusion…"
        hint="Press Enter or click Add"
      />

      {/* ── Hotels ── */}
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-sm font-medium text-bone-ink/80 font-sans">
            Accommodation Hotels
          </label>
          <p className="text-xs text-bone-ink/45 font-sans mt-0.5">
            1–3 hotels shown on the public safari page (name + star rating)
          </p>
        </div>

        {(values.hotels ?? []).map((hotel, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={hotel.name}
              onChange={(e) => {
                const updated = [...(values.hotels ?? [])]
                updated[i] = { ...updated[i], name: e.target.value }
                onChange({ hotels: updated })
              }}
              placeholder="Hotel name…"
              className="flex-1 h-9 px-3 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors placeholder:text-bone-ink/35"
            />
            <select
              value={hotel.rating}
              onChange={(e) => {
                const updated = [...(values.hotels ?? [])]
                updated[i] = { ...updated[i], rating: Number(e.target.value) }
                onChange({ hotels: updated })
              }}
              className="h-9 px-2 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onChange({ hotels: (values.hotels ?? []).filter((_, idx) => idx !== i) })}
              className="text-bone-ink/30 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange({ hotels: [...(values.hotels ?? []), { name: '', rating: 3 }] })}
          className="flex items-center gap-1.5 text-sm font-sans text-bone-forest hover:text-bone-forest/70 transition-colors self-start"
        >
          <Plus size={13} /> Add Hotel
        </button>
      </div>
    </div>
  )
}

/* ─── CollapsibleSection ─────────────────────────────────────────────────────
   Defined OUTSIDE SafariForm so React never treats it as a new component type
   across re-renders. Keeping it inside the parent causes full unmount/remount
   on every state change, losing input focus and scrolling the page to top.
────────────────────────────────────────────────────────────────────────────── */

function CollapsibleSection({
  title,
  subtitle,
  isOpen,
  hasError,
  onToggle,
  children,
}: {
  title: string
  subtitle?: string
  isOpen: boolean
  hasError?: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`bg-bone-paper border rounded-md overflow-hidden ${hasError ? 'border-red-400' : 'border-[rgba(23,22,18,0.12)]'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          {hasError && <AlertCircle size={14} className="text-red-500 flex-shrink-0" />}
          <div>
            <p className={`font-sans font-semibold text-sm ${hasError ? 'text-red-600' : 'text-bone-ink'}`}>{title}</p>
            {subtitle && <p className="text-xs text-bone-ink/45 font-sans mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {isOpen
          ? <ChevronUp size={15} className="text-bone-ink/40 flex-shrink-0" />
          : <ChevronDown size={15} className="text-bone-ink/40 flex-shrink-0" />}
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
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SafariFormValues>({
    resolver: zodResolver(SafariSchema),
    defaultValues: existing
      ? {
          name: existing.name,
          tagline: existing.tagline,
          description: existing.description,
          location: {
            ...existing.location,
            countries: existing.location.countries?.length
              ? existing.location.countries
              : existing.location.country ? [existing.location.country] : [],
            regions: existing.location.regions?.length
              ? existing.location.regions
              : existing.location.region ? [existing.location.region] : [],
            parks: existing.location.parks?.length
              ? existing.location.parks
              : existing.location.park ? [existing.location.park] : [],
          },
          duration: existing.duration,
          highlights: existing.highlights.length ? existing.highlights : [''],
          included: existing.included.length ? existing.included : [''],
          excluded: existing.excluded.length ? existing.excluded : [''],
          itinerary: existing.itinerary.length ? existing.itinerary : [blankItineraryDay(1)],
          pricing: existing.pricing,
          category: existing.category,
          difficulty: existing.difficulty,
          maxGroupSize: existing.maxGroupSize,
          minGroupSize: existing.minGroupSize,
          minAge: existing.minAge,
          bestSeason: existing.bestSeason,
          featured: existing.featured,
          active: existing.active,
          seo: existing.seo ?? {},
        }
      : defaultValues,
  })

  const [coverImage,          setCoverImage]          = useState(existing?.coverImage ?? '')
  const [coverImagePublicId,  setCoverImagePublicId]  = useState(existing?.coverImagePublicId ?? '')
  const [imageGallery, setImageGallery] = useState<{ url: string; alt: string; publicId: string }[]>(
    // Only keep gallery images that have both url and publicId so Mongoose validators don't reject the update
    existing?.images
      ?.filter((img) => img.url && img.publicId)
      ?.map((img) => ({ url: img.url, alt: img.alt, publicId: img.publicId ?? '' })) ?? []
  )
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    location: true,
    details: true,
    content: false,
    itinerary: false,
    pricing: true,
    images: false,
    seo: false,
  })

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  const { fields: itineraryFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: 'itinerary',
  })

  const watchedHighlights  = watch('highlights') ?? ['']
  const watchedIncluded    = watch('included')   ?? ['']
  const watchedExcluded    = watch('excluded')   ?? ['']
  const watchedBestSeason  = watch('bestSeason') ?? []
  const watchedCategory    = watch('category')   ?? []
  const watchedFeatured    = watch('featured')
  const watchedActive      = watch('active')
  const watchedCountries   = watch('location.countries') ?? []
  const watchedRegions     = watch('location.regions')   ?? []
  const watchedParks       = watch('location.parks')     ?? []

  const toggleMonth = (month: string) => {
    const current = watch('bestSeason') ?? []
    setValue('bestSeason',
      current.includes(month)
        ? current.filter((m) => m !== month)
        : [...current, month]
    )
  }

  const toggleCategory = (cat: string) => {
    const current = watch('category') ?? []
    const next = current.includes(cat as never)
      ? current.filter((c) => c !== cat)
      : [...current, cat as never]
    setValue('category', next as typeof current)
  }

  /* ── Submit ── */
  const onSubmit = async (data: SafariFormValues) => {
    setSaveError(null)
    const payload = {
      ...data,
      location: {
        ...data.location,
        country:  data.location.countries?.[0] ?? '',
        region:   data.location.regions?.[0]   ?? '',
        park:     data.location.parks?.[0]      ?? '',
      },
      coverImage,
      coverImagePublicId,
      images: imageGallery
        .filter((img) => img.url.trim() && img.publicId.trim())
        .map((img) => ({
          url:      img.url,
          publicId: img.publicId,
          alt:      img.alt || data.name,
        })),
      highlights: data.highlights.filter(Boolean),
      included:   data.included.filter(Boolean),
      excluded:   data.excluded.filter(Boolean),
    }

    try {
      const url    = isEdit ? `/api/safaris/${existing!._id}` : '/api/safaris'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to save safari')
      }

      toast.success(isEdit ? 'Safari updated successfully!' : 'Safari created!')
      // Small delay so the toast renders before navigation unmounts the layout
      await new Promise((r) => setTimeout(r, 800))
      router.push('/admin/safaris')
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save safari'
      setSaveError(msg)
      toast.error(msg)
    }
  }

  /* ── Validation error handler — surfaces which sections have problems ── */
  const onValidationError = (errs: FieldErrors<SafariFormValues>) => {
    const sectionMap: Record<string, boolean> = {
      basic:    !!(errs.name || errs.tagline || errs.description),
      location: !!errs.location,
      details:  !!(errs.duration || errs.difficulty || errs.category || errs.bestSeason || errs.maxGroupSize || errs.minGroupSize || errs.minAge),
      content:  !!(errs.highlights || errs.included || errs.excluded),
      itinerary: !!errs.itinerary,
      pricing:  !!errs.pricing,
      seo:      !!errs.seo,
    }

    // Open every section that contains an error so the user can see the red fields
    setOpenSections((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(sectionMap)
          .filter(([, hasErr]) => hasErr)
          .map(([key]) => [key, true])
      ),
    }))

    // Pick the first useful message to surface in the toast
    const firstMsg =
      (errs.name?.message) ||
      (errs.tagline?.message) ||
      (errs.description?.message) ||
      ((errs.location?.countries as { message?: string } | undefined)?.message) ||
      (errs.duration?.message) ||
      (errs.highlights?.message as string | undefined) ||
      (errs.itinerary?.message as string | undefined) ||
      (errs.pricing?.budget?.description?.message) ||
      'Please fix the highlighted errors before saving'

    toast.error(firstMsg as string)
  }

  /* ── Section error flags (passed as hasError to open sections) ── */
  const sectionErrors = {
    basic:    !!(errors.name || errors.tagline || errors.description),
    location: !!errors.location,
    details:  !!(errors.duration || errors.difficulty || errors.category || errors.bestSeason),
    content:  !!(errors.highlights || errors.included || errors.excluded),
    itinerary: !!errors.itinerary,
    pricing:  !!errors.pricing,
    images:   false,
    seo:      !!errors.seo,
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="space-y-5 max-w-4xl">

      {/* ── Full-page saving overlay ── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-bone-paper/80 backdrop-blur-[2px]">
          <div className="w-10 h-10 border-2 border-bone-forest border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-bone-ink/70">
            {isEdit ? 'Saving changes…' : 'Creating safari…'}
          </p>
        </div>
      )}

      {/* ── Back link ── */}
      <Link
        href="/admin/safaris"
        className="inline-flex items-center gap-1.5 text-sm font-sans text-bone-ink/50 hover:text-bone-ink transition-colors"
      >
        <ArrowLeft size={14} /> Back to Safaris
      </Link>

      {/* ── Page title ── */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-bone-ink">
          {isEdit ? 'Edit Safari' : 'Add New Safari'}
        </h1>
        <p className="text-sm text-bone-ink/45 font-sans mt-1">
          {isEdit ? `Editing: ${existing!.name}` : 'Fill in the details below. Required fields are marked *.'}
        </p>
      </div>

      {/* ── Inline save error banner ── */}
      {saveError && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-md bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-sans text-red-700">{saveError}</p>
        </div>
      )}

      {/* ════════════ 1 · BASIC INFO ════════════ */}
      <CollapsibleSection
        title="Basic Information"
        subtitle="Name, tagline, description and status"
        isOpen={openSections.basic}
        hasError={sectionErrors.basic}
        onToggle={() => toggleSection('basic')}
      >
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Safari Name"
            {...register('name')}
            placeholder="e.g. Great Wildebeest Migration Safari"
            error={errors.name?.message}
            required
          />
          <Input
            label="Tagline"
            {...register('tagline')}
            placeholder="One compelling sentence about this safari…"
            error={errors.tagline?.message}
            required
          />
          <Textarea
            label="Full Description"
            {...register('description')}
            rows={6}
            placeholder="Detailed description of the experience…"
            error={errors.description?.message}
            required
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={watchedActive}
              onChange={(e) => setValue('active', e.target.checked)}
              className="w-4 h-4 accent-bone-forest rounded"
            />
            <span className="text-sm font-sans text-bone-ink/75">
              Active <span className="text-bone-ink/40">(visible on site)</span>
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={watchedFeatured}
              onChange={(e) => setValue('featured', e.target.checked)}
              className="w-4 h-4 accent-bone-clay rounded"
            />
            <span className="text-sm font-sans text-bone-ink/75">
              Featured <span className="text-bone-ink/40">(show on homepage)</span>
            </span>
          </label>
        </div>
      </CollapsibleSection>

      {/* ════════════ 2 · LOCATION ════════════ */}
      <CollapsibleSection
        title="Location"
        subtitle="Countries, regions and parks / reserves"
        isOpen={openSections.location}
        hasError={sectionErrors.location}
        onToggle={() => toggleSection('location')}
      >
        <ArrayField
          label="Countries *"
          values={watchedCountries}
          onChange={(v) => setValue('location.countries', v, { shouldValidate: true })}
          placeholder="e.g. Kenya"
          hint="Add every country this safari visits. First entry is the primary."
        />
        {(errors.location?.countries as { message?: string } | undefined)?.message && (
          <p className="text-xs text-red-500 font-sans -mt-3">
            {(errors.location?.countries as { message?: string }).message}
          </p>
        )}

        <ArrayField
          label="Regions / Areas"
          values={watchedRegions}
          onChange={(v) => setValue('location.regions', v, { shouldValidate: true })}
          placeholder="e.g. Rift Valley"
          hint="Add each region or area covered by this safari."
        />

        <ArrayField
          label="Parks & Reserves *"
          values={watchedParks}
          onChange={(v) => setValue('location.parks', v, { shouldValidate: true })}
          placeholder="e.g. Masai Mara National Reserve"
          hint="Add every park or reserve visited. First entry is the primary."
        />
        {(errors.location?.parks as { message?: string } | undefined)?.message && (
          <p className="text-xs text-red-500 font-sans -mt-3">
            {(errors.location?.parks as { message?: string }).message}
          </p>
        )}
      </CollapsibleSection>

      {/* ════════════ 3 · DETAILS ════════════ */}
      <CollapsibleSection
        title="Safari Details"
        subtitle="Duration, group size, categories, best season"
        isOpen={openSections.details}
        hasError={sectionErrors.details}
        onToggle={() => toggleSection('details')}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Duration (days)"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            min={1}
            max={60}
            error={errors.duration?.message}
            required
          />
          <Input
            label="Min group size"
            type="number"
            {...register('minGroupSize', { valueAsNumber: true })}
            min={1}
            error={errors.minGroupSize?.message}
          />
          <Input
            label="Max group size"
            type="number"
            {...register('maxGroupSize', { valueAsNumber: true })}
            min={1}
            error={errors.maxGroupSize?.message}
          />
          <Input
            label="Minimum age"
            type="number"
            {...register('minAge', { valueAsNumber: true })}
            min={0}
            max={18}
            error={errors.minAge?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Difficulty <span className="text-bone-clay">*</span></label>
          <div className="flex gap-3">
            {DIFFICULTIES.map((d) => (
              <label key={d.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={d.value}
                  {...register('difficulty')}
                  className="accent-bone-forest"
                />
                <span className="text-sm font-sans text-bone-ink/75">{d.label}</span>
              </label>
            ))}
          </div>
          {errors.difficulty && <p className="text-xs text-red-600 font-sans">{errors.difficulty.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Categories <span className="text-bone-clay">*</span></label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = watchedCategory.includes(c.value as never)
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleCategory(c.value)}
                  className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-bone-forest text-bone-paper border-bone-forest'
                      : 'bg-transparent text-bone-ink/55 border-[rgba(23,22,18,0.2)] hover:border-bone-forest hover:text-bone-forest'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          {errors.category && <p className="text-xs text-red-600 font-sans">{errors.category.message as string}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">Best Season <span className="text-bone-clay">*</span></label>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((month) => {
              const active = watchedBestSeason.includes(month)
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => toggleMonth(month)}
                  className={`text-xs font-sans px-2.5 py-1 rounded border transition-colors ${
                    active
                      ? 'bg-bone-clay text-white border-bone-clay'
                      : 'bg-transparent text-bone-ink/55 border-[rgba(23,22,18,0.2)] hover:border-bone-clay hover:text-bone-clay'
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              )
            })}
          </div>
          {errors.bestSeason && <p className="text-xs text-red-600 font-sans">{errors.bestSeason.message as string}</p>}
        </div>
      </CollapsibleSection>

      {/* ════════════ 4 · CONTENT ARRAYS ════════════ */}
      <CollapsibleSection
        title="Highlights, Inclusions & Exclusions"
        subtitle="What guests experience, what's included and what's not"
        isOpen={openSections.content}
        hasError={sectionErrors.content}
        onToggle={() => toggleSection('content')}
      >
        <ArrayField
          label="Highlights"
          values={watchedHighlights}
          onChange={(v) => setValue('highlights', v)}
          placeholder="Add a highlight…"
          hint="Key selling points — at least 3"
        />
        {errors.highlights && <p className="text-xs text-red-600 font-sans -mt-2">{errors.highlights.message as string}</p>}

        <div className="h-px bg-[rgba(23,22,18,0.07)]" />

        <ArrayField
          label="What's Included"
          values={watchedIncluded}
          onChange={(v) => setValue('included', v)}
          placeholder="Add inclusion…"
          hint="e.g. All park fees, full board meals, professional guide"
        />

        <div className="h-px bg-[rgba(23,22,18,0.07)]" />

        <ArrayField
          label="What's Excluded"
          values={watchedExcluded}
          onChange={(v) => setValue('excluded', v)}
          placeholder="Add exclusion…"
          hint="e.g. International flights, visa fees, travel insurance"
        />
      </CollapsibleSection>

      {/* ════════════ 5 · ITINERARY ════════════ */}
      <CollapsibleSection
        title="Day-by-Day Itinerary"
        subtitle="Detailed programme for each day of the safari"
        isOpen={openSections.itinerary}
        hasError={sectionErrors.itinerary}
        onToggle={() => toggleSection('itinerary')}
      >
        <div className="space-y-5">
          {itineraryFields.map((field, index) => (
            <div
              key={field.id}
              className="border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-between bg-bone-bg px-4 py-2.5">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-bone-ink/60">
                  Day {index + 1}
                </span>
                {itineraryFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="text-bone-ink/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="px-4 py-4 space-y-4">
                <Input
                  label="Day title"
                  {...register(`itinerary.${index}.title`)}
                  placeholder="e.g. Nairobi → Masai Mara"
                  error={errors.itinerary?.[index]?.title?.message}
                  required
                />
                <Textarea
                  label="Description"
                  {...register(`itinerary.${index}.description`)}
                  rows={3}
                  placeholder="What happens on this day…"
                  error={errors.itinerary?.[index]?.description?.message}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-bone-ink/80 font-sans">Meals</label>
                    <div className="flex flex-wrap gap-2">
                      {['Breakfast', 'Lunch', 'Dinner', 'Bush Lunch', 'Packed Lunch'].map((meal) => {
                        const meals = (watch(`itinerary.${index}.meals`) ?? []) as string[]
                        const on = meals.includes(meal)
                        return (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => {
                              const current = (watch(`itinerary.${index}.meals`) ?? []) as string[]
                              setValue(
                                `itinerary.${index}.meals`,
                                on ? current.filter((m) => m !== meal) : [...current, meal]
                              )
                            }}
                            className={`text-xs px-2.5 py-1 rounded border font-sans transition-colors ${on ? 'bg-bone-forest text-bone-paper border-bone-forest' : 'text-bone-ink/50 border-[rgba(23,22,18,0.18)] hover:border-bone-forest hover:text-bone-forest'}`}
                          >
                            {meal}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Input
                    label="Accommodation"
                    {...register(`itinerary.${index}.accommodation`)}
                    placeholder="See tier / Camp name"
                  />
                </div>

                <Controller
                  control={control}
                  name={`itinerary.${index}.activities`}
                  render={({ field }) => (
                    <ArrayField
                      label="Activities"
                      values={(field.value as string[]) ?? []}
                      onChange={field.onChange}
                      placeholder="Add activity…"
                    />
                  )}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendDay(blankItineraryDay(itineraryFields.length + 1))}
            className="flex items-center gap-2 text-sm font-sans text-bone-forest hover:text-bone-forest/70 transition-colors"
          >
            <Plus size={15} /> Add Day
          </button>
        </div>
      </CollapsibleSection>

      {/* ════════════ 6 · PRICING ════════════ */}
      <CollapsibleSection
        title="Pricing Tiers"
        subtitle="Budget, mid-range and luxury pricing with inclusions"
        isOpen={openSections.pricing}
        hasError={sectionErrors.pricing}
        onToggle={() => toggleSection('pricing')}
      >
        <div className="space-y-8">
          {(
            [
              { tier: 'budget'   as const, label: 'Budget' },
              { tier: 'midRange' as const, label: 'Mid-Range' },
              { tier: 'luxury'   as const, label: 'Luxury' },
            ] as const
          ).map(({ tier, label }) => (
            <Controller
              key={tier}
              control={control}
              name={`pricing.${tier}`}
              render={({ field }) => (
                <PricingTierSection
                  tier={tier}
                  label={label}
                  values={field.value}
                  onChange={(v) => field.onChange({ ...field.value, ...v })}
                  errors={errors.pricing?.[tier] as Partial<Record<keyof SafariFormValues['pricing']['budget'], { message?: string }>>}
                />
              )}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* ════════════ 7 · IMAGES ════════════ */}
      <CollapsibleSection
        title="Images"
        subtitle="Cover image and gallery — upload from your machine or pick from media library"
        isOpen={openSections.images}
        onToggle={() => toggleSection('images')}
      >
        <ImageUpload
          label="Cover Image"
          required
          usage="safari-cover"
          value={coverImage}
          publicId={coverImagePublicId}
          onChange={(url, publicId) => { setCoverImage(url); setCoverImagePublicId(publicId) }}
          onClear={() => { setCoverImage(''); setCoverImagePublicId('') }}
          aspectRatio="16/9"
          hint="Main listing image and OG image — required"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-bone-ink/80 font-sans">
              Gallery Images
              <span className="ml-1.5 text-bone-ink/40 font-normal">({imageGallery.length})</span>
            </label>
            <button
              type="button"
              onClick={() => setGalleryPickerOpen(true)}
              className="flex items-center gap-1.5 text-xs font-sans text-bone-forest hover:text-bone-clay transition-colors"
            >
              <FolderOpen size={13} /> Add from library
            </button>
          </div>

          {imageGallery.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {imageGallery.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-[rgba(23,22,18,0.12)]">
                  <Image
                    src={img.url}
                    alt={img.alt || `Gallery ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setImageGallery(imageGallery.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageGallery.length === 0 && (
            <p className="text-xs text-bone-ink/40 font-sans">No gallery images yet — click "Add from library" above.</p>
          )}
        </div>

        {galleryPickerOpen && (
          <MediaPicker
            usage="safari-gallery"
            onSelect={(url, publicId) => {
              setImageGallery(prev => [...prev, { url, publicId, alt: '' }])
              setGalleryPickerOpen(false)
            }}
            onClose={() => setGalleryPickerOpen(false)}
          />
        )}
      </CollapsibleSection>

      {/* ════════════ 8 · SEO ════════════ */}
      <CollapsibleSection
        title="SEO"
        subtitle="Search engine meta title, description and keywords"
        isOpen={openSections.seo}
        hasError={sectionErrors.seo}
        onToggle={() => toggleSection('seo')}
      >
        <Input
          label="Meta Title"
          {...register('seo.metaTitle')}
          placeholder="e.g. Great Migration Safari Kenya | Divine Travel Nest Safaris"
          hint="Max 60 characters"
        />
        <Textarea
          label="Meta Description"
          {...register('seo.metaDescription')}
          rows={3}
          placeholder="Compelling description for Google search results…"
          hint="Max 160 characters"
        />
        <Controller
          control={control}
          name="seo.keywords"
          render={({ field }) => (
            <ArrayField
              label="Keywords"
              values={(field.value as string[]) ?? []}
              onChange={field.onChange}
              placeholder="Add keyword…"
              hint="Press Enter or click Add"
            />
          )}
        />
      </CollapsibleSection>

      {/* ════════════ SUBMIT ════════════ */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
        >
          {isEdit ? 'Save Changes' : 'Create Safari'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push('/admin/safaris')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
