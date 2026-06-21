import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import slugify from 'slugify'
import { getSafarisList } from '@/lib/data/safaris'
import type { SafariCategory, SafariDifficulty, SafariFilters, SafariStyle } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // `active` is only ever sent by the admin dashboard: 'all' shows both
    // active + inactive, 'false' shows inactive only, anything else (or
    // omitted, as on every public page) keeps the default active-only view.
    const activeParam = searchParams.get('active')
    const activeOnly = activeParam === 'all' ? undefined : activeParam !== 'false'
    const featuredParam = searchParams.get('featured')
    const minDays = searchParams.get('minDays')
    const maxDays = searchParams.get('maxDays')

    const filters: SafariFilters & { activeOnly?: boolean } = {
      search: searchParams.get('search') ?? undefined,
      category: (searchParams.get('category') as SafariCategory) ?? undefined,
      safariType: (searchParams.get('safariType') as SafariStyle) ?? undefined,
      difficulty: (searchParams.get('difficulty') as SafariDifficulty) ?? undefined,
      featured: featuredParam === null ? undefined : featuredParam === 'true',
      country: searchParams.get('country') ?? undefined,
      minDays: minDays ? parseInt(minDays, 10) : undefined,
      maxDays: maxDays ? parseInt(maxDays, 10) : undefined,
      page: parseInt(searchParams.get('page') ?? '1', 10),
      limit: Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 50),
      sort: (searchParams.get('sort') as SafariFilters['sort']) ?? 'rating',
      balanced: searchParams.get('balanced') === 'true' ? true : undefined,
      activeOnly,
    }

    const result = await getSafarisList(filters)

    // Admin requests (anyone passing `active` at all) must never be served from edge cache
    const cacheHeader = activeParam !== null
      ? 'no-store'
      : 'public, s-maxage=300, stale-while-revalidate=60'

    return NextResponse.json(result, { headers: { 'Cache-Control': cacheHeader } })
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
