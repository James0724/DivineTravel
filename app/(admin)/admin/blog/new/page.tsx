import type { Metadata } from 'next'
import BlogForm from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'New Blog Post' }

export default function NewBlogPostPage() {
  return (
    <div className="p-6 sm:p-8">
      <BlogForm />
    </div>
  )
}
