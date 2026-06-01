import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Safari, SafariFilters, PriceTier } from '@/types'

interface SafariState {
  // Data
  safaris: Safari[]
  featuredSafaris: Safari[]
  selectedSafari: Safari | null
  // Filters
  filters: SafariFilters
  // UI
  isLoading: boolean
  error: string | null
  // Booking flow
  selectedTier: PriceTier | null
  // Actions
  setSafaris: (safaris: Safari[]) => void
  setFeaturedSafaris: (safaris: Safari[]) => void
  setSelectedSafari: (safari: Safari | null) => void
  setFilters: (filters: Partial<SafariFilters>) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedTier: (tier: PriceTier | null) => void
}

const defaultFilters: SafariFilters = {
  search: '',
  page: 1,
  limit: 12,
  sort: 'rating',
}

export const useSafariStore = create<SafariState>()(
  devtools(
    persist(
      (set) => ({
        safaris: [],
        featuredSafaris: [],
        selectedSafari: null,
        filters: defaultFilters,
        isLoading: false,
        error: null,
        selectedTier: null,

        setSafaris: (safaris) => set({ safaris }),
        setFeaturedSafaris: (safaris) => set({ featuredSafaris: safaris }),
        setSelectedSafari: (safari) => set({ selectedSafari: safari }),
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters, page: 1 },
          })),
        resetFilters: () => set({ filters: defaultFilters }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setSelectedTier: (selectedTier) => set({ selectedTier }),
      }),
      {
        name: 'acacia-safari-store',
        partialize: (state) => ({
          selectedTier: state.selectedTier,
          filters: state.filters,
        }),
      }
    ),
    { name: 'SafariStore' }
  )
)
