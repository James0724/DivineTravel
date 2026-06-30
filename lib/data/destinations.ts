import connectDB from "@/lib/db/mongoose";
import DestinationModel from "@/lib/db/models/Destination";
import type {
  CompactPark,
  Destination,
  DestinationFilters,
  FeaturePark,
  PaginatedResponse,
} from "@/types";

const SELECT_FIELDS =
  "name slug location size climaticConditions majorAttractions wildlife access bestTimeToVisit activities itineraries coverImage images shortDescription description featured active createdAt";

const LISTING_SELECT_FIELDS =
  "name slug location coverImage shortDescription majorAttractions subtitle tag bestFor highlights featured order";

/**
 * Shared destination-listing query, used by /api/destinations (admin +
 * public list) and directly by server components.
 */
export async function getDestinationsList(
  // `null` means "show both active and inactive" (admin, explicit) — distinct
  // from `undefined`, which falls back to the active-only default below, since
  // a destructured default only triggers on `undefined`, not on `null`.
  filters: DestinationFilters & { activeOnly?: boolean | null } = {},
): Promise<PaginatedResponse<Destination>> {
  await connectDB();

  const {
    search,
    country,
    featured,
    page = 1,
    limit = 12,
    activeOnly = true,
  } = filters;

  const query: Record<string, unknown> = {};
  if (activeOnly !== undefined && activeOnly !== null) query.active = activeOnly;
  if (featured !== undefined) query.featured = featured;
  if (country) query["location.country"] = { $regex: country, $options: "i" };
  if (search) query.$text = { $search: search };

  const [data, total] = await Promise.all([
    DestinationModel.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(SELECT_FIELDS)
      .lean(),
    DestinationModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: JSON.parse(JSON.stringify(data)),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Active, published destination matching a country + slug — used by
 * /destinations/[country]/[park] to render the detail page from the DB.
 */
export async function getDestinationBySlug(
  country: string,
  slug: string,
): Promise<Destination | null> {
  await connectDB();

  const destination = await DestinationModel.findOne({
    slug,
    "location.country": new RegExp(`^${country}$`, "i"),
    active: true,
  })
    .select(SELECT_FIELDS)
    .lean();

  if (!destination) return null;
  return JSON.parse(JSON.stringify(destination));
}

type ListingDoc = Pick<
  Destination,
  | "name"
  | "slug"
  | "location"
  | "coverImage"
  | "shortDescription"
  | "majorAttractions"
  | "subtitle"
  | "tag"
  | "bestFor"
  | "highlights"
  | "featured"
>;

function toCardFields(doc: ListingDoc, country: string) {
  const highlights =
    doc.highlights && doc.highlights.length > 0
      ? doc.highlights
      : doc.majorAttractions.slice(0, 4);

  return {
    id: doc.slug,
    name: doc.name,
    subtitle: doc.subtitle ?? "",
    tag: doc.tag ?? "",
    image: doc.coverImage,
    desc: doc.shortDescription,
    highlights,
    bestFor: doc.bestFor ?? "",
    href: `/destinations/${country}/${doc.slug}`,
  };
}

/**
 * Active destinations for a country, split into featured (alternating
 * carousel) and the rest (paginated grid) — used by the four country
 * listing pages (/destinations/kenya, /tanzania, /rwanda, /uganda).
 */
export async function getCountryParksForListing(
  country: string,
): Promise<{ featureParks: FeaturePark[]; moreParks: CompactPark[] }> {
  await connectDB();

  const docs = (await DestinationModel.find({
    active: true,
    "location.country": new RegExp(`^${country}$`, "i"),
  })
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .select(LISTING_SELECT_FIELDS)
    .lean()) as unknown as ListingDoc[];

  const countrySlug = country.toLowerCase();
  const featured = docs.filter((d) => d.featured);
  const rest = docs.filter((d) => !d.featured);

  const featureParks: FeaturePark[] = featured.map((doc, i) => ({
    ...toCardFields(doc, countrySlug),
    num: String(i + 1).padStart(2, "0"),
    flip: i % 2 !== 0,
  }));

  const moreParks: CompactPark[] = rest.map((doc) =>
    toCardFields(doc, countrySlug),
  );

  return JSON.parse(JSON.stringify({ featureParks, moreParks }));
}
