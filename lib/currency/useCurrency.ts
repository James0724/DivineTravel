'use client'

import { useCurrencyStore } from '@/store/currencyStore'
import { useExchangeRates } from '@/components/providers/ExchangeRatesProvider'
import { convertPrice } from './convertPrice'
import { formatPrice } from '@/lib/utils'

export function useCurrency() {
  const currency = useCurrencyStore((s) => s.currency)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const rates = useExchangeRates()

  /** Converts a USD amount to the active currency and formats it for display. */
  function displayPrice(amountUsd: number, compact = false): string {
    const { amount, currency: resolvedCurrency } = convertPrice(amountUsd, currency, rates)
    return formatPrice(amount, resolvedCurrency, compact)
  }

  return { currency, setCurrency, displayPrice, rates }
}
