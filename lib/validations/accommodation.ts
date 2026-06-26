import { z } from 'zod'

const AccommodationImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1),
  alt: z.string().default(''),
})

const LocationSchema = z.object({
  country: z.string().min(2, 'Country is required'),
  region: z.string().min(2, 'Region/area is required'),
})

export const AccommodationSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(150, 'Name cannot exceed 150 characters'),
  type: z.enum(['luxury-lodge', 'tented-camp', 'beach-resort'], {
    errorMap: () => ({ message: 'Select an accommodation type' }),
  }),
  location: LocationSchema,
  description: z.string().min(50, 'Description must be at least 50 characters'),
  highlights: z.array(z.string()).min(1, 'Add at least one highlight'),
  amenities: z.array(z.string()).default([]),
  coverImage: z.string().url().optional().or(z.literal('')),
  coverImagePublicId: z.string().optional().or(z.literal('')),
  images: z.array(AccommodationImageSchema).default([]),
  websiteUrl: z.string().url("Enter the property's website URL (https://...)"),
  priceTier: z.enum(['budget', 'midRange', 'luxury']).optional(),
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

export type AccommodationFormValues = z.infer<typeof AccommodationSchema>
