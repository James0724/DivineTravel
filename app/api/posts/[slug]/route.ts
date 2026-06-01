import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import PostModel from '@/lib/db/models/Post'
import slugify from 'slugify'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB()
    const { slug } = await params
    const session = await getServerSession(authOptions)

    // Admins can fetch unpublished posts; public can only see published
    const query = session ? { slug } : { slug, published: true }

    const post = await PostModel.findOne(query).lean()
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(post)) })
  } catch (err) {
    console.error('[GET /api/posts/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorised' }, { status: 401 })
    }

    await connectDB()
    const { slug } = await params
    const body = await req.json()

    const post = await PostModel.findOne({ slug })
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    // Regenerate slug if title changed
    if (body.title && body.title !== post.title) {
      const newSlug = slugify(body.title, { lower: true, strict: true, trim: true })
      const existing = await PostModel.findOne({ slug: newSlug, _id: { $ne: post._id } })
      body.slug = existing ? `${newSlug}-${Date.now()}` : newSlug
    }

    // Set publishedAt when publishing for first time
    if (body.published && !post.published && !post.publishedAt) {
      body.publishedAt = new Date()
    }

    const updated = await PostModel.findByIdAndUpdate(post._id, { $set: body }, { new: true, runValidators: true })

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updated)) })
  } catch (err: unknown) {
    console.error('[PUT /api/posts/[slug]]', err)
    const msg = err instanceof Error ? err.message : 'Failed to update post'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorised' }, { status: 401 })
    }

    await connectDB()
    const { slug } = await params

    const post = await PostModel.findOneAndDelete({ slug })
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    console.error('[DELETE /api/posts/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 })
  }
}
