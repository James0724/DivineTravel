'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  Images,
  RefreshCw,
  Search,
  Copy,
  Trash2,
  X,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Info,
  Check,
  Pencil,
  Save,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────────────────── */

type UsageFilter = 'all' | 'safari-gallery' | 'blog-cover' | 'team' | 'portfolio' | 'misc'

interface MediaImage {
  _id: string
  url: string
  publicId: string
  alt: string
  title: string
  originalName: string
  width: number
  height: number
  format: string
  fileSize: number
  folder: string
  usage: string
  uploadedBy: string
  createdAt: string
}

interface PaginationData {
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

type Counts = Record<string, number>

/* ── Constants ─────────────────────────────────────────────────────── */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''

const TABS: { value: UsageFilter; label: string }[] = [
  { value: 'all',            label: 'All'       },
  { value: 'safari-gallery', label: 'Safaris'   },
  { value: 'blog-cover',     label: 'Blog'      },
  { value: 'team',           label: 'Team'      },
  { value: 'portfolio',      label: 'Portfolio' },
  { value: 'misc',           label: 'Misc'      },
]

const USAGE_LABELS: Record<string, string> = {
  'safari-gallery': 'Safari',
  'safari-cover':   'Safari',
  'blog-cover':     'Blog',
  team:             'Team',
  portfolio:        'Portfolio',
  misc:             'Misc',
}

const USAGE_COLORS: Record<string, string> = {
  'safari-gallery': 'bg-amber-50 text-amber-700 border-amber-200',
  'safari-cover':   'bg-amber-50 text-amber-700 border-amber-200',
  'blog-cover':     'bg-blue-50  text-blue-700  border-blue-200',
  team:             'bg-emerald-50 text-emerald-700 border-emerald-200',
  portfolio:        'bg-purple-50 text-purple-700 border-purple-200',
  misc:             'bg-stone-50  text-stone-700  border-stone-200',
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (n < 1024)    return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

/** Build a Cloudinary thumbnail URL — bypasses Next.js image optimisation for CDN-native delivery. */
function thumbUrl(publicId: string, size = 400): string {
  if (!CLOUD || !publicId) return ''
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_${size},h_${size},c_fill,q_auto,f_auto/${publicId}`
}

/** Extract the bare filename from a Cloudinary public ID. */
function publicIdFilename(publicId: string): string {
  return publicId.split('/').pop() ?? publicId
}

/* ── Skeleton card ─────────────────────────────────────────────────── */

const SHIMMER = 'bg-gradient-to-r from-bone-bg via-[rgba(23,22,18,0.06)] to-bone-bg bg-[length:200%_100%] animate-shimmer'

function SkeletonCard() {
  return (
    <div className="bg-bone-paper border border-[rgba(23,22,18,0.08)] rounded-md overflow-hidden">
      <div className={cn('aspect-square', SHIMMER)} />
      <div className="p-2.5 space-y-1.5">
        <div className={cn('h-3 rounded w-3/4', SHIMMER)} />
        <div className={cn('h-2.5 rounded w-1/2', SHIMMER)} />
      </div>
    </div>
  )
}

/* ── Image card ────────────────────────────────────────────────────── */

function ImageCard({
  image,
  onView,
  onCopy,
  onDelete,
  onEdit,
}: {
  image: MediaImage
  onView: (img: MediaImage) => void
  onCopy: (url: string) => void
  onDelete: (img: MediaImage) => void
  onEdit: (img: MediaImage) => void
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const src = thumbUrl(image.publicId) || image.url

  return (
    <div className="group relative flex flex-col bg-bone-paper border border-[rgba(23,22,18,0.1)] rounded-md overflow-hidden transition-shadow hover:shadow-card-hover">
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onView(image)}
        className="relative aspect-square bg-bone-bg overflow-hidden block w-full"
      >
        {/* Shimmer shown until image loads */}
        {!imgLoaded && (
          <div className={cn('absolute inset-0', SHIMMER)} />
        )}
        <Image
          src={src}
          alt={image.alt || image.originalName}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-105',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          unoptimized
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <span
            onClick={(e) => { e.stopPropagation(); onView(image) }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow text-bone-ink hover:bg-white transition-colors cursor-pointer"
            title="Details"
          >
            <Info size={14} />
          </span>
          <span
            onClick={(e) => { e.stopPropagation(); onEdit(image) }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow text-bone-ink hover:bg-white transition-colors cursor-pointer"
            title="Edit / Rename"
          >
            <Pencil size={13} />
          </span>
        </div>
      </button>

      {/* Card body */}
      <div className="p-2.5 flex-1 flex flex-col gap-1.5">
        <p className="text-xs font-sans font-medium text-bone-ink truncate leading-tight" title={image.originalName}>
          {image.originalName}
        </p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-sans text-bone-ink/45 whitespace-nowrap">
            {image.width && image.height ? `${image.width}×${image.height}` : '—'}
            {image.format && ` · ${image.format.toUpperCase()}`}
          </span>
          {image.usage && (
            <span className={cn(
              'text-[9px] font-sans font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border',
              USAGE_COLORS[image.usage] ?? 'bg-bone-bg text-bone-ink/50 border-[rgba(23,22,18,0.12)]'
            )}>
              {USAGE_LABELS[image.usage] ?? image.usage}
            </span>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="flex border-t border-[rgba(23,22,18,0.07)]">
        <button
          type="button"
          onClick={() => onCopy(image.url)}
          title="Copy URL"
          className="flex-1 flex items-center justify-center py-2 text-bone-ink/40 hover:text-bone-forest hover:bg-bone-bg transition-colors"
        >
          <Copy size={13} />
        </button>
        <span className="w-px bg-[rgba(23,22,18,0.07)]" />
        <button
          type="button"
          onClick={() => onEdit(image)}
          title="Edit / Rename"
          className="flex-1 flex items-center justify-center py-2 text-bone-ink/40 hover:text-bone-forest hover:bg-bone-bg transition-colors"
        >
          <Pencil size={13} />
        </button>
        <span className="w-px bg-[rgba(23,22,18,0.07)]" />
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in new tab"
          className="flex-1 flex items-center justify-center py-2 text-bone-ink/40 hover:text-bone-forest hover:bg-bone-bg transition-colors"
        >
          <ExternalLink size={13} />
        </a>
        <span className="w-px bg-[rgba(23,22,18,0.07)]" />
        <button
          type="button"
          onClick={() => onDelete(image)}
          title="Delete"
          className="flex-1 flex items-center justify-center py-2 text-bone-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

/* ── Image detail modal ────────────────────────────────────────────── */

function DetailModal({
  image,
  onClose,
  onDelete,
  onCopy,
  onEdit,
}: {
  image: MediaImage
  onClose: () => void
  onDelete: (img: MediaImage) => void
  onCopy: (url: string) => void
  onEdit: (img: MediaImage) => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bone-paper w-full sm:max-w-3xl sm:rounded-lg rounded-t-2xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <h3 className="font-sans font-semibold text-sm text-bone-ink truncate pr-4" title={image.originalName}>
            {image.originalName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bone-bg text-bone-ink/50 hover:text-bone-ink transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-0">

            {/* Preview */}
            <div className="sm:w-1/2 bg-bone-bg flex items-center justify-center p-4 sm:p-6 min-h-[200px]">
              <div className="relative w-full" style={{ paddingBottom: `${Math.min(75, ((image.height || 1) / (image.width || 1)) * 100)}%` }}>
                <Image
                  src={image.url}
                  alt={image.alt || image.originalName}
                  fill
                  className="object-contain rounded"
                  unoptimized
                />
              </div>
            </div>

            {/* Meta */}
            <div className="sm:w-1/2 p-5 space-y-4">
              {/* URL copy */}
              <div className="space-y-1.5">
                <p className="text-xs font-sans font-semibold text-bone-ink/50 uppercase tracking-wide">URL</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={image.url}
                    className="flex-1 min-w-0 h-8 px-2.5 text-xs font-sans text-bone-ink bg-bone-bg border border-[rgba(23,22,18,0.15)] rounded truncate"
                  />
                  <button
                    type="button"
                    onClick={() => onCopy(image.url)}
                    className="flex-shrink-0 h-8 px-3 rounded bg-bone-forest text-bone-paper text-xs font-sans font-medium hover:bg-bone-forest/90 transition-colors flex items-center gap-1.5"
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
              </div>

              {/* Metadata table */}
              <div className="space-y-2">
                {[
                  { label: 'Public ID',   value: image.publicId },
                  { label: 'Folder',      value: image.folder || '—' },
                  { label: 'Usage',       value: USAGE_LABELS[image.usage] ?? image.usage },
                  { label: 'Format',      value: image.format?.toUpperCase() ?? '—' },
                  image.width && image.height
                    ? { label: 'Dimensions', value: `${image.width} × ${image.height} px` }
                    : null,
                  image.fileSize
                    ? { label: 'File size', value: fmt(image.fileSize) }
                    : null,
                  { label: 'Uploaded',    value: formatDate(image.createdAt) },
                  image.uploadedBy && image.uploadedBy !== 'cloudinary-sync'
                    ? { label: 'By', value: image.uploadedBy }
                    : null,
                ]
                  .filter((x): x is { label: string; value: string } => Boolean(x))
                  .map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-[11px] font-sans text-bone-ink/40 w-24 flex-shrink-0 pt-0.5">{label}</span>
                      <span className="text-xs font-sans text-bone-ink break-all">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={13} />}
            onClick={() => onDelete(image)}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Pencil size={13} />}
              onClick={() => onEdit(image)}
            >
              Edit / Rename
            </Button>
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink text-xs font-sans font-medium hover:bg-bone-bg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={12} /> Open
            </a>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Edit / Rename modal ───────────────────────────────────────────── */

function EditModal({
  image,
  onClose,
  onSave,
}: {
  image: MediaImage
  onClose: () => void
  onSave: (id: string, data: { alt?: string; title?: string; newName?: string }) => Promise<MediaImage>
}) {
  const currentFilename = publicIdFilename(image.publicId)

  const [alt,      setAlt]      = useState(image.alt ?? '')
  const [title,    setTitle]    = useState(image.title ?? '')
  const [filename, setFilename] = useState(currentFilename)
  const [saving,   setSaving]   = useState(false)

  const nameChanged = filename.trim() !== '' && filename.trim() !== currentFilename

  const safe = filename.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_.]/g, '')
  const previewId = image.publicId.includes('/')
    ? `${image.publicId.split('/').slice(0, -1).join('/')}/${safe}`
    : safe

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Record<string, string> = { alt, title }
      if (nameChanged) payload.newName = filename.trim()
      await onSave(image._id, payload)
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bone-paper w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl shadow-2xl flex flex-col max-h-[95dvh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <h3 className="font-sans font-semibold text-sm text-bone-ink flex items-center gap-2">
            <Pencil size={14} className="text-bone-ink/40" />
            Edit Image
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bone-bg text-bone-ink/50 hover:text-bone-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Preview strip */}
          <div className="flex items-center gap-3 p-3 bg-bone-bg rounded-md">
            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 relative bg-bone-paper">
              <Image src={thumbUrl(image.publicId, 96) || image.url} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-sans font-medium text-bone-ink truncate">{image.originalName}</p>
              <p className="text-[11px] font-sans text-bone-ink/40 truncate">{image.publicId}</p>
            </div>
          </div>

          {/* Alt text */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold text-bone-ink/50 uppercase tracking-wide">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for accessibility…"
              className="w-full h-9 px-3 text-sm font-sans text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded placeholder:text-bone-ink/35 focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold text-bone-ink/50 uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Display title…"
              className="w-full h-9 px-3 text-sm font-sans text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded placeholder:text-bone-ink/35 focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors"
            />
          </div>

          {/* Rename */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans font-semibold text-bone-ink/50 uppercase tracking-wide">
                Filename in Cloudinary
              </label>
              {filename !== currentFilename && (
                <button
                  type="button"
                  onClick={() => setFilename(currentFilename)}
                  className="text-[10px] font-sans text-bone-ink/40 hover:text-bone-ink flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} /> Reset
                </button>
              )}
            </div>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={currentFilename}
              className="w-full h-9 px-3 text-sm font-sans text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded placeholder:text-bone-ink/35 focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors font-mono"
            />
            <p className="text-[10px] font-sans text-bone-ink/40">
              Allowed: letters, numbers, hyphens, underscores. Spaces become hyphens.
            </p>
          </div>

          {/* Rename warning */}
          {nameChanged && safe && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle size={13} />
                <span className="text-xs font-sans font-semibold">This will rename the asset in Cloudinary</span>
              </div>
              <div className="text-[11px] font-sans text-amber-700/80 space-y-1">
                <p>The public ID and URL will change. Any pages or posts already referencing the old URL will need to be updated.</p>
                <div className="mt-2 space-y-0.5">
                  <p className="font-mono text-[10px] line-through opacity-60 truncate">{image.publicId}</p>
                  <p className="font-mono text-[10px] font-medium truncate">→ {previewId}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            leftIcon={<Save size={13} />}
            onClick={handleSave}
          >
            {nameChanged ? 'Save & Rename' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Delete confirm modal ──────────────────────────────────────────── */

function DeleteConfirm({
  image,
  onConfirm,
  onCancel,
  loading,
}: {
  image: MediaImage
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-bone-paper rounded-lg shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 size={16} className="text-red-600" />
          </div>
          <div>
            <p className="font-sans font-semibold text-sm text-bone-ink">Delete image?</p>
            <p className="text-xs text-bone-ink/55 font-sans mt-1">
              <span className="font-medium">{image.originalName}</span> will be permanently deleted from Cloudinary and cannot be recovered.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" size="sm" loading={loading} leftIcon={<Trash2 size={13} />} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Empty state ───────────────────────────────────────────────────── */

function EmptyState({ onSync, syncing }: { onSync: () => void; syncing: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-bone-paper border border-[rgba(23,22,18,0.1)] flex items-center justify-center mb-4">
        <FolderOpen size={28} strokeWidth={1.2} className="text-bone-ink/30" />
      </div>
      <p className="font-sans font-semibold text-sm text-bone-ink">No images found</p>
      <p className="text-xs text-bone-ink/50 font-sans mt-1 max-w-xs">
        Your Cloudinary library hasn&apos;t been synced yet. Click Sync to import all your images.
      </p>
      <Button
        variant="primary"
        size="sm"
        className="mt-5"
        loading={syncing}
        leftIcon={<RefreshCw size={13} />}
        onClick={onSync}
      >
        Sync from Cloudinary
      </Button>
    </div>
  )
}

/* ── Pagination ────────────────────────────────────────────────────── */

function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPage,
}: {
  page: number
  totalPages: number
  total: number
  limit: number
  onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end   = Math.min(page * limit, total)

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <div className="flex flex-col xs:flex-row items-center justify-between gap-3 pt-4 border-t border-[rgba(23,22,18,0.08)]">
      <p className="text-xs font-sans text-bone-ink/45">
        Showing {start}–{end} of {total} images
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded flex items-center justify-center text-bone-ink/50 hover:bg-bone-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-bone-ink/35">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={cn(
                'w-8 h-8 rounded text-xs font-sans transition-colors',
                p === page
                  ? 'bg-bone-forest text-bone-paper font-semibold'
                  : 'text-bone-ink/60 hover:bg-bone-paper'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded flex items-center justify-center text-bone-ink/50 hover:bg-bone-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────────────── */

const LIMIT = 24

export default function AdminMediaPage() {
  const [images,   setImages]   = useState<MediaImage[]>([])
  const [loading,  setLoading]  = useState(true)
  const [syncing,  setSyncing]  = useState(false)
  const [page,     setPage]     = useState(1)
  const [pag,      setPag]      = useState<PaginationData | null>(null)
  const [tab,      setTab]      = useState<UsageFilter>('all')
  const [search,   setSearch]   = useState('')
  const [debSearch,setDebSearch]= useState('')
  const [counts,   setCounts]   = useState<Counts>({})
  const [selected, setSelected] = useState<MediaImage | null>(null)
  const [toEdit,   setToEdit]   = useState<MediaImage | null>(null)
  const [toDelete, setToDelete] = useState<MediaImage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copied,   setCopied]   = useState<string | null>(null)
  const [syncKey,  setSyncKey]  = useState(0)

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Debounce search ─────────────────────────────────────────── */
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [search])

  /* ── Fetch images ────────────────────────────────────────────── */
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        ...(tab !== 'all' && { usage: tab }),
        ...(debSearch       && { search: debSearch }),
      })
      const res  = await fetch(`/api/media?${params}`)
      const body = await res.json()
      setImages(body.data ?? [])
      setPag(body.pagination ?? null)
    } catch {
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }, [page, tab, debSearch, syncKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchImages() }, [fetchImages])

  /* ── Fetch per-tab counts ────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/admin/media/sync')
      .then((r) => r.json())
      .then(({ counts: c }) => { if (c) setCounts(c) })
      .catch(() => {/* non-critical */})
  }, [syncKey])

  /* ── Sync handler ────────────────────────────────────────────── */
  const handleSync = async () => {
    setSyncing(true)
    const t = toast.loading('Syncing from Cloudinary…')
    try {
      const res  = await fetch('/api/admin/media/sync', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      toast.success(`Synced ${body.total} images (${body.synced} updated)`, { id: t })
      setSyncKey((k) => k + 1)
      setPage(1)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Sync failed', { id: t })
    } finally {
      setSyncing(false)
    }
  }

  /* ── Copy URL ────────────────────────────────────────────────── */
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
      toast.success('URL copied!')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Could not copy URL')
    }
  }

  /* ── Save (alt / title / rename) ────────────────────────────── */
  const handleSave = async (
    id: string,
    data: { alt?: string; title?: string; newName?: string }
  ): Promise<MediaImage> => {
    const t = toast.loading(data.newName ? 'Renaming in Cloudinary…' : 'Saving…')
    const res  = await fetch(`/api/media/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      toast.error(body.error ?? 'Save failed', { id: t })
      throw new Error(body.error ?? 'Save failed')
    }
    toast.success(data.newName ? 'Image renamed successfully' : 'Changes saved', { id: t })
    const updated: MediaImage = body.data
    setImages((prev) => prev.map((img) => (img._id === id ? updated : img)))
    if (selected?._id === id) setSelected(updated)
    return updated
  }

  /* ── Delete ──────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/media/${toDelete._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Image deleted')
      setToDelete(null)
      setSelected(null)
      setSyncKey((k) => k + 1)
    } catch {
      toast.error('Failed to delete image')
    } finally {
      setDeleting(false)
    }
  }

  const changeTab = (t: UsageFilter) => { setTab(t); setPage(1) }

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="p-6 sm:p-8 space-y-5">

      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink flex items-center gap-2">
            <Images size={20} className="text-bone-ink/40" />
            Media Library
          </h1>
          <p className="text-sm text-bone-ink/45 font-sans mt-1">
            {counts.all != null
              ? `${counts.all.toLocaleString()} image${counts.all !== 1 ? 's' : ''} across all folders`
              : 'Manage and browse your Cloudinary image library'}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          loading={syncing}
          onClick={handleSync}
          className="flex-shrink-0 self-start"
        >
          Sync from Cloudinary
        </Button>
      </div>

      {/* Search + tabs */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="w-full h-9 pl-8 pr-3 text-sm font-sans text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded placeholder:text-bone-ink/35 focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 transition-colors"
          />
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
          {TABS.map(({ value, label }) => {
            const count = value === 'all' ? counts.all : counts[value]
            return (
              <button
                key={value}
                type="button"
                onClick={() => changeTab(value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-medium whitespace-nowrap transition-colors',
                  tab === value
                    ? 'bg-bone-forest text-bone-paper'
                    : 'text-bone-ink/55 hover:bg-bone-paper hover:text-bone-ink'
                )}
              >
                {label}
                {count != null && (
                  <span className={cn(
                    'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none',
                    tab === value ? 'bg-bone-paper/20 text-bone-paper' : 'bg-bone-bg text-bone-ink/50'
                  )}>
                    {count > 999 ? '999+' : count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {[...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : images.length === 0 ? (
        <EmptyState onSync={handleSync} syncing={syncing} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {images.map((img) => (
            <ImageCard
              key={img._id}
              image={img}
              onView={setSelected}
              onCopy={handleCopy}
              onDelete={setToDelete}
              onEdit={setToEdit}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pag && (
        <Pagination
          page={page}
          totalPages={pag.totalPages}
          total={pag.total}
          limit={LIMIT}
          onPage={setPage}
        />
      )}

      {/* Copy feedback */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-bone-forest text-bone-paper text-sm font-sans rounded-full shadow-lg pointer-events-none animate-fade-in">
          <Check size={14} />
          URL copied to clipboard
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <DetailModal
          image={selected}
          onClose={() => setSelected(null)}
          onCopy={handleCopy}
          onDelete={(img) => { setToDelete(img); setSelected(null) }}
          onEdit={(img) => { setToEdit(img); setSelected(null) }}
        />
      )}

      {/* Edit / rename modal */}
      {toEdit && (
        <EditModal
          image={toEdit}
          onClose={() => setToEdit(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {toDelete && (
        <DeleteConfirm
          image={toDelete}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
