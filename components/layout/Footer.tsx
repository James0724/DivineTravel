import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  return (
    <footer className="bg-bone-forest text-bone-paper">
      <div className="container-site pt-24 pb-12">
        {/* ── CTA band ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end pb-24 border-b border-[rgba(244,239,226,0.18)]">
          <Reveal variant="fadeUp">
            <h2
              className="font-serif font-light leading-[0.98] tracking-[-0.025em]"
              style={{ fontSize: "clamp(48px, 6vw, 88px)", maxWidth: "16ch" }}
            >
              Let us walk this journey with you — into the wild, into{" "}
              <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>wonder</em>.
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.12}>
            <div>
              <p className="text-[14px] leading-[1.7] opacity-[0.78] max-w-[38ch]">
                Your safari is not just a vacation — it&apos;s a life story
                waiting to be written. Request a free custom safari quote now —
                fast response guaranteed.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3.5 mt-6 px-6 py-4 rounded-full text-[14px] text-bone-ink transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "#f4efe2" }}
              >
                Request a free quote
                <span
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] text-white flex-shrink-0"
                  style={{ background: "#9d4519" }}
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── Footer grid: 4 cols ────────────────────────────── */}
        <Reveal variant="fadeUp" delay={0.08}>
          <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-12 pt-14">
            {/* Brand — spans 2 on mobile, 1 on desktop */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3.5 mb-[18px]">
                <div className="overflow-hidden rounded h-14 bg-bone-paper/10 p-1 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Divine Travel Nest Safaris"
                    width={56}
                    height={56}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <span className="font-serif text-[22px] italic text-bone-paper leading-tight">
                  Divine · Travel Nest
                </span>
              </div>
              <p className="text-[14px] leading-[1.6] opacity-70 max-w-[38ch]">
                Divine Travel Nest Safaris offers Kenya safari tours, Tanzania
                safaris, combined Kenya/Tanzania safari packages and Uganda tours
                — start your African journey with us today.
              </p>
            </div>

            {/* Tours & Safaris */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-55 font-medium mb-[18px]">
                Tours &amp; Safaris
              </h4>
              <ul>
                {[
                  { label: "Kenya safaris", href: "/safaris/kenya" },
                  { label: "Tanzania safaris", href: "/safaris/tanzania" },
                  {
                    label: "Kenya–Tanzania",
                    href: "/safaris/cross-country-safaris",
                  },
                  { label: "Uganda gorilla trekking", href: "/safaris/uganda" },
                  { label: "Nairobi day tours", href: "/safaris/kenya" },
                ].map((l, i) => (
                  <li key={i + l.href}>
                    <Link
                      href={l.href}
                      className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discover Africa */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-55 font-medium mb-[18px]">
                Discover Africa
              </h4>
              <ul>
                {[
                  { label: "Specialized safaris", href: "/safaris" },
                  { label: "Family-friendly", href: "/safaris?style=family" },
                  {
                    label: "Honeymoon safaris",
                    href: "/safaris?style=honeymoon",
                  },
                  {
                    label: "Photography safaris",
                    href: "/safaris?style=photography",
                  },
                  {
                    label: "Great Migration",
                    href: "/destinations/kenya#park-mara",
                  },
                  { label: "Field Journal", href: "/blog" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reach us */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-55 font-medium mb-[18px]">
                Reach us
              </h4>
              <ul>
                <li>
                  <a
                    href="tel:+254722595916"
                    className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors"
                  >
                    +254 722-595-916
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@divinetravelnestsafaris.com"
                    className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors break-all sm:break-normal"
                  >
                    info@divinetravelnestsafaris.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors"
                  >
                    TripAdvisor ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://share.google/hr0uDk89EOkgVPDGh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[14px] py-1.5 opacity-85 hover:text-[#f4d4a8] hover:opacity-100 transition-colors"
                  >
                    Google Reviews ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div className="mt-16 pt-6 border-t border-[rgba(244,239,226,0.12)] flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
          <span>
            © {new Date().getFullYear()} Divine Travel Nest Safaris · Nairobi,
            Kenya
          </span>
          <span>KWS · Eco-Tourism Kenya · TripAdvisor · SafariBookings</span>
        </div>
      </div>
    </footer>
  );
}
