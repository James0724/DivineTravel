import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    // Filters
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const featured = searchParams.get('featured')
    const country = searchParams.get('country')
    const tier = searchParams.get('tier')
    const minDays = searchParams.get('minDays')
    const maxDays = searchParams.get('maxDays')
    const active = searchParams.get('active')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 50)
    const sort = searchParams.get('sort') ?? 'rating'

    const query: Record<string, unknown> = {}

    // Default to active-only for public routes
    if (active !== 'all') query.active = true
    if (featured === 'true') query.featured = true
    if (category) query.category = category
    if (difficulty) query.difficulty = difficulty
    if (country) query['location.country'] = { $regex: country, $options: 'i' }
    if (minDays || maxDays) {
      query.duration = {}
      if (minDays) (query.duration as Record<string, number>).$gte = parseInt(minDays)
      if (maxDays) (query.duration as Record<string, number>).$lte = parseInt(maxDays)
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Sort
    type SortQuery = { [key: string]: 1 | -1 }
    const sortMap: Record<string, SortQuery> = {
      rating: { rating: -1, reviewCount: -1 },
      newest: { createdAt: -1 },
      price_asc: { 'pricing.budget.pricePerPerson': 1 },
      price_desc: { 'pricing.luxury.pricePerPerson': -1 },
      duration_asc: { duration: 1 },
    }
    const sortQuery: SortQuery = sortMap[sort] ?? sortMap.rating

    const [safaris, total] = await Promise.all([
      SafariModel.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          'name slug tagline location duration pricing images coverImage category difficulty featured active rating reviewCount minGroupSize maxGroupSize bestSeason'
        )
        .lean(),
      SafariModel.countDocuments(query),
    ])

    return NextResponse.json(
      {
        success: true,
        data: safaris,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    )
  } catch (error) {
    console.error('[GET /api/safaris]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()

    // Auto-generate slug
    if (!body.slug) {
      body.slug = slugify(body.name, { lower: true, strict: true })
    }

    // Ensure slug uniqueness
    const existing = await SafariModel.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString(36)}`
    }

    const safari = await SafariModel.create(body)

    return NextResponse.json({ success: true, data: safari }, { status: 201 })
  } catch (error: unknown) {
    console.error('[POST /api/safaris]', error)
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'A safari with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
