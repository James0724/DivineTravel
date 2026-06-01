import Link from "next/link"
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal"

const bestsellers = [
  {
    num: "01",
    title: "7-Day Masai Mara & Amboseli",
    route:
      "Nairobi → Masai Mara → Amboseli → Nairobi. Big Five, wildebeest herds & Kilimanjaro views.",
    href: "/safaris",
  },
  {
    num: "02",
    title: "10-Day Kenya–Tanzania Classic",
    route:
      "Masai Mara → Serengeti → Ngorongoro → Amboseli. The ultimate cross-border safari.",
    href: "/safaris",
  },
  {
    num: "03",
    title: "5-Day Gorilla Trekking Uganda",
    route:
      "Entebbe → Bwindi Impenetrable Forest → Queen Elizabeth NP. Mountain gorillas & tree-climbing lions.",
    href: "/safaris",
  },
  {
    num: "04",
    title: "14-Day East Africa Grand Tour",
    route:
      "Kenya + Tanzania + Uganda. Masai Mara, Serengeti, Bwindi — the full East Africa experience.",
    href: "/safaris",
  },
]

export default function BestSellers() {
  return (
    <section
      className="py-[120px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        {/* Header */}
        <Reveal>
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Most Booked Tours
              </div>
              <h2
                className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                Guest <em className="italic text-bone-clay">favourites</em>.
              </h2>
            </div>
            <p className="text-[15px] leading-[1.65] text-bone-muted max-w-[56ch]">
              These are our most-requested itineraries — handpicked by our team
              based on wildlife density, seasonal timing, and guest feedback.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestsellers.map((b) => (
            <RevealItem key={b.num}>
              <Link
                href={b.href}
                className="flex flex-col gap-3.5 p-7 bg-bone-bg border transition-all duration-300 hover:border-bone-clay hover:-translate-y-0.5 group h-full"
                style={{ borderColor: "rgba(23,22,18,0.14)" }}
              >
                <span className="font-serif italic text-[14px] text-bone-clay">
                  {b.num}
                </span>
                <h3 className="font-serif font-normal text-[26px] leading-[1.1] tracking-[-0.01em] text-bone-ink">
                  <em>{b.title}</em>
                </h3>
                <p className="text-[13px] leading-[1.5] text-bone-muted flex-1">
                  {b.route}
                </p>
                <span className="mt-auto font-mono text-[11px] uppercase tracking-[0.14em] text-bone-forest inline-flex items-center gap-1.5 group-hover:text-bone-clay transition-colors">
                  View itinerary →
                </span>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
