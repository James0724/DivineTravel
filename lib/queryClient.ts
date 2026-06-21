import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * One QueryClient per server request (deduped via React's cache()), used to
 * prefetch data in Server Components and dehydrate it into a
 * HydrationBoundary for the client QueryClientProvider to pick up. Mirrors
 * the staleTime in app/providers.tsx so SSR'd data isn't immediately
 * considered stale and refetched on mount.
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
        },
      },
    }),
);
