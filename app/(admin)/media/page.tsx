'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Upload, Trash2, Search, Check, X, ImageOff,
  Loader2, Edit3, Copy, Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ── Types ── */

interface MediaImage {
  _id:          string
  url:          string
  publicId:     string
  alt:          string
  title:        string
  width?:       number
  height?:      number
  format:       string
  fileSize?:    number
  usage:        string
  originalName: string
  folder:       string
  createdAt:    string
}

const USAGE_OPTIONS = [
  { value: '',               label: 'All images'     },
  { value: 'safari-cover',   label: 'Safari covers'  },
  { value: 'safari-gallery', label: 'Safari gallery' },
  { value: 'portfolio',      label: 'Portfolio'      },
  { value: 'team',           label: 'Team'           },
  { value: 'misc',           label: 'Misc'           },
]

const USAGE_BADGE: Record<string, string> = {
  'safari-cover':   'bg-amber-100 text-amber-700',
  'safari-gallery': 'bg-blue-100  text-blue-700',
  'portfolio':      'bg-violet-100 text-violet-700',
  'team':           'bg-green-100 text-green-700',
  'misc':           'bg-gray-100  text-gray-600',
}

function fmtSize(bytes?: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ── Main Page ── */

export default function MediaPage() {
  const [images,      setImages]      = useState<MediaImage[]>([])
  const [loading,     setLoading]     = useState(true)
  const [uploading,   setUploading]   = useState(false)
  const [search,      setSearch]      = useState('')
  const [filterUsage, setFilterUsage] = useState('')
  const [selected,    setSelected]    = useState<Set<string>>(new Set())
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [total,       setTotal]       = useState(0)
  const [editTarget,  setEditTarget]  = useState<MediaImage | null>(null)
  const [editAlt,     setEditAlt]     = useState('')
  const [editTitle,   setEditTitle]   = useState('')
  const [deleting,    setDeleting]    = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [uploadUsage, setUploadUsage] = useState('safari-cover')

  const fetchImages = useCallback(async (p: number, append = false) => {
    if (!append) setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: '24' })
    if (filterUsage) params.set('usage', filterUsage)
    if (search)      params.set('search', search)
    const res  = await fetch(`/api/media?${params}`)
    const json = await res.json()
    setImages(prev => append ? [...prev, ...(json.data ?? [])] : (json.data ?? []))
    setTotalPages(json.pagination?.totalPages ?? 1)
    setTotal(json.pagination?.total ?? 0)
    setLoading(false)
  }, [filterUsage, search])

  useEffect(() => { setPage(1); setSelected(new Set()); fetchImages(1) }, [fetchImages])

  /* ── Upload ── */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    let succeeded = 0
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file',  file)
      fd.append('usage', uploadUsage)
      fd.append('alt',   file.name.replace(/\.[^/.]+$/, ''))
      fd.append('title', file.name.replace(/\.[^/.]+$/, ''))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) succeeded++
    }
    if (succeeded) {
      toast.success(`${succeeded} image${succeeded > 1 ? 's' : ''} uploaded`)
      fetchImages(1)
      setSelected(new Set())
    }
    setUploading(false)
    if (uploadRef.current) uploadRef.current.value = ''
  }

  /* ── Delete selected ── */
  const deleteSelected = async () => {
    if (!selected.size) return
    if (!window.confirm(`Delete ${selected.size} image${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    let failed = 0
    for (const id of selected) {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (!res.ok) failed++
    }
    if (!failed) {
      toast.success('Images deleted')
    } else {
      toast.error(`${failed} deletion${failed > 1 ? 's' : ''} failed`)
    }
    setSelected(new Set())
    fetchImages(1)
    setDeleting(false)
  }

  /* ── Save edit ── */
  const saveEdit = async () => {
    if (!editTarget) return
    const res = await fetch(`/api/media/${editTarget._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt: editAlt, title: editTitle }),
    })
    if (res.ok) {
      toast.success('Image updated')
      setImages(prev => prev.map(i =>
        i._id === editTarget._id ? { ...i, alt: editAlt, title: editTitle } : i
      ))
    }
    setEditTarget(null)
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected(selected.size === images.length ? new Set() : new Set(images.map(i => i._id)))

  return (
    <div className="min-h-screen bg-bone-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-bone-ink">Media Library</h1>
            <p className="text-sm text-bone-ink/45 font-sans mt-0.5">
              {total} image{total !== 1 ? 's' : ''} stored in Cloudinary
            </p>
          </div>

          {/* Upload controls */}
          <div className="flex items-center gap-2">
            <select
              value={uploadUsage}
              onChange={(e) => setUploadUsage(e.target.value)}
              className="h-9 px-3 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest text-bone-ink/70"
            >
              {USAGE_OPTIONS.slice(1).map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 h-9 px-4 bg-bone-forest text-bone-paper text-sm rounded font-sans cursor-pointer hover:bg-bone-clay transition-colors">
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? 'Uploading…' : 'Upload'}
              <input
                ref={uploadRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* ── Filters & bulk actions ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or alt…"
              className="h-9 pl-8 pr-3 w-56 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest"
            />
          </div>

          {/* Usage filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-bone-ink/40" />
            <select
              value={filterUsage}
              onChange={(e) => setFilterUsage(e.target.value)}
              className="h-9 px-3 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest text-bone-ink/70"
            >
              {USAGE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-bone-ink/60 font-sans">{selected.size} selected</span>
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 h-9 px-3 text-sm font-sans text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-bone-paper animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-bone-ink/30">
            <ImageOff size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="text-base font-sans font-medium">No images yet</p>
              <p className="text-sm font-sans mt-1">Upload images using the button above</p>
            </div>
          </div>
        ) : (
          <>
            {/* Select all row */}
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 text-xs font-sans text-bone-ink/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.size === images.length && images.length > 0}
                  onChange={toggleAll}
                  className="accent-bone-forest"
                />
                Select all
              </label>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {images.map((img) => {
                const isSelected = selected.has(img._id)
                return (
                  <div
                    key={img._id}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-bone-forest' : 'border-transparent hover:border-bone-forest/30'
                    }`}
                    onClick={() => toggleSelect(img._id)}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square relative bg-bone-bg">
                      <Image
                        src={img.url}
                        alt={img.alt || img.title || 'image'}
                        fill
                        className="object-cover"
                        sizes="140px"
                        unoptimized
                      />
                    </div>

                    {/* Selection indicator */}
                    <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-bone-forest border-bone-forest'
                        : 'bg-white/80 border-[rgba(0,0,0,0.2)] opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>

                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="w-full p-2 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Edit */}
                        <button
                          type="button"
                          title="Edit details"
                          onClick={() => { setEditTarget(img); setEditAlt(img.alt); setEditTitle(img.title) }}
                          className="w-7 h-7 bg-white/90 text-bone-ink rounded flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Edit3 size={12} />
                        </button>
                        {/* Copy URL */}
                        <button
                          type="button"
                          title="Copy URL"
                          onClick={() => { navigator.clipboard.writeText(img.url); toast.success('URL copied') }}
                          className="w-7 h-7 bg-white/90 text-bone-ink rounded flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete"
                          onClick={async () => {
                            if (!window.confirm('Delete this image?')) return
                            const res = await fetch(`/api/media/${img._id}`, { method: 'DELETE' })
                            if (res.ok) {
                              toast.success('Deleted')
                              setImages(prev => prev.filter(i => i._id !== img._id))
                              setTotal(t => t - 1)
                            } else {
                              toast.error('Delete failed')
                            }
                          }}
                          className="w-7 h-7 bg-red-500/90 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Usage badge */}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${USAGE_BADGE[img.usage] ?? USAGE_BADGE.misc}`}>
                        {img.usage.replace('safari-', '').slice(0, 4)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Image info below grid (for selected) */}
            {images.map((img) => selected.has(img._id) && (
              <div key={`info-${img._id}`} className="hidden" />
            ))}

            {/* Pagination */}
            {page < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => { const next = page + 1; setPage(next); fetchImages(next, true) }}
                  className="h-9 px-6 text-sm font-sans border border-[rgba(23,22,18,0.2)] rounded text-bone-ink/60 hover:text-bone-ink hover:border-bone-forest transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-bone-paper rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(23,22,18,0.1)]">
              <h3 className="font-sans font-semibold text-bone-ink text-sm">Edit image details</h3>
              <button onClick={() => setEditTarget(null)} className="text-bone-ink/40 hover:text-bone-ink">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Preview */}
              <div className="relative h-40 rounded-lg overflow-hidden bg-bone-bg">
                <Image src={editTarget.url} alt="Preview" fill className="object-cover" sizes="400px" unoptimized />
              </div>
              {/* Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-bone-ink/70 font-sans mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-9 px-3 text-sm font-sans bg-bone-bg border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest"
                    placeholder="Descriptive title…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-bone-ink/70 font-sans mb-1">Alt text</label>
                  <input
                    type="text"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="w-full h-9 px-3 text-sm font-sans bg-bone-bg border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest"
                    placeholder="Describe the image for accessibility…"
                  />
                </div>
                <div className="text-xs text-bone-ink/40 font-sans space-y-0.5">
                  <p>Folder: <code className="bg-bone-bg px-1 rounded">{editTarget.folder}</code></p>
                  <p>Type: <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${USAGE_BADGE[editTarget.usage] ?? ''}`}>{editTarget.usage}</span></p>
                  {editTarget.width && <p>Dimensions: {editTarget.width} × {editTarget.height}px</p>}
                  <p>Size: {fmtSize(editTarget.fileSize)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-[rgba(23,22,18,0.1)]">
              <button
                onClick={() => setEditTarget(null)}
                className="h-9 px-4 text-sm font-sans text-bone-ink/60 border border-[rgba(23,22,18,0.15)] rounded hover:text-bone-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="h-9 px-5 text-sm font-sans bg-bone-forest text-bone-paper rounded hover:bg-bone-clay transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
