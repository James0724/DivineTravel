import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import PostModel from '@/lib/db/models/Post'
import slugify from 'slugify'
import { getPostsList } from '@/lib/data/posts'
import type { PostCategory } from '@/types'

const AUTHOR_FIELDS = 'name avatar title bio'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // `published=all` is only ever sent by the admin dashboard, which loads
    // the full set for its client-side TanStack table — public callers stay
    // capped at 50 per page.
    const includeUnpublished = searchParams.get('published') === 'all'

    const result = await getPostsList({
      search: searchParams.get('search') ?? undefined,
      category: (searchParams.get('category') as PostCategory) ?? undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: parseInt(searchParams.get('page') ?? '1', 10),
      limit: Math.min(parseInt(searchParams.get('limit') ?? '9', 10), includeUnpublished ? 1000 : 50),
      sort: (searchParams.get('sort') as 'newest' | 'oldest' | 'featured') ?? 'newest',
      includeUnpublished,
    })

    // Admin requests must never be served from edge cache
    const cacheHeader = includeUnpublished
      ? 'no-store'
      : 'public, s-maxage=300, stale-while-revalidate=60'

    return NextResponse.json(result, { headers: { 'Cache-Control': cacheHeader } })
  } catch (err) {
    console.error('[GET /api/posts]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorised' }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()

    const {
      title, excerpt, content: bodyContent, body: bodyField,
      coverImage, authorId, category, tags, faqs,
      featured, published, readingTime, seo,
    } = body

    if (!title || !excerpt || !(bodyContent || bodyField) || !coverImage || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, excerpt, body, coverImage, category' },
        { status: 400 }
      )
    }

    const slug = slugify(title, { lower: true, strict: true, trim: true })
    const existing = await PostModel.findOne({ slug })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug
    const publishedAt = published ? new Date() : undefined

    const post = await PostModel.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      body: (bodyContent || bodyField).trim(),
      coverImage,
      author: authorId || session.user.id,
      category,
      tags: tags ?? [],
      faqs: faqs ?? [],
      featured: featured ?? false,
      published: published ?? false,
      publishedAt,
      readingTime: readingTime ?? Math.max(1, Math.round((bodyContent || bodyField).split(' ').length / 200)),
      seo: seo ?? {},
    })

    const populated = await post.populate('author', AUTHOR_FIELDS)

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(populated)) }, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/posts]', err)
    const msg = err instanceof Error ? err.message : 'Failed to create post'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
