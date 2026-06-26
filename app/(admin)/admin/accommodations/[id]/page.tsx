import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import AccommodationModel from '@/lib/db/models/Accommodation'
import AccommodationForm from '@/components/admin/AccommodationForm'
import type { Accommodation } from '@/types'

export const metadata: Metadata = { title: 'Edit Accommodation' }

interface Props {
  params: Promise<{ id: string }>
}

async function getAccommodation(id: string): Promise<Accommodation | null> {
  try {
    await connectDB()
    const accommodation = await AccommodationModel.findById(id).lean()
    if (!accommodation) return null
    return JSON.parse(JSON.stringify(accommodation)) as Accommodation
  } catch {
    return null
  }
}

export default async function EditAccommodationPage({ params }: Props) {
  const { id } = await params
  const accommodation = await getAccommodation(id)

  if (!accommodation) notFound()

  return (
    <div className="p-6 sm:p-8">
      <AccommodationForm existing={accommodation} />
    </div>
  )
}
