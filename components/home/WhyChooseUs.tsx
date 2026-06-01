const cells = [
  {
    num: "i.",
    title: "Expert Local\nGuides",
    body: "Fluent naturalists with deep regional knowledge — turning every sighting into a story. Our guides hold professional safari guide certifications and have decades of field experience.",
  },
  {
    num: "ii.",
    title: "Tailor-Made\nItineraries",
    body: "From solo travelers to family groups, we craft each journey around your pace and interests. No two Divine Travel Nest safaris are ever identical.",
  },
  {
    num: "iii.",
    title: "Budget to\nLuxury",
    body: "Whether you choose a classic bush camp or an ultra-luxury tented lodge, you'll receive the same passionate service, wildlife access, and care.",
  },
  {
    num: "iv.",
    title: "No hidden \ncosts",
    body: "Quotes include park fees, accommodation, every meal, your vehicle, your guide and airport transfers. The only things we leave out are international flights and visas.",
  },
  {
    num: "v.",
    title: "Eco-Conscious\nTravel",
    body: "We partner with conservation projects and community wildlife programs. Every booking directly supports the landscapes that make your safari possible.",
  },
  {
    num: "vi.",
    title: "24/7\nSupport",
    body: "Our operations team is reachable around the clock — from the moment you first enquire to the day you return home safely.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 lg:py-[140px] bg-bone-bg">
      <div className="container-site">
        {/* Header */}
        <div className="section-hd">
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              Why Choose Us
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
              style={{ fontSize: "clamp(32px, 5.4vw, 76px)" }}
            >
              Africa with <em className="italic text-bone-clay">confidence</em>.
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] leading-[1.65] text-bone-muted max-w-[56ch]">
            We've been the bridge between travellers and the African wild for
            over a decade. Here's what sets Divine Travel Nest Safaris apart.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-b"
          style={{
            gap: "1px",
            background: "rgba(23,22,18,0.14)",
            borderColor: "rgba(23,22,18,0.14)",
          }}
        >
          {cells.map((c) => (
            <div
              key={c.num}
              className="flex flex-col gap-4 px-5 sm:px-7 lg:px-9 pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-12 lg:pb-14 bg-bone-bg"
            >
              <span className="font-serif italic text-[18px] text-bone-clay">
                {c.num}
              </span>
              <h3 className="font-serif font-normal text-[22px] sm:text-[26px] leading-[1.1] tracking-[-0.01em] text-bone-ink whitespace-pre-line">
                <em>{c.title}</em>
              </h3>
              <p className="text-[14px] leading-[1.65] text-bone-muted">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
