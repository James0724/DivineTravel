'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useCreateBooking } from '@/hooks/useBooking'

interface PricingTier {
  pricePerPerson: number
}

interface SafariProps {
  _id: string
  name: string
  duration: number
  pricing: {
    budget?: PricingTier | null
    midRange?: PricingTier | null
    luxury?: PricingTier | null
  }
}

interface BookingModalProps {
  safari: SafariProps
  onClose: () => void
}

const TIERS = [
  { key: 'budget' as const, label: 'Budget' },
  { key: 'midRange' as const, label: 'Mid-range' },
  { key: 'luxury' as const, label: 'Luxury' },
]

export default function BookingModal({ safari, onClose }: BookingModalProps) {
  const availableTiers = TIERS.filter((t) => safari.pricing?.[t.key]?.pricePerPerson)
  const defaultTier =
    availableTiers.find((t) => t.key === 'midRange')?.key ??
    availableTiers[0]?.key ??
    'budget'

  const [tier, setTier] = useState<'budget' | 'midRange' | 'luxury'>(defaultTier)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [preferredDate, setPreferredDate] = useState('')
  const [alternateDate, setAlternateDate] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<{ bookingRef: string } | null>(null)

  const createBooking = useCreateBooking()

  const pricePerPerson = safari.pricing?.[tier]?.pricePerPerson ?? 0
  const groupSize = adults + children
  const totalPrice = pricePerPerson * groupSize

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  function validate() {
    const e: Record<string, string> = {}
    if (firstName.trim().length < 2) e.firstName = 'Required'
    if (lastName.trim().length < 2) e.lastName = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (phone.trim().length < 7) e.phone = 'Required'
    if (nationality.trim().length < 2) e.nationality = 'Required'
    if (!preferredDate) e.preferredDate = 'Required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      const result = await createBooking.mutateAsync({
        safariId: safari._id,
        tier,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim(),
        groupSize,
        adultCount: adults,
        childCount: children,
        preferredDate,
        ...(alternateDate && { alternateDate }),
        ...(specialRequests.trim() && { specialRequests: specialRequests.trim() }),
      })
      setSuccess({ bookingRef: result.data!.bookingRef })
    } catch (err) {
      setErrors({ form: (err as Error).message || 'Something went wrong. Please try again.' })
    }
  }

  function clearError(field: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const inputClass = (field: string) =>
    `w-full h-11 px-3 border text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors ${
      errors[field] ? 'border-red-400' : 'border-[var(--line)]'
    }`

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
        <div className="relative bg-[var(--paper)] p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[var(--forest)] flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-[var(--paper)]" strokeWidth={2.5} />
          </div>
          <h2 className="font-serif font-normal text-[30px] leading-tight mb-3">
            Booking Request Sent
          </h2>
          <p className="text-[var(--muted)] text-[14px] leading-relaxed mb-5">
            Thank you, <strong>{firstName}</strong>! A member of our team will contact you shortly
            to discuss deposit payment and finalise your pricing and confirmation.
          </p>
          <div className="font-mono text-[11px] bg-[var(--bg)] border border-[var(--line)] px-4 py-3 mb-6 text-[var(--ink)]">
            Your booking reference:{' '}
            <strong className="text-[var(--forest)]">{success.bookingRef}</strong>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[var(--forest)] text-[var(--paper)] py-3.5 text-[13px] font-medium tracking-[0.04em] transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // ── Booking form ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[var(--paper)] w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--forest)] text-[var(--paper)] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55 mb-1">
              Book this safari
            </p>
            <h2 className="font-serif font-normal text-[22px] leading-tight">
              {safari.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 text-[var(--paper)]/60 hover:text-[var(--paper)] transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Tier selection */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-3">
              Select Package Tier
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {TIERS.map(({ key, label }) => {
                const price = safari.pricing?.[key]?.pricePerPerson
                if (!price) return null
                const active = tier === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTier(key)}
                    className={`p-3 border text-left transition-colors ${
                      active
                        ? 'border-[var(--forest)] bg-[var(--forest)]/5'
                        : 'border-[var(--line)] hover:border-[var(--forest)]/40'
                    }`}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1">
                      {label}
                    </div>
                    <div className="font-serif italic text-[20px] leading-none text-[var(--clay)]">
                      ${price.toLocaleString()}
                    </div>
                    <div className="font-mono text-[9px] text-[var(--muted)] mt-0.5">per person</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Preferred Travel Date *
              </label>
              <input
                type="date"
                value={preferredDate}
                min={tomorrow}
                onChange={(e) => { setPreferredDate(e.target.value); clearError('preferredDate') }}
                className={inputClass('preferredDate')}
              />
              {errors.preferredDate && (
                <p className="text-red-500 text-[11px] mt-1">{errors.preferredDate}</p>
              )}
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Alternate Date (optional)
              </label>
              <input
                type="date"
                value={alternateDate}
                min={tomorrow}
                onChange={(e) => setAlternateDate(e.target.value)}
                className="w-full h-11 px-3 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors"
              />
            </div>
          </div>

          {/* Group size */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-3">
              Group Size
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Adults *', value: adults, min: 1, max: 50, set: setAdults },
                { label: 'Children (under 12)', value: children, min: 0, max: 20, set: setChildren },
              ].map(({ label, value, min, max, set }) => (
                <div key={label}>
                  <label className="block text-[12px] text-[var(--muted)] mb-1.5">{label}</label>
                  <div className="flex items-center h-11 border border-[var(--line)]">
                    <button
                      type="button"
                      onClick={() => set((v) => Math.max(min, v - 1))}
                      className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-[15px] font-medium text-[var(--ink)]">
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => set((v) => Math.min(max, v + 1))}
                      className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost summary */}
          <div className="bg-[var(--forest)] text-[var(--paper)] px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-50 mb-1">
                  Estimated total
                </div>
                <div className="font-serif italic text-[36px] leading-none">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>
              <div className="text-right text-[12px] opacity-65 leading-relaxed">
                ${pricePerPerson.toLocaleString()} ×{' '}
                {groupSize} {groupSize === 1 ? 'person' : 'people'}
                <br />
                <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                  Final price confirmed by team
                </span>
              </div>
            </div>
          </div>

          {/* Personal details */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-4">
              Your Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearError('firstName') }}
                  autoComplete="given-name"
                  className={inputClass('firstName')}
                />
                {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearError('lastName') }}
                  autoComplete="family-name"
                  className={inputClass('lastName')}
                />
                {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                  autoComplete="email"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
                  autoComplete="tel"
                  placeholder="+1 234 567 8900"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                  Nationality *
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => { setNationality(e.target.value); clearError('nationality') }}
                  placeholder="e.g. American, British, Kenyan…"
                  className={inputClass('nationality')}
                />
                {errors.nationality && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.nationality}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
              Special Requests (optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Dietary requirements, accessibility needs, special occasions, preferred lodges…"
              className="w-full px-3 py-2.5 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors resize-none"
            />
          </div>

          {errors.form && (
            <p className="text-red-600 text-[13px] bg-red-50 border border-red-200 px-4 py-3">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={createBooking.isPending}
            className="w-full bg-[var(--forest)] text-[var(--paper)] py-4 text-[14px] font-medium tracking-[0.04em] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBooking.isPending
              ? 'Submitting your request…'
              : `Submit Booking Request — $${totalPrice.toLocaleString()}`}
          </button>

          <p className="text-[11px] text-[var(--muted)] text-center leading-relaxed">
            No payment is required now. Our team will contact you to finalise pricing and arrange your deposit.
          </p>
        </form>
      </div>
    </div>
  )
}
