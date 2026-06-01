'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, Search, Check, Upload, Loader2, ImageOff } from 'lucide-react'
import type { ImageUsage } from '@/lib/cloudinary'

/* ── Types ── */

interface MediaImage {
  _id:          string
  url:          string
  publicId:     string
  alt:          string
  title:        string
  width?:       number
  height?:      number
  usage:        string
  originalName: string
  createdAt:    string
}

interface MediaPickerProps {
  usage?:    ImageUsage
  onSelect:  (url: string, publicId: string) => void
  onClose:   () => void
}

const USAGE_LABELS: Record<string, string> = {
  'safari-cover':   'Safari Cover',
  'safari-gallery': 'Safari Gallery',
  'blog-cover':     'Blog Cover',
  'portfolio':      'Portfolio',
  'team':           'Team',
  'misc':           'Misc',
}

/* ── Component ── */

export default function MediaPicker({ usage, onSelect, onClose }: MediaPickerProps) {
  const [images,        setImages]       = useState<MediaImage[]>([])
  const [loading,       setLoading]      = useState(true)
  const [search,        setSearch]       = useState('')
  const [filterUsage,   setFilterUsage]  = useState<string>(usage ?? '')
  const [selected,      setSelected]     = useState<string | null>(null)
  const [page,          setPage]         = useState(1)
  const [totalPages,    setTotalPages]   = useState(1)
  const [uploading,     setUploading]    = useState(false)
  const [total,         setTotal]        = useState(0)
  const uploadRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    setPage(1)
    setSelected(null)
    fetchImages(1)
  }, [fetchImages])

  /* Handle quick upload inside picker */
  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file',  file)
    fd.append('usage', filterUsage || usage || 'misc')
    fd.append('alt',   file.name.replace(/\.[^/.]+$/, ''))
    fd.append('title', file.name.replace(/\.[^/.]+$/, ''))
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const json = await res.json()
      // Prepend new image
      setImages(prev => [{ ...json.data, title: json.data.alt, originalName: file.name, createdAt: new Date().toISOString() } as MediaImage, ...prev])
      setTotal(t => t + 1)
    }
    setUploading(false)
    if (uploadRef.current) uploadRef.current.value = ''
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchImages(next, true)
  }

  /* Keyboard: Escape closes */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const selectedImage = images.find(i => i._id === selected)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bone-paper w-full max-w-5xl max-h-[92vh] rounded-xl flex flex-col shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(23,22,18,0.1)]">
          <div>
            <h2 className="font-sans font-semibold text-bone-ink text-base">Media Library</h2>
            <p className="text-xs text-bone-ink/40 font-sans mt-0.5">{total} image{total !== 1 ? 's' : ''}</p>
          </div>
          <button type="button" onClick={onClose} className="text-bone-ink/40 hover:text-bone-ink transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-[rgba(23,22,18,0.07)] bg-bone-bg/50">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images…"
              className="h-8 pl-8 pr-3 w-52 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest"
            />
          </div>

          {/* Usage filter */}
          <select
            value={filterUsage}
            onChange={(e) => setFilterUsage(e.target.value)}
            className="h-8 px-3 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded focus:outline-none focus:border-bone-forest text-bone-ink/70"
          >
            <option value="">All types</option>
            {Object.entries(USAGE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {/* Upload button */}
          <label className="ml-auto flex items-center gap-1.5 h-8 px-4 bg-bone-forest text-bone-paper text-xs rounded font-sans cursor-pointer hover:bg-bone-forest/80 transition-colors">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {uploading ? 'Uploading…' : 'Upload image'}
            <input
              ref={uploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleQuickUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* ── Grid ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && images.length === 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-bone-bg animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-bone-ink/30">
              <ImageOff size={32} />
              <div className="text-center">
                <p className="text-sm font-sans font-medium">No images found</p>
                <p className="text-xs font-sans mt-0.5">Upload an image using the button above</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {images.map((img) => {
                  const isSelected = selected === img._id
                  return (
                    <button
                      key={img._id}
                      type="button"
                      title={img.alt || img.title || img.originalName}
                      onClick={() => setSelected(isSelected ? null : img._id)}
                      onDoubleClick={() => onSelect(img.url, img.publicId)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-bone-forest ring-2 ring-bone-forest/30 scale-[0.96]'
                          : 'border-transparent hover:border-bone-forest/40 hover:scale-[0.98]'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || img.title || 'Image'}
                        fill
                        className="object-cover"
                        sizes="120px"
                        unoptimized
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-bone-forest/20 flex items-start justify-end p-1.5">
                          <div className="w-5 h-5 bg-bone-forest rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={11} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {page < totalPages && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="text-sm font-sans text-bone-forest hover:text-bone-clay transition-colors"
                  >
                    Load more images
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(23,22,18,0.1)] bg-bone-bg/30">
          <div className="text-xs text-bone-ink/40 font-sans">
            {selectedImage
              ? <span className="text-bone-ink/70">Selected: <strong>{selectedImage.alt || selectedImage.title || selectedImage.originalName}</strong></span>
              : 'Click to select · Double-click to insert'}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-sm font-sans text-bone-ink/60 hover:text-bone-ink border border-[rgba(23,22,18,0.15)] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={() => selectedImage && onSelect(selectedImage.url, selectedImage.publicId)}
              className="h-9 px-5 text-sm font-sans bg-bone-forest text-bone-paper rounded-md disabled:opacity-40 hover:bg-bone-clay transition-colors"
            >
              Insert image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
