'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeft, User, MapPin, Calendar, CreditCard,
  Phone, Mail, Flag, FileText, Edit3, Save,
} from 'lucide-react'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate, formatPrice, getPriceTierLabel } from '@/lib/utils'
import type { Booking } from '@/types'

/* ── helpers ── */

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'] as const
const PAYMENT_OPTIONS = ['unpaid', 'partial', 'paid', 'refunded'] as const

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-bone-forest/10 text-bone-forest',
}

const PAYMENT_COLORS: Record<string, string> = {
  unpaid: 'text-red-600',
  partial: 'text-amber-600',
  paid: 'text-green-700',
  refunded: 'text-stone-500',
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-mono uppercase tracking-wider text-bone-ink/40">{label}</span>
      <span className="text-sm font-sans text-bone-ink/80">{value ?? '—'}</span>
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[rgba(23,22,18,0.07)]">
        <Icon size={15} className="text-bone-ink/40" />
        <span className="text-sm font-semibold font-sans text-bone-ink">{title}</span>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

/* ── Component ── */

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<string>('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setBooking(data)
          setNotes(data.internalNotes ?? '')
          setStatus(data.status)
          setPaymentStatus(data.paymentStatus)
        }
      })
      .catch(() => toast.error('Failed to load booking'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, internalNotes: notes }),
      })
      if (!res.ok) throw new Error()
      toast.success('Booking updated')
      setEditingNotes(false)
      const updated = await res.json()
      setBooking(updated.data)
    } catch {
      toast.error('Failed to update booking')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-5 max-w-3xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md animate-pulse" />
        ))}
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-bone-ink/50 font-sans text-sm">Booking not found.</p>
        <Link href="/admin/bookings" className="text-sm font-sans text-bone-clay hover:underline mt-2 inline-block">
          ← Back to Bookings
        </Link>
      </div>
    )
  }

  const safariName =
    typeof booking.safari === 'object' && booking.safari !== null
      ? (booking.safari as { name?: string }).name ?? '—'
      : '—'

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl">
      {/* Back */}
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-sm font-sans text-bone-ink/50 hover:text-bone-ink transition-colors"
      >
        <ArrowLeft size={14} /> Back to Bookings
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl font-semibold text-bone-ink">
              {booking.firstName} {booking.lastName}
            </h1>
            <span className={`text-xs font-sans font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status] ?? 'bg-stone-100 text-stone-600'}`}>
              {booking.status}
            </span>
          </div>
          <p className="text-sm font-mono text-bone-ink/40 mt-1">{booking.bookingRef}</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Save size={14} />}
          loading={saving}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      {/* Status controls */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md px-5 py-4">
        <p className="text-xs font-mono uppercase tracking-wider text-bone-ink/40 mb-3">Booking Controls</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-bone-ink/60">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 px-3 font-sans text-sm text-bone-ink bg-bone-bg border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-bone-ink/60">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="h-9 px-3 font-sans text-sm text-bone-ink bg-bone-bg border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
            >
              {PAYMENT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Guest Details ── */}
      <Section icon={User} title="Guest Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
          <InfoRow label="First Name" value={booking.firstName} />
          <InfoRow label="Last Name" value={booking.lastName} />
          <InfoRow label="Nationality" value={booking.nationality} />
          <InfoRow label="Email" value={
            <a href={`mailto:${booking.email}`} className="text-bone-clay hover:underline">
              {booking.email}
            </a>
          } />
          <InfoRow label="Phone" value={booking.phone} />
          {booking.passportNumber && <InfoRow label="Passport" value={booking.passportNumber} />}
        </div>
        {booking.emergencyContact && (
          <div className="mt-4 pt-4 border-t border-[rgba(23,22,18,0.07)]">
            <p className="text-xs font-mono uppercase tracking-wider text-bone-ink/40 mb-2">Emergency Contact</p>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Name" value={booking.emergencyContact.name} />
              <InfoRow label="Phone" value={booking.emergencyContact.phone} />
            </div>
          </div>
        )}
      </Section>

      {/* ── Trip Details ── */}
      <Section icon={MapPin} title="Trip Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
          <InfoRow label="Safari" value={safariName} />
          <InfoRow label="Package Tier" value={getPriceTierLabel(booking.tier)} />
          <InfoRow label="Group Size" value={`${booking.groupSize} pax`} />
          <InfoRow label="Adults" value={booking.adultCount} />
          <InfoRow label="Children" value={booking.childCount ?? 0} />
          <InfoRow label="Preferred Date" value={formatDate(booking.preferredDate, { month: 'long', day: 'numeric', year: 'numeric' })} />
          {booking.alternateDate && (
            <InfoRow label="Alternate Date" value={formatDate(booking.alternateDate, { month: 'long', day: 'numeric', year: 'numeric' })} />
          )}
          {booking.referralSource && <InfoRow label="Referral" value={booking.referralSource} />}
        </div>
      </Section>

      {/* ── Pricing ── */}
      <Section icon={CreditCard} title="Pricing">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
          <InfoRow label="Price per Person" value={formatPrice(booking.pricePerPerson, booking.currency)} />
          <InfoRow label="Group Size" value={`× ${booking.groupSize}`} />
          <InfoRow
            label="Total Price"
            value={
              <span className="text-base font-serif font-semibold text-bone-ink">
                {formatPrice(booking.totalPrice, booking.currency)}
              </span>
            }
          />
          <InfoRow
            label="Payment Status"
            value={
              <span className={`font-medium ${PAYMENT_COLORS[booking.paymentStatus] ?? 'text-bone-ink/60'}`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            }
          />
          <InfoRow label="Currency" value={booking.currency} />
        </div>
      </Section>

      {/* ── Special Requests ── */}
      {booking.specialRequests && (
        <Section icon={FileText} title="Special Requests">
          <p className="text-sm font-sans text-bone-ink/70 leading-relaxed whitespace-pre-wrap">
            {booking.specialRequests}
          </p>
        </Section>
      )}

      {/* ── Internal Notes ── */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(23,22,18,0.07)]">
          <div className="flex items-center gap-2.5">
            <Edit3 size={15} className="text-bone-ink/40" />
            <span className="text-sm font-semibold font-sans text-bone-ink">Internal Notes</span>
          </div>
          <button
            type="button"
            onClick={() => setEditingNotes((v) => !v)}
            className="text-xs font-sans text-bone-ink/40 hover:text-bone-clay transition-colors"
          >
            {editingNotes ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="px-5 py-5">
          {editingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add private notes about this booking (not visible to guest)…"
            />
          ) : (
            <p className="text-sm font-sans text-bone-ink/65 leading-relaxed whitespace-pre-wrap min-h-[40px]">
              {notes || <span className="text-bone-ink/30 italic">No internal notes.</span>}
            </p>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex flex-wrap gap-6 text-xs font-mono text-bone-ink/35">
        <span>Created: {formatDate(booking.createdAt, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        <span>Updated: {formatDate(booking.updatedAt, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  )
}
