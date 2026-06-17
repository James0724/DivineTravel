import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await UserModel.findById(session.user.id).select('-password').lean()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar ?? null,
        title: user.title ?? null,
        bio: user.bio ?? null,
      },
    })
  } catch (err) {
    console.error('[GET /api/users/me]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}
