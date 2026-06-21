import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Safari type (style of experience — distinct from `category`/theme) ────
// Two dimensions, stored in one array: "activity" (how the safari is run)
// and "traveller" (who it's designed for). See lib/data/safariTypes.ts for
// the grouping/labels used on the /safari-types pages.

export const SAFARI_TYPE_VALUES = [
  // Activity types
  'walking',
  'game-drive',
  'fly-in',
  'mobile-camping',
  'water-based',
  'horseback',
  'balloon',
  'self-drive',
  'photographic',
  'night',
  'birding',
  'wellness',
  'conservation',
  // Traveller types
  'family',
  'honeymoon',
  'solo',
  'small-group',
  'couples',
  'private',
] as const

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const SafariImageSchema = new Schema(
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
    country:  { type: String, default: '' },
    countries: [{ type: String }],
    region:   { type: String, default: '' },
    regions:  [{ type: String }],
    park:     { type: String, default: '' },
    parks:    [{ type: String }],
  },
  { _id: false }
)

const HotelSchema = new Schema(
  {
    name:   { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
)

const PricingTierSchema = new Schema(
  {
    pricePerPerson:    { type: Number, required: true, min: 0 },
    currency:          { type: String, default: 'USD' },
    description:       { type: String, required: true },
    includes:          [{ type: String }],
    accommodationType: { type: String, required: true },
    hotels:            [HotelSchema],
  },
  { _id: false }
)

const ItineraryDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meals: [{ type: String }],
    accommodation: { type: String, default: '' },
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

export interface ISafari extends Document {
  name: string
  slug: string
  tagline: string
  description: string
  location: {
    country: string
    countries: string[]
    region: string
    regions: string[]
    park: string
    parks: string[]
  }
  duration: number
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: {
    day: number
    title: string
    description: string
    meals: string[]
    accommodation: string
    activities: string[]
  }[]
  pricing: {
    budget: typeof PricingTierSchema
    midRange: typeof PricingTierSchema
    luxury: typeof PricingTierSchema
  }
  images: { url: string; publicId: string; alt: string }[]
  coverImage: string
  coverImagePublicId?: string
  category: string[]
  safariType: string[]
  difficulty: string
  maxGroupSize: number
  minGroupSize: number
  minAge: number
  bestSeason: string[]
  featured: boolean
  active: boolean
  rating: number
  reviewCount: number
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  createdAt: Date
  updatedAt: Date
}

const SafariSchema = new Schema<ISafari>(
  {
    name: {
      type: String,
      required: [true, 'Safari name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: { type: LocationSchema, required: true },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 day'],
    },
    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    pricing: {
      budget: { type: PricingTierSchema, required: true },
      midRange: { type: PricingTierSchema, required: true },
      luxury: { type: PricingTierSchema, required: true },
    },
    images: [SafariImageSchema],
    coverImage:          { type: String, default: '' },
    coverImagePublicId:  { type: String, default: '' },
    category: [
      {
        type: String,
        enum: ['wildlife', 'adventure', 'cultural', 'beach', 'mountain', 'gorilla'],
      },
    ],
    safariType: [
      {
        type: String,
        enum: SAFARI_TYPE_VALUES,
      },
    ],
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging'],
      default: 'moderate',
    },
    maxGroupSize: { type: Number, default: 12 },
    minGroupSize: { type: Number, default: 1 },
    minAge: { type: Number, default: 5 },
    bestSeason: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    seo: { type: SeoSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ─── Indexes for performance ──────────────────────────────────────────────

SafariSchema.index({ active: 1, featured: -1, rating: -1 })
SafariSchema.index({ 'location.country': 1 })
SafariSchema.index({ 'location.countries': 1 })
SafariSchema.index({ category: 1 })
SafariSchema.index({ safariType: 1 })
SafariSchema.index({ 'pricing.budget.pricePerPerson': 1 })
SafariSchema.index({ createdAt: -1 })
SafariSchema.index({
  name: 'text',
  description: 'text',
  'location.park': 'text',
  tagline: 'text',
})

// ─── Virtual ─────────────────────────────────────────────────────────────────

SafariSchema.virtual('lowestPrice').get(function (this: ISafari) {
  type P = { budget: { pricePerPerson: number }; midRange: { pricePerPerson: number }; luxury: { pricePerPerson: number } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (this.pricing as unknown) as P
  return Math.min(p.budget.pricePerPerson, p.midRange.pricePerPerson, p.luxury.pricePerPerson)
})

const SafariModel: Model<ISafari> =
  mongoose.models.Safari || mongoose.model<ISafari>('Safari', SafariSchema)

export default SafariModel
