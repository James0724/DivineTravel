// Content map for the /safari-types index + /safari-types/[type] pages.
// Two dimensions:
//   - "activity": the format/style of the experience (how it's run)
//   - "traveller": who the trip is designed around (who you travel with)
// A safari package can carry any mix of these slugs via its own
// `safariType` field. Every entry below covers all four core East Africa
// destinations — Kenya, Tanzania, Uganda and Rwanda — so each page reads as
// a complete, SEO-relevant guide rather than a single-country page.

export type SafariTypeGroup = "activity" | "traveller" | "theme";

export interface SafariTypeConfig {
  slug: string;
  group: SafariTypeGroup;
  label: string;
  shortLabel: string;
  /** One-line summary of what the experience is built around. */
  focus: string;
  /** One-line summary of how the experience is run/paced. */
  style: string;
  heroImage: string;
  heroImageAlt: string;
  heroDescription: string;
  cardDescription: string;
  intro: { heading: string; body: string };
  /** Parks/reserves where this safari type is best experienced, across Kenya, Tanzania, Uganda and Rwanda. */
  topDestinations: string[];
  bestFor: string[];
  whatToExpect: { n: string; title: string; body: string }[];
  /** Practical, logistical tips — distinct from `whatToExpect` (the shape of the experience). */
  goodToKnow: string[];
  /** Slugs of 2-3 complementary safari types to cross-link. */
  pairsWith: string[];
  faqs: { q: string; a: string }[];
}

const STOCK_IMAGES = {
  wildlife:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734273/safaritypes/pexels-490714164-28157156_dfm3tx.jpg",
  walking:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734327/safaritypes/pexels-quang-nguyen-vinh-222549-4268105_igxbpd.jpg",
  adventure:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734307/safaritypes/pexels-tanzania-wild-sky-986912744-20179685_vlfqte.jpg",
  family:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734299/safaritypes/pexels-mayuri-35634915_cfezxp.jpg",
  fly: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734293/safaritypes/pexels-keeganjchecks-16444267_zqkctz.jpg",
  budget:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734281/safaritypes/pexels-prince-iii-891481593-35327176_ggpxaa.jpg",
  bird: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734258/safaritypes/pexels-dkeats-33112940_bs88ko.jpg",
  cultrural:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734246/safaritypes/pexels-entumoto-17831035_a1cder.jpg",
  photographic:
    "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782734253/safaritypes/pexels-g-n-403098-13098880_lzxilk.jpg",
};

export const SAFARI_TYPES: SafariTypeConfig[] = [
  // ── Activity types: Safari your way ─────────────────────────────────────
  {
    slug: "wildlife-game-viewing",
    group: "activity",
    label: "Wildlife & Game Viewing Safari",
    shortLabel: "Wildlife & Game Viewing",
    focus:
      "Spotting the Big Five — lion, leopard, elephant, rhino and buffalo — plus the wider cast of plains and forest wildlife across Kenya, Tanzania, Uganda and Rwanda.",
    style:
      "Guided game drives in open-roofed 4x4 vehicles, timed around early morning and late afternoon activity peaks.",
    heroImage: STOCK_IMAGES.wildlife,
    heroImageAlt:
      "Open-roofed safari vehicle watching lions on the Serengeti plains",
    heroDescription:
      "The classic East Africa safari — expert guides, comfortable 4x4s and unhurried hours spent following the Big Five and the Great Migration across the region's most iconic parks.",
    cardDescription:
      "Big Five game drives across the Mara, Serengeti, Ngorongoro and beyond — the classic safari, done properly.",
    intro: {
      heading: "The safari most people picture",
      body: "Wildlife and game viewing safaris are the backbone of an East Africa trip — comfortable 4x4 vehicles with pop-up roofs and expert local guides cover the ground needed to find predators, river crossings and open plains sightings. It works for every age and fitness level and forms the foundation almost every itinerary in Kenya, Tanzania, Uganda or Rwanda is built around.",
    },
    topDestinations: [
      "Maasai Mara National Reserve, home of the Great Wildebeest Migration (Kenya)",
      "Amboseli National Park, famous for large elephant herds beneath Mt. Kilimanjaro (Kenya)",
      "Serengeti National Park and Ngorongoro Crater (Tanzania)",
      "Queen Elizabeth National Park and Murchison Falls National Park (Uganda)",
      "Akagera National Park, Rwanda's Big Five savannah park",
    ],
    bestFor: [
      "First-time safari-goers wanting the classic Big Five checklist",
      "Travellers chasing the Great Wildebeest Migration",
      "Families and multi-generational groups",
      "Covering multiple parks across Kenya, Tanzania, Uganda or Rwanda in one trip",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Pop-up roof 4x4s",
        body: "Unobstructed photography and viewing angles, with guaranteed window seats for every guest.",
      },
      {
        n: "02",
        title: "Morning & afternoon drives",
        body: "Timed around when wildlife is most active — early morning and late afternoon.",
      },
      {
        n: "03",
        title: "Expert spotting & tracking",
        body: "Local guides use radio networks and tracking skill to find sightings quickly and safely.",
      },
      {
        n: "04",
        title: "Multi-park, multi-country routing",
        body: "Many itineraries combine Kenya and Tanzania, or Uganda and Rwanda, in a single trip.",
      },
    ],
    goodToKnow: [
      "No park or guide can guarantee specific sightings — these are wild animals — but multi-day, multi-park itineraries maximise your realistic odds.",
      "Early morning and late afternoon drives consistently see the most predator and Big Five activity.",
      "Comfortably suits every age and fitness level, making it the easiest entry point into an East Africa safari.",
    ],
    pairsWith: ["photographic", "family", "fly-in"],
    faqs: [
      {
        q: "Will I see the Big Five on a Kenya or Tanzania safari?",
        a: "We can't guarantee specific sightings — these are wild animals — but multi-day itineraries across parks like the Maasai Mara, Serengeti, Amboseli and Ngorongoro Crater maximise your realistic chances.",
      },
      {
        q: "How long should a wildlife and game viewing safari be?",
        a: "7-10 days across two or three parks in Kenya, Tanzania, Uganda or Rwanda gives the best balance of time, travel and realistic sightings.",
      },
      {
        q: "Is this safari type suitable for children?",
        a: "Yes — game drives are the easiest, most comfortable safari style for families, and we can advise on age-appropriate parks and pacing in any of the four countries.",
      },
    ],
  },
  {
    slug: "walking",
    group: "activity",
    label: "Walking Safari",
    shortLabel: "Walking",
    focus:
      "Intimate ecosystem discovery, tracking wildlife on foot, and learning about local flora, fauna and ecology from the ground level.",
    style:
      "Guided active treks ranging from gentle bush walks to challenging primate mountain treks in Uganda and Rwanda.",
    heroImage: STOCK_IMAGES.walking,
    heroImageAlt: "Walking safari guide leading guests through the bush",
    heroDescription:
      "Step out of the vehicle and onto the trail. Armed guides and trackers lead you on foot through the bush across Kenya, Tanzania, Uganda and Rwanda — reading tracks, smelling the air, hearing the savannah at the pace it deserves.",
    cardDescription:
      "On foot with an armed guide — read tracks, smell the bush, and trek to mountain gorillas in Uganda and Rwanda.",
    intro: {
      heading: "A different way to see the wild",
      body: "A walking safari trades the engine for footsteps. You move slower, get closer to the small things — dung beetles, bird calls, animal tracks — and build a far deeper understanding of the ecosystem than a game drive alone can offer. It is also the only way to experience gorilla and chimpanzee trekking in Uganda and Rwanda.",
    },
    topDestinations: [
      "Maasai Mara Conservancies, Laikipia Plateau and Hell's Gate National Park (Kenya)",
      "Serengeti wilderness zones and Selous Game Reserve / Nyerere National Park (Tanzania)",
      "Bwindi Impenetrable Forest and Kibale National Park, for gorilla and chimpanzee trekking (Uganda)",
      "Volcanoes National Park and Nyungwe Forest, for gorilla and chimpanzee trekking (Rwanda)",
    ],
    bestFor: [
      "Travellers who want an active, immersive experience",
      "Gorilla and chimpanzee trekking in Uganda and Rwanda",
      "Photographers chasing a lower, more intimate angle",
      "Anyone wanting to learn bush-craft, not just spot animals",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Armed, certified guides",
        body: "Every walk is led by a licensed guide and, where required, an armed ranger or tracker for your safety.",
      },
      {
        n: "02",
        title: "Shorter daily distances",
        body: "Standard bush walks are paced for comfort (2-4 hours). Gorilla trekking involves unpredictable mountain hiking (2-7 hours).",
      },
      {
        n: "03",
        title: "Closer to the small things",
        body: "Tracks, dung, termite mounds, birdlife — the details a vehicle drives past.",
      },
      {
        n: "04",
        title: "Often paired with game drives",
        body: "Most itineraries mix walking mornings with vehicle-based afternoons in Kenya and Tanzania.",
      },
    ],
    goodToKnow: [
      "Usually included free or for a small conservation fee at private lodges, but gorilla and chimpanzee trekking permits in Uganda and Rwanda are limited and should be booked months in advance.",
      "Best paired with at least one full vehicle-based day so you don't miss wider park sightings.",
      "Not available in every park — national parks generally have stricter walking restrictions than private conservancies.",
    ],
    pairsWith: ["cultural", "photographic", "adventure"],
    faqs: [
      {
        q: "Is a walking safari safe?",
        a: "Yes — walks are led by licensed guides (and armed rangers where required) trained to read animal behaviour and keep a safe distance at all times.",
      },
      {
        q: "Do I need to be very fit?",
        a: "No for standard bush walks. Primate tracking in Bwindi or Volcanoes National Park can be more physically demanding depending on terrain — we match the route to your fitness level.",
      },
      {
        q: "What should I wear?",
        a: "Closed, comfortable walking shoes or hiking boots and neutral-coloured clothing — khaki, green or tan, avoiding blue or black, which attracts tsetse flies.",
      },
    ],
  },
  {
    slug: "cultural",
    group: "activity",
    label: "Cultural Safari",
    shortLabel: "Cultural",
    focus:
      "Interacting with local communities — Maasai, Samburu, Batwa and more — to learn about traditions, customs, dance and daily life.",
    style:
      "Community-led village visits, home-stay interactions and traditional storytelling sessions, woven into your wider safari itinerary.",
    heroImage: STOCK_IMAGES.cultrural,
    heroImageAlt:
      "Maasai community member sharing traditional stories with safari guests",
    heroDescription:
      "Immerse yourself in the traditions, customs and daily rhythms of East Africa's indigenous communities — from Maasai villages in Kenya to Batwa communities in Uganda — for a deeper human perspective on the landscape.",
    cardDescription:
      "Authentic village visits and cultural exchange with the Maasai, Samburu, Batwa and other communities.",
    intro: {
      heading: "Connecting with the people of the land",
      body: "A cultural safari prioritises genuine exchange over passive observation. Guided by local community members, you step inside traditional homesteads to learn pastoralist customs, age-old bush-craft, language and music, ensuring tourism income directly supports community welfare and conservation in Kenya, Tanzania, Uganda and Rwanda.",
    },
    topDestinations: [
      "Maasai Mara villages and Samburu National Reserve communities (Kenya)",
      "Arusha-region Maasai homesteads, Ngorongoro Conservation Area and Lake Eyasi's Hadzabe communities (Tanzania)",
      "Batwa Pygmy community experiences near Bwindi Impenetrable Forest (Uganda)",
      "Iby'Iwacu Cultural Village near Volcanoes National Park, run by former poachers (Rwanda)",
    ],
    bestFor: [
      "Travellers seeking authentic human connection alongside wildlife",
      "Families looking for educational, mind-expanding experiences for children",
      "Anyone wanting to see how conservation and local communities co-exist",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Community-led hosting",
        body: "Activities are led by local village members and indigenous guides rather than outside tour staff.",
      },
      {
        n: "02",
        title: "Traditional skill-sharing",
        body: "Hands-on opportunities to learn tracking, beadwork, traditional cooking or basic archery.",
      },
      {
        n: "03",
        title: "Respectful, structured visits",
        body: "Visits follow local protocols to stay dignified and non-intrusive.",
      },
      {
        n: "04",
        title: "Vibrant performances",
        body: "Welcome dances, traditional songs and oral histories shared first-hand.",
      },
    ],
    goodToKnow: [
      "We work only with ethical, community-managed tourism partners — your visit funds school bursaries, clean water and medical clinics.",
      "Always ask your guide before photographing individuals or children in the villages.",
      "Easily integrated into any 3-to-7 day wildlife itinerary in Kenya, Tanzania, Uganda or Rwanda without extra logistics.",
    ],
    pairsWith: ["walking", "family", "budget-group"],
    faqs: [
      {
        q: "Are these cultural visits authentic or just for tourists?",
        a: "We bypass roadside tourist traps. The communities we partner with — Maasai, Samburu, Hadzabe, Batwa and others — practise genuine, sustainable community-based tourism.",
      },
      {
        q: "What language do communities speak?",
        a: "Community members speak their native languages (such as Maa) and Kiswahili; your guide or a village translator facilitates the conversation in English.",
      },
      {
        q: "Can we buy crafts directly from artisans?",
        a: "Yes — buying beadwork or woodcarvings directly from artisans is a great way to support family economies in Kenya, Tanzania, Uganda and Rwanda.",
      },
    ],
  },
  {
    slug: "adventure",
    group: "activity",
    label: "Adventure Safari",
    shortLabel: "Adventure",
    focus:
      "High-thrill activities beyond the standard game drive — hot air ballooning, horseback riding, mountain biking and camel riding.",
    style:
      "Active physical participation involving biking, flying, riding or climbing outside conventional 4x4 cabins.",
    heroImage: STOCK_IMAGES.adventure,
    heroImageAlt:
      "Hot air balloon drifting over the plains of East Africa at sunrise",
    heroDescription:
      "For the thrill-seekers. Step outside the standard vehicle box with hot air balloon flights over the Mara and Serengeti, horseback safaris across Laikipia, white-water rafting on the Nile, or volcano hikes in Rwanda.",
    cardDescription:
      "Hot air balloons, horseback riding, white-water rafting and volcano hikes across all four countries.",
    intro: {
      heading: "Uncage your spirit of adventure",
      body: "Adventure safaris break the traditional mould of viewing wildlife through glass or a vehicle frame. Whether you're mountain biking past zebras in Hell's Gate, riding alongside herds on horseback in Laikipia, rafting the Nile in Jinja, or hiking a volcano in Rwanda, these itineraries are designed to keep your heart racing.",
    },
    topDestinations: [
      "Maasai Mara and Amboseli, for hot air balloon safaris (Kenya)",
      "Hell's Gate National Park, Laikipia and Tsavo, for cycling, horseback and camel riding (Kenya)",
      "Mount Kilimanjaro climbing and Serengeti hot air balloon safaris (Tanzania)",
      "White-water rafting on the Nile at Jinja and Rwenzori Mountains trekking (Uganda)",
      "Volcano hikes in Volcanoes National Park and kayaking on Lake Kivu (Rwanda)",
    ],
    bestFor: [
      "Thrill-seekers and active, fit travellers",
      "Honeymooners wanting an iconic, romantic bucket-list moment like ballooning",
      "Multi-generational groups wanting to inject high energy into the trip",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Unmatched viewpoints",
        body: "Panoramic aerial or saddle-level perspectives that standard game drives cannot provide.",
      },
      {
        n: "02",
        title: "Physical engagement",
        body: "Varying levels of exertion, from gentle cycling to demanding multi-day mountain ascents.",
      },
      {
        n: "03",
        title: "Premium safety support",
        body: "Experienced operators, certified pilots and trailing safety vehicles on riding and biking safaris.",
      },
      {
        n: "04",
        title: "Early starts",
        body: "Activities like ballooning and volcano hikes require pre-dawn departures to catch stable conditions.",
      },
    ],
    goodToKnow: [
      "Horseback safaris alongside big game require intermediate to advanced riding skills for safety reasons.",
      "Hot air balloon flights are weather-dependent; cancelled flights are refunded or rebooked the next morning.",
      "Climbing Mt. Kilimanjaro or hiking volcanoes in Rwanda requires dedicated multi-day itineraries with proper altitude acclimatisation.",
    ],
    pairsWith: ["photographic", "walking", "fly-in"],
    faqs: [
      {
        q: "Is hot air ballooning safe?",
        a: "Yes — pilots are certified under international civil aviation guidelines and the equipment undergoes meticulous daily checks before every flight.",
      },
      {
        q: "Can we cycle close to predators in Hell's Gate?",
        a: "No. Cycling safaris take place in zones populated by herbivores — giraffes, zebras and buffaloes — with no free-roaming lion prides.",
      },
      {
        q: "Do balloon safaris include breakfast?",
        a: "Yes — almost every balloon excursion in Kenya and Tanzania ends with a freshly prepared bush breakfast, often with champagne, on the savannah plains.",
      },
    ],
  },
  {
    slug: "photographic",
    group: "activity",
    label: "Photography Safari",
    shortLabel: "Photography",
    focus:
      "Capturing wildlife and landscapes during the golden hours of sunrise and sunset, without the pressure of rushing between sightings.",
    style:
      "Tailored, slow-paced itineraries with specialised vehicles and guides who understand light, angle and animal behaviour.",
    heroImage: STOCK_IMAGES.photographic,
    heroImageAlt:
      "Photographer with a long lens framing wildlife from a safari vehicle",
    heroDescription:
      "Built around the shot — extended time at sightings, photography-literate guides and camera-friendly vehicles across the Mara, Serengeti, Amboseli, Samburu and the primate forests of Uganda and Rwanda.",
    cardDescription:
      "Extended time at sightings, photo-trained guides and camera-friendly vehicles across East Africa.",
    intro: {
      heading: "Safari, through the lens",
      body: "A photography safari prioritises light, patience and positioning over ticking off species — smaller groups, guides who understand angles and behaviour, and itineraries that linger at a sighting rather than rushing to the next one. Some itineraries add a dedicated photography vehicle with beanbags, extra battery power and a guide who doubles as a spotter.",
    },
    topDestinations: [
      "Maasai Mara National Reserve, for clean backdrops and predator action (Kenya)",
      "Amboseli National Park, for elephant herds against Mt. Kilimanjaro (Kenya)",
      "Samburu National Reserve, for the 'Special Five' and red-earth contrast (Kenya)",
      "Serengeti National Park and Ngorongoro Crater (Tanzania)",
      "Bwindi, Kibale, and Volcanoes National Park, for primate photography (Uganda and Rwanda)",
    ],
    bestFor: [
      "Serious and enthusiast photographers",
      "Travellers who prefer fewer, longer sightings over many short ones",
      "Golden-hour focused itineraries",
      "Specialist hides and photography vehicles where available",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Photography-literate guiding",
        body: "Guides position the vehicle for light and angle, anticipating animal behaviour rather than just proximity.",
      },
      {
        n: "02",
        title: "Longer dwell time per sighting",
        body: "Itineraries favour staying with a single sighting for hours to capture behavioural shifts or a hunt.",
      },
      {
        n: "03",
        title: "Early starts, late finishes",
        body: "Drives are timed strictly around golden hour light at dawn and dusk.",
      },
      {
        n: "04",
        title: "Optional specialist kit",
        body: "In-built beanbags, charging stations, swivel seats and low-angle camera mounts.",
      },
    ],
    goodToKnow: [
      "A private vehicle makes the biggest difference — shared vehicles cannot always stop and wait as long as your shot requires.",
      "The dry seasons (June-October and January-February) provide clearer skies and concentrate wildlife around water sources.",
      "Tell us your target subject — predators, primates, birds or landscapes — so we can select the exact park and guide profile.",
    ],
    pairsWith: ["wildlife-game-viewing", "walking", "fly-in"],
    faqs: [
      {
        q: "Do I need a professional camera?",
        a: "No — we tailor the pace to whatever you are shooting with, from a phone to a full mirrorless setup. The pacing and patience are what change, not the gear requirement.",
      },
      {
        q: "Can I have a private vehicle for photography?",
        a: "Yes — most serious photographers travel in a private vehicle so the pace and positioning are entirely about the shot.",
      },
      {
        q: "Which parks are best for photography?",
        a: "The Maasai Mara and Serengeti's open plains give the cleanest backgrounds; Amboseli offers the best low-angle mountain compositions, and Bwindi or Volcanoes National Park are unmatched for primate photography.",
      },
    ],
  },
  {
    slug: "birdwatching",
    group: "activity",
    label: "Birdwatching Safari",
    shortLabel: "Birdwatching",
    focus:
      "Identifying and observing thousands of resident and migratory bird species in high-concentration habitats across the region.",
    style:
      "Highly focused, slow-paced exploration using specialised spotting scopes and expert ornithological guides.",
    heroImage: STOCK_IMAGES.bird,
    heroImageAlt:
      "Flocks of pink flamingos covering the surface of an East African rift valley lake",
    heroDescription:
      "A paradise for twitchers. Track down an unbelievable variety of colourful, rare and unique birdlife across Kenya's rift valley lakes, Tanzania's wetlands, and the Albertine Rift forests of Uganda and Rwanda.",
    cardDescription:
      "Track down thousands of unique, colourful bird species alongside expert ornithological guides.",
    intro: {
      heading: "The ultimate avian checklist",
      body: "East Africa is a globally recognised birdwatching hub, with Kenya and Uganda each hosting over 1,000 recorded species. Specialised birding safaris shift the focus from big cats to localised endemic forest species, vibrant migratory waterbirds and prehistoric giants hidden deep in papyrus swamps.",
    },
    topDestinations: [
      "Lake Nakuru, Lake Baringo and Lake Bogoria, for flamingos and rift valley species (Kenya)",
      "Kakamega Forest National Reserve, the only Guineo-Congolian rainforest remnant in Kenya",
      "Lake Manyara National Park (Tanzania)",
      "Mabamba Swamp, the best place on earth to spot the Shoebill Stork (Uganda)",
      "Queen Elizabeth, Bwindi and Nyungwe Forest National Parks, for Albertine Rift endemics (Uganda and Rwanda)",
    ],
    bestFor: [
      "Dedicated birders and avian photography enthusiasts",
      "Travellers seeking a quieter, detail-oriented bush experience",
      "Green-season travellers wanting to catch major migrations",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Ornithological master guides",
        body: "Guides who identify hundreds of species purely by call notes and minor plumage shifts.",
      },
      {
        n: "02",
        title: "Patience-driven itineraries",
        body: "Long hours spent at forest canopies, hides or marsh margins waiting for target species.",
      },
      {
        n: "03",
        title: "Binocular & scope setups",
        body: "Access to high-grade stabilisation gear and spotting scopes to catch distant markings.",
      },
      {
        n: "04",
        title: "High species volume",
        body: "It is common to log 200 to 400 unique species on a dedicated 10-day trip across the region.",
      },
    ],
    goodToKnow: [
      "The Green Season (November to April) is peak birding time, when resident populations are joined by millions of Palearctic migrants.",
      "Easily integrated into a classic wildlife or boating itinerary, since top birding lakes also house significant hippo and rhino populations.",
      "Bring a long-focus lens (minimum 400mm) if high-quality bird photography is your primary goal.",
    ],
    pairsWith: ["walking", "photographic", "wildlife-game-viewing"],
    faqs: [
      {
        q: "Where is the best spot to see flamingos?",
        a: "Lake Bogoria and Lake Nakuru in Kenya offer the most dramatic concentrations, depending on current water alkalinity.",
      },
      {
        q: "Can I see the Shoebill Stork easily?",
        a: "Yes — an early morning boat excursion into Uganda's Mabamba Swamp has an average sighting success rate above 85%.",
      },
      {
        q: "Is birdwatching enjoyable for non-birders?",
        a: "Absolutely — the colour, scale and dramatic behaviour of species like the Lilac-breasted Roller or African Fish Eagle captivate most travellers.",
      },
    ],
  },
  {
    slug: "fly-in",
    group: "activity",
    label: "Fly-in Safari",
    shortLabel: "Fly-in",
    focus:
      "Luxury, convenience and maximising time in remote or exclusive wilderness areas instead of long road transfers.",
    style:
      "Light-aircraft hops between parks and lodges, offering scenic aerial views and ideal for tight timelines.",
    heroImage: STOCK_IMAGES.fly,
    heroImageAlt: "Light aircraft on a bush airstrip near the Serengeti",
    heroDescription:
      "Skip the long road transfers — light aircraft connect remote parks and reserves across Kenya, Tanzania, Uganda and Rwanda in under an hour, leaving more time for the bush and less for the road.",
    cardDescription:
      "Light-aircraft transfers between parks — more time on safari, less time on the road.",
    intro: {
      heading: "Maximise your time in the bush",
      body: "Fly-in safaris use light aircraft to connect remote parks and reserves, turning what would be a 6-8 hour road transfer into a 45-minute scenic flight. It costs more, but it is the most time-efficient and comfortable way to combine several parks or reach the most remote corners of East Africa.",
    },
    topDestinations: [
      "Maasai Mara, Amboseli and Samburu, with light-aircraft hops between them (Kenya)",
      "Serengeti, Selous / Nyerere National Park and Ruaha National Park (Tanzania)",
      "Murchison Falls, Queen Elizabeth and Bwindi National Parks (Uganda)",
      "Volcanoes National Park and Akagera National Park, for fast connections (Rwanda)",
    ],
    bestFor: [
      "Shorter trips covering multiple remote parks",
      "Travellers who prefer comfort over long road transfers",
      "Honeymoons and special-occasion trips",
      "Reaching far-flung reserves like the Northern Serengeti or remote Uganda parks",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Scenic light-aircraft hops",
        body: "Aerial views of the very landscapes you'd otherwise be driving through.",
      },
      {
        n: "02",
        title: "Strict luggage limits",
        body: "Typically 15kg in soft-sided bags — we brief you in advance.",
      },
      {
        n: "03",
        title: "Remote bush airstrips",
        body: "Your guide and vehicle meet you right at the airstrip.",
      },
      {
        n: "04",
        title: "More time, less travel fatigue",
        body: "Ideal for shorter trips across multiple countries where every safari hour counts.",
      },
    ],
    goodToKnow: [
      "Book early — light aircraft seats and luggage allowances are limited, especially in peak season.",
      "Pack in soft-sided duffel bags, not hard-shell suitcases.",
      "Best value on trips covering three or more remote parks, or combining Uganda/Rwanda primate trekking with a Kenya or Tanzania game viewing safari.",
    ],
    pairsWith: ["wildlife-game-viewing", "adventure", "family"],
    faqs: [
      {
        q: "How much extra does a fly-in safari cost?",
        a: "Internal flights add to the overall cost compared with road transfers, but the time saved is often worth it on shorter trips. We will quote both options.",
      },
      {
        q: "What is the luggage allowance?",
        a: "Most light aircraft allow around 15kg per person in soft-sided duffel bags — no hard-shell suitcases.",
      },
      {
        q: "Can fly-in and road safaris be combined?",
        a: "Yes — many guests fly between distant parks and drive between nearby ones in the same itinerary, even across Kenya, Tanzania, Uganda and Rwanda.",
      },
    ],
  },

  // ── Traveller types: Who are you travelling with ───────────────────────
  {
    slug: "family",
    group: "traveller",
    label: "Family Safari",
    shortLabel: "Family",
    focus:
      "Child-friendly pacing and educational experiences that keep every generation engaged, from toddlers to grandparents.",
    style:
      "Shorter game drives, specialised kids' activities and family-appropriate lodges and amenities.",
    heroImage: STOCK_IMAGES.family,
    heroImageAlt: "Family on safari watching wildlife from a vehicle together",
    heroDescription:
      "Paced for every age — shorter drives, kid-friendly lodges and guides who know how to make the bush exciting for young travellers, across Kenya, Tanzania, Uganda and Rwanda.",
    cardDescription:
      "Paced for every age — shorter drives, kid-friendly lodges and engaged guides.",
    intro: {
      heading: "Safari, for the whole family",
      body: "A family safari is built around your children's ages and attention spans — shorter, more frequent drives, family rooms or interconnecting tents, swimming pools at lodges, and guides skilled at keeping younger travellers engaged with tracking games, junior ranger activities and patient explanations.",
    },
    topDestinations: [
      "Ol Pejeta Conservancy and Maasai Mara National Reserve (Kenya)",
      "Tarangire National Park and Ngorongoro Crater (Tanzania)",
      "Lake Mburo National Park, valued for easy game viewing and low malaria risk (Uganda)",
      "Akagera National Park (Rwanda)",
    ],
    bestFor: [
      "Multi-generational trips",
      "First safaris for children",
      "Lodges with pools and family-friendly facilities",
      "A mix of wildlife and downtime",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Age-appropriate pacing",
        body: "Shorter game drives and more breaks, tailored to your children's ages.",
      },
      {
        n: "02",
        title: "Family-friendly lodges",
        body: "Family rooms, interconnecting tents and pools where available.",
      },
      {
        n: "03",
        title: "Engaged, patient guiding",
        body: "Guides skilled in junior-ranger style activities and storytelling.",
      },
      {
        n: "04",
        title: "Flexible itineraries",
        body: "Built around nap times, swim breaks and what keeps kids excited.",
      },
    ],
    goodToKnow: [
      "Tell us your children's ages so we can match parks, pacing and lodges across any of the four countries.",
      "Many lodges offer family rooms or interconnecting tents — we'll prioritise these.",
      "Shorter, more frequent drives work better than fewer long ones for younger children.",
    ],
    pairsWith: ["wildlife-game-viewing", "cultural", "budget-group"],
    faqs: [
      {
        q: "What is the minimum age for a safari?",
        a: "Most lodges and parks welcome children of any age, though some camps set a minimum age (often 5-8) for safety reasons. We will match you to family-friendly properties.",
      },
      {
        q: "Are game drives too long for young children?",
        a: "We shorten drives and add more breaks for younger children, and avoid overly long itinerary days.",
      },
      {
        q: "Which destinations work best for families?",
        a: "Ol Pejeta and the Maasai Mara in Kenya, Tarangire in Tanzania, and Lake Mburo in Uganda are particularly easy, low-risk choices for younger children.",
      },
    ],
  },
  {
    slug: "budget-group",
    group: "traveller",
    label: "Budget & Group Safari",
    shortLabel: "Budget & Group",
    focus:
      "Affordable travel and social interaction — exploring Kenya, Tanzania, Uganda and Rwanda cost-effectively without missing the highlights.",
    style:
      "Shared transportation, camping or basic accommodation on fixed-date group departures.",
    heroImage: STOCK_IMAGES.budget,
    heroImageAlt:
      "Small group of travellers sharing a safari vehicle on a game drive",
    heroDescription:
      "Share the cost and the experience — join a small group of like-minded travellers on a set-departure itinerary across Kenya, Tanzania, Uganda and Rwanda, guided by the same expert team as our private trips.",
    cardDescription:
      "Share the cost and the experience on a small, set-departure group trip across East Africa.",
    intro: {
      heading: "Travel together, pay less",
      body: "A budget and group safari pools solo travellers or small parties into one shared vehicle on a fixed-date departure — the most cost-effective way to safari without compromising on guide quality. Groups are capped to keep the experience comfortable and sociable, and camping or basic accommodation keeps costs down without cutting corners on safety.",
    },
    topDestinations: [
      "Maasai Mara, Lake Nakuru and Amboseli, on budget camping circuits (Kenya)",
      "Serengeti and Ngorongoro Crater, on budget camping safaris (Tanzania)",
      "Queen Elizabeth and Murchison Falls National Parks, on overland routes (Uganda)",
      "Volcanoes National Park, for budget group gorilla trekking permits (Rwanda)",
    ],
    bestFor: [
      "Solo travellers who want company",
      "Budget-conscious travellers",
      "Fixed-date departures that fit your calendar",
      "Meeting fellow travellers along the way",
    ],
    whatToExpect: [
      {
        n: "01",
        title: "Capped group sizes",
        body: "Typically 4-7 travellers per vehicle to keep things comfortable.",
      },
      {
        n: "02",
        title: "Fixed departure dates",
        body: "Set itineraries on confirmed dates — ask us for the next availability in your chosen country.",
      },
      {
        n: "03",
        title: "Same guide quality",
        body: "Group trips use the same vetted guides and vehicles as our private safaris.",
      },
      {
        n: "04",
        title: "Lower per-person cost",
        body: "Shared vehicle, camping and guide costs bring the price down without cutting corners.",
      },
    ],
    goodToKnow: [
      "Groups are capped at roughly 4-7 travellers per vehicle.",
      "Ask us for the next confirmed departure dates for Kenya, Tanzania, Uganda or Rwanda.",
      "A great way to meet other travellers while keeping costs down, including on gorilla trekking permits in Uganda and Rwanda.",
    ],
    pairsWith: ["wildlife-game-viewing", "cultural", "walking"],
    faqs: [
      {
        q: "How many people are in a group safari?",
        a: "We cap group vehicles at around 4-7 travellers to keep sightings comfortable for everyone.",
      },
      {
        q: "Can solo travellers join?",
        a: "Yes — this is one of the most popular options for solo travellers wanting company and a lower per-person cost.",
      },
      {
        q: "Is camping safe?",
        a: "Yes — our camping safaris use secure, staffed campsites and experienced crews, and you're always escorted after dark.",
      },
    ],
  },
];

export function getSafariType(slug: string): SafariTypeConfig | undefined {
  return SAFARI_TYPES.find((t) => t.slug === slug);
}

export function getSafariTypesByGroup(
  group: SafariTypeGroup,
): SafariTypeConfig[] {
  return SAFARI_TYPES.filter((t) => t.group === group);
}
