import { NextResponse } from 'next/server'
import { getExchangeRates } from '@/lib/currency/getExchangeRates'

export const revalidate = 86400

/** GET /api/exchange-rates — USD-based rates, cached 24h server-side */
export async function GET() {
  const rates = await getExchangeRates()
  return NextResponse.json(rates, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
  })
}
