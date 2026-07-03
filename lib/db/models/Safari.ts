import mongoose, { Schema, Document, Model } from "mongoose";

export const SAFARI_TYPE_VALUES = [
  // Activity types
  "walking",
  "game-drive",
  "fly-in",
  "mobile-camping",
  "water-based",
  "horseback",
  "balloon",
  "self-drive",
  "photographic",
  "night",
  "birding",
  "wellness",
  "conservation",
  // Traveller types (kept for backward compat — hidden in admin UI)
  "family",
  "honeymoon",
  "solo",
  "small-group",
  "couples",
  "private",
  // Theme types (kept for backward compat — hidden in admin UI)
  "gorilla-trekking",
  "big-five",
  "great-migration",
  "luxury",
  "beach-and-bush",
] as const;

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const SafariImageSchema = new Schema(
  {
    url:      { type: String, required: true },
    publicId: { type: String, required: true },
    alt:      { type: String, default: "" },
    width:    Number,
    height:   Number,
  },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    country:  { type: String, default: "" },
    countries: [{ type: String }],
    region:   { type: String, default: "" },
    regions:  [{ type: String }],
    park:     { type: String, default: "" },
    parks:    [{ type: String }],
  },
  { _id: false },
);

const HotelSchema = new Schema(
  {
    name:     { type: String, required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    location: { type: LocationSchema, required: true },
  },
  { _id: false },
);

// One row in the pricing table (one season, group-size columns 2–6)
const SeasonalPriceRowSchema = new Schema(
  {
    seasonLabel: { type: String, default: "Standard Season" },
    dateRange:   { type: String, default: "" },
    per2: { type: Number, default: 0 },
    per3: { type: Number, default: 0 },
    per4: { type: Number, default: 0 },
    per5: { type: Number, default: 0 },
    per6: { type: Number, default: 0 },
  },
  { _id: false },
);

const PricingTierSchema = new Schema(
  {
    currency:         { type: String, default: "USD" },
    includes:         [{ type: String }],
    accommodationType: { type: String, default: "" },
    hotels:           [HotelSchema],
    rows:             [SeasonalPriceRowSchema],
    // Backward-compat fields — present on documents created before the
    // seasonal-table migration; no longer written by the admin form.
    pricePerPerson: { type: Number },
    description:    { type: String },
  },
  { _id: false },
);

const ItineraryDaySchema = new Schema(
  {
    day:           { type: Number, required: true },
    title:         { type: String, required: true },
    description:   { type: String, required: true },
    meals:         [{ type: String }],
    accommodation: { type: String, default: "" },
    activities:    [{ type: String }],
  },
  { _id: false },
);

const ItineraryStopSchema = new Schema(
  {
    order:         { type: Number, required: true },
    title:         { type: String, required: true },
    durationLabel: { type: String, required: true },
    description:   { type: String, required: true },
    activities:    [{ type: String }],
  },
  { _id: false },
);

const SeoSchema = new Schema(
  {
    metaTitle:       String,
    metaDescription: String,
    keywords:        [String],
  },
  { _id: false },
);

// ─── Main Schema ─────────────────────────────────────────────────────────────

export interface ISafari extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  location: {
    country: string;
    countries: string[];
    region: string;
    regions: string[];
    park: string;
    parks: string[];
  };
  duration: number;
  durationLabel?: string;
  tripLength: "multi-day" | "short";
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation: string;
    activities: string[];
  }[];
  itineraryStops: {
    order: number;
    title: string;
    durationLabel: string;
    description: string;
    activities: string[];
  }[];
  pricing: {
    budget:   { rows: { seasonLabel: string; dateRange?: string; per2: number; per3: number; per4: number; per5: number; per6: number }[]; currency: string; includes: string[]; accommodationType: string; pricePerPerson?: number; description?: string };
    midRange: { rows: { seasonLabel: string; dateRange?: string; per2: number; per3: number; per4: number; per5: number; per6: number }[]; currency: string; includes: string[]; accommodationType: string; pricePerPerson?: number; description?: string };
    luxury:   { rows: { seasonLabel: string; dateRange?: string; per2: number; per3: number; per4: number; per5: number; per6: number }[]; currency: string; includes: string[]; accommodationType: string; pricePerPerson?: number; description?: string };
  };
  images: { url: string; publicId: string; alt: string }[];
  coverImage: string;
  coverImagePublicId?: string;
  category: string[];
  safariType: string[];
  difficulty: string;
  maxGroupSize: number;
  minGroupSize: number;
  minAge: number;
  bestSeason: string[];
  featured: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  createdAt: Date;
  updatedAt: Date;
}

const SafariSchema = new Schema<ISafari>(
  {
    name: {
      type: String,
      required: [true, "Safari name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline:     { type: String, default: "" },
    description: { type: String, default: "" },
    location:    { type: LocationSchema, default: () => ({}) },
    duration: {
      type: Number,
      default: 1,
      min: [0.1, "Duration must be at least 0.1 days"],
    },
    durationLabel: { type: String, default: "" },
    tripLength: {
      type: String,
      enum: ["multi-day", "short"],
      default: "multi-day",
    },
    highlights:     [{ type: String }],
    included:       [{ type: String }],
    excluded:       [{ type: String }],
    itinerary:      [ItineraryDaySchema],
    itineraryStops: [ItineraryStopSchema],
    pricing: {
      budget:   { type: PricingTierSchema, default: () => ({}) },
      midRange: { type: PricingTierSchema, default: () => ({}) },
      luxury:   { type: PricingTierSchema, default: () => ({}) },
    },
    images:             [SafariImageSchema],
    coverImage:         { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    category: [
      {
        type: String,
        enum: ["wildlife", "adventure", "cultural", "beach", "mountain", "gorilla"],
      },
    ],
    safariType: [{ type: String, enum: SAFARI_TYPE_VALUES }],
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "challenging"],
      default: "moderate",
    },
    maxGroupSize: { type: Number, default: 12 },
    minGroupSize: { type: Number, default: 1 },
    minAge:       { type: Number, default: 5 },
    bestSeason:   [{ type: String }],
    featured:     { type: Boolean, default: false, index: true },
    active:       { type: Boolean, default: true,  index: true },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
    seo:          { type: SeoSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────

SafariSchema.index({ active: 1, featured: -1, rating: -1 });
SafariSchema.index({ "location.country": 1 });
SafariSchema.index({ "location.countries": 1 });
SafariSchema.index({ category: 1 });
SafariSchema.index({ safariType: 1 });
SafariSchema.index({ createdAt: -1 });
SafariSchema.index({
  name: "text",
  description: "text",
  "location.park": "text",
  tagline: "text",
});

// ─── Virtual ─────────────────────────────────────────────────────────────────

SafariSchema.virtual("lowestPrice").get(function (this: ISafari) {
  const prices: number[] = [];
  for (const tier of [this.pricing?.budget, this.pricing?.midRange, this.pricing?.luxury]) {
    if (!tier) continue;
    if (tier.rows?.length) {
      tier.rows.forEach((row) => {
        if (typeof row.per6 === "number" && row.per6 > 0) prices.push(row.per6);
      });
    } else if (typeof tier.pricePerPerson === "number" && tier.pricePerPerson > 0) {
      prices.push(tier.pricePerPerson);
    }
  }
  return prices.length ? Math.min(...prices) : 0;
});

const SafariModel: Model<ISafari> =
  mongoose.models.Safari || mongoose.model<ISafari>("Safari", SafariSchema);

export default SafariModel;
