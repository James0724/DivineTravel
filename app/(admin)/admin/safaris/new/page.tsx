import type { Metadata } from 'next'
import SafariForm from '@/components/admin/SafariForm'

export const metadata: Metadata = { title: 'Add Safari' }

export default function NewSafariPage() {
  return (
    <div className="p-6 sm:p-8">
      <SafariForm />
    </div>
  )
}
