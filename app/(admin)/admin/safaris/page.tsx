'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Eye, Star, RefreshCw } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { formatPrice, formatDuration, getLowestPrice } from '@/lib/utils'
import type { Safari, PaginatedResponse } from '@/types'

async function fetchAdminSafaris(params: URLSearchParams): Promise<PaginatedResponse<Safari>> {
  const res = await fetch(`/api/safaris?${params}&active=all`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function AdminSafarisPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const qc = useQueryClient()

  const params = new URLSearchParams({
    page: String(page),
    limit: '15',
    ...(search && { search }),
  })

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-safaris', page, search],
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35" />
        <input
          type="search"
          placeholder="Search safaris…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full h-10 pl-9 pr-3 font-sans text-sm bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden overflow-x-auto">
        <table className="admin-table min-w-[700px]">
          <thead>
            <tr>
              <th>Safari</th>
              <th>Location</th>
              <th>Duration</th>
              <th>From</th>
              <th>Status</th>
              <th>Rating</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : safaris.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-bone-ink/40 font-sans">
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
