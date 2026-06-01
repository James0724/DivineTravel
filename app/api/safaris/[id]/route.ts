import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import { deleteFolder } from '@/lib/cloudinary'

// Support both slug (public) and ObjectId (admin)
async function findSafari(id: string) {
  const isId = /^[0-9a-fA-F]{24}$/.test(id)
  return isId
    ? SafariModel.findById(id)
    : SafariModel.findOne({ slug: id, active: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const safari = await findSafari(id)
    if (!safari) {
      return NextResponse.json({ error: 'Safari not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: safari })
  } catch (error) {
    console.error('[GET /api/safaris/[id]]', error)
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

    const safari = await SafariModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!safari) {
      return NextResponse.json({ error: 'Safari not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: safari })
  } catch (error) {
    console.error('[PATCH /api/safaris/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
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
    const safari = await SafariModel.findById(id)
    if (!safari) {
      return NextResponse.json({ error: 'Safari not found' }, { status: 404 })
    }

    // Optionally clean up Cloudinary folder
    try {
      await deleteFolder(`acacia-safaris/safaris/${safari.slug}`)
    } catch {
      // Non-fatal
    }

    await SafariModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Safari deleted' })
  } catch (error) {
    console.error('[DELETE /api/safaris/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
