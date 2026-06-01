'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Globe, Phone, Mail, MapPin, Share2, Search, Bell, Save } from 'lucide-react'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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
  defaultMetaTitle: 'Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safari Tour Packages',
  defaultMetaDescription: 'Expert-guided, tailor-made East Africa safaris. Kenya, Tanzania & Uganda — Budget to Luxury.',
  defaultCurrency: 'USD',
  bookingNotificationEmail: 'info@divinetravelnestsafaris.com',
  minAdvanceBookingDays: 7,
  businessHours: 'Mon–Fri 8am–6pm EAT, Sat 9am–2pm EAT',
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

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setForm({ ...DEFAULT, ...data })
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

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
        <Input
          label="Default Meta Title"
          value={form.defaultMetaTitle}
          onChange={(e) => set('defaultMetaTitle', e.target.value)}
          hint="Max 60 characters"
        />
        <Textarea
          label="Default Meta Description"
          value={form.defaultMetaDescription}
          onChange={(e) => set('defaultMetaDescription', e.target.value)}
          rows={3}
          hint="Max 160 characters"
        />
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
