import type { Metadata } from 'next'
import DestinationForm from '@/components/admin/DestinationForm'

export const metadata: Metadata = { title: 'Add Destination' }

export default function NewDestinationPage() {
  return (
    <div className="p-6 sm:p-8">
      <DestinationForm />
    </div>
  )
}
