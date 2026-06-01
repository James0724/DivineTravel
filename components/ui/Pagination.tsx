'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

function buildRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildRange(page, totalPages)
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex flex-col items-center gap-5 mt-16" role="navigation" aria-label="Pagination">
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--ink)] hover:text-[var(--ink)]"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={1.8} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-10 h-10 flex items-center justify-center text-[13px]"
              style={{ color: 'var(--muted)' }}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className="w-10 h-10 flex items-center justify-center border rounded-full text-[13px] font-mono tracking-[0.06em] transition-all duration-200 hover:border-[var(--forest)] hover:text-[var(--forest)]"
              style={
                p === page
                  ? { borderColor: 'var(--forest)', background: 'var(--forest)', color: 'var(--paper)' }
                  : { borderColor: 'var(--line)', color: 'var(--muted)' }
              }
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--ink)] hover:text-[var(--ink)]"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          aria-label="Next page"
        >
          <ChevronRight size={16} strokeWidth={1.8} />
        </button>
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--muted)' }}>
        Showing {from}–{to} of {total} safari{total !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
