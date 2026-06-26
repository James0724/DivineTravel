'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { CalendarDays, Users, ChevronDown } from 'lucide-react'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { BookingSchema, type BookingFormValues } from '@/lib/validations/booking'
import { useCreateBooking } from '@/hooks/useBooking'
import { getPriceTierLabel } from '@/lib/utils'
import { useCurrency } from '@/lib/currency/useCurrency'
import { convertPrice } from '@/lib/currency/convertPrice'
import type { Safari, PriceTier } from '@/types'

interface BookingFormProps {
  safari: Safari
  initialTier?: PriceTier
  onSuccess?: (bookingRef: string) => void
}

const tierOptions = [
  { value: 'budget', label: 'Budget' },
  { value: 'midRange', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
]

const nationalityOptions = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'KE', label: 'Kenya' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'OTHER', label: 'Other' },
]

const referralOptions = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'google', label: 'Google Search' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'friend', label: 'Friend / Family Referral' },
  { value: 'travel-agent', label: 'Travel Agent' },
  { value: 'repeat', label: 'Returning Guest' },
  { value: 'other', label: 'Other' },
]

export default function BookingForm({ safari, initialTier, onSuccess }: BookingFormProps) {
  const { mutateAsync, isPending } = useCreateBooking()
  const { displayPrice, currency, rates } = useCurrency()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      tier: initialTier ?? 'midRange',
      groupSize: 2,
      adultCount: 2,
      childCount: 0,
    },
  })

  const tier = watch('tier') as PriceTier
  const groupSize = watch('groupSize')
  const pricingData = safari.pricing[tier]
  const total = (pricingData?.pricePerPerson ?? 0) * (groupSize || 1)

  // Minimum date: tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const { amount: displayTotalPrice, currency: displayCurrency } = convertPrice(
        total,
        currency,
        rates
      )
      const res = await mutateAsync({
        ...data,
        safariId: safari._id,
        displayCurrency,
        displayTotalPrice,
      })
      toast.success('Booking request submitted! We\'ll confirm within 24 hours.')
      onSuccess?.(res.data?.bookingRef ?? '')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit booking')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      {/* Safari + Price Summary */}
      <div className="bg-bone-bg rounded-md p-4 border border-[rgba(23,22,18,0.1)]">
        <p className="font-serif text-lg font-semibold text-bone-ink">{safari.name}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-bone-ink/45 font-sans">Selected tier</p>
            <p className="text-sm font-sans font-semibold text-bone-ink capitalize">
              {getPriceTierLabel(tier)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-bone-ink/45 font-sans">Estimated total</p>
            <p className="font-serif text-2xl font-bold text-bone-clay">
              {displayPrice(total)}
            </p>
            <p className="text-xs text-bone-ink/40 font-sans">
              {displayPrice(pricingData?.pricePerPerson ?? 0)} × {groupSize || 1} pax
            </p>
          </div>
        </div>
      </div>

      {/* Tier selector */}
      <div>
        <p className="text-sm font-medium text-bone-ink/80 font-sans mb-2">
          Package Tier <span className="text-bone-clay">*</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {tierOptions.map((t) => {
            const isSelected = tier === t.value
            const p = safari.pricing[t.value as PriceTier]
            return (
              <label
                key={t.value}
                className={`cursor-pointer rounded border-2 p-3 text-center transition-all ${
                  isSelected
                    ? 'border-bone-forest bg-bone-forest/5'
                    : 'border-[rgba(23,22,18,0.15)] hover:border-bone-forest/40'
                }`}
              >
                <input
                  type="radio"
                  value={t.value}
                  {...register('tier')}
                  className="sr-only"
                />
                <p className="text-xs font-sans font-semibold text-bone-ink">{t.label}</p>
                <p className="text-sm font-serif font-bold text-bone-ink mt-1">
                  {displayPrice(p.pricePerPerson)}
                </p>
                <p className="text-xs text-bone-ink/40 font-sans">/ person</p>
              </label>
            )
          })}
        </div>
        {errors.tier && (
          <p className="text-xs text-red-600 mt-1 font-sans">{errors.tier.message}</p>
        )}
      </div>

      {/* Section: Guest Details */}
      <div>
        <h3 className="font-serif text-base font-semibold text-bone-ink mb-4 pb-2 border-b border-[rgba(23,22,18,0.1)]">
          Guest Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            required
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            placeholder="+1 234 567 8900"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Select
            label="Nationality"
            required
            options={nationalityOptions}
            placeholder="Select nationality"
            error={errors.nationality?.message}
            {...register('nationality')}
          />
          <Input
            label="Passport Number"
            placeholder="Optional"
            error={errors.passportNumber?.message}
            {...register('passportNumber')}
          />
        </div>
      </div>

      {/* Section: Trip Details */}
      <div>
        <h3 className="font-serif text-base font-semibold text-bone-ink mb-4 pb-2 border-b border-[rgba(23,22,18,0.1)]">
          Trip Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Input
            label="Group Size"
            type="number"
            required
            min={1}
            max={50}
            leftAddon={<Users size={14} />}
            error={errors.groupSize?.message}
            {...register('groupSize', { valueAsNumber: true })}
          />
          <Input
            label="Adults"
            type="number"
            required
            min={1}
            error={errors.adultCount?.message}
            {...register('adultCount', { valueAsNumber: true })}
          />
          <Input
            label="Children (under 12)"
            type="number"
            min={0}
            error={errors.childCount?.message}
            {...register('childCount', { valueAsNumber: true })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preferred Start Date"
            type="date"
            required
            min={minDate}
            leftAddon={<CalendarDays size={14} />}
            error={errors.preferredDate?.message}
            {...register('preferredDate')}
          />
          <Input
            label="Alternate Date (optional)"
            type="date"
            min={minDate}
            leftAddon={<CalendarDays size={14} />}
            {...register('alternateDate')}
          />
        </div>
      </div>

      {/* Special Requests */}
      <Textarea
        label="Special Requests or Dietary Requirements"
        placeholder="Let us know about allergies, accessibility needs, celebrations, etc."
        rows={3}
        error={errors.specialRequests?.message}
        {...register('specialRequests')}
      />

      {/* Emergency contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Emergency Contact Name"
          placeholder="Jane Doe"
          {...register('emergencyContactName')}
        />
        <Input
          label="Emergency Contact Phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register('emergencyContactPhone')}
        />
      </div>

      {/* Referral */}
      <Select
        label="How did you hear about us?"
        options={referralOptions}
        {...register('referralSource')}
      />

      {/* Disclaimer */}
      <p className="text-xs text-bone-ink/45 leading-relaxed font-sans">
        By submitting this form you agree to our{' '}
        <a href="/booking-conditions" className="underline hover:text-bone-ink/70">
          Booking Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-bone-ink/70">
          Privacy Policy
        </a>
        . A deposit of 30% is required to confirm your booking.
      </p>

      <Button type="submit" variant="clay" size="lg" fullWidth loading={isPending}>
        Submit Booking Request
      </Button>
    </motion.form>
  )
}
