import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import TestimonialModel from '@/lib/db/models/Testimonial'
import { TestimonialSchema } from '@/lib/validations/testimonial'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const featured = searchParams.get('featured')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50)
    const page = parseInt(searchParams.get('page') ?? '1')

    const query: Record<string, unknown> = {}
    if (featured === 'true') query.featured = true

    const [testimonials, total] = await Promise.all([
      TestimonialModel.find(query)
        .sort({ rating: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TestimonialModel.countDocuments(query),
    ])

    return NextResponse.json(
      {
        success: true,
        data: testimonials,
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
    console.error('[GET /api/testimonials]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()

    const result = TestimonialSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 422 }
      )
    }

    const testimonial = await TestimonialModel.create(result.data)
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/testimonials]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
