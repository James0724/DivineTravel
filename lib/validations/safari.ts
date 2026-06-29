import { z } from 'zod'

const HotelSchema = z.object({
  name:   z.string().min(2, 'Hotel name must be at least 2 characters'),
  rating: z.number().min(1, 'Star rating must be between 1 and 5').max(5, 'Star rating must be between 1 and 5'),
})

const PricingTierSchema = z.object({
  pricePerPerson:    z.number({ invalid_type_error: 'Enter a price per person' }).min(1, 'Price must be at least $1'),
  currency:          z.string().default('USD'),
  description:       z.string().min(10, 'Tier description must be at least 10 characters'),
  includes:          z.array(z.string()).min(1, 'Add at least one inclusion for this tier'),
  accommodationType: z.string().min(3, 'Accommodation type must be at least 3 characters'),
  hotels:            z.array(HotelSchema).optional(),
})

const ItineraryDaySchema = z.object({
  day: z.number().min(1),
  title: z.string().min(3, 'Day title must be at least 3 characters'),
  description: z.string().min(20, 'Day description must be at least 20 characters'),
  meals: z.array(z.string()),
  accommodation: z.string(),
  activities: z.array(z.string()),
})

const LocationSchema = z.object({
  country: z.string().optional(),
  countries: z.array(z.string().min(1)).min(1, 'Add at least one country'),
  region: z.string().optional(),
  regions: z.array(z.string().min(1)).default([]),
  park: z.string().optional(),
  parks: z.array(z.string().min(1)).min(1, 'Add at least one park or reserve'),
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
  duration: z.number().min(1, 'Duration must be at least 1 day').max(60, 'Duration cannot exceed 60 days'),
  highlights: z
    .array(z.string())
    .min(3, 'Add at least 3 highlights'),
  included: z.array(z.string()).min(1, 'Add at least 1 inclusion'),
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
      z.enum(['wildlife', 'adventure', 'cultural', 'beach', 'mountain', 'gorilla'], {
        errorMap: (issue, ctx) =>
          issue.code === 'invalid_enum_value'
            ? { message: `"${issue.received}" is not a valid category — remove it using the chip below the category list, then pick from the supported options` }
            : { message: ctx.defaultError },
      })
    )
    .min(1, 'Select at least one category'),
  safariType: z
    .array(
      z.enum(
        [
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
          'family',
          'honeymoon',
          'solo',
          'small-group',
          'couples',
          'private',
          'gorilla-trekking',
          'big-five',
          'great-migration',
          'luxury',
          'beach-and-bush',
        ],
        {
          errorMap: (issue, ctx) =>
            issue.code === 'invalid_enum_value'
              ? { message: `"${issue.received}" is not a valid safari type — remove it using the chip below the safari type lists, then pick from the supported options` }
              : { message: ctx.defaultError },
        }
      )
    )
    .min(1, 'Select at least one safari type'),
  difficulty: z.enum(['easy', 'moderate', 'challenging'], {
    errorMap: () => ({ message: 'Select a difficulty level' }),
  }),
  maxGroupSize: z.number().min(1, 'Max group size must be at least 1').max(100, 'Max group size cannot exceed 100'),
  minGroupSize: z.number().min(1, 'Min group size must be at least 1'),
  minAge: z.number().min(0, 'Minimum age cannot be negative').max(18, 'Minimum age cannot exceed 18'),
  bestSeason: z.array(z.string()).min(1, 'Select at least one best-season month'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  seo: z
    .object({
      metaTitle: z.string().max(60, 'Meta title must be 60 characters or fewer').optional(),
      metaDescription: z.string().max(160, 'Meta description must be 160 characters or fewer').optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
})

export type SafariFormValues = z.infer<typeof SafariSchema>
