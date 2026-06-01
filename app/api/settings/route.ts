import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import SettingModel from '@/lib/db/models/Setting'

/** GET /api/settings â€” returns (or creates default) site settings */
export async function GET() {
  try {
    await connectDB()
    let settings = await SettingModel.findOne().lean()

    if (!settings) {
      // Bootstrap with defaults on first call
      settings = await SettingModel.create({})
      settings = settings.toObject()
    }

    return NextResponse.json(
      { success: true, data: settings },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    )
  } catch (error) {
    console.error('[GET /api/settings]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** PATCH /api/settings â€” update site settings (admin only) */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()

    // Upsert: update existing doc or create first one
    const settings = await SettingModel.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: false }
    )

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('[PATCH /api/settings]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
