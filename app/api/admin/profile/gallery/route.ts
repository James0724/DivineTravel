import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'

export interface GalleryItem {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  title?: string
  alt?: string
}

/**
 * GET /api/admin/profile/gallery
 * Returns images tagged as 'team' usage from MongoDB.
 * Run POST /api/admin/media/sync first to populate the DB from Cloudinary.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Primary: images explicitly tagged as team
    let images = await ImageModel.find({ usage: 'team' })
      .sort({ createdAt: -1 })
      .limit(60)
      .lean()

    // Fallback: if no team-tagged images exist yet, look by folder path keyword
    if (images.length === 0) {
      images = await ImageModel.find({
        folder: { $regex: 'team', $options: 'i' },
      })
        .sort({ createdAt: -1 })
        .limit(60)
        .lean()
    }

    const data: GalleryItem[] = images.map((img) => ({
      url:      img.url,
      publicId: img.publicId,
      width:    img.width  ?? 0,
      height:   img.height ?? 0,
      format:   img.format ?? '',
      title:    img.title  ?? '',
      alt:      img.alt    ?? '',
    }))

    return NextResponse.json({ success: true, data, synced: data.length > 0 })
  } catch (error) {
    console.error('[GET /api/admin/profile/gallery]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
