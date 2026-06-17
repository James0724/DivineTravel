'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  User,
  Lock,
  Calendar,
  Clock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Mail,
  CheckCircle2,
  KeyRound,
  Images,
  Upload,
  X,
  Check,
  RefreshCw,
} from 'lucide-react'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────────────────── */

interface ProfileData {
  _id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  bio?: string
  active: boolean
  lastLogin?: string
  createdAt: string
}

interface GalleryItem {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

/* ── Constants ─────────────────────────────────────────────────────── */

const ROLE_STYLE: Record<string, string> = {
  admin:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  editor: 'bg-blue-50   text-blue-700   border-blue-200',
  viewer: 'bg-stone-50  text-stone-700  border-stone-200',
}

/* ── Reusable section card ─────────────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(23,22,18,0.07)]">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-bone-bg text-bone-ink/50 flex-shrink-0">
          <Icon size={16} />
        </div>
        <div>
          <p className="font-sans font-semibold text-sm text-bone-ink">{title}</p>
          {subtitle && <p className="text-xs text-bone-ink/40 font-sans">{subtitle}</p>}
        </div>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

/* ── Eye-toggle ────────────────────────────────────────────────────── */

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-bone-ink/40 hover:text-bone-ink/70 transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )
}

/* ── Inline sync button used inside gallery empty state ────────────── */

function SyncFromGallery({ onSynced }: { onSynced: () => void }) {
  const [syncing, setSyncing] = useState(false)

  const run = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/media/sync', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      toast.success(`Synced ${body.total} images — reopen gallery to browse`)
      onSynced()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <button
      type="button"
      disabled={syncing}
      onClick={run}
      className={cn(
        'mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-medium',
        'bg-bone-forest text-bone-paper hover:bg-bone-forest/90 transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed'
      )}
    >
      {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
      {syncing ? 'Syncing…' : 'Sync from Cloudinary'}
    </button>
  )
}

/* ── Gallery picker modal ──────────────────────────────────────────── */

function GalleryModal({
  images,
  loading,
  selected,
  saving,
  onSelect,
  onConfirm,
  onClose,
  onUploadInstead,
}: {
  images: GalleryItem[]
  loading: boolean
  selected: string | null
  saving: boolean
  onSelect: (url: string) => void
  onConfirm: () => void
  onClose: () => void
  onUploadInstead: () => void
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Sheet/dialog */}
      <div className="bg-bone-paper w-full sm:max-w-2xl sm:rounded-lg shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[80vh] rounded-t-2xl sm:rounded-t-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Images size={17} className="text-bone-ink/50" />
            <h3 className="font-serif text-lg font-semibold text-bone-ink">Team Gallery</h3>
            {!loading && images.length > 0 && (
              <span className="text-xs text-bone-ink/40 font-sans">({images.length} photos)</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bone-bg transition-colors text-bone-ink/50 hover:text-bone-ink"
          >
            <X size={16} />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square rounded bg-bone-bg animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Images size={36} strokeWidth={1.2} className="text-bone-ink/25" />
              <p className="text-sm font-sans font-medium text-bone-ink/70 mt-3">No team photos found</p>
              <p className="text-xs font-sans text-bone-ink/45 mt-1 max-w-xs">
                Your Cloudinary library hasn&apos;t been synced yet. Sync once to import all images.
              </p>
              <SyncFromGallery onSynced={() => {
                // reset gallery so it re-fetches after sync
                onClose()
              }} />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {images.map((img) => {
                const active = selected === img.url
                return (
                  <button
                    key={img.publicId}
                    type="button"
                    onClick={() => onSelect(img.url)}
                    className={cn(
                      'relative aspect-square rounded overflow-hidden border-2 transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone-forest',
                      active
                        ? 'border-bone-forest ring-2 ring-bone-forest/25 scale-[0.97]'
                        : 'border-transparent hover:border-bone-forest/40 hover:scale-[0.98]'
                    )}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="(max-width:640px) 33vw, (max-width:768px) 25vw, 20vw"
                      className="object-cover"
                      unoptimized
                    />
                    {active && (
                      <div className="absolute inset-0 bg-bone-forest/30 flex items-center justify-center">
                        <span className="w-7 h-7 rounded-full bg-bone-forest flex items-center justify-center shadow-lg">
                          <Check size={14} className="text-bone-paper" strokeWidth={2.5} />
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Upload-instead row */}
        <div className="px-5 py-3 bg-bone-bg/60 border-t border-[rgba(23,22,18,0.07)] flex-shrink-0">
          <button
            type="button"
            onClick={onUploadInstead}
            className="flex items-center gap-1.5 text-xs font-sans text-bone-forest hover:underline"
          >
            <Upload size={12} />
            Upload a new photo from your device instead
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[rgba(23,22,18,0.1)] flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!selected}
            loading={saving}
            leftIcon={<Check size={14} />}
            onClick={onConfirm}
          >
            Use this photo
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Loading skeleton ──────────────────────────────────────────────── */

function ProfileSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-bone-paper rounded animate-pulse" />
          <div className="h-4 w-64 bg-bone-paper rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-bone-paper rounded animate-pulse" />
      </div>
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-28 h-28 rounded-full bg-bone-bg animate-pulse mx-auto sm:mx-0 flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-6 w-44 bg-bone-bg rounded animate-pulse" />
            <div className="h-5 w-20 bg-bone-bg rounded-full animate-pulse" />
            <div className="h-4 w-56 bg-bone-bg rounded animate-pulse" />
            <div className="h-4 w-44 bg-bone-bg rounded animate-pulse" />
          </div>
        </div>
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-52 bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md animate-pulse"
        />
      ))}
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────────────── */

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  /* profile form */
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  /* password form */
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})

  /* gallery */
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [gallerySelected, setGallerySelected] = useState<string | null>(null)
  const [gallerySaving, setGallerySaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── Fetch profile ─────────────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setProfile(data)
          setName(data.name ?? '')
          setBio(data.bio ?? '')
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  /* ── Save profile info ─────────────────────────────────────────── */
  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), bio }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setProfile(data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  /* ── Upload avatar from device ─────────────────────────────────── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }

    setAvatarUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/admin/profile/avatar', { method: 'POST', body: fd })
      if (!uploadRes.ok) {
        const { error } = await uploadRes.json()
        throw new Error(error ?? 'Upload failed')
      }
      const { url } = await uploadRes.json()

      const saveRes = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: url }),
      })
      if (!saveRes.ok) throw new Error()
      const { data } = await saveRes.json()
      setProfile(data)
      toast.success('Photo updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Open gallery (lazy-load images) ──────────────────────────── */
  const handleOpenGallery = async () => {
    setShowGallery(true)
    setGallerySelected(null)
    if (galleryImages.length > 0) return
    setGalleryLoading(true)
    try {
      const res = await fetch('/api/admin/profile/gallery')
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setGalleryImages(data ?? [])
    } catch {
      toast.error('Failed to load gallery')
    } finally {
      setGalleryLoading(false)
    }
  }

  /* ── Use gallery photo as avatar ───────────────────────────────── */
  const handleUseGalleryPhoto = async () => {
    if (!gallerySelected) return
    setGallerySaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: gallerySelected }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setProfile(data)
      setShowGallery(false)
      setGallerySelected(null)
      toast.success('Photo updated!')
    } catch {
      toast.error('Failed to update photo')
    } finally {
      setGallerySaving(false)
    }
  }

  /* ── Gallery → upload instead ──────────────────────────────────── */
  const handleUploadInstead = () => {
    setShowGallery(false)
    fileInputRef.current?.click()
  }

  /* ── Change password ───────────────────────────────────────────── */
  const handlePasswordChange = async () => {
    const errs: Record<string, string> = {}
    if (!pw.current) errs.current = 'Required'
    if (!pw.next) errs.next = 'Required'
    else if (pw.next.length < 8) errs.next = 'Minimum 8 characters'
    if (pw.next !== pw.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setPwErrors(errs); return }

    setPwErrors({})
    setPwSaving(true)
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Failed')
      setPw({ current: '', next: '', confirm: '' })
      toast.success('Password changed successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password'
      if (msg === 'Current password is incorrect') setPwErrors({ current: 'Incorrect password' })
      else toast.error(msg)
    } finally {
      setPwSaving(false)
    }
  }

  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (loading) return <ProfileSkeleton />

  return (
    <>
      <div className="p-6 sm:p-8 space-y-6 max-w-3xl">

        {/* ── Page header ── */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-bone-ink">My Profile</h1>
            <p className="text-sm text-bone-ink/45 font-sans mt-1">
              Manage your personal information and account settings.
            </p>
          </div>
          <Button
            variant="primary"
            loading={saving}
            leftIcon={<Save size={15} />}
            onClick={handleSaveProfile}
            className="self-start xs:self-auto flex-shrink-0"
          >
            Save Profile
          </Button>
        </div>

        {/* ── Identity card ── */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">

            {/* Avatar column */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 self-center sm:self-start">

              {/* Clickable avatar circle */}
              <div
                role="button"
                aria-label="Change profile photo"
                tabIndex={0}
                onClick={() => !avatarUploading && fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && !avatarUploading && fileInputRef.current?.click()}
                className="relative group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-bone-forest rounded-full"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[rgba(23,22,18,0.12)]">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-bone-forest flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-bone-paper select-none">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                {/* Hover / uploading overlay */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full flex items-center justify-center',
                    'bg-black/45 transition-opacity duration-200',
                    avatarUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {avatarUploading
                    ? <Loader2 size={22} className="text-white animate-spin" />
                    : <Camera size={20} className="text-white drop-shadow" />
                  }
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {/* Photo action buttons */}
              <div className="flex items-center gap-2 text-xs font-sans">
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex items-center gap-1 text-bone-forest hover:underline transition-opacity',
                    'disabled:opacity-40 disabled:cursor-not-allowed'
                  )}
                >
                  <Upload size={11} />
                  Upload
                </button>
                <span className="text-bone-ink/25 select-none">|</span>
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={handleOpenGallery}
                  className={cn(
                    'flex items-center gap-1 text-bone-forest hover:underline transition-opacity',
                    'disabled:opacity-40 disabled:cursor-not-allowed'
                  )}
                >
                  <Images size={11} />
                  Gallery
                </button>
              </div>
            </div>

            {/* Identity info */}
            <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left sm:pt-1">
              <div>
                <h2 className="font-serif text-xl font-semibold text-bone-ink leading-tight">
                  {profile?.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border font-sans capitalize',
                      ROLE_STYLE[profile?.role ?? 'viewer']
                    )}
                  >
                    <ShieldCheck size={11} />
                    {profile?.role}
                  </span>
                  {profile?.active && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border font-sans bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 size={11} />
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-sans text-bone-ink/65">
                  <Mail size={13} className="flex-shrink-0 text-bone-ink/35" />
                  <span className="truncate">{profile?.email}</span>
                </div>
                {profile?.lastLogin && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-sans text-bone-ink/65">
                    <Clock size={13} className="flex-shrink-0 text-bone-ink/35" />
                    <span>
                      Last login:{' '}
                      {formatDate(profile.lastLogin, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
                {profile?.createdAt && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-sans text-bone-ink/65">
                    <Calendar size={13} className="flex-shrink-0 text-bone-ink/35" />
                    <span>
                      Member since{' '}
                      {formatDate(profile.createdAt, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <Section
          icon={User}
          title="Personal Information"
          subtitle="Update your display name and bio"
        >
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your full name"
            autoComplete="name"
          />
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="A short bio about yourself…"
            hint="Displayed on journal posts and author pages."
          />
          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              leftIcon={<Save size={13} />}
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </div>
        </Section>

        {/* ── Change Password ── */}
        <Section
          icon={Lock}
          title="Change Password"
          subtitle="Keep your account secure with a strong, unique password"
        >
          <Input
            label="Current Password"
            type={showPw.current ? 'text' : 'password'}
            value={pw.current}
            autoComplete="current-password"
            onChange={(e) => {
              setPw((p) => ({ ...p, current: e.target.value }))
              setPwErrors((p) => ({ ...p, current: '' }))
            }}
            error={pwErrors.current}
            rightAddon={
              <EyeToggle
                show={showPw.current}
                onToggle={() => setShowPw((p) => ({ ...p, current: !p.current }))}
              />
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type={showPw.next ? 'text' : 'password'}
              value={pw.next}
              autoComplete="new-password"
              onChange={(e) => {
                setPw((p) => ({ ...p, next: e.target.value }))
                setPwErrors((p) => ({ ...p, next: '' }))
              }}
              error={pwErrors.next}
              hint={!pwErrors.next ? 'Minimum 8 characters' : undefined}
              rightAddon={
                <EyeToggle
                  show={showPw.next}
                  onToggle={() => setShowPw((p) => ({ ...p, next: !p.next }))}
                />
              }
            />
            <Input
              label="Confirm New Password"
              type={showPw.confirm ? 'text' : 'password'}
              value={pw.confirm}
              autoComplete="new-password"
              onChange={(e) => {
                setPw((p) => ({ ...p, confirm: e.target.value }))
                setPwErrors((p) => ({ ...p, confirm: '' }))
              }}
              error={pwErrors.confirm}
              rightAddon={
                <EyeToggle
                  show={showPw.confirm}
                  onToggle={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                />
              }
            />
          </div>

          {pw.next.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: '8+ chars', ok: pw.next.length >= 8 },
                { label: 'Uppercase', ok: /[A-Z]/.test(pw.next) },
                { label: 'Number', ok: /\d/.test(pw.next) },
                { label: 'Symbol', ok: /[^A-Za-z0-9]/.test(pw.next) },
              ].map(({ label, ok }) => (
                <span
                  key={label}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans border',
                    ok
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-bone-bg text-bone-ink/40 border-[rgba(23,22,18,0.12)]'
                  )}
                >
                  {ok && <CheckCircle2 size={10} />}
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              loading={pwSaving}
              leftIcon={<KeyRound size={14} />}
              onClick={handlePasswordChange}
            >
              Update Password
            </Button>
          </div>
        </Section>

        <div className="pb-4" />
      </div>

      {/* ── Gallery modal ── */}
      {showGallery && (
        <GalleryModal
          images={galleryImages}
          loading={galleryLoading}
          selected={gallerySelected}
          saving={gallerySaving}
          onSelect={setGallerySelected}
          onConfirm={handleUseGalleryPhoto}
          onClose={() => { setShowGallery(false); setGallerySelected(null) }}
          onUploadInstead={handleUploadInstead}
        />
      )}
    </>
  )
}
