import type { ExchangeRates } from './getExchangeRates'
import type { CurrencyCode } from './constants'

/**
 * Converts a USD amount to the target currency using the given rate table.
 * Returns the currency actually used (falls back to USD if the target rate
 * is missing) so callers never mislabel a USD figure with the wrong symbol.
 */
export function convertPrice(
  amountUsd: number,
  targetCurrency: CurrencyCode,
  rates: ExchangeRates
): { amount: number; currency: CurrencyCode } {
  const rate = rates.rates[targetCurrency]
  if (!rate) return { amount: amountUsd, currency: 'USD' }
  return { amount: amountUsd * rate, currency: targetCurrency }
}
