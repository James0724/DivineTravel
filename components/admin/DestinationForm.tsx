'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, X, ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import type { Destination, DestinationImage, DestinationItinerary } from '@/types'

/* ─── Chip list input — reused for major attractions, activities & wildlife ─── */

function ChipListField({
  label,
  values,
  onChange,
  placeholder = 'Add item…',
  hint,
  required,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  hint?: string
  required?: boolean
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
      <label className="text-sm font-medium text-bone-ink/80 font-sans">
        {label}
        {required && <span className="text-bone-clay ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-bone-ink/45 font-sans -mt-1">{hint}</p>}

      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 text-xs font-sans bg-bone-bg border border-[rgba(23,22,18,0.15)] rounded-full px-3 py-1"
            >
              <span className="text-bone-ink/80">{v}</span>
              <button type="button" onClick={() => remove(i)} className="text-bone-ink/30 hover:text-red-500 transition-colors">
                <X size={12} />
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
          className="flex-1 h-9 px-3 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 placeholder:text-bone-ink/35"
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

/* ─── Itinerary repeater — flexible, no fixed day count ─────────────────── */

const BLANK_ITINERARY: DestinationItinerary = {
  title: '',
  durationLabel: '',
  description: '',
  activities: [],
}

function ItineraryField({
  itineraries,
  onChange,
}: {
  itineraries: DestinationItinerary[]
  onChange: (v: DestinationItinerary[]) => void
}) {
  const update = (i: number, patch: Partial<DestinationItinerary>) =>
    onChange(itineraries.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))

  const remove = (i: number) => onChange(itineraries.filter((_, idx) => idx !== i))

  const add = () => onChange([...itineraries, { ...BLANK_ITINERARY }])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-bone-ink/80 font-sans">
          Itineraries <span className="text-bone-ink/40 font-normal">({itineraries.length})</span>
        </label>
        <button
          type="button"
          onClick={add}
          className="h-8 px-3 rounded bg-bone-bg border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-forest hover:border-bone-forest transition-colors text-xs font-sans flex items-center gap-1"
        >
          <Plus size={12} /> Add Itinerary
        </button>
      </div>
      <p className="text-xs text-bone-ink/45 font-sans -mt-2">
        Each itinerary is a self-contained plan with its own duration label — half day, full day, two days, whatever fits. There&apos;s no fixed day count.
      </p>

      {itineraries.map((it, i) => (
        <div key={i} className="border border-[rgba(23,22,18,0.12)] rounded-md p-4 space-y-3 bg-bone-bg/40">
          <div className="flex items-start justify-between gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <Input
                label="Title"
                value={it.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="e.g. Half-Day Crater Floor Tour"
              />
              <Input
                label="Duration Label"
                value={it.durationLabel}
                onChange={(e) => update(i, { durationLabel: e.target.value })}
                placeholder="e.g. Half Day, Full Day, 2 Days"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-7 p-1.5 rounded text-bone-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <Textarea
            label="Description"
            value={it.description}
            onChange={(e) => update(i, { description: e.target.value })}
            rows={3}
            placeholder="What happens during this itinerary, step by step…"
          />
          <ChipListField
            label="Activities"
            values={it.activities}
            onChange={(v) => update(i, { activities: v })}
            placeholder="e.g. Game drive into the crater floor"
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Defaults ───────────────────────────────────────────────────────────── */

const BLANK = {
  name: '',
  location: { country: '', region: '' },
  size: '',
  climaticConditions: '',
  majorAttractions: [] as string[],
  access: { byRoad: '', byAir: '' },
  wildlife: [] as string[],
  bestTimeToVisit: '',
  activities: [] as string[],
  itineraries: [] as DestinationItinerary[],
  coverImage: '',
  coverImagePublicId: '',
  images: [] as DestinationImage[],
  shortDescription: '',
  description: '',
  subtitle: '',
  tag: '',
  bestFor: '',
  highlights: [] as string[],
  order: 0,
  featured: false,
  active: true,
  seo: { metaTitle: '', metaDescription: '', keywords: [] as string[] },
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function DestinationForm({ existing }: { existing?: Destination }) {
  const router = useRouter()
  const isEdit = !!existing

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          location: { country: existing.location.country, region: existing.location.region ?? '' },
          size: existing.size ?? '',
          climaticConditions: existing.climaticConditions,
          majorAttractions: existing.majorAttractions ?? [],
          access: { byRoad: existing.access?.byRoad ?? '', byAir: existing.access?.byAir ?? '' },
          wildlife: existing.wildlife ?? [],
          bestTimeToVisit: existing.bestTimeToVisit,
          activities: existing.activities ?? [],
          itineraries: existing.itineraries ?? [],
          coverImage: existing.coverImage ?? '',
          coverImagePublicId: existing.coverImagePublicId ?? '',
          images: existing.images ?? [],
          shortDescription: existing.shortDescription,
          description: existing.description,
          subtitle: existing.subtitle ?? '',
          tag: existing.tag ?? '',
          bestFor: existing.bestFor ?? '',
          highlights: existing.highlights ?? [],
          order: existing.order ?? 0,
          featured: existing.featured,
          active: existing.active,
          seo: {
            metaTitle: existing.seo?.metaTitle ?? '',
            metaDescription: existing.seo?.metaDescription ?? '',
            keywords: existing.seo?.keywords ?? [],
          },
        }
      : { ...BLANK }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.location.country || !form.climaticConditions || !form.bestTimeToVisit || !form.shortDescription || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!form.coverImage) {
      toast.error('Upload a cover image')
      return
    }

    setSubmitting(true)
    try {
      const body = {
        ...form,
        location: { country: form.location.country, region: form.location.region || undefined },
      }
      const url = isEdit ? `/api/destinations/${existing!._id}` : '/api/destinations'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to save')
      }

      toast.success(isEdit ? 'Destination updated' : 'Destination created')
      // Small delay so the toast renders before navigation unmounts the layout
      await new Promise((r) => setTimeout(r, 800))
      router.push('/admin/destinations')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* ── Full-page saving overlay ── */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-bone-paper/80 backdrop-blur-[2px]">
          <div className="w-10 h-10 border-2 border-bone-forest border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-bone-ink/70">
            {isEdit ? 'Saving changes…' : 'Creating destination…'}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link
          href="/admin/destinations"
          className="flex items-center gap-1.5 text-sm text-bone-ink/50 hover:text-bone-ink font-sans transition-colors"
        >
          <ArrowLeft size={15} /> Back to destinations
        </Link>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-bone-ink">
        {isEdit ? 'Edit Destination' : 'Add Destination'}
      </h1>

      {error && (
        <p className="text-sm text-red-600 font-sans bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>
      )}

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <Input
          label="Destination Name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Amboseli National Park"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Country"
            value={form.location.country}
            onChange={(e) => set('location', { ...form.location, country: e.target.value })}
            placeholder="e.g. Kenya"
            required
          />
          <Input
            label="Region / Area"
            value={form.location.region}
            onChange={(e) => set('location', { ...form.location, region: e.target.value })}
            placeholder="e.g. Rift Valley"
          />
        </div>

        <Input
          label="Size"
          value={form.size}
          onChange={(e) => set('size', e.target.value)}
          placeholder="e.g. approx. 392 km² (151 sq mi)"
          hint="Free text — use 'approx.' rather than false precision"
        />

        <Textarea
          label="Climatic Conditions"
          value={form.climaticConditions}
          onChange={(e) => set('climaticConditions', e.target.value)}
          rows={3}
          placeholder="Describe temperature ranges, rainy/dry seasons, general climate…"
          required
        />

        <Textarea
          label="Short Description"
          value={form.shortDescription}
          onChange={(e) => set('shortDescription', e.target.value)}
          rows={2}
          placeholder="A one or two sentence summary, shown on listing cards"
          hint="Up to 220 characters"
          required
        />

        <Textarea
          label="Long Description"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={6}
          placeholder="The full story — setting, character, what makes it worth visiting…"
          required
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Listing Card Details</h2>
        <p className="text-xs text-bone-ink/45 font-sans -mt-2">
          Shown on the country page&apos;s featured carousel and more-parks grid — separate from the fact sheet below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="e.g. National Reserve, Conservancy"
          />
          <Input
            label="Tag"
            value={form.tag}
            onChange={(e) => set('tag', e.target.value)}
            placeholder="e.g. Big cats · Great Migration"
          />
        </div>

        <Input
          label="Best For"
          value={form.bestFor}
          onChange={(e) => set('bestFor', e.target.value)}
          placeholder="e.g. Big cats & the Migration"
        />

        <ChipListField
          label="Card Highlights"
          values={form.highlights}
          onChange={(v) => set('highlights', v)}
          placeholder="e.g. The Great Migration river crossings, July to October"
          hint="3-5 short bullet phrases for listing cards — falls back to Major Attractions if left empty"
        />

        <Input
          label="Sort Order"
          type="number"
          value={String(form.order)}
          onChange={(e) => set('order', Number(e.target.value) || 0)}
          hint="Lower numbers appear first within the featured / more-parks groups"
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Attractions & Activities</h2>

        <ChipListField
          label="Major Attractions"
          values={form.majorAttractions}
          onChange={(v) => set('majorAttractions', v)}
          placeholder="e.g. Views of Mount Kilimanjaro"
        />

        <ChipListField
          label="Activities"
          values={form.activities}
          onChange={(v) => set('activities', v)}
          placeholder="e.g. Game drives, birdwatching"
        />

        <ChipListField
          label="Wildlife Present"
          values={form.wildlife}
          onChange={(v) => set('wildlife', v)}
          placeholder="e.g. Lion, Elephant, Black Rhino"
          hint="Species visitors can realistically spot here — shown in the fact sheet"
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Getting There</h2>
        <Input
          label="By Road"
          value={form.access.byRoad}
          onChange={(e) => set('access', { ...form.access, byRoad: e.target.value })}
          placeholder="e.g. 4–5 hours by road from Nairobi via the A104/A109"
        />
        <Input
          label="By Air / Airstrip"
          value={form.access.byAir}
          onChange={(e) => set('access', { ...form.access, byAir: e.target.value })}
          placeholder="e.g. Daily scheduled flights to Amboseli Airstrip (ASV)"
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Best Time to Visit</h2>
        <p className="text-xs text-bone-ink/45 font-sans -mt-2">
          Accommodation near this destination is now matched automatically from
          the Accommodations directory by country/region — manage individual
          properties there instead of listing them here.
        </p>
        <Textarea
          label="Best Time to Visit"
          value={form.bestTimeToVisit}
          onChange={(e) => set('bestTimeToVisit', e.target.value)}
          rows={3}
          placeholder="e.g. June to October (dry season) for wildlife viewing…"
          required
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Itineraries</h2>
        <ItineraryField
          itineraries={form.itineraries}
          onChange={(v) => set('itineraries', v)}
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Images</h2>

        <ImageUpload
          label="Cover Image"
          required
          usage="destination-cover"
          value={form.coverImage}
          publicId={form.coverImagePublicId}
          onChange={(url, publicId) => setForm((prev) => ({ ...prev, coverImage: url, coverImagePublicId: publicId }))}
          onClear={() => setForm((prev) => ({ ...prev, coverImage: '', coverImagePublicId: '' }))}
          aspectRatio="3/2"
          hint="Main listing & hero image — required"
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">
            Gallery Images
            <span className="ml-1.5 text-bone-ink/40 font-normal">({form.images.length})</span>
          </label>

          {form.images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {form.images.map((img, i) => (
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
                    onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            usage="destination-gallery"
            onChange={(url, publicId) => set('images', [...form.images, { url, publicId, alt: '' }])}
            aspectRatio="3/2"
            hint="Upload or pick from the media library — repeat to add more"
          />
        </div>
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-bone-forest rounded"
            />
            <span className="text-sm font-sans text-bone-ink/70">
              Featured <span className="text-bone-ink/40">(shown first in listings)</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="w-4 h-4 accent-bone-clay rounded"
            />
            <span className="text-sm font-sans text-bone-ink/70">Active (visible on the site)</span>
          </label>
        </div>
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">SEO (optional)</h2>
        <Input
          label="Meta Title"
          value={form.seo.metaTitle}
          onChange={(e) => set('seo', { ...form.seo, metaTitle: e.target.value })}
          placeholder="Up to 60 characters"
        />
        <Textarea
          label="Meta Description"
          value={form.seo.metaDescription}
          onChange={(e) => set('seo', { ...form.seo, metaDescription: e.target.value })}
          rows={2}
          placeholder="Up to 160 characters"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/destinations')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? 'Save Changes' : 'Create Destination'}
        </Button>
      </div>
    </form>
  )
}
