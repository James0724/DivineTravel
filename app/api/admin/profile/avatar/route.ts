import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage, CLOUDINARY_FOLDERS } from '@/lib/cloudinary'

/** POST /api/admin/profile/avatar — upload avatar to Cloudinary */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer, CLOUDINARY_FOLDERS.team, {
      public_id: `avatar_${session.user.id}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    return NextResponse.json({ success: true, url: result.url })
  } catch (error) {
    console.error('[POST /api/admin/profile/avatar]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
