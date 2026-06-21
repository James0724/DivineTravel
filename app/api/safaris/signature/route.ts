import { NextRequest, NextResponse } from 'next/server'
import { getSignaturePackages } from '@/lib/data/safaris'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') ?? '6', 10)
    const featuredCount = parseInt(searchParams.get('featuredCount') ?? '2', 10)

    const data = await getSignaturePackages({ limit, featuredCount })

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    )
  } catch (error) {
    console.error('[GET /api/safaris/signature]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
