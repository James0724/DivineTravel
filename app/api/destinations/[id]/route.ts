import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import DestinationModel from '@/lib/db/models/Destination'
import ImageModel from '@/lib/db/models/Image'
import { deleteImage } from '@/lib/cloudinary'

// Support both slug (public) and ObjectId (admin)
async function findDestination(id: string) {
  const isId = /^[0-9a-fA-F]{24}$/.test(id)
  return isId
    ? DestinationModel.findById(id)
    : DestinationModel.findOne({ slug: id, active: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const destination = await findDestination(id)
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: destination })
  } catch (error) {
    console.error('[GET /api/destinations/[id]]', error)
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

    // Snapshot the images this destination referenced *before* the update, so
    // we can tell which ones the edit dropped (removed from gallery, or
    // replaced cover) — those Cloudinary assets would otherwise sit around
    // orphaned.
    const existing = await DestinationModel.findById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    const destination = await DestinationModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    const oldPublicIds = [
      existing.coverImagePublicId,
      ...(existing.images ?? []).map((img) => img.publicId),
    ].filter((publicId): publicId is string => !!publicId)
    const newPublicIds = new Set(
      [
        destination.coverImagePublicId,
        ...(destination.images ?? []).map((img) => img.publicId),
      ].filter((publicId): publicId is string => !!publicId)
    )
    const removedPublicIds = oldPublicIds.filter((publicId) => !newPublicIds.has(publicId))

    if (removedPublicIds.length) {
      await Promise.all(
        removedPublicIds.map(async (publicId) => {
          try {
            await deleteImage(publicId)
          } catch (err) {
            console.error(`[PATCH /api/destinations/[id]] Cloudinary delete failed for ${publicId}`, err)
          }
        })
      )
      try {
        await ImageModel.deleteMany({ publicId: { $in: removedPublicIds } })
      } catch (err) {
        console.error('[PATCH /api/destinations/[id]] Failed to clean up Image library records', err)
      }
    }

    return NextResponse.json({ success: true, data: destination })
  } catch (error) {
    console.error('[PATCH /api/destinations/[id]]', error)
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
    const role = (session.user as { role?: string }).role
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid destination id' }, { status: 400 })
    }

    await connectDB()
    const destination = await DestinationModel.findById(id)
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    const publicIds = [
      destination.coverImagePublicId,
      ...(destination.images ?? []).map((img) => img.publicId),
    ].filter((publicId): publicId is string => !!publicId)

    const cloudinaryFailures: string[] = []
    await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          await deleteImage(publicId)
        } catch (err) {
          cloudinaryFailures.push(publicId)
          console.error(`[DELETE /api/destinations/[id]] Cloudinary delete failed for ${publicId}`, err)
        }
      })
    )

    if (publicIds.length) {
      try {
        await ImageModel.deleteMany({
          publicId: { $in: publicIds.filter((id) => !cloudinaryFailures.includes(id)) },
        })
      } catch (err) {
        console.error('[DELETE /api/destinations/[id]] Failed to clean up Image library records', err)
      }
    }

    await DestinationModel.findByIdAndDelete(id)

    if (cloudinaryFailures.length) {
      return NextResponse.json({
        success: true,
        message: `Destination deleted, but ${cloudinaryFailures.length} image(s) could not be removed from Cloudinary`,
        cloudinaryFailures,
      })
    }

    return NextResponse.json({ success: true, message: 'Destination deleted' })
  } catch (error) {
    console.error('[DELETE /api/destinations/[id]]', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
