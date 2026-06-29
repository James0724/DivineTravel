// Content map for the /safari-types index + /safari-types/[type] pages.
// Three dimensions of "safari type" — distinct from the thematic `category`
// field (wildlife, beach, cultural, etc):
//   - "activity": the format/style of the experience (how it's run)
//   - "traveller": who the trip is designed around (who you travel with)
//   - "theme": the curated collection it belongs to (synced with
//     SAFARI_COLLECTIONS in lib/data/sitemapDirectory.ts)
// A safari package can carry any mix of values from any group.

export type SafariTypeGroup = "activity" | "traveller" | "theme";

export interface SafariTypeConfig {
  slug: string;
  group: SafariTypeGroup;
  label: string;
  shortLabel: string;
  heroImage: string;
  heroImageAlt: string;
  heroDescription: string;
  cardDescription: string;
  intro: { heading: string; body: string };
  bestFor: string[];
  whatToExpect: { n: string; title: string; body: string }[];
  /** Practical, logistical tips — distinct from `whatToExpect` (the shape of the experience). */
  goodToKnow: string[];
  /** Slugs of 2-3 complementary safari types (from either group) to cross-link. */
  pairsWith: string[];
  faqs: { q: string; a: string }[];
}

const STOCK_IMAGES = {
  mara: "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
  serengeti: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
  journal: "https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
  vehicle: "https://images.pexels.com/photos/13932855/pexels-photo-13932855.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
  savannah: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=75",
};

export const SAFARI_TYPES: SafariTypeConfig[] = [
  // ── Activity types: Safari your way ─────────────────────────────────────
  {
    slug: "walking",
    group: "activity",
    label: "Walking Safari",
    shortLabel: "Walking",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Walking safari guide leading guests through the bush",
    heroDescription:
      "Step out of the vehicle and onto the trail. Armed guides and trackers lead you on foot through the bush — reading tracks, smelling the air, hearing the savannah at the pace it deserves.",
    cardDescription: "On foot with an armed guide — read tracks, smell the bush, feel the scale of it all.",
    intro: {
      heading: "A different way to see the wild",
      body:
        "A walking safari trades the engine for footsteps. You move slower, get closer to the small things — dung beetles, bird calls, animal tracks — and build a far deeper understanding of the ecosystem than a game drive alone can offer. It is also the only way to experience gorilla and chimp trekking in Uganda and Rwanda.",
    },
    bestFor: [
      "Travellers who want an active, immersive experience",
      "Gorilla & chimpanzee trekking in Uganda and Rwanda",
      "Photographers chasing a lower, more intimate angle",
      "Anyone wanting to learn bush-craft, not just spot animals",
    ],
    whatToExpect: [
      { n: "01", title: "Armed, certified guides", body: "Every walk is led by a licensed guide and, where required, an armed ranger for your safety." },
      { n: "02", title: "Shorter daily distances", body: "Walks are paced for comfort — typically 2-4 hours, not endurance hikes." },
      { n: "03", title: "Closer to the small things", body: "Tracks, dung, termite mounds, birdlife — the details a vehicle drives past." },
      { n: "04", title: "Often paired with game drives", body: "Most itineraries mix walking mornings with vehicle-based afternoons." },
    ],
    goodToKnow: [
      "Usually included free or for a small permit fee at lodges that offer it",
      "Best paired with at least one full vehicle-based day so you don't miss wider park sightings",
      "Not available in every park — ask us to confirm before booking",
    ],
    pairsWith: ["game-drive", "photographic", "family"],
    faqs: [
      { q: "Is a walking safari safe?", a: "Yes — walks are led by licensed guides (and armed rangers where the law requires it) who are trained to read animal behaviour and keep a safe distance at all times." },
      { q: "Do I need to be very fit?", a: "No. Most walking safaris are gentle, 2-4 hour outings. Gorilla and chimp trekking can be more physically demanding depending on terrain — we will match the route to your fitness level." },
      { q: "What should I wear?", a: "Closed, comfortable walking shoes, neutral-coloured clothing and a hat. We will send a full packing list once your trip is confirmed." },
    ],
  },
  {
    slug: "photographic",
    group: "activity",
    label: "Photographic Safari",
    shortLabel: "Photographic",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Photographer with a long lens framing wildlife from a safari vehicle",
    heroDescription:
      "Built around the shot — extended time at sightings, photography-literate guides, and vehicles set up for a clean, wide field of view.",
    cardDescription: "Extended time at sightings, photo-trained guides and camera-friendly vehicles.",
    intro: {
      heading: "Safari, through the lens",
      body:
        "A photographic safari prioritises light, patience and positioning over ticking off species — smaller groups, guides who understand angles and behaviour, and itineraries that linger at a sighting rather than rushing to the next one. Some itineraries add a dedicated photography vehicle with beanbags, extra battery power and a guide who doubles as a spotter.",
    },
    bestFor: [
      "Serious and enthusiast photographers",
      "Travellers who prefer fewer, longer sightings over many short ones",
      "Golden-hour focused itineraries",
      "Specialist hides and photography vehicles where available",
    ],
    whatToExpect: [
      { n: "01", title: "Photography-literate guiding", body: "Guides position the vehicle for light and angle, not just proximity." },
      { n: "02", title: "Longer dwell time per sighting", body: "Itineraries favour staying with a sighting over covering more ground." },
      { n: "03", title: "Early starts, late finishes", body: "Drives are timed around golden hour light at dawn and dusk." },
      { n: "04", title: "Optional specialist kit", body: "Beanbags, extra power banks and hide access on request." },
    ],
    goodToKnow: [
      "A private vehicle makes the biggest difference — shared vehicles can't always stop and wait as long as you'd like",
      "Best paired with the dry season (June-October) for clearer skies and concentrated wildlife",
      "Tell us your subject — predators, birds, landscapes — so we route the trip around it",
    ],
    pairsWith: ["walking", "night", "private"],
    faqs: [
      { q: "Do I need a professional camera?", a: "No — we tailor the pace to whatever you are shooting with, from a phone to a full professional kit. The itinerary style is what changes, not the gear requirement." },
      { q: "Can I have a private vehicle for photography?", a: "Yes — most serious photographers travel in a private vehicle so the pace and positioning are entirely about the shot." },
      { q: "Which parks are best for photography?", a: "The Masai Mara and Serengeti's open plains give the cleanest backgrounds; we will match the park to the subject you're chasing." },
    ],
  },
  {
    slug: "water-based",
    group: "activity",
    label: "Water-Based Safari",
    shortLabel: "Water-Based",
    heroImage: STOCK_IMAGES.serengeti,
    heroImageAlt: "Boat safari on a river with hippos in the water",
    heroDescription:
      "Glide silently along rivers and lakes for an entirely different angle on the wildlife — hippos, crocodiles, elephants at the water's edge and birdlife you simply won't see from a vehicle.",
    cardDescription: "Glide along rivers and lakes for the wildlife you can't see from a vehicle.",
    intro: {
      heading: "The water-level safari",
      body:
        "Rivers and lakes such as the Kazinga Channel and the Nile in Uganda, or Lake Naivasha in Kenya, offer a water-level vantage point that game drives can't replicate — hippo pods, basking crocodiles, elephants drinking, and exceptional birdlife, all approached quietly by boat or canoe.",
    },
    bestFor: [
      "Birdwatchers and photographers",
      "A relaxing break between game drives",
      "Seeing hippos and crocodiles up close, safely",
      "Uganda's Kazinga Channel and Nile river circuits",
    ],
    whatToExpect: [
      { n: "01", title: "Guided boat launches", body: "Covered, stable boats with a knowledgeable boat captain/guide." },
      { n: "02", title: "Close, quiet wildlife encounters", body: "Engines are cut near sightings for a calm, undisturbed view." },
      { n: "03", title: "Exceptional birding", body: "Kingfishers, fish eagles, herons and more along the water's edge." },
      { n: "04", title: "Usually 1-2 hours", body: "Typically added as a half-day activity within a wider itinerary." },
    ],
    goodToKnow: [
      "Usually a half-day add-on rather than a full itinerary on its own",
      "Best in the dry season when water levels concentrate wildlife along the banks",
      "Life jackets are provided and required for all guests, including strong swimmers",
    ],
    pairsWith: ["birding", "family", "wellness"],
    faqs: [
      { q: "Is a boat safari safe with hippos and crocodiles nearby?", a: "Yes — experienced boat captains keep a safe, respectful distance at all times. These are some of our most-loved, lowest-risk activities." },
      { q: "Where can I do a boat safari?", a: "Uganda's Kazinga Channel and Nile (Murchison Falls) are the most popular, alongside Lake Naivasha and Lake Baringo in Kenya." },
      { q: "Can children join?", a: "Yes, with supervision and life jackets provided — it is one of the more relaxed activities for younger travellers." },
    ],
  },
  {
    slug: "night",
    group: "activity",
    label: "Night Safari",
    shortLabel: "Night",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Spotlight illuminating the bush during a night game drive",
    heroDescription:
      "See who comes out after dark — spotlighted drives reveal a different cast of nocturnal predators and creatures that daytime safaris never show you.",
    cardDescription: "Spotlighted drives reveal the nocturnal side of the bush daytime safaris miss.",
    intro: {
      heading: "The bush after dark",
      body:
        "Many of East Africa's most fascinating animals — leopards, hyenas, civets, genets, bushbabies — are most active after sunset. A handful of private conservancies permit guided night drives using red-filtered spotlights that don't disturb the animals, opening up sightings you simply will not get on a standard daytime game drive.",
    },
    bestFor: [
      "Travellers who have done a few daytime safaris already",
      "Spotting nocturnal predators and shyer, smaller species",
      "A different kind of evening activity at camp",
      "Private conservancies that permit night driving",
    ],
    whatToExpect: [
      { n: "01", title: "Red-filtered spotlights", body: "Designed to locate eyeshine without disturbing or disorienting animals." },
      { n: "02", title: "A different species list", body: "Leopards, hyenas, civets, genets, bushbabies and more." },
      { n: "03", title: "Limited to permitted areas", body: "Night drives are restricted to certain private conservancies, not inside most national parks." },
      { n: "04", title: "Usually 1.5-2 hours", body: "Typically run after dinner as an add-on activity." },
    ],
    goodToKnow: [
      "Only available in select private conservancies — not inside most national parks",
      "Best added to the back half of a trip once you've had a few daytime drives",
      "Bring a light jacket — temperatures drop quickly after dark",
    ],
    pairsWith: ["game-drive", "photographic", "couples"],
    faqs: [
      { q: "Is a night safari safe?", a: "Yes — it is led by an experienced guide in a vehicle, using lighting designed not to disturb wildlife." },
      { q: "Where can I do a night safari?", a: "Selected private conservancies in Kenya allow night drives; most government national parks do not. We'll confirm availability for your route." },
      { q: "What will I see?", a: "Nocturnal specialists like leopards, hyenas, civets and bushbabies that are rarely active during the day." },
    ],
  },
  {
    slug: "birding",
    group: "activity",
    label: "Birding Safari",
    shortLabel: "Birding",
    heroImage: STOCK_IMAGES.serengeti,
    heroImageAlt: "Colourful bird perched near a wetland in East Africa",
    heroDescription:
      "East Africa holds over 1,300 bird species. A birding safari is paced and routed for the list — wetlands, forests and migration corridors, led by a guide who knows the calls.",
    cardDescription: "Paced and routed for the list — wetlands, forests and a guide who knows the calls.",
    intro: {
      heading: "For the list",
      body:
        "A birding safari trades Big Five pace for patience and specificity — visiting wetlands, forest edges and rift valley lakes at the right time of year, with a guide trained in calls and field marks. Kenya and Uganda alone host well over 1,000 species between them, including rarities found almost nowhere else.",
    },
    bestFor: [
      "Dedicated birders building a species list",
      "Travellers who enjoy a quieter, slower pace",
      "Combining with Uganda's forest birding or Kenya's rift valley lakes",
      "Pairing with a standard game-drive safari for variety",
    ],
    whatToExpect: [
      { n: "01", title: "Specialist bird guides", body: "Guides trained in calls, behaviour and field identification, not just mammals." },
      { n: "02", title: "Wetland & forest routing", body: "Itineraries prioritise habitats with the highest species diversity." },
      { n: "03", title: "Early starts", body: "Bird activity peaks at dawn, so mornings start early." },
      { n: "04", title: "Species checklists provided", body: "A running list to track what you have seen through the trip." },
    ],
    goodToKnow: [
      "Best planned around migratory seasons for the highest species counts",
      "Pairs naturally with a water-based safari for wetland species",
      "Tell us your target species or families and we'll route accordingly",
    ],
    pairsWith: ["water-based", "walking", "solo"],
    faqs: [
      { q: "How many bird species might I see?", a: "A well-routed 10-14 day trip across Kenya and Uganda can realistically log 300-500+ species." },
      { q: "Do I need my own binoculars?", a: "We recommend bringing your own for fit and familiarity, though binoculars are available in our vehicles." },
      { q: "Can birding be combined with a regular safari?", a: "Yes — many guests add focused birding mornings to an otherwise standard game-drive itinerary." },
    ],
  },
  {
    slug: "game-drive",
    group: "activity",
    label: "Game-Drive Safari",
    shortLabel: "Game-Drive",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Safari vehicle on a game drive across the Masai Mara plains",
    heroDescription:
      "The classic safari — a 4x4 with a pop-up roof, an expert guide and unhurried hours spent following the wildlife wherever it leads.",
    cardDescription: "The classic safari — pop-up roof 4x4s covering more ground, more comfortably.",
    intro: {
      heading: "The safari most people picture",
      body:
        "Game drives are the backbone of an East Africa safari — comfortable 4x4 vehicles with pop-up roofs cover far more ground than walking, getting you to predator sightings, river crossings and open plains views that would otherwise be out of reach. It works for every age and fitness level.",
    },
    bestFor: [
      "First-time safari-goers",
      "Families with children or older travellers",
      "Big Five and Great Migration sightings",
      "Covering multiple parks in one trip",
    ],
    whatToExpect: [
      { n: "01", title: "Pop-up roof 4x4s", body: "Unobstructed photography and viewing angles, guaranteed window seats." },
      { n: "02", title: "Morning & afternoon drives", body: "Timed around when wildlife is most active — early morning and late afternoon." },
      { n: "03", title: "Expert spotting & tracking", body: "Guides use radio networks and tracking skill to find sightings quickly." },
      { n: "04", title: "Comfort extras", body: "Charging ports, cooler boxes and binoculars are standard in our vehicles." },
    ],
    goodToKnow: [
      "The default activity on almost every itinerary — no need to request it separately",
      "Early morning and late afternoon drives see the most animal activity",
      "Comfortably suits every age and fitness level",
    ],
    pairsWith: ["walking", "family", "fly-in"],
    faqs: [
      { q: "How long is a typical game drive?", a: "Usually 3-4 hours per drive, with a full-day drive (with a bush picnic) on key days such as Mara river crossings." },
      { q: "Will I see the Big Five?", a: "We can't guarantee specific sightings — these are wild animals — but our guides know the parks intimately and our multi-day itineraries maximise your chances." },
      { q: "Is it suitable for young children?", a: "Yes — game drives are the easiest, most comfortable safari style for families. We can advise on age-appropriate parks and pacing." },
    ],
  },
  {
    slug: "fly-in",
    group: "activity",
    label: "Fly-in Safari",
    shortLabel: "Fly-in",
    heroImage: STOCK_IMAGES.serengeti,
    heroImageAlt: "Light aircraft on a bush airstrip near the Serengeti",
    heroDescription:
      "Skip the long road transfers — light aircraft hop you between parks in under an hour, leaving more time for the bush and less for the road.",
    cardDescription: "Light-aircraft transfers between parks — more time on safari, less time on the road.",
    intro: {
      heading: "Maximise your time in the bush",
      body:
        "Fly-in safaris use light aircraft to connect remote parks and reserves, turning what would be a 6-8 hour road transfer into a 45-minute scenic flight. It costs more, but it is the most time-efficient and comfortable way to combine several parks or reach the most remote corners of East Africa.",
    },
    bestFor: [
      "Shorter trips covering multiple remote parks",
      "Travellers who prefer comfort over long road transfers",
      "Honeymoons and special-occasion trips",
      "Reaching far-flung reserves like the Northern Serengeti",
    ],
    whatToExpect: [
      { n: "01", title: "Scenic light-aircraft hops", body: "Aerial views of the very landscapes you have been driving through." },
      { n: "02", title: "Strict luggage limits", body: "Typically 15kg in soft-sided bags — we will brief you in advance." },
      { n: "03", title: "Remote bush airstrips", body: "Your guide and vehicle meet you right at the airstrip." },
      { n: "04", title: "More time, less travel fatigue", body: "Ideal for shorter trips where every safari hour counts." },
    ],
    goodToKnow: [
      "Book early — light aircraft seats and luggage allowances are limited",
      "Pack in soft-sided duffel bags, not hard-shell suitcases",
      "Best value on trips covering three or more remote parks",
    ],
    pairsWith: ["mobile-camping", "honeymoon", "private"],
    faqs: [
      { q: "How much extra does a fly-in safari cost?", a: "Internal flights add to the overall cost compared with road transfers, but the time saved is often worth it on shorter trips. We will quote both options." },
      { q: "What is the luggage allowance?", a: "Most light aircraft allow around 15kg per person in soft-sided duffel bags — no hard-shell suitcases." },
      { q: "Can fly-in and road safaris be combined?", a: "Yes — many of our guests fly between distant parks and drive between nearby ones in the same itinerary." },
    ],
  },
  {
    slug: "mobile-camping",
    group: "activity",
    label: "Mobile/Camping Safari",
    shortLabel: "Mobile/Camping",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Mobile tented camp set up under acacia trees on the savannah",
    heroDescription:
      "Camp moves with the wildlife. Fall asleep to the sounds of the bush in a comfortable tented camp pitched fresh at each stop along your route.",
    cardDescription: "Tented camps that move with the migration — fall asleep to the sounds of the bush.",
    intro: {
      heading: "Safari, unplugged",
      body:
        "A mobile camping safari follows the wildlife rather than a fixed lodge address — your camp is set up, struck and re-pitched at each new location, often tracking the Great Migration itself. Camps range from comfortable en-suite tents to simpler authentic set-ups, but all put you closer to the bush than any lodge can.",
    },
    bestFor: [
      "Following the Great Migration as it moves",
      "Travellers wanting a more authentic, immersive feel",
      "Groups who enjoy the camaraderie of camp life",
      "Combining adventure with genuine comfort",
    ],
    whatToExpect: [
      { n: "01", title: "Camp that follows the herds", body: "Locations are chosen seasonally to track migration and game movement." },
      { n: "02", title: "En-suite tented comfort", body: "Most camps include proper beds, bucket showers or solar hot water, and a mess tent." },
      { n: "03", title: "Campfire evenings", body: "Dinner and stories under the stars are part of the experience." },
      { n: "04", title: "A dedicated camp crew", body: "Guides, cooks and camp staff travel with you and set up ahead of arrival." },
    ],
    goodToKnow: [
      "Most popular during the Great Migration season, roughly July to October",
      "Pack layers — mornings and evenings in camp can be cool even in the dry season",
      "Crew and set-up are fully included in the price, not an extra cost",
    ],
    pairsWith: ["fly-in", "game-drive", "small-group"],
    faqs: [
      { q: "Is mobile camping comfortable?", a: "Yes — our mobile camps use proper walk-in tents with real beds and en-suite bucket showers, not basic backpacker camping." },
      { q: "Is it safe to camp in the bush?", a: "Yes. Camps are fenced or actively monitored at night by experienced staff, and you will always be escorted after dark." },
      { q: "What is included?", a: "All meals, camp set-up and take-down, and a dedicated crew are included — you simply enjoy the safari." },
    ],
  },
  {
    slug: "horseback",
    group: "activity",
    label: "Horseback Safari",
    shortLabel: "Horseback",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Riders on horseback crossing open savannah near grazing wildlife",
    heroDescription:
      "For experienced riders — cover the plains at a horse's pace, blending in with grazing herds in a way no vehicle ever could.",
    cardDescription: "For experienced riders — cover the plains at a horse's pace, blending into the herds.",
    intro: {
      heading: "Ride alongside the wildlife",
      body:
        "Because you don't smell or sound like a vehicle, wildlife often allows horses to approach far closer than a 4x4 — riding quietly alongside zebra, giraffe and antelope herds across open country is a genuinely rare experience, available in select conservancies with experienced outfitters.",
    },
    bestFor: [
      "Confident, experienced riders",
      "Travellers seeking a genuinely different safari angle",
      "Private conservancies with open riding country",
      "Combining with a vehicle-based safari for variety",
    ],
    whatToExpect: [
      { n: "01", title: "Experience requirements", body: "Outfitters typically require confident, competent riders able to canter and handle a spirited horse." },
      { n: "02", title: "Small groups, expert lead guides", body: "Rides are led by professional riding guides familiar with animal behaviour." },
      { n: "03", title: "Open conservancy country", body: "Available in select private conservancies, not inside national parks." },
      { n: "04", title: "Half-day to multi-day options", body: "From a few hours in the saddle to full horseback safari circuits." },
    ],
    goodToKnow: [
      "Outfitters will assess your riding level before confirming a booking",
      "Closed shoes with a heel are required — we'll confirm full kit requirements",
      "Available only in select private conservancies, not inside national parks",
    ],
    pairsWith: ["game-drive", "private", "couples"],
    faqs: [
      { q: "Do I need riding experience?", a: "Yes — horseback safaris require confident, competent riders. We will confirm your level with the outfitter before booking." },
      { q: "Is it dangerous to ride near wildlife?", a: "Experienced guides keep a safe distance and read animal behaviour constantly. It has an excellent safety record when run by reputable outfitters." },
      { q: "Where is this available?", a: "Select private conservancies in Kenya offer the best horseback safari country — we will recommend the right one for your trip." },
    ],
  },
  {
    slug: "balloon",
    group: "activity",
    label: "Hot-Air Balloon Safari",
    shortLabel: "Balloon",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Hot-air balloon rising over the Masai Mara at sunrise",
    heroDescription:
      "Drift silently over the plains at sunrise, watching the savannah and its herds wake up beneath you — then land for a champagne bush breakfast.",
    cardDescription: "Drift over the plains at sunrise, then land for a champagne bush breakfast.",
    intro: {
      heading: "Sunrise from above",
      body:
        "A hot-air balloon safari is a one-morning add-on, not a full itinerary style — but it is one of the most memorable hours of any East Africa trip. You launch before dawn, drift silently over the Mara or Serengeti plains as the light comes up, and land for a traditional champagne bush breakfast.",
    },
    bestFor: [
      "A once-in-a-trip sunrise experience",
      "Honeymooners and special occasions",
      "Aerial photography of the plains and herds",
      "Adding to any Kenya or Tanzania itinerary",
    ],
    whatToExpect: [
      { n: "01", title: "Pre-dawn pickup", body: "Collection from your camp around 5:30am for a sunrise launch." },
      { n: "02", title: "45-60 minute flight", body: "Drifting silently with the wind, typically 200-1000ft above the plains." },
      { n: "03", title: "Champagne bush breakfast", body: "A full breakfast set up on landing, wherever the wind takes you." },
      { n: "04", title: "Certified pilots", body: "Flights are operated by licensed balloon pilots with strong safety records." },
    ],
    goodToKnow: [
      "Book this as a single-morning add-on rather than a full-trip theme",
      "Weather-dependent — flights can be rescheduled at short notice for safety",
      "Pairs perfectly with a honeymoon or anniversary itinerary",
    ],
    pairsWith: ["honeymoon", "photographic", "couples"],
    faqs: [
      { q: "Is a balloon safari safe?", a: "Yes — flights are operated by licensed, experienced pilots and are one of the most established tourist activities in the Mara and Serengeti." },
      { q: "Can I book this as an add-on?", a: "Absolutely — most guests add a balloon flight to a single morning of an existing Kenya or Tanzania itinerary rather than building a trip around it." },
      { q: "Is it good for photography?", a: "Exceptional — the aerial perspective at sunrise is unlike anything else on safari." },
    ],
  },
  {
    slug: "self-drive",
    group: "activity",
    label: "Self-Drive Safari",
    shortLabel: "Self-Drive",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Self-drive 4x4 safari vehicle parked on a dirt track in a national park",
    heroDescription:
      "Behind your own wheel, on your own schedule — a fully equipped 4x4 and a route we plan with you, for travellers who want total independence.",
    cardDescription: "Behind your own wheel, on your own schedule, in a fully equipped 4x4.",
    intro: {
      heading: "Total independence, expertly planned",
      body:
        "A self-drive safari puts you behind the wheel of a fully equipped 4x4 (rooftop tent, fridge, recovery gear) while we handle the route planning, park bookings and 24/7 support. It suits confident, independent travellers who want to set their own pace without sacrificing a properly planned itinerary.",
    },
    bestFor: [
      "Confident, independent travellers",
      "Longer trips where flexibility matters",
      "Photographers wanting to linger at sightings",
      "Budget-conscious groups sharing one vehicle",
    ],
    whatToExpect: [
      { n: "01", title: "Fully equipped 4x4 rental", body: "Rooftop tent or camping gear, fridge, recovery kit and GPS routing." },
      { n: "02", title: "Pre-planned, bookable route", body: "We confirm park fees, campsites/lodges and a day-by-day route before you travel." },
      { n: "03", title: "24/7 phone support", body: "A direct line to our team throughout your trip for any issue on the road." },
      { n: "04", title: "Your pace, your stops", body: "Linger at sightings or push on — entirely your call." },
    ],
    goodToKnow: [
      "4x4 off-road experience is recommended, especially in the wet season",
      "All park fees and routes are pre-planned and confirmed before you travel",
      "A 24/7 support line is included for the full length of your trip",
    ],
    pairsWith: ["solo", "small-group", "family"],
    faqs: [
      { q: "Do I need 4x4 driving experience?", a: "Some off-road/4x4 experience is recommended, especially in the wet season. We will be honest about which routes suit your experience level." },
      { q: "What is included in the vehicle rental?", a: "Rooftop tent or camping equipment, fridge/cooler, recovery gear, GPS with pre-loaded routes, and unlimited mileage within East Africa." },
      { q: "Is support available if something goes wrong?", a: "Yes — every self-drive client gets a 24/7 emergency contact number and our local network for breakdowns or route changes." },
    ],
  },
  {
    slug: "conservation",
    group: "activity",
    label: "Conservation Safari",
    shortLabel: "Conservation",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Ranger and researcher monitoring wildlife in a conservancy",
    heroDescription:
      "Get involved, not just observe — ride along with research teams, visit rhino sanctuaries and conservancies, and see where your trip's impact actually goes.",
    cardDescription: "Ride along with research teams — see where your trip's impact actually goes.",
    intro: {
      heading: "Travel that gives back",
      body:
        "A conservation safari builds in time with the people protecting the wildlife — ranger-led briefings, visits to rhino and elephant sanctuaries, and in some conservancies, the chance to join research teams on monitoring work. It's a meaningful add-on for travellers who want their trip to support conservation directly, not just talk about it.",
    },
    bestFor: [
      "Travellers who want a hands-on, purposeful trip",
      "School groups and conservation-minded families",
      "Visiting rhino, elephant or gorilla conservation projects",
      "Supporting community-run conservancies directly",
    ],
    whatToExpect: [
      { n: "01", title: "Ranger-led briefings", body: "Learn directly from the teams protecting the wildlife day to day." },
      { n: "02", title: "Sanctuary & conservancy visits", body: "Rhino, elephant and primate conservation projects across the region." },
      { n: "03", title: "Optional research participation", body: "Selected conservancies allow guests to join monitoring activities." },
      { n: "04", title: "Funds that stay local", body: "Conservancy fees directly support the community and conservation teams." },
    ],
    goodToKnow: [
      "Availability depends on the specific conservancy and season — ask us to confirm",
      "A meaningful add-on to combine with standard game drives, not a full standalone itinerary",
      "Conservancy fees you pay go directly toward the programmes you visit",
    ],
    pairsWith: ["walking", "family", "private"],
    faqs: [
      { q: "Can I visit a rhino or elephant sanctuary?", a: "Yes — Ol Pejeta Conservancy in Kenya and several Uganda projects offer guided visits to rhino and elephant sanctuaries." },
      { q: "Can I join anti-poaching or research teams?", a: "Some private conservancies offer guided ride-alongs with research or monitoring teams — availability depends on the conservancy and season." },
      { q: "Is this suitable for school or youth groups?", a: "Yes — we can build conservation-focused itineraries specifically for school and youth groups." },
    ],
  },
  {
    slug: "wellness",
    group: "activity",
    label: "Wellness Safari",
    shortLabel: "Wellness",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Outdoor yoga session overlooking the savannah at sunrise",
    heroDescription:
      "Slow the pace — spa treatments, yoga at sunrise and mindful time in nature, woven between game drives rather than rushing from park to park.",
    cardDescription: "Spa treatments and sunrise yoga, woven between game drives rather than rushed park-hopping.",
    intro: {
      heading: "Safari, slowed down",
      body:
        "A wellness safari builds in deliberate stillness — fewer parks, longer stays, spa treatments at lodges that offer them, and quiet time built into the schedule rather than back-to-back transfers. It pairs naturally with a Zanzibar or coastal extension for a full reset at the end of the trip.",
    },
    bestFor: [
      "Travellers wanting to properly switch off",
      "Pairing safari with a beach or spa extension",
      "Fewer parks, more time in each one",
      "A restorative trip rather than a checklist trip",
    ],
    whatToExpect: [
      { n: "01", title: "Slower-paced itineraries", body: "Longer stays per camp, fewer transfers, more unstructured time." },
      { n: "02", title: "Spa & wellness lodges", body: "We select properties with treatment rooms, pools and quiet spaces." },
      { n: "03", title: "Optional yoga & meditation", body: "Arranged on request at select camps and lodges." },
      { n: "04", title: "Beach extension pairing", body: "Many guests close the trip with a few days on the Kenyan or Zanzibar coast." },
    ],
    goodToKnow: [
      "Best built around fewer parks and longer stays per camp",
      "Spa facilities vary by lodge — tell us if this matters and we'll prioritise it",
      "Pairs naturally with a coastal or Zanzibar extension",
    ],
    pairsWith: ["honeymoon", "couples", "private"],
    faqs: [
      { q: "Can you arrange yoga or spa treatments?", a: "Yes — we work with lodges that offer in-house spa treatments and can arrange a yoga instructor at select properties." },
      { q: "Is this style more expensive?", a: "Not necessarily — it usually means fewer transfers and longer stays, which can be similar in cost to a faster-paced multi-park trip." },
      { q: "Can this be combined with a normal safari?", a: "Yes — many guests do an active first half (game drives) and a slower, restorative second half." },
    ],
  },

  // ── Traveller types: Who are you travelling with ───────────────────────
  {
    slug: "family",
    group: "traveller",
    label: "Family Safari",
    shortLabel: "Family",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Family on safari watching wildlife from a vehicle together",
    heroDescription:
      "Paced for every age — shorter drives, kid-friendly lodges and guides who know how to make the bush exciting for young travellers too.",
    cardDescription: "Paced for every age — shorter drives, kid-friendly lodges and engaged guides.",
    intro: {
      heading: "Safari, for the whole family",
      body:
        "A family safari is built around your children's ages and attention spans — shorter, more frequent drives, family rooms or interconnecting tents, swimming pools at lodges, and guides skilled at keeping younger travellers engaged with tracking games, junior ranger activities and patient explanations.",
    },
    bestFor: [
      "Multi-generational trips",
      "First safaris for children",
      "Lodges with pools and family-friendly facilities",
      "A mix of wildlife and downtime",
    ],
    whatToExpect: [
      { n: "01", title: "Age-appropriate pacing", body: "Shorter game drives and more breaks, tailored to your children's ages." },
      { n: "02", title: "Family-friendly lodges", body: "Family rooms, interconnecting tents and pools where available." },
      { n: "03", title: "Engaged, patient guiding", body: "Guides skilled at junior-ranger style activities and storytelling." },
      { n: "04", title: "Flexible itineraries", body: "Built around nap times, swim breaks and what keeps kids excited." },
    ],
    goodToKnow: [
      "Tell us your children's ages so we can match parks, pacing and lodges",
      "Many lodges offer family rooms or interconnecting tents — we'll prioritise these",
      "Shorter, more frequent drives work better than fewer long ones",
    ],
    pairsWith: ["game-drive", "water-based", "walking"],
    faqs: [
      { q: "What is the minimum age for a safari?", a: "Most lodges and parks welcome children of any age, though some camps set a minimum age (often 5-8) for safety reasons. We will match you to family-friendly properties." },
      { q: "Are game drives too long for young children?", a: "We shorten and add more breaks to drives for younger children, and avoid overly long itinerary days." },
      { q: "Can grandparents join too?", a: "Yes — many of our family trips are multi-generational, and we plan pacing around the least mobile member of the group." },
    ],
  },
  {
    slug: "honeymoon",
    group: "traveller",
    label: "Honeymoon Safari",
    shortLabel: "Honeymoon",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Romantic dinner set up overlooking the savannah at sunset",
    heroDescription:
      "Private vehicles, romantic dinners under the stars and the most intimate lodges and camps East Africa has to offer — for the trip that starts your story together.",
    cardDescription: "Private vehicles, candlelit dinners and the most intimate camps in East Africa.",
    intro: {
      heading: "Built for two",
      body:
        "A honeymoon safari prioritises privacy and romance — your own private vehicle and guide, intimate camps and lodges (often adults-only), candlelit bush dinners, and the option to add a Zanzibar or Lake Naivasha extension to slow the pace at the end of the trip.",
    },
    bestFor: [
      "Newlyweds and anniversary trips",
      "Private, intimate camps and lodges",
      "Pairing safari with a beach extension",
      "Surprise touches — bush dinners, room decor, cake",
    ],
    whatToExpect: [
      { n: "01", title: "A private vehicle & guide", body: "No sharing with other guests — your pace, your itinerary, your guide." },
      { n: "02", title: "Intimate camps & lodges", body: "Boutique, often adults-only properties with romantic detailing." },
      { n: "03", title: "Special touches arranged for you", body: "Bush dinners, room decoration and celebration cakes on request." },
      { n: "04", title: "Optional beach extension", body: "Many couples close the trip with a few days in Zanzibar or the coast." },
    ],
    goodToKnow: [
      "Let us know the occasion in advance so we can arrange special touches with the lodge",
      "Most honeymoon itineraries use a private vehicle as standard",
      "A short beach extension is a popular way to close the trip",
    ],
    pairsWith: ["balloon", "fly-in", "wellness"],
    faqs: [
      { q: "Can you arrange surprises for our honeymoon?", a: "Yes — tell us the occasion and we will arrange candlelit bush dinners, room decoration, cakes and other special touches with our partner lodges." },
      { q: "Can we add a beach extension?", a: "Absolutely — Zanzibar, Diani Beach and Lamu are popular add-ons after a Kenya or Tanzania honeymoon safari." },
      { q: "Do you arrange private vehicles?", a: "Yes — honeymoon itineraries are built around a private vehicle and guide as standard, not shared transport." },
    ],
  },
  {
    slug: "couples",
    group: "traveller",
    label: "Couple's Safari",
    shortLabel: "Couples",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Couple sharing a quiet moment at a safari camp deck overlooking the bush",
    heroDescription:
      "Not a honeymoon, just the two of you — a relaxed pace, romantic lodges and time built in to actually be together, not just tick off sightings.",
    cardDescription: "A relaxed pace and romantic lodges — time to actually be together, sightings or not.",
    intro: {
      heading: "For two, any occasion",
      body:
        "A couple's safari doesn't need a special occasion attached — it's simply built around two people travelling together, with a pace and accommodation style that favours intimacy over group logistics. Many of our couples choose a private vehicle, but it's equally easy to pair with a small-group departure for a more social, budget-friendly trip.",
    },
    bestFor: [
      "Couples travelling without a special-occasion theme",
      "A relaxed, unhurried pace",
      "Romantic lodges and double-occupancy comfort",
      "Pairing with a beach extension",
    ],
    whatToExpect: [
      { n: "01", title: "Flexible pace", body: "As packed or as relaxed as you both want it to be." },
      { n: "02", title: "Double-occupancy comfort", body: "Rooms and tents selected for couples, from cosy to luxurious." },
      { n: "03", title: "Private or small-group options", body: "Choose full privacy or share costs on a small-group departure." },
      { n: "04", title: "Easy extensions", body: "Add a few days at the coast or a city stop either side of the safari." },
    ],
    goodToKnow: [
      "Works well as either a private trip or a small-group departure — we'll quote both",
      "No special-occasion theming required — just a relaxed pace built for two",
      "Double-occupancy rooms are prioritised at every lodge we recommend",
    ],
    pairsWith: ["balloon", "wellness", "fly-in"],
    faqs: [
      { q: "What's the difference between a couple's safari and a honeymoon safari?", a: "They're built the same way — a honeymoon safari simply adds special-occasion touches like a celebration dinner or room decoration. Tell us if you'd like any of that included." },
      { q: "Can we book a private vehicle?", a: "Yes — most couples prefer a private vehicle and guide, though joining a small group is a lower-cost option that still works well for couples." },
      { q: "Can we add a beach extension?", a: "Absolutely — Zanzibar, Diani Beach and Lamu are popular add-ons after a Kenya or Tanzania safari." },
    ],
  },
  {
    slug: "solo",
    group: "traveller",
    label: "Solo Safari",
    shortLabel: "Solo",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Solo traveller standing beside a safari vehicle overlooking the plains",
    heroDescription:
      "Travel alone without paying alone — join a small group, or go fully private. Either way, solo travellers are some of our most common, best-looked-after guests.",
    cardDescription: "Join a small group or go fully private — solo travellers are some of our best-looked-after guests.",
    intro: {
      heading: "Built for travelling alone",
      body:
        "Solo travellers can choose either route: join a small-group departure to share costs and meet people, or book a fully private safari at a single-traveller rate. We will talk through both options honestly, including any single-occupancy supplements, so you can pick what suits your trip.",
    },
    bestFor: [
      "First-time solo travellers",
      "Meeting other travellers along the way",
      "Anyone wanting full control over their own itinerary",
      "Flexible dates without coordinating a group",
    ],
    whatToExpect: [
      { n: "01", title: "Two clear options", body: "Join a small-group departure, or go fully private — we will quote both." },
      { n: "02", title: "Transparent single supplements", body: "Where a single-occupancy fee applies, we state it upfront." },
      { n: "03", title: "Safety as standard", body: "Vetted lodges, guides and transport — the same standard as every trip we run." },
      { n: "04", title: "As social or as private as you like", body: "Group departures for company, private trips for total flexibility." },
    ],
    goodToKnow: [
      "Ask about the single-occupancy supplement upfront — we always quote it transparently",
      "Small-group departures are the most common way solo travellers keep costs down",
      "Every trip uses the same vetted guides and vehicles, solo or otherwise",
    ],
    pairsWith: ["small-group", "birding", "self-drive"],
    faqs: [
      { q: "Is it more expensive to travel solo?", a: "Private safaris carry a single-occupancy supplement on accommodation; joining a small group avoids this. We will quote both so you can choose." },
      { q: "Is it safe to safari alone?", a: "Yes — solo travellers are some of our most common guests, and every trip uses the same vetted guides, vehicles and lodges regardless of group size." },
      { q: "Will I be alone the whole time?", a: "Only if you want to be — small-group departures are a popular way to meet fellow travellers while still saving on cost." },
    ],
  },
  {
    slug: "small-group",
    group: "traveller",
    label: "Small Group Safari",
    shortLabel: "Small Group",
    heroImage: STOCK_IMAGES.serengeti,
    heroImageAlt: "Small group of travellers sharing a safari vehicle on a game drive",
    heroDescription:
      "Share the cost and the experience — join a small group of like-minded travellers on a set-departure itinerary, guided by the same expert team.",
    cardDescription: "Share the cost and the experience on a small, set-departure group trip.",
    intro: {
      heading: "Travel together, pay less",
      body:
        "A small-group safari pools solo travellers or small parties into one shared vehicle on a fixed-date departure — the most cost-effective way to safari without compromising on guide quality. Groups are capped to keep the experience comfortable and sociable.",
    },
    bestFor: [
      "Solo travellers who want company",
      "Budget-conscious travellers",
      "Fixed-date departures that fit your calendar",
      "Meeting fellow travellers along the way",
    ],
    whatToExpect: [
      { n: "01", title: "Capped group sizes", body: "Typically 4-7 travellers per vehicle to keep things comfortable." },
      { n: "02", title: "Fixed departure dates", body: "Set itineraries on confirmed dates — ask us for the next availability." },
      { n: "03", title: "Same guide quality", body: "Group trips use the same vetted guides and vehicles as our private safaris." },
      { n: "04", title: "Lower per-person cost", body: "Shared vehicle and guide costs bring the price down without cutting corners." },
    ],
    goodToKnow: [
      "Groups are capped at roughly 4-7 travellers per vehicle",
      "Ask us for the next confirmed departure dates for your preferred country",
      "A great way to meet other travellers while keeping costs down",
    ],
    pairsWith: ["solo", "mobile-camping", "self-drive"],
    faqs: [
      { q: "How many people are in a group safari?", a: "We cap group vehicles at around 4-7 travellers to keep sightings comfortable for everyone." },
      { q: "Can solo travellers join?", a: "Yes — this is one of the most popular options for solo travellers wanting company and a lower per-person cost." },
      { q: "When are the next departure dates?", a: "Get in touch and we will share our upcoming confirmed departure dates for your preferred country and month." },
    ],
  },
  {
    slug: "private",
    group: "traveller",
    label: "Private Safari",
    shortLabel: "Private",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Private safari vehicle with a single travelling party and guide",
    heroDescription:
      "Your vehicle, your guide, your pace — no sharing with strangers, no fixed schedule but your own.",
    cardDescription: "Your vehicle, your guide, your pace — no sharing, no fixed schedule but your own.",
    intro: {
      heading: "Total exclusivity",
      body:
        "A private safari means your party has its own vehicle and guide for the entire trip — no joining other travellers, no shared schedule. It's the most flexible way to safari: linger at a sighting, change tomorrow's plan tonight, or build a route around a specific interest, all without coordinating with anyone outside your group.",
    },
    bestFor: [
      "Families and friend groups wanting full flexibility",
      "Travellers with specific interests (photography, birding, etc.)",
      "Multi-generational trips with different paces",
      "Anyone who simply prefers not to share a vehicle",
    ],
    whatToExpect: [
      { n: "01", title: "Your own vehicle & guide", body: "For the whole trip — no other travellers in your vehicle." },
      { n: "02", title: "Fully flexible scheduling", body: "Adjust timings, routes or stops as you go." },
      { n: "03", title: "Tailored to your interests", body: "Build the itinerary around exactly what your group wants to see." },
      { n: "04", title: "A premium over group travel", body: "Costs more per person than joining a group, for full control in return." },
    ],
    goodToKnow: [
      "Costs more per person than a small-group departure — we'll quote both so you can compare",
      "Ideal when your group has specific interests like photography or birding",
      "The itinerary can be adjusted day-to-day once you're on the ground",
    ],
    pairsWith: ["photographic", "fly-in", "horseback"],
    faqs: [
      { q: "How much more does a private safari cost?", a: "Private safaris cost more per person than small-group departures since you are not sharing vehicle and guide costs — we will quote both so you can compare." },
      { q: "Can we change the itinerary once we arrive?", a: "Yes — that flexibility is the main advantage of a private safari. Your guide can adjust the plan day to day." },
      { q: "Is this good for multi-generational families?", a: "Yes — a private vehicle lets you set a pace that suits the whole group, from young children to grandparents." },
    ],
  },

  // ── Theme types: Our Safari Collections ─────────────────────────────────
  {
    slug: "gorilla-trekking",
    group: "theme",
    label: "Gorilla Trekking Safari",
    shortLabel: "Gorilla Trekking",
    heroImage: STOCK_IMAGES.journal,
    heroImageAlt: "Trekkers following a guide through Bwindi forest in search of mountain gorillas",
    heroDescription:
      "Hike through Bwindi Impenetrable Forest or Volcanoes National Park to spend a profound hour face-to-face with a wild mountain gorilla family — one of the rarest wildlife encounters left on Earth.",
    cardDescription: "A guided forest hike in Uganda or Rwanda, ending with an hour beside a wild mountain gorilla family.",
    intro: {
      heading: "The rarest hour on safari",
      body:
        "Fewer than 1,100 mountain gorillas remain in the wild, found only in the forests of Uganda, Rwanda and the DR Congo. A gorilla trekking permit buys you a single, tightly regulated hour with a habituated family — tracked on foot by rangers through dense, often steep rainforest. It is physically demanding, strictly limited in numbers each day, and unlike anything else on an East Africa itinerary.",
    },
    bestFor: [
      "Travellers chasing a true bucket-list wildlife encounter",
      "Bwindi Impenetrable Forest (Uganda) and Volcanoes National Park (Rwanda)",
      "Reasonably fit hikers comfortable with steep, muddy terrain",
      "Pairing with a Big Five safari in Kenya or Tanzania",
    ],
    whatToExpect: [
      { n: "01", title: "A limited daily permit", body: "Only a set number of permits are issued per gorilla family per day — we book yours months ahead." },
      { n: "02", title: "A guided forest hike", body: "Rangers track the family's overnight movements; the hike can run from 1 to 6 hours depending on where they've moved." },
      { n: "03", title: "One hour with the family", body: "Once located, you get a strictly enforced hour at a safe, respectful distance." },
      { n: "04", title: "Porters available", body: "Local porters can carry your daypack and help on steeper sections — hiring one also supports the local community." },
    ],
    goodToKnow: [
      "Permits are limited and sell out months in advance — we recommend booking at least 4-6 months ahead in high season",
      "A minimum fitness level is expected; walking poles and gardening gloves make the climb easier",
      "Habituated families can also be tracked for chimpanzee trekking in the same regions, if you'd like to add it",
    ],
    pairsWith: ["walking", "big-five", "honeymoon"],
    faqs: [
      { q: "How fit do I need to be for gorilla trekking?", a: "Moderate fitness is enough for most treks, but trails can be steep, muddy and at altitude. Porters are available to carry bags, and we can match the difficulty to your fitness level where families are accessible." },
      { q: "How much does a gorilla trekking permit cost?", a: "Permits are set by the Uganda Wildlife Authority and Rwanda Development Board and change periodically — we'll quote the current rate and book it directly for you." },
      { q: "Can I combine gorilla trekking with a Big Five safari?", a: "Yes — many of our guests fly between Uganda or Rwanda and Kenya or Tanzania to combine gorilla trekking with a classic game-drive safari in one trip." },
    ],
  },
  {
    slug: "big-five",
    group: "theme",
    label: "Big Five Safari",
    shortLabel: "Big Five",
    heroImage: STOCK_IMAGES.mara,
    heroImageAlt: "Lion resting in the grass of the Masai Mara at golden hour",
    heroDescription:
      "Lion, leopard, elephant, buffalo and rhino — the five animals that defined the term 'safari'. A Big Five safari is routed through the parks and conservancies that give you the best realistic chance of all five.",
    cardDescription: "Lion, leopard, elephant, buffalo and rhino — routed through the parks that give you the best chance at all five.",
    intro: {
      heading: "The original safari checklist",
      body:
        "The Big Five term dates back to big-game hunting, when these were considered the five most dangerous animals to track on foot. Today it's the benchmark wildlife checklist for first-time safari-goers — and while sightings are never guaranteed, parks like the Masai Mara, Serengeti, Ngorongoro Crater and private Kenyan conservancies (good for rhino) stack the odds firmly in your favour.",
    },
    bestFor: [
      "First-time safari-goers wanting the classic checklist",
      "Multi-park itineraries that stack rhino, lion and leopard odds",
      "Combining with a Great Migration or photographic safari",
      "Private conservancies for the best rhino sightings",
    ],
    whatToExpect: [
      { n: "01", title: "Multi-park routing", body: "We combine parks and conservancies known for each species, since no single park guarantees all five." },
      { n: "02", title: "Rhino-focused add-ons", body: "Conservancies like Ol Pejeta and Lake Nakuru are added specifically to lift your rhino odds." },
      { n: "03", title: "Expert spotting", body: "Guides use radio networks and tracking experience to find harder species like leopard." },
      { n: "04", title: "Realistic expectations, set upfront", body: "We'll tell you honestly which species are likely versus possible on your chosen route and season." },
    ],
    goodToKnow: [
      "No park or operator can guarantee all five — we route for the best realistic odds, not promises",
      "Leopard is consistently the hardest of the five to find; allow extra days and a private vehicle for the best chance",
      "Rhino sightings are strongest in protected conservancies such as Ol Pejeta and Lake Nakuru National Park",
    ],
    pairsWith: ["game-drive", "great-migration", "photographic"],
    faqs: [
      { q: "Can you guarantee we'll see all of the Big Five?", a: "No reputable operator can guarantee wild sightings, but a well-routed multi-park trip of 7+ days gives a strong realistic chance at all five. We'll be upfront about which species are likely on your specific route." },
      { q: "Which park is best for the Big Five?", a: "No single park has it all — the Masai Mara and Serengeti are strong for lion, leopard, elephant and buffalo, while conservancies like Ol Pejeta add reliable rhino sightings." },
      { q: "How many days do I need for a Big Five safari?", a: "7-10 days across two or three parks gives the best balance of time and realistic odds, especially for the harder species like leopard and rhino." },
    ],
  },
  {
    slug: "great-migration",
    group: "theme",
    label: "Great Migration Safari",
    shortLabel: "Great Migration",
    heroImage: STOCK_IMAGES.serengeti,
    heroImageAlt: "Wildebeest herds crossing a river during the Great Migration",
    heroDescription:
      "Over two million wildebeest and zebra follow the rains in a constant clockwise loop between the Serengeti and the Masai Mara — and a Great Migration safari is timed and routed to put you where the herds are.",
    cardDescription: "Timed and routed to the herds — river crossings, calving season or the southern plains, wherever they are.",
    intro: {
      heading: "Timed to the herds, not the calendar",
      body:
        "The migration doesn't follow a fixed date — it follows the rain. Our job is tracking where the herds actually are each month and routing your trip there, whether that's the dramatic Mara River crossings of July-October, the predator-rich calving season on the southern Serengeti plains around January-March, or the quieter in-between months when the herds are on the move.",
    },
    bestFor: [
      "Travellers chasing river crossings (July-October)",
      "Calving season visitors wanting predator action (January-March)",
      "Mobile camping itineraries that move with the herds",
      "First-time Tanzania or Kenya safari-goers",
    ],
    whatToExpect: [
      { n: "01", title: "Season-matched routing", body: "We place you in the part of the Serengeti-Mara ecosystem where the herds actually are that month." },
      { n: "02", title: "River crossing positioning", body: "During crossing season, guides position at known crossing points and wait, sometimes for hours, for the herds to commit." },
      { n: "03", title: "Predator activity", body: "Lion, hyena and crocodile sightings spike wherever the herds concentrate." },
      { n: "04", title: "Mobile camp options", body: "Camps that physically relocate with the migration for the most immersive version of this trip." },
    ],
    goodToKnow: [
      "The migration moves on its own schedule — we track current herd positions before finalising your route, not just the calendar month",
      "River crossings are dramatic but unpredictable in timing; multi-day stays near a crossing point improve your odds",
      "January-March (calving season) on the southern Serengeti plains is less crowded than peak crossing season and excellent for predator sightings",
    ],
    pairsWith: ["mobile-camping", "fly-in", "big-five"],
    faqs: [
      { q: "When is the best time to see the Great Migration?", a: "For river crossings, July to October in the northern Serengeti and Masai Mara. For calving season and predator action, January to March on the southern Serengeti plains." },
      { q: "Will I definitely see a river crossing?", a: "Crossings happen on the herds' own schedule, not a fixed timetable — staying multiple days near an active crossing point gives the best realistic chance, and our guides track herd movements daily." },
      { q: "Kenya or Tanzania for the migration?", a: "It depends on the month — the herds spend roughly July to October in the Masai Mara (Kenya) and the rest of the year in the Serengeti (Tanzania). We'll route you to wherever they are when you travel." },
    ],
  },
  {
    slug: "luxury",
    group: "theme",
    label: "Luxury Safari",
    shortLabel: "Luxury",
    heroImage: STOCK_IMAGES.vehicle,
    heroImageAlt: "Elegant tented suite interior at a luxury safari camp",
    heroDescription:
      "Private plunge pools, fine dining under the stars and a private vehicle throughout — a luxury safari trades nothing for comfort, from the moment you land to the moment you leave.",
    cardDescription: "Private vehicles, fine dining and the most exclusive camps and lodges East Africa has to offer.",
    intro: {
      heading: "Safari, without compromise",
      body:
        "A luxury safari starts with the camps and lodges — award-winning properties with private plunge pools and personal chefs — and builds outward from there: fly-in transfers instead of long road days, a private vehicle and guide as standard, and the flexibility to adjust the day's plan on a whim. It's the most comfortable, most flexible way to experience East Africa.",
    },
    bestFor: [
      "Travellers who want the very best camps and lodges",
      "Honeymoons, anniversaries and milestone celebrations",
      "Fly-in itineraries that minimise road transfer time",
      "Multi-generational trips wanting full flexibility and comfort",
    ],
    whatToExpect: [
      { n: "01", title: "Award-winning camps and lodges", body: "Private plunge pools and personal chefs at a curated shortlist of top-tier properties." },
      { n: "02", title: "A private vehicle and guide", body: "Standard on every luxury itinerary — no sharing, no fixed group schedule." },
      { n: "03", title: "Fly-in transfers", body: "Light aircraft between parks instead of long road days, maximising time in the bush." },
      { n: "04", title: "Fully tailored itinerary", body: "Built around your interests, pace and special occasions, down to the smallest detail." },
    ],
    goodToKnow: [
      "Book well ahead — the top luxury camps have limited rooms and fill up fastest in peak season",
      "Fly-in transfers between camps are standard on a luxury itinerary, not an optional upgrade",
      "Tell us the occasion in advance so we can arrange celebration touches with the lodge",
    ],
    pairsWith: ["honeymoon", "fly-in", "private"],
    faqs: [
      { q: "What makes a safari 'luxury' rather than mid-range?", a: "The camps and lodges themselves — private plunge pools, fine dining — plus a private vehicle and guide and fly-in transfers as standard, rather than optional extras." },
      { q: "Do I need to book a luxury safari far in advance?", a: "Yes — the top camps have very few rooms and sell out months ahead in peak season (July-October and December-February)." },
      { q: "Can a luxury safari be combined with a beach extension?", a: "Absolutely — Zanzibar, the Kenyan coast and Lamu pair naturally with a luxury safari for a complete trip." },
    ],
  },
  {
    slug: "beach-and-bush",
    group: "theme",
    label: "Beach & Bush Safari",
    shortLabel: "Beach & Bush",
    heroImage: STOCK_IMAGES.savannah,
    heroImageAlt: "Tropical beach at sunset, paired with a safari extension inland",
    heroDescription:
      "Game drives by day, white sand by the next flight — a Beach & Bush safari closes out the wildlife with a few unhurried days on the Zanzibar, Kenyan or Tanzanian coast.",
    cardDescription: "Game drives first, white sand after — close out the wildlife with a few days on the coast.",
    intro: {
      heading: "The classic two-part trip",
      body:
        "Beach & Bush is the most popular way to end an East Africa safari — a few days on the Zanzibar archipelago, Diani Beach or Tanzania's Pemba/Mafia islands after the parks, giving you a complete change of pace before flying home. A short hop by light aircraft usually connects the two halves of the trip.",
    },
    bestFor: [
      "First trips combining wildlife and a beach holiday in one",
      "Honeymoons and anniversary trips",
      "Travellers wanting downtime after an active safari",
      "Zanzibar, Diani Beach, Lamu and Pemba extensions",
    ],
    whatToExpect: [
      { n: "01", title: "Safari first, beach second", body: "The standard order — game drives and parks, then a short flight to the coast to unwind." },
      { n: "02", title: "Light-aircraft connections", body: "Most safari-to-coast hops take under 90 minutes by light aircraft." },
      { n: "03", title: "A genuine change of pace", body: "Snorkelling, diving, dhow cruises and simply doing nothing, after days of early starts." },
      { n: "04", title: "Flexible split", body: "3-4 days at the coast is typical, but we'll tailor the split to your total trip length." },
    ],
    goodToKnow: [
      "Zanzibar is the most popular pairing with a Kenya or Tanzania safari thanks to direct flight connections",
      "Book coast flights as part of the same itinerary — connecting separately can add unnecessary transfer time",
      "Coral reef season and visibility vary by month; we'll advise the best timing for snorkelling or diving",
    ],
    pairsWith: ["honeymoon", "wellness", "fly-in"],
    faqs: [
      { q: "How long should the beach part of the trip be?", a: "3-4 days is typical after a 7-10 day safari, though we can extend it for a longer coastal stay if relaxation is the priority." },
      { q: "Which beach destinations pair best with a safari?", a: "Zanzibar pairs most easily with Kenya and Tanzania safaris thanks to direct flights; Diani Beach and Lamu are popular Kenya-specific options." },
      { q: "Do you book the flights between safari and beach?", a: "Yes — we book the connecting flights as part of your overall itinerary so the transition is seamless." },
    ],
  },
];

export function getSafariType(slug: string): SafariTypeConfig | undefined {
  return SAFARI_TYPES.find((t) => t.slug === slug);
}

export function getSafariTypesByGroup(group: SafariTypeGroup): SafariTypeConfig[] {
  return SAFARI_TYPES.filter((t) => t.group === group);
}
