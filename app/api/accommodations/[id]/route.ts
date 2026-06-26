import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import AccommodationModel from '@/lib/db/models/Accommodation'

// Support both slug (public) and ObjectId (admin)
async function findAccommodation(id: string) {
  const isId = /^[0-9a-fA-F]{24}$/.test(id)
  return isId
    ? AccommodationModel.findById(id)
    : AccommodationModel.findOne({ slug: id, active: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const accommodation = await findAccommodation(id)
    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: accommodation })
  } catch (error) {
    console.error('[GET /api/accommodations/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()
    const body = await req.json()

    // Don't allow direct slug change — generate from name
    if (body.name && !body.slug) {
      const slugify = (await import('slugify')).default
      body.slug = slugify(body.name, { lower: true, strict: true })
    }

    // Strip gallery images missing required fields so Mongoose validators don't reject the whole update
    if (Array.isArray(body.images)) {
      body.images = body.images.filter(
        (img: { url?: string; publicId?: string }) =>
          typeof img.url === 'string' && img.url.trim() &&
          typeof img.publicId === 'string' && img.publicId.trim()
      )
    }

    const accommodation = await AccommodationModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: accommodation })
  } catch (error) {
    console.error('[PATCH /api/accommodations/[id]]', error)
    // Return the actual Mongoose validation message so the form can surface it
    const message =
      error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()
    const accommodation = await AccommodationModel.findById(id)
    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
    }

    await AccommodationModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Accommodation deleted' })
  } catch (error) {
    console.error('[DELETE /api/accommodations/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
