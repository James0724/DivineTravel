import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import type { JournalPost, PaginatedResponse, PostCategory } from "@/types";

const AUTHOR_FIELDS = "name avatar title bio";

export interface PostListFilters {
  search?: string;
  category?: PostCategory;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "featured";
  includeUnpublished?: boolean;
}

type SortQuery = { [key: string]: 1 | -1 };

const SORT_MAP: Record<string, SortQuery> = {
  newest: { publishedAt: -1, createdAt: -1 },
  oldest: { publishedAt: 1, createdAt: 1 },
  featured: { featured: -1, publishedAt: -1 },
};

/**
 * Shared journal-listing query, used directly by server components (for SSR)
 * and by /api/posts (for client-side filtering) so both stay in sync.
 */
export async function getPostsList(
  filters: PostListFilters = {},
): Promise<PaginatedResponse<JournalPost>> {
  await connectDB();

  const {
    search,
    category,
    featured,
    page = 1,
    limit = 9,
    sort = "newest",
    includeUnpublished,
  } = filters;

  const query: Record<string, unknown> = {};
  if (!includeUnpublished) query.published = true;
  if (featured) query.featured = true;
  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const sortQuery: SortQuery = SORT_MAP[sort] ?? SORT_MAP.newest;

  const [posts, total] = await Promise.all([
    PostModel.find(query)
      .populate("author", AUTHOR_FIELDS)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-body")
      .lean(),
    PostModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: JSON.parse(JSON.stringify(posts)),
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
