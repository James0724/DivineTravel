import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import {
  SAFARI_TYPES,
  getSafariType,
  getSafariTypesByGroup,
  type SafariTypeConfig,
} from "@/lib/data/safariTypes";
import TwoQuestionsImage from "@/components/safari-types/TwoQuestionsImage";
import { AnimatedHeading } from "@/components/ui/Heading";
import SiteLink from "@/components/ui/SiteLink";

export const metadata: Metadata = {
  title:
    "Safari Types — Activity & Traveller Styles Compared | Divine Travel Nest Safaris",
  description:
    "Every style of East Africa safari, compared — by activity (walking, photographic, water-based, night, birding, wellness, conservation safaris) and by who you're travelling with (family, solo, small group, couple's, honeymoon, private).",
  keywords:
    "safari types, types of safari, photographic safari, walking safari, water based safari, night safari, birding safari, family safari, solo safari, small group safari, honeymoon safari, private safari east africa",
  alternates: { canonical: "/safari-types" },
  openGraph: {
    title: "Safari Types | Divine Travel Nest Safaris",
    description:
      "Every style of East Africa safari, compared — find the one that fits you.",
    type: "website",
  },
};

function TypeCard({
  t,
  priority,
}: {
  t: SafariTypeConfig;
  priority?: boolean;
}) {
  return (
    <RevealItem>
      <Link
        href={`/safari-types/${t.slug}`}
        className="group flex flex-col h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
      >
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ aspectRatio: "3/2" }}
        >
          <Image
            src={t.heroImage}
            alt={t.heroImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            priority={priority}
          />
        </div>
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-serif text-[20px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
            {t.label}
          </h3>
          <p className="text-[13px] leading-[1.6] text-bone-muted mb-5 line-clamp-3">
            {t.cardDescription}
          </p>
          <SiteLink
            href={`/safari-types/${t.slug}`}
            variant="ghost-mono"
            size="md"
            arrow
            className="flex-shrink-0"
          >
            Explore
          </SiteLink>
        </div>
      </Link>
    </RevealItem>
  );
}

function GroupSection({
  eyebrow,
  textBefore,
  textAfter,
  highlightedText,
  description,
  types,
  bg,
}: {
  eyebrow: string;
  textBefore: string;
  textAfter?: string;
  highlightedText: string;
  description: string;
  types: SafariTypeConfig[];
  bg?: string;
}) {
  return (
    <section className={bg ?? "bg-bone-bg"} style={{ padding: "96px 0" }}>
      <div className="container-site">
        <div className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                {eyebrow}
              </div>
            </Reveal>

            {/* Heading — character pull-up */}
            <AnimatedHeading
              as="h2"
              textBefore={textBefore}
              highlightedText={highlightedText}
              textAfter={textAfter}
            />
          </div>
          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              {description}
            </p>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {types.map((t, i) => (
            <TypeCard key={t.slug} t={t} priority={i < 3} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default function SafariTypesIndexPage() {
  const activityTypes = getSafariTypesByGroup("activity");
  const travellerTypes = getSafariTypesByGroup("traveller");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Safari Types", href: "/safari-types" },
        ]}
      />
      <CollectionPageSchema
        name="Safari Types — Activity & Traveller Styles Compared"
        description="Every style of East Africa safari, compared — by activity and by who you're travelling with."
        url="https://divinetravelnestsafaris.com/safari-types"
        items={SAFARI_TYPES.map((t) => ({
          name: t.label,
          url: `https://divinetravelnestsafaris.com/safari-types/${t.slug}`,
          description: t.cardDescription,
        }))}
      />

      <PageHero
        image="https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Different styles of East Africa safari"
        minHeight="min-h-[48vh]"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Safari Types" }]}
        eyebrow="Find your style"
        title={
          <>
            Every way to{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>safari</em>.
          </>
        }
        description="There are two questions worth answering before anything else: what kind of safari experience do you want, and who are you travelling with? Together they shape almost every other decision — park, pace, vehicle and lodge."
      />
      <CtaBand
        variant="large"
        buttonHref="/contact"
        heading={
          <>
            Not sure which style is{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>right</em>?
          </>
        }
        description="Tell us about your group, budget and dream wildlife sightings — our team will recommend the activity and traveller style that fits, then build the itinerary around it."
        buttonText="Ask an expert"
      />

      {/* ── Understanding safari types ──────────────────────────────────── */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd border-b border-[rgba(31,29,24,0.14)] mb-14 pb-12 ">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  Two questions, one itinerary
                </div>
              </Reveal>
              <AnimatedHeading
                as="h1"
                textBefore=" There's no single "
                highlightedText="type"
                textAfter=" of safari."
              />
            </div>
            <Reveal>
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                We&apos;ve been the bridge between travellers and the African
                wild for over a decade. Here&apos;s what sets Divine Travel Nest
                Safaris apart.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-14">
            <Reveal variant="slideRight">
              <div>
                <p className="text-[16px] leading-[1.75] text-bone-muted mb-4">
                  Most safari companies talk as if there's one product — a
                  vehicle, a guide, a checklist of animals. In practice, what
                  actually shapes a trip is two separate decisions stacked on
                  top of each other: the kind of experience you want inside the
                  bush, and the kind of group you're travelling as.
                </p>
                <p className="text-[16px] leading-[1.75] text-bone-muted">
                  The first — activity type — covers everything from how you
                  physically move through a park (on foot, by 4x4, by boat, in
                  the air, after dark) to what you actually spend the day doing,
                  whether that's chasing the best light for a photograph,
                  slowing down for a spa afternoon, or riding along with a
                  conservation team. The second — traveller type — is about who
                  the itinerary is built around: solo, as a couple, with
                  children, or as a fully private group. Almost every package we
                  run is a combination of one or two from each list, not a
                  single box ticked.
                </p>
              </div>
            </Reveal>

            <TwoQuestionsImage />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal variant="fadeUp">
              <div
                className="h-full flex flex-col"
                style={{
                  padding: "32px",
                  background: "var(--bg)",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "var(--clay)" }}
                >
                  01 — Safari activity types
                </div>
                <h3 className="font-serif text-[24px] font-normal leading-tight text-bone-ink mb-3">
                  Safari your way
                </h3>
                <p className="text-[14px] leading-[1.65] text-bone-muted">
                  This is about <em>what you spend your time doing</em> — from
                  how you move through the bush (on foot, by 4x4, by boat, in
                  the air, after dark) to more purpose-driven days built around
                  photography, birding, conservation work or simply slowing
                  down. Most trips combine two or three activity types rather
                  than sticking to just one.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div
                className="h-full flex flex-col"
                style={{
                  padding: "32px",
                  background: "var(--bg)",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "var(--clay)" }}
                >
                  02 — Safari types by traveller
                </div>
                <h3 className="font-serif text-[24px] font-normal leading-tight text-bone-ink mb-3">
                  Who you're travelling with
                </h3>
                <p className="text-[14px] leading-[1.65] text-bone-muted">
                  This is about <em>who</em> the trip is built around — solo, as
                  a couple, with the kids, or as a private group. It shapes
                  pacing, vehicle exclusivity and the lodges we recommend.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <GroupSection
        eyebrow="Safari activity types"
        textBefore="Safari your "
        highlightedText="way"
        description="What you spend your time doing — from how you move through the bush (on foot, by vehicle, on water, in the air, after dark) to more purpose-driven days built around photography, birding, conservation or simply slowing down. Compare them below and combine as many as you like in one trip."
        types={activityTypes}
      />

      <GroupSection
        eyebrow="Safari types by traveller"
        textAfter="with?"
        textBefore="Who are you "
        highlightedText="travelling"
        description="The same parks and lodges, shaped around your group — solo, as a couple, with family, or fully private."
        types={travellerTypes}
        bg="bg-bone-paper"
      />

      {/* ── How they combine ────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  Putting it together
                </div>
              </Reveal>

              {/* Heading — character pull-up */}
              <AnimatedHeading
                as="h1"
                textBefore=" A few ways these "
                highlightedText="combine"
              />
            </div>
            <Reveal variant="fadeUp">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                Pick one activity type and one traveller type as a starting
                point — we'll build the rest of the itinerary, park selection
                and accommodation around that combination.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                activity: "walking",
                traveller: "family",
                note: "Gentle morning walks paired with family-paced game drives — ideal for curious older kids.",
              },
              {
                activity: "photographic",
                traveller: "private",
                note: "A dedicated vehicle, no rush, and a guide who understands light, angles and timing.",
              },
              {
                activity: "conservation",
                traveller: "small-group",
                note: "Join a capped group ride-along with a research or ranger team, splitting the conservancy fee.",
              },
              {
                activity: "wellness",
                traveller: "honeymoon",
                note: "Fewer parks, longer stays, and a spa afternoon built into the schedule for two.",
              },
            ].map((combo) => {
              const a = getSafariType(combo.activity);
              const t = getSafariType(combo.traveller);
              if (!a || !t) return null;
              return (
                <RevealItem key={`${a.slug}-${t.slug}`}>
                  <div
                    className="flex flex-col h-full p-7"
                    style={{
                      background: "var(--paper)",
                      border: "1px solid rgba(31,29,24,0.14)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Link
                        href={`/safari-types/${a.slug}`}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 text-white transition-opacity hover:opacity-85"
                        style={{ background: "var(--clay, #9d4519)" }}
                      >
                        {a.shortLabel}
                      </Link>
                      <span className="text-bone-muted text-sm">+</span>
                      <Link
                        href={`/safari-types/${t.slug}`}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 text-white transition-opacity hover:opacity-85"
                        style={{ background: "var(--forest, #2a3a2a)" }}
                      >
                        {t.shortLabel}
                      </Link>
                    </div>
                    <p className="text-[14px] leading-[1.65] text-bone-muted">
                      {combo.note}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
