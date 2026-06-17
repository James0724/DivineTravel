import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

/** GET /api/admin/profile — returns the current user's profile */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const user = await UserModel.findById(session.user.id).select('-password').lean()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('[GET /api/admin/profile]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** PATCH /api/admin/profile — update name, bio, avatar */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await req.json()
    const updates: Record<string, string> = {}
    if (typeof body.name === 'string' && body.name.trim()) {
      updates.name = body.name.trim()
    }
    if (typeof body.bio === 'string') {
      updates.bio = body.bio
    }
    if (typeof body.avatar === 'string') {
      updates.avatar = body.avatar
    }

    const user = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('[PATCH /api/admin/profile]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
