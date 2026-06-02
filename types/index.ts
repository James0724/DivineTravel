// ─── Safari ────────────────────────────────────────────────────────────────

export type SafariCategory =
  | 'wildlife'
  | 'adventure'
  | 'cultural'
  | 'beach'
  | 'mountain'
  | 'gorilla'

export type SafariDifficulty = 'easy' | 'moderate' | 'challenging'

export type PriceTier = 'budget' | 'midRange' | 'luxury'

export interface Hotel {
  name: string
  rating: number // 1–5
}

export interface PricingTier {
  pricePerPerson: number
  currency: string
  description: string
  includes: string[]
  accommodationType: string
  hotels?: Hotel[]
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  meals: string[]
  accommodation: string
  activities: string[]
}

export interface SafariLocation {
  country: string
  countries?: string[]
  region: string
  park: string
  parks?: string[]
  coordinates?: { lat: number; lng: number }
}

export interface Safari {
  _id: string
  name: string
  slug: string
  tagline: string
  description: string
  location: SafariLocation
  duration: number // in days
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: ItineraryDay[]
  pricing: {
    budget: PricingTier
    midRange: PricingTier
    luxury: PricingTier
  }
  images: SafariImage[]
  coverImage: string
  coverImagePublicId?: string
  category: SafariCategory[]
  difficulty: SafariDifficulty
  maxGroupSize: number
  minGroupSize: number
  minAge: number
  bestSeason: string[]
  featured: boolean
  active: boolean
  rating: number
  reviewCount: number
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface SafariImage {
  url: string
  publicId: string
  alt: string
  width?: number
  height?: number
}

// ─── Booking ────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'

export interface Booking {
  _id: string
  safari: Safari | string
  tier: PriceTier
  // Guest details
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  passportNumber?: string
  // Trip details
  groupSize: number
  adultCount: number
  childCount: number
  preferredDate: string
  alternateDate?: string
  // Pricing
  pricePerPerson: number
  totalPrice: number
  currency: string
  // Status
  status: BookingStatus
  paymentStatus: PaymentStatus
  specialRequests?: string
  emergencyContact?: { name: string; phone: string }
  referralSource?: string
  internalNotes?: string
  bookingRef: string
  createdAt: string
  updatedAt: string
}

// ─── Testimonial ────────────────────────────────────────────────────────────

export interface Testimonial {
  _id: string
  name: string
  country: string
  avatar?: string
  rating: number
  title: string
  body: string
  safari?: Safari | string
  safariName?: string
  featured: boolean
  verified: boolean
  createdAt: string
}

// ─── User (Admin) ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface AdminUser {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  active: boolean
  lastLogin?: string
  createdAt: string
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ─── Filters ────────────────────────────────────────────────────────────────

export interface SafariFilters {
  search?: string
  category?: SafariCategory
  difficulty?: SafariDifficulty
  tier?: PriceTier
  minDays?: number
  maxDays?: number
  featured?: boolean
  country?: string
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'duration_asc'
}

// ─── Form Types ─────────────────────────────────────────────────────────────

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  passportNumber?: string
  groupSize: number
  adultCount: number
  childCount: number
  preferredDate: string
  alternateDate?: string
  tier: PriceTier
  specialRequests?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  referralSource?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// ─── Blog Post ──────────────────────────────────────────────────────────────

export type PostCategory =
  | 'migration'
  | 'destinations'
  | 'planning'
  | 'wildlife'
  | 'culture'
  | 'conservation'
  | 'photography'
  | 'tips'

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  coverImage: string
  author: string
  authorAvatar?: string
  authorTitle?: string
  authorBio?: string
  category: PostCategory
  tags: string[]
  faqs?: { question: string; answer: string }[]
  featured: boolean
  published: boolean
  publishedAt?: string
  readingTime: number
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

// ─── Blog Comments ──────────────────────────────────────────────────────────

export type CommentStatus = "pending" | "approved" | "rejected" | "spam"

export interface AdminReply {
  body: string
  repliedAt: string
}

export interface Comment {
  _id: string
  postId: string
  postSlug: string
  parentId: string | null
  name: string
  email: string
  body: string
  status: CommentStatus
  ipAddress?: string
  userAgent?: string
  subscribeToReplies: boolean
  avatarUrl: string
  adminReply: AdminReply | null
  createdAt: string
  updatedAt: string
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalSafaris: number
  activeSafaris: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  totalRevenue: number
  monthlyRevenue: number
  averageRating: number
  totalTestimonials: number
}
