import type { SafariFilters, PostCategory, DestinationFilters } from "@/types";

export interface PostFilters {
  search?: string;
  category?: PostCategory;
  sort?: "newest" | "oldest" | "featured";
  page?: number;
  limit?: number;
}

/**
 * Plain (non "use client") query-key builders shared between the client
 * hooks (useSafaris/usePosts) and server components that prefetch the same
 * queries for SSR. Keeping these out of the "use client" hook files matters:
 * importing a function from a "use client" module into a Server Component
 * gets you a client-reference proxy, not the real function — calling it
 * server-side throws "is not a function".
 */
export const safariKeys = {
  all: ["safaris"] as const,
  lists: () => [...safariKeys.all, "list"] as const,
  list: (filters: SafariFilters) => [...safariKeys.lists(), filters] as const,
  details: () => [...safariKeys.all, "detail"] as const,
  detail: (slug: string) => [...safariKeys.details(), slug] as const,
  featured: () => [...safariKeys.all, "featured"] as const,
};

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
};

export const destinationKeys = {
  all: ["destinations"] as const,
  lists: () => [...destinationKeys.all, "list"] as const,
  list: (filters: DestinationFilters) => [...destinationKeys.lists(), filters] as const,
  details: () => [...destinationKeys.all, "detail"] as const,
  detail: (slug: string) => [...destinationKeys.details(), slug] as const,
};
