'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Booking, BookingFormData, ApiResponse, PaginatedResponse } from '@/types'

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (params?: Record<string, string>) =>
    [...bookingKeys.lists(), params] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: BookingFormData & { safariId: string }) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to submit booking')
      }
      return res.json() as Promise<ApiResponse<{ bookingRef: string; id: string }>>
    },
  })
}

// ─── Admin hooks ──────────────────────────────────────────────────────────────

export function useAdminBookings(params?: Record<string, string>) {
  const search = new URLSearchParams(params).toString()
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: async () => {
      const res = await fetch(`/api/bookings?${search}`)
      if (!res.ok) throw new Error('Failed to fetch bookings')
      return res.json() as Promise<PaginatedResponse<Booking>>
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminPendingBookingsCount() {
  return useQuery({
    queryKey: ['admin-pending-bookings-count'],
    queryFn: async () => {
      const res = await fetch('/api/bookings?status=pending&limit=1')
      if (!res.ok) return 0
      const data = await res.json()
      return (data.pagination?.total as number) ?? 0
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  })
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      paymentStatus,
      internalNotes,
    }: {
      id: string
      status?: string
      paymentStatus?: string
      internalNotes?: string
    }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, internalNotes }),
      })
      if (!res.ok) throw new Error('Failed to update booking')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}
