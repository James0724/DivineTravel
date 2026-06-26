'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, X, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import type { Accommodation, AccommodationImage } from '@/types'

/* ─── Constants ──────────────────────────────────────────────────────────── */

const TYPES = [
  { value: 'luxury-lodge', label: 'Luxury Lodge' },
  { value: 'tented-camp', label: 'Tented Camp' },
  { value: 'beach-resort', label: 'Beach Resort' },
]

const PRICE_TIERS = [
  { value: '', label: 'Not specified' },
  { value: 'budget', label: 'Budget' },
  { value: 'midRange', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
]

/* ─── Chip list input — reused for highlights & amenities ───────────────── */

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

/* ─── Defaults ───────────────────────────────────────────────────────────── */

const BLANK = {
  name: '',
  type: 'luxury-lodge',
  location: { country: '', region: '' },
  description: '',
  highlights: [] as string[],
  amenities: [] as string[],
  coverImage: '',
  coverImagePublicId: '',
  images: [] as AccommodationImage[],
  websiteUrl: '',
  priceTier: '',
  featured: false,
  active: true,
  seo: { metaTitle: '', metaDescription: '', keywords: [] as string[] },
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function AccommodationForm({ existing }: { existing?: Accommodation }) {
  const router = useRouter()
  const isEdit = !!existing

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          type: existing.type,
          location: { country: existing.location.country, region: existing.location.region },
          description: existing.description,
          highlights: existing.highlights ?? [],
          amenities: existing.amenities ?? [],
          coverImage: existing.coverImage ?? '',
          coverImagePublicId: existing.coverImagePublicId ?? '',
          images: existing.images ?? [],
          websiteUrl: existing.websiteUrl,
          priceTier: existing.priceTier ?? '',
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

    if (!form.name || !form.location.country || !form.location.region || !form.description || !form.websiteUrl) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.highlights.length === 0) {
      toast.error('Add at least one highlight')
      return
    }
    if (!form.coverImage) {
      toast.error('Upload a cover image')
      return
    }

    setSubmitting(true)
    try {
      const body = { ...form, priceTier: form.priceTier || undefined }
      const url = isEdit ? `/api/accommodations/${existing!._id}` : '/api/accommodations'
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

      toast.success(isEdit ? 'Accommodation updated' : 'Accommodation created')
      router.push('/admin/accommodations')
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
      <div className="flex items-center gap-3">
        <Link
          href="/admin/accommodations"
          className="flex items-center gap-1.5 text-sm text-bone-ink/50 hover:text-bone-ink font-sans transition-colors"
        >
          <ArrowLeft size={15} /> Back to accommodations
        </Link>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-bone-ink">
        {isEdit ? 'Edit Accommodation' : 'Add Accommodation'}
      </h1>

      {error && (
        <p className="text-sm text-red-600 font-sans bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>
      )}

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Property Name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Angama Mara"
            required
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => set('type', e.target.value as typeof form.type)}
            options={TYPES}
            required
          />
        </div>

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
            placeholder="e.g. Masai Mara"
            required
          />
        </div>

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={5}
          placeholder="What makes this property worth recommending — setting, design, the experience on offer…"
          hint="At least 50 characters"
          required
        />

        <ChipListField
          label="Highlights"
          values={form.highlights}
          onChange={(v) => set('highlights', v)}
          placeholder="e.g. Clifftop views over the Mara Triangle"
          hint="Short, descriptive points — shown as bullets"
          required
        />

        <ChipListField
          label="Amenities"
          values={form.amenities}
          onChange={(v) => set('amenities', v)}
          placeholder="e.g. Swimming pool"
          hint="Short tags — shown as chips on the listing card"
        />
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <h2 className="font-sans font-semibold text-sm text-bone-ink">Images</h2>

        <ImageUpload
          label="Cover Image"
          required
          usage="accommodation-cover"
          value={form.coverImage}
          publicId={form.coverImagePublicId}
          onChange={(url, publicId) => setForm((prev) => ({ ...prev, coverImage: url, coverImagePublicId: publicId }))}
          onClear={() => setForm((prev) => ({ ...prev, coverImage: '', coverImagePublicId: '' }))}
          aspectRatio="3/2"
          hint="Main listing image — required"
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
            usage="accommodation-gallery"
            onChange={(url, publicId) => set('images', [...form.images, { url, publicId, alt: '' }])}
            aspectRatio="3/2"
            hint="Upload or pick from the media library — repeat to add more"
          />
        </div>
      </div>

      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 space-y-5">
        <Input
          label="Website URL"
          type="url"
          value={form.websiteUrl}
          onChange={(e) => set('websiteUrl', e.target.value)}
          placeholder="https://www.example.com"
          hint="Reference link for the property's own site — internal use only; the public card sends enquiries to us, not to this URL"
          required
        />

        <Select
          label="Price Tier"
          value={form.priceTier}
          onChange={(e) => set('priceTier', e.target.value)}
          options={PRICE_TIERS}
          hint="Qualitative indicator only — no specific pricing is shown"
        />

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
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/accommodations')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? 'Save Changes' : 'Create Accommodation'}
        </Button>
      </div>
    </form>
  )
}
