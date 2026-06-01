import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import connectDB from '@/lib/db/mongoose'
import CommentModel from '@/lib/db/models/Comment'
import PostModel from '@/lib/db/models/Post'

// GET: fetch approved comments for a post (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postSlug = searchParams.get('postSlug')

  if (!postSlug) {
    return NextResponse.json({ success: false, error: 'postSlug required' }, { status: 400 })
  }

  try {
    await connectDB()
    const comments = await CommentModel.find({ postSlug, status: 'approved' })
      .sort({ createdAt: 1 })
      .select('-email -ipAddress -userAgent')
      .lean()

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(comments)) })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST: submit a new comment (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { postSlug, name, email, commentBody, parentId, subscribeToReplies, _hp } = body

    // Honeypot: silently accept but don't save
    if (_hp) {
      return NextResponse.json({ success: true, message: 'Comment submitted and awaiting moderation.' })
    }

    // Validation
    if (!postSlug || !name?.trim() || !email?.trim() || !commentBody?.trim()) {
      return NextResponse.json({ success: false, error: 'Name, email, and comment are required.' }, { status: 400 })
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Name must be at least 2 characters.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (commentBody.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Comment is too short.' }, { status: 400 })
    }
    if (commentBody.trim().length > 2000) {
      return NextResponse.json({ success: false, error: 'Comment must be under 2000 characters.' }, { status: 400 })
    }

    await connectDB()

    // Verify post exists and is published
    const post = await PostModel.findOne({ slug: postSlug, published: true }).select('_id').lean()
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found.' }, { status: 404 })
    }

    // Validate parentId if provided
    if (parentId) {
      const parent = await CommentModel.findOne({ _id: parentId, postSlug, status: 'approved' }).lean()
      if (!parent) {
        return NextResponse.json({ success: false, error: 'Parent comment not found.' }, { status: 404 })
      }
    }

    // Gravatar URL
    const gravatarHash = createHash('md5').update(email.trim().toLowerCase()).digest('hex')
    const avatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon&s=80`

    // Client IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    await CommentModel.create({
      postId: (post as { _id: unknown })._id,
      postSlug,
      parentId: parentId ?? null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      body: commentBody.trim(),
      status: 'pending',
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') ?? '',
      subscribeToReplies: !!subscribeToReplies,
      avatarUrl,
    })

    return NextResponse.json(
      { success: true, message: 'Your comment has been submitted and is awaiting moderation. Thank you!' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/comments]', err)
    return NextResponse.json({ success: false, error: 'Failed to submit comment.' }, { status: 500 })
  }
}
