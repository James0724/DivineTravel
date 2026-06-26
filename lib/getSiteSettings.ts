import connectDB from '@/lib/db/mongoose'
import SettingModel from '@/lib/db/models/Setting'

export interface ContactSettings {
  phone: string
  whatsapp: string
  email: string
  facebook: string
  instagram: string
  youtube: string
  tripadvisor: string
  googleReviews: string
}

const FALLBACK: ContactSettings = {
  phone: '+254 722-595-916',
  whatsapp: '',
  email: 'info@divinetravelnestsafaris.com',
  facebook: '',
  instagram: '',
  youtube: '',
  tripadvisor:
    'https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html',
  googleReviews: 'https://share.google/hr0uDk89EOkgVPDGh',
}

/** Server-only: fetch the public contact/social fields of the Setting singleton as a plain, serializable object. */
export async function getContactSettings(): Promise<ContactSettings> {
  try {
    await connectDB()
    const doc = await SettingModel.findOne(
      {},
      'phone whatsapp email facebook instagram youtube tripadvisor googleReviews'
    ).lean()

    if (!doc) return FALLBACK

    return {
      phone: doc.phone || FALLBACK.phone,
      whatsapp: doc.whatsapp || '',
      email: doc.email || FALLBACK.email,
      facebook: doc.facebook || '',
      instagram: doc.instagram || '',
      youtube: doc.youtube || '',
      tripadvisor: doc.tripadvisor || FALLBACK.tripadvisor,
      googleReviews: doc.googleReviews || FALLBACK.googleReviews,
    }
  } catch (error) {
    console.error('[getContactSettings]', error)
    return FALLBACK
  }
}
