'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus, Search, Edit, Trash2, Eye, Star, RefreshCw, Filter, ChevronDown,
  ChevronUp, ChevronsUpDown, X,
} from 'lucide-react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, createColumnHelper, flexRender,
  type SortingState, type ColumnFiltersState, type RowSelectionState,
  type VisibilityState, type FilterFn, type Column, type PaginationState,
} from '@tanstack/react-table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Switch from '@/components/ui/Switch'
import DropdownMenu from '@/components/ui/DropdownMenu'
import { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { cloudinaryThumb } from '@/lib/utils'
import type { Destination, PaginatedResponse } from '@/types'

// ─── Filter options ─────────────────────────────────────────────────────────

const COUNTRIES = [
  { label: 'All countries', value: '' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Tanzania', value: 'Tanzania' },
  { label: 'Uganda', value: 'Uganda' },
  { label: 'Rwanda', value: 'Rwanda' },
]

// ─── Column filter functions ───────────────────────────────────────────────

const countryFilterFn: FilterFn<Destination> = (row, _columnId, value: string) => {
  if (!value) return true
  return row.original.location.country.toLowerCase() === value.toLowerCase()
}

const statusFilterFn: FilterFn<Destination> = (row, columnId, value: 'active' | 'inactive') => {
  if (!value) return true
  return (row.getValue(columnId) as boolean) === (value === 'active')
}

const featuredFilterFn: FilterFn<Destination> = (row, columnId, value: 'yes' | 'no') => {
  if (!value) return true
  return (row.getValue(columnId) as boolean) === (value === 'yes')
}

const globalFilterFn: FilterFn<Destination> = (row, _columnId, value: string) => {
  const search = value.trim().toLowerCase()
  if (!search) return true
  const d = row.original
  return (
    d.name.toLowerCase().includes(search) ||
    d.slug.toLowerCase().includes(search) ||
    d.location.country?.toLowerCase().includes(search) ||
    (d.location.region ?? '').toLowerCase().includes(search)
  )
}

async function fetchAllDestinations(): Promise<Destination[]> {
  const res = await fetch('/api/destinations?active=all&limit=1000')
  if (!res.ok) throw new Error('Failed to fetch destinations')
  const body: PaginatedResponse<Destination> = await res.json()
  return body.data
}

// ─── Small shared bits ──────────────────────────────────────────────────────

function SortableHeader({ column, children }: { column: Column<Destination, unknown>; children: React.ReactNode }) {
  const sorted = column.getIsSorted()
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-wide text-bone-ink/60 hover:text-bone-ink transition-colors"
    >
      {children}
      {sorted === 'asc' ? (
        <ChevronUp size={12} />
      ) : sorted === 'desc' ? (
        <ChevronDown size={12} />
      ) : (
        <ChevronsUpDown size={12} className="opacity-30" />
      )}
    </button>
  )
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

const VISIBLE_COL_COUNT = 5
const columnHelper = createColumnHelper<Destination>()

// Persist table view state (filters, sort, search, pagination) across
// navigation to the edit/view page so "back" lands exactly where the
// admin left off instead of resetting to an empty table.
const VIEW_STATE_KEY = 'admin-destinations-view-state'

interface StoredViewState {
  globalFilter: string
  sorting: SortingState
  columnFilters: ColumnFiltersState
  pagination: PaginationState
}

function loadViewState(): StoredViewState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(VIEW_STATE_KEY)
    return raw ? (JSON.parse(raw) as StoredViewState) : null
  } catch {
    return null
  }
}

export default function AdminDestinationsPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const initialView = useRef(loadViewState()).current

  const [globalFilter, setGlobalFilter] = useState(initialView?.globalFilter ?? '')
  const [sorting, setSorting] = useState<SortingState>(initialView?.sorting ?? [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialView?.columnFilters ?? [])
  const [pagination, setPagination] = useState<PaginationState>(
    initialView?.pagination ?? { pageIndex: 0, pageSize: 15 }
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility] = useState<VisibilityState>({ featured: false })
  const [filterOpen, setFilterOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
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

  useEffect(() => {
    const state: StoredViewState = { globalFilter, sorting, columnFilters, pagination }
    sessionStorage.setItem(VIEW_STATE_KEY, JSON.stringify(state))
  }, [globalFilter, sorting, columnFilters, pagination])

  const { data: destinations, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-destinations-all'],
    queryFn: fetchAllDestinations,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-destinations-all'] })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error || `Delete failed (${res.status})`)
      return body as { message?: string }
    },
    onSuccess: (body) => {
      invalidate()
      toast.success(body?.message || 'Destination deleted')
      setDeleteTarget(null)
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete destination'),
  })

  const bulkMutation = useMutation({
    mutationFn: async ({ ids, action }: { ids: string[]; action: 'publish' | 'unpublish' | 'delete' }) => {
      if (action === 'delete') {
        await Promise.all(ids.map((id) => fetch(`/api/destinations/${id}`, { method: 'DELETE' })))
      } else {
        await Promise.all(
          ids.map((id) =>
            fetch(`/api/destinations/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ active: action === 'publish' }),
            })
          )
        )
      }
      return { ids, action }
    },
    onSuccess: ({ ids, action }) => {
      invalidate()
      setRowSelection({})
      setBulkDeleteOpen(false)
      const verb = action === 'publish' ? 'Published' : action === 'unpublish' ? 'Unpublished' : 'Deleted'
      toast.success(`${verb} ${ids.length} destination${ids.length === 1 ? '' : 's'}`)
    },
    onError: () => toast.error('Bulk action failed — please try again'),
  })

  const toggleFeatured = async (id: string, current: boolean) => {
    const res = await fetch(`/api/destinations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    })
    if (res.ok) {
      invalidate()
      toast.success(`Destination ${current ? 'unfeatured' : 'featured'}`)
    } else {
      const body = await res.json().catch(() => null)
      toast.error(body?.error || 'Failed to update featured status')
    }
  }

  // Quick publish/unpublish — sends only `active` so it can never be blocked
  // by validation errors on unrelated fields the way a full form save can.
  const toggleActive = async (id: string, current: boolean) => {
    const res = await fetch(`/api/destinations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    })
    if (res.ok) {
      invalidate()
      toast.success(`Destination ${current ? 'unpublished' : 'published'}`)
    } else {
      const body = await res.json().catch(() => null)
      toast.error(body?.error || 'Failed to update published status')
    }
  }

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          ref={(el) => {
            if (el) el.indeterminate = table.getIsSomeRowsSelected()
          }}
          onChange={table.getToggleAllRowsSelectedHandler()}
          aria-label="Select all rows"
          className="h-4 w-4 rounded border-[rgba(23,22,18,0.3)] text-bone-forest focus:ring-bone-clay"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={`Select ${row.original.name}`}
          className="h-4 w-4 rounded border-[rgba(23,22,18,0.3)] text-bone-forest focus:ring-bone-clay"
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      id: 'destination',
      header: ({ column }) => <SortableHeader column={column}>Destination</SortableHeader>,
      cell: ({ row }) => {
        const destination = row.original
        return (
          <div className="flex items-center gap-3">
            {destination.coverImage && (
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <Image src={cloudinaryThumb(destination.coverImage, 80)} alt={destination.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <p className="font-sans font-medium text-bone-ink text-sm whitespace-nowrap">{destination.name}</p>
          </div>
        )
      },
    }),
    columnHelper.accessor((row) => [row.location.region, row.location.country].filter(Boolean).join(', '), {
      id: 'location',
      header: ({ column }) => <SortableHeader column={column}>Location</SortableHeader>,
      filterFn: countryFilterFn,
      cell: ({ getValue }) => <span className="text-bone-ink/60 whitespace-nowrap">{getValue()}</span>,
    }),
    columnHelper.accessor('active', {
      id: 'active',
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      filterFn: statusFilterFn,
      cell: ({ row }) => (
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant={row.original.active ? 'success' : 'danger'} dot>
            {row.original.active ? 'Published' : 'Unpublished'}
          </Badge>
          {row.original.featured && <Badge variant="clay">Featured</Badge>}
        </div>
      ),
    }),
    columnHelper.accessor('featured', {
      id: 'featured',
      header: 'Featured',
      filterFn: featuredFilterFn,
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const destination = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Switch
              checked={destination.active}
              onChange={() => toggleActive(destination._id, destination.active)}
              label={destination.active ? 'Unpublish destination' : 'Publish destination'}
              size="sm"
            />
            <DropdownMenu
              items={[
                {
                  label: destination.featured ? 'Unfeature' : 'Feature',
                  icon: <Star size={14} className={destination.featured ? 'fill-bone-clay text-bone-clay' : ''} />,
                  onClick: () => toggleFeatured(destination._id, destination.featured),
                },
                {
                  label: 'View live',
                  icon: <Eye size={14} />,
                  onClick: () =>
                    window.open(
                      `/destinations/${destination.location.country.toLowerCase()}/${destination.slug}`,
                      '_blank',
                      'noopener,noreferrer'
                    ),
                },
                {
                  label: 'Edit',
                  icon: <Edit size={14} />,
                  onClick: () => router.push(`/admin/destinations/${destination._id}`),
                },
                {
                  label: 'Delete',
                  icon: <Trash2 size={14} />,
                  onClick: () => setDeleteTarget(destination._id),
                  variant: 'danger',
                },
              ]}
            />
          </div>
        )
      },
      enableSorting: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleFeatured/toggleActive take their args as params and don't capture render-specific state
  ], [router])

  const table = useReactTable({
    data: destinations ?? [],
    columns,
    state: { sorting, columnFilters, rowSelection, columnVisibility, globalFilter, pagination },
    getRowId: (row) => row._id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const activeFilterValue = table.getColumn('active')?.getFilterValue() as string | undefined
  const featuredFilterValue = table.getColumn('featured')?.getFilterValue() as string | undefined
  const activeFilterCount = columnFilters.length
  const selectedRows = table.getSelectedRowModel().rows
  const selectedIds = selectedRows.map((r) => r.original._id)
  const filteredRows = table.getFilteredRowModel().rows
  const pageRows = table.getRowModel().rows
  const sort = sorting[0]
  const sortLabel = sort ? (table.getColumn(sort.id)?.columnDef.id === 'destination' ? 'Destination' : sort.id) : null

  const clearFilters = () => setColumnFilters([])

  const toggleFilterValue = (columnId: 'active' | 'featured', value: string) => {
    const col = table.getColumn(columnId)
    col?.setFilterValue((prev: unknown) => (prev === value ? undefined : value))
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">Destinations</h1>
          <p className="text-sm text-bone-ink/50 font-sans mt-1 flex items-center gap-2">
            {destinations?.length ?? 0} parks, reserves & towns
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
          <Link href="/admin/destinations/new">
            <Button variant="primary" leftIcon={<Plus size={16} />}>
              Add Destination
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
            placeholder="Search destinations…"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
              table.setPageIndex(0)
            }}
            className="w-full h-10 pl-9 pr-3 font-sans text-sm bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`h-10 px-3.5 flex items-center gap-2 font-sans text-sm rounded border transition-colors ${
              activeFilterCount > 0
                ? 'border-bone-forest text-bone-forest bg-bone-forest/5'
                : 'border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink hover:border-bone-ink/40'
            }`}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] bg-bone-clay text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute z-20 top-full mt-1.5 right-0 w-[280px] max-h-[70vh] overflow-y-auto bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(23,22,18,0.1)]">
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-bone-ink/60">
                  Filter destinations
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 font-sans text-xs text-bone-clay hover:opacity-70 transition-opacity"
                  >
                    <X size={11} /> Clear all
                  </button>
                )}
              </div>

              <FilterSection label="Status">
                {(['', 'active', 'inactive'] as const).map((v) => (
                  <FilterPill
                    key={v || 'all'}
                    active={(activeFilterValue ?? '') === v}
                    onClick={() => toggleFilterValue('active', v)}
                  >
                    {v === '' ? 'All' : v === 'active' ? 'Published' : 'Unpublished'}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Featured">
                {(['', 'yes', 'no'] as const).map((v) => (
                  <FilterPill
                    key={v || 'all'}
                    active={(featuredFilterValue ?? '') === v}
                    onClick={() => toggleFilterValue('featured', v)}
                  >
                    {v === '' ? 'All' : v === 'yes' ? 'Featured' : 'Not featured'}
                  </FilterPill>
                ))}
              </FilterSection>

              <FilterSection label="Country" last>
                {COUNTRIES.map((c) => (
                  <FilterPill
                    key={c.value || 'all'}
                    active={(table.getColumn('location')?.getFilterValue() as string | undefined ?? '') === c.value}
                    onClick={() => table.getColumn('location')?.setFilterValue(c.value || undefined)}
                  >
                    {c.label}
                  </FilterPill>
                ))}
              </FilterSection>
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-sans text-xs text-bone-ink/45 hover:text-bone-clay transition-colors"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Summary line / bulk actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-bone-ink/50">
        <div className="flex flex-wrap items-center gap-4">
          <span>{filteredRows.length} of {destinations?.length ?? 0} destinations</span>
          {sortLabel && (
            <span>Sorted by {sortLabel} {sort?.desc ? '↓' : '↑'}</span>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-bone-forest font-medium">{selectedIds.length} selected</span>
            <button
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'publish' })}
              disabled={bulkMutation.isPending}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/70 hover:text-bone-forest hover:border-bone-forest transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'unpublish' })}
              disabled={bulkMutation.isPending}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/70 hover:text-bone-ink hover:border-bone-ink/40 transition-colors disabled:opacity-50"
            >
              Unpublish
            </button>
            <button
              onClick={() => setBulkDeleteOpen(true)}
              disabled={bulkMutation.isPending}
              className="h-8 px-3 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
            <button
              onClick={() => setRowSelection({})}
              className="h-8 px-2 text-bone-ink/40 hover:text-bone-ink transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Table — natural column widths, horizontal scroll on narrow screens
          instead of truncating content */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-x-auto">
        <table className="admin-table w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={header.column.id === 'actions' ? 'text-right whitespace-nowrap' : 'whitespace-nowrap'}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={VISIBLE_COL_COUNT} />
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={VISIBLE_COL_COUNT} className="text-center py-12 text-bone-ink/40 font-sans">
                  No destinations found
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRows.length > 0 && (
        <div className="flex items-center justify-between text-sm font-sans">
          <span className="text-bone-ink/45">
            Showing {pagination.pageIndex * pagination.pageSize + 1}–{Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredRows.length)} of {filteredRows.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-bone-ink/45">
              Page {pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
            </span>
            <div className="flex gap-2">
              <button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Destination"
        description="This will permanently delete the destination and all associated images from Cloudinary. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => bulkMutation.mutate({ ids: selectedIds, action: 'delete' })}
        loading={bulkMutation.isPending}
        title={`Delete ${selectedIds.length} Destination${selectedIds.length === 1 ? '' : 's'}`}
        description="This will permanently delete the selected destinations and all associated images from Cloudinary. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
