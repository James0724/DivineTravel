'use client'

import { useEffect, useState, useCallback } from 'react'
import { MessageSquare, Check, X, Trash2, Reply, AlertTriangle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { TableSkeleton } from '@/components/ui/Skeleton'
import type { Comment, CommentStatus } from '@/types'

const STATUS_LABELS: Record<CommentStatus | 'all', string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  spam: 'Spam',
}

const STATUS_COLORS: Record<CommentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-stone-100 text-stone-600',
  spam: 'bg-red-100 text-red-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Reply modal state
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/comments?${params}`)
      const json = await res.json()
      if (json.success) {
        setComments(json.data)
        setPendingCount(json.pendingCount ?? 0)
        setTotalPages(json.pagination.totalPages)
        setTotal(json.pagination.total)
      }
    } catch {
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => { fetchComments() }, [fetchComments])

  async function updateStatus(id: string, status: CommentStatus) {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!json.success) throw new Error()
      setComments((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)))
      setPendingCount((n) => {
        const wasPending = comments.find((c) => c._id === id)?.status === 'pending'
        return wasPending && status !== 'pending' ? Math.max(0, n - 1) : n
      })
      const labels: Record<CommentStatus, string> = {
        approved: 'Comment approved',
        rejected: 'Comment rejected',
        spam: 'Marked as spam',
        pending: 'Reset to pending',
      }
      toast.success(labels[status])
    } catch {
      toast.error('Failed to update comment status')
    }
  }

  async function deleteComment(id: string) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setComments((prev) => prev.filter((c) => c._id !== id))
      setTotal((n) => n - 1)
      toast.success('Comment deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete comment')
    } finally {
      setDeleting(false)
    }
  }

  async function submitReply() {
    if (!replyTarget || !replyBody.trim()) return
    setReplySubmitting(true)
    try {
      const res = await fetch(`/api/comments/${replyTarget._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReplyBody: replyBody.trim() }),
      })
      const json = await res.json()
      if (!json.success) throw new Error()
      setComments((prev) =>
        prev.map((c) => (c._id === replyTarget._id ? json.data : c))
      )
      toast.success(replyTarget.adminReply ? 'Reply updated' : 'Reply posted')
      setReplyTarget(null)
      setReplyBody('')
    } catch {
      toast.error('Failed to post reply')
    } finally {
      setReplySubmitting(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">Comments</h1>
          <p className="text-sm text-bone-ink/50 font-sans mt-1">
            Moderate and manage reader comments across all journal posts.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-amber-50 border border-amber-200">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
            <span className="text-sm font-sans font-medium text-amber-700">
              {pendingCount} comment{pendingCount !== 1 ? 's' : ''} awaiting moderation
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap">
          {(Object.keys(STATUS_LABELS) as Array<CommentStatus | 'all'>).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3.5 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-bone-forest text-bone-paper'
                  : 'text-bone-ink/60 hover:text-bone-ink hover:bg-bone-ink/5'
              }`}
            >
              {STATUS_LABELS[s]}
              {s === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-bone-ink/40" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search comments…"
              className="pl-8 pr-3 h-8 text-xs font-sans bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded outline-none focus:border-bone-clay text-bone-ink"
            />
          </div>
          <button
            type="submit"
            className="h-8 px-3 text-xs font-sans bg-bone-forest text-bone-paper rounded hover:bg-bone-forest/90 transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
              className="h-8 px-2 text-xs font-sans text-bone-ink/50 hover:text-bone-ink transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
        {loading ? (
          <table className="w-full text-sm font-sans">
            <thead className="border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Commenter</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden md:table-cell">Post</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Comment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody><TableSkeleton rows={8} cols={6} /></tbody>
          </table>
        ) : comments.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-bone-ink/20" />
            <p className="text-bone-ink/40 text-sm font-sans">No comments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="border-b border-[rgba(23,22,18,0.1)] bg-bone-bg/40">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Commenter</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden md:table-cell">Post</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Comment</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-bone-ink/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(23,22,18,0.08)]">
                {comments.map((c) => (
                  <tr key={c._id} className="hover:bg-bone-bg/30 transition-colors">
                    {/* Commenter */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-bone-ink text-[13px]">{c.name}</div>
                      <div className="text-bone-ink/40 text-[11px] font-mono">{c.email}</div>
                      {c.ipAddress && (
                        <div className="text-bone-ink/30 text-[10px] font-mono hidden xl:block">{c.ipAddress}</div>
                      )}
                    </td>
                    {/* Post slug */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={`/journal/${c.postSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bone-clay hover:underline text-[12px] font-mono break-all"
                      >
                        {c.postSlug}
                      </a>
                      {c.parentId && (
                        <span className="ml-1 text-[10px] text-bone-muted">(reply)</span>
                      )}
                    </td>
                    {/* Comment body */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-[13px] text-bone-ink/80 line-clamp-2 break-words">{c.body}</p>
                      {c.adminReply && (
                        <p className="text-[11px] text-bone-clay mt-1 italic line-clamp-1">
                          ↩ Admin replied
                        </p>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-bone-ink/50 text-[12px] hidden lg:table-cell whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(c._id, 'approved')}
                            title="Approve"
                            className="p-1.5 rounded text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {c.status !== 'rejected' && c.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(c._id, 'rejected')}
                            title="Reject"
                            className="p-1.5 rounded text-stone-500 hover:bg-stone-50 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                        {c.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(c._id, 'rejected')}
                            title="Reject"
                            className="p-1.5 rounded text-stone-500 hover:bg-stone-50 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                        {c.status !== 'spam' && (
                          <button
                            onClick={() => updateStatus(c._id, 'spam')}
                            title="Mark as spam"
                            className="p-1.5 rounded text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <AlertTriangle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => { setReplyTarget(c); setReplyBody(c.adminReply?.body ?? '') }}
                          title="Reply"
                          className="p-1.5 rounded text-bone-clay hover:bg-bone-clay/10 transition-colors"
                        >
                          <Reply size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c._id)}
                          title="Delete"
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm font-sans">
          <span className="text-bone-ink/50 text-xs">
            {total} comment{total !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-bone-ink/60">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink/60 hover:text-bone-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Reply modal */}
      {replyTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,16,10,0.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setReplyTarget(null) }}
        >
          <div className="bg-bone-paper rounded-md shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-[rgba(23,22,18,0.1)]">
              <h3 className="font-serif text-lg font-semibold text-bone-ink">
                {replyTarget.adminReply ? 'Edit reply' : 'Reply to comment'}
              </h3>
              <p className="text-xs font-sans text-bone-ink/50 mt-0.5">
                Replying to <strong>{replyTarget.name}</strong>
              </p>
            </div>
            <div className="px-6 py-4">
              <div
                className="mb-4 px-4 py-3 rounded-sm text-[13px] font-sans text-bone-ink/70 italic"
                style={{ background: 'rgba(31,29,24,0.05)', border: '1px solid rgba(31,29,24,0.1)' }}
              >
                &ldquo;{replyTarget.body.slice(0, 150)}{replyTarget.body.length > 150 ? '…' : ''}&rdquo;
              </div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-bone-ink/60 mb-1.5">
                Your reply
              </label>
              <textarea
                rows={4}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write your reply…"
                className="w-full px-3.5 py-2.5 font-sans text-[14px] text-bone-ink bg-white border border-[rgba(31,29,24,0.2)] rounded-sm outline-none focus:border-bone-clay resize-y"
                autoFocus
              />
              {replyTarget.adminReply && (
                <button
                  onClick={async () => {
                    await fetch(`/api/comments/${replyTarget._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ adminReplyBody: null }),
                    })
                    setComments((prev) =>
                      prev.map((c) =>
                        c._id === replyTarget._id ? { ...c, adminReply: null } : c
                      )
                    )
                    setReplyTarget(null)
                    setReplyBody('')
                  }}
                  className="mt-2 text-[12px] font-sans text-red-600 hover:underline"
                >
                  Remove reply
                </button>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[rgba(23,22,18,0.1)] flex justify-end gap-3">
              <button
                onClick={() => { setReplyTarget(null); setReplyBody('') }}
                className="h-9 px-4 text-sm font-sans text-bone-ink/60 hover:text-bone-ink border border-[rgba(23,22,18,0.2)] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                disabled={replySubmitting || !replyBody.trim()}
                className="h-9 px-4 text-sm font-sans font-medium bg-bone-forest text-bone-paper rounded hover:bg-bone-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replySubmitting ? 'Saving…' : 'Post reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,16,10,0.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null) }}
        >
          <div className="bg-bone-paper rounded-md shadow-xl w-full max-w-sm p-6">
            <h3 className="font-serif text-lg font-semibold text-bone-ink mb-2">Delete comment?</h3>
            <p className="font-sans text-[14px] text-bone-ink/60 mb-6 leading-relaxed">
              This will permanently delete the comment and all its replies. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-9 px-4 text-sm font-sans text-bone-ink/60 hover:text-bone-ink border border-[rgba(23,22,18,0.2)] rounded transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteComment(deleteTarget)}
                disabled={deleting}
                className="h-9 px-5 text-sm font-sans font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
