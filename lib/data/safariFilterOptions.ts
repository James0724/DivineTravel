/**
 * Plain (non "use client") filter-option constants shared between the
 * client filter UI (SafariFilterPanel) and server components that need the
 * same lookup table to mirror client-side query keys for SSR (see
 * app/(public)/safaris/page.tsx). Importing a value from a "use client"
 * module into a Server Component yields a client-reference proxy, not the
 * real value, so anything a server component needs has to live here.
 */
export const DURATIONS = [
  {
    label: "Any length",
    value: "",
    min: undefined as number | undefined,
    max: undefined as number | undefined,
  },
  { label: "1–3 days", value: "1-3", min: 1, max: 3 },
  { label: "4–7 days", value: "4-7", min: 4, max: 7 },
  { label: "8–14 days", value: "8-14", min: 8, max: 14 },
  { label: "15+ days", value: "15+", min: 15, max: undefined },
];
