import { SUPPORTED_CURRENCIES } from './constants'

export interface ExchangeRates {
  base: 'USD'
  rates: Record<string, number>
  fetchedAt: string
}

const FALLBACK_RATES: ExchangeRates = {
  base: 'USD',
  rates: { USD: 1 },
  fetchedAt: new Date(0).toISOString(),
}

/**
 * Server-only fetch of USD-based exchange rates, cached by Next's fetch
 * cache for 24h. Shared by the /api/exchange-rates route and any server
 * component that needs rates at render time — Next dedupes identical
 * fetch() calls against its Data Cache, so the upstream call only actually
 * happens once per revalidation window regardless of call count.
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 86400, tags: ['exchange-rates'] },
    })
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = await res.json()
    if (data.result !== 'success') throw new Error('upstream reported failure')

    const rates: Record<string, number> = { USD: 1 }
    for (const code of SUPPORTED_CURRENCIES) {
      if (code in data.rates) rates[code] = data.rates[code]
    }
    return { base: 'USD', rates, fetchedAt: new Date().toISOString() }
  } catch (error) {
    console.error('[getExchangeRates]', error)
    return FALLBACK_RATES
  }
}
