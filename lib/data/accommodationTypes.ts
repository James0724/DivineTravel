// Content map for the /accommodations index + /accommodations/[type] pages.
// `slug` is the URL-friendly plural form used in routes; `dbType` is the
// singular enum value stored on each Accommodation document — kept distinct
// rather than overloaded into one string.
//
// All translatable copy (label, descriptions, intro, whatToExpect,
// goodToKnow, faqs) lives in messages/<locale>/accommodations.json under
// `types.<slug>` — this file only holds locale-independent data (images).

import type { AccommodationType } from "@/types";

export interface AccommodationTypeConfig {
  slug: "luxury-lodges" | "tented-camps" | "beach-resorts";
  dbType: AccommodationType;
  heroImage: string;
}

export interface AccommodationTypeWhatToExpect {
  n: string;
  title: string;
  body: string;
}

export interface AccommodationTypeFaq {
  q: string;
  a: string;
}

export interface AccommodationTypeContent {
  label: string;
  shortLabel: string;
  heroImageAlt: string;
  heroDescription: string;
  cardDescription: string;
  intro: {
    headingBefore: string;
    headingHighlight: string;
    headingAfter: string;
    body: string;
  };
  whatToExpect: AccommodationTypeWhatToExpect[];
  goodToKnow: string[];
  faqs: AccommodationTypeFaq[];
}

export type LocalizedAccommodationType = AccommodationTypeConfig &
  AccommodationTypeContent;

export const ACCOMMODATION_TYPES: AccommodationTypeConfig[] = [
  {
    slug: "luxury-lodges",
    dbType: "luxury-lodge",
    heroImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "tented-camps",
    dbType: "tented-camp",
    heroImage:
      "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782116051/web_images/accomodations/pexels-reto-wiezel-3245195-18611231_wakswq.jpg?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "beach-resorts",
    dbType: "beach-resort",
    heroImage:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=80",
  },
];

export function getAccommodationType(
  slug: string,
): AccommodationTypeConfig | undefined {
  return ACCOMMODATION_TYPES.find((t) => t.slug === slug);
}
