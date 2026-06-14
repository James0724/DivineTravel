import type { Metadata } from 'next'
import JournalForm from '@/components/admin/JournalForm'

export const metadata: Metadata = { title: 'New Journal Post' }

export default function NewJournalPostPage() {
  return (
    <div className="p-6 sm:p-8">
      <JournalForm />
    </div>
  )
}
