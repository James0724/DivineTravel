'use client'

import { useState } from 'react'
import BookingModal from './BookingModal'

interface SafariProps {
  _id: string
  name: string
  duration: number
  pricing: {
    budget?: { pricePerPerson: number } | null
    midRange?: { pricePerPerson: number } | null
    luxury?: { pricePerPerson: number } | null
  }
}

interface BookingButtonProps {
  safari: SafariProps
  label?: string
  className?: string
}

export default function BookingButton({ safari, label = 'Book this safari →', className }: BookingButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && <BookingModal safari={safari} onClose={() => setOpen(false)} />}
    </>
  )
}
