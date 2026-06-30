import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import DestinationModel from '@/lib/db/models/Destination'
import DestinationForm from '@/components/admin/DestinationForm'
import type { Destination } from '@/types'

export const metadata: Metadata = { title: 'Edit Destination' }

interface Props {
  params: Promise<{ id: string }>
}

async function getDestination(id: string): Promise<Destination | null> {
  try {
    await connectDB()
    const destination = await DestinationModel.findById(id).lean()
    if (!destination) return null
    return JSON.parse(JSON.stringify(destination)) as Destination
  } catch {
    return null
  }
}

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params
  const destination = await getDestination(id)

  if (!destination) notFound()

  return (
    <div className="p-6 sm:p-8">
      <DestinationForm existing={destination} />
    </div>
  )
}
