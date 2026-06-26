'use client'

import { createContext, useContext } from 'react'
import type { ExchangeRates } from '@/lib/currency/getExchangeRates'

const ExchangeRatesContext = createContext<ExchangeRates | null>(null)

export function ExchangeRatesProvider({
  rates,
  children,
}: {
  rates: ExchangeRates
  children: React.ReactNode
}) {
  return (
    <ExchangeRatesContext.Provider value={rates}>{children}</ExchangeRatesContext.Provider>
  )
}

export function useExchangeRates(): ExchangeRates {
  const ctx = useContext(ExchangeRatesContext)
  if (!ctx) {
    throw new Error('useExchangeRates must be used within an ExchangeRatesProvider')
  }
  return ctx
}
