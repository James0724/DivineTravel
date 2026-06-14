'use client'

import { use, useEffect, useState } from 'react'
import JournalForm from '@/components/admin/JournalForm'
import type { JournalPost } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditJournalPostPage({ params }: Props) {
  const { slug } = use(params)
  const [post, setPost] = useState<JournalPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPost(d.data)
        else setError(d.error ?? 'Post not found')
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="p-6 sm:p-8 animate-pulse space-y-6 max-w-4xl">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-36 bg-bone-bg rounded" />
            <div className="h-3.5 w-52 bg-bone-bg rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-20 bg-bone-bg rounded" />
            <div className="h-9 w-28 bg-bone-bg rounded" />
          </div>
        </div>
        {/* Content section */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
          <div className="h-4 w-20 bg-bone-bg rounded" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-16 bg-bone-bg rounded" />
            <div className="h-10 bg-bone-bg rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 bg-bone-bg rounded" />
            <div className="h-20 bg-bone-bg rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-16 bg-bone-bg rounded" />
            <div className="h-64 bg-bone-bg rounded" />
          </div>
        </div>
        {/* Cover image section */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-4">
          <div className="h-4 w-28 bg-bone-bg rounded" />
          <div className="w-full max-w-sm aspect-video bg-bone-bg rounded-md" />
        </div>
        {/* Meta section */}
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-4">
          <div className="h-4 w-24 bg-bone-bg rounded" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3.5 w-20 bg-bone-bg rounded" />
                <div className="h-10 bg-bone-bg rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="p-6 sm:p-8 text-bone-ink/60 font-sans text-sm">
        {error ?? 'Post not found'}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8">
      <JournalForm post={post} />
    </div>
  )
}
