import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import DestinationModel from '@/lib/db/models/Destination'
import slugify from 'slugify'
import { getDestinationsList } from '@/lib/data/destinations'
import type { DestinationFilters } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // `active` is only ever sent by the admin dashboard: 'all' shows both
    // active + inactive, 'false' shows inactive only, anything else (or
    // omitted, as on every public page) keeps the default active-only view.
    const activeParam = searchParams.get('active')
    const activeOnly = activeParam === 'all' ? null : activeParam !== 'false'
    const featuredParam = searchParams.get('featured')

    const filters: DestinationFilters & { activeOnly?: boolean | null } = {
      search: searchParams.get('search') ?? undefined,
      country: searchParams.get('country') ?? undefined,
      featured: featuredParam === null ? undefined : featuredParam === 'true',
      page: parseInt(searchParams.get('page') ?? '1', 10),
      // Admin dashboard (the only caller that sends `active`) loads the
      // full set for its client-side TanStack table — public callers stay
      // capped at 50 per page.
      limit: Math.min(parseInt(searchParams.get('limit') ?? '12', 10), activeParam !== null ? 1000 : 50),
      activeOnly,
    }

    const result = await getDestinationsList(filters)

    // Admin requests (anyone passing `active` at all) must never be served from edge cache
    const cacheHeader = activeParam !== null
      ? 'no-store'
      : 'public, s-maxage=300, stale-while-revalidate=60'

    return NextResponse.json(result, { headers: { 'Cache-Control': cacheHeader } })
  } catch (error) {
    console.error('[GET /api/destinations]', error)
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
    const existing = await DestinationModel.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString(36)}`
    }

    const destination = await DestinationModel.create(body)

    return NextResponse.json({ success: true, data: destination }, { status: 201 })
  } catch (error: unknown) {
    console.error('[POST /api/destinations]', error)
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'A destination with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
