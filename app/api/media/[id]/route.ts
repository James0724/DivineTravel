import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'
import { deleteImage } from '@/lib/cloudinary'

type RouteCtx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()
    const body  = await req.json()
    const image = await ImageModel.findByIdAndUpdate(
      id,
      { $set: { alt: body.alt ?? '', title: body.title ?? '' } },
      { new: true }
    )
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: image })
  } catch (error) {
    console.error('[PATCH /api/media/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
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

    await deleteImage(image.publicId)
    await ImageModel.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: 'Image deleted' })
  } catch (error) {
    console.error('[DELETE /api/media/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
