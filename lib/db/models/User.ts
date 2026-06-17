import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  avatar?: string
  title?: string
  bio?: string
  active: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor', 'viewer'],
      default: 'editor',
    },
    avatar: String,
    title: String,
    bio: {
      type: String,
      default: 'Expert safari consultant at Divine Travel Nest Safaris, with extensive on-the-ground experience across Kenya, Tanzania, Rwanda and Uganda',
    },
    active: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

delete (mongoose.models as Record<string, unknown>).User;
const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
