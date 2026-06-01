/**
 * Acacia Safaris — Database Seed Script
 * Usage: npm run seed
 *
 * Seeds:
 *  - 1 admin user
 *  - 6 fully-detailed safaris (Budget / Mid-Range / Luxury pricing)
 *  - 8 testimonials
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env.local')

// ─── Models ───────────────────────────────────────────────────────────────────

const PricingTierSchema = new mongoose.Schema({
  pricePerPerson: Number, currency: { type: String, default: 'USD' },
  description: String, includes: [String], accommodationType: String,
}, { _id: false })

const SafariSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, tagline: String,
  description: String,
  location: { country: String, region: String, park: String, coordinates: { lat: Number, lng: Number } },
  duration: Number, highlights: [String], included: [String], excluded: [String],
  itinerary: [{ day: Number, title: String, description: String, meals: [String], accommodation: String, activities: [String] }],
  pricing: { budget: PricingTierSchema, midRange: PricingTierSchema, luxury: PricingTierSchema },
  images: [{ url: String, publicId: String, alt: String }],
  coverImage: String, category: [String], difficulty: String,
  maxGroupSize: Number, minGroupSize: Number, minAge: Number,
  bestSeason: [String], featured: Boolean, active: Boolean,
  rating: Number, reviewCount: Number,
  seo: { metaTitle: String, metaDescription: String, keywords: [String] },
}, { timestamps: true })

const TestimonialSchema = new mongoose.Schema({
  name: String, country: String, avatar: String, rating: Number,
  title: String, body: String, safariName: String, featured: Boolean, verified: Boolean,
}, { timestamps: true })

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: String, active: Boolean,
}, { timestamps: true })

const Safari = mongoose.models.Safari || mongoose.model('Safari', SafariSchema)
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
const User = mongoose.models.User || mongoose.model('User', UserSchema)

// ─── Safari data ──────────────────────────────────────────────────────────────

const safaris = [
  {
    name: 'Great Wildebeest Migration Safari',
    slug: 'great-wildebeest-migration-safari',
    tagline: 'Witness one of nature\'s greatest spectacles — millions of wildebeest thundering across the Mara River',
    description: 'The Great Wildebeest Migration is the world\'s largest overland animal migration, with over 1.5 million wildebeest, 400,000 zebra and 200,000 gazelle making their annual 1,800 km circular journey between Tanzania\'s Serengeti and Kenya\'s Masai Mara. This iconic 7-day safari puts you front-row for river crossings, predator action, and breathtaking savanna panoramas. Our expert guides know the migration patterns intimately, maximising every wildlife moment.',
    location: { country: 'Kenya', region: 'Rift Valley', park: 'Masai Mara National Reserve', coordinates: { lat: -1.5, lng: 35.1 } },
    duration: 7,
    highlights: [
      'Witness dramatic Mara River wildebeest crossings',
      'Big Five sightings in prime game-drive territory',
      'Professional naturalist guide with 10+ years Mara experience',
      'Sunrise and sundowner game drives',
      'Visit a Maasai village for authentic cultural exchange',
      'Hot air balloon safari option (luxury)',
      'Cheetah and wild dog tracking in open savanna',
    ],
    included: [
      'All accommodation (see tier)',
      'Full board meals throughout',
      'Professional KATO-licensed guide',
      'All park and conservancy fees',
      'Game drives in 4×4 Land Cruiser',
      'Airport/airstrip transfers',
      'Bottled water in vehicle',
      'Emergency evacuation insurance',
    ],
    excluded: [
      'International flights',
      'Kenya visa ($51 USD)',
      'Travel insurance (required)',
      'Hot air balloon safari ($450/person)',
      'Gratuities (suggested $15/person/day)',
      'Personal items & laundry',
    ],
    itinerary: [
      { day: 1, title: 'Nairobi → Masai Mara', description: 'Morning briefing at your Nairobi hotel. Depart via the Great Rift Valley escarpment with a stop for panoramic views. Arrive at camp in time for afternoon game drive. Enjoy welcome dinner around the campfire.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Afternoon game drive', 'Sundowner drinks', 'Welcome dinner'] },
      { day: 2, title: 'Full Day Masai Mara Game Drive', description: 'Predawn wake-up for a sunrise game drive when lions return from night hunts. Morning on the Mara Plains tracking cheetah, elephant herds and the resident lion pride. Afternoon exploration near the Mara River in anticipation of wildebeest crossings.', meals: ['Breakfast', 'Bush Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Sunrise game drive', 'Lion tracking', 'Bush picnic lunch', 'Mara River reconnaissance'] },
      { day: 3, title: 'Mara River Crossings', description: 'Position yourselves near the best crossing points. Experienced drivers and guides know where the herds will charge into the crocodile-infested waters. This can last several hours — pure adrenaline. Afternoon: explore Northern Mara for elephant and giraffe.', meals: ['Breakfast', 'Lunch box', 'Dinner'], accommodation: 'See tier', activities: ['Full-day crossing vigil', 'Predator tracking', 'Giraffe herds'] },
      { day: 4, title: 'Masai Village & Afternoon Drive', description: 'Morning game drive in Mara Triangle. Mid-morning visit to an authentic Maasai manyatta — meet the moran warriors, learn about traditional medicine, see the beadwork cooperatives that directly fund community conservation.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Maasai village visit', 'Beadwork cooperative', 'Afternoon game drive'] },
      { day: 5, title: 'Balloon Safari Option / Full Day Drive', description: 'Optional pre-dawn hot air balloon (extra cost) drifting over the plains at sunrise followed by bush breakfast. For non-balloon guests: full day exploring the southern Mara ecosystem with picnic lunch in the bush.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Optional balloon safari', 'Bush breakfast', 'Full day game drive', 'Picnic lunch'] },
      { day: 6, title: 'Last Full Day — Big Five Focus', description: 'Dedicated Big Five quest. Your guide pinpoints rhino locations in Mara North Conservancy where black rhino sightings are possible. Buffalo herd tracking along the Talek River. Final sundowner on the plains.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Rhino tracking', 'Buffalo herds', 'Final sundowner', 'Farewell dinner'] },
      { day: 7, title: 'Masai Mara → Nairobi', description: 'Early morning final game drive. Leisurely breakfast before departing for Nairobi arriving early afternoon — connecting with onward flights or transfer to Nairobi hotel.', meals: ['Breakfast'], accommodation: 'Nairobi hotel (own cost)', activities: ['Final morning game drive', 'Return journey via Rift Valley viewpoint'] },
    ],
    pricing: {
      budget: {
        pricePerPerson: 1650, currency: 'USD',
        description: 'Classic Mara experience in comfortable tented camps. Share vehicles with small groups of max 6. Full board meals. Perfect for first-time safari goers seeking authentic value.',
        accommodationType: 'Tented Safari Camp (shared ablutions)',
        includes: ['Tented camp accommodation (shared bathroom)', 'Full board meals', 'Shared 4×4 game drives', 'Park fees', 'Maasai village visit', 'Guide tips included'],
      },
      midRange: {
        pricePerPerson: 2850, currency: 'USD',
        description: 'Elevated comfort in permanent en-suite tented lodges. Private vehicle for your group. Sundowner service. Ideal for couples and small families wanting a step up in comfort.',
        accommodationType: 'Permanent En-Suite Tented Lodge',
        includes: ['En-suite tented lodge', 'Full board + afternoon tea', 'Private vehicle', 'Park & conservancy fees', 'Maasai village', 'Sundowner service', 'Free laundry'],
      },
      luxury: {
        pricePerPerson: 5800, currency: 'USD',
        description: 'Exclusive luxury camps with private plunge pools, personal butler, and gourmet dining. Private vehicle and concession access. Balloon safari included. The ultimate Mara indulgence.',
        accommodationType: 'Luxury Camp — Private Tented Suite with plunge pool',
        includes: ['Private tented suite with plunge pool', 'Gourmet full board', 'Premium wines & spirits', 'Private vehicle', 'Balloon safari included', 'Butler service', 'Spa access', 'All conservation fees'],
      },
    },
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', publicId: 'acacia-safaris/safaris/migration/01', alt: 'Wildebeest crossing Mara River' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80', publicId: 'acacia-safaris/safaris/migration/02', alt: 'Elephant herd at sunset' },
    ],
    category: ['wildlife', 'adventure'],
    difficulty: 'easy',
    maxGroupSize: 8, minGroupSize: 2, minAge: 6,
    bestSeason: ['July', 'August', 'September', 'October'],
    featured: true, active: true, rating: 4.9, reviewCount: 287,
    seo: {
      metaTitle: 'Great Wildebeest Migration Safari Kenya | Acacia Safaris',
      metaDescription: '7-day Great Migration safari in Masai Mara. Witness dramatic Mara River crossings. Budget $1,650 | Mid-range $2,850 | Luxury $5,800 per person.',
      keywords: ['wildebeest migration safari', 'Masai Mara safari', 'Mara River crossing', 'Kenya wildlife safari'],
    },
  },

  {
    name: 'Serengeti Plains & Ngorongoro Crater',
    slug: 'serengeti-ngorongoro-safari',
    tagline: 'Tanzania\'s twin jewels — boundless Serengeti savanna and the world\'s largest intact volcanic caldera',
    description: 'This 8-day masterpiece combines the Serengeti\'s endless plains — home to all the big cats and staggering wildlife density — with the Ngorongoro Crater, a UNESCO World Heritage Site that harbours the highest density of large mammals on Earth. Over 25,000 large animals live within the crater walls year-round, including the rare black rhino. Your expert Tanzanian guide will navigate both ecosystems with deep knowledge and genuine passion.',
    location: { country: 'Tanzania', region: 'Northern Tanzania', park: 'Serengeti National Park', coordinates: { lat: -2.3333, lng: 34.8333 } },
    duration: 8,
    highlights: [
      'Game drives in the southern Serengeti — cheetah, lion, leopard territory',
      'Full day descent into Ngorongoro Crater floor',
      'Black rhino spotting in the crater',
      'Visit the Olduvai Gorge museum — cradle of mankind',
      'Maasai cultural encounter on the crater rim',
      'Serengeti balloon option (luxury tier)',
      'Kopje exploration — rock-climbing lions',
    ],
    included: ['All accommodation per tier', 'Full board', 'Professional TATO-certified guide', 'All national park and crater fees', 'All game drive transport', 'Airport transfers', 'Water in vehicle'],
    excluded: ['International flights', 'Tanzania visa', 'Travel insurance', 'Balloon safari ($500/person)', 'Tips', 'Personal spending'],
    itinerary: [
      { day: 1, title: 'Kilimanjaro/Arusha → Serengeti', description: 'Fly into Kilimanjaro or Arusha airport. After a briefing and equipment check, you depart through Arusha National Park\'s fringes and arrive at the Serengeti gate by evening.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Travel through Arusha', 'First Serengeti game drive', 'Sundowner'] },
      { day: 2, title: 'Southern Serengeti — Cheetah Plains', description: 'The southern Serengeti (Ndutu area when in season) is prime cheetah territory. Vast open plains allow you to spot kills from distance. Your guide follows fresh tracks at dawn for the best hunting action.', meals: ['Breakfast', 'Bush Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Cheetah tracking', 'Lion pride observation', 'Picnic lunch on plains'] },
      { day: 3, title: 'Central Serengeti — Seronera Valley', description: 'Drive to the Seronera Valley — the Serengeti\'s wildlife capital. Dense fig trees shelter leopards. The Seronera River is a magnet for hippos, crocodiles, elephant, and big cats.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Leopard tracking', 'Hippo pools', 'Kopje exploration'] },
      { day: 4, title: 'Serengeti — Kopjes & Lion Prides', description: 'The granite kopjes (rocky outcrops) scattered across the plains are pride headquarters for lions. Climb a viewpoint kopje with your guide for 360° panoramas of Africa at its most iconic.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Kopje viewpoint hike', 'Lion pride tracking', 'Sundowner on kopje', 'Optional balloon (luxury)'] },
      { day: 5, title: 'Serengeti → Olduvai → Ngorongoro Rim', description: 'Morning game drive then drive to the famous Olduvai Gorge, where Louis and Mary Leakey unearthed Homo habilis remains 1.8 million years old. Continue to the Ngorongoro Crater rim (2,300m) with its cooler air and stunning views.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Crater rim (see tier)', activities: ['Final Serengeti drive', 'Olduvai Gorge museum', 'Crater rim sunset walk'] },
      { day: 6, title: 'Ngorongoro Crater — Full Day Floor Descent', description: 'Early descent into the 600m-deep crater floor for a full day among 25,000+ animals. The crater\'s resident black rhino population (often viewable), dense wildebeest, zebra, flamingo-ringed soda lake, and an extraordinary density of predators make this unlike anywhere else on earth.', meals: ['Breakfast', 'Picnic Lunch', 'Dinner'], accommodation: 'Crater rim (see tier)', activities: ['Full crater floor game drive', 'Hippo pool visit', 'Flamingo lake stop', 'Rhino spotting'] },
      { day: 7, title: 'Ngorongoro — Cultural & Relaxation', description: 'Visit a Maasai boma on the crater rim inhabited for generations. Afternoon at leisure in the highland forest — birdwatching, forest walks, or spa. Farewell dinner with crater views.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Crater rim (see tier)', activities: ['Maasai village visit', 'Forest walk', 'Farewell dinner'] },
      { day: 8, title: 'Ngorongoro → Arusha → Departure', description: 'Last sunrise from the crater rim. Drive to Arusha for onward flights. Depart with a lifetime of memories.', meals: ['Breakfast'], accommodation: 'Airport hotel (own cost)', activities: ['Crater rim sunrise', 'Transfer to Arusha'] },
    ],
    pricing: {
      budget: { pricePerPerson: 1950, currency: 'USD', description: 'Quality shared-vehicle experiences in comfortable tented camps at both Serengeti and crater rim. Small group maximum 6 pax. Full board.', accommodationType: 'Classic Tented Camp', includes: ['Tented camp (shared bathrooms)', 'Full board', 'Shared vehicle', 'All park/crater fees', 'Olduvai museum entry', 'Guide fees'] },
      midRange: { pricePerPerson: 3400, currency: 'USD', description: 'Boutique eco-lodge accommodation at Seronera and a quality crater rim lodge. Private vehicle. Spectacular views with sundowner service.', accommodationType: 'Eco-Lodge & Crater Rim Lodge (en-suite)', includes: ['En-suite eco-lodge', 'Full board + high tea', 'Private vehicle', 'All fees', 'Maasai village', 'Sundowners', 'Crater descent priority access'] },
      luxury: { pricePerPerson: 7200, currency: 'USD', description: 'Iconic ultra-luxury camps in the Serengeti ecosystem plus an exclusive crater rim property. Private butler, gourmet cuisine, and balloon safari included. Unmatched service throughout.', accommodationType: 'Ultra-Luxury Camp & Exclusive Crater Lodge', includes: ['Ultra-luxury accommodation', 'Gourmet full board', 'Balloon safari + champagne breakfast', 'Private vehicle', 'Butler service', 'Spa treatments', 'All fees & tips'] },
    },
    coverImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&q=80', publicId: 'acacia-safaris/safaris/serengeti/01', alt: 'Giraffe on Serengeti plains at golden hour' },
    ],
    category: ['wildlife', 'cultural'],
    difficulty: 'easy', maxGroupSize: 8, minGroupSize: 2, minAge: 5,
    bestSeason: ['January', 'February', 'June', 'July', 'August', 'September'],
    featured: true, active: true, rating: 4.8, reviewCount: 213,
    seo: {
      metaTitle: 'Serengeti & Ngorongoro Crater Safari | Acacia Safaris',
      metaDescription: '8-day Tanzania safari combining Serengeti and Ngorongoro Crater. Black rhino, big cats, kopjes. Budget $1,950 | Mid-range $3,400 | Luxury $7,200 per person.',
      keywords: ['Serengeti safari', 'Ngorongoro Crater safari', 'Tanzania safari', 'black rhino Tanzania'],
    },
  },

  {
    name: 'Uganda Gorilla Trekking Expedition',
    slug: 'uganda-gorilla-trekking',
    tagline: 'A face-to-face encounter with endangered mountain gorillas in their mist-shrouded forest home',
    description: 'Uganda\'s Bwindi Impenetrable Forest harbours half the world\'s mountain gorilla population — critically endangered, numbering barely over 1,000 individuals. This 6-day expedition takes you deep into ancient Afromontane forest for a once-in-a-lifetime encounter with a habituated gorilla family. Your 1-hour permit allows you to observe silverbacks, mothers, and playful infants at close range. Trekking difficulty varies; our guides customise the route for your fitness level.',
    location: { country: 'Uganda', region: 'Southwestern Uganda', park: 'Bwindi Impenetrable National Park', coordinates: { lat: -1.0, lng: 29.7 } },
    duration: 6,
    highlights: [
      '1-hour permitted encounter with habituated gorilla family',
      'Navigate ancient Afromontane forest with expert trackers',
      'Queen Elizabeth National Park — tree-climbing lions of Ishasha',
      'Crater lakes region — scenic game drives and birdwatching',
      'Community tourism project supporting gorilla conservation',
      'Golden monkey trekking option',
    ],
    included: ['Mountain gorilla permit ($700/person)', 'All accommodation per tier', 'Full board', 'English-speaking gorilla guide', 'Porters', 'All park fees', 'Airport transfers (Entebbe or Kigali)'],
    excluded: ['International flights', 'Uganda or Rwanda visa', 'Travel insurance', 'Tips', 'Golden monkey permit ($60)', 'Personal items'],
    itinerary: [
      { day: 1, title: 'Entebbe/Kigali → Bwindi', description: 'Depart early for the scenic 8-hour drive (or 1-hour charter flight) through Uganda\'s lush "Pearl of Africa" landscapes. Pass through Mbara and stop at the equator crossing. Arrive Bwindi and orientation briefing.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Scenic drive', 'Equator crossing', 'Bwindi forest walk', 'Briefing'] },
      { day: 2, title: 'Gorilla Trekking Day', description: 'Early breakfast then UWA ranger briefing at the park gate. Gorilla families range within the forest daily; your team of trackers has been following since dawn. Trek through dense undergrowth (1–6 hours depending on the family\'s location) until you find them. One magical hour with the family — watching silverbacks, nursing mothers, and playful babies. Pure magic.', meals: ['Breakfast', 'Packed Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Gorilla trekking permit', '1 hour with gorilla family', 'Tracker-led trek'] },
      { day: 3, title: 'Second Gorilla Trek OR Village Walk', description: 'Option to purchase a second permit for another family encounter. Alternatively, spend the morning with the Buhoma Community Walk visiting a local homestead, traditional healers and the women\'s beekeeping project that feeds directly into conservation funding.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Optional second trek', 'Community walk', 'Beekeeping cooperative visit'] },
      { day: 4, title: 'Bwindi → Queen Elizabeth National Park', description: 'Morning forest walk for birds (over 350 species in Bwindi). Depart for Queen Elizabeth National Park — East Africa\'s most bio-diverse park. Afternoon game drive in Kasenyi to find elephant, buffalo, kob and hyena.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Bwindi forest birding', 'Transfer to QENP', 'Afternoon game drive'] },
      { day: 5, title: 'Queen Elizabeth — Ishasha Tree-Climbing Lions', description: 'Morning Kazinga Channel boat safari (40km) seeing hippo, crocodile, elephant and water birds at close range. Afternoon in Ishasha Sector tracking the famous tree-climbing lions, unique to this region and the Serengeti kopjes.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Kazinga Channel boat', 'Tree-climbing lion tracking', 'Sunset game drive'] },
      { day: 6, title: 'Queen Elizabeth → Entebbe/Kigali', description: 'Final morning game drive. Begin return journey to Entebbe for afternoon/evening flights (or Kigali cross-border transfer).', meals: ['Breakfast', 'Lunch'], accommodation: 'Entebbe airport hotel (own cost)', activities: ['Final game drive', 'Transfer to airport'] },
    ],
    pricing: {
      budget: { pricePerPerson: 2400, currency: 'USD', description: 'Comfortable bandas or budget lodges near Bwindi gate and Queen Elizabeth. Small groups. All permits and meals included. Truly excellent value given the gorilla permit cost alone is $700.', accommodationType: 'Banda / Budget Lodge (en-suite)', includes: ['Gorilla trekking permit', 'En-suite banda accommodation', 'Full board', 'Shared 4×4 transport', 'Park fees', 'Porter'] },
      midRange: { pricePerPerson: 3900, currency: 'USD', description: 'Quality lodges with forest views at Bwindi and a classic lodge at Queen Elizabeth. Private vehicle. Sundowners and afternoon tea service. Perfect for comfort-focused travellers.', accommodationType: 'Mid-range Forest Lodge (en-suite)', includes: ['Gorilla permit', 'Forest lodge (en-suite)', 'Full board + afternoon tea', 'Private vehicle', 'All park fees', 'Sundowners', 'Porter & guide'] },
      luxury: { pricePerPerson: 8500, currency: 'USD', description: 'Uganda\'s finest boutique camps perched above the mist-filled valleys. Private guides, gorilla habituation experience option (available at extra cost), gourmet cuisine, and exclusive forest access.', accommodationType: 'Luxury Boutique Camp — private forest banda', includes: ['Gorilla permit', 'Luxury forest camp', 'Gourmet full board', 'Premium drinks', 'Private guide', 'All fees', 'Helicopter transfer option', 'Habituated experience priority booking'] },
    },
    coverImage: 'https://images.unsplash.com/photo-1589840700256-41c5d84ef38b?w=1200&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1589840700256-41c5d84ef38b?w=1200&q=80', publicId: 'acacia-safaris/safaris/gorilla/01', alt: 'Mountain gorilla in Bwindi forest' },
    ],
    category: ['gorilla', 'wildlife', 'adventure'],
    difficulty: 'moderate', maxGroupSize: 8, minGroupSize: 2, minAge: 15,
    bestSeason: ['January', 'February', 'June', 'July', 'August', 'September', 'December'],
    featured: true, active: true, rating: 5.0, reviewCount: 148,
    seo: {
      metaTitle: 'Uganda Gorilla Trekking Safari | Acacia Safaris',
      metaDescription: '6-day Uganda gorilla trekking in Bwindi Impenetrable Forest. Mountain gorilla permit included. Budget $2,400 | Mid-range $3,900 | Luxury $8,500 per person.',
      keywords: ['Uganda gorilla trekking', 'mountain gorilla safari', 'Bwindi Impenetrable Forest', 'gorilla permits Uganda'],
    },
  },

  {
    name: 'Amboseli & Kilimanjaro Elephant Safari',
    slug: 'amboseli-kilimanjaro-elephant-safari',
    tagline: 'Africa\'s largest free-roaming elephants against the snow-capped crown of Mount Kilimanjaro',
    description: 'Amboseli National Park offers one of Africa\'s most iconic safari vistas: massive elephant bulls and matriarchal herds moving across dusty plains beneath the majestic snows of Mount Kilimanjaro. With over 1,600 elephants, Amboseli hosts the world\'s most studied elephant population. Dr Cynthia Moss\'s legendary 50-year research project began here. This 5-day safari immerses you in elephant ecology, big-cat sightings and breathtaking Kilimanjaro views at dawn and dusk.',
    location: { country: 'Kenya', region: 'Kajiado County', park: 'Amboseli National Park', coordinates: { lat: -2.65, lng: 37.25 } },
    duration: 5,
    highlights: [
      'Photograph the largest elephant herds in Africa with Kilimanjaro backdrop',
      'Dawn and dusk Kilimanjaro views (weather permitting)',
      'Big Five in compact park with excellent sightings',
      'Observation Hill for panoramic views over swamps and plains',
      'Maasai cultural experience at community conservancy',
      'Night game drive in Amboseli ecosystem buffer zone',
    ],
    included: ['All accommodation per tier', 'Full board', 'Park fees', 'Professional guide', 'Game drive vehicle', 'Airport transfers (Nairobi or Amboseli strip)'],
    excluded: ['International flights', 'Kenya visa', 'Travel insurance', 'Night game drives (included in luxury)', 'Tips', 'Personal items'],
    itinerary: [
      { day: 1, title: 'Nairobi → Amboseli', description: 'Depart Nairobi via the Kitengela corridor, crossing open rangeland dotted with giraffe and zebra. Arrive Amboseli before noon for a game drive en route to camp. First spectacular views of Kilimanjaro above the swamp.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Arrival game drive', 'Observation Hill visit', 'Sundowner'] },
      { day: 2, title: 'Elephant Research Area & Big Five Pursuit', description: 'Full day exploring the core elephant research area. Your guide knows many individual elephants by name and family. Visit the swamps where thousands gather at midday. Afternoon focus on lion prides and cheetah.', meals: ['Breakfast', 'Bush Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Elephant family tracking', 'Swamp drive', 'Lion & cheetah pursuit'] },
      { day: 3, title: 'Dawn Kilimanjaro Views & Full Park Exploration', description: '4:30am wake-up call for the best Kilimanjaro views — before the clouds build mid-morning. Photography session with elephants silhouetted against the summit. Full-day circuit covering all ecological zones of the park.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Pre-dawn Kilimanjaro photography', 'Full park circuit', 'Hippo pool'] },
      { day: 4, title: 'Amboseli → Chyulu Hills (Midrange/Luxury)', description: 'For mid-range and luxury guests: Transfer to the magical Chyulu Hills — ancient volcanic landscape bordering Amboseli. Guided walk through the hills with Maasai rangers. Sundowner at lava-flow viewpoint. Budget guests: second full day Amboseli.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Chyulu Hills walk (M/L)', 'Maasai ranger guide', 'Lava tube exploration', 'Sundowner'] },
      { day: 5, title: 'Amboseli → Nairobi', description: 'Sunrise final game drive targeting elephant bulls at the swamp edge. Depart after breakfast for Nairobi airport, arriving mid-afternoon.', meals: ['Breakfast'], accommodation: 'Nairobi (own cost)', activities: ['Final sunrise game drive', 'Return transfer'] },
    ],
    pricing: {
      budget: { pricePerPerson: 1150, currency: 'USD', description: 'Solid tented camp accommodation in and around Amboseli. Full board, excellent guiding, and the same iconic elephant sightings all tiers enjoy.', accommodationType: 'Tented Camp (shared facilities)', includes: ['Tented camp (shared bathroom)', 'Full board', 'Shared game drives', 'Park fees', 'Guide'] },
      midRange: { pricePerPerson: 2100, currency: 'USD', description: 'En-suite lodge with Kilimanjaro-facing rooms and a swimming pool. Private vehicle. Includes the Chyulu Hills day excursion.', accommodationType: 'En-suite Lodge with pool', includes: ['En-suite lodge room', 'Full board + afternoon tea', 'Private vehicle', 'Chyulu Hills excursion', 'Maasai cultural visit', 'All park fees'] },
      luxury: { pricePerPerson: 4800, currency: 'USD', description: 'Kenya\'s most romantic bush camp — canvas suites with outdoor bath and direct Kilimanjaro views. Night game drives, bush dinners under the stars, and spa.', accommodationType: 'Luxury Canvas Suite — private outdoor bath, Kili views', includes: ['Luxury canvas suite', 'Gourmet full board', 'Premium drinks', 'Night game drives', 'Bush dinner', 'Spa', 'All fees'] },
    },
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80', publicId: 'acacia-safaris/safaris/amboseli/01', alt: 'Elephant herd crossing at Amboseli with Kilimanjaro' }],
    category: ['wildlife'],
    difficulty: 'easy', maxGroupSize: 10, minGroupSize: 1, minAge: 5,
    bestSeason: ['January', 'February', 'July', 'August', 'September', 'October'],
    featured: true, active: true, rating: 4.7, reviewCount: 176,
    seo: {
      metaTitle: 'Amboseli Elephant Safari Kenya | Kilimanjaro Views | Acacia Safaris',
      metaDescription: '5-day Amboseli safari with Kilimanjaro elephant photography. Budget $1,150 | Mid-range $2,100 | Luxury $4,800 per person.',
      keywords: ['Amboseli safari', 'elephant safari Kenya', 'Kilimanjaro safari', 'Kenya wildlife'],
    },
  },

  {
    name: 'Kruger & Panorama Route Safari',
    slug: 'kruger-panorama-safari',
    tagline: 'South Africa\'s flagship wilderness — iconic Big Five country paired with dramatic canyon landscapes',
    description: 'Kruger National Park is one of Africa\'s largest game reserves, spanning 2 million hectares of pristine savanna. With the highest density of hippos in South Africa, a thriving lion population, and regular sightings of all Big Five, Kruger delivers world-class game viewing year-round. This 6-day package pairs Kruger drives with the spectacular Panorama Route — Blyde River Canyon, God\'s Window and the Bourke\'s Luck Potholes. South Africa\'s infrastructure makes this the easiest-access safari on the continent.',
    location: { country: 'South Africa', region: 'Limpopo & Mpumalanga', park: 'Kruger National Park', coordinates: { lat: -23.9, lng: 31.5 } },
    duration: 6,
    highlights: [
      'High-density Big Five game viewing in Kruger\'s southern circuit',
      'Night game drives with nocturnal wildlife',
      'Panorama Route — Blyde River Canyon (third largest in world)',
      'God\'s Window viewpoint at 1,730m',
      'Bourke\'s Luck Potholes geological wonder',
      'Optional guided bush walk with armed ranger',
      'Elephant and rhino tracking on foot (luxury)',
    ],
    included: ['All accommodation per tier', 'Full board', 'Park fees', 'Professional guide', 'Game drive vehicle', 'Johannesburg/Nelspruit transfers'],
    excluded: ['International flights', 'South Africa visa (most nationalities visa-free)', 'Travel insurance', 'Tips', 'Guided walks (mid/luxury)', 'Personal spending'],
    itinerary: [
      { day: 1, title: 'Johannesburg/Nelspruit → Southern Kruger', description: 'Collect from OR Tambo or Nelspruit airport and head straight into the southern park — the most prolific for lion and rhino. Afternoon game drive before sunset check-in.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Arrival drive', 'First Big Five quest', 'Sundowner'] },
      { day: 2, title: 'Full Day Southern Kruger', description: 'Pre-dawn game drive targeting lion activity near the Sabie River. Full day exploring the S1, S3 and H4-2 routes — consistently Kruger\'s best for leopard, rhino and wild dog.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Dawn lion drives', 'Leopard tracking', 'Hippo pools', 'Wild dog territory'] },
      { day: 3, title: 'Night Drive & Central Kruger', description: 'Morning drive in central Kruger\'s Satara area — famous for lion concentrations. Afternoon rest before the night game drive: an entirely different cast of characters — civets, genets, bushbabies, owls and hunting leopard.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Central Kruger drive', 'Night game drive', 'Lion concentrations'] },
      { day: 4, title: 'Guided Bush Walk (Mid/Luxury) or Full Day Drive', description: 'Mid-range and luxury guests: 3-hour armed ranger-led walking safari — track rhino and follow fresh prints in total silence. Profound connection with the bush. Budget guests: full day game drive.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Armed bush walk (M/L)', 'Rhino tracking on foot', 'Afternoon game drive'] },
      { day: 5, title: 'Panorama Route Excursion', description: 'Full day on the scenic Panorama Route. Blyde River Canyon — the third largest canyon in the world, draped in subtropical greenery. God\'s Window for a 360° view from the escarpment edge. Bourke\'s Luck Potholes carved by millennia of water action.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ["Blyde River Canyon viewpoints", "God's Window", "Bourke's Luck Potholes", "Mac Mac Falls"] },
      { day: 6, title: 'Kruger Final Drive → Departure', description: 'Last game drive before checkout. Transfer to Nelspruit/Hoedspruit airport for onward journeys.', meals: ['Breakfast'], accommodation: 'Airport hotel (own cost)', activities: ['Final game drive', 'Transfer to airport'] },
    ],
    pricing: {
      budget: { pricePerPerson: 1400, currency: 'USD', description: 'Quality Kruger restcamp accommodation or a budget bush camp. Full board, shared vehicle game drives, and the same spectacular wildlife.', accommodationType: 'Restcamp Bungalow / Budget Bush Camp', includes: ['Restcamp/budget camp', 'Full board', 'Shared vehicle', 'Park fees', 'Panorama day trip', 'Guide'] },
      midRange: { pricePerPerson: 2600, currency: 'USD', description: 'Private game lodge adjacent to Kruger with open electric fence — wildlife wanders through. En-suite, pool, and private vehicle. Guided bush walk included.', accommodationType: 'Private Game Lodge (en-suite, pool)', includes: ['Private game lodge', 'Full board', 'Private vehicle', 'Night drives', 'Armed bush walk', 'Park fees', 'Panorama route'] },
      luxury: { pricePerPerson: 5500, currency: 'USD', description: 'Exclusive private reserve bordering Kruger — no fences, free-roaming big five. Ultra-luxury lodge with private plunge pool. Tracking rhino on foot with specialist guides. Helicopter flight over Blyde Canyon.', accommodationType: 'Exclusive Bush Villa — private plunge pool', includes: ['Exclusive private villa', 'Gourmet full board', 'Premium drinks', 'Private guide', 'Helicopter over canyon', 'Rhino tracking on foot', 'Spa', 'All fees'] },
    },
    coverImage: 'https://images.unsplash.com/photo-1504173010664-32509107de5c?w=1200&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1504173010664-32509107de5c?w=1200&q=80', publicId: 'acacia-safaris/safaris/kruger/01', alt: 'Kruger National Park savanna at sunrise' }],
    category: ['wildlife', 'adventure'],
    difficulty: 'easy', maxGroupSize: 10, minGroupSize: 2, minAge: 6,
    bestSeason: ['May', 'June', 'July', 'August', 'September', 'October'],
    featured: false, active: true, rating: 4.6, reviewCount: 132,
    seo: {
      metaTitle: 'Kruger Safari & Panorama Route | South Africa | Acacia Safaris',
      metaDescription: '6-day Kruger Big Five safari + Panorama Route. Budget $1,400 | Mid-range $2,600 | Luxury $5,500 per person.',
      keywords: ['Kruger safari', 'South Africa safari', 'Big Five safari', 'Panorama Route'],
    },
  },

  {
    name: 'Rwanda Gorilla & Chimpanzee Trek',
    slug: 'rwanda-gorilla-chimp-trek',
    tagline: 'Encounter mountain gorillas and wild chimpanzees in Rwanda\'s emerald forest highlands',
    description: 'Rwanda\'s Volcanoes National Park is the birthplace of gorilla conservation — where the legendary Dian Fossey lived and died protecting mountain gorillas. Today, the park\'s 12 habituated gorilla families receive visitors in strictly limited groups of 8. This 5-day expedition combines a mountain gorilla trek in the Virunga volcanoes with a chimpanzee tracking experience in Nyungwe Forest — Africa\'s oldest montane rainforest — giving you encounters with two of our closest evolutionary relatives.',
    location: { country: 'Rwanda', region: 'Northern Province', park: 'Volcanoes National Park', coordinates: { lat: -1.47, lng: 29.55 } },
    duration: 5,
    highlights: [
      '1-hour mountain gorilla family encounter in the Virungas',
      'Chimpanzee tracking in ancient Nyungwe Forest',
      'Visit Dian Fossey\'s grave and Karisoke Research Centre',
      'Golden monkey trekking option in bamboo forests',
      'Kigali city tour and Genocide Memorial',
      'Canopy walk in Nyungwe — hanging bridges above the rainforest',
    ],
    included: ['Mountain gorilla permit ($1,500/person)', 'Chimp tracking permit', 'All accommodation per tier', 'Full board', 'All park fees', 'Transfers from Kigali', 'Guide'],
    excluded: ['International flights', 'Rwanda visa ($50)', 'Travel insurance', 'Tips', 'Dian Fossey tomb hike ($75)', 'Golden monkey permit ($100)'],
    itinerary: [
      { day: 1, title: 'Kigali → Volcanoes National Park', description: 'Kigali city tour: the immaculate capital city with its memorable Genocide Memorial. Afternoon drive to Musanze through terraced hillsides and volcanoes. Briefing at camp.', meals: ['Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Kigali city tour', 'Genocide Memorial', 'Volcanoes arrival'] },
      { day: 2, title: 'Mountain Gorilla Trekking Day', description: 'Ranger briefing at 7am. Trek into the Virunga volcanoes through bamboo zones and dense Hagenia forest. Find your assigned gorilla family — Gorilla Mountain is covered in mist and magic. Spend your 1 permitted hour watching these extraordinary creatures interact, play, and go about their lives. Transformative.', meals: ['Breakfast', 'Packed Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Gorilla permit trek', '1-hour gorilla family encounter'] },
      { day: 3, title: 'Golden Monkeys & Dian Fossey', description: 'Morning golden monkey trek in bamboo forests — these brightly coloured primates move in troops through the bamboo and are remarkably approachable. Afternoon: optional hike to Karisoke Research Station and Dian Fossey\'s grave at 3,000m.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Golden monkey trek', 'Fossey grave hike (optional)', 'Community craft market'] },
      { day: 4, title: 'Volcanoes → Nyungwe Forest', description: 'Scenic transfer south through tea plantations to Nyungwe Forest. Afternoon chimpanzee habituation walk in the forest margins.', meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'See tier', activities: ['Transfer through tea estates', 'Chimp habituation walk', 'Forest orientation'] },
      { day: 5, title: 'Nyungwe Chimp Trek → Kigali', description: 'Pre-dawn chimp tracking when the forest echoes with hoots and drumming. 1-hour encounter with habituated chimp community. Optional: Nyungwe canopy walk (suspension bridges). Return to Kigali for evening flights.', meals: ['Breakfast', 'Lunch'], accommodation: 'Kigali hotel (own cost)', activities: ['Chimpanzee tracking', 'Optional canopy walk', 'Return to Kigali'] },
    ],
    pricing: {
      budget: { pricePerPerson: 3200, currency: 'USD', description: 'Both gorilla and chimp permits included — the total permit cost alone exceeds $1,500. Comfortable guesthouse accommodation. Exceptional value for genuine primate encounters.', accommodationType: 'Quality Guesthouse / Eco-Bandas', includes: ['Gorilla permit ($1,500)', 'Chimp permit', 'Guesthouse accommodation', 'Full board', 'Guide', 'All park fees', 'Kigali transfers'] },
      midRange: { pricePerPerson: 4800, currency: 'USD', description: 'Boutique lodge rooms at Volcanoes with volcano views and quality lodge at Nyungwe. Private vehicle, excellent meals, and a community experience at a women\'s weaving cooperative.', accommodationType: 'Boutique Lodge (en-suite volcano views)', includes: ['Both permits', 'Boutique lodge rooms', 'Full board + high tea', 'Private vehicle', 'Women\'s cooperative visit', 'All fees'] },
      luxury: { pricePerPerson: 9200, currency: 'USD', description: 'Rwanda\'s finest mountain retreat at Volcanoes and exclusive treehouse suites at Nyungwe. Second gorilla trek option. Helicopter over the Virungas available. The ultimate primate safari.', accommodationType: 'Luxury Mountain Retreat & Nyungwe Treehouse', includes: ['Both permits', 'Luxury lodge accommodation', 'Gourmet full board', 'Premium drinks', 'Private guide', 'Helicopter option', 'Spa', 'All fees & tips'] },
    },
    coverImage: 'https://images.unsplash.com/photo-1526073733167-4f0f5afc5c90?w=1200&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1526073733167-4f0f5afc5c90?w=1200&q=80', publicId: 'acacia-safaris/safaris/rwanda-gorilla/01', alt: 'Mist-covered Virunga volcanoes Rwanda' }],
    category: ['gorilla', 'wildlife', 'adventure'],
    difficulty: 'moderate', maxGroupSize: 8, minGroupSize: 2, minAge: 15,
    bestSeason: ['January', 'February', 'June', 'July', 'August', 'September', 'December'],
    featured: true, active: true, rating: 4.9, reviewCount: 97,
    seo: {
      metaTitle: 'Rwanda Gorilla & Chimp Trekking Safari | Acacia Safaris',
      metaDescription: '5-day Rwanda gorilla and chimp trek. Volcanoes NP + Nyungwe Forest. Budget $3,200 | Mid-range $4,800 | Luxury $9,200 per person.',
      keywords: ['Rwanda gorilla trekking', 'Volcanoes National Park', 'chimp tracking Rwanda', 'mountain gorilla permits'],
    },
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    rating: 5,
    title: 'The migration crossing was beyond anything I expected',
    body: 'Standing at the Mara River as 10,000 wildebeest charged past was one of the most visceral, emotional experiences of my life. Our guide James knew exactly where to position us. The tented camp was also surprisingly luxurious — cold drinks, hot bucket showers, and stars so bright you couldn\'t sleep.',
    safariName: 'Great Wildebeest Migration Safari',
    featured: true, verified: true,
  },
  {
    name: 'Michael & Renée Beaumont',
    country: 'France',
    rating: 5,
    title: 'Mountain gorillas changed our perspective on life',
    body: 'Nothing prepares you for looking into a silverback\'s eyes from 3 metres away. The trek was tough but our guide and the porters were incredible. We cried — both of us. Acacia sorted everything effortlessly and the mid-range lodge had gorgeous volcano views.',
    safariName: 'Uganda Gorilla Trekking Expedition',
    featured: true, verified: true,
  },
  {
    name: 'James Kowalski',
    country: 'United States',
    rating: 5,
    title: 'Best travel investment of my life — worth every cent',
    body: 'I went for the budget Serengeti package and was blown away by the quality. Small group, expert guide, incredible wildlife. Saw all Big Five in 2 days. The gorge and crater combo on day 5-6 is just spectacular. Already planning my return for the Mara.',
    safariName: 'Serengeti Plains & Ngorongoro Crater',
    featured: true, verified: true,
  },
  {
    name: 'Anika van der Berg',
    country: 'Netherlands',
    rating: 5,
    title: 'Amboseli at dawn with Kilimanjaro — pure magic',
    body: 'The elephant bulls were right next to our vehicle at sunrise with the mountain perfectly clear behind them. I have thousands of photos but none capture how it felt. Luxury tier was impeccable — outdoor bath, fire, Milky Way overhead. Acacia are true professionals.',
    safariName: 'Amboseli & Kilimanjaro Elephant Safari',
    featured: true, verified: true,
  },
  {
    name: 'David Osei-Mensah',
    country: 'Ghana',
    rating: 4,
    title: 'Kruger exceeded all expectations as a first safari',
    body: 'I was sceptical about Kruger being "too commercialised" but the private reserve bordering the park was wild and extraordinary. Four rhino sightings in two days. The guided walk with an armed ranger was thrilling. Acacia\'s team were professional from first contact to farewell.',
    safariName: 'Kruger & Panorama Route Safari',
    featured: true, verified: true,
  },
  {
    name: 'Priya Sharma',
    country: 'India',
    rating: 5,
    title: 'Rwanda: our most meaningful travel experience',
    body: 'The gorilla trek, the Genocide Memorial, the women\'s weaving cooperatives — Rwanda moved us deeply on every level. The chimp tracking in Nyungwe was an unexpected highlight. Acacia\'s seamless logistics let us focus entirely on being present. Book this trip.',
    safariName: 'Rwanda Gorilla & Chimpanzee Trek',
    featured: true, verified: true,
  },
  {
    name: 'Emma Thornton',
    country: 'Australia',
    rating: 5,
    title: 'Solo traveller — felt completely safe and welcomed',
    body: 'As a solo female traveller I had concerns but Acacia made everything comfortable. The budget group was a wonderful mix of nationalities. Our guide was knowledgeable, funny, and endlessly patient. The Mara sunrise will stay with me forever.',
    safariName: 'Great Wildebeest Migration Safari',
    featured: true, verified: true,
  },
  {
    name: 'Familie Müller',
    country: 'Germany',
    rating: 5,
    title: 'Perfect family safari — even our 8-year-old was captivated',
    body: 'Our children (8 and 11) talked about nothing else for months. The guide was brilliant with kids — turning every drive into an educational adventure. Mid-range accommodation was clean, the food excellent, and the safety protocols reassuring. Five stars without hesitation.',
    safariName: 'Amboseli & Kilimanjaro Elephant Safari',
    featured: true, verified: true,
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌿 Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  // Clear existing
  console.log('🗑️  Clearing existing data…')
  await Promise.all([
    Safari.deleteMany({}),
    Testimonial.deleteMany({}),
  ])

  // Admin user — upsert so re-running seed always refreshes credentials
  const adminEmail    = process.env.ADMIN_EMAIL    ?? 'info@divinetravelnestsafaris.com'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'DivineSafari#2026!'
  const hash = await bcrypt.hash(adminPassword, 12)
  await User.findOneAndUpdate(
    { email: adminEmail },
    { $set: { name: 'Divine Travel Nest', email: adminEmail, password: hash, role: 'admin', active: true } },
    { upsert: true, new: true }
  )
  console.log(`👤 Admin upserted: ${adminEmail}`)

  // Safaris
  console.log('🦁 Seeding safaris…')
  for (const safari of safaris) {
    await Safari.create(safari)
    console.log(`  ✓ ${safari.name}`)
  }

  // Testimonials
  console.log('⭐ Seeding testimonials…')
  for (const t of testimonials) {
    await Testimonial.create(t)
    console.log(`  ✓ ${t.name}`)
  }

  console.log('\n🎉 Seed complete!')
  console.log(`   ${safaris.length} safaris`)
  console.log(`   ${testimonials.length} testimonials`)
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`)

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
