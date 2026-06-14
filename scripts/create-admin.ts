/**
 * Create / reset the admin user — safe to run multiple times.
 * Usage:  npm run create-admin
 *
 * Does NOT touch safaris, bookings or testimonials.
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local')
  process.exit(1)
}

// Minimal inline schema so we don't pull in Next.js module resolution
const UserSchema = new mongoose.Schema(
  {
    name:      String,
    email:     { type: String, unique: true, lowercase: true, trim: true },
    password:  String,
    role:      { type: String, default: 'admin' },
    avatar:    String,
    bio:       String,
    active:    { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
)

const User = mongoose.models.User ?? mongoose.model('User', UserSchema)

async function main() {
  const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'info@divinetravelnestsafaris.com'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'DivineSafari#2026!'

  console.log('🔌  Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('✅  Connected\n')

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)

  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      $set: {
        name:     'Janet Wanjiru',
        email:    ADMIN_EMAIL,
        password: hash,
        role:     'admin',
        bio:      'CEO of Divine Travel Nest Safaris, with deep expertise in luxury and tailor-made East Africa safari experiences across Kenya, Tanzania, Rwanda and Uganda. Janet leads our team of expert consultants and is passionate about authentic, conservation-conscious travel.',
        active:   true,
      },
    },
    { upsert: true, new: true }
  )

  console.log('👤  Admin user created / updated successfully')
  console.log(`    Email   : ${ADMIN_EMAIL}`)
  console.log(`    Password: ${ADMIN_PASSWORD}`)
  console.log('\n🎉  Go to /admin/login and sign in!')

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌  Failed:', err.message ?? err)
  process.exit(1)
})
