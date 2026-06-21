'use client'

import { useQuery } from '@tanstack/react-query'
import type { JournalPost, PaginatedResponse } from '@/types'
import { postKeys, type PostFilters } from '@/lib/data/queryKeys'

// Re-exported so existing client imports from this hook file keep working.
// Server components must import from `@/lib/data/queryKeys` directly — see
// that file for why.
export { postKeys }
export type { PostFilters }

async function fetchPosts(filters: PostFilters = {}): Promise<PaginatedResponse<JournalPost>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const res = await fetch(`/api/posts?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}
