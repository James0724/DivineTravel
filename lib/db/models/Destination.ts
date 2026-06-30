import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const DestinationImageSchema = new Schema(
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
    region: { type: String },
  },
  { _id: false }
)

const AccessSchema = new Schema(
  {
    byRoad: { type: String },
    byAir: { type: String },
  },
  { _id: false }
)

const ItinerarySchema = new Schema(
  {
    title: { type: String, required: true },
    durationLabel: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{ type: String }],
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

export interface IDestination extends Document {
  name: string
  slug: string
  location: {
    country: string
    region?: string
  }
  size?: string
  climaticConditions: string
  majorAttractions: string[]
  wildlife: string[]
  access: {
    byRoad?: string
    byAir?: string
  }
  bestTimeToVisit: string
  activities: string[]
  itineraries: {
    title: string
    durationLabel: string
    description: string
    activities: string[]
  }[]
  coverImage: string
  coverImagePublicId?: string
  images: { url: string; publicId: string; alt: string; width?: number; height?: number }[]
  shortDescription: string
  description: string
  /** e.g. "National Reserve", "Conservancy" — shown next to the name on listing cards */
  subtitle?: string
  /** Short marketing tag, e.g. "Big cats · Great Migration" */
  tag?: string
  /** Short "best for" phrase, e.g. "Big cats & the Migration" */
  bestFor?: string
  /** 3-5 short bullet phrases for listing cards — distinct from the majorAttractions fact sheet */
  highlights?: string[]
  /** Manual sort weight within the featured / non-featured groups on country listing pages */
  order: number
  featured: boolean
  active: boolean
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  createdAt: Date
  updatedAt: Date
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
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
    location: { type: LocationSchema, required: true },
    size: { type: String },
    climaticConditions: {
      type: String,
      required: [true, 'Climatic conditions are required'],
    },
    majorAttractions: [{ type: String }],
    wildlife: [{ type: String }],
    access: { type: AccessSchema, default: () => ({}) },
    bestTimeToVisit: {
      type: String,
      required: [true, 'Best time to visit is required'],
    },
    activities: [{ type: String }],
    itineraries: [ItinerarySchema],
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    images: [DestinationImageSchema],
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [220, 'Short description cannot exceed 220 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    subtitle: { type: String, trim: true },
    tag: { type: String, trim: true },
    bestFor: { type: String, trim: true },
    highlights: [{ type: String }],
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    seo: { type: SeoSchema, default: () => ({}) },
  },
  { timestamps: true }
)

// ─── Indexes for performance ──────────────────────────────────────────────

DestinationSchema.index({ active: 1, featured: -1 })
DestinationSchema.index({ 'location.country': 1 })
DestinationSchema.index({ createdAt: -1 })
DestinationSchema.index({
  name: 'text',
  description: 'text',
  majorAttractions: 'text',
})

const DestinationModel: Model<IDestination> =
  mongoose.models.Destination ||
  mongoose.model<IDestination>('Destination', DestinationSchema)

export default DestinationModel
