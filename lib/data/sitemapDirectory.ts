// Central directory of every page surfaced on /sitemap. Items whose `href`
// points at a route with real data render normally; items pointing at the
// generic "coming soon" routes (wildlife, safari-vehicles, tools,
// african-travel-blog, destinations/*/[park], safaris/[slug] tours &
// collections, accommodations/[type] lodges) fall back to <ComingSoonPage>
// until that content is built out.

export interface SitemapLink {
  title: string;
  href: string;
}

export interface SitemapCategory {
  id: string;
  heading: string;
  links: SitemapLink[];
}

/* ── Safari collections & tour itineraries — rendered via the existing
   /safaris/[slug] route, which falls back to ComingSoon for these slugs
   when no matching package exists in the database ───────────────────── */

export const SAFARI_COLLECTIONS: SitemapLink[] = [
  { title: "Gorilla Trekking", href: "/safaris/gorilla-trekking" },
  { title: "Big Five", href: "/safaris/big-five" },
  { title: "Great Migration", href: "/safaris/great-migration" },
  { title: "Luxury Safaris", href: "/safaris/luxury" },
  { title: "Honeymoon Safaris", href: "/safaris/honeymoon" },
  { title: "Beach & Bush", href: "/safaris/beach-and-bush" },
];

export const SAFARI_TOURS: SitemapLink[] = [
  { title: "7 Days Lakes and Plains Safari: Amboseli, Naivasha, Nakuru & Mara", href: "/safaris/7-days-lakes-and-plains-safari" },
  { title: "10-Day Kenya Safari and Diani Beach Holiday", href: "/safaris/10-day-kenya-safari-and-diani-beach-holiday" },
  { title: "10-Day Luxury Kenya Safari with Flights", href: "/safaris/10-day-luxury-kenya-safari-with-flights" },
  { title: "10-Day Midrange Kenya Safari by Road", href: "/safaris/10-day-midrange-kenya-safari" },
  { title: "3 Days Amboseli Luxury Safari", href: "/safaris/3-days-amboseli-luxury-safari" },
  { title: "3 Days Safari Amboseli National Park", href: "/safaris/3-days-safari-amboseli-national-park" },
  { title: "3-Day Maasai Mara Safari Adventure", href: "/safaris/3-day-maasai-mara-safari-adventure" },
  { title: "4-Day Masai Mara, Lake Nakuru & Lake Naivasha Safari", href: "/safaris/4-day-masai-mara-lake-nakuru-naivasha-safari" },
  { title: "5-Day Luxury Kenya Safari", href: "/safaris/5-day-luxury-kenya-safari" },
  { title: "5-Day Midrange Kenya Safari", href: "/safaris/5-day-midrange-kenya-safari" },
  { title: "6-Day Kenya Safari: Amboseli, Lake Naivasha, Lake Nakuru & Masai Mara", href: "/safaris/6-day-masai-mara-lake-naivasha-lake-nakuru-amboseli-safari" },
  { title: "6-Day Luxury Kenya Safari: Masai Mara, Lake Nakuru, Lake Naivasha & Amboseli", href: "/safaris/6-day-luxury-kenya-safari-masai-mara-lake-nakuru-lake-naivasha-amboseli" },
];

/** Slugs handled by the ComingSoon fallback inside /safaris/[slug]. */
export const SAFARI_COMING_SOON_SLUGS = new Map<string, string>(
  [...SAFARI_COLLECTIONS, ...SAFARI_TOURS].map((l) => [
    l.href.split("/").pop()!,
    l.title,
  ]),
);

/* ── Accommodations — individual partner lodges, rendered via the existing
   /accommodations/[type] route, which falls back to ComingSoon for these
   slugs when the slug isn't one of the three known type categories ────── */

export const ACCOMMODATION_LODGES: SitemapLink[] = [
  "AA Lodge Amboseli|aa-lodge-amboseli",
  "Almanara Luxury Villas|almanara-luxury-villas",
  "Amboseli Sopa Lodge|amboseli-sopa-lodge",
  "Amuka Lodge|amuka-lodge",
  "Angama Mara|angama-mara",
  "Arcadia Cottages|arcadia-cottages",
  "Arusha Serena|arusha-serena",
  "Ashnil Mara Camp|ashnil-mara-camp",
  "Avian Court Hotel|avian-court-hotel",
  "Baobab Beach Resort|baobab-beach-resort",
  "Chui Lodge|chui-lodge",
  "Elephant Bedroom Camp|elephant-bedroom-camp",
  "Elerai Camp|elerai-camp",
  "Elewana Kilindi Zanzibar|elewana-kilindi-zanzibar",
  "Elewana Sand River Masai Mara|elewana-sand-river-masai-mara",
  "Elewana Tarangire Treetops|elewana-tarangire-treetops",
  "Elewana Tortilis Camp Amboseli|elewana-tortilis-camp-amboseli",
  "Emburara Farm Lodge|emburara-farm-lodge",
  "Enashipai Resort & Spa|enashipai-resort-spa",
  "Endeem Mara Resort|endeem-mara-resort",
  "Enkorok Mara Camp|enkorok-mara-camp",
  "Essque Zalu Zanzibar|essque-zalu-zanzibar",
  "Fairmont Mount Kenya Safari Club|fairmont-mount-kenya-safari-club",
  "Four Points Sheraton Kigali|four-points-sheraton-kigali",
  "Four Points by Sheraton Nairobi Hurlingham|four-points-sheraton",
  "Four Seasons|four-seasons",
  "Gorillas Lake Kivu Resort|gorillas-lake-kivu",
  "Hemingways Watamu|hemingways-watamu",
  "Ikweta Safari Camp|ikweta-safari-camp",
  "Kibo Safari Camp|kibo-safari-camp",
  "Kisiwa on the Beach - Luxury Villas and Spa|kisiwa-on-the-beach-luxury-villas-and-spa",
  "Kontiki Serengeti|kontiki-serengeti",
  "KumbuKumbu Luxury Tented Camp|kumbukumbu-luxury-tented-camp",
  "Lake Naivasha Lodge|lake-naivasha-lodge",
  "Lake Naivasha Simba Lodge|lake-naivasha-simba-lodge",
  "Lake Naivasha Sopa Resort|lake-naivasha-sopa-resort",
  "Lake Nakuru Sopa Lodge|lake-nakuru-sopa-lodge",
  "Lake Victoria Golf Resort|lake-victoria-golf-resort",
  "Little Amanya Camp|little-amanya-camp",
  "Mahali Mzuri|mahali-mzuri",
  "Mara Bushtops Camp|mara-bushtops-camp",
  "Mara Kimana Camp|mara-kimana-camp",
  "Mara Maisha Camp|mara-maisha-camp",
  "Mara River Camp|mara-river-camp",
  "Mara Serena Safari Lodge|mara-serena-safari-lodge",
  "Mara Sopa Lodge|mara-sopa-lodge",
  "Masindi Hotel|masindi-hotel",
  "Mbale Resort Hotel|mbale-resort-hotel",
  "Medina Palms|medina-palms",
  "Melia Arusha|melia-arusha",
  "Melia Zanzibar|melia-zanzibar",
  "Mount Gahinga Hotel|mount-gahinga-hotel",
  "Muthu Keekorok Lodge|muthu-keekorok-lodge",
  "Neptune Ngorongoro Luxury Lodge|neptune-ngorongoro-luxury-lodge",
  "Ngorongoro Serena|ngorongoro-serena",
  "Ngutuni Lodge|ngutuni-lodge",
  "Ol Tukai Lodge|ol-tukai-lodge",
  "Ol Kinyei Mara Tented Camp|ol-kinyei-mara-tented-camp",
  "One&Only Gorillas Nest|one-only-gorillas-nest",
  "One&Only Nyungwe House|one-only-nyungwe-house",
  "Osotua Luxury Resort|osotua-luxury-resort",
  "Park Hyatt Zanzibar|park-hyatt-zanzibar",
  "Pearl Mara|pearl-mara",
  "Praro Amboseli|praro-amboseli",
  "Radisson Hotel & Blue|radisson-hotel-blue",
  "Rebero Resort|rebero-resort",
  "Residence Zanzibar Resort|residence-zanzibar",
  "Salt Lick Safari Lodge|salt-lick-safari-lodge",
  "Samburu Intrepids|samburu-interepids",
  "Samburu Sopa Lodge|samburu-sopa-lodge",
  "Sarova Lion Hill Game Lodge|sarova-lion-hill-game-lodge",
  "Sarova Mara Game Camp|sarova-mara-game-camp",
  "Satao Elerai Camp|satao-elerai-camp",
  "Sawela Lodge|sawela-lodge",
  "Sentrim Amboseli|sentrim-amboseli",
  "Sentrim Maasai Mara|sentrim-maasai-mara",
  "Serena Beach Resort|serena-beach-resort",
  "Serengeti Under Canvas|serengeti-under-canvas",
  "Soroi Cheetah Camp|soroi-cheetah-camp",
  "Soroi Lion Bluffs|soroi-lion-bluffs",
  "Sweet Waters Serena Camp|sweet-waters-serena-camp",
  "Taita Hills Safari Resort & Spa|taita-hills-safari-resort-spa",
  "Tarangire Safari Lodge|tarangire-safari-lodge",
  "Tarangire Sopa Lodge|tarangire-sopa-lodge",
  "Tha Nickolee Hotel|tha-nickolee-hotel",
  "The Ark Lodge|the-ark-lodge",
  "The Cliff Nakuru|the-cliff-nakuru",
  "The Manor at Ngorongoro|the-manor-at-ngorongoro",
  "The Nakuru Lodge|the-nakuru-lodge",
  "The Palms Zanzibar|the-plams-zanzibar",
  "The River Camp|the-river-camp",
  "The Tawi Lodge|the-tawi-lodge",
  "Tortilis Camp|tortilis-camp",
  "Travellers Rest Hotel|travellers-rest-hotel",
  "Turtle Bay Beach Club|turtle-bay-beach-club",
  "Volcanoes Safaris Bwindi Lodge|bwindi-lodge",
  "Voyager Beach Resort|voyager-beach-resort",
  "Wildnest Mara Camp|wildnest-mara-camp",
  "Zanzibar Beach Resort|zanzibar-beach-resort",
  "Zebra Plains Mara Camp|zebra-plains-mara-camp",
  "Ziwa Bush Lodge|ziwa-bush-lodge",
  "Zuri Zanzibar|zuri-zanzibar",
  "Diamond Leisure Beach Resort|diamond-leisure-beach-resort",
  "Swahili Beach Resort|swahili-beach-resort",
].map((row) => {
  const [title, slug] = row.split("|");
  return { title, href: `/accommodations/${slug}` };
});

/** Slugs handled by the ComingSoon fallback inside /accommodations/[type]. */
export const ACCOMMODATION_COMING_SOON_SLUGS = new Map<string, string>(
  ACCOMMODATION_LODGES.map((l) => [l.href.split("/").pop()!, l.title]),
);

/* ── Destinations — individual parks/reserves nested under each country's
   existing destination page, e.g. /destinations/kenya/amboseli-national-park.
   Each /destinations/<country>/[park]/page.tsx renders ComingSoon. ─────── */

type Country = "kenya" | "tanzania" | "uganda" | "rwanda";

const DESTINATION_PARK_ROWS: Record<Country, string[]> = {
  kenya: [
    "Nakuru City|nakuru-city",
    "Aberdare National Park|aberdare-national-park",
    "Amboseli National Park|amboseli-national-park",
    "Diani Beach|diani-beach",
    "Hells Gate National Park|hells-gate-national-park",
    "Kisite-Mpunguti Marine National Park|kisite-mpunguti-marine-national-park",
    "Lake Naivasha|lake-naivasha",
    "Lake Nakuru National Park|lake-nakuru-national-park",
    "Lewa Conservancy|lewa-conservancy",
    "Lumo Community Wildlife Conservancy|lumo-community-wildlife-conservancy",
    "Masai Mara National Reserve|masai-mara-national-reserve",
    "Meru National Park|meru-national-park",
    "Mombasa|mombasa",
    "Mount Kenya National Park|mount-kenya-national-park",
    "Nairobi City|nairobi-city",
    "Nairobi National Park|nairobi-national-park",
    "Ol Pejeta Conservancy|ol-pejeta-conservancy",
    "Samburu National Reserve|samburu-national-reserve",
    "Shimba Hills National Reserve|shimba-hills-national-reserve",
    "Tsavo East National Park|tsavo-east-national-park",
    "Tsavo West National Park|tsavo-west-national-park",
    "Watamu|watamu",
  ],
  tanzania: [
    "Kilimanjaro|kilimanjaro",
    "Mount Meru|mount-meru",
    "Ngorongoro Crater|ngorongoro-crater",
    "Ngorongoro Crater Park|ngorongoro-crater-park",
    "Ruaha National Park|ruaha-national-park",
    "Serengeti National Park|serengeti",
    "Tarangire National Park|tarangire-national-park",
    "Zanzibar|zanzibar",
  ],
  uganda: [
    "Bwindi Impenetrable Forest|bwindi-impenetrable-forest",
    "Kibale National Park|kibale-national-park",
    "Lake Mburo National Park|lake-mburo-national-park",
    "Mount Elgon National Park|mount-elgon-national-park",
    "Murchison Falls National Park|murchison-falls",
    "Queen Elizabeth National Park|queen-elizabeth-national-park",
    "Rwenzori Mountains National Park|rwenzori-mountains-national-park",
  ],
  rwanda: [
    "Akagera National Park|akagera-national-park",
    "Nyungwe Forest|nyungwe-forest",
    "Volcanoes National Park|volcanoes-national-park",
  ],
};

export const DESTINATION_PARKS: Record<Country, SitemapLink[]> = Object.fromEntries(
  (Object.keys(DESTINATION_PARK_ROWS) as Country[]).map((country) => [
    country,
    DESTINATION_PARK_ROWS[country].map((row) => {
      const [title, slug] = row.split("|");
      return { title, href: `/destinations/${country}/${slug}` };
    }),
  ]),
) as Record<Country, SitemapLink[]>;

/** Per-country slug → title lookup, used by /destinations/<country>/[park]. */
export const DESTINATION_PARK_TITLES: Record<Country, Map<string, string>> =
  Object.fromEntries(
    (Object.keys(DESTINATION_PARK_ROWS) as Country[]).map((country) => [
      country,
      new Map(
        DESTINATION_PARK_ROWS[country].map((row) => {
          const [title, slug] = row.split("|");
          return [slug, title];
        }),
      ),
    ]),
  ) as Record<Country, Map<string, string>>;

/* ── Wildlife guide — /wildlife/[slug] ───────────────────────────────── */

export const WILDLIFE_SPECIES: SitemapLink[] = [
  "African Elephant|african-elephant",
  "African Leopard|leopard",
  "African Lion|lion",
  "Baboon|baboon",
  "Black Rhinoceros|black-rhinoceros",
  "Black Rhinoceros|rhino",
  "Blue Wildebeest|blue-wildebeest",
  "Cape Buffalo|cape-buffalo",
  "Cheetah|cheetah",
  "Common Ostrich|common-ostrich",
  "Crocodile|crocodile",
  "Eland|eland",
  "Flamingo|flamingo",
  "Grant's Gazelle|grant-gazelle",
  "Hartebeest|hartebeest",
  "Hippopotamus|hippopotamus",
  "Hyena|hyena",
  "Jackal|jackal",
  "Lilac-Breasted Roller|lilac",
  "Marabou Stork|marabou-woodstick",
  "Masai Giraffe|giraffe",
  "Mountain Gorilla|mountain-gorilla",
  "Ostrich|ostrich",
  "Plains Zebra|plains-zebra",
  "Reticulated Giraffe|reticulated-giraffe",
  "Secretary Bird|secretary-bird",
  "Somali Ostrich|somali-ostrich",
  "Topi Antelope|topi-antelope",
  "Vulture|vulture",
  "Waterbuck|waterbuck",
  "Oryx|oryx",
].map((row) => {
  const [title, slug] = row.split("|");
  return { title, href: `/wildlife/${slug}` };
});

export const WILDLIFE_COMING_SOON_SLUGS = new Map<string, string>(
  WILDLIFE_SPECIES.map((l) => [l.href.split("/").pop()!, l.title]),
);

/* ── Safari vehicles — /safari-vehicles/[slug] ───────────────────────── */

export const SAFARI_VEHICLES: SitemapLink[] = [
  "4×4 Safari Land Cruiser|4x4-safari-land-cruiser",
  "4×4 Safari Van|4x4-safari-van",
  "Land Cruiser Prado / V8|land-cruiser-prado-v8",
  "Mini Bus / Rosa Bus|mini-bus-rosa-bus",
  "Open-Sided Land Cruiser|open-sided-land-cruiser",
  "Overland Safari Truck|overland-safari-truck",
  "Toyota Alphard / Velfire|toyota-alphard-velfire",
  "Toyota Noah / Voxy|toyota-noah-voxy",
].map((row) => {
  const [title, slug] = row.split("|");
  return { title, href: `/safari-vehicles/${slug}` };
});

export const SAFARI_VEHICLE_COMING_SOON_SLUGS = new Map<string, string>(
  SAFARI_VEHICLES.map((l) => [l.href.split("/").pop()!, l.title]),
);

/* ── Planning tools — /tools/[slug] ──────────────────────────────────── */

export const PLANNING_TOOLS: SitemapLink[] = [
  "Safari Cost Calculator|safari-cost-calculator",
  "Packing Checklist|packing-checklist",
  "Currency Converter|currency-converter",
  "Safari Quiz|safari-quiz",
  "Best Time to Visit|best-time-to-visit",
  "Travel & Visa Guide|travel-visa-guide",
].map((row) => {
  const [title, slug] = row.split("|");
  return { title, href: `/tools/${slug}` };
});

export const PLANNING_TOOL_COMING_SOON_SLUGS = new Map<string, string>(
  PLANNING_TOOLS.map((l) => [l.href.split("/").pop()!, l.title]),
);

/* ── Travel guides & articles — /african-travel-blog/[slug] ──────────── */

export const TRAVEL_ARTICLES: SitemapLink[] = [
  "African Safari: What Happens on a Game Drive?|african-safari-game-drive",
  "Safari in Kenya: Best Month for Wildlife|safari-in-kenya-best-month",
  "The Best East Africa Safari Countries for Local Culture|cultural-encounters-meeting-the-maasai-and-other-tribes-on-safari",
  "Kenya Safari Vaccinations: What You Actually Need Before You Go|kenya-safari-vaccinations-health-guide",
  "Safari in the Masai Mara: Migration When & Where|kenyas-great-migration-when-and-where-to-see-it",
  "Africa Safari in Kenya: What to Expect|what-to-expect-in-a-safari-in-kenya",
  "Kenya Cultural Safari Experiences: Practical Guide|cultural-experiences-on-a-kenyan-safari",
  "East African Luxury Safari Operator: Complete Guide|east-african-luxury-safari-operator-complete-guide",
  "Africa Safari: How the African Leopard Hides Spots|how-the-african-leopard-hides-its-spots-on-safari",
  "Expert Advice: Solo Safari in Kenya|safari-expert-advice-being-a-solo-traveler-in-kenya",
  "Amboseli National Park Mt Kilimanjaro Views Explained|amboseli-national-park-mt-kilimanjaro-views",
  "Kenya Green Season Safari: January to March Guide|why-travel-to-kenya-in-the-green-season-january-to-march",
  "Tallest Mountains in Kenya: A Complete Climber's Guide|what-are-the-tallest-mountains-in-kenya",
  "Tallest Mountains in Africa: A Guide to the Highest Peaks|what-are-the-tallest-mountains-in-africa",
  "Kenya Safari Masai Mara with Toddlers: A Family Guide|a-kenya-family-safari-with-toddlers",
  "Travel Insurance: Don't Travel to Africa Without It|travel-insurance-dont-travel-to-africa-without-it",
  "African Safari Souvenirs: What to Buy in East Africa|handcrafted-souvenirs-you-should-buy-when-you-visit-africa-for-safari",
  "Kenya Travel Guide for Chinese Visitors|kenya-travel-guide-for-chinese-visitors",
  "Safari In The Masai Mara: First-Timer's East Africa Guide|a-firsttimers-guide-to-planning-a-safari-in-east-africa",
  "Kenya African Safari vs Tanzania: Which Is Better?|kenya-vs-tanzania-for-a-safari",
  "Amboseli National Park Wildlife: What You'll See|amboseli-national-park-wildlife",
].map((row) => {
  const [title, slug] = row.split("|");
  return { title, href: `/african-travel-blog/${slug}` };
});

export const TRAVEL_ARTICLE_COMING_SOON_SLUGS = new Map<string, string>(
  TRAVEL_ARTICLES.map((l) => [l.href.split("/").pop()!, l.title]),
);

/* ── Full sitemap page structure ──────────────────────────────────────── */

export const SITEMAP_CATEGORIES: SitemapCategory[] = [
  {
    id: "main",
    heading: "Main Pages",
    links: [
      { title: "Home", href: "/" },
      { title: "All Safaris", href: "/safaris" },
      { title: "Destinations", href: "/destinations" },
      { title: "Countries", href: "/countries" },
      { title: "Wildlife Guide", href: "/wildlife" },
      { title: "Accommodations", href: "/accommodations" },
      { title: "Journal / Blog", href: "/journal" },
      { title: "Plan a Safari", href: "/plan-my-safari" },
      { title: "Reviews", href: "/reviews" },
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "FAQ", href: "/faq" },
      { title: "Safari Vehicles", href: "/safari-vehicles" },
      { title: "Family Safaris", href: "/safari-with-kids" },
      { title: "Travel Agents", href: "/travel-agents" },
      { title: "Compare Destinations", href: "/compare-safari-destinations" },
    ],
  },
  { id: "collections", heading: "Safari Collections", links: SAFARI_COLLECTIONS },
  {
    id: "tools",
    heading: "Planning Tools",
    links: [{ title: "Safari Planning Tools", href: "/tools" }, ...PLANNING_TOOLS],
  },
  {
    id: "countries",
    heading: "Countries",
    links: [
      { title: "Kenya", href: "/destinations/kenya" },
      { title: "Kenya Safaris", href: "/safaris/kenya" },
      { title: "Rwanda", href: "/destinations/rwanda" },
      { title: "Rwanda Safaris", href: "/safaris/rwanda" },
      { title: "Tanzania", href: "/destinations/tanzania" },
      { title: "Tanzania Safaris", href: "/safaris/tanzania" },
      { title: "Uganda", href: "/destinations/uganda" },
      { title: "Uganda Safaris", href: "/safaris/uganda" },
    ],
  },
  {
    id: "destinations",
    heading: "Destinations",
    links: [
      ...DESTINATION_PARKS.kenya,
      ...DESTINATION_PARKS.rwanda,
      ...DESTINATION_PARKS.tanzania,
      ...DESTINATION_PARKS.uganda,
    ],
  },
  { id: "tours", heading: "Safari Tours", links: SAFARI_TOURS },
  { id: "wildlife", heading: "Wildlife Guides", links: WILDLIFE_SPECIES },
  { id: "accommodations", heading: "Accommodations", links: ACCOMMODATION_LODGES },
  { id: "articles", heading: "Travel Guides & Articles", links: TRAVEL_ARTICLES },
  { id: "vehicles", heading: "Safari Vehicles", links: SAFARI_VEHICLES },
];
