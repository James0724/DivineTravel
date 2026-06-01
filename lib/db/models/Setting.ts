import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISetting extends Document {
  // Site identity
  siteName: string
  siteTagline: string
  aboutText: string
  logoUrl: string

  // Contact
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  country: string

  // Social media
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  tripadvisor: string

  // SEO defaults
  defaultMetaTitle: string
  defaultMetaDescription: string

  // Business settings
  defaultCurrency: string
  bookingNotificationEmail: string
  minAdvanceBookingDays: number

  // Business hours
  businessHours: string

  updatedAt: Date
  createdAt: Date
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: { type: String, default: 'Divine Travel Nest Safaris' },
    siteTagline: { type: String, default: 'Your Unforgettable East Africa Safari' },
    aboutText: { type: String, default: '' },
    logoUrl: { type: String, default: '' },

    email: { type: String, default: 'info@divinetravelnestsafaris.com' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Nairobi' },
    country: { type: String, default: 'Kenya' },

    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tripadvisor: { type: String, default: '' },

    defaultMetaTitle: { type: String, default: 'Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safari Tour Packages' },
    defaultMetaDescription: { type: String, default: 'Expert-guided, tailor-made East Africa safaris. Kenya, Tanzania & Uganda — Budget to Luxury.' },

    defaultCurrency: { type: String, default: 'USD' },
    bookingNotificationEmail: { type: String, default: 'info@divinetravelnestsafaris.com' },
    minAdvanceBookingDays: { type: Number, default: 7 },

    businessHours: { type: String, default: 'Mon–Fri 8am–6pm EAT, Sat 9am–2pm EAT' },
  },
  { timestamps: true }
)

const SettingModel: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)

export default SettingModel
