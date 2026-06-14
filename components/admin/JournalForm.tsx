'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import JournalEditor from '@/components/admin/JournalEditor'
import type { JournalPost, PostCategory } from '@/types'

const ImageUpload = dynamic(() => import('@/components/admin/ImageUpload'), { ssr: false })

const CATEGORY_OPTIONS: { value: PostCategory; label: string }[] = [
  { value: 'migration', label: 'Migration' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'planning', label: 'Planning' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'culture', label: 'Culture' },
  { value: 'conservation', label: 'Conservation' },
  { value: 'photography', label: 'Photography' },
  { value: 'tips', label: 'Tips & Practical' },
]

interface Faq {
  question: string
  answer: string
}

interface JournalFormProps {
  post?: JournalPost
}

export default function JournalForm({ post }: JournalFormProps) {
  const router = useRouter()
  const isEdit = !!post

  const [title, setTitle] = useState(post?.title ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '')
  const [coverImagePublicId, setCoverImagePublicId] = useState('')
  const [author, setAuthor] = useState(post?.author ?? '')
  const [authorTitle, setAuthorTitle] = useState(post?.authorTitle ?? '')
  const [authorAvatar, setAuthorAvatar] = useState(post?.authorAvatar ?? '')
  const [authorBio, setAuthorBio] = useState(post?.authorBio ?? '')
  const [category, setCategory] = useState<PostCategory>(post?.category ?? 'tips')

  // Pre-populate author fields from the logged-in user when creating a new post
  useEffect(() => {
    if (isEdit) return
    fetch('/api/users/me')
      .then((r) => r.json())
      .then(({ success, data }) => {
        if (!success || !data) return
        setAuthor(data.name ?? '')
        setAuthorAvatar(data.avatar ?? '')
        setAuthorBio(data.bio ?? '')
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [tagsInput, setTagsInput] = useState((post?.tags ?? []).join(', '))
  const [readingTime, setReadingTime] = useState(post?.readingTime ?? 5)
  const [featured, setFeatured] = useState(post?.featured ?? false)
  const [published, setPublished] = useState(post?.published ?? false)
  const [faqs, setFaqs] = useState<Faq[]>(post?.faqs ?? [])
  const [metaTitle, setMetaTitle] = useState(post?.seo?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(post?.seo?.metaDescription ?? '')
  const [keywordsInput, setKeywordsInput] = useState((post?.seo?.keywords ?? []).join(', '))
  const [saving, setSaving] = useState(false)

  function addFaq() {
    setFaqs((prev) => [...prev, { question: '', answer: '' }])
  }

  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateFaq(i: number, field: keyof Faq, val: string) {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !excerpt.trim() || !body.trim() || !coverImage.trim() || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        coverImage: coverImage.trim(),
        author: author.trim() || 'Divine Travel Nest Safaris',
        authorTitle: authorTitle.trim() || undefined,
        authorAvatar: authorAvatar.trim() || undefined,
        authorBio: authorBio.trim() || undefined,
        category,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        featured,
        published,
        readingTime: Number(readingTime),
        seo: {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          keywords: keywordsInput.split(',').map((k) => k.trim()).filter(Boolean),
        },
      }

      const url = isEdit ? `/api/posts/${post!.slug}` : '/api/posts'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error ?? 'Failed to save')

      toast.success(isEdit ? 'Post updated' : 'Post created')
      router.push('/admin/journal')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink">
            {isEdit ? 'Edit post' : 'New journal post'}
          </h1>
          {isEdit && (
            <p className="text-sm text-bone-ink/50 mt-1 font-sans">{post!.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Update post' : 'Create post'}
          </Button>
        </div>
      </div>

      {/* Main fields */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
        <h2 className="font-serif text-base font-semibold text-bone-ink">Content</h2>
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What animals can you see in Nairobi National Park?"
        />
        <Textarea
          label="Excerpt"
          required
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown on the journal listing (max 300 chars)"
          maxLength={300}
          hint={`${excerpt.length}/300`}
        />

        {/* Body editor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-bone-ink/80 font-sans">
            Body <span className="text-bone-clay">*</span>
          </label>
          <JournalEditor value={body} onChange={setBody} />
          <p className="text-xs text-bone-ink/50 font-sans">
            Use H2 for main sections, H3 for sub-sections. Links open in new tab. Output is saved as HTML.
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
        <h2 className="font-serif text-base font-semibold text-bone-ink">Post settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <ImageUpload
              label="Cover image"
              required
              usage="blog-cover"
              value={coverImage || undefined}
              publicId={coverImagePublicId || undefined}
              onChange={(url, publicId) => {
                setCoverImage(url)
                setCoverImagePublicId(publicId)
              }}
              onClear={() => {
                setCoverImage('')
                setCoverImagePublicId('')
              }}
              aspectRatio="16/9"
            />
          </div>
          <Select
            label="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
            options={CATEGORY_OPTIONS}
          />
          <Input
            label="Tags (comma-separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Kenya, Safari, Wildlife"
          />
          <Input
            label="Reading time (minutes)"
            type="number"
            min={1}
            max={60}
            value={readingTime}
            onChange={(e) => setReadingTime(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-sans text-bone-ink/80">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-sans text-bone-ink/80">Published</span>
          </label>
        </div>
      </div>

      {/* Author */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
        <h2 className="font-serif text-base font-semibold text-bone-ink">Author</h2>
        <p className="text-xs text-bone-ink/45 font-sans -mt-3">
          Pre-filled from your profile. Edit per-post as needed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            label="Author title / role"
            value={authorTitle}
            onChange={(e) => setAuthorTitle(e.target.value)}
            placeholder="Head guide · Masai Mara"
          />
          <Input
            label="Author avatar URL"
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            placeholder="https://..."
            className="sm:col-span-2"
          />
          <Textarea
            label="Author bio"
            rows={3}
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            placeholder="Short bio shown beneath the post…"
            className="sm:col-span-2"
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-bone-ink">
            FAQs <span className="text-xs font-sans font-normal text-bone-ink/50 ml-2">displayed as accordion on the post page</span>
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus size={14} className="mr-1" />
            Add FAQ
          </Button>
        </div>
        {faqs.length === 0 && (
          <p className="text-sm text-bone-ink/40 font-sans">No FAQs yet. Click &quot;Add FAQ&quot; to add questions.</p>
        )}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 p-4 bg-bone-bg rounded-sm border border-[rgba(23,22,18,0.08)]">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <Input
                    label={`Question ${i + 1}`}
                    value={faq.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    placeholder="What is included in the price?"
                  />
                  <Textarea
                    label="Answer"
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                    placeholder="All tiers include park fees, professional guiding, meals and airport transfers."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="mt-6 text-bone-ink/30 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Remove FAQ"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md p-6 space-y-5">
        <h2 className="font-serif text-base font-semibold text-bone-ink">SEO</h2>
        <Input
          label="Meta title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Post title | Divine Travel Nest Safaris"
        />
        <Textarea
          label="Meta description"
          rows={2}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Short description for search engines (150–160 chars)"
        />
        <Input
          label="Keywords (comma-separated)"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          placeholder="nairobi safari, kenya wildlife, big five"
        />
      </div>

      {/* Submit footer */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" loading={saving}>
          {isEdit ? 'Update post' : 'Create post'}
        </Button>
      </div>
    </form>
  )
}
