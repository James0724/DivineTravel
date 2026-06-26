'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Input, { Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Accommodation, AccommodationPriceTier, PaginatedResponse } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  'luxury-lodge': 'Luxury Lodge',
  'tented-camp': 'Tented Camp',
  'beach-resort': 'Beach Resort',
}

const PRICE_TIER_LABEL: Record<AccommodationPriceTier, string> = {
  budget: 'Budget',
  midRange: 'Mid-Range',
  luxury: 'Luxury',
}

async function fetchAccommodations(params: {
  page: number
  search: string
  type: string
  active: string
}): Promise<PaginatedResponse<Accommodation>> {
  const qs = new URLSearchParams({ page: String(params.page), limit: '15', active: params.active || 'all' })
  if (params.search) qs.set('search', params.search)
  if (params.type) qs.set('type', params.type)
  const res = await fetch(`/api/accommodations?${qs.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function AdminAccommodationsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [active, setActive] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-accommodations', page, search, type, active],
    queryFn: () => fetchAccommodations({ page, search, type, active }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/accommodations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-accommodations'] })
      toast.success('Accommodation deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const toggleField = async (id: string, field: 'featured' | 'active', current: boolean) => {
    if (togglingId) return
    setTogglingId(id + '-' + field)
    try {
      const res = await fetch(`/api/accommodations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      })
      if (res.ok) {
        qc.invalidateQueries({ queryKey: ['admin-accommodations'] })
        toast.success('Updated')
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Failed to update')
    } finally {
      setTogglingId(null)
    }
  }

  const accommodations = data?.data ?? []
  const pagination = data?.pagination

  return (
    <>
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-bone-ink">Accommodations</h1>
            <p className="text-sm text-bone-ink/50 font-sans mt-1">
              {pagination?.total ?? 0} lodges, camps &amp; resorts
            </p>
          </div>
          <Link href="/admin/accommodations/new">
            <Button variant="primary" leftIcon={<Plus size={16} />}>
              Add Accommodation
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="max-w-xs"
          />
          <Select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1) }}
            placeholder="All types"
            options={[
              { value: '', label: 'All types' },
              { value: 'luxury-lodge', label: 'Luxury Lodge' },
              { value: 'tented-camp', label: 'Tented Camp' },
              { value: 'beach-resort', label: 'Beach Resort' },
            ]}
            className="max-w-[180px]"
          />
          <Select
            value={active}
            onChange={(e) => { setActive(e.target.value); setPage(1) }}
            placeholder="All statuses"
            options={[
              { value: '', label: 'All statuses' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            className="max-w-[160px]"
          />
        </div>

        {/* Table */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden overflow-x-auto">
          {isLoading ? (
            <table className="admin-table min-w-[800px]">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Location</th><th>Price Tier</th><th>Featured</th><th>Active</th><th>Actions</th></tr>
              </thead>
              <tbody><TableSkeleton rows={8} cols={7} /></tbody>
            </table>
          ) : accommodations.length === 0 ? (
            <div className="py-8">
              <EmptyState title="No accommodations found" description="Try adjusting your filters, or add a new partner property." />
            </div>
          ) : (
            <table className="admin-table min-w-[800px]">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price Tier</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded overflow-hidden bg-bone-bg flex-shrink-0">
                          {a.coverImage && (
                            <Image src={a.coverImage} alt={a.name} fill className="object-cover" sizes="48px" unoptimized />
                          )}
                        </div>
                        <p className="font-medium text-sm text-bone-ink">{a.name}</p>
                      </div>
                    </td>
                    <td className="text-sm text-bone-ink/60">{TYPE_LABEL[a.type]}</td>
                    <td className="text-sm text-bone-ink/60">{a.location.region}, {a.location.country}</td>
                    <td className="text-sm text-bone-ink/60">{a.priceTier ? PRICE_TIER_LABEL[a.priceTier] : '—'}</td>
                    <td>
                      <button
                        onClick={() => toggleField(a._id, 'featured', a.featured)}
                        disabled={!!togglingId}
                        className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          a.featured
                            ? 'bg-bone-forest/10 text-bone-forest hover:bg-bone-forest/20'
                            : 'bg-stone-100 text-stone-500 hover:bg-bone-forest/10 hover:text-bone-forest'
                        }`}
                      >
                        {togglingId === a._id + '-featured' ? '…' : a.featured ? '✓ Featured' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleField(a._id, 'active', a.active)}
                        disabled={!!togglingId}
                        className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          a.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-700'
                        }`}
                      >
                        {togglingId === a._id + '-active' ? '…' : a.active ? '✓ Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/accommodations/${a._id}`}
                          className="p-1.5 rounded text-bone-ink/40 hover:text-bone-forest hover:bg-bone-forest/10 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(a._id)}
                          className="p-1.5 rounded text-bone-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex gap-2 justify-end">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed text-sm font-sans"
            >
              Prev
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-40 disabled:cursor-not-allowed text-sm font-sans"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Accommodation"
        description="Are you sure you want to delete this accommodation? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  )
}
