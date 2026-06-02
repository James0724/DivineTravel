import type { Metadata } from "next";
import { FaqSchema } from "@/components/seo/StructuredData";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import IntroSection from "@/components/home/IntroSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import SignaturePackages from "@/components/home/SignaturePackages";
import FeaturedSafaris from "@/components/home/FeaturedSafaris";
import BestSellers from "@/components/home/BestSellers";
import MigrationCalendar from "@/components/home/MigrationCalendar";
import PhotoMarquee from "@/components/home/PhotoMarquee";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StandOut from "@/components/home/StandOut";
import TailorMade from "@/components/home/TailorMade";
import TeamSection from "@/components/home/TeamSection";
import Testimonials from "@/components/home/Testimonials";
import JournalSection from "@/components/home/JournalSection";
import FAQSection from "@/components/home/FAQSection";
import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import TestimonialModel from "@/lib/db/models/Testimonial";
import type { Safari, Testimonial } from "@/types";

export const revalidate = 300; // ISR — revalidate every 5 minutes

export const metadata: Metadata = {
  title:
    "Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safari Tour Packages 2026/2027",
  description:
    "Divine Travel Nest Safaris offers Kenya safari tours, Tanzania safaris and combined Kenya/Tanzania safari packages, plus Uganda gorilla trekking — start your African journey today.",
  alternates: { canonical: "/" },
};

async function getHomeData() {
  try {
    await connectDB();
    const select =
      "name slug tagline location duration pricing images coverImage category difficulty featured rating reviewCount minGroupSize maxGroupSize";
    const [safaris, signatureSafaris, testimonials] = await Promise.all([
      SafariModel.find({ active: true, featured: true })
        .sort({ rating: -1 })
        .limit(6)
        .select(select)
        .lean(),
      SafariModel.find({ active: true })
        .sort({ rating: -1 })
        .limit(6)
        .select(select)
        .lean(),
      TestimonialModel.find({ featured: true })
        .sort({ rating: -1 })
        .limit(8)
        .lean(),
    ]);
    return {
      safaris: JSON.parse(JSON.stringify(safaris)) as Safari[],
      signatureSafaris: JSON.parse(
        JSON.stringify(signatureSafaris),
      ) as Safari[],
      testimonials: JSON.parse(JSON.stringify(testimonials)) as Testimonial[],
    };
  } catch {
    return { safaris: [], signatureSafaris: [], testimonials: [] };
  }
}

const HOME_FAQS = [
  {
    question: "When is the best time to visit Kenya for the Great Migration?",
    answer:
      "The most famous part of the Great Migration — the Mara River crossings — occurs from July to October when the herds are in the Masai Mara. January–February offers calving season in the southern Serengeti, while June–July features the dramatic Grumeti River crossings in Tanzania.",
  },
  {
    question: "How far in advance should I book a gorilla trekking permit?",
    answer:
      "Gorilla trekking permits in Uganda (Bwindi Impenetrable Forest) sell out months in advance, especially during peak season (July–September and December–January). We recommend booking at least 6 months ahead, and up to 12 months for peak season travel. We handle all permit applications on your behalf.",
  },
  {
    question: "What is included in a typical safari package?",
    answer:
      "A standard Divine Travel Nest Safaris package includes: park fees and conservation levies, all listed game drives and activities, accommodation (lodge or tented camp), full board (breakfast, lunch and dinner), airport and inter-park transfers, and an English-speaking licensed guide. International flights, travel insurance and personal gratuities are not included.",
  },
  {
    question: "Can you customise a safari for families with young children?",
    answer:
      "Absolutely — family safaris are one of our specialties. We select family-friendly lodges with dedicated children's programs, experienced child-friendly guides, and age-appropriate activities. Minimum age restrictions apply for certain activities (gorilla trekking requires guests to be 15+).",
  },
  {
    question:
      "What is the difference between a budget, mid-range and luxury safari?",
    answer:
      "Budget safaris use shared minibus vehicles and tented camps or basic lodges. Mid-range safaris offer private vehicles and comfortable lodge rooms with en-suite facilities. Luxury safaris feature exclusive-use vehicles, private guides, and world-class tented camps or lodges with exceptional service. All tiers include the same wildlife access and expert guiding.",
  },
  {
    question: "Do I need a visa and vaccinations for Kenya and Tanzania?",
    answer:
      "Most nationalities require a visa for Kenya and Tanzania, both available online via e-visa portals. Yellow Fever vaccination is mandatory if arriving from a yellow fever-endemic country. We strongly recommend consulting your travel health clinic at least 6–8 weeks before departure for current vaccination advice including malaria prophylaxis.",
  },
];

export default async function HomePage() {
  const { safaris, signatureSafaris, testimonials } = await getHomeData();

  return (
    <>
      <FaqSchema items={HOME_FAQS} />
      {/* 01 · Hero */}
      <Hero />

      {/* 02 · Trust / Accreditation strip */}
      <TrustStrip />

      {/* 03 · Welcome intro */}
      <IntroSection />

      {/* 04 · Destinations tabs */}
      <DestinationsSection />

      {/* 05 · Signature packages (DB-driven) */}
      <SignaturePackages initialData={signatureSafaris} />

      {/* 06 · Featured safari packages (DB-driven) */}
      <FeaturedSafaris initialData={safaris} />

      {/* 07 · Best-selling tours */}
      <BestSellers />

      {/* 08 · Migration calendar */}
      <MigrationCalendar />

      {/* 09 · Photo marquee strip */}
      <PhotoMarquee />

      {/* 10 · Why choose us */}
      <WhyChooseUs />

      {/* 11 · Stand-out features */}
      <StandOut />

      {/* 12 · Tailor-made safaris */}
      <TailorMade />

      {/* 13 · Team
      <TeamSection /> */}

      {/* 14 · Guest testimonials (DB-driven) */}
      <Testimonials initialData={testimonials} />

      {/* 15 · Journal / blog previews */}
      <JournalSection />

      {/* 16 · FAQ */}
      <FAQSection />
    </>
  );
}
