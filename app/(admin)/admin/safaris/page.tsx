'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Eye, Star, RefreshCw, Filter, ChevronDown, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { COUNTRIES, CATEGORIES, SAFARI_TYPES, DIFFICULTIES } from '@/components/safaris/SafariFilterPanel'
import { DURATIONS } from '@/lib/data/safariFilterOptions'
import { formatPrice, formatDuration, getLowestPrice } from '@/lib/utils'
import type { Safari, SafariCategory, SafariStyle, SafariDifficulty, PaginatedResponse } from '@/types'

interface AdminSafariFilters {
  status: '' | 'active' | 'inactive'
  featured: '' | 'yes' | 'no'
  country: string
  category: SafariCategory | ''
  safariType: SafariStyle | ''
  difficulty: SafariDifficulty | ''
  duration: string
}

const EMPTY_FILTERS: AdminSafariFilters = {
  status: '',
  featured: '',
  country: '',
  category: '',
  safariType: '',
  difficulty: '',
  duration: '',
}

const STATUS_OPTIONS: { label: string; value: AdminSafariFilters['status'] }[] = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const FEATURED_OPTIONS: { label: string; value: AdminSafariFilters['featured'] }[] = [
  { label: 'All', value: '' },
  { label: 'Featured', value: 'yes' },
  { label: 'Not featured', value: 'no' },
]

function countActive(f: AdminSafariFilters) {
  return Object.values(f).filter(Boolean).length
}

async function fetchAdminSafaris(params: URLSearchParams): Promise<PaginatedResponse<Safari>> {
  const res = await fetch(`/api/safaris?${params}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function FilterSection({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 ${last ? '' : 'border-b border-[rgba(23,22,18,0.08)]'}`}>
      <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-bone-ink/40 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full border font-sans text-xs whitespace-nowrap transition-colors ${
        active
          ? 'border-bone-forest bg-bone-forest text-white'
          : 'border-[rgba(23,22,18,0.18)] text-bone-ink/65 hover:border-bone-ink/40 hover:text-bone-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function AdminSafarisPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<AdminSafariFilters>(EMPTY_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const qc = useQueryClient()
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [filterOpen])

  const dur = DURATIONS.find((d) => d.value === filters.duration)
  const activeCount = countActive(filters)

  const updateFilter = <K extends keyof AdminSafariFilters>(key: K, value: AdminSafariFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }))
    setPage(1)
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: '15',
    // No status filter selected -> show both active and inactive (the
    // admin table's default view, unlike the public site which is active-only).
    active: filters.status === 'active' ? 'true' : filters.status === 'inactive' ? 'false' : 'all',
    ...(search && { search }),
    ...(filters.featured === 'yes' && { featured: 'true' }),
    ...(filters.featured === 'no' && { featured: 'false' }),
    ...(filters.country && { country: filters.country }),
    ...(filters.category && { category: filters.category }),
    ...(filters.safariType && { safariType: filters.safariType }),
    ...(filters.difficulty && { difficulty: filters.difficulty }),
    ...(dur?.min !== undefined && { minDays: String(dur.min) }),
    ...(dur?.max !== undefined && { maxDays: String(dur.max) }),
  })

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-safaris', page, search, filters],
    queryFn: () => fetchAdminSafaris(params),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/safaris/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-safaris'] })
      toast.success('Safari deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete safari'),
  })

  const toggleFeatured = async (id: string, current: boolean) => {
    const res = await fetch(`/api/safaris/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    })
    if (res.ok) {
      qc.invalidateQueries({ queryKey: ['admin-safaris'] })
      toast.success(`Safari ${current ? 'unfeatured' : 'featured'}`)
    }
  }

  const safaris = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">Safaris</h1>
          <p className="text-sm text-bone-ink/50 font-sans mt-1 flex items-center gap-2">
            {pagination?.total ?? 0} total safaris
            {isFetching && <span className="text-bone-ink/30">· refreshing…</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh list"
            className="h-9 w-9 flex items-center justify-center rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/50 hover:text-bone-ink hover:border-bone-ink/40 disabled:opacity-40 transition-colors"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
          <Link href="/admin/safaris/new">
            <Button variant="primary" leftIcon={<Plus size={16} />}>
              Add Safari
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35" />
          <input
            type="search"
            placeholder="Search safaris…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full h-10 pl-9 pr-3 font-sans text-sm bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`h-10 px-3.5 flex items-center gap-2 font-sans text-sm rounded border transition-colors ${
              activeCount > 0
                ? 'border-bone-forest text-bone-forest bg-bone-forest/5'
                : 'border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40'
            }`}
          >
            <Filter size={14} />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] bg-bone-clay text-white">
                {activeCount}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute z-20 top-full mt-1.5 left-0 w-[320px] max-h-[70vh] overflow-y-auto bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(23,22,18,0.1)]">
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-bone-ink/60">
                  Filter safaris
                </span>
                {activeCount > 0 && (
                  <button
                    onClick={() => { setFilters(EMPTY_FILTERS); setPage(1) }}
                    className="flex items-center gap-1 font-sans text-xs text-bone-clay hover:opacity-70 transition-opacity"
                  >
                    <X size={11} /> Clear all
                  </button>
                )}
              </div>

              <FilterSection label="Status">
                {STATUS_OPTIONS.map((s) => (
                  <FilterPill
                    key={s.value || 'all'}
                    active={filters.status === s.value}
                    onClick={() => updateFilter('status', s.value)}
                  >
                    {s.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Featured">
                {FEATURED_OPTIONS.map((f) => (
                  <FilterPill
                    key={f.value || 'all'}
                    active={filters.featured === f.value}
                    onClick={() => updateFilter('featured', f.value)}
                  >
                    {f.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Country">
                {COUNTRIES.map((c) => (
                  <FilterPill
                    key={c.value || 'all'}
                    active={filters.country === c.value}
                    onClick={() => updateFilter('country', c.value)}
                  >
                    {c.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Category">
                {CATEGORIES.map((c) => (
                  <FilterPill
                    key={c.value || 'all'}
                    active={filters.category === c.value}
                    onClick={() => updateFilter('category', c.value as SafariCategory | '')}
                  >
                    {c.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Style">
                {SAFARI_TYPES.map((t) => (
                  <FilterPill
                    key={t.value || 'all'}
                    active={filters.safariType === t.value}
                    onClick={() => updateFilter('safariType', t.value as SafariStyle | '')}
                  >
                    {t.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Difficulty">
                {DIFFICULTIES.map((d) => (
                  <FilterPill
                    key={d.value || 'all'}
                    active={filters.difficulty === d.value}
                    onClick={() => updateFilter('difficulty', d.value as SafariDifficulty | '')}
                  >
                    {d.label}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Duration" last>
                {DURATIONS.map((d) => (
                  <FilterPill
                    key={d.value || 'all'}
                    active={filters.duration === d.value}
                    onClick={() => updateFilter('duration', d.value)}
                  >
                    {d.label}
                  </FilterPill>
                ))}
              </FilterSection>
            </div>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={() => { setFilters(EMPTY_FILTERS); setPage(1) }}
            className="flex items-center gap-1 font-sans text-xs text-bone-ink/45 hover:text-bone-clay transition-colors"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden overflow-x-auto">
        <table className="admin-table min-w-[820px]">
          <thead>
            <tr>
              <th>Safari</th>
              <th>Location</th>
              <th>Type</th>
              <th>Duration</th>
              <th>From</th>
              <th>Status</th>
              <th>Rating</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={8} />
            ) : safaris.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-bone-ink/40 font-sans">
                  No safaris found
                </td>
              </tr>
            ) : (
              safaris.map((safari) => (
                <tr key={safari._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {safari.coverImage && (
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={safari.coverImage}
                            alt={safari.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-sans font-medium text-bone-ink text-sm">{safari.name}</p>
                        <p className="text-xs text-bone-ink/40 font-mono">{safari.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-bone-ink/60">
                    {safari.location.park}, {safari.location.country}
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap max-w-[140px]">
                      {safari.category.length === 0 ? (
                        <span className="text-bone-ink/30 text-sm">—</span>
                      ) : (
                        safari.category.map((cat) => (
                          <Badge key={cat} variant="neutral">
                            {CATEGORIES.find((c) => c.value === cat)?.label ?? cat}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td>{formatDuration(safari.duration)}</td>
                  <td className="font-medium">{formatPrice(getLowestPrice(safari.pricing))}</td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge variant={safari.active ? 'success' : 'danger'} dot>
                        {safari.active ? 'Active' : 'Inactive'}
                      </Badge>
                      {safari.featured && <Badge variant="clay">Featured</Badge>}
                    </div>
                  </td>
                  <td>
                    {safari.rating > 0 ? (
                      <span className="text-sm font-sans font-medium flex items-center gap-1">
                        <Star size={12} className="fill-bone-clay text-bone-clay" />
                        {safari.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-bone-ink/30 text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleFeatured(safari._id, safari.featured)}
                        title={safari.featured ? 'Unfeature' : 'Feature'}
                        className={`p-1.5 rounded transition-colors ${safari.featured ? 'text-bone-clay hover:bg-bone-clay/10' : 'text-bone-ink/30 hover:text-bone-clay hover:bg-bone-clay/10'}`}
                      >
                        <Star size={14} className={safari.featured ? 'fill-bone-clay' : ''} />
                      </button>
                      <a
                        href={`/safaris/${safari.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors"
                      >
                        <Eye size={14} />
                      </a>
                      <Link
                        href={`/admin/safaris/${safari._id}`}
                        className="p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(safari._id)}
                        className="p-1.5 rounded text-bone-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm font-sans">
          <span className="text-bone-ink/45">
            Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, pagination.total)} of {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Safari"
        description="This will permanently delete the safari and all associated images from Cloudinary. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
