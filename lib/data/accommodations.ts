import connectDB from "@/lib/db/mongoose";
import AccommodationModel from "@/lib/db/models/Accommodation";
import type { Accommodation, AccommodationFilters, AccommodationType, PaginatedResponse } from "@/types";

const SELECT_FIELDS =
  "name slug type location description highlights amenities coverImage images websiteUrl priceTier featured active createdAt";

/**
 * Shared accommodation-listing query, used by /api/accommodations (admin +
 * public list) and directly by server components.
 */
export async function getAccommodationsList(
  filters: AccommodationFilters & { activeOnly?: boolean } = {},
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
  if (activeOnly !== undefined) query.active = activeOnly;
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
