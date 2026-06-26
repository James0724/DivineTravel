import mongoose, { Schema, Document, Model } from 'mongoose'

export const ACCOMMODATION_TYPE_VALUES = [
  'luxury-lodge',
  'tented-camp',
  'beach-resort',
] as const

export const ACCOMMODATION_PRICE_TIER_VALUES = ['budget', 'midRange', 'luxury'] as const

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const AccommodationImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: Number,
    height: Number,
  },
  { _id: false }
)

const LocationSchema = new Schema(
  {
    country: { type: String, required: [true, 'Country is required'] },
    region: { type: String, required: [true, 'Region/area is required'] },
  },
  { _id: false }
)

const SeoSchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  { _id: false }
)

// ─── Main Schema ─────────────────────────────────────────────────────────────

export interface IAccommodation extends Document {
  name: string
  slug: string
  type: (typeof ACCOMMODATION_TYPE_VALUES)[number]
  location: {
    country: string
    region: string
  }
  description: string
  highlights: string[]
  amenities: string[]
  coverImage: string
  coverImagePublicId?: string
  images: { url: string; publicId: string; alt: string; width?: number; height?: number }[]
  websiteUrl: string
  priceTier?: (typeof ACCOMMODATION_PRICE_TIER_VALUES)[number]
  featured: boolean
  active: boolean
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  createdAt: Date
  updatedAt: Date
}

const AccommodationSchema = new Schema<IAccommodation>(
  {
    name: {
      type: String,
      required: [true, 'Accommodation name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Accommodation type is required'],
      enum: ACCOMMODATION_TYPE_VALUES,
      index: true,
    },
    location: { type: LocationSchema, required: true },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    highlights: [{ type: String }],
    amenities: [{ type: String }],
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    images: [AccommodationImageSchema],
    websiteUrl: {
      type: String,
      required: [true, "The property's website URL is required"],
    },
    priceTier: {
      type: String,
      enum: ACCOMMODATION_PRICE_TIER_VALUES,
    },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    seo: { type: SeoSchema, default: () => ({}) },
  },
  { timestamps: true }
)

// ─── Indexes for performance ──────────────────────────────────────────────

AccommodationSchema.index({ active: 1, featured: -1 })
AccommodationSchema.index({ type: 1, active: 1 })
AccommodationSchema.index({ 'location.country': 1 })
AccommodationSchema.index({ createdAt: -1 })
AccommodationSchema.index({
  name: 'text',
  description: 'text',
  'location.region': 'text',
})

const AccommodationModel: Model<IAccommodation> =
  mongoose.models.Accommodation ||
  mongoose.model<IAccommodation>('Accommodation', AccommodationSchema)

export default AccommodationModel
