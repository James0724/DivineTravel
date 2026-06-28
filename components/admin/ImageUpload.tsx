'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, FolderOpen, RefreshCw, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ImageUsage } from '@/lib/cloudinary'

// Lazy-imported to avoid circular dep issues
import dynamic from 'next/dynamic'
const MediaPicker = dynamic(() => import('./MediaPicker'), { ssr: false })

/* ── Types ── */

interface ImageUploadProps {
  value?: string
  publicId?: string
  onChange: (url: string, publicId: string) => void
  onClear?: () => void
  usage?: ImageUsage
  label?: string
  required?: boolean
  hint?: string
  aspectRatio?: string
}

/* ── Component ── */

export default function ImageUpload({
  value,
  onChange,
  onClear,
  usage = 'misc',
  label,
  required,
  hint,
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [uploading, setUploading]   = useState(false)
  const [progress, setProgress]     = useState(0)
  const [dragging, setDragging]     = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const doUpload = async (file: File) => {
    setUploading(true)
    setProgress(8)

    // Fake progress that races ahead early (so the bar feels instant) then
    // eases off and parks just under 100 — it never finishes on its own,
    // it just waits there until the real upload resolves and we snap to 100
    // together, instead of sitting frozen at one number the whole time.
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p
        const step = p < 50 ? 14 : p < 75 ? 7 : 2
        return Math.min(90, p + step)
      })
    }, 120)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('usage', usage)
      fd.append('alt',   file.name.replace(/\.[^/.]+$/, ''))
      fd.append('title', file.name.replace(/\.[^/.]+$/, ''))

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      clearInterval(progressTimer)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Upload failed')
      }

      const json = await res.json()
      setProgress(100)
      onChange(json.data.url, json.data.publicId)
      toast.success('Image uploaded successfully')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      clearInterval(progressTimer)
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || uploading) return
    doUpload(files[0])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true)  }
  const onDragLeave = ()                   => { setDragging(false) }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-bone-ink/80 font-sans">
          {label}
          {required && <span className="text-bone-clay ml-0.5">*</span>}
        </label>
      )}
      {hint && <p className="text-xs text-bone-ink/45 font-sans -mt-1">{hint}</p>}

      {value ? (
        /* ── Preview state ── */
        <div className="relative group w-full max-w-sm">
          <div
            className="relative w-full rounded-md overflow-hidden border border-[rgba(23,22,18,0.15)]"
            style={{ aspectRatio }}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized={value.startsWith('http') && !value.includes('res.cloudinary.com')}
              className="object-cover"
              sizes="360px"
            />
          </div>

          {/* Uploading overlay — replaces the hover overlay so the user can't
              think the page froze or re-trigger another upload mid-flight */}
          {uploading ? (
            <div className="absolute inset-0 rounded-md bg-black/60 flex flex-col items-center justify-center gap-2">
              <Loader2 size={22} className="text-white animate-spin" />
              <span className="text-xs text-white/90 font-sans">Uploading… {progress}%</span>
              <div className="w-28 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Hover overlay */
            <div className="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                title="Replace image"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 bg-white/90 text-bone-ink text-xs px-3 py-1.5 rounded font-sans hover:bg-white transition-colors"
              >
                <RefreshCw size={12} /> Replace
              </button>
              <button
                type="button"
                title="Pick from gallery"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 bg-white/90 text-bone-ink text-xs px-3 py-1.5 rounded font-sans hover:bg-white transition-colors"
              >
                <FolderOpen size={12} /> Gallery
              </button>
              {onClear && (
                <button
                  type="button"
                  title="Remove image"
                  onClick={onClear}
                  className="bg-red-500/90 text-white text-xs p-1.5 rounded hover:bg-red-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {/* Hidden replace input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative flex flex-col items-center justify-center gap-3 h-40 rounded-md border-2 border-dashed transition-colors ${
            dragging
              ? 'border-bone-forest bg-bone-forest/5'
              : uploading
              ? 'border-bone-forest/50 bg-bone-forest/3'
              : 'border-[rgba(23,22,18,0.2)] hover:border-bone-forest/50 hover:bg-bone-bg'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-bone-forest border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-bone-ink/50 font-sans">Uploading… {progress}%</span>
              {/* Progress bar */}
              <div className="w-32 h-1 bg-bone-bg-deep rounded-full overflow-hidden">
                <div
                  className="h-full bg-bone-forest rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={22} className="text-bone-ink/30" />
              <div className="text-center px-4">
                <p className="text-sm font-sans text-bone-ink/60">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-bone-forest hover:text-bone-clay font-medium underline-offset-2 hover:underline"
                  >
                    Click to upload
                  </button>
                  {' '}or drag & drop
                </p>
                <p className="text-xs text-bone-ink/35 font-sans mt-0.5">
                  JPEG · PNG · WebP · AVIF &nbsp;—&nbsp; max 10 MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 text-xs text-bone-ink/50 hover:text-bone-forest transition-colors font-sans"
              >
                <FolderOpen size={13} /> Pick from media gallery
              </button>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Gallery picker modal */}
      {pickerOpen && (
        <MediaPicker
          usage={usage}
          onSelect={(url, publicId) => {
            onChange(url, publicId)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
