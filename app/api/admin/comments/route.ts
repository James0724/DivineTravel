import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db/mongoose'
import CommentModel from '@/lib/db/models/Comment'

// GET: admin — list all comments with filters
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const postSlug = searchParams.get('postSlug')
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(25, parseInt(searchParams.get('limit') ?? '20', 10))

    const query: Record<string, unknown> = {}
    if (status && status !== 'all') query.status = status
    if (postSlug) query.postSlug = postSlug
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { postSlug: { $regex: search, $options: 'i' } },
      ]
    }

    const [comments, total, pendingCount] = await Promise.all([
      CommentModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CommentModel.countDocuments(query),
      CommentModel.countDocuments({ status: 'pending' }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(comments)),
      pendingCount,
      pagination: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    })
  } catch (err) {
    console.error('[GET /api/admin/comments]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
  }
}
