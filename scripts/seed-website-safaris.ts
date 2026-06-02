/**
 * Seed script: Real safari packages extracted from divinetravelnestsafaris.com
 * Usage: npm run seed:website
 *
 * Adds 3 packages WITHOUT clearing existing data.
 * Cover images use Unsplash placeholders — replace via admin media panel.
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env.local')

// ─── Inline schemas (mirrors lib/db/models/Safari.ts) ────────────────────────

const PricingTierSchema = new mongoose.Schema({
  pricePerPerson:    Number,
  currency:          { type: String, default: 'USD' },
  description:       String,
  includes:          [String],
  accommodationType: String,
  hotels:            [{ name: String, rating: Number }],
}, { _id: false })

const SafariSchema = new mongoose.Schema({
  name:        String,
  slug:        { type: String, unique: true },
  tagline:     String,
  description: String,
  location: {
    country:     String,
    region:      String,
    park:        String,
    coordinates: { lat: Number, lng: Number },
  },
  duration:     Number,
  highlights:   [String],
  included:     [String],
  excluded:     [String],
  itinerary: [{
    day:           Number,
    title:         String,
    description:   String,
    meals:         [String],
    accommodation: String,
    activities:    [String],
  }],
  pricing: {
    budget:   PricingTierSchema,
    midRange: PricingTierSchema,
    luxury:   PricingTierSchema,
  },
  images:              [{ url: String, publicId: String, alt: String }],
  coverImage:          String,
  coverImagePublicId:  String,
  category:            [String],
  difficulty:          String,
  maxGroupSize:        Number,
  minGroupSize:        Number,
  minAge:              Number,
  bestSeason:          [String],
  featured:            Boolean,
  active:              Boolean,
  rating:              Number,
  reviewCount:         Number,
  seo: { metaTitle: String, metaDescription: String, keywords: [String] },
}, { timestamps: true })

const Safari = mongoose.models.Safari || mongoose.model('Safari', SafariSchema)

// ─── Package data ─────────────────────────────────────────────────────────────

const packages = [
  // ── 1 ────────────────────────────────────────────────────────────────────────
  {
    name:     '3 Days Masai Mara Safari',
    slug:     '3-days-masai-mara-safari',
    tagline:  'The ultimate short break — three action-packed days in Kenya\'s most iconic game reserve',
    description:
      'Experience the magic of the Masai Mara in just three days. This carefully crafted short safari is perfect for travellers with limited time who still want authentic Big Five encounters, sweeping savanna landscapes, and the legendary hospitality of the Maasai people. You will enjoy morning and afternoon game drives in the core reserve and private conservancies where off-road driving and night drives are permitted, giving you an edge over the competition for the very best sightings. Expert KATO-certified guides, comfortable accommodation, and seamless logistics ensure every moment counts.',
    location: {
      country:     'Kenya',
      region:      'Rift Valley',
      park:        'Masai Mara National Reserve',
      coordinates: { lat: -1.5044, lng: 35.1441 },
    },
    duration:   3,
    highlights: [
      'Big Five game drives in the Masai Mara National Reserve',
      'Private conservancy access — off-road and night drives included',
      'Morning and afternoon game drives daily',
      'Professional KATO-licensed Masai Mara specialist guide',
      'Traditional Maasai village visit and cultural experience',
      'Sundowner drinks on the savanna',
      'Small group sizes for an intimate wildlife experience',
    ],
    included: [
      'Return road or air transfer from Nairobi (see tier)',
      'All accommodation in the Mara (2 nights)',
      'Full board meals: all breakfasts, lunches and dinners',
      'Morning and afternoon game drives (private 4×4 Land Cruiser)',
      'All national reserve and conservancy entry fees',
      'Professional KATO-certified guide',
      'Complimentary bottled drinking water',
      'Maasai village visit',
    ],
    excluded: [
      'International flights',
      'Kenya visa fees (USD 50 — eVisa available online)',
      'Travel and medical insurance (compulsory)',
      'Personal gratuities / tips for guide and camp staff',
      'Alcoholic beverages (unless stated)',
      'Hot air balloon safari (approx. USD 450/person — bookable on request)',
      'Personal items: laundry, phone calls, souvenirs',
    ],
    itinerary: [
      {
        day:           1,
        title:         'Nairobi → Masai Mara',
        description:   'Depart Nairobi after an early breakfast and drive through the dramatic Great Rift Valley escarpment, arriving in the Masai Mara in time for lunch. After settling into your camp, embark on an afternoon game drive in search of lion prides, elephant herds and resident cheetah. Return to camp for a sundowner and dinner under the African sky.',
        meals:         ['Lunch', 'Dinner'],
        accommodation: 'See pricing tier',
        activities:    ['Scenic Rift Valley drive', 'Afternoon game drive', 'Sundowner drinks on the plains'],
      },
      {
        day:           2,
        title:         'Full Day in the Masai Mara',
        description:   'A full day dedicated to exploring the Mara ecosystem. Rise before dawn for a sunrise game drive when predators are most active. Return to camp for a hot breakfast then head out again for a midday drive through the open plains. The afternoon drive ventures into the private conservancies for off-road tracking and closer wildlife encounters. Enjoy a bush picnic lunch in the field.',
        meals:         ['Breakfast', 'Bush Lunch', 'Dinner'],
        accommodation: 'See pricing tier',
        activities:    ['Sunrise game drive', 'Big Five tracking', 'Bush picnic lunch', 'Conservancy off-road drive', 'Optional night drive (conservancy guests)'],
      },
      {
        day:           3,
        title:         'Morning Game Drive → Nairobi Departure',
        description:   'Wake early for one final morning game drive — often the most productive of the safari. Return to camp for breakfast, check out and begin the return journey to Nairobi, arriving in the afternoon. Transfers to Jomo Kenyatta International Airport or Nairobi hotels are included.',
        meals:         ['Breakfast', 'Packed Lunch'],
        accommodation: 'N/A — departure day',
        activities:    ['Final morning game drive', 'Return drive to Nairobi', 'Airport / hotel transfer'],
      },
    ],
    pricing: {
      budget: {
        pricePerPerson:    380,
        currency:          'USD',
        description:       'A comfortable, value-for-money Masai Mara experience staying in well-equipped tented camps with en-suite facilities. Road transfer from Nairobi included.',
        includes:          ['En-suite tented camp accommodation', 'Road transfer Nairobi ↔ Mara', 'Shared 4×4 game drive vehicle', 'Full board meals', 'Park fees'],
        accommodationType: 'En-suite Tented Camp',
        hotels: [
          { name: 'Miti Mingi Eco Camp',    rating: 3 },
          { name: 'Rhino Tourist Camp',     rating: 3 },
          { name: 'Lenchada Tourist Camp',  rating: 3 },
        ],
      },
      midRange: {
        pricePerPerson:    650,
        currency:          'USD',
        description:       'Elevated comfort in a private conservancy camp with superior rooms, dedicated guide, and off-road access. Road transfer from Nairobi included.',
        includes:          ['Private conservancy camp accommodation', 'Road transfer Nairobi ↔ Mara', 'Private 4×4 game drive vehicle', 'Full board + house wines', 'Conservancy and park fees', 'Night drives available'],
        accommodationType: 'Private Conservancy Camp',
        hotels: [
          { name: 'Enkorok Mara Camp',  rating: 4 },
          { name: 'Mara Chui Lodge',    rating: 4 },
          { name: 'AA Lodge Mara',      rating: 4 },
          { name: 'Jambo Mara Lodge',   rating: 4 },
        ],
      },
      luxury: {
        pricePerPerson:    1200,
        currency:          'USD',
        description:       'Five-star luxury in an exclusive tented lodge with private plunge pool, gourmet dining and scheduled light aircraft transfers for a truly seamless experience.',
        includes:          ['Luxury lodge / exclusive tented villa', 'Scheduled flight Nairobi Wilson → Mara (return)', 'Private game drive vehicle + specialist guide', 'All meals, selected premium beverages', 'Conservancy + park fees', 'Guided bush walk', 'Maasai cultural evening'],
        accommodationType: 'Exclusive Luxury Tented Lodge',
        hotels: [
          { name: 'Sarova Mara Game Camp',    rating: 5 },
          { name: 'Mara Serena Safari Lodge', rating: 5 },
          { name: 'Mara Engai Lodge',         rating: 5 },
          { name: 'Neptune Mara Rianta Camp', rating: 5 },
        ],
      },
    },
    category:      ['wildlife'],
    difficulty:    'easy',
    maxGroupSize:  8,
    minGroupSize:  2,
    minAge:        5,
    bestSeason:    ['July', 'August', 'September', 'October', 'January', 'February'],
    featured:      true,
    active:        true,
    rating:        4.9,
    reviewCount:   58,
    // Unsplash placeholder — replace via admin media panel
    coverImage:         'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',
    coverImagePublicId: '',
    images:             [],
    seo: {
      metaTitle:       '3 Days Masai Mara Safari | Divine Travel Nest Safaris',
      metaDescription: 'Three action-packed days in Kenya\'s iconic Masai Mara — Big Five game drives, private conservancy access, and expert guides. From USD 650 per person.',
      keywords:        ['masai mara safari', '3 day safari kenya', 'masai mara short safari', 'kenya wildlife safari', 'big five kenya'],
    },
  },

  // ── 2 ────────────────────────────────────────────────────────────────────────
  {
    name:     '8 Days Magical Sopa Safari',
    slug:     '8-days-magical-sopa-safari',
    tagline:  'Eight days of unrivalled wilderness across Kenya\'s most celebrated national parks, staying at award-winning Sopa Lodges',
    description:
      'The Magical Sopa Safari is a premium eight-day journey through Kenya\'s most spectacular ecosystems — from the acacia woodlands of Amboseli in the shadow of Mount Kilimanjaro, through the dramatic Rift Valley lakes teeming with flamingos, up into the cool highland forest of the Aberdares, and finally into the golden grasslands of the Masai Mara. Throughout, you stay at the acclaimed Sopa Lodge collection, synonymous with spacious rooms, elegant décor, world-class cuisine and prime game-viewing locations. This is the definitive Kenyan safari experience.',
    location: {
      country:     'Kenya',
      region:      'Multi-park — Amboseli · Nakuru · Aberdares · Masai Mara',
      park:        'Amboseli, Lake Nakuru, Aberdare, Masai Mara',
      coordinates: { lat: -1.5, lng: 37.2 },
    },
    duration:   8,
    highlights: [
      'Amboseli National Park — elephants with Mount Kilimanjaro backdrop',
      'Lake Nakuru — pink flamingo flocks and endangered Rothschild giraffe',
      'Aberdare National Park — the mysterious highland forest and waterfalls',
      'Masai Mara National Reserve — Big Five and predator action',
      'Stay at four iconic Sopa Lodges throughout',
      'Full board dining at every lodge including gourmet bush breakfasts',
      'Cultural visits: Maasai village and local community projects',
    ],
    included: [
      'All accommodation at Sopa Lodges (7 nights)',
      'Full board meals throughout (breakfasts, lunches, dinners)',
      'All road transfers and inter-park travel in 4×4 Land Cruiser',
      'Professional KATO-certified safari guide (English-speaking)',
      'All national park and reserve entry fees',
      'Game drives as per itinerary (morning and afternoon daily)',
      'Complimentary bottled drinking water in vehicle',
      'Maasai village cultural visit',
      'All government taxes and levies',
    ],
    excluded: [
      'International flights',
      'Kenya eVisa (USD 50)',
      'Travel and medical insurance (compulsory)',
      'Personal gratuities for guide and lodge staff',
      'Alcoholic and premium non-alcoholic beverages',
      'Hot air balloon safari in the Mara (USD 450 — bookable on request)',
      'Optional activities not listed in the itinerary',
      'Personal shopping and souvenirs',
    ],
    itinerary: [
      {
        day:           1,
        title:         'Nairobi → Amboseli National Park',
        description:   'Depart Nairobi early morning and drive south-east through Machakos, arriving in Amboseli by lunchtime. After check-in at Amboseli Sopa Lodge, enjoy an afternoon game drive in the park, famous for large free-ranging elephant herds silhouetted against the snow-capped peak of Mount Kilimanjaro (weather permitting). Return to the lodge for dinner and an evening briefing.',
        meals:         ['Lunch', 'Dinner'],
        accommodation: 'Amboseli Sopa Lodge',
        activities:    ['Afternoon game drive', 'Kilimanjaro views', 'Elephant herd sightings'],
      },
      {
        day:           2,
        title:         'Full Day in Amboseli',
        description:   'An entire day in Amboseli. Dawn game drive at first light when predators are active along the swamp edges — expect lion, cheetah, hyena and vast elephant herds. Return to the lodge for a full breakfast, then a midday drive to observe wading birds at the swamps and observe hippo pools. Afternoon drive for sundowner photography. Dinner at the lodge.',
        meals:         ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Amboseli Sopa Lodge',
        activities:    ['Sunrise game drive', 'Swamp and hippo viewing', 'Birdwatching', 'Sunset photography'],
      },
      {
        day:           3,
        title:         'Amboseli → Lake Nakuru National Park',
        description:   'After an early breakfast and a morning game drive, drive north through Nairobi and continue into the Rift Valley to Lake Nakuru. Arrive mid-afternoon for check-in at Lake Nakuru Sopa Lodge, perched on the crater rim with stunning lake views. An evening game drive introduces you to the park\'s rhino sanctuary — home to both black and white rhino — and the extraordinary flamingo spectacle on the lake shore.',
        meals:         ['Breakfast', 'Packed Lunch', 'Dinner'],
        accommodation: 'Lake Nakuru Sopa Lodge',
        activities:    ['Morning Amboseli game drive', 'Transfer to Nakuru', 'Evening Nakuru game drive', 'Rhino sanctuary visit'],
      },
      {
        day:           4,
        title:         'Lake Nakuru → Aberdare National Park',
        description:   'Morning game drive in Lake Nakuru — look for Rothschild giraffe, lion, leopard and vast numbers of waterbirds. After breakfast, drive to the Aberdare mountain range and check in at Aberdare Country Club. The afternoon is at leisure, exploring the lush gardens and the trout fishing pond, or embark on a guided nature walk in the highland forest bordering the park.',
        meals:         ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Aberdare Country Club (Sopa Collection)',
        activities:    ['Morning Nakuru game drive', 'Flamingo viewing', 'Transfer to Aberdares', 'Guided forest walk'],
      },
      {
        day:           5,
        title:         'Full Day in the Aberdares',
        description:   'Spend a full day exploring the mysterious Aberdare highland forest. Morning game drive through bamboo thicket, montane forest and open moorland in search of leopard, giant forest hog, bongo antelope and Cape buffalo. The afternoon offers guided walks to spectacular waterfalls — including the magnificent Karuru Falls — and birding along forest trails.',
        meals:         ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Aberdare Country Club (Sopa Collection)',
        activities:    ['Highland forest game drive', 'Waterfall hiking (Karuru Falls)', 'Bongo and forest hog tracking', 'Highland birdwatching'],
      },
      {
        day:           6,
        title:         'Aberdares → Masai Mara National Reserve',
        description:   'Early morning departure from the Aberdares, driving westwards through the scenic Rift Valley and down to the Masai Mara. Arrive at Mara Sopa Lodge in time for lunch. After a brief rest, enjoy a full afternoon game drive in the reserve — vast open savanna, big cat country, and the perennial Mara River where hippos and Nile crocodiles congregate.',
        meals:         ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mara Sopa Lodge',
        activities:    ['Transfer to Masai Mara', 'Afternoon Mara game drive', 'Mara River viewing', 'Sundowner on the plains'],
      },
      {
        day:           7,
        title:         'Full Day in the Masai Mara',
        description:   'A full day dedicated to the legendary Masai Mara. Two game drives — dawn and late afternoon — with a leisurely midday break at the lodge or an optional bush picnic. Track the Big Five with your specialist guide, visit a traditional Maasai village in the afternoon, and enjoy an unforgettable sundowner as the sun sets over the golden grassland.',
        meals:         ['Breakfast', 'Bush Lunch', 'Dinner'],
        accommodation: 'Mara Sopa Lodge',
        activities:    ['Sunrise Big Five game drive', 'Wildebeest / migration tracking (seasonal)', 'Maasai village cultural visit', 'Afternoon game drive', 'Sundowner drinks'],
      },
      {
        day:           8,
        title:         'Masai Mara → Nairobi Departure',
        description:   'Final morning game drive at sunrise before returning to the lodge for breakfast. Check out and begin the scenic drive back to Nairobi, arriving in the afternoon. Transfers to JKIA or Nairobi city hotels included.',
        meals:         ['Breakfast', 'Packed Lunch'],
        accommodation: 'N/A — departure day',
        activities:    ['Final morning game drive', 'Return drive to Nairobi', 'Airport / hotel transfer'],
      },
    ],
    pricing: {
      budget: {
        pricePerPerson:    1850,
        currency:          'USD',
        description:       'Full 8-day circuit staying at Sopa Lodge standard rooms. Comfortable en-suite accommodation, full board at all lodges and shared game drive vehicles.',
        includes:          ['Sopa Lodge standard rooms (7 nights)', 'Full board meals at all lodges', 'Shared 4×4 game drive vehicles', 'All park and reserve fees', 'Professional guide'],
        accommodationType: 'Sopa Lodge Standard Room',
        hotels: [
          { name: 'Amboseli Sopa Lodge',    rating: 3 },
          { name: 'Lake Nakuru Sopa Lodge', rating: 3 },
          { name: 'Mara Sopa Lodge',        rating: 3 },
        ],
      },
      midRange: {
        pricePerPerson:    2550,
        currency:          'USD',
        description:       'Superior room category at all four Sopa Lodges with private game drive vehicle throughout, house wines at dinner, and complimentary laundry service.',
        includes:          ['Sopa Lodge superior rooms (7 nights)', 'Full board + house wines at dinner', 'Private 4×4 Land Cruiser + guide', 'All park and reserve fees', 'Complimentary laundry'],
        accommodationType: 'Sopa Lodge Superior Room',
        hotels: [
          { name: 'Amboseli Sopa Lodge Superior',    rating: 4 },
          { name: 'Lake Nakuru Sopa Lodge Superior', rating: 4 },
          { name: 'Mara Sopa Lodge Superior',        rating: 4 },
        ],
      },
      luxury: {
        pricePerPerson:    3800,
        currency:          'USD',
        description:       'Premium suite accommodation at all lodges, internal flight upgrades where available, personal butler, premium beverages, and exclusive activities including a hot air balloon safari in the Mara.',
        includes:          ['Sopa Lodge suites (7 nights)', 'Full board + premium beverages', 'Private game drive vehicle', 'Masai Mara hot air balloon safari', 'Internal flight where available', 'Personal butler service', 'All fees and taxes'],
        accommodationType: 'Sopa Lodge Suite',
        hotels: [
          { name: 'Amboseli Sopa Lodge Suite',    rating: 5 },
          { name: 'Lake Nakuru Sopa Lodge Suite', rating: 5 },
          { name: 'Mara Sopa Lodge Suite',        rating: 5 },
        ],
      },
    },
    category:      ['wildlife', 'cultural'],
    difficulty:    'easy',
    maxGroupSize:  10,
    minGroupSize:  2,
    minAge:        5,
    bestSeason:    ['January', 'February', 'July', 'August', 'September', 'October'],
    featured:      true,
    active:        true,
    rating:        4.8,
    reviewCount:   42,
    coverImage:         'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=1200&q=80',
    coverImagePublicId: '',
    images:             [],
    seo: {
      metaTitle:       '8 Days Magical Sopa Safari Kenya | Divine Travel Nest',
      metaDescription: 'Eight days across Amboseli, Lake Nakuru, Aberdares and Masai Mara staying at Sopa Lodges. The definitive Kenya safari circuit from USD 1,850/person.',
      keywords:        ['8 day kenya safari', 'sopa lodge safari', 'kenya circuit safari', 'amboseli nakuru mara safari', 'magical kenya safari'],
    },
  },

  // ── 3 ────────────────────────────────────────────────────────────────────────
  {
    name:     '5 Days Kenya Aberdares, Nakuru & Masai Mara',
    slug:     '5-days-kenya-aberdares-nakuru-masai-mara',
    tagline:  'Three iconic ecosystems in five days — highland forest, Rift Valley flamingos, and the Big Five on open savanna',
    description:
      'This five-day Kenya safari perfectly balances diversity with depth. You begin in the cool, mist-shrouded Aberdare mountain forest where leopard, giant forest hog and the elusive bongo roam. Next, descend into the Great Rift Valley to Lake Nakuru — Kenya\'s most concentrated wildlife park, home to hundreds of flamingos, black and white rhino, Rothschild giraffe and lion. Finally, two full days in the Masai Mara deliver classic African savanna safari: Big Five encounters, sweeping golden grasslands, and the timeless drama of predator and prey. A complete Kenyan experience in just five days.',
    location: {
      country:     'Kenya',
      region:      'Multi-park — Aberdares · Nakuru · Masai Mara',
      park:        'Aberdare, Lake Nakuru, Masai Mara',
      coordinates: { lat: -0.4167, lng: 36.6 },
    },
    duration:   5,
    highlights: [
      'Aberdare highland forest — leopard, bongo and giant forest hog',
      'Lake Nakuru — flamingos, rhino sanctuary, Rothschild giraffe',
      'Masai Mara — Big Five and open savanna game drives',
      'Three distinct Kenya ecosystems in a single journey',
      'Professional naturalist guide throughout',
      'Comfortable mid-range lodge accommodation',
      'Optional hot air balloon over the Mara (add-on)',
    ],
    included: [
      'All accommodation (4 nights — see tier)',
      'Full board meals throughout',
      'All road transfers in 4×4 safari vehicle',
      'Professional KATO-certified guide',
      'All national park and reserve entry fees',
      'Morning and afternoon game drives each day',
      'Complimentary bottled water',
      'All applicable government taxes',
    ],
    excluded: [
      'International flights and Kenya visa (USD 50)',
      'Travel and medical insurance',
      'Personal gratuities for guide and camp staff',
      'Alcoholic beverages',
      'Hot air balloon in Mara (approx. USD 450/person — bookable on request)',
      'Personal and medical expenses',
    ],
    itinerary: [
      {
        day:           1,
        title:         'Nairobi → Aberdare National Park',
        description:   'Morning departure from Nairobi heading north through Thika and Karatina into the cool Central Highlands. Arrive at the Aberdares for a late lunch. Afternoon game drive through bamboo forest and moorland. The Aberdares are particularly known for nocturnal visitors — ask your guide about the salt licks and watering holes active at dusk.',
        meals:         ['Lunch', 'Dinner'],
        accommodation: 'Aberdare lodge (see tier)',
        activities:    ['Scenic highlands drive', 'Afternoon forest game drive', 'Salt lick and waterhole viewing at dusk'],
      },
      {
        day:           2,
        title:         'Full Day in the Aberdares → Lake Nakuru',
        description:   'Early morning game drive in the highland forest searching for leopard, cape buffalo, elephant and the rare mountain bongo. After breakfast, drive south-west into the Rift Valley to Lake Nakuru National Park. Check in to your lodge and enjoy an afternoon game drive around the lake shores — the flamingo flocks create one of Africa\'s most photographed spectacles.',
        meals:         ['Breakfast', 'Packed Lunch', 'Dinner'],
        accommodation: 'Lake Nakuru lodge (see tier)',
        activities:    ['Morning Aberdare forest game drive', 'Transfer to Lake Nakuru', 'Afternoon flamingo and rhino viewing'],
      },
      {
        day:           3,
        title:         'Lake Nakuru → Masai Mara National Reserve',
        description:   'Morning game drive at Lake Nakuru — prime time to find the resident lion pride and rhino. After breakfast, drive south-west to the Masai Mara. Arrive in time for lunch and an afternoon game drive on the open savanna plains. The landscape changes dramatically from rocky escarpment to golden grassland as you enter the Mara ecosystem.',
        meals:         ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Masai Mara camp/lodge (see tier)',
        activities:    ['Morning Nakuru game drive (lion, rhino)', 'Transfer to Masai Mara', 'Afternoon savanna game drive'],
      },
      {
        day:           4,
        title:         'Full Day in the Masai Mara',
        description:   'A complete day in the Masai Mara. Rise before dawn for a sunrise game drive — the golden hour when cheetah hunt and lions return from the night. Midday at camp, then an afternoon drive exploring the open grasslands and the Mara River where Nile crocodiles lurk. The evening game drive often yields leopard sightings along the riverine forest edge. Visit a Maasai village and witness traditional dances.',
        meals:         ['Breakfast', 'Bush Lunch', 'Dinner'],
        accommodation: 'Masai Mara camp/lodge (see tier)',
        activities:    ['Sunrise Big Five game drive', 'Mara River crocodile and hippo viewing', 'Maasai village cultural visit', 'Sunset game drive'],
      },
      {
        day:           5,
        title:         'Morning Game Drive → Nairobi Departure',
        description:   'Final sunrise game drive in the Masai Mara before returning to camp for breakfast. Check out and drive back to Nairobi, arriving in the early afternoon. Airport or city hotel transfers included.',
        meals:         ['Breakfast', 'Packed Lunch'],
        accommodation: 'N/A — departure day',
        activities:    ['Final sunrise game drive', 'Nairobi transfer', 'Airport drop-off'],
      },
    ],
    pricing: {
      budget: {
        pricePerPerson:    1100,
        currency:          'USD',
        description:       'Comfortable tented camp and budget lodge accommodation at each park. Shared game vehicles and full board meals throughout. Great value 5-park circuit.',
        includes:          ['Tented camp / budget lodge accommodation (4 nights)', 'Full board meals', 'Shared safari vehicle', 'All park fees', 'Professional guide'],
        accommodationType: 'Tented Camp / Budget Lodge',
        hotels: [
          { name: 'The Ark Lodge',          rating: 3 },
          { name: 'Lake Nakuru Sopa Lodge', rating: 3 },
          { name: 'Mara Simba Lodge',       rating: 3 },
        ],
      },
      midRange: {
        pricePerPerson:    1650,
        currency:          'USD',
        description:       'Mid-range lodge accommodation at all three parks with private game vehicle, dedicated guide, and house beverages at dinner.',
        includes:          ['Mid-range lodge accommodation (4 nights)', 'Full board + house wines', 'Private 4×4 safari vehicle', 'All park and reserve fees', 'Dedicated certified guide'],
        accommodationType: 'Mid-Range Safari Lodge',
        hotels: [
          { name: 'Aberdare Country Club', rating: 4 },
          { name: 'Sarova Lion Hill Lodge', rating: 4 },
          { name: 'Ashnil Mara Camp',       rating: 4 },
        ],
      },
      luxury: {
        pricePerPerson:    2800,
        currency:          'USD',
        description:       'Premium lodge and tented camp experience including exclusive conservancy access in the Mara, top-tier cuisine, and the option to add a hot air balloon flight.',
        includes:          ['Premium lodge / luxury tented camp (4 nights)', 'Full board + premium beverages', 'Private game vehicle', 'All fees', 'Conservancy access for off-road drives', 'Optional balloon flight (at extra cost)'],
        accommodationType: 'Luxury Lodge & Tented Camp',
        hotels: [
          { name: 'Serena Mountain Lodge',      rating: 5 },
          { name: 'Sarova Lion Hill Suite',     rating: 5 },
          { name: 'Angama Mara',                rating: 5 },
        ],
      },
    },
    category:      ['wildlife', 'adventure'],
    difficulty:    'easy',
    maxGroupSize:  8,
    minGroupSize:  2,
    minAge:        5,
    bestSeason:    ['January', 'February', 'June', 'July', 'August', 'September', 'October'],
    featured:      false,
    active:        true,
    rating:        4.7,
    reviewCount:   35,
    coverImage:         'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    coverImagePublicId: '',
    images:             [],
    seo: {
      metaTitle:       '5 Days Aberdares, Nakuru & Masai Mara Safari | Divine Travel Nest',
      metaDescription: 'Five-day Kenya safari combining highland forest, Rift Valley flamingos and Masai Mara Big Five. From USD 1,100/person. Expert guides, full board.',
      keywords:        ['5 day kenya safari', 'aberdares nakuru masai mara', 'kenya circuit safari', 'lake nakuru flamingos safari', 'multi-park kenya safari'],
    },
  },
]

// ─── Seed runner ──────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB:', MONGODB_URI.split('/').pop()?.split('?')[0])

  let upserted = 0

  for (const pkg of packages) {
    await Safari.findOneAndUpdate(
      { slug: pkg.slug },
      { $set: pkg },
      { upsert: true, new: true }
    )
    console.log(`✅ Upserted: ${pkg.name}`)
    upserted++
  }

  console.log(`\n🎉 Done — ${upserted} upserted`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
