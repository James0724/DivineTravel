import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

type Ctx = { params: Promise<{ id: string }> }

function isSuperAdmin(session: Session | null) {
  return session?.user?.role === 'super_admin'
}

/** PATCH /api/admin/users/[id] — update name / role / active (super_admin only) */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions)
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()

    const body = await req.json()
    const updates: Record<string, unknown> = {}

    if (typeof body.name === 'string' && body.name.trim()) {
      updates.name = body.name.trim()
    }
    if (typeof body.active === 'boolean') {
      // Super admin can't deactivate themselves
      if (id === session?.user?.id && !body.active) {
        return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 })
      }
      updates.active = body.active
    }
    if (typeof body.role === 'string') {
      const validRoles = ['super_admin', 'admin', 'editor', 'viewer']
      if (!validRoles.includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
      // Super admin can't demote themselves
      if (id === session?.user?.id) {
        return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 })
      }
      updates.role = body.role
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('[PATCH /api/admin/users/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** DELETE /api/admin/users/[id] — delete user (super_admin only, not self) */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions)
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    if (id === session?.user?.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }

    await connectDB()
    const user = await UserModel.findByIdAndDelete(id).select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/users/[id]]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
