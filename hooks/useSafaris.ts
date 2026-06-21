'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Safari, SafariFilters, PaginatedResponse, ApiResponse } from '@/types'
import { safariKeys } from '@/lib/data/queryKeys'

// Re-exported so existing client imports of `safariKeys` from this hook
// file keep working. Server components must import it from
// `@/lib/data/queryKeys` directly — see that file for why.
export { safariKeys }

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchSafaris(
  filters: SafariFilters = {}
): Promise<PaginatedResponse<Safari>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const res = await fetch(`/api/safaris?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch safaris')
  return res.json()
}

async function fetchSafariBySlug(slug: string): Promise<ApiResponse<Safari>> {
  const res = await fetch(`/api/safaris/${slug}`)
  if (!res.ok) throw new Error('Safari not found')
  return res.json()
}

async function fetchFeaturedSafaris(): Promise<ApiResponse<Safari[]>> {
  const res = await fetch('/api/safaris?featured=true&limit=6&balanced=true')
  if (!res.ok) throw new Error('Failed to fetch featured safaris')
  return res.json()
}

async function fetchSignaturePackages(): Promise<ApiResponse<Safari[]>> {
  const res = await fetch('/api/safaris/signature?limit=6&featuredCount=2')
  if (!res.ok) throw new Error('Failed to fetch signature packages')
  return res.json()
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useSafaris(filters: SafariFilters = {}) {
  return useQuery({
    queryKey: safariKeys.list(filters),
    queryFn: () => fetchSafaris(filters),
    staleTime: 1000 * 60 * 5, // 5 min
    placeholderData: (prev) => prev,
  })
}

export function useSafari(slug: string) {
  return useQuery({
    queryKey: safariKeys.detail(slug),
    queryFn: () => fetchSafariBySlug(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
  })
}

export function useFeaturedSafaris() {
  return useQuery({
    queryKey: safariKeys.featured(),
    queryFn: fetchFeaturedSafaris,
    staleTime: 1000 * 60 * 10,
  })
}

export function useSignaturePackages() {
  return useQuery({
    queryKey: safariKeys.signature(),
    queryFn: fetchSignaturePackages,
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Admin mutations ──────────────────────────────────────────────────────────

export function useCreateSafari() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Safari>) => {
      const res = await fetch('/api/safaris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to create safari')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: safariKeys.all })
    },
  })
}

export function useUpdateSafari(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Safari>) => {
      const res = await fetch(`/api/safaris/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to update safari')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: safariKeys.all })
    },
  })
}

export function useDeleteSafari() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/safaris/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete safari')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: safariKeys.all })
    },
  })
}
