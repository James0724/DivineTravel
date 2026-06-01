import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import PostModel from '@/lib/db/models/Post'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '9', 10), 50)
    const sort = searchParams.get('sort') ?? 'newest'

    const query: Record<string, unknown> = {}

    // Default to published-only for public access (unless admin requests all)
    if (published !== 'all') query.published = true
    if (featured === 'true') query.featured = true
    if (category) query.category = category

    if (search) {
      query.$text = { $search: search }
    }

    type SortQuery = { [key: string]: 1 | -1 }
    const sortMap: Record<string, SortQuery> = {
      newest: { publishedAt: -1, createdAt: -1 },
      oldest: { publishedAt: 1, createdAt: 1 },
      featured: { featured: -1, publishedAt: -1 },
    }
    const sortQuery: SortQuery = sortMap[sort] ?? sortMap.newest

    const [posts, total] = await Promise.all([
      PostModel.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-body') // exclude body from list view for performance
        .lean(),
      PostModel.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(JSON.stringify(posts)),
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    )
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

    const { title, excerpt, content: bodyContent, body: bodyField, coverImage, author, authorTitle, authorAvatar, category, tags, faqs, featured, published, readingTime, seo } = body

    if (!title || !excerpt || !(bodyContent || bodyField) || !coverImage || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields: title, excerpt, body, coverImage, category' }, { status: 400 })
    }

    const slug = slugify(title, { lower: true, strict: true, trim: true })

    // Ensure unique slug
    const existing = await PostModel.findOne({ slug })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const publishedAt = published ? new Date() : undefined

    const post = await PostModel.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      body: (bodyContent || bodyField).trim(),
      coverImage,
      author: author || 'Divine Travel Nest Safaris',
      authorTitle,
      authorAvatar,
      category,
      tags: tags ?? [],
      faqs: faqs ?? [],
      featured: featured ?? false,
      published: published ?? false,
      publishedAt,
      readingTime: readingTime ?? Math.max(1, Math.round((bodyContent || bodyField).split(' ').length / 200)),
      seo: seo ?? {},
    })

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(post)) }, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/posts]', err)
    const msg = err instanceof Error ? err.message : 'Failed to create post'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
