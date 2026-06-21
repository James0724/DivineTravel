import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Community Guidelines | Divine Travel Nest Safaris",
  description:
    "Our Community Guidelines for travelling with Divine Travel Nest Safaris — respecting wildlife, local communities, fellow travellers, and our Field Journal community.",
  alternates: { canonical: "/guidelines" },
};

const sections = [
  { id: "who", label: "Who This Applies To" },
  { id: "wildlife", label: "Respecting Wildlife & Environment" },
  { id: "communities", label: "Respecting Local Communities" },
  { id: "group-etiquette", label: "Group Safari Etiquette" },
  { id: "lodge-conduct", label: "Lodge & Camp Conduct" },
  { id: "photography", label: "Photography & Sharing" },
  { id: "comments", label: "Journal Comments & Reviews" },
  { id: "safety", label: "Health, Safety & Guide Authority" },
  { id: "reporting", label: "Reporting a Concern" },
  { id: "updates", label: "Updates to These Guidelines" },
];

export default function GuidelinesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Community Guidelines", href: "/guidelines" },
        ]}
      />

      <PageHero
        image="https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Travellers on a guided safari in East Africa"
        minHeight="min-h-[44vh]"
        imageOpacity={0.28}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Community Guidelines", href: "/guidelines" },
        ]}
        eyebrow="Our Community"
        title={
          <>
            Community{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              Guidelines
            </em>
          </>
        }
        description="A short, plain-language guide to travelling responsibly with us — for the wildlife, the communities who host us, and everyone you'll share a safari with."
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 lg:gap-20 items-start">
            {/* ── Left: Table of contents ─────────────────────────────── */}
            <Reveal variant="fadeUp">
              <div
                className="lg:sticky lg:top-8 bg-bone-paper rounded-sm"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{ borderColor: "rgba(31,29,24,0.1)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-muted">
                    Contents
                  </span>
                </div>
                <nav className="px-6 py-4">
                  <ul className="space-y-0.5">
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="flex items-center gap-2.5 py-1.5 text-[13px] text-bone-muted hover:text-bone-ink transition-colors group"
                        >
                          <span className="font-mono text-[10px] text-bone-clay opacity-80 flex-shrink-0 w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {s.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div
                  className="px-6 py-4 border-t"
                  style={{ borderColor: "rgba(31,29,24,0.1)" }}
                >
                  <p className="text-[12px] text-bone-muted leading-[1.6]">
                    Last updated:{" "}
                    <span className="text-bone-ink font-medium">June 2026</span>
                  </p>
                  <p className="text-[12px] text-bone-muted mt-1 leading-[1.6]">
                    Questions?{" "}
                    <Link href="/contact" className="text-bone-clay hover:underline">
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Right: Guidelines content ─────────────────────────────── */}
            <div className="min-w-0">
              <Reveal variant="fadeUp">
                <div
                  className="mb-14 pb-14 border-b"
                  style={{ borderColor: "rgba(31,29,24,0.14)" }}
                >
                  <div
                    className="bg-bone-paper rounded-sm px-7 py-6"
                    style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    <p className="font-serif italic text-[19px] leading-[1.55] text-bone-ink">
                      A safari is a privilege — for us, for you, and for the
                      wildlife, parks and communities that make it possible.
                      These guidelines set out what we expect of everyone who
                      travels with Divine Travel Nest Safaris, and what you
                      can expect from us in return.
                    </p>
                  </div>
                </div>
              </Reveal>

              <GuideSection id="who" number="01" heading="Who This Applies To">
                <p>
                  These Community Guidelines apply to every guest travelling
                  on a Divine Travel Nest Safaris booking, to anyone
                  commenting on or interacting with our Field Journal, and to
                  our guides, drivers and partner lodges representing us in
                  the field.
                </p>
              </GuideSection>

              <GuideSection
                id="wildlife"
                number="02"
                heading="Respecting Wildlife & the Environment"
              >
                <p>We ask every guest to:</p>
                <GuideList
                  items={[
                    "Stay inside the vehicle or on the marked trail unless your guide says otherwise.",
                    "Never feed, touch or attempt to attract wildlife.",
                    "Keep noise low and avoid sudden movement near animals.",
                    "Carry out everything you carry in — no littering, ever.",
                    "Avoid flash photography near animals, and follow your guide's instructions on drones (most parks restrict or ban them entirely).",
                    "Stick to designated tracks — off-roading damages fragile habitats and is against park regulations.",
                  ]}
                />
              </GuideSection>

              <GuideSection
                id="communities"
                number="03"
                heading="Respecting Local Communities & Culture"
              >
                <p>
                  Many of our itineraries include visits to Maasai villages
                  and other local communities who generously welcome
                  travellers. Please:
                </p>
                <GuideList
                  items={[
                    "Always ask before photographing people, homes or ceremonies.",
                    "Dress and behave respectfully, taking cues from your guide on local norms.",
                    "Treat village visits as a cultural exchange, not a photo opportunity — ask questions, listen, and engage.",
                    "Tip and purchase crafts directly where invited to do so — it supports the community hosting you.",
                  ]}
                />
              </GuideSection>

              <GuideSection
                id="group-etiquette"
                number="04"
                heading="Group Safari Etiquette"
              >
                <p>
                  If you're sharing a vehicle with other travellers on a
                  group or joining safari:
                </p>
                <GuideList
                  items={[
                    "Be ready on time for game drives — a late start can cost the whole vehicle a sighting.",
                    "Share window seats and viewing space fairly during sightings.",
                    "Keep conversation at a respectful volume near wildlife.",
                    "Follow your guide's instructions — they're balancing everyone's safety and experience.",
                  ]}
                />
              </GuideSection>

              <GuideSection
                id="lodge-conduct"
                number="05"
                heading="Lodge & Camp Conduct"
              >
                <p>
                  Our partner lodges and camps are shared spaces, often
                  unfenced and close to wildlife. Please respect quiet hours
                  after dark, follow staff instructions about walking between
                  rooms at night, treat all staff with courtesy, and drink
                  responsibly.
                </p>
              </GuideSection>

              <GuideSection
                id="photography"
                number="06"
                heading="Photography & Sharing on Social Media"
              >
                <p>
                  We love seeing your safari photos. When sharing publicly,
                  please avoid geotagging sensitive locations such as
                  active anti-poaching zones or den sites, credit local
                  guides and communities where you can, and avoid captions
                  that misrepresent wild animals as tame or approachable —
                  it can encourage unsafe behaviour in others.
                </p>
              </GuideSection>

              <GuideSection
                id="comments"
                number="07"
                heading="Journal Comments & Reviews"
              >
                <p>
                  Our{" "}
                  <Link href="/journal" className="text-bone-clay hover:underline">
                    Field Journal
                  </Link>{" "}
                  is a space for genuine questions, stories and feedback.
                  When commenting or leaving a review, please:
                </p>
                <GuideList
                  items={[
                    "Keep it respectful — no harassment, hate speech or personal attacks.",
                    "Don't post spam, promotional links or unrelated content.",
                    "Don't share other people's personal information without consent.",
                    "Keep reviews honest and based on real experiences with us.",
                  ]}
                />
                <p>
                  Comments are moderated and we reserve the right to remove
                  any that breach these guidelines.
                </p>
              </GuideSection>

              <GuideSection
                id="safety"
                number="08"
                heading="Health, Safety & Guide Authority"
              >
                <p>
                  Your guide's instructions are given for your safety and the
                  safety of the wildlife — please follow them at all times,
                  even if a request seems overly cautious in the moment. Let
                  your guide know about any medical conditions, allergies or
                  mobility needs before the trip so we can plan around them.
                </p>
              </GuideSection>

              <GuideSection
                id="reporting"
                number="09"
                heading="Reporting a Concern"
              >
                <p>
                  If you witness behaviour from another guest, staff member
                  or guide that breaches these guidelines — or you simply
                  have a concern during your trip — please tell your guide
                  immediately or{" "}
                  <Link href="/contact" className="text-bone-clay hover:underline">
                    contact our team
                  </Link>
                  . We take every report seriously.
                </p>
              </GuideSection>

              <GuideSection
                id="updates"
                number="10"
                heading="Updates to These Guidelines"
                isLast
              >
                <p>
                  We may update these Community Guidelines from time to time
                  to reflect new park regulations, community feedback or
                  changes to our operations. The version published here is
                  always the current one.
                </p>
              </GuideSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GuideSection({
  id,
  number,
  heading,
  children,
  isLast = false,
}: {
  id: string;
  number: string;
  heading: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <Reveal variant="fadeUp">
      <section
        id={id}
        className={`mb-14 pb-14 scroll-mt-8 ${!isLast ? "border-b" : ""}`}
        style={!isLast ? { borderColor: "rgba(31,29,24,0.14)" } : undefined}
      >
        <div className="flex items-baseline gap-4 mb-5">
          <span className="font-mono text-[11px] text-bone-clay tracking-[0.1em] flex-shrink-0">
            {number}
          </span>
          <h2
            className="font-serif font-normal text-bone-ink leading-[1.1] tracking-[-0.015em]"
            style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
          >
            {heading}
          </h2>
        </div>
        <div className="pl-9 space-y-4 text-sm leading-[1.75] text-bone-muted">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function GuideList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="flex-shrink-0 mt-[0.6em] w-1 h-1 rounded-full bg-bone-clay"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
