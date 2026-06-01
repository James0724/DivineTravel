'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { Select } from '@/components/ui/Input'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { NoBookingsFound } from '@/components/ui/EmptyState'
import { useAdminBookings, useUpdateBookingStatus } from '@/hooks/useBooking'
import { formatPrice, formatDate, getPriceTierLabel } from '@/lib/utils'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-bone-forest/10 text-bone-forest',
}

const paymentColors: Record<string, string> = {
  unpaid: 'text-red-600',
  partial: 'text-amber-600',
  paid: 'text-green-700',
  refunded: 'text-stone-500',
}

export default function AdminBookingsPage() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const params = {
    page: String(page),
    limit: '20',
    ...(status && { status }),
    ...(search && { search }),
  }

  const { data, isLoading } = useAdminBookings(params)
  const updateStatus = useUpdateBookingStatus()

  const bookings = data?.data ?? []
  const pagination = data?.pagination

  const handleStatusChange = async (
    id: string,
    field: 'status' | 'paymentStatus',
    value: string
  ) => {
    try {
      await updateStatus.mutateAsync({ id, [field]: value })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-bone-ink">Bookings</h1>
        <p className="text-sm text-bone-ink/50 font-sans mt-1">
          {pagination?.total ?? 0} total bookings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35" />
          <input
            type="search"
            placeholder="Search by name, email, ref…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full h-10 pl-9 pr-3 font-sans text-sm bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
          />
        </div>
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="sm:w-44"
        />
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden overflow-x-auto">
        {isLoading ? (
          <table className="admin-table min-w-[900px]">
            <thead><tr><th>Ref</th><th>Guest</th><th>Safari</th><th>Date</th><th>Tier</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody><TableSkeleton rows={8} cols={8} /></tbody>
          </table>
        ) : bookings.length === 0 ? (
          <div className="py-8">
            <NoBookingsFound />
          </div>
        ) : (
          <table className="admin-table min-w-[900px]">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Guest</th>
                <th>Safari</th>
                <th>Travel Date</th>
                <th>Tier</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-bone-bg/40 cursor-pointer">
                  <td className="font-mono text-xs">
                    <Link href={`/admin/bookings/${b._id}`} className="hover:text-bone-clay transition-colors">
                      {b.bookingRef}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/admin/bookings/${b._id}`} className="block">
                      <p className="text-sm font-medium text-bone-ink">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-bone-ink/45">{b.email}</p>
                    </Link>
                  </td>
                  <td className="text-bone-ink/65 text-sm">
                    {typeof b.safari === 'object' && b.safari !== null
                      ? (b.safari as { name?: string }).name
                      : '—'}
                  </td>
                  <td className="text-sm">{formatDate(b.preferredDate, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <span className="text-xs font-sans font-medium capitalize">
                      {getPriceTierLabel(b.tier)}
                    </span>
                  </td>
                  <td className="font-medium text-sm">{formatPrice(b.totalPrice, b.currency)}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, 'status', e.target.value)}
                      className={`text-xs font-sans font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[b.status] ?? 'bg-stone-100 text-stone-600'}`}
                    >
                      {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => handleStatusChange(b._id, 'paymentStatus', e.target.value)}
                      className={`text-xs font-sans font-medium bg-transparent border-0 cursor-pointer ${paymentColors[b.paymentStatus] ?? 'text-bone-ink/60'}`}
                    >
                      {['unpaid', 'partial', 'paid', 'refunded'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm font-sans">
          <span className="text-bone-ink/45">
            Page {page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed">
              Prev
            </button>
            <button disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
