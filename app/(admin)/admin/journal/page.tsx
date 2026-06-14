'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import type { JournalPost, PostCategory } from '@/types'

const CATEGORY_LABELS: Record<PostCategory, string> = {
  migration: 'Migration',
  destinations: 'Destinations',
  planning: 'Planning',
  wildlife: 'Wildlife',
  culture: 'Culture',
  conservation: 'Conservation',
  photography: 'Photography',
  tips: 'Tips',
}

interface PostsResponse {
  success: boolean
  data: JournalPost[]
  pagination: {
    total: number
    page: number
    totalPages: number
  }
}

async function fetchPosts(params: URLSearchParams): Promise<PostsResponse> {
  const res = await fetch(`/api/posts?${params}&published=all`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminJournalPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; title: string } | null>(null)
  const qc = useQueryClient()

  const params = new URLSearchParams({
    page: String(page),
    limit: '20',
    ...(search && { search }),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-journal', page, search],
    queryFn: () => fetchPosts(params),
  })

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-journal'] })
      toast.success('Post deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete post'),
  })

  const posts = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">Journal</h1>
          <p className="text-sm text-bone-ink/50 mt-0.5 font-sans">
            {pagination ? `${pagination.total} posts total` : ''}
          </p>
        </div>
        <Link href="/admin/journal/new">
          <Button>
            <Plus size={16} className="mr-1.5" />
            New post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-ink/35" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search posts…"
          className="w-full pl-9 pr-4 h-10 text-sm font-sans bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30 text-bone-ink placeholder:text-bone-ink/35"
        />
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-bone-ink/40 font-sans text-sm">
            No posts found. <Link href="/admin/journal/new" className="text-bone-forest hover:underline">Create one →</Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>FAQs</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className="font-medium text-bone-ink font-sans text-sm leading-snug max-w-xs">
                      {post.title}
                    </div>
                    <div className="text-xs text-bone-ink/40 mt-0.5 font-mono">{post.slug}</div>
                  </td>
                  <td>
                    <Badge variant="default">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <Badge variant={post.published ? 'success' : 'warning'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                      {post.featured && <Badge variant="forest">Featured</Badge>}
                    </div>
                  </td>
                  <td className="text-bone-ink/55 text-xs">{formatDate(post.publishedAt)}</td>
                  <td className="text-bone-ink/55 text-xs">
                    {post.faqs?.length ? `${post.faqs.length} FAQ${post.faqs.length > 1 ? 's' : ''}` : '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/journal/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-bone-bg text-bone-ink/40 hover:text-bone-ink transition-colors"
                        title="View post"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/journal/${post.slug}/edit`}
                        className="p-1.5 rounded hover:bg-bone-bg text-bone-ink/40 hover:text-bone-ink transition-colors"
                        title="Edit post"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ slug: post.slug, title: post.title })}
                        className="p-1.5 rounded hover:bg-red-50 text-bone-ink/40 hover:text-red-500 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 size={15} />
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
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-bone-ink/55 font-sans">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.slug)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
