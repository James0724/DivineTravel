'use client'

import { useState } from 'react'
import { Star, Plus, Trash2, X, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Modal, { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { NoTestimonialsFound } from '@/components/ui/EmptyState'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { formatDateShort } from '@/lib/utils'
import type { Testimonial, PaginatedResponse } from '@/types'

/* ── fetch ── */
async function fetchTestimonials(page: number): Promise<PaginatedResponse<Testimonial>> {
  const res = await fetch(`/api/testimonials?page=${page}&limit=15`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

/* ── blank form ── */
const BLANK = {
  name: '',
  country: '',
  rating: 5,
  title: '',
  body: '',
  safariName: '',
  featured: false,
  verified: false,
}

/* ── Add / Edit Modal ── */
function TestimonialModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({ ...BLANK })
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.country || !form.title || !form.body) {
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Testimonial added!')
      setForm({ ...BLANK })
      onSaved()
      onClose()
    } catch {
      toast.error('Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="w-full max-w-lg bg-bone-paper rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(23,22,18,0.1)]">
          <h2 className="font-serif text-lg font-semibold text-bone-ink">Add Testimonial</h2>
          <button
            onClick={onClose}
            className="text-bone-ink/40 hover:text-bone-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Guest Name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Sarah Mitchell"
              required
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              placeholder="e.g. United Kingdom"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-bone-ink/80 font-sans">
              Rating <span className="text-bone-clay">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('rating', n)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                    form.rating >= n
                      ? 'text-bone-clay'
                      : 'text-bone-ink/20 hover:text-bone-clay/50'
                  }`}
                >
                  <Star size={18} className={form.rating >= n ? 'fill-bone-clay' : ''} />
                </button>
              ))}
              <span className="text-sm font-sans text-bone-ink/50 self-center ml-1">
                {form.rating}/5
              </span>
            </div>
          </div>

          <Input
            label="Review Title"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. The migration crossing was beyond anything I expected"
            required
          />

          <Textarea
            label="Review Body"
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            rows={5}
            placeholder="Full review text…"
            required
          />

          <Input
            label="Safari Name (optional)"
            value={form.safariName}
            onChange={(e) => set('safariName', e.target.value)}
            placeholder="e.g. Great Wildebeest Migration Safari"
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
                Featured <span className="text-bone-ink/40">(show on homepage)</span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => set('verified', e.target.checked)}
                className="w-4 h-4 accent-bone-clay rounded"
              />
              <span className="text-sm font-sans text-bone-ink/70">Verified guest</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[rgba(23,22,18,0.08)] mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Add Testimonial
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── View Modal ── */
function TestimonialViewModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null
  onClose: () => void
}) {
  return (
    <Modal open={!!testimonial} onClose={onClose} size="lg" title="Testimonial">
      {testimonial && (
        <div className="space-y-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < testimonial.rating ? 'fill-bone-clay text-bone-clay' : 'text-bone-ink/15'}
              />
            ))}
          </div>

          <h3 className="font-serif text-lg font-semibold text-bone-ink">
            &ldquo;{testimonial.title}&rdquo;
          </h3>

          <p className="text-sm text-bone-ink/70 leading-relaxed whitespace-pre-wrap">
            {testimonial.body}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[rgba(23,22,18,0.08)] text-sm">
            <span className="font-medium text-bone-ink">{testimonial.name}</span>
            <span className="text-bone-ink/45">· {testimonial.country}</span>
            {testimonial.safariName && (
              <span className="text-bone-clay font-sans font-medium">· {testimonial.safariName}</span>
            )}
            <span className="text-bone-ink/45">· {formatDateShort(testimonial.createdAt)}</span>
          </div>

          <div className="flex gap-2 pt-1">
            {testimonial.featured && (
              <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-bone-forest/10 text-bone-forest">
                ✓ Featured
              </span>
            )}
            {testimonial.verified && (
              <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ── Page ── */

export default function AdminTestimonialsPage() {
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [viewTarget, setViewTarget] = useState<Testimonial | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials', page],
    queryFn: () => fetchTestimonials(page),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
      toast.success('Testimonial deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const toggleFeatured = async (id: string, current: boolean) => {
    if (togglingId) return
    setTogglingId(id + '-featured')
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      })
      if (res.ok) {
        qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
        toast.success(current ? 'Unfeatured' : 'Featured on homepage')
      } else {
        toast.error('Failed to update featured status')
      }
    } catch {
      toast.error('Failed to update featured status')
    } finally {
      setTogglingId(null)
    }
  }

  const toggleVerified = async (id: string, current: boolean) => {
    if (togglingId) return
    setTogglingId(id + '-verified')
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !current }),
      })
      if (res.ok) {
        qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
        toast.success(current ? 'Marked unverified' : 'Marked verified')
      } else {
        toast.error('Failed to update verified status')
      }
    } catch {
      toast.error('Failed to update verified status')
    } finally {
      setTogglingId(null)
    }
  }

  const testimonials = data?.data ?? []
  const pagination = data?.pagination

  return (
    <>
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-bone-ink">Testimonials</h1>
            <p className="text-sm text-bone-ink/50 font-sans mt-1">
              {pagination?.total ?? 0} total reviews
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
          >
            Add Testimonial
          </Button>
        </div>

        {/* Table */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden overflow-x-auto">
          {isLoading ? (
            <table className="admin-table min-w-[700px]">
              <thead>
                <tr><th>Guest</th><th>Safari</th><th>Rating</th><th>Title</th><th>Date</th><th>Featured</th><th>Verified</th><th>Actions</th></tr>
              </thead>
              <tbody><TableSkeleton rows={8} cols={8} /></tbody>
            </table>
          ) : testimonials.length === 0 ? (
            <div className="py-8"><NoTestimonialsFound /></div>
          ) : (
            <table className="admin-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Safari</th>
                  <th>Rating</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Featured</th>
                  <th>Verified</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div>
                        <p className="font-medium text-sm text-bone-ink">{t.name}</p>
                        <p className="text-xs text-bone-ink/45">{t.country}</p>
                      </div>
                    </td>
                    <td className="text-sm text-bone-ink/60">{t.safariName ?? '—'}</td>
                    <td>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < t.rating ? 'fill-bone-clay text-bone-clay' : 'text-bone-ink/15'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-[180px] overflow-hidden">
                      <button
                        onClick={() => setViewTarget(t)}
                        className="w-full truncate block text-left text-sm hover:text-bone-clay hover:underline transition-colors"
                        title="View full testimonial"
                      >
                        {t.title}
                      </button>
                    </td>
                    <td className="text-sm text-bone-ink/50">{formatDateShort(t.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => toggleFeatured(t._id, t.featured)}
                        disabled={!!togglingId}
                        className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          t.featured
                            ? 'bg-bone-forest/10 text-bone-forest hover:bg-bone-forest/20'
                            : 'bg-stone-100 text-stone-500 hover:bg-bone-forest/10 hover:text-bone-forest'
                        }`}
                      >
                        {togglingId === t._id + '-featured' ? '…' : t.featured ? '✓ Featured' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleVerified(t._id, t.verified)}
                        disabled={!!togglingId}
                        className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          t.verified
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-700'
                        }`}
                      >
                        {togglingId === t._id + '-verified' ? '…' : t.verified ? '✓ Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewTarget(t)}
                          className="p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors"
                          aria-label="View testimonial"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(t._id)}
                          className="p-1.5 rounded text-bone-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex gap-2 justify-end">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed text-sm font-sans"
            >
              Prev
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed text-sm font-sans"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <TestimonialModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => qc.invalidateQueries({ queryKey: ['admin-testimonials'] })}
      />

      <TestimonialViewModal testimonial={viewTarget} onClose={() => setViewTarget(null)} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  )
}
