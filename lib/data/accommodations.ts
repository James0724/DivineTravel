import connectDB from "@/lib/db/mongoose";
import AccommodationModel from "@/lib/db/models/Accommodation";
import type { Accommodation, AccommodationFilters, AccommodationType, PaginatedResponse } from "@/types";

const SELECT_FIELDS =
  "name slug type location description highlights amenities coverImage images websiteUrl priceTier featured active createdAt";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Shared accommodation-listing query, used by /api/accommodations (admin +
 * public list) and directly by server components.
 */
export async function getAccommodationsList(
  // `null` means "show both active and inactive" (admin, explicit) — distinct
  // from `undefined`, which falls back to the active-only default below, since
  // a destructured default only triggers on `undefined`, not on `null`.
  filters: AccommodationFilters & { activeOnly?: boolean | null } = {},
): Promise<PaginatedResponse<Accommodation>> {
  await connectDB();

  const {
    search,
    type,
    country,
    featured,
    page = 1,
    limit = 12,
    activeOnly = true,
  } = filters;

  const query: Record<string, unknown> = {};
  if (activeOnly !== undefined && activeOnly !== null) query.active = activeOnly;
  if (type) query.type = type;
  if (featured !== undefined) query.featured = featured;
  if (country) query["location.country"] = { $regex: country, $options: "i" };
  if (search) query.$text = { $search: search };

  const safeLimit = Math.min(limit, 50);

  const [data, total] = await Promise.all([
    AccommodationModel.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * safeLimit)
      .limit(safeLimit)
      .select(SELECT_FIELDS)
      .lean(),
    AccommodationModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    success: true,
    data: JSON.parse(JSON.stringify(data)),
    pagination: {
      total,
      page,
      limit: safeLimit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Active properties in the same area as a destination — tried in order of
 * precision: park match (e.g. "Maasai Mara National Reserve") first, then
 * region match (e.g. "Rift Valley"), falling back to a country-wide match
 * if nothing more specific is tagged yet. `park` is optional on the
 * accommodation record, so it's skipped automatically when unset rather
 * than excluding the property. Used for the accommodation carousel on the
 * destination detail page.
 */
export async function getAccommodationsByLocation(
  country: string,
  region?: string,
  opts: { limit?: number; park?: string } = {},
): Promise<Accommodation[]> {
  await connectDB();
  const { limit = 12, park } = opts;

  const countryQuery = {
    active: true,
    "location.country": new RegExp(`^${escapeRegExp(country)}$`, "i"),
  };

  const run = (extra: Record<string, unknown>) =>
    AccommodationModel.find({ ...countryQuery, ...extra })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .select(SELECT_FIELDS)
      .lean();

  let properties: Awaited<ReturnType<typeof run>> = [];

  if (park) {
    properties = await run({ "location.park": new RegExp(escapeRegExp(park), "i") });
  }

  if (properties.length === 0 && region) {
    properties = await run({ "location.region": new RegExp(escapeRegExp(region), "i") });
  }

  if (properties.length === 0) {
    properties = await run({});
  }

  return JSON.parse(JSON.stringify(properties));
}

/**
 * Active, published properties of a single type — used by
 * /accommodations/[type] to render the partner-property grid.
 */
export async function getAccommodationsByType(
  dbType: AccommodationType,
  opts: { limit?: number } = {},
): Promise<Accommodation[]> {
  await connectDB();
  const { limit = 24 } = opts;

  const properties = await AccommodationModel.find({ type: dbType, active: true })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .select(SELECT_FIELDS)
    .lean();

  return JSON.parse(JSON.stringify(properties));
}
