import { z } from 'zod'

const PricingTierSchema = z.object({
  pricePerPerson: z.number().min(1, 'Price must be at least $1'),
  currency: z.string().default('USD'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  includes: z.array(z.string()).min(1, 'Add at least one inclusion'),
  accommodationType: z.string().min(3, 'Accommodation type is required'),
})

const ItineraryDaySchema = z.object({
  day: z.number().min(1),
  title: z.string().min(3),
  description: z.string().min(20),
  meals: z.array(z.string()),
  accommodation: z.string(),
  activities: z.array(z.string()),
})

const LocationSchema = z.object({
  country: z.string().min(2, 'Country is required'),
  region: z.string().min(2, 'Region is required'),
  park: z.string().min(2, 'Park/Reserve is required'),
  coordinates: z
    .object({ lat: z.number(), lng: z.number() })
    .optional(),
})

export const SafariSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  tagline: z
    .string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: LocationSchema,
  duration: z.number().min(1, 'Duration must be at least 1 day').max(60),
  highlights: z
    .array(z.string())
    .min(3, 'Add at least 3 highlights'),
  included: z.array(z.string()).min(1),
  excluded: z.array(z.string()),
  itinerary: z
    .array(ItineraryDaySchema)
    .min(1, 'Add at least 1 itinerary day'),
  pricing: z.object({
    budget: PricingTierSchema,
    midRange: PricingTierSchema,
    luxury: PricingTierSchema,
  }),
  category: z
    .array(
      z.enum(['wildlife', 'adventure', 'cultural', 'beach', 'mountain', 'gorilla'])
    )
    .min(1, 'Select at least one category'),
  difficulty: z.enum(['easy', 'moderate', 'challenging']),
  maxGroupSize: z.number().min(1).max(100),
  minGroupSize: z.number().min(1),
  minAge: z.number().min(0).max(18),
  bestSeason: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  seo: z
    .object({
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
})

export type SafariFormValues = z.infer<typeof SafariSchema>
