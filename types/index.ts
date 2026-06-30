// ─── Safari ────────────────────────────────────────────────────────────────

export type SafariCategory =
  | "wildlife"
  | "adventure"
  | "cultural"
  | "beach"
  | "mountain"
  | "gorilla";

export type SafariDifficulty = "easy" | "moderate" | "challenging";

// Style of safari experience — distinct from `SafariCategory` (theme).
// Three dimensions stored in one array: activity (how), traveller (who),
// and theme (which Safari Collection it belongs to).
export type SafariStyle =
  // Activity types
  | "walking"
  | "game-drive"
  | "fly-in"
  | "mobile-camping"
  | "water-based"
  | "horseback"
  | "balloon"
  | "self-drive"
  | "photographic"
  | "night"
  | "birding"
  | "wellness"
  | "conservation"
  // Traveller types
  | "family"
  | "honeymoon"
  | "solo"
  | "small-group"
  | "couples"
  | "private"
  // Theme types (Safari Collections)
  | "gorilla-trekking"
  | "big-five"
  | "great-migration"
  | "luxury"
  | "beach-and-bush";

export type PriceTier = "budget" | "midRange" | "luxury";

export interface Hotel {
  name: string;
  rating: number; // 1–5
  /** Where this hotel sits — lets a safari package be matched to destinations/hotels in the same area. */
  location: SafariLocation;
}

export interface PricingTier {
  pricePerPerson: number;
  currency: string;
  description: string;
  includes: string[];
  accommodationType: string;
  hotels?: Hotel[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
  activities: string[];
}

export type SafariTripLength = "multi-day" | "short";

/** A segment of a `tripLength: "short"` safari — under a day, so it has no
 *  `day` number, just an order and a free-text duration ("9:00 - 11:00", "2 hrs"). */
export interface ItineraryStop {
  order: number;
  title: string;
  durationLabel: string;
  description: string;
  activities: string[];
}

export interface SafariLocation {
  country: string;
  countries: string[];
  region: string;
  regions: string[];
  park: string;
  parks: string[];
}

export interface Safari {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  location: SafariLocation;
  duration: number; // in days (fractional for short, sub-day trips)
  /** Free-text override for display, e.g. "3 Hours", "Half Day" — used instead of "{duration} days" when tripLength is "short". */
  durationLabel?: string;
  tripLength: SafariTripLength;
  highlights: string[];
  included: string[];
  excluded: string[];
  /** Day-numbered itinerary — populated when tripLength is "multi-day". */
  itinerary: ItineraryDay[];
  /** Hour/segment-based itinerary — populated when tripLength is "short". */
  itineraryStops: ItineraryStop[];
  pricing: {
    budget: PricingTier;
    midRange: PricingTier;
    luxury: PricingTier;
  };
  images: SafariImage[];
  coverImage: string;
  coverImagePublicId?: string;
  category: SafariCategory[];
  safariType: SafariStyle[];
  difficulty: SafariDifficulty;
  maxGroupSize: number;
  minGroupSize: number;
  minAge: number;
  bestSeason: string[];
  featured: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SafariImage {
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
}

// ─── Booking ────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface Booking {
  _id: string;
  safari: Safari | string;
  tier: PriceTier;
  // Guest details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber?: string;
  // Trip details
  groupSize: number;
  adultCount: number;
  childCount: number;
  preferredDate: string;
  alternateDate?: string;
  // Pricing
  pricePerPerson: number;
  totalPrice: number;
  currency: string;
  // Status
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  emergencyContact?: { name: string; phone: string };
  referralSource?: string;
  internalNotes?: string;
  bookingRef: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Testimonial ────────────────────────────────────────────────────────────

export interface Testimonial {
  _id: string;
  name: string;
  country: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  safari?: Safari | string;
  safariName?: string;
  featured: boolean;
  verified: boolean;
  createdAt: string;
}

// ─── Accommodation (Lodges / Tented Camps / Beach Resorts) ─────────────────

export type AccommodationType = "luxury-lodge" | "tented-camp" | "beach-resort";
export type AccommodationPriceTier = "budget" | "midRange" | "luxury";

export interface AccommodationImage {
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Accommodation {
  _id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  location: {
    country: string;
    region: string;
    /** Optional — specific park/reserve this property is near, used to match it to a `Destination`. */
    park?: string;
  };
  description: string;
  highlights: string[];
  amenities: string[];
  coverImage: string;
  coverImagePublicId?: string;
  images: AccommodationImage[];
  websiteUrl: string;
  priceTier?: AccommodationPriceTier;
  featured: boolean;
  active: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationFilters {
  search?: string;
  type?: AccommodationType;
  country?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

// ─── Destination (Parks / Reserves / Cities / Coastal Towns) ──────────────

export interface DestinationImage {
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface DestinationItinerary {
  /** e.g. "Half-Day Crater Floor Tour", "2-Day Gorilla Trek" */
  title: string;
  /** Free text — "Half Day" | "Full Day" | "2 Days" — no fixed day count */
  durationLabel: string;
  description: string;
  activities: string[];
}

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  location: {
    country: string;
    region?: string;
  };
  size: string;
  climaticConditions: string;
  majorAttractions: string[];
  wildlife?: string[];
  access: {
    byRoad?: string;
    byAir?: string;
  };
  bestTimeToVisit: string;
  activities: string[];
  blockquote: string;
  itineraries: DestinationItinerary[];
  images: DestinationImage[];
  coverImage: string;
  coverImagePublicId?: string;
  shortDescription: string;
  description: string;
  /** e.g. "National Reserve", "Conservancy" — shown next to the name on listing cards */
  subtitle?: string;
  /** Short marketing tag, e.g. "Big cats · Great Migration" */
  tag?: string;
  /** Short "best for" phrase, e.g. "Big cats & the Migration" */
  bestFor?: string;
  /** 3-5 short bullet phrases for listing cards — distinct from the majorAttractions fact sheet */
  highlights?: string[];
  /** Manual sort weight within the featured / non-featured groups on country listing pages */
  order?: number;
  featured: boolean;
  active: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface DestinationFilters {
  search?: string;
  country?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

// ─── Destination listing cards — country page featured/more parks ────────

export interface FeaturePark {
  id: string;
  num: string;
  name: string;
  subtitle: string;
  tag: string;
  image: string;
  desc: string;
  highlights: string[];
  bestFor: string;
  href: string;
  flip: boolean;
}

export interface CompactPark {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  image: string;
  desc: string;
  highlights: string[];
  bestFor: string;
  href: string;
}

// ─── User (Admin) ────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "editor" | "viewer";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Filters ────────────────────────────────────────────────────────────────

export interface SafariFilters {
  search?: string;
  category?: SafariCategory;
  safariType?: SafariStyle;
  difficulty?: SafariDifficulty;
  tier?: PriceTier;
  minDays?: number;
  maxDays?: number;
  featured?: boolean;
  country?: string;
  /** Destination name (e.g. "Nairobi National Park") — matched against
   *  location.park/parks/region/regions, not an exact field. */
  destination?: string;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "duration_asc";
  /** Round-robins results across countries (Kenya, Tanzania, Uganda, Rwanda, other)
   *  instead of fully grouping by country before truncating to `limit`. Use for
   *  capped preview lists (homepage sections, etc) — leave unset for the paginated
   *  /safaris catalogue, which intentionally groups by country across pages. */
  balanced?: boolean;
}

// ─── Form Types ─────────────────────────────────────────────────────────────

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber?: string;
  groupSize: number;
  adultCount: number;
  childCount: number;
  preferredDate: string;
  alternateDate?: string;
  tier: PriceTier;
  specialRequests?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  referralSource?: string;
  /** What the visitor was shown at submit time — informational only. */
  displayCurrency?: string;
  displayTotalPrice?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ─── Journal Post ───────────────────────────────────────────────────────────

export type PostCategory =
  | "migration"
  | "destinations"
  | "planning"
  | "wildlife"
  | "culture"
  | "conservation"
  | "photography"
  | "tips";

export interface PostAuthor {
  _id: string;
  name: string;
  avatar?: string;
  title?: string;
  bio?: string;
}

export interface JournalPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  /** Populated PostAuthor after migration; raw string name on legacy documents */
  author: PostAuthor | string;
  category: PostCategory;
  tags: string[];
  faqs?: { question: string; answer: string }[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  readingTime: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Journal Comments ───────────────────────────────────────────────────────

export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export interface AdminReply {
  body: string;
  repliedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  postSlug: string;
  parentId: string | null;
  name: string;
  email: string;
  body: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;
  subscribeToReplies: boolean;
  avatarUrl: string;
  adminReply: AdminReply | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalSafaris: number;
  activeSafaris: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalTestimonials: number;
}
