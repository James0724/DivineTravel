import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import AccommodationModel from '@/lib/db/models/Accommodation'
import slugify from 'slugify'
import { getAccommodationsList } from '@/lib/data/accommodations'
import type { AccommodationFilters, AccommodationType } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // `active` is only ever sent by the admin dashboard: 'all' shows both
    // active + inactive, 'false' shows inactive only, anything else (or
    // omitted, as on every public page) keeps the default active-only view.
    const activeParam = searchParams.get('active')
    const activeOnly = activeParam === 'all' ? undefined : activeParam !== 'false'
    const featuredParam = searchParams.get('featured')

    const filters: AccommodationFilters & { activeOnly?: boolean } = {
      search: searchParams.get('search') ?? undefined,
      type: (searchParams.get('type') as AccommodationType) ?? undefined,
      country: searchParams.get('country') ?? undefined,
      featured: featuredParam === null ? undefined : featuredParam === 'true',
      page: parseInt(searchParams.get('page') ?? '1', 10),
      limit: Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 50),
      activeOnly,
    }

    const result = await getAccommodationsList(filters)

    // Admin requests (anyone passing `active` at all) must never be served from edge cache
    const cacheHeader = activeParam !== null
      ? 'no-store'
      : 'public, s-maxage=300, stale-while-revalidate=60'

    return NextResponse.json(result, { headers: { 'Cache-Control': cacheHeader } })
  } catch (error) {
    console.error('[GET /api/accommodations]', error)
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
    const existing = await AccommodationModel.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString(36)}`
    }

    const accommodation = await AccommodationModel.create(body)

    return NextResponse.json({ success: true, data: accommodation }, { status: 201 })
  } catch (error: unknown) {
    console.error('[POST /api/accommodations]', error)
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'An accommodation with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
