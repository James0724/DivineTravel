import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import BookingModel from '@/lib/db/models/Booking'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()

    const booking = await BookingModel.findById(id).populate('safari', 'name slug location duration').lean()
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error('[GET /api/bookings/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()
    const body = await req.json()

    const allowedFields = ['status', 'paymentStatus', 'internalNotes']
    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) update[field] = body[field]
    }

    const booking = await BookingModel.findByIdAndUpdate(id, update, { new: true })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error('[PATCH /api/bookings/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const role = (session.user as { role?: string }).role
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()
    await BookingModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/bookings/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
