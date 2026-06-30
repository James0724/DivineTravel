'use client'

import { useQuery } from '@tanstack/react-query'
import type { Destination, DestinationFilters, PaginatedResponse } from '@/types'
import { destinationKeys } from '@/lib/data/queryKeys'

export { destinationKeys }

async function fetchDestinations(
  filters: DestinationFilters = {}
): Promise<PaginatedResponse<Destination>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const res = await fetch(`/api/destinations?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch destinations')
  return res.json()
}

/**
 * All active destinations, for populating pick-lists (e.g. the safari
 * listing's "Destination" filter) — not for paginated browsing, so it
 * requests the full 50-item cap in one shot rather than paging.
 */
export function useDestinations() {
  const filters: DestinationFilters = { limit: 50 }
  return useQuery({
    queryKey: destinationKeys.list(filters),
    queryFn: () => fetchDestinations(filters),
    staleTime: 1000 * 60 * 10, // 10 min — this list changes rarely
  })
}
