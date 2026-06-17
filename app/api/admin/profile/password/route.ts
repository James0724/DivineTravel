import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

/** PATCH /api/admin/profile/password — change password for the logged-in user */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()

    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await UserModel.findById(session.user.id).select('+password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const valid = await user.comparePassword(currentPassword)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    user.password = newPassword
    await user.save() // bcrypt pre-save hook hashes the new password

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/admin/profile/password]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
