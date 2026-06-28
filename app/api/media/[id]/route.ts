import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'
import { deleteImage, renameImage } from '@/lib/cloudinary'

type RouteCtx = { params: Promise<{ id: string }> }

// Safari images are referenced by publicId/url from the Safari document itself
// (cover + gallery). Renaming or deleting them here, outside the Safari edit
// form, would silently break that reference or orphan the safari with no
// image — those changes must go through the safari edit/create flow instead.
const SAFARI_PROTECTED_USAGE = new Set(['safari-cover', 'safari-gallery'])

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()
    const body = await req.json()

    if (body.newName !== undefined) {
      // Rename flow — updates Cloudinary public ID + URL + name in DB
      const existing = await ImageModel.findById(id)
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      if (SAFARI_PROTECTED_USAGE.has(existing.usage)) {
        return NextResponse.json(
          { error: 'Safari images can only be renamed from the safari edit page' },
          { status: 403 }
        )
      }

      const { publicId, url } = await renameImage(existing.publicId, body.newName)
      const safeName = body.newName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_.]/g, '')

      const image = await ImageModel.findByIdAndUpdate(
        id,
        { $set: { publicId, url, originalName: safeName } },
        { new: true }
      )
      return NextResponse.json({ success: true, data: image })
    }

    // Metadata-only update (alt / title)
    const image = await ImageModel.findByIdAndUpdate(
      id,
      { $set: { alt: body.alt ?? '', title: body.title ?? '' } },
      { new: true }
    )
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: image })
  } catch (error) {
    console.error('[PATCH /api/media/[id]]', error)
    const msg = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()
    const image = await ImageModel.findById(id)
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (SAFARI_PROTECTED_USAGE.has(image.usage)) {
      return NextResponse.json(
        { error: 'Safari images can only be removed from the safari edit page' },
        { status: 403 }
      )
    }

    await deleteImage(image.publicId)
    await ImageModel.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: 'Image deleted' })
  } catch (error) {
    console.error('[DELETE /api/media/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
