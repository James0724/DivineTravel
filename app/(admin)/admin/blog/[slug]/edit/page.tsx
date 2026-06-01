'use client'

import { use, useEffect, useState } from 'react'
import BlogForm from '@/components/admin/BlogForm'
import type { BlogPost } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditBlogPostPage({ params }: Props) {
  const { slug } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
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
      <div className="p-6 sm:p-8">
        <div className="animate-pulse space-y-4 max-w-4xl">
          <div className="h-8 bg-bone-bg rounded w-64" />
          <div className="h-64 bg-bone-bg rounded" />
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
      <BlogForm post={post} />
    </div>
  )
}
