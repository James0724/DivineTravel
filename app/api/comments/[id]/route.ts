import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import CommentModel from '@/lib/db/models/Comment'

interface Props {
  params: Promise<{ id: string }>
}

// PUT: admin — update status and/or add a reply
export async function PUT(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { status, adminReplyBody } = body as {
      status?: string
      adminReplyBody?: string | null
    }

    await connectDB()

    const update: Record<string, unknown> = {}

    if (status) {
      const validStatuses = ['pending', 'approved', 'rejected', 'spam']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
      }
      update.status = status
    }

    if (adminReplyBody !== undefined) {
      update.adminReply = adminReplyBody
        ? { body: adminReplyBody.trim(), repliedAt: new Date() }
        : null
    }

    const comment = await CommentModel.findByIdAndUpdate(id, update, { new: true })
      .select('-ipAddress -userAgent')
      .lean()

    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(comment)) })
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}

// DELETE: admin — permanently delete a comment and its replies
export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await connectDB()
    // Delete the comment and any child replies
    await Promise.all([
      CommentModel.findByIdAndDelete(id),
      CommentModel.deleteMany({ parentId: id }),
    ])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  }
}
