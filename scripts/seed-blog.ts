/**
 * Divine Travel Nest Safaris — Blog Seed Script
 * Usage: npm run seed:blog
 *
 * Seeds blog posts sourced from divinetravelnestsafaris.com/blog
 * and curated field-journal pieces.
 */

import mongoose, { Schema } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env.local')

// Mirrors lib/db/models/Post.ts exactly so insertMany validates correctly
const PostSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:     { type: String, required: true, maxlength: 300 },
    body:        { type: String, required: true },
    coverImage:  { type: String, required: true },
    author:      { type: String, required: true, default: 'Divine Travel Nest Safaris' },
    authorAvatar: String,
    authorTitle:  String,
    category: {
      type: String,
      enum: ['migration', 'destinations', 'planning', 'wildlife', 'culture', 'conservation', 'photography', 'tips'],
      required: true,
    },
    tags:        [{ type: String, trim: true, lowercase: true }],
    faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
    featured:    { type: Boolean, default: false },
    published:   { type: Boolean, default: false },
    publishedAt: Date,
    readingTime: { type: Number, default: 5 },
    seo: { metaTitle: String, metaDescription: String, keywords: [String] },
  },
  { timestamps: true },
)

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema)

// ─── Authors ─────────────────────────────────────────────────────────────────

const AUTHORS = {
  joseph: {
    name: 'Joseph Kimani',
    title: 'Head guide · Masai Mara',
    avatar: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/caption-3-550x825.jpg',
  },
  amina: {
    name: 'Amina Were',
    title: 'Trip designer · Nairobi office',
    avatar: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/80147ab9-c725-4b2a-96af-0a555367bda0-780x975.jpeg',
  },
  david: {
    name: 'David Otieno',
    title: 'Guide · Uganda & Tanzania',
    avatar: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/11/pexels-ghida-basma-196023-609749.jpg',
  },
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

const posts = [
  // ── Real posts from divinetravelnestsafaris.com/blog ───────────────────────

  {
    title: 'What animals can you see in Nairobi National Park?',
    slug: 'nairobi-national-park-animals',
    excerpt: "Nairobi National Park is one of Africa's most unique wildlife destinations. Located just outside the city, the park hosts a remarkable variety of animals despite its size.",
    body: `<p>Nairobi National Park is one of Africa's most unique wildlife destinations. Located just outside Nairobi city, the park hosts a wide variety of animals despite being only a short drive from skyscrapers and traffic — the only national park of its kind in the world.</p>
<p>Spanning roughly 117 square kilometres, the park is unfenced on its southern boundary, allowing wildlife to move along ancient migration corridors. The result is a genuine open savannah ecosystem on the doorstep of a capital city.</p>
<h2>The headline animals</h2>
<ul>
<li>Black rhino — the park holds one of Kenya's most successful and densest rhino populations.</li>
<li>Lion, cheetah and leopard — all three big cats are resident, with lion sightings especially common.</li>
<li>Buffalo, giraffe, zebra, eland, hartebeest and impala across the open plains.</li>
<li>Hippo and crocodile along the river circuit, plus over 500 recorded bird species.</li>
</ul>
<blockquote>It is the only place on Earth where you can photograph a rhino with a city skyline behind it.</blockquote>
<h2>What you won't see</h2>
<p>There are no elephants in Nairobi National Park — the area is too small to support them. For elephants you would head to Amboseli or Tsavo. But for a half-day introduction to East African wildlife, particularly for travellers short on time, it is unmatched.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/pexels-simon-brandintel-891205-3992510.jpg" alt="Open plains of Nairobi National Park"><figcaption>Open plains of Nairobi National Park, minutes from the city.</figcaption></figure>
<h3>See it on a half-day safari</h3>
<p>Our half-day Nairobi National Park game drive is the easiest big-game safari in Africa to fit into a busy trip. <a href="/safaris/kenya">See the Nairobi day tours →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-22-at-14.36.41.jpeg',
    author: AUTHORS.joseph.name,
    authorTitle: AUTHORS.joseph.title,
    authorAvatar: AUTHORS.joseph.avatar,
    category: 'wildlife',
    tags: ['Nairobi National Park', 'Wildlife', 'Big Five', 'Day trips'],
    faqs: [
      { question: 'Can you see lions in Nairobi National Park?', answer: 'Yes. Lions are commonly seen during game drives — the park holds one of the most accessible big-cat populations in Africa.' },
      { question: 'Is Nairobi National Park worth visiting?', answer: 'Absolutely. It is one of the best short safari experiences in Africa — genuine big-game wildlife just minutes from the city.' },
      { question: 'Are there elephants in Nairobi National Park?', answer: 'No — the park is too small to support elephants. For elephant sightings head to Amboseli or Tsavo.' },
      { question: 'Can I do Nairobi National Park in half a day?', answer: 'Yes. A half-day game drive of 3–4 hours is the most popular format and covers most of the park\'s highlights.' },
    ],
    featured: true,
    published: true,
    publishedAt: new Date('2026-05-22'),
    readingTime: 6,
    seo: {
      metaTitle: 'What Animals Can You See in Nairobi National Park? | Divine Travel Nest Safaris',
      metaDescription: "Nairobi National Park is one of Africa's most unique wildlife destinations. Discover which animals you can see, what's missing, and how to plan a visit.",
      keywords: ['nairobi national park animals', 'what to see nairobi national park', 'nairobi safari', 'big five nairobi'],
    },
  },

  {
    title: 'Best things to do during a long layover in Nairobi',
    slug: 'nairobi-layover-things-to-do',
    excerpt: "If you have a long layover in Nairobi, there are many exciting experiences beyond waiting at the airport — from a quick safari to elephants, giraffes and great food.",
    body: `<p>If you have a long layover in Nairobi, there are many exciting experiences beyond waiting at the airport. With a little planning, even a six-hour gap between flights can become the highlight of your trip.</p>
<h2>If you have 4–6 hours</h2>
<ul>
<li>The David Sheldrick Elephant Orphanage — open daily for one hour at 11am to watch the orphaned calves.</li>
<li>The Giraffe Centre — hand-feed endangered Rothschild's giraffe from a raised platform.</li>
<li>Lunch at a Nairobi institution for nyama choma or a relaxed café in Karen.</li>
</ul>
<h2>If you have 6–10 hours</h2>
<p>This is enough for a morning game drive in Nairobi National Park — lions, rhino, giraffe and buffalo — followed by the elephants and giraffes, with time to spare before check-in. We handle the airport pick-up, the park, and the drop-off so you never have to think about logistics.</p>
<blockquote>A layover in Nairobi is one of the few in the world you can spend on safari instead of in a lounge.</blockquote>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/05/Divine-travel-nest-layover.jpg" alt="A morning game drive squeezed neatly between two flights"><figcaption>A morning game drive squeezed neatly between two flights.</figcaption></figure>
<h3>Let us build your layover plan</h3>
<p>Tell us your flight times and we'll design a door-to-door layover itinerary. <a href="/contact">Plan a layover trip →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/03/WhatsApp-Image-2025-08-25-at-10.10.49.jpeg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'tips',
    tags: ['Nairobi', 'Layover', 'Things to do', 'Practical'],
    faqs: [
      { question: 'Is Nairobi safe for tourists during layovers?', answer: 'Yes — organised, guided layover tours are safe. Our drivers meet you at arrivals and handle logistics end-to-end.' },
      { question: 'What is the best Nairobi layover activity?', answer: 'A morning game drive at Nairobi National Park is the top choice — it\'s the only city in the world with a national park on its outskirts.' },
      { question: 'How long do I need for a Nairobi layover trip?', answer: 'We recommend at least 6 hours between flights to do the national park comfortably. 8–10 hours allows you to add the Elephant Orphanage.' },
      { question: 'Do I need a visa for a Nairobi layover?', answer: 'Kenya offers visas on arrival. If your layover is under 24 hours and you don\'t plan to leave the terminal, you may not need one — but check your nationality requirements.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-05-22'),
    readingTime: 7,
    seo: {
      metaTitle: 'Best Things to Do During a Long Layover in Nairobi | Divine Travel Nest Safaris',
      metaDescription: 'Make the most of a Nairobi layover — from a morning game drive in Nairobi National Park to the elephant orphanage and giraffe centre.',
      keywords: ['nairobi layover things to do', 'nairobi stopover activities', 'what to do nairobi airport layover'],
    },
  },

  {
    title: 'How far is Nairobi National Park from JKIA airport?',
    slug: 'nairobi-national-park-distance-from-jkia',
    excerpt: "One of the biggest advantages of visiting Nairobi National Park is how close it is to the international airport — making it the easiest safari to reach in Africa.",
    body: `<p>One of the biggest advantages of visiting Nairobi National Park is how close it is to Jomo Kenyatta International Airport (JKIA). It is, quite simply, the most accessible big-game park on the continent.</p>
<p>The main gate of the park sits roughly 10 kilometres from JKIA — a drive of around 20 to 30 minutes depending on Nairobi's famously variable traffic. The East Gate, closest to the airport, can be even quicker outside rush hour.</p>
<h2>Why this matters</h2>
<ul>
<li>You can be on a game drive within half an hour of clearing immigration.</li>
<li>It makes the park perfect for arrival-day, departure-day or layover safaris.</li>
<li>No internal flights or long transfers — a real saving on both time and budget.</li>
</ul>
<blockquote>From baggage claim to your first lion is often less than an hour.</blockquote>
<h3>We meet you at arrivals</h3>
<p>Our guides meet you inside the terminal and have you in the park before you've shaken off the flight. <a href="/contact">Arrange an airport pick-up →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/pexels-simon-brandintel-891205-3992510.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'tips',
    tags: ['JKIA', 'Nairobi National Park', 'Logistics', 'Layover'],
    faqs: [
      { question: 'Is Nairobi National Park inside Nairobi city?', answer: 'It sits on the southern edge of Nairobi — roughly 10 km from the city centre and the same distance from JKIA airport.' },
      { question: 'Can I do a safari during transit at JKIA?', answer: 'Yes. The park\'s proximity makes it the world\'s most accessible transit safari experience.' },
      { question: 'How long should I plan for the transfer and game drive?', answer: 'Allow 20–30 minutes each way for the transfer, plus 2–3 hours in the park. A total of 4–5 hours covers it comfortably.' },
      { question: 'Is the road from JKIA to the park busy?', answer: 'Traffic into the park from the airport is usually light. Rush hours (7–9am, 5–7pm) can add 15–20 minutes.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-05-22'),
    readingTime: 4,
    seo: {
      metaTitle: 'How Far is Nairobi National Park from JKIA? | Divine Travel Nest Safaris',
      metaDescription: 'Nairobi National Park is just 10km from JKIA airport — the most accessible big-game safari in Africa. Here\'s what the transfer actually looks like.',
      keywords: ['nairobi national park jkia distance', 'how far nairobi national park airport', 'nairobi airport safari'],
    },
  },

  {
    title: 'Can you go on safari during a Nairobi layover?',
    slug: 'safari-during-nairobi-layover',
    excerpt: "Yes — Nairobi is one of the few places in the world where you can enjoy a real safari between connecting flights. Here's exactly how it works.",
    body: `<p>Can you go on safari during a Nairobi layover? Yes — Nairobi is one of the few places in the world where you can enjoy a genuine wildlife safari between connecting flights, thanks to a national park that begins minutes from the airport.</p>
<h2>How much time do you need?</h2>
<ul>
<li>Minimum: around 5–6 hours between flights for a comfortable short game drive.</li>
<li>Ideal: 7–10 hours, enough for the park plus the elephant orphanage or giraffe centre.</li>
<li>Always allow a generous buffer to clear immigration and re-check in for your onward flight.</li>
</ul>
<h2>What the trip looks like</h2>
<p>We meet you at arrivals, drive the short distance to Nairobi National Park, and spend a few hours tracking lions, rhino, buffalo and giraffe before returning you to the terminal with time to spare. Visas on arrival and luggage storage are all part of the plan we send you.</p>
<blockquote>Most travellers tell us the layover became the part of the journey they remember best.</blockquote>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-22-at-14.36.41.jpeg" alt="Rhino on the plains of Nairobi National Park"><figcaption>Rhino on the plains — the reason a Nairobi layover is worth leaving the airport for.</figcaption></figure>
<h3>Plan it with us</h3>
<p>Send us your itinerary and we'll confirm whether your connection allows a safari and handle every detail. <a href="/contact">Check my layover →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/05/Divine-travel-nest-layover.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'tips',
    tags: ['Layover', 'Nairobi', 'Safari', 'Complete guide'],
    faqs: [
      { question: 'How close is Nairobi National Park to JKIA airport?', answer: 'About 10 km — a 20 to 30-minute drive depending on traffic.' },
      { question: 'Can I do a safari during an international transit?', answer: 'Yes — Kenya allows transit passengers to enter the country and return. We handle your visa paperwork where needed.' },
      { question: 'Is a Nairobi layover safari worth it?', answer: 'Most of our layover guests say it is the highlight of their trip. The park is genuine big-game country, minutes from the terminal.' },
      { question: 'What is the best layover safari option?', answer: 'Nairobi National Park for a game drive, followed by the Elephant Orphanage if time allows. Both are within 20 minutes of the airport.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-05-22'),
    readingTime: 6,
    seo: {
      metaTitle: 'Safari During a Nairobi Layover — Is It Possible? | Divine Travel Nest Safaris',
      metaDescription: "Yes — you can go on safari during a Nairobi layover. Here's exactly how long you need, what to expect, and how we make it seamless.",
      keywords: ['nairobi layover safari', 'safari between flights nairobi', 'nairobi stopover game drive'],
    },
  },

  {
    title: 'Kenya safari tipping guide',
    slug: 'kenya-safari-tipping-guide',
    excerpt: "Tipping is one of the most confusing parts of planning a safari. How much should you tip, and who should you tip? An honest, practical guide.",
    body: `<p>Tipping is one of the most confusing parts of planning a safari. How much should you tip, and who should you tip? Here is the straightforward guidance we give our own travellers — no awkwardness, no guesswork.</p>
<h2>Suggested amounts</h2>
<ul>
<li>Driver-guide: roughly US$10–20 per guest per day — the single most important tip, as your guide makes or breaks the trip.</li>
<li>Camp / lodge staff: around US$5–10 per guest per day, usually placed in a communal tip box.</li>
<li>Porters at gorilla or mountain treks: US$10–15 per porter.</li>
<li>Airport / transfer drivers: a few dollars is a kind gesture.</li>
</ul>
<blockquote>Tipping is never compulsory — but it is deeply appreciated, and it goes a long way in local terms.</blockquote>
<h2>Practical notes</h2>
<p>US dollars and Kenyan shillings are both fine; small, clean notes are easiest. Carry tips in cash, as card facilities are rare in the bush. If a service genuinely impressed you, tip more — if it didn't, you are under no obligation.</p>
<h3>We'll send a tipping sheet with your trip</h3>
<p>Every booking includes a clear, country-specific tipping guide so you arrive prepared. <a href="/contact">Start planning →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/caption-2.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'tips',
    tags: ['Tipping', 'Budget', 'Etiquette', 'Practical'],
    faqs: [
      { question: 'Is tipping expected on safari?', answer: 'It is not compulsory, but it is standard practice and deeply appreciated. Guides and camp staff rely on tips to supplement base wages.' },
      { question: 'Should I tip in USD or Kenyan shillings?', answer: 'Either is fine. USD is often preferred at lodges; local shillings are equally welcome and make smaller tips easier.' },
      { question: 'When should I tip my guide?', answer: 'At the end of the safari or on the last morning. For a multi-day trip, you can tip daily or save it for the final handover.' },
      { question: 'What is the average tip for a safari guide in Kenya?', answer: 'US$10–20 per guest per day is the standard range. Exceptional service warrants more; there is no obligation if the service was poor.' },
      { question: 'Is tipping included in my safari price?', answer: 'No — tips are always given directly to the individuals and are never bundled into the package price.' },
      { question: 'Can I ask my guide what amount to tip?', answer: 'You can, but most guides will politely deflect. Our pre-trip briefing includes clear, specific figures so you arrive knowing what to give.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 7,
    seo: {
      metaTitle: 'Kenya Safari Tipping Guide — How Much & Who to Tip | Divine Travel Nest Safaris',
      metaDescription: "A straight-talking guide to tipping on safari in Kenya — driver-guides, camp staff, porters, and the exact amounts we recommend to our own travellers.",
      keywords: ['kenya safari tipping guide', 'how much to tip safari guide kenya', 'safari tipping etiquette africa'],
    },
  },

  {
    title: 'How do you go to the bathroom on safari?',
    slug: 'bathroom-on-safari',
    excerpt: "This might not be the first question people ask — but it's one of the most common. An honest, practical answer for the long hours out in the bush.",
    body: `<p>This might not be the first question people ask — but it's one of the most common, and a fair one. Game drives can run for several hours, so here is the honest, practical answer.</p>
<h2>At camp and on drives</h2>
<ul>
<li>Lodges and camps all have proper flushing toilets — even remote tented camps have private en-suite bathrooms.</li>
<li>On a game drive, your guide will stop at park facilities where they exist.</li>
<li>Where they don't, the time-honoured solution is a discreet "bush stop" — your guide checks the area is safe and gives you privacy behind the vehicle.</li>
</ul>
<blockquote>Guides do this every day. There is nothing to be embarrassed about — just tell them when you need to stop.</blockquote>
<h2>A few tips</h2>
<p>Carry a small pack of tissues and hand sanitiser — these are the two things first-timers most often forget. Go before you leave camp, and don't over-caffeinate at breakfast. Beyond that, relax: it's all part of being out in the wild.</p>
<h3>Travel with guides who make it easy</h3>
<p>Our small-group and private trips are run by guides who anticipate exactly this. <a href="/safaris">Browse our safaris →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/11/pexels-florian-kriechbaumer-1479976889-26926244-1.jpg',
    author: AUTHORS.david.name,
    authorTitle: AUTHORS.david.title,
    authorAvatar: AUTHORS.david.avatar,
    category: 'tips',
    tags: ['Practical', 'First safari', 'Game drives'],
    faqs: [
      { question: 'Are there toilets on a game drive?', answer: 'Fixed toilet facilities exist at some ranger posts and picnic sites. Where they don\'t, your guide will arrange a discreet bush stop.' },
      { question: 'How often can I request a bathroom stop?', answer: 'As often as needed. A professional guide will never rush you or make you feel awkward about it.' },
      { question: 'Are camp toilets clean?', answer: 'Yes — even remote tented camps maintain clean, private en-suite bathroom facilities. Flushing toilets are the norm.' },
      { question: 'What should I bring for long game drives?', answer: 'Small tissues and hand sanitiser are the two items first-timers most often forget. Everything else is provided.' },
      { question: 'What about children or elderly travellers?', answer: 'There are no restrictions on stops. Tell your guide your needs before the drive and they will plan accordingly.' },
      { question: 'Can I request a shorter game drive?', answer: 'Absolutely. Your comfort drives the itinerary — we can shorten drives, alter routes, or build in extra rest stops at any time.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 5,
    seo: {
      metaTitle: 'How Do You Go to the Bathroom on Safari? | Divine Travel Nest Safaris',
      metaDescription: "An honest, practical guide to bathroom arrangements on safari — at camp, on game drives, and everything in between.",
      keywords: ['bathroom safari', 'toilet on game drive', 'safari practical tips first time'],
    },
  },

  {
    title: 'How many days in the Masai Mara is enough?',
    slug: 'how-many-days-masai-mara',
    excerpt: "The Masai Mara is Kenya's most famous safari destination — and one of the best in Africa. So how long should you actually spend there?",
    body: `<p>The Masai Mara National Reserve is Kenya's most famous safari destination — and one of the best in Africa. The question is how many days to give it, and the honest answer depends on what you want.</p>
<h2>A day-by-day view</h2>
<ul>
<li>2 days / 1 night — the minimum. A taste of the Mara, but rushed, with long transfers eating into game time.</li>
<li>3 days / 2 nights — the sweet spot for most travellers. Enough for several full game drives and a good chance at the big cats.</li>
<li>4–5 days — ideal during the migration or for photographers, allowing you to follow the herds and revisit sightings.</li>
</ul>
<blockquote>If you only take one number from us: three days in the Mara is the difference between ticking it off and actually seeing it.</blockquote>
<h2>When the migration is in town</h2>
<p>During the July–October river-crossing season, give the Mara more time — crossings are unpredictable and a single extra day dramatically improves your odds of witnessing one. Fly in rather than drive to maximise time on the ground.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/buffalo-poses-for-the.jpg" alt="Masai Mara plains"><figcaption>The Mara rewards the travellers who give it an extra day.</figcaption></figure>
<h3>We'll right-size your Mara stay</h3>
<p>Tell us your dates and interests and we'll recommend the right number of nights. <a href="/safaris/kenya">See the Kenya safaris →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/buffalo-poses-for-the.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'planning',
    tags: ['Masai Mara', 'Planning', 'Itinerary', 'Great Migration'],
    faqs: [
      { question: 'Are 2 days in the Masai Mara enough?', answer: 'It\'s possible, but rushed. You\'ll spend significant time on road or air transfers, leaving limited time for actual game drives.' },
      { question: 'Is 3 days in the Masai Mara worth it?', answer: 'Yes — three days is the sweet spot. It gives you enough drives for a strong chance at big cats, the Big Five, and unhurried exploration.' },
      { question: 'Do game drives count towards my days?', answer: 'Morning and evening game drives are typically 3–4 hours each. A "day" in the Mara usually includes two drives.' },
      { question: 'Is 4 days in the Masai Mara too long?', answer: 'Not at all — four to five days is ideal during the July–October migration, when river crossings are unpredictable and extra time makes a significant difference.' },
      { question: 'Can I see the Big Five in the Masai Mara?', answer: 'Yes — lion, leopard, elephant, buffalo and black rhino are all present. Rhino are rarer; the others are regularly seen.' },
      { question: 'Should I combine the Masai Mara with other parks?', answer: 'If you have 7+ days, yes. Adding Amboseli for elephants or Lake Nakuru for flamingos creates a well-rounded Kenya experience.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 8,
    seo: {
      metaTitle: 'How Many Days in the Masai Mara Is Enough? | Divine Travel Nest Safaris',
      metaDescription: "Should you spend 2, 3, 5 or more days in the Masai Mara? An honest guide from our in-country team — with different answers for different trips.",
      keywords: ['how many days masai mara', 'masai mara days recommended', 'masai mara itinerary length'],
    },
  },

  {
    title: 'Which part of Kenya is best for safari?',
    slug: 'which-part-of-kenya-best-for-safari',
    excerpt: "Kenya is one of Africa's most diverse safari destinations — but not all regions offer the same experience. A complete regional guide.",
    body: `<p>Kenya is one of Africa's most diverse safari destinations — but not all regions offer the same experience. Here is how the main areas compare, so you can match the country to your trip.</p>
<h2>The main regions</h2>
<ul>
<li>Masai Mara — the iconic choice. Big cats, vast plains and the Great Migration from July to October.</li>
<li>Amboseli — huge elephant herds framed by Mount Kilimanjaro; the best elephant photography in Kenya.</li>
<li>Samburu — rugged, arid north with species you see nowhere else: Grevy's zebra, reticulated giraffe, gerenuk.</li>
<li>Tsavo — vast and wild, famous for its red elephants and a true wilderness feel.</li>
<li>Lake Nakuru — flamingos, rhino and compact, easy game viewing.</li>
</ul>
<blockquote>There is no single best region — only the best combination for the animals and atmosphere you're after.</blockquote>
<h2>A simple recommendation</h2>
<p>For a first safari, pair the Masai Mara with Amboseli or Lake Nakuru — you'll get big cats, elephants under Kilimanjaro, and an easy, varied week. Returning travellers should look north to Samburu for something genuinely different.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/caption-4.jpg" alt="Kenya safari regions"><figcaption>Each Kenyan region offers a distinct landscape and cast of wildlife.</figcaption></figure>
<h3>We'll map the right route</h3>
<p>Tell us your priorities and we'll build the regional combination that fits. <a href="/contact">Plan my route →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/caption-4.jpg',
    author: AUTHORS.joseph.name,
    authorTitle: AUTHORS.joseph.title,
    authorAvatar: AUTHORS.joseph.avatar,
    category: 'planning',
    tags: ['Kenya', 'Planning', 'Regions', 'Parks'],
    faqs: [
      { question: 'Which Kenya safari region is best for first-timers?', answer: 'The Masai Mara is the classic first safari. Its open plains, large big-cat population and well-developed infrastructure make it the easiest introduction.' },
      { question: 'Where can I see the most wildlife in Kenya?', answer: 'The Masai Mara during peak season (July–October) has the highest density — the annual migration brings over a million wildebeest plus the resident big cats that follow them.' },
      { question: 'Where is the best place to see elephants in Kenya?', answer: 'Amboseli National Park, where large herds move against the backdrop of Mount Kilimanjaro, is Kenya\'s finest elephant destination.' },
      { question: 'Which Kenya park has the fewest tourists?', answer: 'Samburu and the northern circuits (Laikipia, Lewa) see far fewer visitors than the Mara, while offering exclusive sightings of northern species.' },
      { question: 'Can I combine multiple regions in one Kenya trip?', answer: 'Yes — a week allows you to pair two regions comfortably. The Mara combined with Amboseli is the most popular combination.' },
      { question: 'Is one Kenya region enough for a first safari?', answer: 'One strong region — particularly the Masai Mara — is absolutely enough for a first visit and deeply satisfying in its own right.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 9,
    seo: {
      metaTitle: 'Which Part of Kenya Is Best for Safari? | Divine Travel Nest Safaris',
      metaDescription: "A regional guide to Kenya's best safari areas — Masai Mara, Amboseli, Samburu, Tsavo and more — matched to what you want to see.",
      keywords: ['which part of kenya best safari', 'best safari region kenya', 'kenya safari destinations comparison'],
    },
  },

  {
    title: 'Is 7 days too long for a safari?',
    slug: 'is-7-days-too-long-for-safari',
    excerpt: "Many travelers hesitate when they see a 7-day safari itinerary and ask: is it too long? The honest answer from safari experts.",
    body: `<p>Many travellers hesitate when they see a 7-day safari itinerary and ask: is a week too long? The honest answer from people who do this for a living is — almost never.</p>
<h2>Why a week works</h2>
<ul>
<li>It lets you visit two or three different parks without rushing between them.</li>
<li>You build in rest days, so the trip feels like a holiday rather than a march.</li>
<li>Wildlife is unpredictable — more days mean more chances at the sightings you came for.</li>
<li>You experience different landscapes: plains, lakes, mountains and forest.</li>
</ul>
<blockquote>Seven days is long enough to stop counting and start noticing — which is when a safari really begins.</blockquote>
<h2>When shorter makes sense</h2>
<p>If your budget or schedule is tight, a focused 3–4 day trip to a single great park is far better than no safari at all. But if you can give it a week, you'll come home rested, not rushed — and you'll see considerably more.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/samburu-intrepids-luxury.jpg" alt="Safari vehicle on open plains"><figcaption>A week allows the unhurried pace a safari is best enjoyed at.</figcaption></figure>
<h3>We'll tailor the length to you</h3>
<p>From quick getaways to two-week grand tours, we build around your time. <a href="/safaris">See sample itineraries →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/12/samburu-intrepids-luxury.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'planning',
    tags: ['Planning', 'Itinerary', 'Trip length'],
    faqs: [
      { question: 'Is a week-long safari too long?', answer: 'Almost never. Seven days allows you to visit multiple parks, build in rest, and dramatically improve wildlife sighting odds compared to a shorter trip.' },
      { question: 'Will I get bored on a 7-day safari?', answer: 'Wildlife-watching is rarely boring — you\'re observing unpredictable, living animals. Most guests come home wishing they\'d stayed longer.' },
      { question: 'Is a 7-day safari good for families?', answer: 'Yes — families with children benefit from the longer format, as children settle in and the pace becomes more relaxed after day two.' },
      { question: 'Does a longer safari improve wildlife sightings?', answer: 'Significantly. The animals you most want to see — leopard, cheetah, wild dogs — require patience and repeated drives to find.' },
      { question: 'Can I book a private safari for 7 days?', answer: 'Yes. A private vehicle for the week means you set the pace, choose routes, and spend as long as you like at any sighting.' },
      { question: 'Can I customise the length of my safari?', answer: 'Absolutely — we design every safari around your dates, budget and priorities, from three-day escapes to two-week grand tours.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 6,
    seo: {
      metaTitle: 'Is 7 Days Too Long for a Safari? | Divine Travel Nest Safaris',
      metaDescription: "Is a week-long safari too long? Our in-country team gives the honest answer — and explains why seven days is usually exactly right.",
      keywords: ['7 days safari too long', 'how long should safari be', 'one week safari kenya'],
    },
  },

  {
    title: "What I wish I knew before going on safari in Kenya",
    slug: 'what-i-wish-i-knew-before-safari-kenya',
    excerpt: "If you're planning your first safari, you're probably excited — and full of questions. Here are the things first-timers most often tell us they wish they'd known.",
    body: `<p>If you're planning your first safari, you're probably excited — and full of questions. Here are the things first-timers most often tell us, afterwards, that they wish they'd known beforehand.</p>
<h2>The things nobody warns you about</h2>
<ul>
<li>Early starts are non-negotiable — the best wildlife activity is at dawn, so embrace the 5:30am alarm.</li>
<li>It gets genuinely cold on morning drives, even on the equator. Bring a fleece.</li>
<li>Wildlife is wild — there are no guarantees, and the patience is part of the magic.</li>
<li>Pack light and neutral; bright colours and too much luggage both work against you.</li>
<li>Binoculars transform the experience more than any camera upgrade.</li>
</ul>
<blockquote>The single biggest lesson: slow down. The travellers who rush see less than those who sit and watch.</blockquote>
<h2>Choosing the right operator</h2>
<p>Your guide and operator matter more than the lodge. A knowledgeable, well-connected guide finds the sightings, reads the animals, and turns a good trip into a great one. Ask about guide experience before you book anything.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/17.jpg" alt="First-time safari travellers"><figcaption>A little preparation turns a first safari into a lifelong habit.</figcaption></figure>
<h3>Start your first safari right</h3>
<p>We specialise in first-time travellers and answer every question honestly, before you commit. <a href="/contact">Ask us anything →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/17.jpg',
    author: AUTHORS.david.name,
    authorTitle: AUTHORS.david.title,
    authorAvatar: AUTHORS.david.avatar,
    category: 'planning',
    tags: ['First safari', 'Planning', 'Tips', 'Kenya'],
    faqs: [
      { question: 'Is Kenya a good first-time safari destination?', answer: 'Yes — it is one of the world\'s best. Well-developed infrastructure, English widely spoken, and extraordinary wildlife density make it ideal for first timers.' },
      { question: 'Can I see the Big Five on a first Kenya safari?', answer: 'Yes, you can. The Masai Mara and Amboseli give the best odds; rhino are rarer but present in Lake Nakuru and Nairobi National Park.' },
      { question: 'Is a Kenya safari physically demanding?', answer: 'Not usually. Standard game drives require no physical exertion. Gorilla trekking and walking safaris are more active, with moderate fitness needed.' },
      { question: 'What vaccinations do I need for Kenya?', answer: 'Yellow fever, typhoid, hepatitis A and routine vaccines are standard. Malaria prophylaxis is strongly recommended. Consult a travel doctor 6–8 weeks before departure.' },
      { question: 'What is the food like on safari?', answer: 'Very good at most lodges — a mix of local dishes and familiar international options. Dietary restrictions are almost always accommodated with advance notice.' },
      { question: 'Will I have WiFi on safari?', answer: 'Many camps offer WiFi in common areas; remote camps may have satellite connectivity. Expect patchy coverage and embrace the digital detox.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-19'),
    readingTime: 8,
    seo: {
      metaTitle: 'What I Wish I Knew Before My First Kenya Safari | Divine Travel Nest Safaris',
      metaDescription: "First-time safari? Here's the honest advice we give our own travellers — from early mornings and packing light to choosing the right guide.",
      keywords: ['first time safari tips', 'what to know before safari kenya', 'first safari kenya advice'],
    },
  },

  // ── Curated field-journal pieces ──────────────────────────────────────────

  {
    title: 'On counting cats: three weeks with the Marsh Pride',
    slug: 'marsh-pride-masai-mara',
    excerpt: "Our head guide spends most of April with a pride of fourteen and learns, again, that the most interesting hour of the day is the one nobody is awake for.",
    body: `<p>For most of April I was parked, before light, on a low rise above the Musiara Marsh, waiting for fourteen lions to decide what kind of day it was going to be. This is not a hardship. It is, in fact, the whole job.</p>
<p>The Marsh Pride is the most-filmed family of lions on Earth, and people arrive in the Mara expecting them to behave like television. They do not. A pride spends roughly twenty hours of every day doing almost nothing, and the four hours that remain are split unevenly between the hour before sunrise and the hour after sundown — windows most visitors, understandably, sleep through.</p>
<blockquote>The single most useful thing I can tell anyone coming on safari is this: be in the vehicle in the dark.</blockquote>
<h2>The hour nobody is awake for</h2>
<p>By the time the light is good enough for a phone camera, the cats are usually flat on their sides under a croton bush, digesting, and they will stay there until the afternoon cools. What you came to see — the hunt, the greeting ceremonies, the cubs testing the adults' patience — happens in the grey half-hour when the grass is still wet. We leave camp at five-thirty. People grumble. People stop grumbling.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/11/caption-29.jpg" alt="First light over the Musiara Marsh"><figcaption>First light over the Musiara Marsh — the pride was already moving.</figcaption></figure>
<h2>What three weeks taught me</h2>
<ul>
<li>The pride moved an average of four kilometres a night — far more than the daylight stillness suggests.</li>
<li>Cubs initiate roughly nine in ten of the social interactions you will photograph. Find the cubs, find the action.</li>
<li>A successful hunt is rarer than the documentaries imply. We saw eleven attempts and three kills in nineteen days.</li>
<li>The best frames came on the two overcast mornings, not the golden ones. Flat light is a gift, not a setback.</li>
</ul>
<p>None of this is a secret to the guides who live here. But it is the difference between a good safari and a great one, and it costs nothing but an early alarm. If you take one thing from this dispatch, take the alarm.</p>
<h3>Plan a trip like this</h3>
<p>Our 3-day Masai Mara and 7-day Kenya Highlights departures both put you in the reserve at first light with a guide who knows the resident prides by name. <a href="/safaris/kenya">Browse the Kenya safaris →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606377387_1291064929726781_5444803271117951649_n.jpg',
    author: AUTHORS.joseph.name,
    authorTitle: AUTHORS.joseph.title,
    authorAvatar: AUTHORS.joseph.avatar,
    category: 'wildlife',
    tags: ['Masai Mara', 'Lions', 'Big cats', 'Field journal'],
    faqs: [
      { question: 'What is the Marsh Pride?', answer: 'The most famous lion pride in the world — a family group living around Musiara Marsh in the Masai Mara, documented by the BBC over decades.' },
      { question: 'Can I see the Marsh Pride when I visit?', answer: 'The Musiara Marsh area is accessible on our game drives. Sightings are never guaranteed, but the pride\'s home range is small and well-known to local guides.' },
      { question: 'What time of day is best for lion sightings?', answer: 'Dawn, before 7am, is when lions are most active — hunting, greeting, and moving. By mid-morning they are usually resting in shade.' },
      { question: 'How many lions are in the Marsh Pride?', answer: 'Numbers fluctuate with births, deaths and dispersals. During our April observations the pride numbered fourteen individuals.' },
    ],
    featured: true,
    published: true,
    publishedAt: new Date('2026-04-15'),
    readingTime: 8,
    seo: {
      metaTitle: 'Three Weeks with the Marsh Pride — A Guide\'s Notes | Divine Travel Nest Safaris',
      metaDescription: "Our head guide's field notes from three weeks with the Marsh Pride in the Masai Mara — what the lions actually do all day, and why the 5:30am alarm matters.",
      keywords: ['marsh pride masai mara', 'masai mara lions field notes', 'masai mara guide experience', 'mara lion tracking'],
    },
  },

  {
    title: "When to go: an honest month-by-month guide",
    slug: 'best-time-to-go-on-safari-kenya-tanzania',
    excerpt: "There is no single best time for a safari — only the best time for the thing you want to see. A planner's straight-talking calendar, including the months we quietly recommend.",
    body: `<p>The question we are asked more than any other is "when should we come?" — and the honest answer is another question: what do you most want to see? Here is the calendar we actually use when we plan, with none of the marketing gloss.</p>
<h2>January–March: calving in the south</h2>
<p>Two million wildebeest gather on the short-grass plains of Ndutu and the southern Serengeti, dropping calves at a rate of around eight thousand a day. The predator action is the most concentrated of the entire year. Green, dramatic, and far less crowded than the river-crossing season.</p>
<blockquote>If you want big cats and have flexible dates, February in Ndutu is the trip we book for our own families.</blockquote>
<h2>April–May: the long rains</h2>
<p>Many camps close, prices fall to their lowest, and the parks empty out. The light is extraordinary and the landscapes are impossibly green. You will get wet, and a few roads turn to soup, but if you don't mind that, this is the connoisseur's season — and the best value of the year.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/500038755_1016292230630438_395391103800386103_n.jpg" alt="Central Serengeti in the green season"><figcaption>Central Serengeti in the green season — empty roads, full skies.</figcaption></figure>
<h2>July–October: the river crossings</h2>
<p>The famous season. The herds reach the Mara River and the crossings begin — chaos, crocodiles, and the single most cinematic wildlife spectacle on Earth. It is also the busiest and most expensive window, so book six to nine months ahead. We will position you on quieter crossings than the convoy of vehicles you have seen in photographs.</p>
<ul>
<li>July — first nervous crossings; the Mara starts to fill.</li>
<li>August–September — peak crossings, peak crowds, peak drama.</li>
<li>October — herds settle in the Mara; golden grass and superb cats, slightly quieter.</li>
</ul>
<h2>November–December: the short rains</h2>
<p>Brief afternoon showers, the herds drifting back south, and a lovely lull in both crowds and prices. December in the central Serengeti, with the calving about to begin again, is a particular kind of magic — and a wonderful time for a family trip.</p>
<h3>Let us match the month to your trip</h3>
<p>Tell us your dates and what you most want to see and we'll tell you, honestly, whether to come then or shift by a month. <a href="/contact">Start the conversation →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606447687_1288087563357851_2335028930509111799_n.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'migration',
    tags: ['Planning', 'Great Migration', 'Seasons', 'Budget'],
    faqs: [
      { question: 'When is the best month to visit the Masai Mara?', answer: 'August and September are peak river-crossing months, but July and October offer similar wildlife with slightly fewer vehicles.' },
      { question: 'Is the green season worth visiting?', answer: 'Yes — lower prices, greener landscapes, extraordinary light for photography, and the calving season in Ndutu (January–February) rivals the dry season in spectacle.' },
      { question: 'How far ahead should I book for the Great Migration?', answer: 'Six to nine months for July–October. Prime river-crossing camps can fill a year in advance.' },
      { question: 'Does it rain every day in the wet season?', answer: 'No — rains in Kenya and Tanzania are typically afternoon showers, not all-day downpours. Morning game drives are usually unaffected.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-03-10'),
    readingTime: 11,
    seo: {
      metaTitle: 'When to Go on Safari — An Honest Month-by-Month Guide | Divine Travel Nest Safaris',
      metaDescription: "A straight-talking month-by-month safari calendar for Kenya and Tanzania — covering the Great Migration, calving season, green season and the months we quietly recommend.",
      keywords: ['best time safari kenya tanzania', 'when to go safari africa', 'great migration calendar month by month'],
    },
  },

  {
    title: 'The quiet hour at Bwindi',
    slug: 'gorilla-trekking-bwindi-quiet-hour',
    excerpt: "Tracking a small family group through the impenetrable forest, and finding a different kind of silence than the savannah offers.",
    body: `<p>The savannah is loud in a way you only notice once you've stood in a rainforest. At Bwindi the silence has weight to it, and when you finally sit down a few metres from a silverback, the loudest thing in the world is your own heartbeat.</p>
<p>We had trekked for a little under three hours — a gentle one, by Bwindi standards — when the trackers raised a hand. The undergrowth ahead shifted, and a young female crossed the path two metres in front of us, entirely uninterested in our existence.</p>
<blockquote>You are given exactly one hour with the gorillas. It is, somehow, both far too short and completely sufficient.</blockquote>
<h2>What the hour is actually like</h2>
<p>There is no chasing, no jostling. You sit. The family goes about its afternoon — grooming, dozing, the youngsters tumbling down a slope and climbing back to do it again. The silverback regards you once, decides you are furniture, and ignores you. It is the least performative wildlife encounter I know.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/experience-the-beauty-1.jpg" alt="Bwindi Impenetrable Forest"><figcaption>Bwindi Impenetrable Forest — the name is not marketing.</figcaption></figure>
<h3>Practical notes</h3>
<ul>
<li>Permits are limited and must be secured months ahead — we hold them for our travellers.</li>
<li>Treks range from one to six-plus hours. Reasonable fitness helps; porters are available and worth every shilling.</li>
<li>Pair Bwindi with Queen Elizabeth National Park for a complete five-day Uganda trip.</li>
</ul>
<p>Our 5-day Uganda Gorillas & Wildlife safari includes the permit, the trek and the rest of the Pearl. <a href="/safaris/uganda">See the Uganda trips →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/experience-the-beauty-1.jpg',
    author: AUTHORS.david.name,
    authorTitle: AUTHORS.david.title,
    authorAvatar: AUTHORS.david.avatar,
    category: 'wildlife',
    tags: ['Uganda', 'Gorillas', 'Trekking', 'Bwindi'],
    faqs: [
      { question: 'Is gorilla trekking in Uganda suitable for everyone?', answer: 'Moderate fitness is required — treks range from 1 to 8+ hours. Porters are available and recommended for longer treks.' },
      { question: 'How long do you spend with the gorillas?', answer: 'Exactly one hour with the family, as mandated by Uganda Wildlife Authority to minimise disturbance to the gorillas.' },
      { question: 'How far in advance should I book a gorilla permit?', answer: 'At least 3–6 months ahead. We secure permits on behalf of our travellers once dates are confirmed.' },
      { question: 'Is gorilla trekking worth the cost?', answer: 'Almost universally yes. The one-hour encounter is described by most travellers as the most profound wildlife experience of their lives.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-02-20'),
    readingTime: 6,
    seo: {
      metaTitle: 'The Quiet Hour at Bwindi — A Gorilla Trek Field Note | Divine Travel Nest Safaris',
      metaDescription: "A guide's field notes from a gorilla trek in Bwindi — what the hour with the family is actually like, and why it's unlike any other wildlife encounter.",
      keywords: ['bwindi gorilla trekking experience', 'what is gorilla trekking like', 'bwindi field journal', 'uganda gorilla trek guide notes'],
    },
  },

  {
    title: 'What to pack (and what to leave at home)',
    slug: 'what-to-pack-for-safari',
    excerpt: "After a few hundred trips, the packing list has narrowed to almost nothing. Soft bag, two neutral layers, and the three small things nobody tells you to bring.",
    body: `<p>The single biggest packing mistake is bringing too much. Light aircraft enforce strict weight limits, vehicles have limited space, and laundry is offered at almost every camp. You need far less than you think.</p>
<h2>The short list</h2>
<ul>
<li>A soft-sided duffel — hard cases do not fit the holds of light aircraft.</li>
<li>Neutral layers in greens, browns and khaki. Avoid bright white and dark blue (the latter attracts tsetse flies).</li>
<li>One warm fleece. Game drives at dawn are genuinely cold, even on the equator.</li>
<li>A wide-brim hat, real sunglasses, and high-factor sunscreen.</li>
<li>Binoculars — the most under-packed item, and the one that changes the trip most.</li>
</ul>
<blockquote>If you bring one thing beyond the obvious, make it a decent pair of binoculars. They turn a distant speck into the moment you flew here for.</blockquote>
<h2>What to leave behind</h2>
<p>Leave the heavy boots (light trainers are fine outside gorilla treks), the formal clothes, the third camera body and the drone — drones are prohibited in the parks. And leave the worry about charging: every camp we use has power for cameras and phones, even the remote ones.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/mflurmaldtx9khlfz99m-scaled.jpg" alt="A morning drive at Nairobi National Park"><figcaption>A morning drive at Nairobi National Park — fleece weather, even here.</figcaption></figure>
<h3>We send a full list with every booking</h3>
<p>Every traveller gets a tailored packing and pre-departure pack once dates are set. <a href="/contact">Plan your trip →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/mflurmaldtx9khlfz99m-scaled.jpg',
    author: AUTHORS.amina.name,
    authorTitle: AUTHORS.amina.title,
    authorAvatar: AUTHORS.amina.avatar,
    category: 'tips',
    tags: ['Packing', 'Practical', 'First safari'],
    faqs: [
      { question: 'Can I bring a hard suitcase on safari?', answer: 'Not on light aircraft, which have strict 15kg weight limits and require soft bags only. We recommend a duffel or soft-sided bag.' },
      { question: 'What colours should I wear on safari?', answer: 'Neutral tones — khaki, tan, olive green, brown. Avoid white (stands out to wildlife) and dark blue (attracts tsetse flies).' },
      { question: 'Do I need specialist hiking boots on safari?', answer: 'No, for standard game drives. Light trainers or trail shoes are fine. Proper boots are useful only for gorilla trekking or walking safaris.' },
      { question: 'Can I charge my camera and phone at camp?', answer: 'Yes — virtually all camps and lodges provide 240V power points or USB charging. Even remote camps use solar and generator power.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-01-28'),
    readingTime: 7,
    seo: {
      metaTitle: "What to Pack for Safari — and What to Leave at Home | Divine Travel Nest Safaris",
      metaDescription: "A concise, honest safari packing list from an operator who has done a few hundred trips — soft bag, neutral layers, binoculars, and a short list of things to leave behind.",
      keywords: ['safari packing list', 'what to pack for safari kenya', 'safari packing tips africa'],
    },
  },

  {
    title: 'Shooting from the vehicle: a field guide to safari photography',
    slug: 'safari-photography-from-vehicle',
    excerpt: "You don't need the most expensive kit — you need the right beanbag, the right seat, and a guide who positions the light for you. Notes from a photographic departure.",
    body: `<p>The best wildlife photograph on any given morning is rarely a question of the camera. It is a question of position — of being on the right side of the animal, with the sun behind you and the vehicle switched off, before anyone else arrives.</p>
<h2>Kit that actually matters</h2>
<ul>
<li>A beanbag beats a tripod every time inside a vehicle — drape it over the window frame and rest the lens.</li>
<li>One long lens (a 100–400mm is plenty) and one wide for landscapes. You will not miss the rest.</li>
<li>Fast memory cards and spare batteries. The cold dawns drain them quicker than you expect.</li>
<li>Switch the engine off before you shoot — the vibration is the silent killer of sharp frames.</li>
</ul>
<blockquote>Position is everything. A 600mm lens on the wrong side of the light will lose to a phone on the right side.</blockquote>
<h2>Working with your guide</h2>
<p>On our photographic trips the guide is your second photographer. Tell them what you want — low angle, backlight, a clean background — and they will reposition the vehicle for it. The single biggest upgrade to your images is simply asking.</p>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606377387_1291064929726781_5444803271117951649_n.jpg" alt="Safari vehicle in the Masai Mara"><figcaption>Engine off, sun behind, beanbag on the sill — then you wait.</figcaption></figure>
<h3>Our specialist photographic safaris</h3>
<p>Private vehicle, guaranteed window seats, a guide who shoots, and routes built around light. <a href="/safaris/kenya">See the photography trips →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606377387_1291064929726781_5444803271117951649_n.jpg',
    author: AUTHORS.joseph.name,
    authorTitle: AUTHORS.joseph.title,
    authorAvatar: AUTHORS.joseph.avatar,
    category: 'photography',
    tags: ['Photography', 'Big cats', 'Masai Mara', 'Gear'],
    faqs: [
      { question: 'What is the best camera for a safari?', answer: 'Any camera with a zoom lens (100–400mm) will capture excellent wildlife shots. Phone cameras have improved but still benefit from optical zoom.' },
      { question: 'Do I need a tripod for safari photography?', answer: 'A beanbag is better than a tripod in a safari vehicle — it rests on the window frame and absorbs vibration far more effectively.' },
      { question: 'Should I tell my guide what shots I want?', answer: 'Yes, always. Guides can reposition the vehicle for the angle, light and background you need — one of the most overlooked ways to improve your images.' },
      { question: 'Is drone photography allowed in national parks?', answer: 'No. Drones are prohibited in virtually all national parks and reserves in Kenya, Tanzania and Uganda.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-02-08'),
    readingTime: 9,
    seo: {
      metaTitle: 'Safari Photography from the Vehicle — A Field Guide | Divine Travel Nest Safaris',
      metaDescription: "A practical guide to getting better wildlife photographs from a safari vehicle — beanbags, lens choices, working with your guide, and why position beats kit.",
      keywords: ['safari photography tips vehicle', 'wildlife photography from safari vehicle', 'beanbag wildlife photography safari'],
    },
  },

  {
    title: 'Calving in Ndutu',
    slug: 'calving-season-ndutu-serengeti',
    excerpt: "A thousand wildebeest born in a morning, and the predators that know it. Notes from the southern Serengeti in the green season.",
    body: `<p>Everyone knows the river crossings. Far fewer know that the migration's most extraordinary chapter happens months earlier and hundreds of kilometres south, on the short-grass plains of Ndutu, in near-total quiet.</p>
<p>For a few weeks each February the herds drop calves at a rate of around eight thousand a day. The plains turn into a nursery the size of a country, and every predator within range knows the calendar as well as we do.</p>
<blockquote>A wildebeest calf is on its feet within minutes of being born. In Ndutu, that is not a fact — it is a survival exam, sat in front of an audience of cheetah.</blockquote>
<h2>Why the green season wins</h2>
<ul>
<li>Predator density is the highest of the year — cheetah, lion and hyena follow the calving.</li>
<li>The plains are emerald and the skies are dramatic — a photographer's dream.</li>
<li>Far fewer vehicles than the July–October crossings, and noticeably lower prices.</li>
</ul>
<figure><img src="https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/608128647_1288085906691350_7632202921800311470_n.jpg" alt="Short-grass plains of Ndutu, mid-calving"><figcaption>Short-grass plains of Ndutu, mid-calving.</figcaption></figure>
<h3>Combine it with the crater</h3>
<p>A green-season trip pairs beautifully with Ngorongoro and Tarangire for a complete southern-circuit week. <a href="/safaris/tanzania">See the Tanzania trips →</a></p>`,
    coverImage: 'https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/608128647_1288085906691350_7632202921800311470_n.jpg',
    author: AUTHORS.david.name,
    authorTitle: AUTHORS.david.title,
    authorAvatar: AUTHORS.david.avatar,
    category: 'migration',
    tags: ['Serengeti', 'Great Migration', 'Calving', 'Predators'],
    faqs: [
      { question: 'When is the calving season in Ndutu?', answer: 'January to February, peaking in early February when the wildebeest drop calves at a rate of around eight thousand a day.' },
      { question: 'Is calving season as good as the river crossings?', answer: 'For predator action, many experienced safari-goers prefer calving — the density of kills is higher, the crowds are lower, and the prices are better.' },
      { question: 'What predators are active during calving season?', answer: 'Cheetah, lion and spotted hyena are particularly active, drawn by the abundance of vulnerable newborns.' },
      { question: 'Can I combine Ndutu calving with other Tanzania parks?', answer: 'Yes — Ngorongoro Crater and Tarangire pair beautifully with a Ndutu trip for a complete southern circuit week.' },
    ],
    featured: false,
    published: true,
    publishedAt: new Date('2026-02-01'),
    readingTime: 6,
    seo: {
      metaTitle: 'Calving Season in Ndutu — The Migration\'s Hidden Chapter | Divine Travel Nest Safaris',
      metaDescription: "Why the calving season in Tanzania's Ndutu plains is the most overlooked chapter of the Great Migration — and why February may be the best month to visit the Serengeti.",
      keywords: ['ndutu calving season', 'great migration calving serengeti', 'ndutu february safari', 'serengeti green season'],
    },
  },
]

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✓ Connected to MongoDB')

  await Post.deleteMany({})
  console.log('✓ Cleared existing blog posts')

  const created = await Post.insertMany(posts)
  console.log(`✓ Seeded ${created.length} blog posts`)

  for (const p of created) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(`  · ${(p as any).title}`)
  }

  await mongoose.disconnect()
  console.log('✓ Done')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
