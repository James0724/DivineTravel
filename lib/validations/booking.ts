import { z } from 'zod'

export const BookingSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .min(7, 'Phone number is required')
      .regex(/^\+?[0-9\s\-().]+$/, 'Invalid phone number'),
    nationality: z.string().min(2, 'Nationality is required'),
    passportNumber: z.string().optional(),
    groupSize: z.number().min(1, 'At least 1 person required').max(50),
    adultCount: z.number().min(1, 'At least 1 adult required'),
    childCount: z.number().min(0).default(0),
    preferredDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid date')
      .refine(
        (d) => new Date(d) > new Date(),
        'Preferred date must be in the future'
      ),
    alternateDate: z.string().optional(),
    tier: z.enum(['budget', 'midRange', 'luxury'], {
      required_error: 'Please select a package tier',
    }),
    specialRequests: z.string().max(500).optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    referralSource: z.string().optional(),
  })
  .refine((data) => data.adultCount + data.childCount === data.groupSize, {
    message: 'Adult + child count must equal group size',
    path: ['groupSize'],
  })

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000),
})

export type BookingFormValues = z.infer<typeof BookingSchema>
export type ContactFormValues = z.infer<typeof ContactSchema>
