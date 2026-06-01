import { z } from 'zod'

export const TestimonialSchema = z.object({
  name:        z.string().min(2, 'Name is required').max(120),
  country:     z.string().min(2, 'Country is required').max(80),
  avatar:      z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  rating:      z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title:       z.string().min(5, 'Title must be at least 5 characters').max(120),
  body:        z.string().min(20, 'Review must be at least 20 characters').max(1000),
  safariName:  z.string().max(200).optional(),
  featured:    z.boolean().default(false),
  verified:    z.boolean().default(false),
})

export type TestimonialFormValues = z.infer<typeof TestimonialSchema>
