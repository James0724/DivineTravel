import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions | Divine Travel Nest Safaris",
  description:
    "Read the Terms and Conditions governing safari bookings with Divine Travel Nest Safaris Ltd — covering payments, cancellations, liability, and your rights as a client.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "definitions", label: "Definitions" },
  { id: "booking", label: "Booking & Reservations" },
  { id: "payment", label: "Payment Terms" },
  { id: "cancellation-client", label: "Cancellation by Client" },
  { id: "cancellation-company", label: "Cancellation by Company" },
  { id: "insurance", label: "Travel Insurance" },
  { id: "itinerary", label: "Itinerary Changes" },
  { id: "health", label: "Health & Fitness" },
  { id: "wildlife", label: "Wildlife & Safety" },
  { id: "liability", label: "Liability" },
  { id: "force-majeure", label: "Force Majeure" },
  { id: "complaints", label: "Complaints" },
  { id: "privacy", label: "Privacy & Data" },
  { id: "photography", label: "Photography & Media" },
  { id: "governing-law", label: "Governing Law" },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Terms & Conditions", href: "/terms" },
        ]}
      />

      <PageHero
        image="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=75"
        imageAlt="Savannah at golden hour, East Africa"
        minHeight="min-h-[44vh]"
        imageOpacity={0.28}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms" },
        ]}
        eyebrow="Legal"
        title={
          <>
            Terms &amp;{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              Conditions
            </em>
          </>
        }
        description="Please read these terms carefully before making a booking. They form the contract between you and Divine Travel Nest Safaris Ltd."
      />

      {/* ── Main content area ──────────────────────────────────────────── */}
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
                    <Link
                      href="/contact"
                      className="text-bone-clay hover:underline"
                    >
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Right: Terms content ─────────────────────────────────── */}
            <div className="min-w-0">

              {/* Preamble */}
              <Reveal variant="fadeUp">
                <div className="mb-14 pb-14 border-b" style={{ borderColor: "rgba(31,29,24,0.14)" }}>
                  <div
                    className="bg-bone-paper rounded-sm px-7 py-6"
                    style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    <p className="font-serif italic text-[19px] leading-[1.55] text-bone-ink">
                      These Terms and Conditions govern all bookings made with
                      Divine Travel Nest Safaris Ltd (registered in Kenya).
                      Making a booking constitutes your acceptance of these
                      terms in full, on behalf of yourself and all passengers
                      listed on the booking.
                    </p>
                    <p className="text-[14px] text-bone-muted mt-3 leading-[1.7]">
                      We recommend you retain a copy of this document for
                      reference throughout your trip.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* 01 — Acceptance of Terms */}
              <TermsSection id="acceptance" number="01" heading="Acceptance of Terms">
                <p>
                  By submitting a booking enquiry, paying a deposit, or
                  otherwise confirming a safari with Divine Travel Nest Safaris
                  Ltd, you acknowledge that you have read, understood, and
                  unconditionally agree to be bound by these Terms and
                  Conditions. If you do not agree, you must not proceed with a
                  booking.
                </p>
                <p>
                  The person making the booking accepts these terms on behalf of
                  all other members of the travelling party, and accepts
                  responsibility for ensuring all members are aware of and agree
                  to these conditions.
                </p>
              </TermsSection>

              {/* 02 — Definitions */}
              <TermsSection id="definitions" number="02" heading="Definitions">
                <p>Throughout these Terms and Conditions:</p>
                <TermsList items={[
                  { term: "\"Company\"", desc: "means Divine Travel Nest Safaris Ltd, its employees, directors, agents, and representatives." },
                  { term: "\"Client\" / \"You\"", desc: "means the person or persons who submit a booking enquiry, pay a deposit, or travel on a safari arranged by the Company." },
                  { term: "\"Safari\" / \"Tour\"", desc: "means any travel service, package, itinerary, accommodation, or activity arranged or sold by the Company." },
                  { term: "\"Booking\"", desc: "means a confirmed reservation of a safari following receipt of the required deposit and the Company's written confirmation." },
                  { term: "\"Departure Date\"", desc: "means the first day of the safari as confirmed in the booking documentation." },
                  { term: "\"Written notice\"", desc: "means communication by email to the address confirmed in the booking documents." },
                ]} />
              </TermsSection>

              {/* 03 — Booking & Reservations */}
              <TermsSection id="booking" number="03" heading="Booking & Reservations">
                <p>
                  A booking is considered confirmed only upon receipt of the
                  required deposit payment and issuance of a written booking
                  confirmation by the Company. Verbal agreements or provisional
                  holds do not constitute confirmed bookings.
                </p>
                <p>
                  All passengers must be named at the time of booking. The lead
                  client is responsible for providing accurate passenger
                  information, including full legal names as they appear on
                  passports, nationalities, and any relevant medical disclosures.
                </p>
                <p>
                  The Company reserves the right to decline any booking at its
                  discretion, in which case any amounts paid will be refunded in
                  full.
                </p>
                <p>
                  Bookings made by third-party agents or platforms are subject to
                  these Terms and Conditions in addition to any platform-specific
                  terms.
                </p>
              </TermsSection>

              {/* 04 — Payment Terms */}
              <TermsSection id="payment" number="04" heading="Payment Terms">
                <p>
                  A non-refundable deposit of <strong>30% of the total safari
                  cost</strong> is required to confirm a booking. The remaining
                  balance is due no later than <strong>60 days before the
                  Departure Date</strong>.
                </p>
                <p>
                  For bookings made within 60 days of the Departure Date, the
                  full safari cost is payable at the time of booking.
                </p>
                <p>
                  Payments may be made via:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Bank transfer (USD, EUR, GBP, or KES)" },
                  { desc: "M-Pesa (Kenya domestic payments)" },
                  { desc: "Credit or debit card (subject to a 3% processing fee)" },
                  { desc: "Other methods as agreed in writing with the Company" },
                ]} />
                <p>
                  Where payment is made in a currency other than the quoted
                  currency, the exchange rate applied will be that on the date
                  the payment is received. Any bank charges or transfer fees are
                  the sole responsibility of the Client.
                </p>
                <p>
                  Failure to make payment by the due date may result in the
                  booking being released and the deposit forfeited. The Company
                  will provide written notice before cancelling a booking for
                  non-payment.
                </p>
              </TermsSection>

              {/* 05 — Cancellation by Client */}
              <TermsSection id="cancellation-client" number="05" heading="Cancellation by Client">
                <p>
                  All cancellations must be received in writing by email. The
                  date of cancellation is the date the written notice is received
                  by the Company. The following cancellation charges apply:
                </p>

                <div
                  className="my-6 rounded-sm overflow-hidden"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="bg-bone-paper">
                        <th
                          className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted border-b"
                          style={{ borderColor: "rgba(31,29,24,0.1)" }}
                        >
                          Days before departure
                        </th>
                        <th
                          className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted border-b"
                          style={{ borderColor: "rgba(31,29,24,0.1)" }}
                        >
                          Cancellation charge
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { period: "More than 90 days", charge: "Deposit only (30%)" },
                        { period: "61 – 90 days", charge: "50% of total cost" },
                        { period: "31 – 60 days", charge: "75% of total cost" },
                        { period: "30 days or fewer", charge: "100% of total cost" },
                        { period: "No-show / early departure", charge: "100% of total cost" },
                      ].map((row, i, arr) => (
                        <tr key={row.period} className="bg-bone-bg">
                          <td
                            className="px-5 py-3.5 text-bone-ink"
                            style={{
                              borderBottom: i < arr.length - 1
                                ? "1px solid rgba(31,29,24,0.08)"
                                : undefined,
                            }}
                          >
                            {row.period}
                          </td>
                          <td
                            className="px-5 py-3.5 font-medium text-bone-clay"
                            style={{
                              borderBottom: i < arr.length - 1
                                ? "1px solid rgba(31,29,24,0.08)"
                                : undefined,
                            }}
                          >
                            {row.charge}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p>
                  No refunds are provided for unused portions of a safari,
                  including meals, activities, or accommodation not utilised due
                  to voluntary early departure or late arrival.
                </p>
                <p>
                  The Company strongly recommends that all clients purchase
                  comprehensive travel insurance, including trip cancellation
                  cover, to protect against unforeseen cancellation losses.
                </p>
              </TermsSection>

              {/* 06 — Cancellation by Company */}
              <TermsSection id="cancellation-company" number="06" heading="Cancellation by Company">
                <p>
                  The Company reserves the right to cancel a safari in the
                  following circumstances:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "A minimum group size required to operate the tour has not been reached, with at least 45 days' notice given to the Client." },
                  { desc: "Safety conditions, political instability, natural disasters, or other circumstances make the safari unsafe or impractical to operate." },
                  { desc: "Force majeure events as described in Section 12." },
                ]} />
                <p>
                  Where the Company cancels a safari for reasons other than force
                  majeure, the Client will receive a <strong>full refund</strong> of
                  all amounts paid to the Company. The Company will also use
                  reasonable endeavours to offer an alternative safari of equal
                  value and quality.
                </p>
                <p>
                  The Company's liability is limited to a refund of the amounts
                  paid. No compensation is payable for consequential losses such
                  as airline tickets, visas, or other travel arrangements booked
                  independently by the Client.
                </p>
              </TermsSection>

              {/* 07 — Travel Insurance */}
              <TermsSection id="insurance" number="07" heading="Travel Insurance">
                <p>
                  Comprehensive travel insurance is <strong>strongly recommended</strong> for
                  all clients and may be required as a condition of participation
                  in certain activities, particularly gorilla trekking, mountain
                  hiking, and remote wilderness expeditions.
                </p>
                <p>
                  At minimum, your travel insurance should include cover for:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Medical expenses and hospitalisation" },
                  { desc: "Emergency medical evacuation (including helicopter evacuation)" },
                  { desc: "Trip cancellation, interruption, and curtailment" },
                  { desc: "Baggage loss, theft, and delay" },
                  { desc: "Personal liability" },
                ]} />
                <p>
                  The Company will not be held responsible for any loss, cost, or
                  damage that would have been covered by adequate travel
                  insurance. Proof of insurance may be requested prior to
                  departure.
                </p>
              </TermsSection>

              {/* 08 — Itinerary Changes */}
              <TermsSection id="itinerary" number="08" heading="Itinerary Changes">
                <p>
                  While the Company makes every effort to operate safaris as
                  planned, itineraries are subject to change due to weather
                  conditions, road closures, park regulations, wildlife patterns,
                  accommodation availability, or safety considerations. These
                  variations are an inherent part of wildlife travel in Africa.
                </p>
                <p>
                  Where a significant change to a confirmed itinerary is
                  necessary before departure, the Company will notify the Client
                  as soon as practicable and offer:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "An alternative of equivalent or greater standard and value, or" },
                  { desc: "A partial refund where a significant downgrade in accommodation or activities occurs." },
                ]} />
                <p>
                  Minor changes — including substitution of lodges with
                  comparable alternatives, adjusted driving routes, or modified
                  game drive timings — do not constitute significant changes and
                  do not entitle the Client to a refund or compensation.
                </p>
                <p>
                  Requests by the Client to alter a confirmed booking (dates,
                  destinations, or number of passengers) will be accommodated
                  where possible, subject to availability and any applicable
                  supplier amendment fees.
                </p>
              </TermsSection>

              {/* 09 — Health & Fitness */}
              <TermsSection id="health" number="09" heading="Health & Fitness Requirements">
                <p>
                  The Client is solely responsible for ensuring that all members
                  of the travelling party are in a suitable state of health and
                  physical fitness to participate in the chosen safari activities.
                </p>
                <p>
                  Certain activities have specific requirements:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Gorilla and chimpanzee trekking: minimum age of 15 years; involves hiking 2–8 km in mountainous terrain at altitude." },
                  { desc: "Walking safaris: moderate fitness required; not recommended for those with mobility impairments." },
                  { desc: "Hot air balloon safaris: weight restrictions apply as specified by the balloon operator." },
                ]} />
                <p>
                  The Company must be informed in writing, prior to booking
                  confirmation, of any pre-existing medical condition, disability,
                  pregnancy, or dietary requirement that may affect participation.
                  The Company may require a medical certificate of fitness for
                  certain activities.
                </p>
                <p>
                  A yellow fever vaccination certificate is required for entry to
                  Uganda and may be required by Kenya and Tanzania depending on
                  your country of origin or prior travel. It is the Client's
                  responsibility to obtain all required vaccinations and health
                  documentation. The Company recommends consulting a travel health
                  clinic at least 6–8 weeks before departure.
                </p>
                <p>
                  The Company reserves the right to exclude a participant from any
                  activity where a guide or medical professional reasonably
                  considers participation to be a risk to that person's health or
                  to other members of the group. No refund will be given in such
                  circumstances.
                </p>
              </TermsSection>

              {/* 10 — Wildlife & Safety */}
              <TermsSection id="wildlife" number="10" heading="Wildlife & Safety">
                <p>
                  Wildlife safaris take place in untamed natural environments
                  inhabited by wild animals. Such encounters are inherently
                  unpredictable and carry an element of risk that cannot be
                  eliminated entirely. By booking a safari with the Company, you
                  acknowledge and accept these risks.
                </p>
                <p>
                  All Clients must:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Follow the instructions of their guide at all times, including instructions to remain in the vehicle, maintain silence, or leave an area." },
                  { desc: "Refrain from feeding, touching, or provoking wildlife." },
                  { desc: "Adhere to all park and conservancy rules and regulations." },
                  { desc: "Not consume alcohol to excess before or during any activity that may compromise safety." },
                ]} />
                <p>
                  The Company will not be liable for any injury, death, loss, or
                  damage resulting from a Client's failure to follow guide
                  instructions or park regulations. Any Client who wilfully
                  disregards safety instructions does so at their own risk.
                </p>
                <p>
                  Our driver-guides hold valid licences issued by the Kenya
                  Professional Safari Guides Association (KPSGA) and are trained
                  in wilderness first aid. However, emergency medical facilities
                  in remote areas may be limited, which underlines the importance
                  of comprehensive travel insurance including medical evacuation
                  cover.
                </p>
              </TermsSection>

              {/* 11 — Liability */}
              <TermsSection id="liability" number="11" heading="Liability">
                <p>
                  The Company acts in part as an agent for third-party service
                  providers, including but not limited to airlines, accommodation
                  providers, park authorities, and activity operators. The Company
                  is not liable for the acts, omissions, defaults, negligence, or
                  insolvency of any such third-party provider.
                </p>
                <p>
                  Where the Company is found to be directly liable for loss or
                  damage suffered by the Client, the Company's total liability
                  shall not exceed the total cost paid by the Client for the
                  safari giving rise to the claim.
                </p>
                <p>
                  The Company expressly excludes liability for:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Loss of enjoyment, distress, or disappointment arising from circumstances beyond the Company's reasonable control." },
                  { desc: "Consequential, indirect, or economic losses, including loss of earnings or costs of independently booked flights, visas, or accommodation." },
                  { desc: "Loss or theft of personal property, money, or equipment." },
                  { desc: "Injury, illness, or death caused by third-party service providers." },
                  { desc: "Any loss arising from the Client's failure to obtain adequate travel insurance." },
                ]} />
                <p>
                  Nothing in these Terms and Conditions excludes liability for
                  death or personal injury caused by the Company's own proven
                  negligence, nor any liability that cannot be excluded by law.
                </p>
              </TermsSection>

              {/* 12 — Force Majeure */}
              <TermsSection id="force-majeure" number="12" heading="Force Majeure">
                <p>
                  Neither the Company nor the Client shall be liable for any
                  failure or delay in performance arising from events beyond their
                  reasonable control, including but not limited to:
                </p>
                <TermsList variant="bullet" items={[
                  { desc: "Acts of God, natural disasters, or extreme weather events" },
                  { desc: "War, armed conflict, civil unrest, or acts of terrorism" },
                  { desc: "Government restrictions, border closures, or travel advisories" },
                  { desc: "Epidemic, pandemic, or public health emergencies" },
                  { desc: "Industrial action, strikes, or airport closures" },
                  { desc: "Park closures ordered by national park authorities" },
                ]} />
                <p>
                  In the event of force majeure, the Company will use its best
                  efforts to offer an alternative travel date or credit note of
                  equivalent value. Where no alternative is possible, refunds will
                  be considered on a case-by-case basis after deducting any
                  unrecoverable costs already incurred from suppliers.
                </p>
              </TermsSection>

              {/* 13 — Complaints */}
              <TermsSection id="complaints" number="13" heading="Complaints">
                <p>
                  The Company is committed to providing a high standard of
                  service. If any aspect of your safari falls short of your
                  expectations, we ask that you raise the concern with your guide
                  or Company representative immediately so that we have the
                  opportunity to resolve it during the trip.
                </p>
                <p>
                  If the matter is not resolved to your satisfaction during the
                  safari, a formal written complaint must be submitted by email to{" "}
                  <a
                    href="mailto:info@divinetravelnestsafaris.com"
                    className="text-bone-clay hover:underline"
                  >
                    info@divinetravelnestsafaris.com
                  </a>{" "}
                  within <strong>30 days of the final day of your safari</strong>.
                  Complaints received after this period may not be considered.
                </p>
                <p>
                  The Company will acknowledge receipt of a formal complaint
                  within 5 business days and provide a substantive response
                  within 28 days.
                </p>
              </TermsSection>

              {/* 14 — Privacy & Data */}
              <TermsSection id="privacy" number="14" heading="Privacy & Data">
                <p>
                  The Company collects personal information (including names,
                  passport details, contact information, and health disclosures)
                  for the sole purpose of administering your booking and
                  delivering the safari services purchased.
                </p>
                <p>
                  Your personal information will not be sold or shared with
                  unaffiliated third parties except where necessary to fulfil the
                  services booked (e.g., sharing passenger names with lodges,
                  park authorities, or transport providers).
                </p>
                <p>
                  By making a booking, you consent to the Company retaining your
                  contact information to send occasional service-related
                  communications. You may opt out of marketing communications at
                  any time by contacting us in writing.
                </p>
                <p>
                  The Company stores data securely and in accordance with
                  applicable Kenyan data protection legislation.
                </p>
              </TermsSection>

              {/* 15 — Photography & Media */}
              <TermsSection id="photography" number="15" heading="Photography & Media">
                <p>
                  The Company may photograph or film safari activities for
                  marketing, training, or record-keeping purposes. If you prefer
                  not to be featured in such materials, please notify the Company
                  in writing before your Departure Date and we will respect your
                  preference.
                </p>
                <p>
                  Clients are welcome to photograph and film wildlife and
                  landscapes for personal use. Photography of local people,
                  communities, or cultural sites should be conducted with
                  sensitivity and, where appropriate, with the permission of those
                  being photographed.
                </p>
                <p>
                  Commercial drone use and professional media production within
                  national parks require prior permits from the relevant park
                  authority and must be declared to the Company at the time of
                  booking.
                </p>
              </TermsSection>

              {/* 16 — Governing Law */}
              <TermsSection id="governing-law" number="16" heading="Governing Law" isLast>
                <p>
                  These Terms and Conditions are governed by and construed in
                  accordance with the laws of the Republic of Kenya. Any dispute
                  arising out of or in connection with these terms shall be
                  subject to the exclusive jurisdiction of the courts of Kenya.
                </p>
                <p>
                  In the event of a dispute, both parties agree to first attempt
                  resolution through good-faith negotiation. If negotiation fails,
                  either party may refer the matter to mediation before initiating
                  formal legal proceedings.
                </p>
                <p>
                  The Company reserves the right to amend these Terms and
                  Conditions at any time. The version in force at the date of
                  booking confirmation shall apply to that booking. Current terms
                  are always published on our website at{" "}
                  <Link href="/terms" className="text-bone-clay hover:underline">
                    divinetravelnestsafaris.com/terms
                  </Link>
                  .
                </p>

                {/* Contact box */}
                <div
                  className="mt-10 bg-bone-paper rounded-sm p-7"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-bone-clay mb-3">
                    Questions about these terms?
                  </span>
                  <p className="text-[15px] text-bone-ink leading-[1.65] mb-4">
                    Our team is happy to clarify anything in these conditions
                    before you book.
                  </p>
                  <div className="flex flex-wrap gap-4 text-[14px]">
                    <a
                      href="mailto:info@divinetravelnestsafaris.com"
                      className="text-bone-clay hover:underline"
                    >
                      info@divinetravelnestsafaris.com
                    </a>
                    <span className="text-bone-muted hidden sm:inline">·</span>
                    <a
                      href="tel:+254722595916"
                      className="text-bone-clay hover:underline"
                    >
                      +254 722-595-916
                    </a>
                    <span className="text-bone-muted hidden sm:inline">·</span>
                    <Link href="/contact" className="text-bone-clay hover:underline">
                      Send a message
                    </Link>
                  </div>
                </div>
              </TermsSection>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Local sub-components ─────────────────────────────────────────────── */

function TermsSection({
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
        className={`mb-14 pb-14 scroll-mt-8 ${
          !isLast ? "border-b" : ""
        }`}
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
        <div className="pl-9 space-y-4 text-[15px] leading-[1.75] text-bone-muted">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function TermsList({
  items,
  variant = "definition",
}: {
  items: { term?: string; desc: string }[];
  variant?: "definition" | "bullet";
}) {
  if (variant === "bullet") {
    return (
      <ul className="space-y-2 my-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex-shrink-0 mt-[0.6em] w-1 h-1 rounded-full bg-bone-clay"
              aria-hidden="true"
            />
            <span>{item.desc}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className="space-y-3 my-1">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4">
          <dt className="font-medium text-bone-ink">{item.term}</dt>
          <dd>{item.desc}</dd>
        </div>
      ))}
    </dl>
  );
}
