'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Globe, Phone, Mail, MapPin, Share2, Search, Bell, Save, Wand2, RotateCcw } from 'lucide-react'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SiteSettings {
  siteName: string
  siteTagline: string
  aboutText: string

  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  country: string

  facebook: string
  instagram: string
  twitter: string
  youtube: string
  tripadvisor: string
  googleReviews: string

  defaultMetaTitle: string
  defaultMetaDescription: string

  defaultCurrency: string
  bookingNotificationEmail: string
  minAdvanceBookingDays: number
  businessHours: string
}

const DEFAULT: SiteSettings = {
  siteName: 'Divine Travel Nest Safaris',
  siteTagline: 'Your Unforgettable East Africa Safari',
  aboutText: '',
  email: 'info@divinetravelnestsafaris.com',
  phone: '',
  whatsapp: '',
  address: '',
  city: 'Nairobi',
  country: 'Kenya',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  tripadvisor: '',
  googleReviews: '',
  defaultMetaTitle: 'Divine Travel Nest Safaris — Kenya, Tanzania, Uganda & Rwanda Safari Tour Packages',
  defaultMetaDescription: 'Expert-guided, tailor-made East Africa safaris. Kenya, Tanzania, Uganda & Rwanda — Budget to Luxury.',
  defaultCurrency: 'USD',
  bookingNotificationEmail: 'info@divinetravelnestsafaris.com',
  minAdvanceBookingDays: 7,
  businessHours: 'Mon–Fri 8am–6pm EAT, Sat 9am–2pm EAT',
}

/* ── SEO auto-generators ── */
function generateMetaTitle(f: Pick<SiteSettings, 'siteName' | 'siteTagline' | 'city' | 'country'>): string {
  const full = f.siteTagline ? `${f.siteName} | ${f.siteTagline}` : f.siteName
  if (full.length <= 60) return full
  const loc = [f.city, f.country].filter(Boolean).join(', ')
  return (loc ? `${f.siteName} — ${loc}` : f.siteName).slice(0, 60)
}

function generateMetaDescription(f: Pick<SiteSettings, 'siteName' | 'siteTagline' | 'aboutText' | 'city' | 'country'>): string {
  if (f.aboutText.trim()) {
    const t = f.aboutText.trim()
    return t.length <= 157 ? t : t.slice(0, 157) + '…'
  }
  const loc = [f.city, f.country].filter(Boolean).join(', ')
  const tagline = f.siteTagline || 'Expert safari experiences'
  const raw = loc ? `${f.siteName} — ${tagline}. Based in ${loc}.` : `${f.siteName} — ${tagline}.`
  return raw.slice(0, 160)
}

/* ── Reusable section card ── */
function SettingsSection({
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

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [metaTitleAuto, setMetaTitleAuto] = useState(true)
  const [metaDescAuto, setMetaDescAuto] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          const merged = { ...DEFAULT, ...data }
          setForm(merged)
          setMetaTitleAuto(!data.defaultMetaTitle || data.defaultMetaTitle === generateMetaTitle(merged))
          setMetaDescAuto(!data.defaultMetaDescription || data.defaultMetaDescription === generateMetaDescription(merged))
        }
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  // Keep auto SEO fields in sync when source fields change
  useEffect(() => {
    if (metaTitleAuto) setForm(prev => ({ ...prev, defaultMetaTitle: generateMetaTitle(prev) }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.siteName, form.siteTagline, form.city, form.country, metaTitleAuto])

  useEffect(() => {
    if (metaDescAuto) setForm(prev => ({ ...prev, defaultMetaDescription: generateMetaDescription(prev) }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.aboutText, form.siteName, form.city, form.country, form.siteTagline, metaDescAuto])

  const set = (key: keyof SiteSettings, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-5 max-w-3xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">Settings</h1>
          <p className="text-sm text-bone-ink/45 font-sans mt-1">
            Manage site-wide configuration, contact info and social links.
          </p>
        </div>
        <Button
          variant="primary"
          loading={saving}
          leftIcon={<Save size={15} />}
          onClick={handleSave}
        >
          Save All
        </Button>
      </div>

      {/* ── Site Identity ── */}
      <SettingsSection icon={Globe} title="Site Identity" subtitle="Brand name, tagline and about text">
        <Input
          label="Site Name"
          value={form.siteName}
          onChange={(e) => set('siteName', e.target.value)}
          required
        />
        <Input
          label="Tagline"
          value={form.siteTagline}
          onChange={(e) => set('siteTagline', e.target.value)}
          placeholder="Short one-liner tagline"
        />
        <Textarea
          label="About Text"
          value={form.aboutText}
          onChange={(e) => set('aboutText', e.target.value)}
          rows={5}
          placeholder="Brief company description used in footers and about sections…"
        />
      </SettingsSection>

      {/* ── Contact Information ── */}
      <SettingsSection icon={Phone} title="Contact Information" subtitle="Phone, email, WhatsApp and office address">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="info@divinetravelnestsafaris.com"
            required
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+254 700 000 000"
          />
          <Input
            label="WhatsApp Number"
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value)}
            placeholder="+254 700 000 000"
          />
          <Input
            label="Business Hours"
            value={form.businessHours}
            onChange={(e) => set('businessHours', e.target.value)}
            placeholder="Mon–Fri 8am–6pm EAT"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Street Address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="123 Safari Lane"
            className="sm:col-span-1"
          />
          <Input
            label="City"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Nairobi"
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            placeholder="Kenya"
          />
        </div>
      </SettingsSection>

      {/* ── Social Media ── */}
      <SettingsSection icon={Share2} title="Social Media" subtitle="Links displayed in the site footer and contact page">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { key: 'facebook',    label: 'Facebook',    placeholder: 'https://facebook.com/…' },
            { key: 'instagram',   label: 'Instagram',   placeholder: 'https://instagram.com/…' },
            { key: 'twitter',     label: 'X / Twitter', placeholder: 'https://x.com/…' },
            { key: 'youtube',     label: 'YouTube',     placeholder: 'https://youtube.com/…' },
            { key: 'tripadvisor', label: 'TripAdvisor', placeholder: 'https://tripadvisor.com/…' },
            { key: 'googleReviews', label: 'Google Reviews', placeholder: 'https://g.page/r/…/review' },
          ] as { key: keyof SiteSettings; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
            <Input
              key={key}
              label={label}
              type="url"
              value={form[key] as string}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
            />
          ))}
        </div>
      </SettingsSection>

      {/* ── SEO Defaults ── */}
      <SettingsSection icon={Search} title="SEO Defaults" subtitle="Fallback meta title and description used when page-specific SEO is absent">
        {/* Meta Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="default-meta-title" className="text-sm font-medium text-bone-ink/80 font-sans">
              Default Meta Title
            </label>
            <button
              type="button"
              onClick={() => {
                const next = !metaTitleAuto
                setMetaTitleAuto(next)
                if (next) set('defaultMetaTitle', generateMetaTitle(form))
              }}
              className={cn(
                'flex items-center gap-1 text-xs font-sans px-2 py-0.5 rounded-full border transition-colors',
                metaTitleAuto
                  ? 'border-bone-forest/40 bg-bone-forest/10 text-bone-forest hover:bg-bone-forest/20'
                  : 'border-[rgba(23,22,18,0.15)] text-bone-ink/40 hover:text-bone-ink/65 hover:border-[rgba(23,22,18,0.3)]'
              )}
            >
              {metaTitleAuto ? <><Wand2 size={10} /> Auto</> : <><RotateCcw size={10} /> Reset to auto</>}
            </button>
          </div>
          <Input
            id="default-meta-title"
            value={form.defaultMetaTitle}
            onChange={(e) => { setMetaTitleAuto(false); set('defaultMetaTitle', e.target.value) }}
            hint={`${form.defaultMetaTitle.length}/60 characters`}
          />
        </div>

        {/* Meta Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="default-meta-description" className="text-sm font-medium text-bone-ink/80 font-sans">
              Default Meta Description
            </label>
            <button
              type="button"
              onClick={() => {
                const next = !metaDescAuto
                setMetaDescAuto(next)
                if (next) set('defaultMetaDescription', generateMetaDescription(form))
              }}
              className={cn(
                'flex items-center gap-1 text-xs font-sans px-2 py-0.5 rounded-full border transition-colors',
                metaDescAuto
                  ? 'border-bone-forest/40 bg-bone-forest/10 text-bone-forest hover:bg-bone-forest/20'
                  : 'border-[rgba(23,22,18,0.15)] text-bone-ink/40 hover:text-bone-ink/65 hover:border-[rgba(23,22,18,0.3)]'
              )}
            >
              {metaDescAuto ? <><Wand2 size={10} /> Auto</> : <><RotateCcw size={10} /> Reset to auto</>}
            </button>
          </div>
          <Textarea
            id="default-meta-description"
            value={form.defaultMetaDescription}
            onChange={(e) => { setMetaDescAuto(false); set('defaultMetaDescription', e.target.value) }}
            rows={3}
            hint={`${form.defaultMetaDescription.length}/160 characters`}
          />
        </div>
      </SettingsSection>

      {/* ── Booking & Notifications ── */}
      <SettingsSection icon={Bell} title="Booking & Notifications" subtitle="Currency, lead time and notification routing">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-bone-ink/80 font-sans">Default Currency</label>
            <select
              value={form.defaultCurrency}
              onChange={(e) => set('defaultCurrency', e.target.value)}
              className="h-10 px-3 font-sans text-sm text-bone-ink bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
            >
              {['USD', 'EUR', 'GBP', 'KES', 'TZS', 'UGX'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input
            label="Min Advance Booking (days)"
            type="number"
            value={form.minAdvanceBookingDays}
            onChange={(e) => set('minAdvanceBookingDays', Number(e.target.value))}
            min={0}
            max={365}
          />
          <Input
            label="Booking Notification Email"
            type="email"
            value={form.bookingNotificationEmail}
            onChange={(e) => set('bookingNotificationEmail', e.target.value)}
            placeholder="bookings@…"
          />
        </div>
      </SettingsSection>

      {/* Floating save at bottom */}
      <div className="flex justify-end pb-8">
        <Button
          variant="primary"
          size="lg"
          loading={saving}
          leftIcon={<Save size={15} />}
          onClick={handleSave}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
