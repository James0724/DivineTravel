'use client'

import { useCurrency } from '@/lib/currency/useCurrency'

interface PriceProps {
  amountUsd: number
  compact?: boolean
  suffix?: string
}

/** Renders a USD amount converted to the visitor's selected currency. Use this instead of formatting prices inline in server components, which can't react to the currency switcher. */
export default function Price({ amountUsd, compact = false, suffix = '' }: PriceProps) {
  const { displayPrice } = useCurrency()
  return (
    <>
      {displayPrice(amountUsd, compact)}
      {suffix}
    </>
  )
}
