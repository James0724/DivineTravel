import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { uploadImage, usageToFolder } from '@/lib/cloudinary'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'
import type { ImageUsage } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file    = formData.get('file')  as File   | null
    const usage   = (formData.get('usage')  as ImageUsage) ?? 'misc'
    const alt     = (formData.get('alt')    as string) ?? ''
    const title   = (formData.get('title')  as string) ?? ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be JPEG, PNG, WebP, or AVIF' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10 MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const folder = usageToFolder(usage)

    const result = await uploadImage(buffer, folder, {
      transformation: [
        { width: 2000, height: 1500, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    // Persist metadata in MongoDB
    await connectDB()
    const image = await ImageModel.create({
      url:          result.url,
      publicId:     result.publicId,
      alt:          alt || title || file.name.replace(/\.[^/.]+$/, ''),
      title:        title || file.name.replace(/\.[^/.]+$/, ''),
      originalName: file.name,
      fileSize:     file.size,
      width:        result.width,
      height:       result.height,
      format:       result.format,
      folder,
      usage,
      uploadedBy:   session.user.email ?? 'admin',
    })

    return NextResponse.json({
      success: true,
      data: {
        _id:      image._id,
        url:      result.url,
        publicId: result.publicId,
        width:    result.width,
        height:   result.height,
        format:   result.format,
        alt:      image.alt,
        usage,
      },
    })
  } catch (error) {
    console.error('[POST /api/upload]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const config = { api: { bodyParser: false } }
