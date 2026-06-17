import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import UserModel from '@/lib/db/models/User'

/** GET /api/users — list active users for author selection (any authenticated role) */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const users = await UserModel
      .find({ active: true })
      .select('_id name avatar title bio')
      .sort({ name: 1 })
      .lean()

    return NextResponse.json({ success: true, data: users })
  } catch (err) {
    console.error('[GET /api/users]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}
