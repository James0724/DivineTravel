// ─── Safari ────────────────────────────────────────────────────────────────

export type SafariCategory =
  | 'wildlife'
  | 'adventure'
  | 'cultural'
  | 'beach'
  | 'mountain'
  | 'gorilla'

export type SafariDifficulty = 'easy' | 'moderate' | 'challenging'

// Style of safari experience — distinct from `SafariCategory` (theme).
// Two dimensions stored in one array: activity (how) and traveller (who).
export type SafariStyle =
  // Activity types
  | 'walking'
  | 'game-drive'
  | 'fly-in'
  | 'mobile-camping'
  | 'water-based'
  | 'horseback'
  | 'balloon'
  | 'self-drive'
  | 'photographic'
  | 'night'
  | 'birding'
  | 'wellness'
  | 'conservation'
  // Traveller types
  | 'family'
  | 'honeymoon'
  | 'solo'
  | 'small-group'
  | 'couples'
  | 'private'

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
  countries: string[]
  region: string
  regions: string[]
  park: string
  parks: string[]
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
  safariType: SafariStyle[]
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

// ─── Accommodation (Lodges / Tented Camps / Beach Resorts) ─────────────────

export type AccommodationType = 'luxury-lodge' | 'tented-camp' | 'beach-resort'
export type AccommodationPriceTier = 'budget' | 'midRange' | 'luxury'

export interface AccommodationImage {
  url: string
  publicId: string
  alt: string
  width?: number
  height?: number
}

export interface Accommodation {
  _id: string
  name: string
  slug: string
  type: AccommodationType
  location: {
    country: string
    region: string
  }
  description: string
  highlights: string[]
  amenities: string[]
  coverImage: string
  coverImagePublicId?: string
  images: AccommodationImage[]
  websiteUrl: string
  priceTier?: AccommodationPriceTier
  featured: boolean
  active: boolean
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface AccommodationFilters {
  search?: string
  type?: AccommodationType
  country?: string
  featured?: boolean
  page?: number
  limit?: number
}

// ─── User (Admin) ────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

export interface AdminUser {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
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
  safariType?: SafariStyle
  difficulty?: SafariDifficulty
  tier?: PriceTier
  minDays?: number
  maxDays?: number
  featured?: boolean
  country?: string
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'duration_asc'
  /** Round-robins results across countries (Kenya, Tanzania, Uganda, Rwanda, other)
   *  instead of fully grouping by country before truncating to `limit`. Use for
   *  capped preview lists (homepage sections, etc) — leave unset for the paginated
   *  /safaris catalogue, which intentionally groups by country across pages. */
  balanced?: boolean
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
  /** What the visitor was shown at submit time — informational only. */
  displayCurrency?: string
  displayTotalPrice?: number
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// ─── Journal Post ───────────────────────────────────────────────────────────

export type PostCategory =
  | 'migration'
  | 'destinations'
  | 'planning'
  | 'wildlife'
  | 'culture'
  | 'conservation'
  | 'photography'
  | 'tips'

export interface PostAuthor {
  _id: string
  name: string
  avatar?: string
  title?: string
  bio?: string
}

export interface JournalPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  coverImage: string
  /** Populated PostAuthor after migration; raw string name on legacy documents */
  author: PostAuthor | string
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

// ─── Journal Comments ───────────────────────────────────────────────────────

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
