export interface VehicleSpec {
  label: string;
  value: string;
}

export interface SafariVehicleData {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  description: string[];
  specs: VehicleSpec[];
  bestFor: string[];
  features: string[];
}

export const SAFARI_VEHICLES_DATA: SafariVehicleData[] = [
  {
    slug: "4x4-safari-land-cruiser",
    title: "4×4 Safari Land Cruiser",
    tagline: "The gold standard of East Africa safari vehicles",
    image: "https://images.pexels.com/photos/3756145/pexels-photo-3756145.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
    imageAlt: "Toyota Land Cruiser 4x4 on a safari game drive",
    description: [
      "The Toyota Land Cruiser — primarily the 79 and 76 Series — is the definitive East African safari vehicle. With a rugged ladder-frame chassis, high ground clearance, and a permanently installed pop-up roof, it handles everything from Amboseli's dusty plains to Murchison Falls' muddy tracks without hesitation.",
      "Our Land Cruisers are fitted with reinforced suspension for off-road stability, carry spare wheels and full recovery gear, and are maintained to a strict service schedule. The pop-up roof allows all passengers to stand and enjoy unobstructed 360° views during game drives — critical when you're watching a leopard move through acacia woodland or a lion pride hunting at dusk.",
      "With a maximum of 7 passengers, each person gets a window seat and direct sightlines. The cabin is wide enough for camera gear and binoculars to be laid out between seats, and a fridge keeps drinks cold through multi-day circuits.",
    ],
    specs: [
      { label: "Capacity", value: "Up to 7 passengers" },
      { label: "Roof type", value: "Permanent pop-up safari roof" },
      { label: "Drive", value: "4WD with differential lock" },
      { label: "Fuel", value: "Diesel" },
      { label: "Engine", value: "4.2 L turbo diesel" },
      { label: "Ground clearance", value: "230 mm" },
    ],
    bestFor: [
      "Couples and small private groups",
      "Luxury and midrange safaris",
      "Challenging off-road terrain",
      "Photographic safaris requiring stability",
      "Multi-day Masai Mara, Serengeti, or Amboseli circuits",
    ],
    features: [
      "360° pop-up roof for unobstructed game viewing",
      "Onboard fridge / cooler box",
      "USB charging points at every seat",
      "Privacy curtains on all windows",
      "First-aid kit and emergency gear",
      "Dual spare tyres and recovery equipment",
      "Heavy-duty reinforced suspension",
    ],
  },
  {
    slug: "safari-van",
    title: "Safari Van",
    tagline: "Versatile and comfortable for groups of up to 9",
    image: "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
    imageAlt: "Safari van on a game drive in East Africa",
    description: [
      "The Toyota HiAce High-Roof safari van is East Africa's most widely used midrange game-drive vehicle. Its tall cabin gives passengers a commanding elevated view, while the full-length pop-up roof turns every seat into a standing game-viewing platform. Wider than a Land Cruiser, the HiAce comfortably seats groups of up to 9 without feeling cramped.",
      "Built on Toyota's time-tested rear-wheel-drive platform, the safari van handles savannah roads, gravel tracks, and lodge approaches with ease. It is the vehicle of choice for families, friend groups, and tour groups that want the full game-drive experience at a more accessible price point.",
      "Inside, individually adjustable seats are positioned so every passenger has direct window access. A rooftop hatch provides standing-height views during sightings, and the luggage compartment in the rear handles bags for circuits lasting several days.",
    ],
    specs: [
      { label: "Capacity", value: "Up to 9 passengers" },
      { label: "Roof type", value: "Full-length pop-up panoramic roof" },
      { label: "Drive", value: "RWD" },
      { label: "Fuel", value: "Diesel" },
      { label: "Luggage", value: "Dedicated rear storage compartment" },
    ],
    bestFor: [
      "Small groups of 5–9 people",
      "Budget and midrange safaris",
      "Families with children",
      "Wildlife photography on standard game-drive routes",
      "Kenya, Tanzania, and Uganda safari circuits",
    ],
    features: [
      "Full-length pop-up panoramic roof",
      "Individual seats with window access at every position",
      "Onboard cooler box",
      "USB charging ports",
      "Rear luggage compartment",
      "Curtains for privacy between drives",
    ],
  },
  {
    slug: "minibus-coaster-bus",
    title: "Mini Bus / Coaster Bus",
    tagline: "Comfortable group travel for 20–30 passengers",
    image: "https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
    imageAlt: "Safari coaster bus parked at a national park gate in Kenya",
    description: [
      "The Toyota Coaster and similar minibus models seat 20–30 passengers in air-conditioned comfort, making them the practical choice for larger groups that want to travel together on multi-day safari circuits. Commonly used for airport transfers, lodge-to-lodge transfers, and full group safaris across Kenya and Tanzania.",
      "Select Coaster configurations are fitted with a pop-up or raised roof for game drives; others serve primarily as comfortable transfer and road vehicles supplemented by open-sided 4×4 game-drive vehicles at each park. Either way, reclining seats, generous legroom, and large panoramic windows make long drives between parks comfortable for all passengers.",
      "A full-width luggage bay beneath the passenger floor stores hard cases, duffel bags, and camera equipment securely. An on-board PA system lets guides share wildlife information and itinerary updates with the whole group while in transit.",
    ],
    specs: [
      { label: "Capacity", value: "20–30 passengers" },
      { label: "Roof type", value: "Standard or partial pop-up (model dependent)" },
      { label: "Drive", value: "RWD diesel" },
      { label: "Air conditioning", value: "Yes" },
      { label: "Luggage", value: "Full-width underfloor luggage bay" },
    ],
    bestFor: [
      "Large groups (10–30 people)",
      "Corporate travel and incentive trips",
      "School and college safari programmes",
      "Multi-destination circuits covering several parks",
      "Long-distance transfers between Nairobi, Mombasa, and Arusha",
    ],
    features: [
      "Air-conditioning throughout",
      "Reclining seats with headrests",
      "Large panoramic windows",
      "Full-width underfloor luggage bay",
      "On-board PA system",
      "Optional partial pop-up roof for game drives",
    ],
  },
  {
    slug: "overland-safari-truck",
    title: "Overland Safari Truck",
    tagline: "The expedition way to cross East Africa",
    image: "https://images.pexels.com/photos/3278899/pexels-photo-3278899.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
    imageAlt: "Overland safari truck in the African bush",
    description: [
      "Overland trucks are purpose-built expedition vehicles with elevated, open-air seating decks mounted on heavy-duty 4WD truck chassis — typically Mercedes-Benz Actros, MAN, or Iveco Daily builds. Every seat on the raised deck delivers a panoramic view above the surrounding bush, giving passengers a perspective that no standard safari vehicle can match.",
      "These trucks are engineered to carry everything needed for weeks on the road: camping equipment, water tanks, a full kitchen prep area, group food provisions, and recovery gear. They are the vehicle of choice for overland routes that cross multiple countries — Kenya, Tanzania, Uganda, and Rwanda — typically camping in national parks along the way.",
      "The combination of go-anywhere 4WD capability, high ground clearance, and enormous under-seat expedition lockers means overland trucks can access remote campsites and wilderness areas that smaller vehicles cannot comfortably reach for multi-night stays.",
    ],
    specs: [
      { label: "Capacity", value: "18–24 passengers" },
      { label: "Seating", value: "Elevated open-air deck with individual seats" },
      { label: "Drive", value: "4WD / AWD heavy truck" },
      { label: "Storage", value: "Under-seat expedition lockers + roof rack" },
      { label: "Onboard water", value: "Fresh-water tank (capacity varies)" },
    ],
    bestFor: [
      "Multi-week overland routes across East Africa",
      "Budget adventure and camping safaris",
      "Groups wanting a communal expedition experience",
      "Routes that include remote wilderness campsites",
      "Travellers combining Kenya, Tanzania, Uganda, and Rwanda",
    ],
    features: [
      "Elevated open-air viewing deck above the bush line",
      "Under-seat expedition lockers for every passenger",
      "Onboard kitchen prep and provisions storage",
      "Fresh-water tank and jerry-can reserves",
      "Full camping kit (tents, sleeping mats, cooking gear)",
      "High-lift jack, snatch strap, and recovery boards",
      "Roof rack for additional luggage and fuel",
    ],
  },
];

export const SAFARI_VEHICLE_SLUGS = new Map<string, SafariVehicleData>(
  SAFARI_VEHICLES_DATA.map((v) => [v.slug, v]),
);
