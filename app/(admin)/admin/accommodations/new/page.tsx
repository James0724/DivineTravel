import type { Metadata } from 'next'
import AccommodationForm from '@/components/admin/AccommodationForm'

export const metadata: Metadata = { title: 'Add Accommodation' }

export default function NewAccommodationPage() {
  return (
    <div className="p-6 sm:p-8">
      <AccommodationForm />
    </div>
  )
}
