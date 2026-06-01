import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import BookingModel from '@/lib/db/models/Booking'
import SafariModel from '@/lib/db/models/Safari'
import { BookingSchema } from '@/lib/validations/booking'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // Validate
    const result = BookingSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 422 }
      )
    }

    const { safariId, emergencyContactName, emergencyContactPhone, ...data } = body

    // Look up safari for pricing
    const safari = await SafariModel.findById(safariId)
    if (!safari) {
      return NextResponse.json({ error: 'Safari not found' }, { status: 404 })
    }

    type PricingKey = 'budget' | 'midRange' | 'luxury'
    type PricingData = { pricePerPerson: number; currency?: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pricing = (safari.pricing as unknown) as Record<PricingKey, PricingData>
    const tierData = pricing[data.tier as PricingKey]
    const pricePerPerson = tierData.pricePerPerson
    const totalPrice = pricePerPerson * data.groupSize

    const booking = await BookingModel.create({
      ...data,
      safari: safariId,
      pricePerPerson,
      totalPrice,
      currency: (tierData as { currency?: string }).currency ?? 'USD',
      emergencyContact:
        emergencyContactName
          ? { name: emergencyContactName, phone: emergencyContactPhone }
          : undefined,
    })

    return NextResponse.json(
      { success: true, data: { bookingRef: booking.bookingRef, id: booking._id } },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/bookings]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)
    const search = searchParams.get('search')

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } },
      ]
    }

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate('safari', 'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BookingModel.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('[GET /api/bookings]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
