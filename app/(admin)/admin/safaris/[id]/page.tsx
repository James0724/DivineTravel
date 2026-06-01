import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import SafariForm from '@/components/admin/SafariForm'
import type { Safari } from '@/types'

export const metadata: Metadata = { title: 'Edit Safari' }

interface Props {
  params: Promise<{ id: string }>
}

async function getSafari(id: string): Promise<Safari | null> {
  try {
    await connectDB()
    const safari = await SafariModel.findById(id).lean()
    if (!safari) return null
    return JSON.parse(JSON.stringify(safari)) as Safari
  } catch {
    return null
  }
}

export default async function EditSafariPage({ params }: Props) {
  const { id } = await params
  const safari = await getSafari(id)

  if (!safari) notFound()

  return (
    <div className="p-6 sm:p-8">
      <SafariForm existing={safari} />
    </div>
  )
}
