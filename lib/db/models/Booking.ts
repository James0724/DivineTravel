import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBooking extends Document {
  safari: mongoose.Types.ObjectId
  tier: 'budget' | 'midRange' | 'luxury'
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  passportNumber?: string
  groupSize: number
  adultCount: number
  childCount: number
  preferredDate: Date
  alternateDate?: Date
  pricePerPerson: number
  totalPrice: number
  currency: string
  /** What the visitor was shown at submit time — informational only, never used in revenue math (always USD-authoritative via pricePerPerson/totalPrice/currency above). */
  displayCurrency?: string
  displayTotalPrice?: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded'
  specialRequests?: string
  emergencyContact?: { name: string; phone: string }
  referralSource?: string
  internalNotes?: string
  bookingRef: string
  createdAt: Date
  updatedAt: Date
}

const EmergencyContactSchema = new Schema(
  { name: String, phone: String },
  { _id: false }
)

const BookingSchema = new Schema<IBooking>(
  {
    safari: {
      type: Schema.Types.ObjectId,
      ref: 'Safari',
      required: [true, 'Safari reference is required'],
      index: true,
    },
    tier: {
      type: String,
      enum: ['budget', 'midRange', 'luxury'],
      required: true,
    },
    // Guest
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    nationality: { type: String, required: true },
    passportNumber: String,
    // Trip
    groupSize: { type: Number, required: true, min: 1, max: 50 },
    adultCount: { type: Number, required: true, min: 1 },
    childCount: { type: Number, default: 0 },
    preferredDate: { type: Date, required: true, index: true },
    alternateDate: Date,
    // Pricing
    pricePerPerson: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    displayCurrency: String,
    displayTotalPrice: Number,
    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid',
    },
    specialRequests: String,
    emergencyContact: EmergencyContactSchema,
    referralSource: String,
    internalNotes: String,
    bookingRef: {
      type: String,
      unique: true,
      default: () =>
        `ACS-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .slice(2, 6)
          .toUpperCase()}`,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

BookingSchema.index({ status: 1, createdAt: -1 })
BookingSchema.index({ preferredDate: 1, status: 1 })

BookingSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

const BookingModel: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)

export default BookingModel
