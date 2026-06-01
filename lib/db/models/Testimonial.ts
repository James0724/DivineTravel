import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  country: string
  avatar?: string
  avatarPublicId?: string
  rating: number
  title: string
  body: string
  safari?: mongoose.Types.ObjectId
  safariName?: string
  featured: boolean
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    avatar: String,
    avatarPublicId: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 120 },
    body: { type: String, required: true, maxlength: 1000 },
    safari: { type: Schema.Types.ObjectId, ref: 'Safari' },
    safariName: String,
    featured: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

TestimonialSchema.index({ featured: 1, createdAt: -1 })
TestimonialSchema.index({ rating: -1 })

const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export default TestimonialModel
