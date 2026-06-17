import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'
import type { ImageUsage } from '@/lib/db/models/Image'
import cloudinary from '@/lib/cloudinary'

/* ── Types ──────────────────────────────────────────────────────────── */

interface CloudinaryResource {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
  folder?: string
  asset_folder?: string
  display_name?: string
  original_filename?: string
  next_cursor?: string
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function detectFolder(r: CloudinaryResource): string {
  if (r.asset_folder) return r.asset_folder
  if (r.folder) return r.folder
  if (r.public_id.includes('/')) return r.public_id.split('/').slice(0, -1).join('/')
  return ''
}

function detectUsage(publicId: string, folder: string): ImageUsage {
  const haystack = `${folder}/${publicId}`.toLowerCase()
  const segments = haystack.split('/').filter(Boolean)

  for (const seg of segments) {
    if (seg === 'team' || seg === 'teams') return 'team'
    if (seg === 'blog' || seg === 'posts') return 'blog-cover'
    if (seg === 'portfolio' || seg === 'gallery') return 'portfolio'
    if (seg.startsWith('safari')) return 'safari-gallery'
    if (seg === 'testimonials') return 'misc'
  }
  return 'misc'
}

/** Pull all resources from Cloudinary, handling pagination. */
async function fetchAllCloudinaryImages(): Promise<CloudinaryResource[]> {
  const all: CloudinaryResource[] = []
  let cursor: string | undefined

  do {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      max_results: 500,
      ...(cursor && { next_cursor: cursor }),
    })
    all.push(...(result.resources ?? []))
    cursor = result.next_cursor
  } while (cursor)

  return all
}

/* ── Route handlers ──────────────────────────────────────────────────── */

/** POST /api/admin/media/sync — pull Cloudinary → MongoDB */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const resources = await fetchAllCloudinaryImages()

    const ops = resources.map((r) => {
      const folder = detectFolder(r)
      const usage  = detectUsage(r.public_id, folder)
      const name   = r.display_name ?? r.original_filename ?? r.public_id.split('/').pop() ?? r.public_id

      return {
        updateOne: {
          filter: { publicId: r.public_id },
          update: {
            $set: {
              url:          r.secure_url,
              publicId:     r.public_id,
              width:        r.width  ?? 0,
              height:       r.height ?? 0,
              format:       r.format ?? '',
              fileSize:     r.bytes  ?? 0,
              folder,
              usage,
              originalName: name,
            },
            $setOnInsert: {
              alt:          '',
              title:        name,
              uploadedBy:   'cloudinary-sync',
            },
          },
          upsert: true,
        },
      }
    })

    const result = await ImageModel.bulkWrite(ops, { ordered: false })
    const synced = (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0)

    return NextResponse.json({ success: true, synced, total: resources.length })
  } catch (error) {
    console.error('[POST /api/admin/media/sync]', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

/** GET /api/admin/media/sync — return image counts per usage as a quick stats check */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const agg = await ImageModel.aggregate([
      { $group: { _id: '$usage', count: { $sum: 1 } } },
    ])

    const counts: Record<string, number> = { all: 0 }
    for (const { _id, count } of agg) {
      counts[_id] = count
      counts.all  = (counts.all ?? 0) + count
    }

    return NextResponse.json({ success: true, counts })
  } catch (error) {
    console.error('[GET /api/admin/media/sync]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
