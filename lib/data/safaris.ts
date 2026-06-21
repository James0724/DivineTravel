import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import type { Safari, SafariFilters, PaginatedResponse } from "@/types";

const SELECT_FIELDS =
  "name slug tagline location duration pricing images coverImage category safariType difficulty featured active rating reviewCount minGroupSize maxGroupSize bestSeason";

type SortQuery = { [key: string]: 1 | -1 };

const SORT_MAP: Record<string, SortQuery> = {
  rating: { rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
  price_asc: { "pricing.budget.pricePerPerson": 1 },
  price_desc: { "pricing.luxury.pricePerPerson": -1 },
  duration_asc: { duration: 1 },
};

const PRIMARY_COUNTRY_EXPR = {
  $toLower: {
    $ifNull: [{ $arrayElemAt: ["$location.countries", 0] }, "$location.country"],
  },
};

// Kenya -> Tanzania -> Uganda -> Rwanda -> other.
const COUNTRY_RANK_FIELD = {
  $switch: {
    branches: [
      { case: { $eq: [PRIMARY_COUNTRY_EXPR, "kenya"] }, then: 0 },
      { case: { $eq: [PRIMARY_COUNTRY_EXPR, "tanzania"] }, then: 1 },
      { case: { $eq: [PRIMARY_COUNTRY_EXPR, "uganda"] }, then: 2 },
      { case: { $eq: [PRIMARY_COUNTRY_EXPR, "rwanda"] }, then: 3 },
    ],
    default: 4,
  },
};

const COUNTRY_ORDER = ["kenya", "tanzania", "uganda", "rwanda"];

// Round-robins across __countryRank groups (one pick per country per round,
// in rank order) so no single country can crowd out the others within `limit`.
function selectCountryBalanced<T extends { __countryRank?: number }>(
  candidates: T[],
  limit: number,
): T[] {
  const groups = new Map<number, T[]>();
  for (const candidate of candidates) {
    const rank = candidate.__countryRank ?? COUNTRY_ORDER.length;
    const group = groups.get(rank);
    if (group) group.push(candidate);
    else groups.set(rank, [candidate]);
  }
  const rankKeys = [...groups.keys()].sort((a, b) => a - b);

  const result: T[] = [];
  for (let round = 0; result.length < limit; round++) {
    let addedAny = false;
    for (const rank of rankKeys) {
      const group = groups.get(rank)!;
      if (round < group.length) {
        result.push(group[round]);
        addedAny = true;
        if (result.length >= limit) break;
      }
    }
    if (!addedAny) break;
  }
  return result;
}

function countryRank(safari: { location?: { country?: string; countries?: string[] } }): number {
  const primary = (safari.location?.countries?.[0] ?? safari.location?.country ?? "").toLowerCase();
  const idx = COUNTRY_ORDER.indexOf(primary);
  return idx === -1 ? COUNTRY_ORDER.length : idx;
}

/**
 * Fetches the top-N safaris exactly as before (ranked by `secondarySort`,
 * uncapped by country), then sorts that already-selected set Kenya -> Tanzania
 * -> Uganda -> Rwanda -> other for display. Country never influences which
 * safaris make the cut — only the order they're shown in. For direct
 * server-side use (homepage, /destinations, /safari-types/[type]) — not
 * paginated, just a top-N pull.
 */
export async function getCountryOrderedSafaris(
  match: Record<string, unknown>,
  options: { limit: number; select: string; secondarySort?: SortQuery },
): Promise<Safari[]> {
  await connectDB();
  const { limit, select, secondarySort = { rating: -1, reviewCount: -1 } } = options;

  const safaris = await SafariModel.find(match)
    .sort(secondarySort)
    .limit(limit)
    .select(select)
    .lean();

  const ordered = [...safaris].sort((a, b) => countryRank(a) - countryRank(b));

  return JSON.parse(JSON.stringify(ordered));
}

/**
 * Shared safari-listing query, used directly by server components (for SSR)
 * and by /api/safaris (for client-side filtering) so both stay in sync.
 */
export async function getSafarisList(
  filters: SafariFilters & { activeOnly?: boolean } = {},
): Promise<PaginatedResponse<Safari>> {
  await connectDB();

  const {
    search,
    category,
    safariType,
    difficulty,
    featured,
    country,
    minDays,
    maxDays,
    sort = "rating",
    page = 1,
    limit = 12,
    balanced,
    activeOnly = true,
  } = filters;

  const query: Record<string, unknown> = {};
  if (activeOnly !== undefined) query.active = activeOnly;
  if (featured !== undefined) query.featured = featured;
  if (category) query.category = category;
  if (safariType) query.safariType = safariType;
  if (difficulty) query.difficulty = difficulty;
  if (country === "cross") {
    query.$expr = { $gt: [{ $size: { $ifNull: ["$location.countries", []] } }, 1] };
  } else if (country) {
    query.$or = [
      { "location.country": { $regex: country, $options: "i" } },
      { "location.countries": { $regex: country, $options: "i" } },
    ];
  }
  if (minDays || maxDays) {
    query.duration = {};
    if (minDays) (query.duration as Record<string, number>).$gte = minDays;
    if (maxDays) (query.duration as Record<string, number>).$lte = maxDays;
  }
  if (search) query.$text = { $search: search };

  const sortQuery: SortQuery = SORT_MAP[sort] ?? SORT_MAP.rating;

  // Default ("Featured") sort groups results Kenya → Tanzania → Uganda →
  // Rwanda → other before falling back to rating, instead of whatever
  // order MongoDB happens to return. The paginated /safaris catalogue relies
  // on this full grouping (page through Kenya, then Tanzania, etc).
  //
  // `balanced` is for capped, non-paginated preview lists (homepage sections,
  // etc) where grouping would let a country with more inventory than `limit`
  // crowd every other country out entirely — those round-robin instead.
  let safaris;
  if (sort === "rating" && balanced) {
    const candidates = await SafariModel.aggregate([
      { $match: query },
      { $addFields: { __countryRank: COUNTRY_RANK_FIELD } },
      { $sort: { __countryRank: 1, rating: -1, reviewCount: -1 } },
      {
        $project: {
          ...Object.fromEntries(SELECT_FIELDS.split(" ").map((f) => [f, 1])),
          __countryRank: 1,
        },
      },
    ]);
    safaris = selectCountryBalanced(candidates, limit);
    for (const doc of safaris) delete (doc as Record<string, unknown>).__countryRank;
  } else if (sort === "rating") {
    safaris = await SafariModel.aggregate([
      { $match: query },
      { $addFields: { __countryRank: COUNTRY_RANK_FIELD } },
      { $sort: { __countryRank: 1, rating: -1, reviewCount: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: Object.fromEntries(SELECT_FIELDS.split(" ").map((f) => [f, 1])) },
    ]);
  } else {
    safaris = await SafariModel.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(SELECT_FIELDS)
      .lean();
  }

  const total = await SafariModel.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: JSON.parse(JSON.stringify(safaris)),
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
