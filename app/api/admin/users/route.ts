import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

function isSuperAdmin(session: Session | null) {
  return session?.user?.role === 'super_admin'
}

/** GET /api/admin/users — list all users (super_admin only) */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await connectDB()
    const users = await UserModel.find({}).select('-password').sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('[GET /api/admin/users]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** POST /api/admin/users — create a new user (super_admin only) */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()
    const { name, email, password, role, active } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const validRoles = ['super_admin', 'admin', 'editor', 'viewer']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    const user = await UserModel.create({
      name:   name.trim(),
      email:  email.toLowerCase().trim(),
      password,
      role:   role ?? 'editor',
      active: active ?? true,
    })

    const safe = user.toObject()
    delete (safe as Record<string, unknown>).password

    return NextResponse.json({ success: true, data: safe }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/users]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
