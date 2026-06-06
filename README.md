# Divine Travel Nest Safaris — Full-Stack Next.js Application

A production-ready safari booking platform with public frontend, REST API, and admin panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v4 (JWT, Credentials) |
| Images | Cloudinary (structured folders) |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Carousel | Embla Carousel |

## Project Structure

```
divine-travel-nest-safaris/
├── app/
│   ├── (public)/          # Public-facing routes (no auth required)
│   │   ├── page.tsx       # Home
│   │   ├── safaris/       # Safari listing + detail
│   │   ├── about/
│   │   └── contact/
│   ├── (admin)/           # Auth-protected admin panel
│   │   └── admin/
│   │       ├── page.tsx   # Dashboard
│   │       ├── safaris/   # Safari CRUD
│   │       ├── bookings/  # Booking management
│   │       └── testimonials/
│   ├── admin/login/       # Login page (outside auth group)
│   ├── api/               # REST API routes
│   │   ├── safaris/
│   │   ├── bookings/
│   │   ├── testimonials/
│   │   ├── upload/
│   │   ├── contact/
│   │   └── auth/
│   ├── sitemap.ts         # Auto-generated sitemap
│   └── robots.ts
├── components/
│   ├── ui/                # Base components (Button, Card, Input, Badge, Skeleton…)
│   ├── layout/            # Navbar, Footer, AdminSidebar
│   ├── home/              # Hero, Stats, FeaturedSafaris, WhyChooseUs, Testimonials
│   ├── safaris/           # SafariCard, PricingTiers, SafariFilters
│   ├── forms/             # BookingForm, ContactForm
│   └── seo/               # JSON-LD structured data
├── lib/
│   ├── db/
│   │   ├── mongoose.ts    # DB connection with caching
│   │   └── models/        # Safari, Booking, Testimonial, User
│   ├── cloudinary.ts      # Upload helpers + folder constants
│   ├── utils.ts           # Shared utilities
│   └── validations/       # Zod schemas
├── store/                 # Zustand stores
├── hooks/                 # TanStack Query hooks
├── types/                 # TypeScript interfaces
└── scripts/seed.ts        # Database seed script
```

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in:
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed the database
```bash
npm run seed
```
This seeds 6 fully-detailed safaris, 8 testimonials, and an admin user.

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

Default admin credentials:
- Email: `admin@divinetravelnest.com`
- Password: `Admin@2025!`

## Cloudinary Folder Structure

Images are stored in well-organised Cloudinary folders:

```
divine-travel-nest-safaris/
├── safaris/
│   ├── {safari-slug}/     # Safari gallery images
├── blog/                  # Blog post images
├── testimonials/          # Guest avatar photos
├── team/                  # Staff photos
└── misc/                  # General site assets
```

## Safari Pricing Tiers

Every safari has three tiers with distinct pricing, accommodation, and inclusions:

| Tier | Accommodation | Typical Price Range |
|---|---|---|
| **Budget** | Tented camps, shared facilities | $1,150–$3,200 / person |
| **Mid-Range** | En-suite lodges, private vehicle | $2,100–$4,800 / person |
| **Luxury** | Exclusive camps, butler, pool | $4,800–$9,200 / person |

## SEO Features

- Metadata API (title templates, OG, Twitter cards)
- JSON-LD structured data (Organization, TouristAttraction, Breadcrumb, FAQ)
- Auto-generated sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- `generateKeywords()` helper for safari pages
- Semantic HTML throughout

## Admin Panel Features

- **Dashboard**: Key metrics, recent bookings, quick actions
- **Safari CRUD**: Create/edit/delete safaris with full pricing tiers
- **Bookings**: View all bookings, update status and payment inline
- **Testimonials**: Manage guest reviews, feature/unfeature
- **Image Upload**: Cloudinary integration with folder routing

## Design Tokens

```
bg: #ece6da      (bone background)
paper: #f4efe2   (surface / cards)
ink: #171612     (text)
forest: #1a2e1a  (primary / nav)
clay: #9d4519    (accent / CTA)

Font Serif: Cormorant Garamond
Font Body:  Geist
```
