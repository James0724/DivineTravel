import mongoose, { Schema, Document, Model } from 'mongoose'
import { IMAGE_USAGES, type ImageUsage } from '@/lib/cloudinary'

export type { ImageUsage }

export interface IImage extends Document {
  url: string
  publicId: string
  alt: string
  title: string
  originalName: string
  width: number
  height: number
  format: string
  fileSize: number
  folder: string
  usage: ImageUsage
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

const ImageSchema = new Schema<IImage>(
  {
    url:          { type: String, required: true },
    publicId:     { type: String, required: true, unique: true, index: true },
    alt:          { type: String, default: '' },
    title:        { type: String, default: '' },
    originalName: { type: String, default: '' },
    width:        { type: Number },
    height:       { type: Number },
    format:       { type: String },
    fileSize:     { type: Number },
    folder:       { type: String, required: true },
    usage: {
      type: String,
      enum: IMAGE_USAGES,
      default: 'misc',
      index: true,
    },
    uploadedBy: { type: String, default: '' },
  },
  { timestamps: true }
)

ImageSchema.index({ createdAt: -1 })

const ImageModel: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema)

export default ImageModel
