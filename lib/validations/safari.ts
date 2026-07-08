import { z } from 'zod'

const HotelLocationSchema = z.object({
  country: z.string().optional().default(''),
  countries: z.array(z.string()).optional().default([]),
  region: z.string().optional().default(''),
  regions: z.array(z.string()).optional().default([]),
  park: z.string().optional().default(''),
  parks: z.array(z.string()).optional().default([]),
})

const HotelSchema = z.object({
  name:   z.string().min(1, 'Hotel name is required'),
  rating: z.number().min(1).max(5),
  location: HotelLocationSchema,
})

// One row of the pricing table (one season, five group-size columns)
export const SeasonalPriceRowSchema = z.object({
  seasonLabel: z.string().default('Standard Season'),
  dateRange:   z.string().optional().default(''),
  per1: z.number({ invalid_type_error: 'Enter a price' }).min(0).optional().default(0),
  per2: z.number({ invalid_type_error: 'Enter a price' }).min(0),
  per3: z.number({ invalid_type_error: 'Enter a price' }).min(0),
  per4: z.number({ invalid_type_error: 'Enter a price' }).min(0),
  per5: z.number({ invalid_type_error: 'Enter a price' }).min(0),
  per6: z.number({ invalid_type_error: 'Enter a price' }).min(0),
})

const PricingTierSchema = z.object({
  currency:          z.string().default('USD'),
  includes:          z.array(z.string()).default([]),
  accommodationType: z.string().default(''),
  hotels:            z.array(HotelSchema).optional(),
  rows:              z.array(SeasonalPriceRowSchema).default([]),
})

const ItineraryDaySchema = z.object({
  day:           z.number().min(1),
  title:         z.string().min(1, 'Day title is required'),
  description:   z.string().min(1, 'Day description is required'),
  meals:         z.array(z.string()),
  accommodation: z.string(),
  activities:    z.array(z.string()),
})

const ItineraryStopSchema = z.object({
  order:         z.number().min(1),
  title:         z.string().min(1, 'Stop title is required'),
  durationLabel: z.string().min(1, 'Add a duration label, e.g. "2 hrs" or "9:00 - 11:00"'),
  description:   z.string().min(1, 'Stop description is required'),
  activities:    z.array(z.string()),
})

const LocationSchema = z.object({
  country:   z.string().optional(),
  countries: z.array(z.string().min(1)).min(1, 'Add at least one country'),
  region:    z.string().optional(),
  regions:   z.array(z.string().min(1)).default([]),
  park:      z.string().optional(),
  parks:     z.array(z.string().min(1)).min(1, 'Add at least one park or reserve'),
})

export const SafariSchema = z.object({
  name:        z.string().min(1, 'Safari name is required'),
  tagline:     z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  location:    LocationSchema,
  // Fractional days allow "short" (sub-day) safaris — e.g. 0.25 for a 6-hour tour.
  duration:      z.number().min(0.1, 'Duration must be at least 0.1 days').max(60),
  durationLabel: z.string().min(1, 'Enter a duration, e.g. "7 days" or "6 hrs"'),
  tripLength:    z.enum(['multi-day', 'short'], {
    errorMap: () => ({ message: 'Select a trip length' }),
  }).default('multi-day'),
  highlights:      z.array(z.string()).default([]),
  included:        z.array(z.string()),
  excluded:        z.array(z.string()),
  bestTimeToVisit: z.array(z.string()).default([]),
  whyChoose:       z.array(z.string()).default([]),
  itinerary:       z.array(ItineraryDaySchema).default([]),
  itineraryStops:  z.array(ItineraryStopSchema).default([]),
  pricing: z.object({
    budget:   PricingTierSchema,
    midRange: PricingTierSchema,
    luxury:   PricingTierSchema,
  }),
  // All 24 type values kept in the enum for backward compat with existing data.
  // The admin UI only surfaces the 13 activity types now; traveller/theme
  // chips are no longer shown but remain valid so old records don't break.
  safariType: z
    .array(
      z.enum(
        [
          'walking', 'game-drive', 'fly-in', 'mobile-camping', 'water-based',
          'horseback', 'balloon', 'self-drive', 'photographic', 'night',
          'birding', 'wellness', 'conservation', 'cultural', 'adventure',
          'family', 'honeymoon', 'solo', 'small-group', 'couples', 'private',
          'gorilla-trekking', 'big-five', 'great-migration', 'luxury', 'beach-and-bush',
        ],
        {
          errorMap: (issue, ctx) =>
            issue.code === 'invalid_enum_value'
              ? { message: `"${issue.received}" is not a valid safari type — remove it then pick from the supported options` }
              : { message: ctx.defaultError },
        }
      )
    )
    .min(1, 'Select at least one safari type'),
  difficulty: z.enum(['easy', 'moderate', 'challenging'], {
    errorMap: () => ({ message: 'Select a difficulty level' }),
  }),
  maxGroupSize: z.number().min(1).max(100),
  minGroupSize: z.number().min(1),
  minAge:       z.number().min(0).max(18),
  bestSeason:   z.array(z.string()).min(1, 'Select at least one best-season month'),
  featured:     z.boolean().default(false),
  active:       z.boolean().default(true),
  seo: z
    .object({
      metaTitle:       z.string().max(60, 'Meta title must be 60 characters or fewer').optional(),
      metaDescription: z.string().max(160, 'Meta description must be 160 characters or fewer').optional(),
      keywords:        z.array(z.string()).optional(),
    })
    .optional(),
}).superRefine((data, ctx) => {
  if (data.tripLength === 'multi-day' && data.itinerary.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Add at least 1 itinerary day',
      path: ['itinerary'],
    })
  }
  if (data.tripLength === 'short' && data.itineraryStops.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Add at least 1 itinerary stop',
      path: ['itineraryStops'],
    })
  }
  // Pricing tier validation depends on trip type
  if (data.tripLength === 'multi-day') {
    (['budget', 'midRange', 'luxury'] as const).forEach((tier) => {
      const t = data.pricing[tier]
      if (!t?.accommodationType?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Accommodation type is required', path: ['pricing', tier, 'accommodationType'] })
      if (!t?.includes?.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Add at least one inclusion for this tier', path: ['pricing', tier, 'includes'] })
      if (!t?.rows?.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Add at least one pricing row', path: ['pricing', tier, 'rows'] })
    })
  } else if (data.tripLength === 'short') {
    if (!data.pricing.budget.rows?.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Add at least one pricing row for this safari', path: ['pricing', 'budget', 'rows'] })
    }
  }
})

export type SafariFormValues = z.infer<typeof SafariSchema>
