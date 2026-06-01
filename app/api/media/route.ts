import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import ImageModel from '@/lib/db/models/Image'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const usage  = searchParams.get('usage')
    const search = searchParams.get('search')
    const page   = parseInt(searchParams.get('page')  ?? '1',  10)
    const limit  = Math.min(parseInt(searchParams.get('limit') ?? '24', 10), 100)

    const query: Record<string, unknown> = {}
    if (usage)  query.usage = usage
    if (search) {
      query.$or = [
        { alt:          { $regex: search, $options: 'i' } },
        { title:        { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } },
      ]
    }

    const [images, total] = await Promise.all([
      ImageModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ImageModel.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext:    page < Math.ceil(total / limit),
        hasPrev:    page > 1,
      },
    })
  } catch (error) {
    console.error('[GET /api/media]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
